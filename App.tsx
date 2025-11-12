import React, { useState } from 'react';
import { ViewType, Supplier } from './types';
import SupplierCardView from './views/SupplierCardView';
import TravelAdvisoriesView from './views/TravelAdvisoryView';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

// import ContractsView from './views/ContractsView';
// import DashboardView from './views/DashboardView';
// import { ViewType, ContractAward } from './types';


// Loading Spinner Component defined within App.tsx
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full my-16">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error Message Component defined within App.tsx
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative my-4" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline ml-2">{message}</span>
  </div>
);


// SearchBar Component defined within App.tsx
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by supplier name, supplier number, CAGE code, UEI, supplier address, zip and postal code ..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('TravelAdvisories');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);

  const renderView = () => {
    switch (activeView) {
      case 'SupplierInfo':
        return <SupplierCardView />;
      case 'TravelAdvisories':
        return <TravelAdvisoriesView />;
      // case 'dashboard':
      //   return <DashboardView />;
      // case 'contracts':
      //   return <ContractsView />;
      // case 'awards':
      //   return <AwardsView />;
      // default:
      //   return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 md:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

/* original text page of the app 
const App: React.FC = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center p-8 border border-gray-700 rounded-lg shadow-2xl bg-gray-800">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Empty React Application
        </h1>
        <p className="text-lg text-gray-400">
          This is a clean slate. Start building something amazing!
        </p>
      </div>
    </main>
  );
};
*/

export default App;
