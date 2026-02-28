
import React, { useState, useEffect } from 'react';

interface StartBillingByIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (equipmentNumber: string) => void;
  isSaving: boolean;
}

const StartBillingByIdModal: React.FC<StartBillingByIdModalProps> = ({ isOpen, onClose, onConfirm, isSaving }) => {
  const [equipmentNumber, setEquipmentNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEquipmentNumber('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (equipmentNumber.trim()) {
      onConfirm(equipmentNumber.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[70]"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Iniciar Faturamento Rápido</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">Digite o número do equipamento para iniciar o faturamento correspondente.</p>
        <div>
          <label htmlFor="equipment-number-input" className="sr-only">Número do Equipamento</label>
          <input
            id="equipment-number-input"
            type="text"
            value={equipmentNumber}
            onChange={(e) => setEquipmentNumber(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Ex: 1234"
            className="w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 text-lg"
            autoFocus
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !equipmentNumber.trim()}
            className="bg-lime-500 text-white font-bold py-2 px-4 rounded-md hover:bg-lime-600 transition-colors disabled:bg-lime-400 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Buscando...' : 'Faturar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartBillingByIdModal;
