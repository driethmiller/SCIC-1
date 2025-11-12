import React from 'react';
import { ViewType } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { BuildingOfficeIcon } from './icons/BuildingOfficeIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';
import { HomeIcon } from './icons/HomeIcon';
import { TrophyIcon } from './icons/TrophyIcon';
import { ChevronDoubleLeftIcon } from './icons/ChevronDoubleLeftIcon';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isCollapsed, toggleCollapse }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon className="w-6 h-6" /> },
    { id: 'Suppliers', label: 'Suppliers Dictionary', icon: <BuildingOfficeIcon className="w-6 h-6" /> },
    { id: 'TravelAdvisories', label: 'Travel Advisories', icon: <GlobeAltIcon className="w-6 h-6" /> },
  ];

  return (
    <nav className={`bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 border-b border-slate-700 flex items-center space-x-3 overflow-hidden">
         <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0">
            S
         </div>
        {!isCollapsed && <h2 className="text-lg font-bold whitespace-nowrap">SCIC Data Hub</h2>}
      </div>
      <ul className="flex-1 p-2">
        {navItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center space-x-3 p-3 my-1 rounded-md text-left transition-colors duration-200 ${
                isCollapsed ? 'justify-center' : ''
              } ${
                activeView === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={item.label}
            >
              <div className="flex-shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>
       <div className="p-2 border-t border-slate-700">
          <button
              onClick={toggleCollapse}
              className="w-full flex items-center justify-center p-3 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
              <ChevronDoubleLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
      </div>
      <div className={`p-4 border-t border-slate-700 text-xs text-slate-400 ${isCollapsed ? 'text-center' : ''} overflow-hidden`}>
        <p className="whitespace-nowrap">{isCollapsed ? `©${new Date().getFullYear()}` : `© ${new Date().getFullYear()} US Gov Agency`}</p>
      </div>
    </nav>
  );
};

export default Sidebar;