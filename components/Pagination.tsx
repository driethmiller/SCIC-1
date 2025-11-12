
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex justify-center items-center mt-8 py-4">
      <button
        onClick={handlePrevious}
        disabled={isPrevDisabled}
        className={`px-4 py-2 mx-1 text-white rounded-md transition-colors ${isPrevDisabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
      >
        &laquo; Previous
      </button>

      <span className="px-4 py-2 text-gray-300">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`px-4 py-2 mx-1 text-white rounded-md transition-colors ${isNextDisabled ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'}`}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;