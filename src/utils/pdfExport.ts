
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Expense } from '../context/ExpenseContext';

export const exportExpensesToPDF = (expenses: Expense[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(20);
  doc.text('Budget Buddy - Expense Report', 14, 22);
  
  // Add generation date
  doc.setFontSize(11);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, 32);

  // Prepare data for the table
  const tableData = expenses.map(expense => [
    format(new Date(expense.date), 'MMM dd, yyyy'),
    expense.description,
    expense.category,
    `$${expense.amount.toFixed(2)}`
  ]);

  // Calculate total
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Add the table
  autoTable(doc, {
    head: [['Date', 'Description', 'Category', 'Amount']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [155, 135, 245] },
    foot: [['Total', '', '', `$${total.toFixed(2)}`]],
    footStyles: { fillColor: [240, 240, 250] }
  });

  // Save the PDF
  doc.save('budget-buddy-expenses.pdf');
};
