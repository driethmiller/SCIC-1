import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';
import UserIcon from './icons/UserIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles: UserRole[] = ['SCIC Contributor', 'SCIC Read-Only'];

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  
  const handleRoleSelect = (role: UserRole) => {
    onRoleChange(role);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-800/70 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white hover:bg-gray-700/70 transition-colors"
      >
        <UserIcon className="w-5 h-5 text-blue-400" />
        <span className="font-medium">{currentRole}</span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-30 animate-fade-in-down">
          <ul className="py-1">
            {roles.map((role) => (
              <li key={role}>
                <button
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    currentRole === role
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {role}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
        <style>{`
            @keyframes fade-in-down {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
                animation: fade-in-down 0.2s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default RoleSwitcher;