import React from 'react';

interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortChange: () => void;
}

const SortIcon: React.FC<{ order: 'asc' | 'desc' }> = ({ order }) => {
  const commonPath = "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor" style={{ transform: order === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
      <path fillRule="evenodd" d={commonPath} clipRule="evenodd" />
    </svg>
  );
};

const TravelAdvisoryFilter: React.FC<FiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  sortOrder,
  onSortChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div className="md:col-span-2">
        <label htmlFor="search-country" className="block text-sm font-medium text-slate-700 mb-1">Search by country</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
          </div>
          <input
              type="text"
              id="search-country"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Germany, Brazil..."
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="level-filter" className="block text-sm font-medium text-slate-700 mb-1">Filter by level</label>
          <select
            id="level-filter"
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-slate-900"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
          </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Sort by date</label>
          <button
            onClick={onSortChange}
            className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SortIcon order={sortOrder} />
            <span className="ml-2">
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisoryFilter;