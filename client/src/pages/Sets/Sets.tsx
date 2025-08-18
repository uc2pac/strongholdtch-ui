import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Modal from '../../components/Modal';
import { apiService, Set, TCGGame } from '../../services/api';

interface SetsProps {
    game?: TCGGame;
}

const Sets: React.FC<SetsProps> = ({ game }) => {
    const [sets, setSets] = React.useState<Set[]>([]);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [setToDelete, setSetToDelete] = React.useState<{ id: string; name: string } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const tcgGames: { [key in TCGGame]: string } = {
        pokemon: 'Pokémon',
        lorcana: 'Lorcana',
        magic: 'Magic: The Gathering',
        yugioh: 'Yu-Gi-Oh!',
        other: 'Other'
    };

    useEffect(() => {
        const loadSets = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedSets = await apiService.getSets(game);
                setSets(fetchedSets);
            } catch (error) {
                console.error('Error loading sets:', error);
                setError(error instanceof Error ? error.message : 'Failed to load sets');
            } finally {
                setIsLoading(false);
            }
        };

        loadSets();
    }, [game]);

    // Filter sets by game if specified (now handled by API)
    const filteredSets = sets;

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

    const handleConfirmDelete = async () => {
        if (setToDelete) {
            try {
                await apiService.deleteSet(setToDelete.id);
                // Reload sets after successful deletion
                const updatedSets = await apiService.getSets(game);
                setSets(updatedSets);
            } catch (error) {
                console.error('Error deleting set:', error);
                alert(`Failed to delete set: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
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

            {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">Loading sets...</div>
                </div>
            ) : (
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
                            {filteredSets.map((set) => (
                                <tr key={set.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a 
                                            href={`/sets/${set.id}`} 
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            {set.name}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {tcgGames[set.game]}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {set.card_count || set.cards?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDeleteClick(set.id, set.name)}
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
            )}

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