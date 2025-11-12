import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Supplier } from '../types';
import { fetchSuppliers } from '../services/apiService_Supplier';
import { PAGE_SIZE } from '../constants';
import SupplierCard from '../components/SupplierCard';
import Pagination from '../components/Pagination';

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
        placeholder="Search by supplier name / number / address, CAGE code / status, UEI, and zip / postal code"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};


const SupplierView: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

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
      const data = await fetchSuppliers(currentPage, debouncedSearchTerm);
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        {error && <ErrorMessage message={error} />}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {suppliers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {suppliers.map((supplier) => (
                    <SupplierCard key={supplier.SupplierNo} supplier={supplier} />
                  ))}
                </div>
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
              </>
            ) : (
              !error && <p className="text-center text-gray-400 text-xl mt-12">No suppliers found matching your criteria.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SupplierView;