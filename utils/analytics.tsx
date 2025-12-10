
import { RawSupplierData as Supplier } from '../modules/types';
import { TOP_NUM } from '../constants';

// CAGE Status
export function getCageStatusStats(data: Supplier[]) {
  const counts: Record<string, number> = {};
  data.forEach(s => {
    const status = s.CAGEStatus || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
  });

  const total = data.length;
  const segments = Object.entries(counts)
    .map(([status, count]) => ({
      status,
      count,
      percentage: (count / total) * 100,
      label: getStatusLabel(status),
      color: getStatusColor(status)
    }))
    .sort((a, b) => b.count - a.count);

  return { segments };
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    '1': 'Proposed Debarment',  // Violet
    '2': 'Suspended', // Yellow
    'A': 'Active',  // Green
    'C': 'Restraint', // Blue
    'E': 'Debarred',  // Yellow
    'F': 'Obsolete',  // Red
    'J': 'Specialized Use', // Blue
    'N': 'Cancelled',   // Orange
    'P': 'Cancelled Without Replacement', // Orange
    'R': 'Cancelled/Replaced',  // Orange
    'W': 'Active With Restraint',   // Green
    'Y': 'Active Specialized Use',  // Green
  };
  return map[status] || `Status ${status}`;
}

function getStatusColor(status: string) {
  const map: Record<string, string> = {
    '1': '#8b5cf6', // Violet-500
    '2': '#eab308', // Yellow-500
    'A': '#22c55e', // Green-500
    'C': '007bff',  // Blue-500
    'E': '#eab308', // Yellow-500
    'F': '#ef4444', // Red-500
    'J': '007bff',  // Blue-500
    'N': '#f97316', // Orange-500
    'P': '#f97316', // Orange-500
    'R': '#f97316', // Orange-500
    'W': '#22c55e', // Green-500
    'Y': '#22c55e', // Green-500
  };
  return map[status] || '#94a3b8'; // Slate-400
}

// Geo Distribution
export function getGeoDistribution(data: Supplier[]) {
  const usSuppliers = data.filter(s => s.Country === 'USA' && s.USAState);
  const stateCounts: Record<string, number> = {};
  
  usSuppliers.forEach(s => {
    stateCounts[s.USAState] = (stateCounts[s.USAState] || 0) + 1;
  });

  return Object.entries(stateCounts)
    .map(([state, count]) => ({ state, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_NUM);
}
