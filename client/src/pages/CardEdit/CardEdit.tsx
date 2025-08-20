import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService, Card as CardType } from '../../services/api';

const CardEdit = () => {
  const { setId, cardId } = useParams();
  const navigate = useNavigate();
  
  const [card, setCard] = useState<CardType | null>(null);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      if (!setId || !cardId) {
        navigate('/sets');
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const set = await apiService.getSet(setId);
        const foundCard = set.cards.find(c => c.id === cardId);
        
        if (!foundCard) {
          setError('Card not found');
          return;
        }

        setCard(foundCard);
        setCardName(foundCard.name);
        setCardNumber(foundCard.number);
      } catch (error) {
        console.error('Error loading card:', error);
        setError(error instanceof Error ? error.message : 'Failed to load card');
      } finally {
        setIsLoading(false);
      }
    };

    loadCard();
  }, [setId, cardId, navigate]);

  const handleSave = async () => {
    if (!card || !setId) return;

    if (!cardName.trim()) {
      alert('Please enter a card name');
      return;
    }

    if (!cardNumber.trim()) {
      alert('Please enter a card number');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Get the current set to rebuild it with updated card
      const currentSet = await apiService.getSet(setId);
      
      // Update the card in the cards array
      const updatedCards = currentSet.cards.map(c => 
        c.id === cardId 
          ? { ...c, name: cardName.trim(), number: cardNumber.trim() }
          : c
      );

      // Update the entire set with the modified cards
      await apiService.updateSet(setId, {
        name: currentSet.name,
        game: currentSet.game,
        code: currentSet.code,
        totalCards: currentSet.total_cards,
        cards: updatedCards
      });

      // Navigate back to set details
      navigate(`/sets/${setId}`);
    } catch (error) {
      console.error('Error updating card:', error);
      setError(error instanceof Error ? error.message : 'Failed to update card');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/sets/${setId}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Loading card...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg">{error}</div>
          <button 
            onClick={() => navigate('/sets')}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Sets
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-8 min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">Card not found</div>
          <button 
            onClick={() => navigate('/sets')}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Sets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Card</h1>
        <p className="text-gray-600">Update the card name and number</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Name
          </label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter card name..."
            disabled={isSaving}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="string"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter card number..."
            min="1"
            disabled={isSaving}
          />
        </div>

        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={handleCancel}
            disabled={isSaving}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardEdit;
