import React from 'react';
import { Supplier, Contract, UserRole } from '../modules/types';
import {ArrowLeft,MapPin,Shapes,FingerprintPattern,Scroll,Pencil,ChartNoAxesGantt} from 'lucide-react';

interface SupplierDetailProps {
  supplier: Supplier;
  allSuppliers: Supplier[];
  contracts: Contract[];
  onBack: () => void;
  onSelectContract: (contract: Contract) => void;
  onSelectSupplier: (supplier: Supplier) => void;
  // Fix: Add onEdit prop to handle editing the supplier.
  onEdit: (supplier: Supplier) => void;
  // Fix: Add currentUserRole to conditionally render the edit button.
  currentUserRole: UserRole;
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplier, allSuppliers, contracts, onBack, onSelectContract, onSelectSupplier, onEdit, currentUserRole }) => {
  const associatedContracts = contracts.filter(c => supplier.contractIds.includes(c.id));
  const parentSupplier = allSuppliers.find(s => s.id === supplier.parentId);
  const childSuppliers = allSuppliers.filter(s => s.parentId === supplier.id);

  return (
    // Fix: Renamed animation class to avoid global scope conflicts.
    <div className="animate-detail-fade-in">
        <div className="mb-8 flex justify-between items-center">
            <button
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Main List</span>
            </button>
            {currentUserRole === 'SCIC Contributor' && (
                <button
                    onClick={() => onEdit(supplier)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-semibold"
                >
                    <Pencil className="w-5 h-5" />
                    <span>Edit Supplier</span>
                </button>
            )}
        </div>
      
        <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-8">
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <img className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 shadow-md" src={supplier.logoUrl} alt={`${supplier.name} logo`} />
                    <div className="flex-1">
                        <h1 className="text-3xl font-extrabold text-white">{supplier.name}</h1>
                        <p className="text-gray-300 leading-relaxed mt-2">{supplier.description}</p>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="flex items-start bg-gray-700/50 p-3 rounded-lg lg:col-span-1">
                        <Shapes className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="text-gray-300">{supplier.category}</span>
                    </div>
                    <div className="flex items-start bg-gray-700/50 p-3 rounded-lg lg:col-span-2">
                        <FingerprintPattern className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="font-mono text-gray-300">CAGE: {supplier.cageCode} | UEID: {supplier.ueid}</span>
                    </div>
                     <div className="flex items-start bg-gray-700/50 p-3 rounded-lg md:col-span-2 lg:col-span-3">
                        <MapPin className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0 mt-1" />
                        <span className="text-gray-300">{supplier.fullAddress}</span>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <ChartNoAxesGantt className="w-6 h-6 mr-3 text-green-400" />
                    Corporate Structure
                </h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Parent Company</h4>
                        {parentSupplier ? (
                             <div 
                                onClick={() => onSelectSupplier(parentSupplier)}
                                className="bg-gray-700/50 p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onSelectSupplier(parentSupplier)}>
                                <img src={parentSupplier.logoUrl} alt="" className="w-8 h-8 rounded-full"/>
                                <span className="text-white font-medium">{parentSupplier.name}</span>
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-sm">This is a top-level entity.</p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-2">Subsidiaries ({childSuppliers.length})</h4>
                        {childSuppliers.length > 0 ? (
                           <ul className="space-y-2">
                                {childSuppliers.map(child => (
                                     <li key={child.id}
                                        onClick={() => onSelectSupplier(child)}
                                        className="bg-gray-700/50 p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                        role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onSelectSupplier(child)}>
                                        <img src={child.logoUrl} alt="" className="w-8 h-8 rounded-full"/>
                                        <span className="text-white font-medium">{child.name}</span>
                                    </li>
                                ))}
                           </ul>
                        ) : (
                             <p className="text-gray-400 italic text-sm">No subsidiary suppliers listed.</p>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="border-t border-gray-700 p-8">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Scroll className="w-6 h-6 mr-3 text-purple-400" />
                    Associated Contracts ({associatedContracts.length})
                </h3>
                {associatedContracts.length > 0 ? (
                    <ul className="space-y-3">
                        {associatedContracts.map(contract => (
                            <li 
                                key={contract.id}
                                onClick={() => onSelectContract(contract)}
                                className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => e.key === 'Enter' && onSelectContract(contract)}
                            >
                                <Scroll className="w-6 h-6 text-purple-400 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-white">{contract.name}</p>
                                    <p className="text-sm text-gray-400 font-mono">{contract.contractNumber}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">This supplier is not currently associated with any major contracts in this list.</p>
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

export default SupplierDetail;