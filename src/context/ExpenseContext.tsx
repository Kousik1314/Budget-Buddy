
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  categories: string[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId'>) => void;
  updateExpense: (id: string, expense: Partial<Omit<Expense, 'id' | 'userId'>>) => void;
  deleteExpense: (id: string) => void;
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  monthlyExpenses: Record<string, number>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

const DEMO_CATEGORIES = [
  'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health', 'Education', 'Other'
];

// Demo data
const DEMO_EXPENSES: Expense[] = [
  {
    id: '1',
    userId: '1',
    amount: 45.50,
    description: 'Grocery shopping',
    category: 'Food',
    date: '2025-04-01'
  },
  {
    id: '2',
    userId: '1',
    amount: 30.00,
    description: 'Uber ride',
    category: 'Transport',
    date: '2025-04-03'
  },
  {
    id: '3',
    userId: '1',
    amount: 15.99,
    description: 'Netflix subscription',
    category: 'Entertainment',
    date: '2025-04-05'
  },
  {
    id: '4',
    userId: '1',
    amount: 89.30,
    description: 'Electricity bill',
    category: 'Utilities',
    date: '2025-04-10'
  },
  {
    id: '5',
    userId: '1',
    amount: 120.75,
    description: 'New shoes',
    category: 'Shopping',
    date: '2025-04-15'
  }
];

export const ExpenseProvider = ({ children }: ExpenseProviderProps) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<string[]>(DEMO_CATEGORIES);

  // Load expenses from localStorage when user changes
  useEffect(() => {
    if (user) {
      // For demo user, load demo data
      if (user.email === 'demo@example.com') {
        setExpenses(DEMO_EXPENSES);
        return;
      }
      
      const storedExpenses = localStorage.getItem(`expenses_${user.id}`);
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      } else {
        setExpenses([]);
      }
    } else {
      setExpenses([]);
    }
  }, [user]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (user && user.email !== 'demo@example.com' && expenses.length > 0) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  const addExpense = (expense: Omit<Expense, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      userId: user.id
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    toast.success("Expense added successfully");
  };

  const updateExpense = (id: string, expenseUpdate: Partial<Omit<Expense, 'id' | 'userId'>>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id 
          ? { ...expense, ...expenseUpdate } 
          : expense
      )
    );
    toast.success("Expense updated successfully");
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
    toast.success("Expense deleted successfully");
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Calculate monthly expenses
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    const month = expense.date.substring(0, 7); // YYYY-MM format
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        totalExpenses,
        expensesByCategory,
        monthlyExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
