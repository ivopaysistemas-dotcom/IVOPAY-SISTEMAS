
import React, { useState } from 'react';
import { Customer } from '../types';
import CustomerSheet from './CustomerSheet';
import { generatePdfBlobUrl } from '../utils/pdfGenerator'; // Importa a função de gerar PDF

interface CustomerSheetPreviewProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerSheetPreview: React.FC<CustomerSheetPreviewProps> = ({ customer, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Função para gerar o PDF e abrir em uma nova guia
  const handlePrintToPdf = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    
    const newWindow = window.open('', '_blank');
    if (!newWindow) {
        alert('Não foi possível abrir uma nova guia. Verifique se os pop-ups estão bloqueados.');
        setIsGenerating(false);
        return;
    }
    newWindow.document.write('Gerando PDF para impressão... Por favor, aguarde.');

    try {
      const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
      newWindow.location.href = url;
    } catch (error) {
      console.error('Erro ao gerar PDF para impressão:', error);
      newWindow.document.body.innerHTML = `Falha ao gerar o PDF. Por favor, tente novamente. Erro: ${error}`;
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full h-full max-w-5xl mx-auto overflow-y-auto relative p-4 sm:p-6 print:p-0 print:shadow-none print:rounded-none print:w-auto print:h-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* -- Controles de Impressão e Fechamento -- */}
        <div className="absolute top-2 right-2 flex gap-2 z-10 print:hidden">
            <button 
                onClick={handlePrintToPdf} 
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-wait"
                aria-label="Imprimir Ficha"
            >
                {isGenerating ? 'Gerando...' : 'Imprimir'}
            </button>
            <button
              onClick={onClose}
              className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        {/* -- Componente da Ficha do Cliente -- */}
        <div className="@media print:block">
          <CustomerSheet customer={customer} />
        </div>
      </div>
    </div>
  );
};

export default CustomerSheetPreview;
