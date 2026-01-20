import React from 'react';
import { UserRole } from '../modules/types';
import RoleSwitcher from './RoleSwitcher';
import { Link } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
           <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
             <Link />
          </svg>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">Supply Chain Insight Central</h1>
            <p className="text-sm text-gray-400">Browser for SCIC Suppliers and Relevant Data and Applications</p>
          </div>
        </div>
        <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      </div>
    </header>
  );
};

export default Header;