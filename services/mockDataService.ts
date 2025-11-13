import { TravelAdvisory, SupplierMock } from '../types';

const SIMULATED_DELAY = 1200; // in milliseconds

export const fetchTravelAdvisories = async (): Promise<TravelAdvisory[]> => {
  console.log('Fetching travel advisory data from file...');
  try {
    const response = await fetch('data/TravelAdvisory.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Travel advisory data fetched.');
    return data;
  } catch(e) {
      console.error("Failed to fetch travel advisories", e);
      // Return an empty array in case of error to avoid crashing the UI
      return [];
  }
};


export const fetchSuppliers = (): Promise<SupplierMock[]> => {
  console.log('Fetching supplier data...');
  return new Promise(resolve => setTimeout(() => {
    console.log('Supplier data fetched.');
    resolve(mockSuppliers);
  }, SIMULATED_DELAY));
};

const mockSuppliers: SupplierMock[] = [
  // US Suppliers
  // fix: Added lat/lon to each supplier for map display.
  { cageCode: '8A1B2', companyName: 'Advanced Tech Solutions', address: '123 Innovation Dr', city: 'Palo Alto', province: 'CA', zip: '94304', country: 'USA', status: 'Active', lat: 37.4419, lon: -122.1430 },
  { cageCode: '7C3D4', companyName: 'Global Logistics Inc.', address: '456 Supply Chain Blvd', city: 'Memphis', province: 'TN', zip: '38118', country: 'USA', status: 'Active', lat: 35.1495, lon: -90.0490 },
  { cageCode: '9E5F6', companyName: 'CyberSecure LLC', address: '789 Firewall Ave', city: 'Reston', province: 'VA', zip: '20190', country: 'USA', status: 'Active', lat: 38.9586, lon: -77.3570 },
  { cageCode: '6G7H8', companyName: 'InfraBuild Corp', address: '101 Construction Way', city: 'Houston', province: 'TX', zip: '77002', country: 'USA', status: 'Inactive', lat: 29.7604, lon: -95.3698 },
  { cageCode: '5J9K1', companyName: 'Quantum Computing Co.', address: '225 Entanglement Rd', city: 'Cambridge', province: 'MA', zip: '02139', country: 'USA', status: 'Active', lat: 42.3736, lon: -71.1097 },
  { cageCode: '4L2M3', companyName: 'BioGen Innovations', address: '876 Genome Valley', city: 'San Diego', province: 'CA', zip: '92121', country: 'USA', status: 'Active', lat: 32.7157, lon: -117.1611 },
  { cageCode: '3N4P5', companyName: 'Robotics & Automation Inc.', address: '555 Assembly Line', city: 'Detroit', province: 'MI', zip: '48226', country: 'USA', status: 'Active', lat: 42.3314, lon: -83.0458 },
  { cageCode: '2Q6R7', companyName: 'Midwest Manufacturing', address: '780 Industrial Park', city: 'Chicago', province: 'IL', zip: '60607', country: 'USA', status: 'Active', lat: 41.8781, lon: -87.6298 },
  { cageCode: '1S8T9', companyName: 'Pacific Aerospace', address: '4321 Jet Stream', city: 'Seattle', province: 'WA', zip: '98108', country: 'USA', status: 'Active', lat: 47.6062, lon: -122.3321 },
  { cageCode: '9U1V2', companyName: 'Eastern Electronics', address: '987 Circuit Board Ln', city: 'Raleigh', province: 'NC', zip: '27601', country: 'USA', status: 'Inactive', lat: 35.7796, lon: -78.6382 },
  { cageCode: '8W3X4', companyName: 'Florida Solar Solutions', address: '111 Sunshine Ave', city: 'Miami', province: 'FL', zip: '33101', country: 'USA', status: 'Active', lat: 25.7617, lon: -80.1918 },
  { cageCode: '7Y5Z6', companyName: 'Rocky Mountain Supplies', address: '321 Granite Peak', city: 'Denver', province: 'CO', zip: '80202', country: 'USA', status: 'Active', lat: 39.7392, lon: -104.9903 },
  { cageCode: '6A7B8', companyName: 'Desert Defense Systems', address: '450 Cactus Flat Rd', city: 'Phoenix', province: 'AZ', zip: '85001', country: 'USA', status: 'Active', lat: 33.4484, lon: -112.0740 },
  { cageCode: '5C9D1', companyName: 'Great Plains Agriculture', address: '999 Cornhusk Ln', city: 'Omaha', province: 'NE', zip: '68102', country: 'USA', status: 'Active', lat: 41.2565, lon: -95.9345 },
  { cageCode: '4E2F3', companyName: 'Keystone Materials', address: '777 Steel Way', city: 'Pittsburgh', province: 'PA', zip: '15201', country: 'USA', status: 'Active', lat: 40.4406, lon: -79.9959 },

  // International Suppliers
  { cageCode: 'U0C4A', companyName: 'Canadian Robotics Ltd.', address: '45 Maple Leaf Dr', city: 'Toronto', province: 'ON', zip: 'M5H 2N2', country: 'Canada', status: 'Active', lat: 43.6532, lon: -79.3832 },
  { cageCode: 'U1D5B', companyName: 'Vancouver Maritime Tech', address: '1 Oceanview Rd', city: 'Vancouver', province: 'BC', zip: 'V6E 3T3', country: 'Canada', status: 'Active', lat: 49.2827, lon: -123.1207 },
  { cageCode: 'D0A1B', companyName: 'Berlin Precision Engineering', address: '10 Technikerstraße', city: 'Berlin', province: 'BE', zip: '10115', country: 'Germany', status: 'Active', lat: 52.5200, lon: 13.4050 },
  { cageCode: 'D1B2C', companyName: 'Hamburg Shipping Components', address: '55 Hafenplatz', city: 'Hamburg', province: 'HH', zip: '20457', country: 'Germany', status: 'Active', lat: 53.5511, lon: 9.9937 },
  { cageCode: 'D2C3D', companyName: 'Bavarian Auto Parts', address: '200 Autobahn', city: 'Munich', province: 'BY', zip: '80331', country: 'Germany', status: 'Inactive', lat: 48.1351, lon: 11.5820 },
  { cageCode: 'J0X1Y', companyName: 'Tokyo Advanced Photonics', address: '8-1, Nishi-Shinjuku 2-chome', city: 'Tokyo', province: 'Tokyo', zip: '163-8001', country: 'Japan', status: 'Active', lat: 35.6895, lon: 139.6917 },
  { cageCode: 'J1Y2Z', companyName: 'Kyoto Semiconductor', address: '1 Karasuma-dori', city: 'Kyoto', province: 'Kyoto', zip: '600-8511', country: 'Japan', status: 'Active', lat: 35.0116, lon: 135.7681 },
  { cageCode: 'J2Z3A', companyName: 'Osaka Robotics Corp.', address: '2-1 Nakanoshima 4-chome', city: 'Osaka', province: 'Osaka', zip: '530-0005', country: 'Japan', status: 'Active', lat: 34.6937, lon: 135.5023 },
  { cageCode: 'G0P8Q', companyName: 'London Financial Tech', address: '1 Canary Wharf', city: 'London', province: 'England', zip: 'E14 5AB', country: 'UK', status: 'Active', lat: 51.5054, lon: -0.0235 },
  { cageCode: 'G1R9S', companyName: 'Manchester Industrial', address: '33 Factory Lane', city: 'Manchester', province: 'England', zip: 'M1 1AG', country: 'UK', status: 'Active', lat: 53.4808, lon: -2.2426 },
  { cageCode: 'G2T1U', companyName: 'Scottish Engineering Co.', address: '50 Clyde Street', city: 'Glasgow', province: 'Scotland', zip: 'G1 4JY', country: 'UK', status: 'Active', lat: 55.8642, lon: -4.2518 },
  { cageCode: 'F0L3M', companyName: 'Paris Aerospace Dynamics', address: '1 Avenue de la Concorde', city: 'Paris', province: 'Île-de-France', zip: '75008', country: 'France', status: 'Active', lat: 48.8566, lon: 2.3522 },
  { cageCode: 'F1N4P', companyName: 'Lyon Biotech', address: '2 Rue de la République', city: 'Lyon', province: 'Auvergne-Rhône-Alpes', zip: '69002', country: 'France', status: 'Active', lat: 45.7578, lon: 4.8320 },
  { cageCode: 'A0T5S', companyName: 'Sydney Cybernetics', address: '100 Harbour Bridge', city: 'Sydney', province: 'NSW', zip: '2000', country: 'Australia', status: 'Active', lat: -33.8688, lon: 151.2093 },
  { cageCode: 'A1U6T', companyName: 'Melbourne Resources', address: '25 Collins Street', city: 'Melbourne', province: 'VIC', zip: '3000', country: 'Australia', status: 'Inactive', lat: -37.8136, lon: 144.9631 },
  
  // More records to reach 100
  { cageCode: '8B2C3', companyName: 'Silicon Valley Chips', address: '404 Binary Blvd', city: 'San Jose', province: 'CA', zip: '95110', country: 'USA', status: 'Active', lat: 37.3382, lon: -121.8863 },
  { cageCode: '7D4E5', companyName: 'Texan Oil & Gas Supply', address: '12 Gusher Ave', city: 'Dallas', province: 'TX', zip: '75201', country: 'USA', status: 'Active', lat: 32.7767, lon: -96.7970 },
  { cageCode: '6F6G7', companyName: 'New York Financial Systems', address: '1 Wall Street', city: 'New York', province: 'NY', zip: '10005', country: 'USA', status: 'Active', lat: 40.7128, lon: -74.0060 },
  { cageCode: '5H8J9', companyName: 'Boston Dynamics AI', address: '200 Robotics Row', city: 'Boston', province: 'MA', zip: '02110', country: 'USA', status: 'Active', lat: 42.3601, lon: -71.0589 },
  { cageCode: '4K1L2', companyName: 'Atlanta Logistics Hub', address: '300 Peachtree St', city: 'Atlanta', province: 'GA', zip: '30308', country: 'USA', status: 'Active', lat: 33.7490, lon: -84.3880 },
  { cageCode: 'U2E6C', companyName: 'Montreal Pharma', address: '78 Rue Sainte-Catherine', city: 'Montreal', province: 'QC', zip: 'H2X 1K4', country: 'Canada', status: 'Active', lat: 45.5017, lon: -73.5673 },
  { cageCode: 'D3E4F', companyName: 'Frankfurt Fintech', address: '12 Main Tower', city: 'Frankfurt', province: 'HE', zip: '60311', country: 'Germany', status: 'Active', lat: 50.1109, lon: 8.6821 },
  { cageCode: 'J3A4B', companyName: 'Nagoya Motors', address: '1 Toyota-cho', city: 'Toyota', province: 'Aichi', zip: '471-8571', country: 'Japan', status: 'Active', lat: 35.0844, lon: 137.1564 },
  { cageCode: 'G3V2W', companyName: 'Cambridge Research', address: '20 King\'s Parade', city: 'Cambridge', province: 'England', zip: 'CB2 1ST', country: 'UK', status: 'Active', lat: 52.2053, lon: 0.1192 },
  { cageCode: 'F2Q5R', companyName: 'Marseille Maritime', address: '5 Quai du Port', city: 'Marseille', province: 'Provence-Alpes-Côte d\'Azur', zip: '13002', country: 'France', status: 'Active', lat: 43.2965, lon: 5.3700 },
  { cageCode: 'A2V7U', companyName: 'Perth Mining Group', address: '1 St Georges Terrace', city: 'Perth', province: 'WA', zip: '6000', country: 'Australia', status: 'Active', lat: -31.9523, lon: 115.8613 },
  { cageCode: 'K0R1A', companyName: 'Seoul Electronics', address: '1 Teheran-ro', city: 'Seoul', province: 'Seoul', zip: '06164', country: 'South Korea', status: 'Active', lat: 37.5665, lon: 126.9780 },
  { cageCode: 'K1S2B', companyName: 'Busan Heavy Industries', address: '1 Centum-daero', city: 'Busan', province: 'Busan', zip: '48060', country: 'South Korea', status: 'Active', lat: 35.1796, lon: 129.0756 },
  { cageCode: 'C0H1N', companyName: 'Beijing Tech Corp', address: '1 Zhongguancun Street', city: 'Beijing', province: 'Beijing', zip: '100080', country: 'China', status: 'Active', lat: 39.9042, lon: 116.4074 },
  { cageCode: 'C1J2P', companyName: 'Shanghai Manufacturing', address: '100 Century Avenue', city: 'Shanghai', province: 'Shanghai', zip: '200120', country: 'China', status: 'Inactive', lat: 31.2304, lon: 121.4737 },
  { cageCode: 'I0N3D', companyName: 'Bangalore IT Services', address: '1 Electronic City', city: 'Bangalore', province: 'Karnataka', zip: '560100', country: 'India', status: 'Active', lat: 12.9716, lon: 77.5946 },
  { cageCode: 'I1M4E', companyName: 'Mumbai Pharma', address: '5 Marine Drive', city: 'Mumbai', province: 'Maharashtra', zip: '400020', country: 'India', status: 'Active', lat: 19.0760, lon: 72.8777 },
  { cageCode: 'B0R1Z', companyName: 'Sao Paulo Aeronautics', address: '1 Av. Paulista', city: 'São Paulo', province: 'SP', zip: '01311-902', country: 'Brazil', status: 'Active', lat: -23.5505, lon: -46.6333 },
  { cageCode: 'M0E2X', companyName: 'Mexico City Manufacturing', address: '1 Paseo de la Reforma', city: 'Mexico City', province: 'CDMX', zip: '06500', country: 'Mexico', status: 'Active', lat: 19.4326, lon: -99.1332 },
  { cageCode: 'S0G4P', companyName: 'Singapore Logistics', address: '1 Marina Bay Sands', city: 'Singapore', province: 'Singapore', zip: '018956', country: 'Singapore', status: 'Active', lat: 1.2833, lon: 103.8584 },
  
  // Add 55 more...
  { cageCode: '3A5B6', companyName: 'Orion Space Systems', address: '789 Cosmos Blvd', city: 'Orlando', province: 'FL', zip: '32824', country: 'USA', status: 'Active', lat: 28.5383, lon: -81.3792 },
  { cageCode: '9D1E2', companyName: 'Vertex Pharmaceuticals', address: '50 Northern Ave', city: 'Boston', province: 'MA', zip: '02210', country: 'USA', status: 'Active', lat: 42.3601, lon: -71.0589 },
  { cageCode: '8F3G4', companyName: 'Cascadia Geomatics', address: '123 River Rd', city: 'Portland', province: 'OR', zip: '97204', country: 'USA', status: 'Active', lat: 45.5152, lon: -122.6784 },
  { cageCode: '7H5J6', companyName: 'Pioneer Agri-Tech', address: '456 Farm Field Ln', city: 'Des Moines', province: 'IA', zip: '50309', country: 'USA', status: 'Active', lat: 41.6005, lon: -93.6091 },
  { cageCode: '6K7L8', companyName: 'Appalachian Mining Supply', address: '789 Coal Seam Dr', city: 'Charleston', province: 'WV', zip: '25301', country: 'USA', status: 'Inactive', lat: 38.3498, lon: -81.6326 },
  { cageCode: 'U3F7D', companyName: 'Calgary Energy Corp', address: '88 Oil Patch Way', city: 'Calgary', province: 'AB', zip: 'T2P 1J9', country: 'Canada', status: 'Active', lat: 51.0447, lon: -114.0719 },
  { cageCode: 'D4G5H', companyName: 'Stuttgart Automotive', address: '1 Porscheplatz', city: 'Stuttgart', province: 'BW', zip: '70435', country: 'Germany', status: 'Active', lat: 48.7758, lon: 9.1829 },
  { cageCode: 'J4B5C', companyName: 'Fukuoka Robotics', address: '2-1 Tenjin', city: 'Fukuoka', province: 'Fukuoka', zip: '810-8620', country: 'Japan', status: 'Active', lat: 33.5904, lon: 130.4017 },
  { cageCode: 'G4W3X', companyName: 'Bristol Aerospace', address: 'Filton Airfield', city: 'Bristol', province: 'England', zip: 'BS34 7PA', country: 'UK', status: 'Active', lat: 51.4545, lon: -2.5879 },
  { cageCode: 'F3S6T', companyName: 'Toulouse Avionics', address: '1 Rond-point Maurice Bellonte', city: 'Blagnac', province: 'Occitanie', zip: '31700', country: 'France', status: 'Active', lat: 43.6293, lon: 1.3636 },
  { cageCode: 'A3W8V', companyName: 'Brisbane Bio-Labs', address: '300 George St', city: 'Brisbane', province: 'QLD', zip: '4000', country: 'Australia', status: 'Active', lat: -27.4698, lon: 153.0251 },
  { cageCode: 'K2T3C', companyName: 'Incheon Logistics', address: '272 Gonghang-ro', city: 'Incheon', province: 'Incheon', zip: '22382', country: 'South Korea', status: 'Active', lat: 37.4563, lon: 126.7052 },
  { cageCode: 'C2K3Q', companyName: 'Shenzhen Hardware', address: '1 Huaqiangbei Rd', city: 'Shenzhen', province: 'Guangdong', zip: '518031', country: 'China', status: 'Active', lat: 22.5431, lon: 114.0579 },
  { cageCode: 'I2N5F', companyName: 'Delhi Manufacturing', address: '1 Connaught Place', city: 'New Delhi', province: 'Delhi', zip: '110001', country: 'India', status: 'Active', lat: 28.6139, lon: 77.2090 },
  { cageCode: 'B1S2A', companyName: 'Rio Resources', address: '1 Av. Atlântica', city: 'Rio de Janeiro', province: 'RJ', zip: '22010-000', country: 'Brazil', status: 'Active', lat: -22.9068, lon: -43.1729 },
  { cageCode: 'M1F3Y', companyName: 'Monterrey Steel Co.', address: 'Av. Fundidora 501', city: 'Monterrey', province: 'Nuevo León', zip: '64010', country: 'Mexico', status: 'Active', lat: 25.6866, lon: -100.3161 },
  { cageCode: 'S1H5Q', companyName: 'Singapore Advanced Materials', address: '1 Fusionopolis Way', city: 'Singapore', province: 'Singapore', zip: '138632', country: 'Singapore', status: 'Active', lat: 1.3521, lon: 103.8198 },
  { cageCode: 'Z0A1F', companyName: 'Johannesburg Mining Tech', address: '1 Main Reef Rd', city: 'Johannesburg', province: 'Gauteng', zip: '2001', country: 'South Africa', status: 'Active', lat: -26.2041, lon: 28.0473 },
  { cageCode: 'R0U1S', companyName: 'Moscow Cybernetics', address: '1 Tverskaya St', city: 'Moscow', province: 'Moscow', zip: '125009', country: 'Russia', status: 'Inactive', lat: 55.7558, lon: 37.6173 },
  { cageCode: 'E0S1P', companyName: 'Madrid Aerospace', address: '1 Gran Vía', city: 'Madrid', province: 'Community of Madrid', zip: '28013', country: 'Spain', status: 'Active', lat: 40.4168, lon: -3.7038 },
  { cageCode: 'T0W1N', companyName: 'Taipei Semiconductors', address: '1 Shifu Rd', city: 'Taipei', province: 'Taipei', zip: '11008', country: 'Taiwan', status: 'Active', lat: 25.0330, lon: 121.5654 },
  { cageCode: 'N0L1D', companyName: 'Amsterdam Logistics', address: '1 Dam Square', city: 'Amsterdam', province: 'North Holland', zip: '1012 NP', country: 'Netherlands', status: 'Active', lat: 52.3676, lon: 4.9041 },
  { cageCode: 'S0W1E', companyName: 'Stockholm Precision', address: '1 Drottninggatan', city: 'Stockholm', province: 'Stockholm County', zip: '111 51', country: 'Sweden', status: 'Active', lat: 59.3293, lon: 18.0686 },
  { cageCode: 'C0H1L', companyName: 'Zurich Financial Instruments', address: '1 Paradeplatz', city: 'Zurich', province: 'Zurich', zip: '8001', country: 'Switzerland', status: 'Active', lat: 47.3769, lon: 8.5417 },
  { cageCode: 'N0O1R', companyName: 'Oslo Marine Research', address: '1 Karl Johans gate', city: 'Oslo', province: 'Oslo', zip: '0159', country: 'Norway', status: 'Active', lat: 59.9139, lon: 10.7522 },
  { cageCode: 'I0T1L', companyName: 'Rome Defense Systems', address: '1 Piazza Venezia', city: 'Rome', province: 'Lazio', zip: '00187', country: 'Italy', status: 'Active', lat: 41.9028, lon: 12.4964 },
  { cageCode: 'I0R2L', companyName: 'Irish Innovations', address: '1 O\'Connell Street', city: 'Dublin', province: 'Leinster', zip: 'D01', country: 'Ireland', status: 'Active', lat: 53.3498, lon: -6.2603 },
  { cageCode: 'A0R3G', companyName: 'Vienna Composites', address: '1 Ringstraße', city: 'Vienna', province: 'Vienna', zip: '1010', country: 'Austria', status: 'Active', lat: 48.2082, lon: 16.3738 },
  { cageCode: 'P0L4D', companyName: 'Warsaw Electronics', address: '1 Nowy Świat', city: 'Warsaw', province: 'Masovia', zip: '00-497', country: 'Poland', status: 'Active', lat: 52.2297, lon: 21.0122 },
  { cageCode: 'N0Z5L', companyName: 'Auckland Marine Tech', address: '1 Queen Street', city: 'Auckland', province: 'Auckland', zip: '1010', country: 'New Zealand', status: 'Active', lat: -36.8485, lon: 174.7633 },
  { cageCode: 'A0R6G', companyName: 'Buenos Aires Logistics', address: '1 Avenida de Mayo', city: 'Buenos Aires', province: 'CABA', zip: 'C1084', country: 'Argentina', status: 'Active', lat: -34.6037, lon: -58.3816 },
  { cageCode: 'C0L7B', companyName: 'Santiago Mining Corp', address: '1 Av Libertador Bernardo O\'Higgins', city: 'Santiago', province: 'Santiago Metropolitan', zip: '8320000', country: 'Chile', status: 'Active', lat: -33.4489, lon: -70.6693 },
  { cageCode: 'U0A8E', companyName: 'Abu Dhabi Energy', address: '1 Corniche Rd', city: 'Abu Dhabi', province: 'Abu Dhabi', zip: 'N/A', country: 'UAE', status: 'Active', lat: 24.4539, lon: 54.3773 },
  { cageCode: 'T0H9I', companyName: 'Istanbul Manufacturing', address: '1 İstiklal Avenue', city: 'Istanbul', province: 'Istanbul', zip: '34435', country: 'Turkey', status: 'Active', lat: 41.0082, lon: 28.9784 },
  { cageCode: 'F0I8L', companyName: 'Helsinki Tech', address: '1 Mannerheimintie', city: 'Helsinki', province: 'Uusimaa', zip: '00100', country: 'Finland', status: 'Active', lat: 60.1699, lon: 24.9384 },
  { cageCode: 'D0K9N', companyName: 'Copenhagen Pharma', address: '1 Strøget', city: 'Copenhagen', province: 'Capital Region', zip: '1160', country: 'Denmark', status: 'Active', lat: 55.6761, lon: 12.5683 },
  { cageCode: 'P0T1G', companyName: 'Lisbon Maritime', address: '1 Praça do Comércio', city: 'Lisbon', province: 'Lisbon', zip: '1100-148', country: 'Portugal', status: 'Active', lat: 38.7223, lon: -9.1393 },
  { cageCode: 'G0R2C', companyName: 'Athens Shipping', address: '1 Syntagma Square', city: 'Athens', province: 'Attica', zip: '105 63', country: 'Greece', status: 'Inactive', lat: 37.9838, lon: 23.7275 },
  { cageCode: 'B0E3L', companyName: 'Brussels Tech', address: '1 Grand Place', city: 'Brussels', province: 'Brussels-Capital', zip: '1000', country: 'Belgium', status: 'Active', lat: 50.8503, lon: 4.3517 },
  { cageCode: 'C0Z1H', companyName: 'Prague Engineering', address: '1 Old Town Square', city: 'Prague', province: 'Prague', zip: '110 00', country: 'Czech Republic', status: 'Active', lat: 50.0755, lon: 14.4378 },
  { cageCode: 'H0U4N', companyName: 'Budapest Systems', address: '1 Kossuth Lajos Square', city: 'Budapest', province: 'Budapest', zip: '1055', country: 'Hungary', status: 'Active', lat: 47.4979, lon: 19.0402 },
  { cageCode: 'E0G5P', companyName: 'Cairo Logistics', address: '1 Tahrir Square', city: 'Cairo', province: 'Cairo', zip: '11511', country: 'Egypt', status: 'Active', lat: 30.0444, lon: 31.2357 },
  { cageCode: 'N0G6R', companyName: 'Lagos Energy', address: '1 Broad Street', city: 'Lagos', province: 'Lagos', zip: '100221', country: 'Nigeria', status: 'Active', lat: 6.5244, lon: 3.3792 },
  { cageCode: 'K0E7Y', companyName: 'Nairobi Tech Hub', address: '1 Moi Avenue', city: 'Nairobi', province: 'Nairobi', zip: '00100', country: 'Kenya', status: 'Active', lat: -1.2921, lon: 36.8219 },
  { cageCode: 'T0H8A', companyName: 'Bangkok Manufacturing', address: '1 Rama I Rd', city: 'Bangkok', province: 'Bangkok', zip: '10330', country: 'Thailand', status: 'Active', lat: 13.7563, lon: 100.5018 },
  { cageCode: 'V0N9M', companyName: 'Hanoi IT Solutions', address: '1 Hoan Kiem Lake', city: 'Hanoi', province: 'Hanoi', zip: '100000', country: 'Vietnam', status: 'Active', lat: 21.0278, lon: 105.8342 },
  { cageCode: 'M0Y1S', companyName: 'Kuala Lumpur Tech', address: '1 Petronas Towers', city: 'Kuala Lumpur', province: 'Kuala Lumpur', zip: '50088', country: 'Malaysia', status: 'Active', lat: 3.1390, lon: 101.6869 },
  { cageCode: 'P0H2L', companyName: 'Manila Shipping', address: '1 Roxas Boulevard', city: 'Manila', province: 'Metro Manila', zip: '1000', country: 'Philippines', status: 'Active', lat: 14.5995, lon: 120.9842 },
  { cageCode: 'I0N3S', companyName: 'Jakarta Resources', address: '1 Jalan Merdeka', city: 'Jakarta', province: 'Jakarta', zip: '10110', country: 'Indonesia', status: 'Active', lat: -6.2088, lon: 106.8456 },
  { cageCode: 'P0K4N', companyName: 'Islamabad Textiles', address: '1 Constitution Avenue', city: 'Islamabad', province: 'Islamabad Capital Territory', zip: '44000', country: 'Pakistan', status: 'Active', lat: 33.6844, lon: 73.0479 },
  { cageCode: 'I0S5L', companyName: 'Tel Aviv Cyber', address: '1 Rothschild Blvd', city: 'Tel Aviv', province: 'Tel Aviv', zip: '6688101', country: 'Israel', status: 'Active', lat: 32.0853, lon: 34.7818 },
  { cageCode: 'S0A6D', companyName: 'Riyadh Construction', address: '1 King Fahd Rd', city: 'Riyadh', province: 'Riyadh', zip: '11564', country: 'Saudi Arabia', status: 'Active', lat: 24.7136, lon: 46.6753 },
];