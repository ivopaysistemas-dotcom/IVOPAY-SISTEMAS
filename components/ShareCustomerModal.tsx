
import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import { generateCustomerShareText } from '../utils/receiptGenerator';
import { generatePdfBlobUrl } from '../utils/pdfGenerator';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { ShareIcon } from './icons/ShareIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import CustomerSheet from './CustomerSheet';
import PdfPreviewModal from './PdfPreviewModal'; // Importando o novo modal

interface ShareCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
}

const ShareCustomerModal: React.FC<ShareCustomerModalProps> = ({ customer, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Estado para a URL do PDF

  useEffect(() => {
    // Limpa a URL do Blob quando o componente é desmontado para evitar memory leaks
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!customer) return null;

  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  const handleGeneratePdf = async () => {
    if (!customer || isGenerating) return;

    setIsGenerating(true);
    try {
      const url = await generatePdfBlobUrl(<CustomerSheet customer={customer} />);
      setPdfUrl(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Falha ao gerar o PDF da ficha.');
    } finally {
      setIsGenerating(false);
      // Não fecha o modal principal, pois o de preview será aberto
    }
  };

  const handleClosePdfPreview = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    // Agora, ao fechar a pré-visualização, fechamos também o modal de compartilhamento.
    onClose(); 
  };

  const shareOptions = [
    {
      title: 'Visualizar Ficha Cadastral',
      description: 'Gera um PDF da ficha do cliente para visualização.',
      icon: <ReceiptIcon className="w-7 h-7 text-red-500" />,
      action: handleGeneratePdf,
      disabled: isGenerating,
    },
    {
      title: 'Compartilhar no WhatsApp',
      description: 'Envia um resumo dos dados do cliente via WhatsApp.',
      icon: <WhatsAppIcon className="w-7 h-7 text-green-500" />,
      action: () => {
        const text = generateCustomerShareText(customer);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
      },
    },
    {
      title: 'Compartilhar (Padrão)',
      description: 'Usa o menu de compartilhamento do sistema operacional.',
      icon: <ShareIcon className="w-7 h-7 text-sky-500" />,
      action: () => handleShare(generateCustomerShareText(customer)),
    },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-2 md:p-4 border-t-4 border-lime-500" onClick={(e) => e.stopPropagation()}>
          <div className="p-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Compartilhar/Exportar Cliente</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Escolha uma das opções abaixo para compartilhar ou exportar os dados de <span className="font-semibold">{customer.name}</span>.</p>
              
              <div className="grid grid-cols-1 gap-4">
                  {shareOptions.map((option, index) => (
                      <button 
                          key={index}
                          onClick={option.action}
                          disabled={option.disabled}
                          className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 text-left flex items-center gap-5 w-full disabled:opacity-50 disabled:cursor-wait"
                      >
                          <div className="flex-shrink-0">
                              {option.icon}
                          </div>
                          <div>
                              <h3 className="font-semibold text-base text-slate-900 dark:text-white">{option.title}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{option.description}</p>
                          </div>
                      </button>
                  ))}
              </div>

              <div className="mt-6 text-center">
                  <button onClick={onClose} className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-2 px-6 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                      Fechar
                  </button>
              </div>
          </div>
        </div>
      </div>

      {pdfUrl && (
        <PdfPreviewModal 
          pdfUrl={pdfUrl}
          title={`Ficha Cadastral - ${customer.name}`}
          onClose={handleClosePdfPreview}
        />
      )}
    </>
  );
};

export default ShareCustomerModal;
