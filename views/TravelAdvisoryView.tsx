import React, { useState, useCallback, useEffect } from 'react';
import { TravelAdvisory } from '../types';
import { fetchTravelAdvisories } from '../services/mockDataService';
// fix: Import the `Column` type from DataTable to correctly type the columns array.
import DataTable, { Column } from '../components/DataTable';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { ArrowDownTrayIcon } from '../components/icons/ArrowDownTrayIcon';
import { DocumentDuplicateIcon } from '../components/icons/DocumentDuplicateIcon';

const TravelAdvisoriesView: React.FC = () => {
  const [data, setData] = useState<TravelAdvisory[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const advisoryData = await fetchTravelAdvisories();
      setData(advisoryData);
    } catch (err) {
      setError('Failed to fetch travel advisory data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleDownload = () => {
    if (!data) return;
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'travel_advisories_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const getLevelInfo = (level: number) => {
    switch(level) {
        case 1: return { text: 'Level 1: Normal Precautions', color: 'bg-blue-100 text-blue-800'};
        case 2: return { text: 'Level 2: Increased Caution', color: 'bg-yellow-100 text-yellow-800'};
        case 3: return { text: 'Level 3: Reconsider Travel', color: 'bg-orange-100 text-orange-800'};
        case 4: return { text: 'Level 4: Do Not Travel', color: 'bg-red-100 text-red-800'};
        default: return { text: 'Unknown', color: 'bg-slate-100 text-slate-800'};
    }
  }

  // fix: Explicitly type the columns array with `Column<TravelAdvisory>[]` to fix the type error.
  const columns: Column<TravelAdvisory>[] = [
    { header: 'Country', accessor: 'country' },
    { header: 'Advisory Level', accessor: (item: TravelAdvisory) => {
        const levelInfo = getLevelInfo(item.level);
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${levelInfo.color}`}>
            {levelInfo.text}
        </span>
    }},
    { header: 'Details', accessor: 'details' },
    { header: 'Last Updated', accessor: 'lastUpdated' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Travel Advisories</h2>
          <p className="text-slate-500 mt-1">Source: travel.state.gov (Emulated)</p>
        </div>
        <div className="flex space-x-2">
            <Button onClick={handleFetch} disabled={loading} leftIcon={<ArrowDownTrayIcon className="w-5 h-5" />}>
                {loading ? 'Fetching...' : 'Refetch Data'}
            </Button>
            {data && data.length > 0 && (
                <Button onClick={handleDownload} variant="secondary" leftIcon={<DocumentDuplicateIcon className="w-5 h-5" />}>
                    Download JSON
                </Button>
            )}
        </div>
      </div>

      {loading && <div className="flex justify-center p-10"><Spinner /></div>}
      {error && <div className="text-red-500 bg-red-100 p-4 rounded-md">{error}</div>}
      
      {!loading && !error && data && (
        data.length > 0 ? (
            <DataTable data={data} columns={columns} keyAccessor="country" />
        ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-slate-700">No Data Available</h3>
                <p className="text-slate-500 mt-2">The data source did not return any travel advisories.</p>
            </div>
        )
      )}
    </div>
  );
};

export default TravelAdvisoriesView;