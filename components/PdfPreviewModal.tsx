
import React from 'react';
import { XIcon } from './icons/XIcon';

interface PdfPreviewModalProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ pdfUrl, title, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100]"
      onClick={onClose}
    >
      <div 
        className="bg-slate-100 dark:bg-slate-900 rounded-lg shadow-2xl w-[95vw] h-[95vh] flex flex-col p-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center pb-3 border-b border-slate-300 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <XIcon className="w-6 h-6 text-slate-600 dark:text-slate-300" />
          </button>
        </header>
        <div className="flex-grow mt-4">
          <iframe 
            src={pdfUrl} 
            title={title}
            className="w-full h-full border-0"
          />
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up { 
          0% { opacity: 0; transform: translateY(20px) scale(0.95); } 
          100% { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .animate-fade-in-up { 
          animation: fade-in-up 0.3s ease-out forwards; 
        }
      `}</style>
    </div>
  );
};

export default PdfPreviewModal;
