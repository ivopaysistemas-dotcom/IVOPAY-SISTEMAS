
import React from 'react';
import { Expense } from '../types';

interface ExpenseReportSheetProps {
  expenses: Expense[];
  startDate?: string;
  endDate?: string;
  category?: string;
  total: number;
}

const ExpenseReportSheet: React.FC<ExpenseReportSheetProps> = ({ expenses, startDate, endDate, category, total }) => {

  const formatCategory = (cat: string) => {
    if (cat === 'all' || !cat) return 'Todas';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-black dark:text-white p-8 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Relatório de Despesas</h1>
        <p className="text-md mt-2">
            Período de {startDate ? new Date(startDate).toLocaleDateString('pt-BR') : 'N/A'} a {endDate ? new Date(endDate).toLocaleDateString('pt-BR') : 'N/A'}
        </p>
        <p className="text-md">Categoria: {formatCategory(category)}</p>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-slate-200 dark:bg-slate-700">
            <th className="border p-2 text-left">Data</th>
            <th className="border p-2 text-left">Descrição</th>
            <th className="border p-2 text-left">Categoria</th>
            <th className="border p-2 text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="odd:bg-slate-50 dark:odd:bg-slate-800">
              <td className="border p-2">{new Date(expense.date).toLocaleDateString('pt-BR')}</td>
              <td className="border p-2">{expense.description}</td>
              <td className="border p-2">{formatCategory(expense.category)}</td>
              <td className="border p-2 text-right">R$ {expense.amount.toFixed(2)}</td>
            </tr>
          ))}
          {expenses.length === 0 && (
              <tr>
                  <td colSpan={4} className="text-center p-4">Nenhuma despesa encontrada para os filtros selecionados.</td>
              </tr>
          )}
        </tbody>
      </table>

      <div className="text-right mt-8 pr-2">
        <h2 className="text-2xl font-bold">Total Geral: R$ {total.toFixed(2)}</h2>
      </div>
    </div>
  );
};

export default ExpenseReportSheet;
