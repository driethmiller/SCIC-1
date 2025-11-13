import React from 'react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedLevel: string;
  onLevelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: () => void;
}

const SortIcon: React.FC<{ order: 'asc' | 'desc' }> = ({ order }) => {
  if (order === 'asc') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13.707 9.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L13 11.414l1.293 1.293a1 1 0 001.414-1.414l-2-2z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L13 14.586z" />
    </svg>
  );
};


const SupplierCardFilters: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md sticky top-[72px] z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <label htmlFor="search-country" className="sr-only">Search by country</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="search-country"
              value={searchTerm}
              onChange={onSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by country..."
            />
          </div>
        </div>
        <div>
          <label htmlFor="level-filter" className="sr-only">Filter by level</label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={onLevelChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>
        <div>
          <button
            onClick={onSortChange}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SortIcon order={sortOrder} />
            <span className="ml-2">
              Date ({sortOrder === 'desc' ? 'Newest' : 'Oldest'})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierCardFilters;