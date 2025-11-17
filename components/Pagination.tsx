import React from 'react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  itemName?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, totalCount, itemName = 'records' }) => {
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
    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 py-3 px-5 bg-white rounded-lg shadow-sm border border-slate-200 space-y-3 sm:space-y-0">
      <div className="text-sm text-slate-600">
        Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span>
        <span className="hidden md:inline"> &mdash; <span className="font-semibold text-slate-800">{totalCount}</span> total {itemName} found</span>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          variant="secondary"
        >
          &laquo; Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={isNextDisabled}
          variant="secondary"
        >
          Next &raquo;
        </Button>
      </div>
    </div>
  );
};

export default Pagination;