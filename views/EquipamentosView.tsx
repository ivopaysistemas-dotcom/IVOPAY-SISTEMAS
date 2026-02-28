// views/EquipamentosView.tsx
import React, { useMemo } from 'react';
import { Customer, Equipment, EquipmentWithCustomer } from '../types';
import PageHeader from '../components/PageHeader';
import { BilliardIcon } from '../components/icons/BilliardIcon';
import { JukeboxIcon } from '../components/icons/JukeboxIcon';
import { CraneIcon } from '../components/icons/CraneIcon';
import { PrinterIcon } from '../components/icons/PrinterIcon';

interface EquipamentosViewProps {
  customers: Customer[];
  showNotification: (message: string, type?: 'success' | 'error') => void;
  onOpenLabelGenerator: () => void;
  onGenerateLabel: (equipment: EquipmentWithCustomer) => void;
}

const EquipmentCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  equipments: EquipmentWithCustomer[];
  onGenerateLabel: (equipment: EquipmentWithCustomer) => void;
}> = ({ title, icon, equipments, onGenerateLabel }) => {
  
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-3 flex items-center gap-2">
          {icon}
          {title} ({equipments.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 flex-grow">
          {equipments.length > 0 ? (
            equipments.map(equip => (
              <div key={equip.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center gap-4">
                <div className="flex-grow">
                  <p className="text-lg font-bold text-slate-800 dark:text-white">Nº: {equip.numero}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 break-words">Cliente: {equip.customerName}</p>
                </div>
                <button
                  onClick={() => onGenerateLabel(equip)}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-indigo-500 text-white text-xs font-bold py-1.5 px-3 rounded-md hover:bg-indigo-600"
                  title="Gerar Etiqueta para este equipamento"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Etiqueta</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-slate-500 dark:text-slate-400 italic">Nenhum equipamento deste tipo cadastrado.</p>
          )}
        </div>
      </div>
    );
};


const EquipamentosView: React.FC<EquipamentosViewProps> = ({ customers, showNotification, onOpenLabelGenerator, onGenerateLabel }) => {

  const allEquipment = useMemo(() => {
    const flatList: EquipmentWithCustomer[] = customers.flatMap(customer =>
      (customer.equipment || []).map(equip => ({
        ...equip,
        customerName: customer.name,
        customerId: customer.id,
      }))
    ).sort((a,b) => (a.numero || '').localeCompare(b.numero || ''));

    return {
      mesas: flatList.filter(e => e.type === 'mesa'),
      jukeboxes: flatList.filter(e => e.type === 'jukebox'),
      gruas: flatList.filter(e => e.type === 'grua'),
    };
  }, [customers]);

  return (
    <>
      <PageHeader
        title="Inventário de Equipamentos"
        subtitle="Visualize e gere etiquetas para seus equipamentos."
      />

       <div className="mb-8">
        <button
          onClick={onOpenLabelGenerator}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg"
        >
          <PrinterIcon className="w-5 h-5" />
          <span>Gerar Etiquetas em Massa (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <EquipmentCard
          title="Mesas de Sinuca"
          icon={<BilliardIcon className="w-6 h-6 text-cyan-500" />}
          equipments={allEquipment.mesas}
          onGenerateLabel={onGenerateLabel}
        />
        <EquipmentCard
          title="Jukeboxes"
          icon={<JukeboxIcon className="w-6 h-6 text-fuchsia-500" />}
          equipments={allEquipment.jukeboxes}
          onGenerateLabel={onGenerateLabel}
        />
        <EquipmentCard
          title="Gruas de Pelúcia"
          icon={<CraneIcon className="w-6 h-6 text-orange-500" />}
          equipments={allEquipment.gruas}
          onGenerateLabel={onGenerateLabel}
        />
      </div>
    </>
  );
};

export default EquipamentosView;
