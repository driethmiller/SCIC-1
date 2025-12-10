import React from 'react';
import { TravelAdvisory } from '../../modules/types';

interface TravelAdvisoryCardProps {
  advisory: TravelAdvisory;
}

const getLevelInfo = (level: number) => {
    switch(level) {
        case 1: return { text: 'Level 1: Normal Precautions', color: 'bg-blue-900/50 text-blue-300', borderColor: 'border-blue-500' };
        case 2: return { text: 'Level 2: Increased Caution', color: 'bg-yellow-900/50 text-yellow-300', borderColor: 'border-yellow-500' };
        case 3: return { text: 'Level 3: Reconsider Travel', color: 'bg-orange-900/50 text-orange-300', borderColor: 'border-orange-500' };
        case 4: return { text: 'Level 4: Do Not Travel', color: 'bg-red-900/50 text-red-300', borderColor: 'border-red-500' };
        default: return { text: 'Unknown', color: 'bg-gray-700 text-gray-300', borderColor: 'border-gray-500' };
    }
}

const TravelAdvisoryCard: React.FC<TravelAdvisoryCardProps> = ({ advisory }) => {
  const levelInfo = getLevelInfo(advisory.level);
  
  return (
    <div className={`flex flex-col bg-gray-800 rounded-lg shadow-lg overflow-hidden border-t-4 ${levelInfo.borderColor} transition-transform duration-300 hover:scale-105 hover:shadow-blue-500/50`}>
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-blue-300 mb-2">{advisory.country}</h3>
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${levelInfo.color}`}>
              {levelInfo.text}&nbsp;&nbsp;
          </span>
          <span className="text-xs text-gray-400 mb-4">
            Updated: {new Date(advisory.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <p className="text-sm text-gray-200 flex-grow mb-4 line-clamp-3">{advisory.details}</p>
        <div className="mt-auto pt-4 border-t border-gray-700">
           <a
              href={advisory.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline"
            >
              View Full Advisory
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
        </div>
      </div>
    </div>
  );
};

export default TravelAdvisoryCard;