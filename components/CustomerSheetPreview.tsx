
import React, { useState } from 'react';
import { Customer } from '../types';
import CustomerSheet from './CustomerSheet';
import { generatePdfBlobUrl } from '../utils/pdfGenerator';

interface CustomerSheetPreviewProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerSheetPreview: React.FC<CustomerSheetPreviewProps> = ({ customer, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para gerar o PDF e iniciar o download direto
  const handleDownloadPdf = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    console.log('Iniciando o download do PDF...');

    try {
      console.log('Gerando PDF para download...');
      const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
      const response = await fetch(url);
      const blob = await response.blob();
      console.log('PDF gerado e convertido para Blob.');

      const fileName = `Ficha_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

      // Cria um link temporário e simula o clique para iniciar o download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Limpa a URL do objeto e remove o elemento 'a'
      URL.revokeObjectURL(downloadUrl);
      a.remove();

      console.log('Download do arquivo PDF iniciado.');

    } catch (error) {
      console.error('Ocorreu um erro durante a geração do PDF para download:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      alert(`Falha ao gerar o PDF. Erro: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
      console.log('Processo de download finalizado.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50 p-2 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl w-full h-full max-w-5xl mx-auto overflow-y-auto relative p-4 sm:p-6 print:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* -- Controles de Ação -- */}
        <div className="absolute top-2 right-2 flex gap-2 z-10 print:hidden">
          {/* Botão de Baixar PDF */}
          <button 
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-wait"
              aria-label="Baixar Ficha em PDF"
          >
              {isProcessing ? 'Gerando PDF...' : 'Baixar PDF'}
          </button>
          {/* Botão de Fechar */}
          <button
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
