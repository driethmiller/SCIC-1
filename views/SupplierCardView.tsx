import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Supplier } from '../types';
import { fetchSuppliers } from '../services/apiService_Supplier';
import { PAGE_SIZE } from '../constants';
import SupplierCard from '../components/SupplierCard';
import Pagination from '../components/Pagination';
import SupplierDetailModal from '../components/SupplierDetailModal';
import Button from '../components/Button';

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full my-16">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Error Message Component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded-lg relative my-4" role="alert">
    <strong className="font-bold">Error:</strong>
    <span className="block sm:inline ml-2">{message}</span>
  </div>
);

// SearchBar Component
interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by supplier name, contract, project, CAGE, UEI, address, etc."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full bg-white border border-gray-300 rounded-md py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};

const SupplierCardView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const loadSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSuppliers(currentPage, debouncedSearchTerm, '', 'All');
      setSuppliers(data.value);
      setTotalCount(data['@odata.count']);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setSuppliers([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const totalPages = useMemo(() => Math.ceil(totalCount / PAGE_SIZE), [totalCount]);
  
  const handleCardClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsCreating(false);
  };
  
  const handleOpenCreateModal = () => {
      setSelectedSupplier(null);
      setIsCreating(true);
  };

  const handleCloseModal = () => {
    setSelectedSupplier(null);
    setIsCreating(false);
  };
  
  const handleCreateSupplier = (newSupplier: Supplier) => {
    // In a real app, this would be a POST request to an API.
    // For this example, we add it to the local state at the top of the list.
    setSuppliers(prevSuppliers => [newSupplier, ...prevSuppliers]);
    setTotalCount(prevCount => prevCount + 1);
  };

  const handleSaveSupplier = (updatedSupplier: Supplier) => {
    // In a real application, you would make an API call to save the data.
    // For this example, we'll just update the state in memory.
    setSuppliers(prevSuppliers => 
        prevSuppliers.map(s => 
            s.SupplierNo === updatedSupplier.SupplierNo ? updatedSupplier : s
        )
    );
  };

  const handleDeleteSupplier = (supplierNo: string) => {
      // In a real application, you would make an API call to delete the data.
      // For this example, we'll just update the state in memory.
      setSuppliers(prevSuppliers => 
          prevSuppliers.filter(s => s.SupplierNo !== supplierNo)
      );
      handleCloseModal(); // Ensure modal is closed after deletion
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-lg shadow-sm sticky top-0 z-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 sm:mb-0">Basic Supplier Information</h2>
            <Button onClick={handleOpenCreateModal}>Create New Supplier</Button>
        </div>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      </div>

      {error && <ErrorMessage message={error} />}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {suppliers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {suppliers.map((supplier) => (
                  <SupplierCard 
                    key={supplier.SupplierNo} 
                    supplier={supplier} 
                    onClick={() => handleCardClick(supplier)}
                  />
                ))}
              </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={totalCount}
                  itemName="suppliers"
                />
            </>
          ) : (
            !error && <p className="text-center text-gray-400 text-xl mt-12">No suppliers found matching your criteria.</p>
          )}
        </>
      )}
      <SupplierDetailModal 
        supplier={selectedSupplier}
        isCreating={isCreating}
        onClose={handleCloseModal}
        onSave={(supplier) => {
            if (isCreating) {
                handleCreateSupplier(supplier);
            } else {
                handleSaveSupplier(supplier);
            }
        }}
        onDelete={handleDeleteSupplier}
      />
    </div>
  );
};

export default SupplierCardView;