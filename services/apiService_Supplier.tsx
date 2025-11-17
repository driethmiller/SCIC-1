import { ApiResponse_Supplier } from '../types';
import { PAGE_SIZE } from '../constants';

const API_BASE_URL = 'https://meta-test.gsfc.nasa.gov/IntelexLogin/Intelex/api/v2/object/SupplManagement_SupplManagementObject';

// Credentials for Basic Authentication provided by the user.
const USERNAME = 'JscSASAPI';
const PASSWORD = 'JscSAS_API';
// btoa is a standard browser function for Base64 encoding.
const AUTH_TOKEN = `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`;

export const fetchSuppliers = async (
  page: number, 
  searchTerm: string, 
  country: string, 
  cageStatus: string
): Promise<ApiResponse_Supplier> => {
  const skip = (page - 1) * PAGE_SIZE;

  // Base parameters are handled by URLSearchParams for safety and convenience.
  const params = new URLSearchParams({
    '$count': 'true',
    '$select': 'SupplierNo,SupplierName,CAGECodeConcat,UEID,SupplierAddress,City,ZIPCodeConcat,PostalCode,StateProvince2,SupplierWebsite',
    '$expand': 'StateProvince($select=Caption),Province($select=Caption),CountryList($select=Caption),CAGEStatus($select=Description),Contracts($filter=ModNum eq \'0\';$select=ContractNo),Projects($select=AcronymAbbrevia)',
    // '$top':'200',
    '$top': PAGE_SIZE.toString(),
    '$skip': skip.toString(),
    '$orderby': 'SupplierNo'
  });

  let filterQuery = `SupplierName ne null`;

  if (searchTerm) {
    // For OData, single quotes in the search term must be escaped by doubling them.
    const sanitizedSearchTerm = searchTerm.replace(/'/g, "''");

    const searchFilter = [
      `contains(SupplierNo, '${sanitizedSearchTerm}')`,
      `contains(SupplierName, '${sanitizedSearchTerm}')`,
      `contains(CAGECodeConcat, '${sanitizedSearchTerm}')`,
      `contains(UEID, '${sanitizedSearchTerm}')`,
      `contains(SupplierAddress, '${sanitizedSearchTerm}')`,
      `contains(City, '${sanitizedSearchTerm}')`,
      `contains(StateProvince/Caption, '${sanitizedSearchTerm}')`,
      `contains(Province/Caption, '${sanitizedSearchTerm}')`,
      `contains(StateProvince2, '${sanitizedSearchTerm}')`,
      `contains(CountryList/Caption, '${sanitizedSearchTerm}')`,
      `contains(ZIPCodeConcat, '${sanitizedSearchTerm}')`,
      `contains(PostalCode, '${sanitizedSearchTerm}')`,
      `contains(CAGEStatus/Description, '${sanitizedSearchTerm}')`,
      `Contracts/any(c: contains(c/ContractNo, '${sanitizedSearchTerm}'))`,
      `Projects/any(p: contains(p/AcronymAbbrevia, '${sanitizedSearchTerm}'))`
    ].join(' or ');

    filterQuery += ` and (${searchFilter})`;
  }

  if (country) {
    const sanitizedCountry = country.replace(/'/g, "''");
    filterQuery += ` and contains(CountryList/Caption, '${sanitizedCountry}')`;
  }

  if (cageStatus && cageStatus !== 'All') {
    const sanitizedCageStatus = cageStatus.replace(/'/g, "''");
    filterQuery += ` and CAGEStatus/Description eq '${sanitizedCageStatus}'`;
  }


  // Manually encode and append the filter query. This gives us full control
  // over the encoding, preventing the double-encoding issues and correctly
  // handling special characters like parentheses in the search term.
  const queryString = `${params.toString()}&$filter=${encodeURIComponent(filterQuery)}`;

  // The final URL is constructed by replacing '+' with '%20' for OData compatibility.
  const finalUrl = `${API_BASE_URL}?${queryString.replace(/\+/g, '%20')}`;

  try {
    const response = await fetch(finalUrl, {
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