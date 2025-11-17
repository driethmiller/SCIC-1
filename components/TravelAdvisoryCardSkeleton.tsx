import React from 'react';

const TravelAdvisoryCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-gray-800 rounded-lg shadow-md overflow-hidden border-t-4 border-gray-700">
      <div className="p-5 animate-pulse">
        <div className="h-7 w-1/2 bg-gray-600 rounded mb-3"></div>
        <div className="h-5 w-3/4 bg-gray-700 rounded mb-4"></div>
        <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="h-4 w-1/3 bg-gray-700 rounded mt-6 mb-4"></div>
        <div className="pt-4 border-t border-gray-700 mt-4">
            <div className="h-5 w-28 bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisoryCardSkeleton;