import React from 'react';
import { Supplier } from '../types';
// fix: Use SupplierCardB as its props match the usage in this component.
import SupplierCardB from './SupplierCardB';

interface SupplierGridProps {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  onRemove: (id: string) => void;
  onSelect: (supplier: Supplier) => void;
}

const LoadingSkeletonCard: React.FC = () => (
  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-14 w-14 rounded-full bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const SupplierGrid: React.FC<SupplierGridProps> = ({ suppliers, isLoading, error, onRemove, onSelect }) => {
  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => <LoadingSkeletonCard key={index} />)}
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        <h3 className="text-xl font-semibold">No suppliers found.</h3>
        <p>Try adjusting your search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {suppliers.map(supplier => (
        <SupplierCardB 
          key={supplier.id} 
          supplier={supplier} 
          onSelect={onSelect} 
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default SupplierGrid;