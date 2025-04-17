import { useEffect, useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, DollarSign, TrendingDown, TrendingUp, PlusCircle, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "../components/Navbar";

// Pie chart colors
const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    expenses, 
    categories, 
    addExpense,
    totalExpenses, 
    expensesByCategory, 
    monthlyExpenses 
  } = useExpenses();
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  
  const [recentExpenses, setRecentExpenses] = useState<typeof expenses>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; amount: number }[]>([]);

  useEffect(() => {
    // Set recent expenses (latest 5)
    setRecentExpenses(expenses.slice(0, 5));
    
    // Format data for pie chart
    const pieChartData = Object.entries(expensesByCategory).map(([name, value]) => ({
      name,
      value,
    }));
    setPieData(pieChartData);
    
    // Format data for bar chart (last 6 months)
    const sortedMonths = Object.entries(monthlyExpenses)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);
    
    const barChartData = sortedMonths.map(([month, amount]) => ({
      name: format(new Date(month), 'MMM'),
      amount,
    }));
    setBarData(barChartData);
  }, [expenses, expensesByCategory, monthlyExpenses]);

  const handleAddExpense = () => {
    const newExpense = {
      amount: parseFloat(amount),
      description,
      category,
      date: format(date, 'yyyy-MM-dd'),
    };
    
    addExpense(newExpense);
    setExpenseOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setCategory("");
    setDate(new Date());
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-soft">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-500">Here's an overview of your expenses</p>
          </div>
          
          <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details for your new expense
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-10"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Lunch, groceries, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setExpenseOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddExpense}
                  disabled={!amount || !description || !category}
                >
                  Add Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">
                  ${totalExpenses.toFixed(2)}
                </CardDescription>
              </div>
              <div className="bg-white/80 p-3 rounded-full">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>Updated today</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">Expenses This Month</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">
                  ${monthlyExpenses[format(new Date(), 'yyyy-MM')]?.toFixed(2) || "0.00"}
                </CardDescription>
              </div>
              <div className="bg-white/80 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                <span>For {format(new Date(), 'MMMM yyyy')}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card transition-shadow hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
                <CardDescription className="text-2xl font-bold text-gray-900">
                  {expenses.length}
                </CardDescription>
              </div>
              <div className="bg-white/80 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-600 flex items-center">
                <span>Total recorded expenses</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts and Recent Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="col-span-1 bg-white/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="font-playfair">Monthly Spending</CardTitle>
              <CardDescription>Your expenses over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            </CardContent>
          </Card>
          
          <Card className="col-span-1 bg-white/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-shadow">
            <CardHeader>
              <CardTitle className="font-playfair">Spending by Category</CardTitle>
              <CardDescription>Distribution of your expenses</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
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
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => {
                      return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Expenses */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader>
            <CardTitle className="font-playfair">Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentExpenses.length > 0 ? (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between border-b border-gray-100 pb-4 hover:bg-gray-50/50 rounded-lg transition-colors p-2">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-3">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category} • {format(new Date(expense.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">${expense.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
                <p className="text-gray-500">Add a new expense to get started</p>
              </div>
            )}
            
            {expenses.length > 5 && (
              <div className="mt-6 text-center">
                <Button variant="outline" asChild className="hover:bg-primary/5">
                  <a href="/expenses">View all expenses</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
