
import React, { useState } from 'react';
import { Customer } from '../types';
import { generateCustomerShareText } from '../utils/receiptGenerator';
import { WhatsAppIcon } from './icons/WhatsAppIcon';
import { ShareIcon } from './icons/ShareIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import CustomerSheetPreview from './CustomerSheetPreview'; // Importa a nova visualização

interface ShareCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
}

const ShareCustomerModal: React.FC<ShareCustomerModalProps> = ({ customer, onClose }) => {
  // Estado para controlar a exibição da visualização em tela cheia
  const [isPreviewingSheet, setIsPreviewingSheet] = useState(false);

  if (!customer) return null;

  // Ação de compartilhamento padrão do navegador
  const handleShare = async (text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        onClose();
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  // Abre a visualização da ficha em tela cheia
  const handlePreviewSheet = () => {
    setIsPreviewingSheet(true);
  };

  const shareOptions = [
    {
      title: 'Visualizar Ficha do Cliente',
      description: 'Abre uma visualização rápida da ficha em tela cheia.',
      icon: <ReceiptIcon className="w-7 h-7 text-red-500" />,
      action: handlePreviewSheet, // Ação alterada
    },
    {
      title: 'Compartilhar no WhatsApp',
      description: 'Envia um resumo dos dados do cliente via WhatsApp.',
      icon: <WhatsAppIcon className="w-7 h-7 text-green-500" />,
      action: () => {
        const text = generateCustomerShareText(customer);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
        onClose();
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
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40" onClick={onClose}>
        <div className="bg-slate-100 dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg mx-4 p-2 md:p-4 border-t-4 border-lime-500" onClick={(e) => e.stopPropagation()}>
          <div className="p-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Compartilhar/Exportar Cliente</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Escolha uma das opções abaixo para interagir com <span className="font-semibold">{customer.name}</span>.</p>
              
              <div className="grid grid-cols-1 gap-4">
                  {shareOptions.map((option, index) => (
                      <button 
                          key={index}
                          onClick={option.action}
                          className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 text-left flex items-center gap-5 w-full"
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

      {/* Renderiza a visualização em tela cheia quando ativada */}
      {isPreviewingSheet && (
        <CustomerSheetPreview 
          customer={customer} 
          onClose={() => setIsPreviewingSheet(false)} 
        />
      )}
    </>
  );
};

export default ShareCustomerModal;
