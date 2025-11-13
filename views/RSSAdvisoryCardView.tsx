import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RSSAdvisory } from '../types';
import AdvisoryCard from '../components/RSSAdvisoryCard';
import Filters from '../components/RSSAdvisoryCardFilter';
import AdvisorySkeleton from '../components/RSSAdvisoryCardSkeleton';
const RSS_URL = 'https://travel.state.gov/_res/rss/TAsTWs.xml';
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;

const RSSAdvisoryCardView: React.FC = () => {
  const [allAdvisories, setAllAdvisories] = useState<RSSAdvisory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const parseAdvisories = (xmlString: string): RSSAdvisory[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    const items = xmlDoc.querySelectorAll('item');
    const advisories: RSSAdvisory[] = [];

    items.forEach(item => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || link;

        const titleMatch = title.match(/(.+) - Level (\d): (.+)/);

        if (titleMatch) {
            const [, country, level, levelDescription] = titleMatch;
            advisories.push({
                id: guid,
                country: country.trim(),
                link,
                pubDate,
                level: parseInt(level, 10),
                levelDescription: levelDescription.trim(),
            });
        }
    });
    return advisories;
  };

  const fetchAdvisories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(PROXY_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const xmlText = await response.text();
      const parsedData = parseAdvisories(xmlText);
      setAllAdvisories(parsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred. The CORS proxy may be down.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvisories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAndSortedAdvisories = useMemo(() => {
    let result = [...allAdvisories];

    if (selectedLevel !== 'all') {
      result = result.filter(advisory => advisory.level === parseInt(selectedLevel, 10));
    }

    if (searchTerm) {
      result = result.filter(advisory =>
        advisory.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [searchTerm, selectedLevel, sortOrder, allAdvisories]);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">U.S. Department of State Travel Advisories</h2>
          <p className="text-slate-500 mt-1">Official travel advisories and alerts | Source: travel.state.gov</p>
        </div>
      </div>
      <Filters
        searchTerm={searchTerm}
        onSearchChange={e => setSearchTerm(e.target.value)}
        selectedLevel={selectedLevel}
        onLevelChange={e => setSelectedLevel(e.target.value)}
        sortOrder={sortOrder}
        onSortChange={toggleSortOrder}
      />
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 12 }).map((_, index) => <AdvisorySkeleton key={index} />)}
        </div>
      )}
      {error && (
        <div className="mt-6 text-center bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg shadow-md" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredAndSortedAdvisories.length > 0 ? (
            filteredAndSortedAdvisories.map(advisory => (
              <AdvisoryCard key={advisory.id} advisory={advisory} />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-12 text-gray-500 dark:text-gray-400">
              <h3 className="text-2xl font-semibold">No Advisories Found</h3>
              <p className="mt-2">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RSSAdvisoryCardView;