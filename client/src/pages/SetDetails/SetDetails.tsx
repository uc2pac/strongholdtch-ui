import React, { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { apiService, Set, Card, TCGGame } from '../../services/api';
import CardComponent from '../../components/Card';
import ConfirmationModal from '../../components/ConfirmationModal';
import SearchInput from '../../components/SearchInput';
import CardBack from '../../components/CardBack';

const SetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [set, setSet] = React.useState<Set | null>(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; cardId: string; cardName: string }>({
        isOpen: false,
        cardId: '',
        cardName: ''
    });
    const [isDeleting, setIsDeleting] = React.useState(false);

    const tcgGames: { [key in TCGGame]: string } = {
        pokemon: 'Pokémon',
        lorcana: 'Lorcana',
        magic: 'Magic: The Gathering',
        yugioh: 'Yu-Gi-Oh!',
        other: 'Other'
    };

    useEffect(() => {
        if (!id) {
            console.error('Set ID is required');
            navigate('/sets');
            return;
        }

        const loadSet = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedSet = await apiService.getSet(id);
                setSet(fetchedSet);
            } catch (error) {
                console.error('Error loading set:', error);
                setError(error instanceof Error ? error.message : 'Failed to load set');
            } finally {
                setIsLoading(false);
            }
        };

        loadSet();
    }, [id, navigate]);

    const handleDeleteCard = (cardId: string) => {
        const card = set?.cards.find(c => c.id === cardId);
        if (card) {
            setDeleteModal({
                isOpen: true,
                cardId,
                cardName: card.name
            });
        }
    };

    const confirmDeleteCard = async () => {
        if (!set || !deleteModal.cardId) return;

        setIsDeleting(true);
        try {
            await apiService.deleteCard(set.id, deleteModal.cardId);
            // Update the local state to remove the deleted card
            setSet(prevSet => {
                if (!prevSet) return null;
                return {
                    ...prevSet,
                    cards: prevSet.cards.filter(card => card.id !== deleteModal.cardId)
                };
            });
            setDeleteModal({ isOpen: false, cardId: '', cardName: '' });
        } catch (error) {
            console.error('Error deleting card:', error);
            alert(`Failed to delete card: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDeleteCard = () => {
        setDeleteModal({ isOpen: false, cardId: '', cardName: '' });
    };

    // Filter cards by search term
    const filteredCards = set?.cards.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) {
        return (
            <div className="p-8 min-h-screen bg-gray-50">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Loading set details...</div>
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

    if (!set) {
        return (
            <div className="p-8 min-h-screen bg-gray-50">
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Set not found.</div>
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
            <div className="mb-8 flex justify-between items-center no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{set.name}</h1>
                    <p className="text-gray-600 mt-1">{tcgGames[set.game]} • {set.cards.length} cards</p>
                </div>
                <div className="flex gap-4">
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search cards..."
                        className="w-48"
                    />
                    <button 
                        onClick={() => navigate('/sets')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Back to Sets
                    </button>
                    <button 
                        onClick={() => window.print()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Print Cards
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 print:gap-2">
                {filteredCards.map((card, index) => (
                    <React.Fragment key={card.id || index}>
                        <CardComponent
                            card={card}
                            setName={set.name}
                            totalCards={set.cards.length}
                            onDelete={handleDeleteCard}
                        />
                        
                        {/* Page break and card backs for printing (every 9 cards) */}
                        {(index + 1) % 9 === 0 && (
                            <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: Math.min(9, filteredCards.length - index + 8) }, (_, backIndex) => {
                                        const cardIndex = index - 8 + backIndex;
                                        if (cardIndex < 0 || cardIndex >= filteredCards.length) return null;
                                        
                                        return <CardBack key={`back-${cardIndex}`} />;
                                    })}
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {/* Handle remaining cards if the last page doesn't have exactly 9 cards */}
                {filteredCards.length % 9 !== 0 && (
                    <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always' }}>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: filteredCards.length % 9 }, (_, backIndex) => (
                                <CardBack key={`back-final-${backIndex}`} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title="Delete Card"
                message={`Are you sure you want to delete "${deleteModal.cardName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeleteCard}
                onCancel={cancelDeleteCard}
                isLoading={isDeleting}
            />

            {filteredCards.length === 0 && set.cards.length > 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        No cards found matching "{searchTerm}".
                    </div>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Clear search
                    </button>
                </div>
            )}

            {set.cards.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">No cards found in this set.</div>
                    <button 
                        onClick={() => navigate('/sets')}
                        className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Go back to sets
                    </button>
                </div>
            )}
        </div>
    );
}

export default SetDetails;