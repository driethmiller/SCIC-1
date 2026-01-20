import React from 'react';
import DashboardIcon from '../icons/DashboardIcon';
import ListIcon from '../icons/ListIcon';
import {BarChart3} from 'lucide-react';

type View = 'dashboard' | 'list' | 'tile';

interface ViewToggleProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views: { id: View; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
    { id: 'list', icon: ListIcon, label: 'List View' },
    { id: 'tile', icon: DashboardIcon, label: 'Tile View' },
  ];

  return (
    <div className="flex items-center bg-gray-900/50 border border-gray-700 rounded-lg p-1 space-x-1">
      {views.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center space-x-2 text-sm font-medium ${
            currentView === id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
          }`}
          aria-pressed={currentView === id}
          aria-label={`Switch to ${label}`}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;