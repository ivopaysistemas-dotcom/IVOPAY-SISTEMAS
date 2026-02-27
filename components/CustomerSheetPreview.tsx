
import React, { useState } from 'react';
import { Customer } from '../types';
import CustomerSheet from './CustomerSheet';
import { generatePdfBlobUrl } from '../utils/pdfGenerator'; // Importa a função de gerar PDF

interface CustomerSheetPreviewProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerSheetPreview: React.FC<CustomerSheetPreviewProps> = ({ customer, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false); // Estado unificado para geração de PDF

  // Função para gerar o PDF e abrir em uma nova guia
  const handlePrintToPdf = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const newWindow = window.open('', '_blank');
    if (!newWindow) {
      alert('Não foi possível abrir uma nova guia. Verifique se os pop-ups estão bloqueados.');
      setIsProcessing(false);
      return;
    }
    newWindow.document.write('Gerando PDF para impressão... Por favor, aguarde.');

    try {
      const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
      newWindow.location.href = url;
    } catch (error) {
      console.error('Erro ao gerar PDF para impressão:', error);
      newWindow.document.body.innerHTML = `Falha ao gerar o PDF. Erro: ${error}`;
    } finally {
      setIsProcessing(false);
    }
  };

  // Função para gerar o PDF e compartilhar via Web Share API
  const handleShare = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Gera o PDF e obtém a URL do Blob
      const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
      const response = await fetch(url);
      const blob = await response.blob();

      const fileName = `Ficha_${customer.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        // A chamada de compartilhamento deve ser direta, sem interrupção por alerts.
        await navigator.share({
          files: [file],
          title: `Ficha Cadastral - ${customer.name}`,
          text: `Segue em anexo a ficha cadastral de ${customer.name}.`,
        });
      } else {
        alert('A função de compartilhamento não é suportada neste navegador ou ambiente.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar a ficha:', error);
      // Evita mostrar o NotAllowedError ao usuário, pois ele ocorre quando o usuário cancela o compartilhamento
      if (error.name !== 'NotAllowedError') {
        alert(`Falha ao preparar o PDF para compartilhamento. Erro: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
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
          {/* Botão de Compartilhar */}
          <button 
              onClick={handleShare}
              disabled={isProcessing}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-green-400 disabled:cursor-wait"
              aria-label="Compartilhar Ficha"
          >
              {isProcessing ? 'Gerando...' : 'Compartilhar'}
          </button>
          {/* Botão de Imprimir */}
          <button 
              onClick={handlePrintToPdf} 
              disabled={isProcessing}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-transform transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-wait"
              aria-label="Imprimir Ficha"
          >
              {isProcessing ? 'Gerando...' : 'Imprimir'}
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
