import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Supplier } from '../types';
import { fetchSuppliers } from '../services/apiService_Supplier';
import { PAGE_SIZE } from '../constants';
import SupplierCard from '../components/SupplierCard';
import Pagination from '../components/Pagination';

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
    <div className="relative mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Search Basic Supplier Information</h2>
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by supplier name / number / address / CAGE code / status / UEI / zip / postal code"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
  const [allSuppliers, setAllSupports] = useState<Supplier[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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

{/*
  // Try filters example of RSSAdvisory
  const filteredAndSortedAdvisories = useMemo(() => {
    let result = [...allSuppliers];

    if (selectedLevel !== 'all') {
      result = result.filter(advisory => advisory.level === parseInt(selectedLevel, 10));
    }

    if (searchTerm) {
      result = result.filter(advisory =>
        advisory.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [searchTerm, selectedLevel, sortOrder, allSuppliers]);
  // End-Try
  */}

  const totalPages = useMemo(() => Math.ceil(totalCount / PAGE_SIZE), [totalCount]);

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default SupplierCardView;