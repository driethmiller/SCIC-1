import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { TravelAdvisory } from '../types';
import { fetchTravelAdvisories } from '../services/mockDataService';
import Button from '../components/Button';
import { ArrowDownTrayIcon } from '../components/icons/ArrowDownTrayIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';
import TravelAdvisoryCard from '../components/TravelAdvisoryCard';
import TravelAdvisoryCardSkeleton from '../components/TravelAdvisoryCardSkeleton';
import TravelAdvisoryFilter from '../components/TravelAdvisoryFilter';
import Pagination from '../components/Pagination';
import { PAGE_SIZE } from '../constants';

const TravelAdvisoriesView: React.FC = () => {
  const [data, setData] = useState<TravelAdvisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const advisoryData = await fetchTravelAdvisories();
      setData(advisoryData);
    } catch (err) {
      setError('Failed to fetch travel advisory data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, sortOrder]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filter by advisory level
    if (selectedLevel !== 'all') {
      result = result.filter(advisory => advisory.level === parseInt(selectedLevel, 10));
    }

    // Filter by country search term
    if (searchTerm) {
      result = result.filter(advisory =>
        advisory.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by last updated date
    result.sort((a, b) => {
      const dateA = new Date(a.lastUpdated).getTime();
      const dateB = new Date(b.lastUpdated).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [data, searchTerm, selectedLevel, sortOrder]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedData.length / PAGE_SIZE), [filteredAndSortedData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredAndSortedData]);

  const handleDownload = () => {
    if (!filteredAndSortedData.length) return;
    const jsonString = JSON.stringify(filteredAndSortedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel_advisories_data_filtered.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-0 z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Travel Advisories</h2>
            <p className="text-slate-500 mt-1">Source: travel.state.gov (Emulated)</p>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
              <Button onClick={handleFetch} disabled={loading} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                  {loading ? 'Fetching...' : 'Refetch Data'}
              </Button>
              {filteredAndSortedData.length > 0 && (
                  <Button onClick={handleDownload} variant="secondary" leftIcon={<DocumentDuplicateIcon className="w-5 h-5" />}>
                      Download JSON
                  </Button>
              )}
          </div>
        </div>
        <TravelAdvisoryFilter 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          sortOrder={sortOrder}
          onSortChange={toggleSortOrder}
        />
      </div>

      {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => <TravelAdvisoryCardSkeleton key={index} />)}
        </div>
      ) : (
        !error && (
            filteredAndSortedData.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedData.map(advisory => (
                    <TravelAdvisoryCard key={advisory.country} advisory={advisory} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalCount={filteredAndSortedData.length}
                  itemName="advisories"
                />
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium text-slate-700">No Advisories Found</h3>
                  <p className="text-slate-500 mt-2">Try adjusting your search or filter criteria.</p>
              </div>
            )
        )
      )}
    </div>
  );
};

export default TravelAdvisoriesView;