
import React from 'react';
import { SupplierData, CAGEStatus } from '../modules/types';
import '../Styles.css';

interface CAGEStatusProps {
  cageStatus: CAGEStatus;
}
const getStatusInfo = (Code: string) => {
    switch(Code) {
        case '1': return { text: 'Proposed Debarment', color: 'bg-blue-900/50 text-red-300', borderColor: 'border-red-500' };
        case '2': return { text: 'Suspended', color: 'bg-yellow-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'A': return { text: 'Active', color: 'bg-green-900/30 text-green-400', borderColor: 'border-green-800' };
        case 'C': return { text: 'Restraint', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'E': return { text: 'Debarred', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'F': return { text: 'Obsolete', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'J': return { text: 'Specialized Use', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'N': return { text: 'Cancelled', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'P': return { text: 'Cancelled Without Replacement', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'R': return { text: 'Cancelled/Replaced', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        case 'W': return { text: 'Active With Restraint', color: 'bg-green-900/30 text-blue-400', borderColor: 'border-blue-800' };
        case 'Y': return { text: 'Active Specialized Use', color: 'bg-green-900/30 text-blue-400', borderColor: 'border-blue-800' };
        default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300', borderColor: 'border-gray-500' };
    }
}

const StatusInfo: React.FC<CAGEStatusProps> = ( cageStatus ) => {

  return null;
}

interface SupplierRowProps {
  supplier: SupplierData;
  onSelect?: (supplier: SupplierData) => void;
}

const InfoRow: React.FC<{ icon: React.ReactElement, label: string; value: string | null | undefined }> = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-start text-sm">
            <span className="text-blue-400 mr-2 mt-0.5 flex-shrink-0">{icon}</span>
            <span className="font-semibold text-gray-400 mr-2">{label}{label ? ':' : ''}</span>
            <span className="text-gray-200 break-words">{value}</span>
        </div>
    );
};

const SupplierDataRow: React.FC<SupplierRowProps> = ({ supplier, onSelect }) => {
  const fullAddress = [
    supplier.Street,
    supplier.City,
    supplier.USAState?.StateName || supplier.CANProvince?.ProvinceName || supplier.Territory,
    supplier.ZIPCode || supplier.PostalCode,
    supplier.Country?.CountryName
  ].filter(Boolean).join(', ');

  // To resolve the cageStatus error on search
  const cageStatusCode = supplier.CAGEStatus?.Code;
  const cageStatus = supplier.CAGEStatus?.Description;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] flex flex-col">

        <table className="w-full SupplierTable" width="100%">
            <tbody>
                <tr>
                      <td className="SupplierList" align="left" valign="middle" >
                        <h4 
                          className={`text-lg font-bold text-blue-300 break-words ${onSelect ? 'cursor-pointer hover:text-blue-400 hover:underline' : ''}`}
                          onClick={() => onSelect && onSelect(supplier)}
                        >
                          {supplier.SupplierName || 'No Name Provided'}
                        </h4>
                    </td>
                      <td width="10%" align="center" valign="middle" className="text-gray-200 break-words">
                        {supplier.SupplierNumber}
                    </td>
                      <td width="20%" align="center" valign="middle" className="text-gray-200 break-words">
                        {supplier.UEI}
                    </td>
                      <td width="20%" align="center" valign="middle" className="text-gray-200 break-words">
                        {supplier.CAGECode}&nbsp;&nbsp;
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cageStatusCode === 'A'
                            ? 'bg-green-900/30 text-green-400 border-green-800'
                            : cageStatusCode === 'W' || cageStatusCode === 'Y'
                                ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                                : 'bg-red-900/30 text-red-400 border-red-800'
                            }`}>
                            {cageStatus || 'N/A'}
                        </span>
                    </td>
                      <td width="20%" align="center" valign="middle">
                        <div className="space-y-3 flex-grow">
                            <InfoRow
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                label=""
                                value={fullAddress}
                            />
                        </div>
                    </td>
                    <td width="20%" align="center" valign="top">
                          {supplier.Website && (
                              <div className="mt-auto pt-4 border-t border-gray-700">
                                  <a
                                      href={supplier.Website.startsWith('http') ? supplier.Website : `https://${supplier.Website}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                                  >
                                      Visit Website
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                      </svg>
                                  </a>
                              </div>
                          )}
                    </td>
                </tr>
            </tbody>
        </table>


    </div>
  );
};

export default SupplierDataRow;
