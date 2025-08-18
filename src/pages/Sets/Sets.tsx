import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from '../../components/Modal';

type Card = {
    name: string;
    number: number;
}

type TCGGame = 'pokemon' | 'lorcana' | 'magic' | 'yugioh' | 'other';

type SetData = {
    name: string;
    game: TCGGame;
    cards: Card[];
}

interface SetsProps {
    game?: TCGGame;
}

const Sets: React.FC<SetsProps> = ({ game }) => {
    const [sets, setSets] = React.useState<{ [key: string]: SetData }>({});
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [setToDelete, setSetToDelete] = React.useState<{ id: string; name: string } | null>(null);
    const navigate = useNavigate();

    const tcgGames: { [key in TCGGame]: string } = {
        pokemon: 'Pokémon',
        lorcana: 'Lorcana',
        magic: 'Magic: The Gathering',
        yugioh: 'Yu-Gi-Oh!',
        other: 'Other'
    };

    useEffect(() => {
        // Load existing sets from localStorage if available
        const storedSets = localStorage.getItem('sets');
        if (storedSets) {
            setSets(JSON.parse(storedSets));
        }
    }, []);

    // Filter sets by game if specified
    const filteredSets = game 
        ? Object.keys(sets).filter(setId => sets[setId].game === game)
        : Object.keys(sets);

    const getPageTitle = () => {
        if (game) {
            return `${tcgGames[game]} Sets`;
        }
        return 'All Sets';
    };

    const handleDeleteClick = (setId: string, setName: string) => {
        setSetToDelete({ id: setId, name: setName });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (setToDelete) {
            const updatedSets = { ...sets };
            delete updatedSets[setToDelete.id];
            setSets(updatedSets);
            localStorage.setItem('sets', JSON.stringify(updatedSets));
        }
        setShowDeleteModal(false);
        setSetToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSetToDelete(null);
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <button 
                    onClick={() => navigate('/sets/create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
                >
                    Create New Set
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number of cards</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSets.map((set, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <a 
                                        href={`/sets/${set}`} 
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        {sets[set].name}
                                    </a>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {tcgGames[sets[set].game]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {sets[set].cards.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleDeleteClick(set, sets[set].name)}
                                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {filteredSets.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            {game ? `No ${tcgGames[game]} sets found.` : 'No sets found.'}
                        </div>
                        <button 
                            onClick={() => navigate('/sets/create')}
                            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Create your first set
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={handleCancelDelete}
                title="Confirm Delete"
                actions={
                    <>
                        <button
                            onClick={handleCancelDelete}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
                        >
                            Delete
                        </button>
                    </>
                }
            >
                <p className="text-gray-600">
                    Are you sure you want to delete the set "{setToDelete?.name}"? This action cannot be undone.
                </p>
            </Modal>
        </div>
    );
}

export default Sets;