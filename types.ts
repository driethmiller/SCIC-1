export type ViewType = 'dashboard' | 'SupplierInfo' | 'TravelAdvisories' | 'RSSAdvisories' | 'SupplierMock' | 'SupplierTest' | '----------' | 'Suppliers';

export interface SupplierAPI {
  SupplierNo: string;
  SupplierName: string;
  CAGECodeConcat: string;
  UEID: string | null;
  SupplierAddress: string;
  City: string;
  ZIPCodeConcat: string | null;
  PostalCode: string | null;
  StateProvince2: string | null;
  SupplierWebsite: string | null;
  StateProvince: { Caption: string } | null;
  Province: { Caption: string } | null;
  CountryList: { Caption: string };
  CAGEStatus: { Description:string } | null;
  Contracts: { ContractNo: string }[] | null;
  Projects: { AcronymAbbrevia: string }[] | null;
}

export interface ApiResponse_Supplier {
  '@odata.count': number;
  value: SupplierAPI[];
}

export interface TravelAdvisory {
  country: string;
  lastUpdated: string;
  level: number;
  details: string;
  link: string;
}

export interface RSSAdvisory {
  id: string;
  country: string;
  link: string;
  pubDate: string;
  level: number;
  levelDescription: string;
}

export interface SupplierMock {
  cageCode: string;
  companyName: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  status: 'Active' | 'Inactive';
  // fix: Add optional lat and lon properties for mapping.
  lat?: number;
  lon?: number;
}

// Dave's
// Fix: Replaced incorrect file content with proper type definitions and exports.

export interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  fullAddress: string;
  description: string;
  logoUrl: string;
  cageCode: string;
  ueid: string;
  contractIds: string[];
  countryCode: string;
  parentId?: string;
}

export interface Contract {
  id: string;
  name: string;
  contractNumber: string;
  description: string;
  supplierIds: string[];
}

export type UserRole = 'SCIC Contributor' | 'SCIC Read-Only';