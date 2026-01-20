
import React, { useState, useEffect } from 'react';
import { ViewType, UserRole } from './modules/types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import TravelAdvisoryView from './apps/TravelAdvisory/TravelAdvisoryView';
import SupplierMain from './views/SupplierMain';
import { RawSupplierData } from './modules/types';
import { fetchRawSupplierData } from './services/localSupplierService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Suppliers');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [currentRole, setCurrentRole] = useState<UserRole>('SCIC Contributor');

  const [supplierData, setSupplierData] = useState<RawSupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRawSupplierData();
        setSupplierData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading supplier data:', err);
        setError('Failed to load supplier data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

    if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-indigo-600">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading Supplier Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md text-center">
          <div className="text-red-500 mb-4 mx-auto w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">!</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'TravelAdvisories':
        return <TravelAdvisoryView />;
      case 'Suppliers':
        return <SupplierMain currentUserRole={currentRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 font-sans">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentRole={currentRole} onRoleChange={setCurrentRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
