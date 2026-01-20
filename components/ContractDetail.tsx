import React from 'react';
import { Contract, Supplier } from '../modules/types';
import {ArrowLeft, Scroll} from 'lucide-react';

interface ContractDetailProps {
  contract: Contract;
  suppliers: Supplier[];
  onBack: () => void;
  onSelectSupplier: (supplier: Supplier) => void;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contract, suppliers, onBack, onSelectSupplier }) => {

  const associatedSuppliers = suppliers.filter(s => contract.supplierIds.includes(s.id));

  return (
    // Fix: Renamed animation class to avoid global scope conflicts.
    <div className="animate-detail-fade-in">
        <div className="mb-8">
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Supplier Details</span>
            </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700 p-8 max-w-4xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <Scroll className="w-8 h-8 mr-3 text-purple-400" />
                    <div>
                        <h1 className="text-3xl font-extrabold text-white">{contract.name}</h1>
                        <p className="text-gray-400 font-mono tracking-wider">{contract.contractNumber}</p>
                    </div>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg mt-4">
                    {contract.description}
                </p>
            </div>
            
            <div className="mt-8 border-t border-gray-700 pt-6">
                <h3 className="text-xl font-bold text-white mb-4">Associated Suppliers ({associatedSuppliers.length})</h3>
                {associatedSuppliers.length > 0 ? (
                    <ul className="space-y-3">
                        {associatedSuppliers.map(supplier => (
                            <li 
                                key={supplier.id}
                                onClick={() => onSelectSupplier(supplier)}
                                className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && onSelectSupplier(supplier)}
                            >
                                <img src={supplier.logoUrl} alt={`${supplier.name} logo`} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-semibold text-white">{supplier.name}</p>
                                    <p className="text-sm text-gray-400">{supplier.category}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No suppliers are currently associated with this contract.</p>
                )}
            </div>
        </div>

        {/* Fix: Replaced unsupported <style jsx> with a standard <style> tag and renamed animations to be component-specific. */}
        <style>{`
            @keyframes detail-fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-detail-fade-in {
                animation: detail-fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default ContractDetail;