
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SupplierData, CAGEStatus, USAState, CANProvince, Country } from '../modules/types';
import { fetchSupplierData, fetchCAGEStatus, fetchUSAState, fetchCANProvince, fetchCountry } from '../services/localSupplierService';
import { PAGE_SIZE } from '../constants';
import SupplierDataRow from '../components/SupplierDataRow';
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
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search suppliers by name, number, UEI, CAGE code, status, or address..."
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
  const [cageStatuses, setCageStatuses] = useState<CAGEStatus[]>([]);
  const [usaSP, setUsaSP] = useState<USAState[]>([]);
  const [canSP, setCanSP] = useState<CANProvince[]>([]);
  const [country, setCountry] = useState<Country[]>([]);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCageStatus, setSelectedCageStatus] = useState<string>('');
  const [selectedUsaSP, setSelectedUsaSP] = useState<string>('');
  const [selectedCanSP, setSelectedCanSP] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [supplierData, cageStatusData, usaSPData, canSPData, countryData] = await Promise.all([
        fetchSupplierData(),
        fetchCAGEStatus(),
        fetchUSAState(),
        fetchCANProvince(),
        fetchCountry(),
      ]);
      setData(supplierData);
      setCageStatuses(cageStatusData);
      setUsaSP(usaSPData);
      setCanSP(canSPData);
      setCountry(countryData);
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
  }, [searchTerm, selectedCageStatus, selectedUsaSP, selectedCanSP, selectedCountry, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCageStatus('');
    setSelectedUsaSP('');
    setSelectedCanSP('');
    setSelectedCountry('');
    setSortColumn(null);
    setSortDirection('asc');
  };

  const hasActiveFilters = searchTerm || selectedCageStatus || selectedUsaSP || selectedCanSP || selectedCountry || sortColumn;

  const getSortValue = (item: SupplierData, column: string): string => {
    switch (column) {
      case 'SupplierName':
        return item.SupplierName || '';
      case 'SupplierID':
        return item.SupplierNumber || '';
      case 'UEID':
        return item.UEI || '';
      case 'CageStatus':
        return item.CAGECode || '';
      case 'Address':
        return [item.Street, item.City, item.USAState?.StateName || item.CANProvince?.ProvinceName || item.Territory, item.Country?.CountryName].filter(Boolean).join(', ');
      case 'Website':
        return item.Website || '';
      default:
        return '';
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => (item.SupplierName && item.SupplierName.toLowerCase().includes(lowerTerm))
       || (item.SupplierNumber && item.SupplierNumber.toLowerCase().includes(lowerTerm))
       || (item.CAGECode && item.CAGECode.toLowerCase().includes(lowerTerm))
       || (item.UEI && item.UEI.toLowerCase().includes(lowerTerm))
       || (item.Street && item.Street.toLowerCase().includes(lowerTerm))
       || (item.City && item.City.toLowerCase().includes(lowerTerm))
       || (item.Territory && item.Territory.toLowerCase().includes(lowerTerm))
       || (item.USAState && (
          item.USAState.Alpha2.toLowerCase().includes(lowerTerm) || item.USAState.StateName.toLowerCase().includes(lowerTerm)
          ))
       || (item.CANProvince && (
          item.CANProvince.Alpha2.toLowerCase().includes(lowerTerm) || item.CANProvince.ProvinceName.toLowerCase().includes(lowerTerm)
          ))
       || (item.Country && (
          item.Country.Alpha3.toLowerCase().includes(lowerTerm) || item.Country.CountryName.toLowerCase().includes(lowerTerm)
          ))
       || (item.CAGEStatus && ( item.CAGEStatus.Description.toLowerCase().includes(lowerTerm) ))
      );
    }

    // Filter by CAGE Status
    if (selectedCageStatus) {
      result = result.filter(item => item.CAGEStatus?.Code === selectedCageStatus);
    }

    if (selectedUsaSP) {
      result = result.filter(item => item.USAState?.Alpha2 === selectedUsaSP);
    }

    if (selectedCanSP) {
      result = result.filter(item => item.CANProvince?.Alpha2 === selectedCanSP);
    }

    if (selectedCountry) {
      result = result.filter(item => item.Country?.Alpha3 === selectedCountry);
    }

    // Sort by selected column
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = getSortValue(a, sortColumn).toLowerCase();
        const bValue = getSortValue(b, sortColumn).toLowerCase();
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, selectedCageStatus, selectedUsaSP, selectedCanSP, selectedCountry, sortColumn, sortDirection]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedData.length / PAGE_SIZE), [filteredAndSortedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredAndSortedData]);


  {/* Make a 'listedData function here, to show the same data in list form. */}

  return (
    <div className="space-y-2">
      <div className="px-4 rounded-lg shadow-sm sticky top-2 z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4">
          <div className="w-full">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          {/* to use function later */}
          <div className="w-full md:w-64 flex-shrink-0">
              <select
                  value={selectedCageStatus}
                  onChange={(e) => setSelectedCageStatus(e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                  <option value="">All CAGE Statuses</option>
                  {cageStatuses.map((status) => (
                      <option key={status.Code} value={status.Code}>
                          {status.Description} ({status.Code})
                      </option>
                  ))}
              </select>
          </div>
          <div className="w-full md:w-64 flex-shrink-0">
              <select
                  value={selectedUsaSP}
                  onChange={(e) => setSelectedUsaSP(e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                  <option value="">All USA States</option>
                  {usaSP.map((status) => (
                      <option key={status.Alpha2} value={status.Alpha2}>
                          {status.StateName} ({status.Alpha2})
                      </option>
                  ))}
              </select>
          </div>
          <div className="w-full md:w-64 flex-shrink-0">
              <select
                  value={selectedCanSP}
                  onChange={(e) => setSelectedCanSP(e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                  <option value="">All Canada Provinces</option>
                  {canSP.map((status) => (
                      <option key={status.Alpha2} value={status.Alpha2}>
                          {status.ProvinceName} ({status.Alpha2})
                      </option>
                  ))}
              </select>
          </div>
          <div className="w-full md:w-64 flex-shrink-0">
              <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="block w-full bg-gray-800 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                  <option value="">All Countries</option>
                  {country.map((status) => (
                      <option key={status.Alpha3} value={status.Alpha3}>
                          {status.CountryName} ({status.Alpha3})
                      </option>
                  ))}
              </select>
          </div>
          {hasActiveFilters && (
            <div className="w-full md:w-auto flex-shrink-0">
              <button
                onClick={clearAllFilters}
                className="block w-full md:w-auto bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-md py-3 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {filteredAndSortedData.length > 0 ? (
                          <>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-2">
              <table className="w-full SupplierTable" width="100%">
                <thead>
                  <tr className="font-semibold text-gray-300">
                    <td className="SupplierList cursor-pointer hover:text-blue-400 select-none" align="left" valign="middle" onClick={() => handleSort('SupplierName')}>
                      Supplier Name {sortColumn === 'SupplierName' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                    <td width="10%" align="center" valign="middle" className="cursor-pointer hover:text-blue-400 select-none" onClick={() => handleSort('SupplierID')}>
                      Supplier ID {sortColumn === 'SupplierID' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                    <td width="20%" align="center" valign="middle" className="cursor-pointer hover:text-blue-400 select-none" onClick={() => handleSort('UEID')}>
                      UEID {sortColumn === 'UEID' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                    <td width="20%" align="center" valign="middle" className="cursor-pointer hover:text-blue-400 select-none" onClick={() => handleSort('CageStatus')}>
                      Cage/Status {sortColumn === 'CageStatus' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                    <td width="20%" align="center" valign="middle" className="cursor-pointer hover:text-blue-400 select-none" onClick={() => handleSort('Address')}>
                      Address {sortColumn === 'Address' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                    <td width="20%" align="center" valign="middle" className="cursor-pointer hover:text-blue-400 select-none" onClick={() => handleSort('Website')}>
                      Website {sortColumn === 'Website' && (sortDirection === 'asc' ? '▲' : '▼')}
                    </td>
                  </tr>
                </thead>
              </table>
            </div>

            {paginatedData.map((supplier, index) => (
                <SupplierDataRow key={`${supplier.SupplierNumber}-${index}`} supplier={supplier} />
            ))}
           


            
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
                  onClick={() => {
                      setSearchTerm('');
                      setSelectedCageStatus('');
                      setSelectedUsaSP('');
                      setSelectedCanSP('');
                  }}
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
