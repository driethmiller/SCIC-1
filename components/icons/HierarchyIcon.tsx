import React from 'react';

const HierarchyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    {...props}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 4v16m8-12h-8m8 8h-8m-4-4h-4v8h4v-8z" 
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12H4m16-4h-8m8 8h-8"
    />
    <rect x="2" y="10" width="4" height="4" rx="1" stroke="none" fill="currentColor" opacity="0.3" />
    <rect x="18" y="6" width="4" height="4" rx="1" stroke="none" fill="currentColor" opacity="0.3" />
     <rect x="18" y="14" width="4" height="4" rx="1" stroke="none" fill="currentColor" opacity="0.3" />
  </svg>
);

export default HierarchyIcon;