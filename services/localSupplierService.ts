
import { SupplierData, RawSupplierData, CAGEStatus, CANProvince, USAState, Country } from '../modules/types';

// Helper to fetch JSON data
const fetchData = async <T>(path: string): Promise<T> => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} fetching ${path}`);
    }
    return await response.json();
  } catch (e) {
    console.error(`Failed to fetch ${path}`, e);
    throw e;
  }
};

let cageStatusCache: CAGEStatus[] | null = null;
let canProvinceCache: CANProvince[] | null = null;
let usaStateCache: USAState[] | null = null;
let countryCache: Country[] | null = null;

export const fetchCAGEStatus = async (): Promise<CAGEStatus[]> => {
  if (!cageStatusCache) {
    cageStatusCache = await fetchData<CAGEStatus[]>('./data/CAGEStatus.json');
  }
  return cageStatusCache;
};

export const fetchCANProvince = async (): Promise<CANProvince[]> => {
  if (!canProvinceCache) {
    canProvinceCache = await fetchData<CANProvince[]>('./data/CANProvince.json');
  }
  return canProvinceCache;
};

export const fetchUSAState = async (): Promise<USAState[]> => {
  if (!usaStateCache) {
    usaStateCache = await fetchData<USAState[]>('./data/USAState.json');
  }
  return usaStateCache;
};

export const fetchCountry = async (): Promise<Country[]> => {
  if (!countryCache) {
    countryCache = await fetchData<Country[]>('./data/Country.json');
  }
  return countryCache;
};

export const fetchSupplierData = async (): Promise<SupplierData[]> => {
  console.log('Processing supplier data...');
  
  // Fetch all reference data in parallel
  const [cageStatusData, canProvinceData, countryData, usaStateData, rawData] = await Promise.all([
    fetchCAGEStatus(),
    fetchCANProvince(),
    fetchCountry(),
    fetchUSAState(),
    fetchData<RawSupplierData[]>('./data/SupplierData.json')
  ]);

  // Create maps for O(1) lookup
  const cageStatusMap = new Map(cageStatusData.map(item => [item.Code, item]));
  const canProvinceMap = new Map(canProvinceData.map(item => [item.Alpha2, item]));
  const countryMap = new Map(countryData.map(item => [item.Alpha3, item]));
  const usaStateMap = new Map(usaStateData.map(item => [item.Alpha2, item]));

  const enrichedData: SupplierData[] = rawData.map(raw => {
    return {
      SupplierNumber: raw.SupplierNumber,
      SupplierName: raw.SupplierName,
      CAGECode: raw.CAGECode,
      UEI: raw.UEI,
      Street: raw.Street,
      City: raw.City,
      Territory: raw.Territory,
      ZIPCode: raw.ZIPCode,
      PostalCode: raw.PostalCode,
      Website: raw.Website,
      USAState: raw.USAState ? (usaStateMap.get(raw.USAState) || null) : null,
      CANProvince: raw.CANProvince ? (canProvinceMap.get(raw.CANProvince) || null) : null,
      Country: countryMap.get(raw.Country) || null,
      CAGEStatus: cageStatusMap.get(raw.CAGEStatus) || null,
      CreatedBy: raw.CreatedBy,
      DateCreated: raw.DateCreated,
    };
  });

  console.log('Data processed:', enrichedData.length);
  return enrichedData;
};

function cacheCountry(map: Map<string, Country>, key: string): Country | null {
    return map.get(key) || null;
}

// dashboard
let rawDataCache: RawSupplierData[] | null = null;
export const fetchRawSupplierData = async (): Promise<RawSupplierData[]> => {
  if (!rawDataCache) {
    rawDataCache = await fetchData<RawSupplierData[]>('./data/SupplierData.json');
  }
  return rawDataCache;
};
