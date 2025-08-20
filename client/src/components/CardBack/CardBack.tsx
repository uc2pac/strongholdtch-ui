import React from 'react';

// Reusable card back content without wrapper
export const CardBackContent: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center border border-gray-600 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 shadow-sm">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Stronghold</h1>
        <h2 className="text-2xl font-semibold">TCG</h2>
        <div className="mt-8 text-6xl opacity-20">⚔️</div>
      </div>
    </div>
  );
};

// Original CardBack component with wrapper for print layout
const CardBack: React.FC = () => {
  return (
    <div 
      className="w-60 h-72 p-3 bg-gray-100 break-inside-avoid print:bg-gray-100"
      style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
    >
      <CardBackContent />
    </div>
  );
};

export default CardBack;
