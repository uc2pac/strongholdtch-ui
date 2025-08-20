import React from 'react';
import { Card as CardType } from '../../services/api';
import CardBack from '../CardBack';

interface PrintLayoutProps {
  cards: CardType[];
}

const PrintLayout: React.FC<PrintLayoutProps> = ({ cards }) => {
  return (
    <>
      {/* Page breaks and card backs for printing (every 9 cards) */}
      {cards.map((_, index) => (
        <React.Fragment key={`print-${index}`}>
          {(index + 1) % 9 === 0 && (
            <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: Math.min(9, cards.length - index + 8) }, (_, backIndex) => {
                  const cardIndex = index - 8 + backIndex;
                  if (cardIndex < 0 || cardIndex >= cards.length) return null;
                  
                  return <CardBack key={`back-${cardIndex}`} />;
                })}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Handle remaining cards if the last page doesn't have exactly 9 cards */}
      {cards.length % 9 !== 0 && (
        <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always' }}>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: cards.length % 9 }, (_, backIndex) => (
              <CardBack key={`back-final-${backIndex}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PrintLayout;
