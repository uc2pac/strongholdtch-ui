import React, { useState, useEffect, useRef } from 'react';
import { Card as CardType } from '../../services/api';
import { CardBackContent } from '../CardBack/CardBack';

interface CardProps {
  card: CardType;
  setName: string;
  totalCards: number;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, setName, totalCards, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(card.id!);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    // TODO: Implement edit logic later
    console.log('Edit card:', card.id);
  };

  const handleCardClick = () => {
    if (!showMenu) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div 
      className="w-64 h-80 rounded-lg p-3 bg-gray-100 break-inside-avoid print:w-60 print:h-72 print:bg-gray-100 relative cursor-pointer print:cursor-default group"
      style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
      onClick={handleCardClick}
    >
      {/* Three dots menu - hidden when printing, shown on hover */}
      <div className="absolute top-4 right-4 no-print z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" ref={menuRef}>
        <button
          onClick={handleMenuClick}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
          aria-label="Card actions"
        >
          <svg className="w-4 h-4 text-gray-600 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute top-8 right-0 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              onClick={handleEditClick}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Card flip container */}
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d print:transform-none ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front of card */}
        <div className="absolute inset-0 w-full h-full backface-hidden print:relative print:backface-visible">
          <div className="w-full h-full flex flex-col items-center justify-between border border-gray-600 rounded-lg bg-white shadow-sm">
            <div className="text-center pt-4">
              <h2 className="text-lg font-bold text-gray-800">{setName}</h2>
            </div>
            <div className="flex-1 flex items-center justify-center px-4">
              <p className="text-center text-gray-900 font-medium text-lg break-words">
                {card.name}
              </p>
            </div>
            <div className="self-end p-3">
              <span className="text-sm text-gray-600 font-medium">
                {card.number}/{totalCards}
              </span>
            </div>
          </div>
        </div>

        {/* Back of card - hidden in print */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 no-print">
          <CardBackContent />
        </div>

      </div>
    </div>
  );
};

export default Card;
