import React from 'react';
import { Supplier, UserRole } from '../types';
// fix: Use named import for TrashIcon as it is a named export.
import { TrashIcon } from './icons/TrashIcon';

interface SupplierListProps {
  suppliers: Supplier[];
  isLoading: boolean;
  error: string | null;
  onRemove: (id: string) => void;
  onSelect: (supplier: Supplier) => void;
  currentUserRole: UserRole;
}

const LoadingSkeletonRow: React.FC = () => (
    <tr className="bg-gray-800/50 animate-pulse">
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700"></div>
                <div className="ml-4">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                </div>
            </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-48"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-16"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="h-4 bg-gray-700 rounded w-24"></div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div className="h-8 w-8 bg-gray-700 rounded-full ml-auto"></div>
        </td>
    </tr>
);

const SupplierList: React.FC<SupplierListProps> = ({ suppliers, isLoading, error, onRemove, onSelect, currentUserRole }) => {
  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }
  
  const handleRemoveClick = (e: React.MouseEvent, supplierId: string) => {
    e.stopPropagation();
    onRemove(supplierId);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Supplier
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Location
                        </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            CAGE Code
                        </th>
                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            UEID
                        </th>
                        {currentUserRole === 'SCIC Contributor' && (
                          <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                          </th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-gray-800/70 divide-y divide-gray-700">
                    {isLoading ? (
                        Array.from({ length: 6 }).map((_, index) => <LoadingSkeletonRow key={index} />)
                    ) : suppliers.length === 0 ? (
                        <tr>
                            <td colSpan={currentUserRole === 'SCIC Contributor' ? 6 : 5} className="text-center text-gray-400 py-10">
                                <h3 className="text-xl font-semibold">No suppliers found.</h3>
                                <p>Try adjusting your search term.</p>
                            </td>
                        </tr>
                    ) : (
                        suppliers.map(supplier => (
                            <tr 
                                key={supplier.id} 
                                onClick={() => onSelect(supplier)}
                                className="hover:bg-gray-700/50 transition-colors duration-200 cursor-pointer"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && onSelect(supplier)}
                                role="button"
                                aria-label={`View details for ${supplier.name}`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={supplier.logoUrl} alt={`${supplier.name} logo`} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-white">{supplier.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-300">{supplier.category}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300">{supplier.location}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300 font-mono">{supplier.cageCode}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-gray-300 font-mono">{supplier.ueid}</span>
                                </td>
                                {currentUserRole === 'SCIC Contributor' && (
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                          onClick={(e) => handleRemoveClick(e, supplier.id)}
                                          className="p-1.5 bg-gray-700/50 rounded-full text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-200"
                                          aria-label={`Remove ${supplier.name}`}
                                      >
                                          <TrashIcon className="w-5 h-5" />
                                      </button>
                                  </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default SupplierList;