
import { useState, useEffect } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FolderPlus, Edit, Trash2, PieChart as PieChartIcon } from "lucide-react";
import Navbar from "../components/Navbar";

// Colors for charts
const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9'];

const Categories = () => {
  const { categories, expenses, addExpense } = useExpenses();
  const { user } = useAuth();
  
  // Category management state
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  
  // Category spending data
  const [categoryData, setCategoryData] = useState<any[]>([]);

  // Effect to calculate category data
  useEffect(() => {
    const categoryTotals: Record<string, number> = {};
    
    // Calculate total amount for each category
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    // Convert to chart data format
    const data = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setCategoryData(data);
  }, [expenses]);
  
  // Get recent expenses for a specific category
  const getRecentExpensesForCategory = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // Get only 5 most recent expenses
  };
  
  // Calculate total spending for a category
  const getCategoryTotal = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  // Demo functionality for adding a new category
  const handleAddCategory = () => {
    if (newCategory.trim() === "") return;
    
    // In a real app, this would call an API to add the category
    // For this demo, we'll just display a message
    alert(`Category "${newCategory}" would be added here.`);
    setNewCategory("");
    setIsAddingCategory(false);
  };
  
  // Demo functionality for editing a category
  const handleEditCategory = () => {
    if (editCategoryName.trim() === "" || !currentCategory) return;
    
    // In a real app, this would call an API to update the category
    // For this demo, we'll just display a message
    alert(`Category "${currentCategory}" would be renamed to "${editCategoryName}" here.`);
    setIsEditingCategory(false);
    setCurrentCategory("");
    setEditCategoryName("");
  };
  
  // Demo functionality for deleting a category
  const handleDeleteCategory = () => {
    if (!currentCategory) return;
    
    // In a real app, this would call an API to delete the category
    // For this demo, we'll just display a message
    alert(`Category "${currentCategory}" would be deleted here.`);
    setIsDeletingCategory(false);
    setCurrentCategory("");
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories</h1>
            <p className="text-gray-500">Manage your expense categories</p>
          </div>
          
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your expenses
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category Name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Transportation, Entertainment"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategory("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddCategory}
                  disabled={!newCategory.trim()}
                >
                  Add Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Spending distribution across categories</CardDescription>
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
                    <Tooltip 
                      formatter={(value) => {
                        return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Amount'];
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No data available</p>
                    <p className="text-sm mt-1">Add expenses to see category breakdown</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Category Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Category Stats</CardTitle>
              <CardDescription>Summary of your categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-500">Total Categories</p>
                  <p className="text-2xl font-bold">{categories.length}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Most Used Category</p>
                  <p className="text-2xl font-bold">
                    {categoryData.length > 0 ? categoryData[0].name : "None"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Highest Spending Category</p>
                  <p className="text-2xl font-bold">
                    {categoryData.length > 0 ? categoryData[0].name : "None"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {categoryData.length > 0 ? `$${categoryData[0].value.toFixed(2)}` : "$0.00"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Lowest Spending Category</p>
                  <p className="text-2xl font-bold">
                    {categoryData.length > 0 ? categoryData[categoryData.length - 1].name : "None"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {categoryData.length > 0 ? `$${categoryData[categoryData.length - 1].value.toFixed(2)}` : "$0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Category List */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              Manage and view details of each category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="space-y-6">
                {categories.map((category, index) => {
                  const total = getCategoryTotal(category);
                  const recentExpenses = getRecentExpensesForCategory(category);
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <h3 className="text-lg font-medium">{category}</h3>
                        </div>
                        
                        <div className="flex space-x-2 mt-2 md:mt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentCategory(category);
                              setEditCategoryName(category);
                              setIsEditingCategory(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => {
                              setCurrentCategory(category);
                              setIsDeletingCategory(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Total Spending</p>
                        <p className="text-xl font-semibold">${total.toFixed(2)}</p>
                      </div>
                      
                      {recentExpenses.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Recent Expenses</p>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {recentExpenses.map((expense) => (
                                <TableRow key={expense.id}>
                                  <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                                  <TableCell>{expense.description}</TableCell>
                                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <PieChartIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-1">No categories found</h3>
                <p>Add a new category to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditingCategory} onOpenChange={setIsEditingCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the name of this category
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditingCategory(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditCategory}
              disabled={!editCategoryName.trim()}
            >
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation */}
      <AlertDialog open={isDeletingCategory} onOpenChange={setIsDeletingCategory}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{currentCategory}" and may affect associated expenses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Categories;
