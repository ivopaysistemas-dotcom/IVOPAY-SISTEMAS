
import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import { generatePdfBlobUrl } from '../utils/pdfGenerator';
import ExpenseReportSheet from './ExpenseReportSheet';

interface ExpenseReportModalProps {
  expenses: Expense[];
  onClose: () => void;
}

// Componente separado para o conteúdo do relatório, para que possa ser passado para o gerador de PDF
const ReportContent = ({ expenses, startDate, endDate, category, total }) => (
  <ExpenseReportSheet 
    expenses={expenses} 
    startDate={startDate} 
    endDate={endDate} 
    category={category} 
    total={total}
  />
);

const ExpenseReportModal: React.FC<ExpenseReportModalProps> = ({ expenses, onClose }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const dateMatch = (!start || expenseDate >= start) && (!end || expenseDate <= end);
      const categoryMatch = category === 'all' || expense.category === category;

      return dateMatch && categoryMatch;
    });
  }, [expenses, startDate, endDate, category]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
  }, [filteredExpenses]);

  const handlePrint = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    const newWindow = window.open('', '_blank');
    newWindow.document.write('Gerando relatório... Por favor, aguarde.');

    try {
      const reportElement = <ReportContent expenses={filteredExpenses} startDate={startDate} endDate={endDate} category={category} total={totalExpenses} />;
      const url = await generatePdfBlobUrl(reportElement);
      newWindow.location.href = url;
    } catch (error) {
      console.error('Erro ao gerar PDF do relatório:', error);
      newWindow.document.body.innerHTML = `Falha ao gerar o PDF. Erro: ${error}`;
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Relatório de Despesas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 print:hidden">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input dark:bg-slate-700" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input dark:bg-slate-700" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="input dark:bg-slate-700">
            <option value="all">Todas as Categorias</option>
            <option value="mesa">Mesa</option>
            <option value="jukebox">Jukebox</option>
            <option value="grua">Grua</option>
            <option value="geral">Geral</option>
          </select>
        </div>

        <div id="expense-report-content" className="overflow-y-auto flex-grow">
           <ReportContent expenses={filteredExpenses} startDate={startDate} endDate={endDate} category={category} total={totalExpenses} />
        </div>

        <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 print:hidden">
          <button onClick={onClose} className="bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
            Fechar
          </button>
          <button onClick={handlePrint} disabled={isGenerating} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-400">
            {isGenerating ? 'Gerando...' : 'Imprimir Relatório'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReportModal;
