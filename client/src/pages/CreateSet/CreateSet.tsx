import React, { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { apiService, TCGGame, Card, Set } from '../../services/api';

const CreateSet = () => {
    const [newSet, setNewSet] = React.useState<Card[]>([]);
    const [setData, setSetData] = React.useState<string>('');
    const [setName, setSetName] = React.useState<string>('');
    const [setCode, setSetCode] = React.useState<string>('');
    const [totalCards, setTotalCards] = React.useState<string>('');
    const [selectedGame, setSelectedGame] = React.useState<TCGGame>('pokemon');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [existingSet, setExistingSet] = React.useState<Set | null>(null);
    const navigate = useNavigate();
    const { id: editId } = useParams();

    const isEditMode = !!editId;

    const tcgGames: { value: TCGGame; label: string }[] = [
        { value: 'pokemon', label: 'Pokémon' },
        { value: 'lorcana', label: 'Lorcana' },
        { value: 'magic', label: 'Magic: The Gathering' },
        { value: 'yugioh', label: 'Yu-Gi-Oh!' },
        { value: 'other', label: 'Other' },
    ];

    // Load existing set data when editing
    useEffect(() => {
        if (isEditMode && editId) {
            const loadSet = async () => {
                setIsLoading(true);
                try {
                    const set = await apiService.getSet(editId);
                    setExistingSet(set);
                    setSetName(set.name);
                    setSetCode(set.code || '');
                    setTotalCards(set.total_cards?.toString() || '');
                    setSelectedGame(set.game);
                    setNewSet(set.cards);
                    setSetData(set.cards.map(card => `${card.name} - ${card.number}`).join('\n'));
                } catch (error) {
                    console.error('Error loading set:', error);
                    alert(`Failed to load set: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    navigate('/sets');
                } finally {
                    setIsLoading(false);
                }
            };
            loadSet();
        }
    }, [isEditMode, editId, navigate]);

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isEditMode ? 'Edit Set' : 'Create New Set'}
                </h1>
                <p className="text-gray-600">Enter your cards below, one per line in the format: Name - Number</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        TCG Game
                    </label>
                    <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value as TCGGame)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    >
                        {tcgGames.map((game) => (
                            <option key={game.value} value={game.value}>
                                {game.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Set Name
                    </label>
                    <input
                        type="text"
                        value={setName}
                        onChange={(e) => setSetName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter a name for your set..."
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Set Code <span className="text-gray-500 text-sm">(optional)</span>
                    </label>
                    <input
                        type="text"
                        value={setCode}
                        onChange={(e) => setSetCode(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., PAL, 1, LOR001..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Examples: Pokémon Paldea Evolved = "PAL", Lorcana First Chapter = "1"
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Cards <span className="text-gray-500 text-sm">(optional - leave empty to count automatically)</span>
                    </label>
                    <input
                        type="number"
                        value={totalCards}
                        onChange={(e) => setTotalCards(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Total number of cards in the set..."
                        min="0"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Set Data
                    </label>
                    <textarea
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your set data here...&#10;Example:&#10;Card Name 1 - 1&#10;Card Name 2 - 2&#10;Card Name 3 - 3"
                        value={setData}
                        onChange={(e) => setSetData(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={async () => {
                            if (!setName.trim()) {
                                alert('Please enter a set name');
                                return;
                            }
                            
                            // Parse the set data text into cards
                            let parsedCards: Card[] = [];
                            try {
                                parsedCards = setData.split('\n').map(line => line.trim()).filter(line => line).map((item => {
                                    const parts = item.split('-');
                                    const number = parseInt(parts[parts.length - 1].trim(), 10);
                                    const name = parts.slice(0, -1).join('-').trim();
                                    return { name, number: isNaN(number) ? 0 : number };
                                }));
                            } catch (error) {
                                console.error('Invalid input format', error);
                                alert('Invalid card format. Please use the format: Card Name - Number');
                                return;
                            }
                            
                            if (parsedCards.length === 0) {
                                alert('Please enter at least one card');
                                return;
                            }
                            
                            setIsLoading(true);
                            try {
                                const setDataPayload = {
                                    name: setName.trim(),
                                    game: selectedGame,
                                    code: setCode.trim() || undefined,
                                    totalCards: totalCards ? parseInt(totalCards) : undefined,
                                    cards: parsedCards
                                };

                                let result;
                                if (isEditMode && editId) {
                                    result = await apiService.updateSet(editId, setDataPayload);
                                } else {
                                    result = await apiService.createSet(setDataPayload);
                                }
                                
                                navigate(`/sets/${result.id}`);
                            } catch (error) {
                                console.error(`Error ${isEditMode ? 'updating' : 'creating'} set:`, error);
                                alert(`Failed to ${isEditMode ? 'update' : 'create'} set: ${error instanceof Error ? error.message : 'Unknown error'}`);
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        {isLoading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Set' : 'Create Set')}
                    </button>
                    <button 
                        onClick={() => navigate('/sets')}
                        disabled={isLoading}
                        className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>

                {setData.trim() && setName.trim() && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Preview: {setName} 
                            {setCode && ` (${setCode})`} 
                            ({tcgGames.find(g => g.value === selectedGame)?.label}) - {setData.split('\n').filter(line => line.trim()).length} cards
                            {totalCards && ` / ${totalCards} total`}
                        </h3>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {setData.split('\n').filter(line => line.trim()).map((line, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                    {line.trim()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateSet;