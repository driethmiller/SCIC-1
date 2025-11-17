import React from 'react';
import { Supplier } from '../types';
import LocationIcon from './icons/LocationIcon';
import CategoryIcon from './icons/CategoryIcon';
// fix: Use named import for TrashIcon as it is a named export.
import { TrashIcon } from './icons/TrashIcon';

interface SupplierCardProps {
  supplier: Supplier;
  onSelect: (supplier: Supplier) => void;
  onRemove: (id: string) => void;
}

const SupplierCardB: React.FC<SupplierCardProps> = ({ supplier, onSelect, onRemove }) => {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(supplier.id);
  };

  return (
    <div
      className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700 group relative cursor-pointer hover:border-blue-500 transition-all duration-300"
      onClick={() => onSelect(supplier)}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect(supplier)}
      role="button"
      aria-label={`View details for ${supplier.name}`}
    >
      <div className="p-5">
        <div className="flex items-center space-x-4 mb-4">
          <img
            className="h-14 w-14 rounded-full object-cover border-2 border-gray-600"
            src={supplier.logoUrl}
            alt={`${supplier.name} logo`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate">{supplier.name}</h3>
            <p className="text-sm text-gray-400 font-mono truncate">CAGE: {supplier.cageCode}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-300">
            <CategoryIcon className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            <span className="truncate">{supplier.category}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <LocationIcon className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
            <span className="truncate">{supplier.location}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleRemoveClick}
        className="absolute top-3 right-3 p-1.5 bg-gray-900/50 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label={`Remove ${supplier.name}`}
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SupplierCardB;