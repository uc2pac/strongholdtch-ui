import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card as CardType } from '../../services/api';
import { CardBackContent } from '../CardBack/CardBack';
import IconButton from '../IconButton';
import DropdownMenu, { DropdownMenuItem } from '../DropdownMenu';

interface CardProps {
  card: CardType;
  setId: string;
  setName: string;
  totalCards: number;
  onDelete: (cardId: string) => void;
}

const Card: React.FC<CardProps> = ({ card, setId, setName, totalCards, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(card.id!);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/sets/${setId}/cards/${card.id}/edit`);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Edit',
      onClick: handleEditClick,
      className: 'text-gray-700'
    },
    {
      label: 'Delete',
      onClick: handleDeleteClick,
      className: 'text-red-600'
    }
  ];

  return (
    <div 
      className="w-64 h-80 rounded-lg p-3 bg-gray-100 break-inside-avoid print:w-60 print:h-72 print:bg-gray-100 relative cursor-pointer print:cursor-default group"
      style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
      onClick={handleCardClick}
    >
      {/* Three dots menu - hidden when printing, shown on hover */}
      <div className="absolute top-4 right-4 no-print z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <DropdownMenu
          trigger={
            <IconButton
              icon="three-dots"
              size="sm"
              onClick={() => {}} // Handled by DropdownMenu
              className="rotate-90 hover:bg-gray-200"
            />
          }
          items={menuItems}
          position="bottom-right"
          menuClassName="w-32"
        />
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
