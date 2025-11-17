import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Supplier, Contract, UserRole } from '../types';
import { getSuppliers, getContracts, removeSupplier, addSupplier, updateSupplier } from '../services/supplierService';

import SearchBar from '../components/SearchBar';
import SupplierList from '../components/SupplierList';
import SupplierDetail from '../components/SupplierDetail';
import ContractDetail from '../components/ContractDetail';
import AddSupplierModal from '../components/AddSupplierModal';
import Dashboard from '../components/Dashboard';
import ViewToggle from '../components/ViewToggle';

type View = 'dashboard' | 'list';

interface SupplierBViewProps {
  currentUserRole: UserRole;
}

const SupplierBView: React.FC<SupplierBViewProps> = ({ currentUserRole }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [suppliersData, contractsData] = await Promise.all([getSuppliers(), getContracts()]);
      setSuppliers(suppliersData);
      setContracts(contractsData);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRemoveSupplier = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this supplier?')) {
      const success = await removeSupplier(id);
      if (success) {
        setSuppliers(prev => prev.filter(s => s.id !== id));
      } else {
        alert('Failed to remove supplier.');
      }
    }
  };

  const handleSaveSupplier = async (formData: Omit<Supplier, 'id' | 'logoUrl' | 'contractIds'>) => {
    try {
      if (supplierToEdit) {
        const updatedSupplierData: Supplier = {
            ...supplierToEdit,
            ...formData,
        };
        const updated = await updateSupplier(updatedSupplierData);
        setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s));
        if (selectedSupplier?.id === updated.id) {
          setSelectedSupplier(updated);
        }
      } else {
        const newSupplier = await addSupplier(formData);
        setSuppliers(prev => [newSupplier, ...prev]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save supplier", error);
      alert(`Failed to save supplier.`);
    }
  };
  
  const handleEditSupplier = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setIsModalOpen(true);
  };
  
  const handleAddNewSupplier = () => {
    setSupplierToEdit(null);
    setIsModalOpen(true);
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSupplierToEdit(null);
  };
  
  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSelectedContract(null);
  };
  
  const handleSelectContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleBack = () => {
    if (selectedContract) {
      setSelectedContract(null);
    } else if (selectedSupplier) {
      setSelectedSupplier(null);
    }
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cageCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.ueid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  const renderContent = () => {
    if (selectedContract && selectedSupplier) {
      return (
        <ContractDetail 
          contract={selectedContract} 
          suppliers={suppliers} 
          onBack={handleBack}
          onSelectSupplier={handleSelectSupplier}
        />
      );
    }
    if (selectedSupplier) {
      return (
        <SupplierDetail 
          supplier={selectedSupplier}
          allSuppliers={suppliers}
          contracts={contracts} 
          onBack={handleBack}
          onSelectContract={handleSelectContract}
          onSelectSupplier={handleSelectSupplier}
          onEdit={handleEditSupplier}
          currentUserRole={currentUserRole}
        />
      );
    }
    return (
      <>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">
            {currentView === 'dashboard' ? 'Supplier Overview' : 'All Suppliers'}
          </h1>
          <div className="flex items-center space-x-4">
              <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
              {currentUserRole === 'SCIC Contributor' && (
                <button
                  onClick={handleAddNewSupplier}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
                >
                  Add Supplier
                </button>
              )}
          </div>
        </div>
        {currentView === 'dashboard' ? (
          <Dashboard suppliers={suppliers} />
        ) : (
          <>
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <SupplierList
              suppliers={filteredSuppliers}
              isLoading={isLoading}
              error={error}
              onRemove={handleRemoveSupplier}
              onSelect={handleSelectSupplier}
              currentUserRole={currentUserRole}
            />
          </>
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderContent()}
      {isModalOpen && currentUserRole === 'SCIC Contributor' && (
        <AddSupplierModal 
          allSuppliers={suppliers}
          onClose={handleCloseModal}
          onSave={handleSaveSupplier} 
          supplierToEdit={supplierToEdit}
        />
      )}
    </div>
  );
};

export default SupplierBView;