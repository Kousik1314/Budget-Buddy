
import { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import Navbar from "../components/Navbar";

// Colors for charts
const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const Reports = () => {
  const { expenses, expensesByCategory } = useExpenses();
  const [timeFrame, setTimeFrame] = useState("last6Months");
  const [reportType, setReportType] = useState("summary");
  
  // Chart data states
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  
  // Filtered expenses based on selected time frame
  useEffect(() => {
    const now = new Date();
    let filteredExpenses = [];
    
    // Filter expenses based on time frame
    if (timeFrame === "last30Days") {
      const thirtyDaysAgo = subMonths(now, 1);
      filteredExpenses = expenses.filter(expense => 
        new Date(expense.date) >= thirtyDaysAgo && new Date(expense.date) <= now
      );
    } else if (timeFrame === "last3Months") {
      const threeMonthsAgo = subMonths(now, 3);
      filteredExpenses = expenses.filter(expense => 
        new Date(expense.date) >= threeMonthsAgo && new Date(expense.date) <= now
      );
    } else if (timeFrame === "last6Months") {
      const sixMonthsAgo = subMonths(now, 6);
      filteredExpenses = expenses.filter(expense => 
        new Date(expense.date) >= sixMonthsAgo && new Date(expense.date) <= now
      );
    } else if (timeFrame === "thisYear") {
      const thisYear = now.getFullYear();
      filteredExpenses = expenses.filter(expense => 
        new Date(expense.date).getFullYear() === thisYear
      );
    } else {
      filteredExpenses = [...expenses];
    }
    
    // Calculate monthly data
    const monthlyExpenses: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      const month = expense.date.substring(0, 7); // YYYY-MM format
      monthlyExpenses[month] = (monthlyExpenses[month] || 0) + expense.amount;
    });
    
    const monthlyChartData = Object.entries(monthlyExpenses)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({
        name: format(new Date(month), 'MMM yy'),
        amount,
      }));
    
    setMonthlyData(monthlyChartData);
    
    // Calculate category data
    const categoryTotals: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const categoryChartData = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
      }))
      .sort((a, b) => b.value - a.value);
    
    setCategoryData(categoryChartData);
    
    // Calculate trend data (last 6 months, showing cumulative)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      return {
        month: format(date, 'MMM yy'),
        date: date,
      };
    });
    
    const trendChartData = last6Months.map(({ month, date }) => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthlyTotal = filteredExpenses
        .filter(expense => {
          const expenseDate = new Date(expense.date);
          return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
        })
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        name: month,
        total: monthlyTotal,
      };
    });
    
    setTrendData(trendChartData);
  }, [expenses, timeFrame]);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-500">Visualize and analyze your spending patterns</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 w-full sm:w-auto">
            <Select value={timeFrame} onValueChange={setTimeFrame}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last30Days">Last 30 Days</SelectItem>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Report Tabs */}
        <Tabs defaultValue="summary" value={reportType} onValueChange={setReportType} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Spending */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Spending</CardTitle>
                  <CardDescription>Your expenses by month</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => {
                            return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                          }}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Distribution of your expenses</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => {
                          return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Spending Totals */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending Totals</CardTitle>
                  <CardDescription>Summary of your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm text-gray-500">Total Expenses</p>
                      <p className="text-2xl font-bold">
                        ${monthlyData.reduce((sum, { amount }) => sum + amount, 0).toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Average Monthly Expense</p>
                      <p className="text-2xl font-bold">
                        ${monthlyData.length > 0 
                          ? (monthlyData.reduce((sum, { amount }) => sum + amount, 0) / monthlyData.length).toFixed(2) 
                          : "0.00"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Highest Monthly Expense</p>
                      <p className="text-2xl font-bold">
                        ${monthlyData.length > 0 
                          ? Math.max(...monthlyData.map(({ amount }) => amount)).toFixed(2) 
                          : "0.00"}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Lowest Monthly Expense</p>
                      <p className="text-2xl font-bold">
                        ${monthlyData.length > 0 
                          ? Math.min(...monthlyData.map(({ amount }) => amount)).toFixed(2) 
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            <div className="grid grid-cols-1 gap-6">
              {/* Categories Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    {timeFrame === "last30Days" ? "Last 30 Days" : 
                    timeFrame === "last3Months" ? "Last 3 Months" : 
                    timeFrame === "last6Months" ? "Last 6 Months" : 
                    timeFrame === "thisYear" ? "This Year" : "All Time"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={categoryData} 
                        layout="vertical" 
                        margin={{ top: 10, right: 30, left: 80, bottom: 0 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip formatter={(value) => {
                          return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                        }} />
                        <Bar dataKey="value" fill="#9b87f5" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Categories Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Detailed view of your spending by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Percentage</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryData.map((category, index) => {
                          const total = categoryData.reduce((sum, c) => sum + c.value, 0);
                          const percentage = (category.value / total) * 100;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  <div 
                                    className="w-3 h-3 rounded-full mr-2" 
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                  {category.name}
                                </div>
                              </TableCell>
                              <TableCell>${category.value.toFixed(2)}</TableCell>
                              <TableCell>{percentage.toFixed(1)}%</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="grid grid-cols-1 gap-6">
              {/* Monthly Trend Line */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                  <CardDescription>See how your spending changes over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => {
                          return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                        }} />
                        <Line type="monotone" dataKey="total" stroke="#9b87f5" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Monthly Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Month-by-Month Comparison</CardTitle>
                  <CardDescription>Compare your spending across different months</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyData.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Total Spending</TableHead>
                          <TableHead>
                            {monthlyData.length > 1 ? "Change from Previous" : ""}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyData.map((month, index) => {
                          const prevMonth = index > 0 ? monthlyData[index - 1].amount : null;
                          const change = prevMonth !== null ? ((month.amount - prevMonth) / prevMonth) * 100 : null;
                          
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{month.name}</TableCell>
                              <TableCell>${month.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                {change !== null ? (
                                  <span className={change >= 0 ? "text-red-500" : "text-green-500"}>
                                    {change >= 0 ? "+" : ""}{change.toFixed(1)}%
                                  </span>
                                ) : ""}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No data available for the selected time period
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
