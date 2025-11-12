import { ApiResponse_Supplier } from '../types';
import { PAGE_SIZE } from '../constants';

const API_BASE_URL = 'https://meta.gsfc.nasa.gov/IntelexLogin/Intelex/api/v2/object/SupplManagement_SupplManagementObject';

// Credentials for Basic Authentication provided by the user.
const USERNAME = 'JscSASAPI';
const PASSWORD = 'JscSASAPI';
// btoa is a standard browser function for Base64 encoding.
const AUTH_TOKEN = `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`;

export const fetchSuppliers = async (page: number, searchTerm: string): Promise<ApiResponse_Supplier> => {
  const skip = (page - 1) * PAGE_SIZE;

  let filterQuery = `SupplierName ne null`; //CAGEStatus/Description eq 'Active'`;

  if (searchTerm) {
    const searchFilter = [
      `contains(SupplierNo, '${searchTerm}')`,
      `contains(SupplierName, '${searchTerm}')`,
      `contains(CAGECodeConcat, '${searchTerm}')`,
      `contains(UEID, '${searchTerm}')`,
      `contains(SupplierAddress, '${searchTerm}')`,
      `contains(City, '${searchTerm}')`,
      `contains(StateProvince/Caption, '${searchTerm}')`,
      `contains(Province/Caption, '${searchTerm}')`,
      `contains(StateProvince2, '${searchTerm}')`,
      `contains(CountryList/Caption, '${searchTerm}')`,
      `contains(ZIPCodeConcat, '${searchTerm}')`,
      `contains(PostalCode, '${searchTerm}')`,
      `contains(CAGEStatus/Description, '${searchTerm})`,
    ].join(' or ');
    filterQuery += ` and (${searchFilter})`;
  }

  const params = new URLSearchParams({
    '$count': 'true',
    '$filter': filterQuery,
    '$select': 'SupplierNo,SupplierName,CAGECodeConcat,UEID,SupplierAddress,City,ZIPCodeConcat,PostalCode,StateProvince2,SupplierWebsite',
    '$expand': 'StateProvince($select=Caption),Province($select=Caption),CountryList($select=Caption),CAGEStatus($select=Description)',
    '$top': PAGE_SIZE.toString(),
    '$skip': skip.toString(),
    '$orderby': 'SupplierNo'
  });

  try {
    const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
      headers: {
        'Authorization': AUTH_TOKEN
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. The provided API credentials may be incorrect or expired.');
      }
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const data: ApiResponse_Supplier = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    // Propagate specific, user-friendly errors to the UI.
    if (error instanceof Error && error.message.startsWith('Authentication failed')) {
      throw error;
    }
    throw new Error('Could not fetch supplier data. The API may be down or experiencing issues.');
  }
};