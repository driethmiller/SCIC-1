import React, { useState, useEffect, useMemo, useCallback } from 'react';
// fix: Import fetchSuppliers from mockDataService to align with data structure used in this view.
import { fetchSuppliers, fetchTravelAdvisories } from '../services/mockDataService';
// fix: Use SupplierMock as it matches the data structure from mockDataService.
import { SupplierMock, TravelAdvisory } from '../types';
import Spinner from '../components/Spinner';
// fix: Uncommented InteractiveWorldMap to render the map.
import InteractiveWorldMap from '../components/InteractiveWorldMap';

const advisoryLevels = [
    { level: 1, text: 'Level 1: Normal Precautions', color: 'bg-blue-500' },
    { level: 2, text: 'Level 2: Increased Caution', color: 'bg-yellow-500' },
    { level: 3, text: 'Level 3: Reconsider Travel', color: 'bg-orange-500' },
    { level: 4, text: 'Level 4: Do Not Travel', color: 'bg-red-500' }
];

const DashboardView: React.FC = () => {
    const [advisories, setAdvisories] = useState<TravelAdvisory[]>([]);
    // fix: Changed state to hold SupplierMock objects.
    const [suppliers, setSuppliers] = useState<SupplierMock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'advisories' | 'suppliers'>('advisories');

    const [countryFilter, setCountryFilter] = useState('');
    const [levelFilters, setLevelFilters] = useState<number[]>([1, 2, 3, 4]);

    const handleFetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
          // fix: Fetch both suppliers and advisories data.
          const [supplierData, advisoryData] = await Promise.all([
            fetchSuppliers(),
            fetchTravelAdvisories(),
          ]);
          setSuppliers(supplierData);
          setAdvisories(advisoryData);
        } catch (err) {
          setError('Failed to fetch dashboard data.');
        } finally {
          setLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetch();
    }, [handleFetch]);
    
    const handleLevelFilterChange = (level: number) => {
        setLevelFilters(prev =>
            prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
        );
    };

    const advisoryMap = useMemo(() => {
        return new Map(advisories.map(a => [a.country.toLowerCase(), a]));
    }, [advisories]);

    const filteredAdvisories = useMemo(() => {
        return advisories.filter(advisory => {
            const countryMatch = advisory.country.toLowerCase().includes(countryFilter.toLowerCase());
            const levelMatch = levelFilters.length === 0 || levelFilters.includes(advisory.level);
            return countryMatch && levelMatch;
        });
    }, [advisories, countryFilter, levelFilters]);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(supplier => {
            // fix: Use properties from SupplierMock.
            const countryMatch = supplier.country.toLowerCase().includes(countryFilter.toLowerCase());
            // fix: Uncommented to enable filtering by advisory level.
            const advisory = advisoryMap.get(supplier.country.toLowerCase());
            const levelMatch = levelFilters.length === 0 || (advisory && levelFilters.includes(advisory.level));
            return countryMatch && levelMatch;
        });
    }, [suppliers, countryFilter, levelFilters, advisoryMap]);

    const summaryCards = useMemo(() => {
        const highRiskSuppliers = suppliers.filter(s => {
            // fix: Use properties from SupplierMock.
            const advisory = advisoryMap.get(s.country.toLowerCase());
            return advisory && (advisory.level === 3 || advisory.level === 4);
        }).length;

        const filteredHighRiskSuppliers = filteredSuppliers.filter(s => {
            // fix: Use properties from SupplierMock.
            const advisory = advisoryMap.get(s.country.toLowerCase());
            return advisory && (advisory.level === 3 || advisory.level === 4);
        }).length;
        
        const highRiskCountries = advisories.filter(a => a.level === 3 || a.level === 4).length;

        if (activeTab === 'suppliers') {
            return [
                { title: 'Total Suppliers Shown', value: filteredSuppliers.length },
                { title: 'Suppliers in High-Risk Countries', value: filteredHighRiskSuppliers, color: 'text-red-600' },
            ];
        }
        return [
            { title: 'Total Advisories', value: advisories.length },
            { title: 'High-Risk Countries (L3/L4)', value: highRiskCountries, color: 'text-red-600' },
        ];
    }, [advisories, suppliers, filteredSuppliers, advisoryMap, activeTab]);


    if (loading) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    if (error) {
        return <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-slate-800">Global Supply Chain Risk Dashboard</h2>
                <p className="text-slate-500 mt-1">Visualize travel advisories and supplier locations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-sm font-medium text-slate-500">{card.title}</p>
                        <p className={`text-3xl font-bold ${card.color || 'text-slate-800'}`}>{card.value}</p>
                    </div>
                ))}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
                 <div className="border-b border-slate-200">
                    <nav className="flex -mb-px" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('advisories')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'advisories'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Travel Advisories
                        </button>
                        <button
                            onClick={() => setActiveTab('suppliers')}
                            className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200 ${
                                activeTab === 'suppliers'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                        >
                            Supplier Risk Map
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="country-search" className="block text-sm font-medium text-slate-700">Filter by Country</label>
                            <input
                                type="text"
                                id="country-search"
                                value={countryFilter}
                                onChange={(e) => setCountryFilter(e.target.value)}
                                placeholder="e.g., Germany, Brazil..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Filter by Advisory Level</label>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                                {advisoryLevels.map(level => (
                                    <div key={level.level} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`level-${level.level}`}
                                            checked={levelFilters.includes(level.level)}
                                            onChange={() => handleLevelFilterChange(level.level)}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`level-${level.level}`} className="ml-2 flex items-center text-sm text-slate-600 cursor-pointer">
                                            <span className={`w-3 h-3 rounded-full mr-2 ${level.color}`}></span>
                                            Level {level.level}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="h-[600px] w-full border rounded-lg overflow-hidden relative bg-slate-200">
                         {/* fix: Uncommented to render the map component. */}
                         <InteractiveWorldMap 
                            advisories={filteredAdvisories} 
                            suppliers={filteredSuppliers}
                            showSuppliers={activeTab === 'suppliers'}
                         />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;