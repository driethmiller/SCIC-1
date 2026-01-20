
import React, { useMemo } from 'react';
import { Users, Globe2, Activity, MapPin } from 'lucide-react';
import { getCageStatusStats, getGeoDistribution } from '../utils/analytics';
import { RawSupplierData } from '../modules/types';
import { TOP_NUM } from '../constants';

interface DashboardProps {
  data: RawSupplierData[];
}

export default function Dashboard({ data }: DashboardProps) {
  const stats = useMemo(() => {
    const total = data.length;
    const active = data.filter(s => s.CAGEStatus === 'A' || s.CAGEStatus === 'W' || s.CAGEStatus === 'Y').length;
    const uniqueCountries = new Set(data.map(s => s.Country).filter(Boolean)).size;
      const usSuppliers = data.filter(s => s.Country === 'USA').length;
      const foreignSuppliers = data.filter(s => s.Country !== 'USA').length;
    
    return { total, active, uniqueCountries, usSuppliers, foreignSuppliers };
  }, [data]);

  const geoData = useMemo(() => getGeoDistribution(data), [data]);
  const statusData = useMemo(() => getCageStatusStats(data), [data]);

  const recentSuppliers = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime())
      .slice(0, TOP_NUM);
  }, [data]);

  return (
    <div className="space-y-6">


      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard 
          title="Total Suppliers" 
          value={stats.total} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatsCard 
          title="Active CAGE Codes" 
          value={stats.active}
          subValue={`${stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}% of total`}
          icon={Activity} 
          color="bg-green-500" 
        />
        <StatsCard 
          title="Domestic (US) Suppliers" 
          value={stats.usSuppliers} 
          icon={MapPin} 
          color="bg-indigo-500" 
              />
        <StatsCard
            title="Foreign Suppliers"
            value={stats.foreignSuppliers}
            icon={MapPin}
            color="bg-indigo-500"
        />
        <StatsCard 
          title="Global Reach" 
          value={stats.uniqueCountries} 
          label="Countries"
          icon={Globe2} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Geo Distribution Chart */}
        <div className="DashBox p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top 7 Supplier Locations (USA)</h3>
          <div className="space-y-4">
            {geoData.length > 0 ? geoData.map((item) => (
              <div key={item.state} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900">{item.state}</span>
                  <span className="text-slate-900">{item.count} suppliers</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / geoData[0].count) * 100}%` }}
                  />
                </div>
              </div>
            )) : <p className="text-slate-500 text-sm">No geographic data available.</p>}
          </div>
        </div>

        {/* Status Distribution Chart */}
              <div className="DashBox p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">CAGE Status Distribution</h3>
          <div className="flex flex-col items-center">
            <div className="relative h-48 w-48">
              {/* Simple CSS/SVG Donut Chart representation */}
              <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                {statusData.segments.map((segment, i) => (
                  <circle
                    key={segment.status}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke={segment.color}
                    strokeWidth="12"
                    strokeDasharray={`${segment.percentage * 2.51} 251.2`}
                    strokeDashoffset={-statusData.segments.slice(0, i).reduce((acc, curr) => acc + (curr.percentage * 2.51), 0)}
                    className="transition-all duration-1000 ease-out"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-800">{stats.total}</span>
                <span className="text-xs text-slate-900 uppercase tracking-wide">Total</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 w-full px-2">
              {statusData.segments.map((segment) => (
                <div key={segment.status} className="flex items-center text-sm">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }} />
                  <span className="text-slate-900 flex-1">{segment.label}</span>
                  <span className="font-medium text-slate-900">{Math.round(segment.percentage * 100) / 100}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="DashBox rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800">Recently Added Suppliers</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recentSuppliers.length > 0 ? recentSuppliers.map((supplier) => (
            <div key={supplier.SupplierNumber} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm">
                    {supplier.SupplierName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="ml-4 truncate">
                    <p className="text-sm font-medium text-slate-900 truncate">{supplier.SupplierName}</p>
                    <p className="text-sm text-slate-900 truncate">{supplier.City}, {supplier.USAState || supplier.Country}</p>
                  </div>
                </div>
                <div className="text-right pl-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${supplier.CAGEStatus === 'A' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                    Status: {supplier.CAGEStatus}
                  </span>
                  <p className="text-xs text-slate-900 mt-1">{new Date(supplier.DateCreated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )) : <div className="p-6 text-slate-500 text-center">No recent activity.</div>}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, subValue, label, icon: Icon, color }: any) {
  return (
    <div className="DashBox p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-900">{title}</p>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {label && <span className="ml-2 text-sm text-slate-590">{label}</span>}
        </div>
        {subValue && <p className="mt-1 text-sm text-slate-900">{subValue}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.replace('bg-', '')}`}>
        <Icon size={24} className={`text-${color.replace('bg-', '')}-600`} style={{ opacity: 0.8 }} />
      </div>
    </div>
  );
}
