import React, { useState } from 'react';
import { SupplierData } from '../modules/types';
import { ArrowLeft, MapPin, Building2, Globe, Hash, FileText } from 'lucide-react';

interface SupplierDataDetailProps {
  supplier: SupplierData;
  onBack: () => void;
}

const SupplierDataDetail: React.FC<SupplierDataDetailProps> = ({ supplier, onBack }) => {
  const [logoError, setLogoError] = useState(false);

  // Generate logo URL from website
  const getLogoUrl = (): string | null => {
    if (supplier.Website) {
      // Extract domain from website URL
      let domain = supplier.Website;
      domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      // Use Logo.dev API for high-resolution company logos
      return `https://img.logo.dev/${domain}?token=pk_WxTY5IU0SveBNwrcoPPOTg`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  const fullAddress = [
    supplier.Street,
    supplier.City,
    supplier.USAState?.StateName || supplier.CANProvince?.ProvinceName || supplier.Territory,
    supplier.ZIPCode || supplier.PostalCode,
    supplier.Country?.CountryName
  ].filter(Boolean).join(', ');

  const cageStatusCode = supplier.CAGEStatus?.Code;
  const cageStatus = supplier.CAGEStatus?.Description;

  return (
    <div className="animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Supplier List</span>
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-lg bg-gray-700 flex items-center justify-center border-4 border-gray-600 shadow-md overflow-hidden">
              {logoUrl && !logoError ? (
                <img
                  src={logoUrl}
                  alt={`${supplier.SupplierName} logo`}
                  className="w-full h-full object-contain p-2"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Building2 className="w-12 h-12 text-blue-400" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white">{supplier.SupplierName || 'No Name Provided'}</h1>
              <p className="text-gray-400 mt-1">Supplier ID: {supplier.SupplierNumber}</p>
            </div>
            <div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                cageStatusCode === 'A'
                  ? 'bg-green-900/30 text-green-400 border-green-800'
                  : cageStatusCode === 'W' || cageStatusCode === 'Y'
                    ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                    : 'bg-red-900/30 text-red-400 border-red-800'
              }`}>
                {cageStatus || 'N/A'}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identifiers Section */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-400" />
                Identifiers
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Supplier Number:</span>
                  <span className="text-white font-mono">{supplier.SupplierNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CAGE Code:</span>
                  <span className="text-white font-mono">{supplier.CAGECode || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">UEI:</span>
                  <span className="text-white font-mono">{supplier.UEI || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Internal ID:</span>
                  <span className="text-white font-mono">{supplier.Id || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Address
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Street:</span>
                  <p className="text-white">{supplier.Street || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">City:</span>
                  <p className="text-white">{supplier.City || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">State/Province:</span>
                  <p className="text-white">
                    {supplier.USAState?.StateName || supplier.CANProvince?.ProvinceName || supplier.Territory || 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">ZIP/Postal Code:</span>
                  <p className="text-white">{supplier.ZIPCode || supplier.PostalCode || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400">Country:</span>
                  <p className="text-white">{supplier.Country?.CountryName || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Status & Metadata
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">CAGE Status:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    cageStatusCode === 'A'
                      ? 'bg-green-900/30 text-green-400 border-green-800'
                      : cageStatusCode === 'W' || cageStatusCode === 'Y'
                        ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                        : 'bg-red-900/30 text-red-400 border-red-800'
                  }`}>
                    {cageStatus || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created By:</span>
                  <span className="text-white">{supplier.CreatedBy || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date Created:</span>
                  <span className="text-white">
                    {supplier.DateCreated ? new Date(supplier.DateCreated).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Website Section */}
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                Website
              </h3>
              {supplier.Website ? (
                <a
                  href={supplier.Website.startsWith('http') ? supplier.Website : `https://${supplier.Website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  {supplier.Website}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <p className="text-gray-400 italic">No website provided</p>
              )}
            </div>
          </div>

          {/* Full Address Display */}
          {fullAddress && (
            <div className="mt-6 bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                Full Address
              </h3>
              <p className="text-gray-200">{fullAddress}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SupplierDataDetail;
