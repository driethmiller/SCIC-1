import React from 'react';
import { RSSAdvisory } from '../types';

interface AdvisoryCardProps {
  advisory: RSSAdvisory;
}

const getLevelStyles = (level: number) => {
  switch (level) {
    case 1:
      return {
        bgColor: 'bg-blue-100 dark:bg-blue-900/50',
        textColor: 'text-blue-800 dark:text-blue-300',
        borderColor: 'border-blue-500',
      };
    case 2:
      return {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/50',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        borderColor: 'border-yellow-500',
      };
    case 3:
      return {
        bgColor: 'bg-orange-100 dark:bg-orange-900/50',
        textColor: 'text-orange-800 dark:text-orange-300',
        borderColor: 'border-orange-500',
      };
    case 4:
      return {
        bgColor: 'bg-red-100 dark:bg-red-900/50',
        textColor: 'text-red-800 dark:text-red-300',
        borderColor: 'border-red-500',
      };
    default:
      return {
        bgColor: 'bg-gray-100 dark:bg-gray-700',
        textColor: 'text-gray-800 dark:text-gray-300',
        borderColor: 'border-gray-500',
      };
  }
};

const RSSAdvisoryCard: React.FC<AdvisoryCardProps> = ({ advisory }) => {
  const { country, link, pubDate, level, levelDescription } = advisory;
  const styles = getLevelStyles(level);
  const formattedDate = new Date(pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-t-4 ${styles.borderColor} transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="p-5 flex-grow">
        <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 ${styles.bgColor} ${styles.textColor}`}>
          Level {level}: {levelDescription}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{country}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Published: {formattedDate}
        </p>
      </div>
      <div className="px-5 py-3 bg-gray-50 dark:bg-gray-700/50">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
        >
          Read More
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default RSSAdvisoryCard;