import React from 'react';

const RSSAdvisoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-t-4 border-gray-300 dark:border-gray-600">
      <div className="p-5 animate-pulse-fast">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-7 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700/50">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
};

export default RSSAdvisoryCardSkeleton;