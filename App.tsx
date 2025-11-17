import React, { useState } from 'react';
import { ViewType, UserRole } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import SupplierCardView from './views/SupplierCardView';
import TravelAdvisoryView from './views/TravelAdvisoryView';
import SupplierView from './views/SupplierView';
import SupplierBView from './views/SupplierBView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('SupplierInfo');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [currentRole, setCurrentRole] = useState<UserRole>('SCIC Contributor');

  const renderView = () => {
    switch (activeView) {
      case 'SupplierInfo':
        return <SupplierCardView />;
      case 'TravelAdvisories':
        return <TravelAdvisoryView />;
      case 'SupplierMock':
        return <SupplierView />;
      case 'Suppliers':
        return <SupplierBView currentUserRole={currentRole} />;
      // case '----------':
      //   return null;
      // case 'SupplierTest':
      //   return <SupplierTestView />;
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