export type ViewType = 'dashboard' | 'Suppliers' | 'SupplierInfo' | 'TravelAdvisories' | 'RSSAdvisories';

export interface Supplier {
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
  CAGEStatus: { Description:string };
}

export interface ApiResponse_Supplier {
  '@odata.count': number;
  value: Supplier[];
}

export interface TravelAdvisory {
  country: string;
  level: number;
  details: string;
  lastUpdated: string;
}

export interface RSSAdvisory {
  id: string;
  country: string;
  link: string;
  pubDate: string;
  level: number;
  levelDescription: string;
}