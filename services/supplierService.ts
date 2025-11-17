import { Supplier, Contract } from '../types';

// Mock Data
let suppliers: Supplier[] = [
  {
    id: '1',
    name: 'Aerojet Rocketdyne',
    category: 'Aerospace & Propulsion',
    location: 'Sacramento, CA',
    fullAddress: '2001 Aerojet Rd, Sacramento, CA 95813, USA',
    description: 'Aerojet Rocketdyne is a world-recognized aerospace and defense leader that provides propulsion and energetics to the space, missile defense and strategic systems, tactical systems and armaments areas, in support of domestic and international markets.',
    logoUrl: 'https://logo.clearbit.com/rocket.com',
    cageCode: '1A2B3',
    ueid: 'ABC123456789',
    contractIds: ['101', '103'],
    countryCode: 'USA',
  },
  {
    id: '2',
    name: 'Lockheed Martin',
    category: 'Defense & Aerospace',
    location: 'Bethesda, MD',
    fullAddress: '6801 Rockledge Dr, Bethesda, MD 20817, USA',
    description: 'Lockheed Martin is a global security and aerospace company that is principally engaged in the research, design, development, manufacture, integration and sustainment of advanced technology systems, products and services.',
    logoUrl: 'https://logo.clearbit.com/lockheedmartin.com',
    cageCode: '2B3C4',
    ueid: 'DEF456789012',
    contractIds: ['101', '102'],
    countryCode: 'USA',
    parentId: '10'
  },
  {
    id: '3',
    name: 'SpaceX',
    category: 'Launch Services',
    location: 'Hawthorne, CA',
    fullAddress: 'Rocket Rd, Hawthorne, CA 90250, USA',
    description: 'SpaceX designs, manufactures and launches advanced rockets and spacecraft. The company was founded in 2002 to revolutionize space technology, with the ultimate goal of enabling people to live on other planets.',
    logoUrl: 'https://logo.clearbit.com/spacex.com',
    cageCode: '3C4D5',
    ueid: 'GHI789012345',
    contractIds: ['102'],
    countryCode: 'USA',
  },
  {
    id: '4',
    name: 'Boeing',
    category: 'Aerospace & Defense',
    location: 'Chicago, IL',
    fullAddress: '100 N Riverside Plaza, Chicago, IL 60606, USA',
    description: 'Boeing is the world\'s largest aerospace company and leading manufacturer of commercial jetliners, defense, space and security systems, and service provider of aftermarket support.',
    logoUrl: 'https://logo.clearbit.com/boeing.com',
    cageCode: '4D5E6',
    ueid: 'JKL012345678',
    contractIds: ['103'],
    countryCode: 'USA',
  },
  {
    id: '5',
    name: 'Northrop Grumman',
    category: 'Defense & Aerospace',
    location: 'Falls Church, VA',
    fullAddress: '2980 Fairview Park Dr, Falls Church, VA 22042, USA',
    description: 'Northrop Grumman is a leading global security company providing innovative systems, products and solutions in autonomous systems, cyber, C4ISR, space, strike, and logistics and modernization to customers worldwide.',
    logoUrl: 'https://logo.clearbit.com/northropgrumman.com',
    cageCode: '5E6F7',
    ueid: 'MNO901234567',
    contractIds: ['101'],
    countryCode: 'USA',
  },
  {
    id: '6',
    name: 'Thales Alenia Space',
    category: 'Satellite Manufacturing',
    location: 'Cannes, France',
    fullAddress: '100 Boulevard du Midi, 06150 Cannes, France',
    description: 'Thales Alenia Space is the joint venture between Thales (67%) and Leonardo (33%) and forms with Telespazio a "Space Alliance". It is a European leader in satellite systems and at the forefront of orbital infrastructures.',
    logoUrl: 'https://logo.clearbit.com/thalesgroup.com',
    cageCode: '6F7G8',
    ueid: 'PQR678901234',
    contractIds: ['104'],
    countryCode: 'FRA',
  },
   {
    id: '7',
    name: 'Sierra Nevada Corporation',
    category: 'Aerospace & Defense',
    location: 'Sparks, NV',
    fullAddress: '444 Salomon Cir, Sparks, NV 89434, USA',
    description: 'Sierra Nevada Corporation (SNC) is an American aerospace and defense company that provides technology solutions in the areas of space, aviation, electronics, and systems integration.',
    logoUrl: 'https://logo.clearbit.com/sncorp.com',
    cageCode: '7G8H9',
    ueid: 'STU567890123',
    contractIds: ['105'],
    countryCode: 'USA',
  },
  {
    id: '8',
    name: 'Maxar Technologies',
    category: 'Space Technology',
    location: 'Westminster, CO',
    fullAddress: '1300 W 120th Ave, Westminster, CO 80234, USA',
    description: 'Maxar is a trusted partner and innovator in Earth Intelligence and Space Infrastructure. We deliver disruptive value to government and commercial customers to help them monitor, understand and navigate our changing planet.',
    logoUrl: 'https://logo.clearbit.com/maxar.com',
    cageCode: '8H9I0',
    ueid: 'VWX456789012',
    contractIds: ['104'],
    countryCode: 'USA',
  },
  {
    id: '10',
    name: 'United Launch Alliance (ULA)',
    category: 'Launch Services',
    location: 'Centennial, CO',
    fullAddress: '9501 E Panorama Cir, Centennial, CO 80112, USA',
    description: 'United Launch Alliance is an American spacecraft launch service provider that manufactures and operates a number of rocket vehicles that are capable of launching spacecraft into orbits around Earth and to other bodies in the Solar System.',
    logoUrl: 'https://logo.clearbit.com/ulalaunch.com',
    cageCode: '1J2K3',
    ueid: 'YZA123456789',
    contractIds: ['102'],
    countryCode: 'USA',
  },
];

let contracts: Contract[] = [
  { id: '101', name: 'Artemis Program Propulsion Systems', contractNumber: 'NNM07AB03C', description: 'Development and supply of main propulsion systems for the Space Launch System (SLS) rocket, a key component of the Artemis program designed to return humans to the Moon.', supplierIds: ['1', '2', '5'] },
  { id: '102', name: 'Commercial Crew Transportation', contractNumber: 'NNK14MA74C', description: 'Provides transportation of NASA astronauts to and from the International Space Station (ISS) via privately developed and operated spacecraft.', supplierIds: ['3', '2', '10'] },
  { id: '103', name: 'James Webb Space Telescope (JWST) Optics', contractNumber: 'NAS5-02200', description: 'The manufacturing, assembly, and testing of the primary mirror segments and optical systems for the James Webb Space Telescope.', supplierIds: ['1', '4'] },
  { id: '104', name: 'Earth Observation Satellite Constellation', contractNumber: 'NNG15SC71B', description: 'Design, build, and launch a constellation of high-resolution Earth observation satellites for climate monitoring and disaster response.', supplierIds: ['6', '8'] },
  { id: '105', name: 'Dream Chaser Cargo Resupply', contractNumber: 'NNC16Z S001K', description: 'Commercial Resupply Services 2 (CRS-2) contract to deliver cargo to the International Space Station using the Dream Chaser reusable spaceplane.', supplierIds: ['7'] },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getSuppliers = async (): Promise<Supplier[]> => {
  await simulateDelay(500);
  return [...suppliers];
};

export const getContracts = async (): Promise<Contract[]> => {
  await simulateDelay(500);
  return [...contracts];
};

export const removeSupplier = async (id: string): Promise<boolean> => {
  await simulateDelay(300);
  const initialLength = suppliers.length;
  suppliers = suppliers.filter(s => s.id !== id);
  return suppliers.length < initialLength;
};

export const addSupplier = async (supplierData: Omit<Supplier, 'id' | 'logoUrl' | 'contractIds'>): Promise<Supplier> => {
  await simulateDelay(400);
  const newSupplier: Supplier = {
    ...supplierData,
    id: String(Date.now()),
    logoUrl: `https://logo.clearbit.com/${supplierData.name.toLowerCase().replace(/ /g, '').replace(/[.]/g, '')}.com`,
    contractIds: [],
  };
  suppliers.unshift(newSupplier);
  return newSupplier;
};

export const updateSupplier = async (updatedSupplier: Supplier): Promise<Supplier> => {
  await simulateDelay(400);
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    return updatedSupplier;
  }
  throw new Error('Supplier not found');
};