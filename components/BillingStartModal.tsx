// components/BillingStartModal.tsx
import React, { useState } from 'react';

interface BillingStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (equipmentNumber: string) => void;
  isSaving: boolean;
}

const BillingStartModal: React.FC<BillingStartModalProps> = ({ isOpen, onClose, onConfirm, isSaving }) => {
  const [equipmentNumber, setEquipmentNumber] = useState('');

  const handleConfirm = () => {
    if (equipmentNumber.trim()) {
      onConfirm(equipmentNumber.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Iniciar Faturamento</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-5">Digite o número do equipamento para iniciar o faturamento.</p>
        
        <div className="mb-4">
          <label htmlFor="equipment-number" className="sr-only">Número do Equipamento</label>
          <input
            id="equipment-number"
            type="text"
            value={equipmentNumber}
            onChange={(e) => setEquipmentNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 text-lg"
            placeholder="Nº do Equipamento"
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            disabled={isSaving}
            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-5 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={isSaving || !equipmentNumber.trim()}
            className="bg-lime-500 text-white font-bold py-2 px-5 rounded-md hover:bg-lime-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Buscando...' : 'Faturar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingStartModal;
