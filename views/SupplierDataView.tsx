
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SupplierData } from '../modules/types';
import { fetchSupplierData } from '../services/localSupplierService';
import { PAGE_SIZE } from '../constants';
import SupplierDataCard from '../components/SupplierDataCard';
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
    <strong className="font-bold">Error: </strong>
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
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search suppliers by name, number, CAGE code, CAGE Status, or Supplier address..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

const SupplierDataView: React.FC = () => {
  const [data, setData] = useState<SupplierData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supplierData = await fetchSupplierData();
      setData(supplierData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
          (item.SupplierName && item.SupplierName.toLowerCase().includes(lowerTerm))
       || (item.SupplierNumber && item.SupplierNumber.toLowerCase().includes(lowerTerm))
       || (item.CAGECode && item.CAGECode.toLowerCase().includes(lowerTerm))
       || (item.UEI && item.UEI.toLowerCase().includes(lowerTerm))
       || (item.Street && item.Street.toLowerCase().includes(lowerTerm))
       || (item.City && item.City.toLowerCase().includes(lowerTerm))
       || (item.Territory && item.Territory.toLowerCase().includes(lowerTerm))
       || (item.USAState && (
               item.USAState.Alpha2.toLowerCase().includes(lowerTerm)
            || item.USAState.StateName.toLowerCase().includes(lowerTerm)
          ))
       || (item.CANProvince && (
               item.CANProvince.Alpha2.toLowerCase().includes(lowerTerm)
            || item.CANProvince.ProvinceName.toLowerCase().includes(lowerTerm)
          ))
       || (item.Country && (
               item.Country.Alpha3.toLowerCase().includes(lowerTerm)
            || item.Country.CountryName.toLowerCase().includes(lowerTerm)
          )) 
       || (item.CAGEStatus && ( item.CAGEStatus.Description.toLowerCase().includes(lowerTerm) ))
      );
    }

    return result;
  }, [data, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedData.length / PAGE_SIZE), [filteredAndSortedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredAndSortedData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div className="w-full">
           <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredAndSortedData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedData.map((supplier, index) => (
                  <SupplierDataCard key={`${supplier.SupplierNumber}-${index}`} supplier={supplier} />
                ))}
              </div>
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredAndSortedData.length}
                />
            </>
          ) : (
            !error && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-xl">No suppliers found matching your criteria.</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-400 hover:text-blue-300 underline"
                >
                  Clear search
                </button>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SupplierDataView;
