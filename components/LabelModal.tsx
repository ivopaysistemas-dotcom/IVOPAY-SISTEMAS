import React from 'react';
import { EquipmentWithCustomer } from '../types';
import { PrinterIcon } from './icons/PrinterIcon';

interface LabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: EquipmentWithCustomer | null;
}

const LabelModal: React.FC<LabelModalProps> = ({ isOpen, onClose, equipment }) => {
  if (!isOpen || !equipment) return null;

  const handlePrint = () => {
    const labelToPrint = document.querySelector('#label-to-print');
    if (!labelToPrint) {
      alert("Erro: Elemento da etiqueta não encontrado.");
      return;
    }

    const printWindow = window.open('', '', 'width=300,height=400');
    if (!printWindow) {
      alert('Por favor, habilite pop-ups para imprimir a etiqueta.');
      return;
    }

    // Clone all <style> and <link> tags from the parent document's <head>
    const headElements = document.querySelectorAll('head > style, head > link[rel="stylesheet"]');
    headElements.forEach(el => {
      printWindow.document.head.appendChild(el.cloneNode(true));
    });

    // Add print-specific styles to the new window
    const printSpecificStyles = printWindow.document.createElement('style');
    printSpecificStyles.innerHTML = `
      @page {
        size: 58mm auto;
        margin: 0;
      }
      body {
        width: 58mm;
        margin: 0 !important;
        padding: 2mm !important;
        background-color: white !important;
      }
      #label-to-print {
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      /* Ensure colors from tailwind are printed */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    `;
    printWindow.document.head.appendChild(printSpecificStyles);

    // Set body content
    printWindow.document.body.innerHTML = labelToPrint.outerHTML;

    // Use a timeout to make sure styles are applied before printing
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 750); // Increased timeout for potentially slow networks loading CSS
  };

  const equipmentTypeDisplay: Record<string, string> = {
      mesa: 'Mesa de Sinuca',
      jukebox: 'Jukebox',
      grua: 'Grua de Pelúcia'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100] p-4 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Etiqueta para Impressão Térmica</h2>
        
        {/* Etiqueta para impressão */}
        <div id="label-to-print" className="printable-label-area my-5 p-3 border border-dashed border-slate-400 bg-white font-mono text-black">
            <div className="text-center">
                <p className="font-bold tracking-[.25em]">IVOPAY SISTEMAS</p>

                <div className="flex flex-col items-center justify-center w-full aspect-square my-2">
                    <p className="font-black text-red-500" style={{ fontSize: 'clamp(2rem, 15vw, 4rem)', lineHeight: 1 }}>IVOPAY</p>
                    <p className="font-black text-green-500" style={{ fontSize: 'clamp(1.5rem, 11vw, 3rem)', lineHeight: 1 }}>SISTEMAS</p>
                </div>

                <hr className="border-t-2 border-dashed border-black my-2" />

                <div className="text-lg space-y-1">
                    <p>{equipmentTypeDisplay[equipment.type] || 'Equipamento'}</p>
                    <p className="font-bold">Nº: {equipment.numero}</p>
                    <p>Cliente: {equipment.customerName}</p>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Fechar
          </button>
          <button 
            onClick={handlePrint}
            className="bg-indigo-600 text-white font-bold py-2 px-5 rounded-md hover:bg-indigo-500 transition-colors flex items-center gap-2"
          >
            <PrinterIcon className="w-5 h-5" />
            Imprimir
          </button>
        </div>
      </div>
      {/* Fallback styles in case user prints from main window */}
      <style>{`
        @media print {
          body > *:not(#label-to-print) {
            display: none !important;
          }
          #label-to-print {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LabelModal;
