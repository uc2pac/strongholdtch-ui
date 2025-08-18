import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

type Card = {
    name: string;
    number: number;
}

type TCGGame = 'pokemon' | 'lorcana' | 'magic' | 'yugioh' | 'other';

const CreateSet = () => {
    const [newSet, setNewSet] = React.useState<Card[]>([]);
    const [setName, setSetName] = React.useState<string>('');
    const [selectedGame, setSelectedGame] = React.useState<TCGGame>('pokemon');
    const navigate = useNavigate();

    const tcgGames: { value: TCGGame; label: string }[] = [
        { value: 'pokemon', label: 'Pokémon' },
        { value: 'lorcana', label: 'Lorcana' },
        { value: 'magic', label: 'Magic: The Gathering' },
        { value: 'yugioh', label: 'Yu-Gi-Oh!' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Set</h1>
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
                        Set Data
                    </label>
                    <textarea
                        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your set data here...&#10;Example:&#10;Card Name 1 - 1&#10;Card Name 2 - 2&#10;Card Name 3 - 3"
                        onChange={(e) => {
                            const input = e.target.value;
                            try {
                                const parsedSets = input.split('\n').map(line => line.trim()).filter(line => line).map((item => {
                                    const [name, number] = item.split('-');
                                    return { name: name.trim(), number: parseInt(number.trim(), 10) };
                                }));
                                setNewSet(parsedSets);
                            } catch (error) {
                                console.error('Invalid input format', error);
                            }
                        }}
                    />
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => {
                            if (!setName.trim()) {
                                alert('Please enter a set name');
                                return;
                            }
                            if (newSet.length === 0) {
                                alert('Please enter at least one card');
                                return;
                            }
                            
                            const id = uuidv4();
                            const storedSets = localStorage.getItem('sets');
                            const allSets = JSON.parse(storedSets || '{}');
                            allSets[id] = {
                                name: setName.trim(),
                                game: selectedGame,
                                cards: newSet
                            };
                            localStorage.setItem('sets', JSON.stringify(allSets));
                            navigate(`/sets/${id}`);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Create Set
                    </button>
                    <button 
                        onClick={() => navigate('/sets')}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>

                {newSet.length > 0 && setName.trim() && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Preview: {setName} ({tcgGames.find(g => g.value === selectedGame)?.label}) - {newSet.length} cards
                        </h3>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                            {newSet.map((card, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                    {card.name} - {card.number}
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