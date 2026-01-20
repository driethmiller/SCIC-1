import React, { useState } from 'react';

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  title: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400">No data available for {title}.</p>
      </div>
    );
  }
  
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
       <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400">No data with values for {title}.</p>
      </div>
    );
  }

  let cumulative = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const slices = data.map((slice) => {
    const startPercent = cumulative / total;
    cumulative += slice.value;
    const endPercent = cumulative / total;
    
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      'L 0 0', // Line to center
    ].join(' ');

    return {
      pathData,
      ...slice,
    };
  });

  const activeSlice = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 h-full flex flex-col min-h-[300px]">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">{title}</h3>
      <div className="flex-grow flex items-center justify-around flex-col sm:flex-row gap-4">
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }}>
            {slices.map((slice, index) => (
              <path
                key={slice.name}
                d={slice.pathData}
                fill={slice.color}
                stroke="#1F2937" // bg-gray-800
                strokeWidth={0.02}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                style={{
                  transition: 'transform 0.2s ease-out',
                  transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                  cursor: 'pointer',
                }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            {activeSlice ? (
              <>
                <span className="text-xs text-gray-400 truncate max-w-[90%] px-2">{activeSlice.name}</span>
                <span className="text-2xl font-bold text-white">
                    {((activeSlice.value / total) * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-gray-300">({activeSlice.value})</span>
              </>
            ) : (
                <span className="text-2xl font-bold text-white">{total}<span className="text-sm text-gray-400 block -mt-1">Total</span></span>
            )}
            </div>
        </div>
        <div className="text-sm w-full sm:max-w-[180px]">
          <ul className="space-y-1">
            {data.map((item, index) => (
              <li
                key={item.name}
                className="flex items-center p-1 rounded-md transition-colors"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className={`truncate transition-colors ${activeIndex === index ? 'text-white font-bold' : 'text-gray-400'}`}>
                    {item.name} ({item.value})
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
