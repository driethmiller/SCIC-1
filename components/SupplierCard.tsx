import React from 'react';
import { Supplier } from '../types';
import { HashtagIcon } from './icons/HashtagIcon';
import { BarcodeIcon } from './icons/BarcodeIcon';
import { IdentificationIcon } from './icons/IdentificationIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';

interface SupplierCardProps {
  supplier: Supplier;
  onClick: () => void;
}

const InfoRow: React.FC<{ icon: React.ReactElement, label: string; value: string | null | undefined }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start text-sm">
            <span className="text-blue-400 mr-2 mt-0.5 flex-shrink-0">{icon}</span>
            <span className="font-semibold text-gray-400 mr-2">{label}:</span>
            <span className="text-gray-200 break-words">{value}</span>
        </div>
    );
};

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => {
  const fullAddress = [
    supplier.SupplierAddress,
    supplier.City,
    supplier.StateProvince?.Caption || supplier.Province?.Caption || supplier.StateProvince2,
    supplier.ZIPCodeConcat || supplier.PostalCode,
    supplier.CountryList.Caption
  ].filter(Boolean).join(', ');

  return (
    <button
      onClick={onClick}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] flex flex-col text-left w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-blue-500"
      aria-label={`View details for ${supplier.SupplierName}`}
    >
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-blue-300 break-words">{supplier.SupplierName || 'No Name Provided'}</h3>
          <p className="text-xs text-gray-400">
            {supplier.SupplierNo}&nbsp;&nbsp;&nbsp;&nbsp;
            CAGE: {supplier.CAGECodeConcat} {supplier.CAGEStatus ? `( ${supplier.CAGEStatus.Description} )` : ''}&nbsp;&nbsp;&nbsp;&nbsp;
            UEI: {supplier.UEID || 'N/A'}
          </p>
        </div>

        <div className="space-y-3 flex-grow mb-4">
          <InfoRow 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            label="Address" 
            value={fullAddress} 
          />
        </div>

        {supplier.SupplierWebsite && (
          <div className="mt-auto pt-4 border-t border-gray-700">
            <a
              href={supplier.SupplierWebsite.startsWith('http') ? supplier.SupplierWebsite : `https://${supplier.SupplierWebsite}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
              onClick={(e) => e.stopPropagation()} // Prevent modal from opening when clicking the link
            >
              Visit Website
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </button>
  );
};

export default SupplierCard;
