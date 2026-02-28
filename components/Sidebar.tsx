import React from 'react';
import { User } from "firebase/auth";
import { View } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ReceiptIcon } from './icons/ReceiptIcon';
import { CalculatorIcon } from './icons/CalculatorIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LogoIcon } from './icons/LogoIcon';
import { MapIcon } from './icons/MapIcon';
import { CogIcon } from './icons/CogIcon';
import { ListBulletIcon } from './icons/ListBulletIcon';
import { ArrowsPointingOutIcon } from './icons/ArrowsPointingOutIcon';
import { ArrowsPointingInIcon } from './icons/ArrowsPointingInIcon';
import { CashIcon } from './icons/CashIcon';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User | null;
  onStartBilling: () => void;
}

const navItems = [
    { view: 'DASHBOARD' as View, label: 'Dashboard', icon: HomeIcon },
    { view: 'CLIENTES' as View, label: 'Clientes', icon: UsersIcon },
    { view: 'COBRANCAS' as View, label: 'Cobranças', icon: ReceiptIcon },
    { view: 'EQUIPAMENTOS' as View, label: 'Equipamentos', icon: ListBulletIcon },
    { view: 'DESPESAS' as View, label: 'Despesas', icon: CalculatorIcon },
    { view: 'ROTAS' as View, label: 'Rotas', icon: MapIcon },
    { view: 'RELATORIOS' as View, label: 'Relatórios', icon: ChartBarIcon },
];

const secondaryNavItems: { view: View, label: string, icon: React.FC<any> }[] = [];

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen, user, onStartBilling }) => {
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const handleViewChange = (view: View) => {
        setView(view);
        setIsOpen(false); 
    };
    
    const handleStartBillingClick = () => {
        onStartBilling();
        setIsOpen(false);
    };

    const NavButton: React.FC<{item: {view: View, label: string, icon: React.FC<any>}}> = ({ item }) => {
        const Icon = item.icon;
        const isActive = currentView === item.view;
        return (
             <li key={item.view} className="mb-2">
                <button 
                    onClick={() => handleViewChange(item.view)}
                    className={`w-full flex items-center rounded-md p-3 transition-colors text-sm font-medium ${
                        isActive 
                        ? 'bg-[var(--color-primary)] text-[var(--color-primary-text)] shadow-lg' 
                        : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Icon className="w-5 h-5 mr-4" />
                    <span>{item.label}</span>
                </button>
            </li>
        );
    };


    return (
        <>
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            ></div>

            <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 p-4 flex flex-col border-r border-slate-200 dark:border-slate-700 z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 no-print ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <button 
                    onClick={() => handleViewChange('CONFIGURACOES')}
                    className="absolute top-3 right-3 p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors z-10"
                    aria-label="Configurações"
                    title="Configurações"
                >
                    <CogIcon className="w-6 h-6" />
                </button>
                
                <button
                    onClick={toggleFullScreen}
                    className="absolute top-14 right-3 p-2 rounded-full text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors z-10"
                    aria-label="Tela cheia"
                    title="Tela cheia"
                >
                    {isFullscreen ? <ArrowsPointingInIcon className="w-6 h-6" /> : <ArrowsPointingOutIcon className="w-6 h-6" />}
                </button>

                <div className="mb-4 text-center">
                    <LogoIcon className="w-full h-auto pt-2" />
                </div>
                <div className="mb-6">
                    <button 
                        onClick={handleStartBillingClick}
                        className="w-full flex items-center justify-center rounded-md p-3 transition-colors text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-500 shadow-md"
                    >
                        <CashIcon className="w-5 h-5 mr-3" />
                        <span>Faturamento Rápido</span>
                    </button>
                </div>
                <nav className="flex-grow">
                    <ul>
                        {navItems.map(item => <NavButton key={item.view} item={item} />)}
                    </ul>
                </nav>
                <div className="mt-auto">
                     <nav>
                        <ul>
                            {secondaryNavItems.map(item => <NavButton key={item.view} item={item} />)}
                        </ul>
                    </nav>
                    <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
