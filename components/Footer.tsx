
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} NASA Supply Chain Insight Central (SCIC). Data is for demonstrative purposes only.</p>
      </div>
    </footer>
  );
};

export default Footer;