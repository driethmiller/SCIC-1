export type ViewType = 'SupplierData' | 'TravelAdvisories' | 'Suppliers' | 'dashboard' | 'list';

export interface CANProvince {
  Alpha2: string;
  ProvinceName: string;
}

export interface USAState {
  Alpha2: string;
  StateName: string;
}

export interface Country {
  Alpha3: string;
  CountryName: string;
}

export interface CAGEStatus {
  Code: string;
  Description: string;
}

export interface RawSupplierData {
  SupplierNumber: string;
  Id: string;
  SupplierName: string;
  CAGECode: string;
  UEI: string | null;
  Street: string;
  City: string;
  Territory: string | null;
  ZIPCode: string | null;
  PostalCode: string | null;
  Website: string | null;
  USAState: string | null;
  CANProvince: string | null;
  Country: string;
  CAGEStatus: string;
  CreatedBy: string;
  DateCreated: Date;
}

export interface SupplierData {
  SupplierNumber: string;
  Id: string;
  SupplierName: string;
  CAGECode: string;
  UEI: string | null;
  Street: string;
  City: string;
  Territory: string | null;
  ZIPCode: string | null;
  PostalCode: string | null;
  Website: string | null;
  USAState: USAState | null;
  CANProvince: CANProvince | null;
  Country: Country | null;
  CAGEStatus: CAGEStatus | null;
  CreatedBy: string;
  DateCreated: Date;
}

export interface TravelAdvisory {
  country: string;
  lastUpdated: string;
  level: number;
  details: string;
  link: string;
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