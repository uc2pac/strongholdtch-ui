import React, { useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

type Card = {
    name: string;
    number: number;
}

type TCGGame = 'pokemon' | 'lorcana' | 'magic' | 'yugioh' | 'other';

const SetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [set, setSet] = React.useState<Card[]>([]);
    const [setName, setSetName] = React.useState<string>('');
    const [setGame, setSetGame] = React.useState<TCGGame>('other');

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
            return;
        }

        // Load existing sets from localStorage if available
        const storedSets = localStorage.getItem('sets');
        if (storedSets) {
            const allSets = JSON.parse(storedSets);
            const setData = allSets[id];
            
            if (setData) {
                setSet(setData.cards);
                setSetName(setData.name);
                setSetGame(setData.game);
            }
        }
    }, [id]);

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="mb-8 flex justify-between items-center no-print">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{setName}</h1>
                    <p className="text-gray-600 mt-1">{tcgGames[setGame]} • {set.length} cards</p>
                </div>
                <div className="flex gap-4">
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
                {set.map((item, index) => (
                    <React.Fragment key={index}>
                        {/* Front of card */}
                        <div 
                            className="w-64 h-80 rounded-lg p-3 bg-gray-100 break-inside-avoid print:w-60 print:h-72 print:bg-gray-100"
                            style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
                        >
                            <div className="w-full h-full flex flex-col items-center justify-between border border-gray-600 rounded-lg bg-white shadow-sm">
                                <div className="text-center pt-4">
                                    <h2 className="text-lg font-bold text-gray-800">{setName}</h2>
                                </div>
                                <div className="flex-1 flex items-center justify-center px-4">
                                    <p className="text-center text-gray-900 font-medium text-lg break-words">
                                        {item.name}
                                    </p>
                                </div>
                                <div className="self-end p-3">
                                    <span className="text-sm text-gray-600 font-medium">
                                        {item.number}/{set.length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Page break and card backs for printing (every 9 cards) */}
                        {(index + 1) % 9 === 0 && (
                            <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always', pageBreakAfter: 'always' }}>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: Math.min(9, set.length - index + 8) }, (_, backIndex) => {
                                        const cardIndex = index - 8 + backIndex;
                                        if (cardIndex < 0 || cardIndex >= set.length) return null;
                                        
                                        return (
                                            <div 
                                                key={`back-${cardIndex}`}
                                                className="w-60 h-72 p-3 bg-gray-100 break-inside-avoid print:bg-gray-100"
                                                style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
                                            >
                                                <div className="w-full h-full flex flex-col items-center justify-center border border-gray-600 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 shadow-sm">
                                                    <div className="text-center text-white">
                                                        <h1 className="text-4xl font-bold mb-4">Stronghold</h1>
                                                        <h2 className="text-2xl font-semibold">TCG</h2>
                                                        <div className="mt-8 text-6xl opacity-20">⚔️</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {/* Handle remaining cards if the last page doesn't have exactly 9 cards */}
                {set.length % 9 !== 0 && (
                    <div className="hidden print:block w-full" style={{ pageBreakBefore: 'always' }}>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: set.length % 9 }, (_, backIndex) => {
                                const totalPages = Math.floor(set.length / 9);
                                const cardIndex = totalPages * 9 + backIndex;
                                
                                return (
                                    <div 
                                        key={`back-final-${cardIndex}`}
                                        className="w-60 h-72 p-3 bg-gray-100 break-inside-avoid print:bg-gray-100"
                                        style={{ pageBreakInside: 'avoid', printColorAdjust: 'exact' }}
                                    >
                                        <div className="w-full h-full flex flex-col items-center justify-center border border-gray-600 rounded-lg bg-gradient-to-br from-blue-900 to-purple-900 shadow-sm">
                                            <div className="text-center text-white">
                                                <h1 className="text-4xl font-bold mb-4">Stronghold</h1>
                                                <h2 className="text-2xl font-semibold">TCG</h2>
                                                <div className="mt-8 text-6xl opacity-20">⚔️</div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {set.length === 0 && (
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