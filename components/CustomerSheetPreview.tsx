
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import CustomerSheet from './CustomerSheet';
import { generatePdfBlobUrl } from '../utils/pdfGenerator';

interface CustomerSheetPreviewProps {
  customer: Customer;
  onClose: () => void;
}

const CustomerSheetPreview: React.FC<CustomerSheetPreviewProps> = ({ customer, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      setIsLoading(true);
      try {
        // Gera a URL do blob para o PDF em segundo plano
        const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
        setPdfUrl(url);
        setError(null);
      } catch (e) {
        console.error("Erro ao gerar o PDF da ficha:", e);
        setError("Não foi possível gerar a ficha. Por favor, tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };

    generatePdf();

    // Função de limpeza para revogar a URL do blob quando o componente for desmontado
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50"
      onClick={onClose}
    >
      {/* Botão de Fechar, sempre visível e acessível */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-slate-300 dark:bg-slate-700 p-2 rounded-full hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors z-20 shadow-lg"
        aria-label="Fechar Visualização"
      >
        <svg className="w-6 h-6 text-slate-800 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Container do Visualizador de PDF */}
      <div 
        className="w-full h-full flex justify-center items-center p-0 md:p-4 lg:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="text-white text-center p-4 rounded-lg">
            <p className="text-lg">Gerando ficha do cliente...</p>
            <p className="text-sm text-slate-400">Isso pode levar alguns segundos.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-800 text-white p-6 rounded-lg shadow-2xl text-center max-w-sm">
            <h3 className="font-bold text-lg mb-2">Ocorreu um Erro</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Exibe o PDF gerado em um elemento <embed> para compatibilidade */}
        {pdfUrl && !isLoading && (
          <embed
            src={pdfUrl}
            type="application/pdf"
            className="w-full h-full shadow-2xl rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default CustomerSheetPreview;
