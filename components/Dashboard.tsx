import React from 'react';
import { Supplier } from '../modules/types';
import PieChart from './PieChart';

interface DashboardProps {
  suppliers: Supplier[];
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#6366F1', '#F97316', '#06B6D4', '#D946EF'
];

const Dashboard: React.FC<DashboardProps> = ({ suppliers }) => {
  const getChartData = (key: keyof Supplier) => {
    const counts: { [key: string]: number } = {};
    suppliers.forEach(supplier => {
      const value = supplier[key];
      if (typeof value === 'string') {
        counts[value] = (counts[value] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length],
      }));
  };

  const byCategory = getChartData('category');
  
  const domesticVsInternational = suppliers.reduce(
      (acc, supplier) => {
          if (supplier.countryCode === 'USA') {
              acc.domestic += 1;
          } else {
              acc.international += 1;
          }
          return acc;
      },
      { domestic: 0, international: 0 }
  );
  const totalSuppliers = suppliers.length;

  return (
    // Fix: Renamed animation class to avoid global scope conflicts.
    <div className="animate-detail-fade-in">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
          <h2 className="text-lg font-semibold text-gray-400">Total Suppliers</h2>
          <p className="text-5xl font-extrabold text-blue-400 mt-2">{totalSuppliers}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
            <h2 className="text-lg font-semibold text-gray-400">Domestic Suppliers</h2>
            <p className="text-5xl font-extrabold text-green-400 mt-2">{domesticVsInternational.domestic}</p>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 text-center">
            <h2 className="text-lg font-semibold text-gray-400">International Suppliers</h2>
            <p className="text-5xl font-extrabold text-yellow-400 mt-2">{domesticVsInternational.international}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PieChart data={byCategory} title="Suppliers by Category" />
        <PieChart 
            data={[
                { name: 'Domestic (USA)', value: domesticVsInternational.domestic, color: '#3B82F6' },
                { name: 'International', value: domesticVsInternational.international, color: '#10B981' }
            ]} 
            title="Domestic vs. International Suppliers" 
        />
      </div>

       {/* Fix: Replaced unsupported <style jsx> with a standard <style> tag and renamed animations to be component-specific. */}
       <style>{`
            @keyframes detail-fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-detail-fade-in {
                animation: detail-fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default Dashboard;