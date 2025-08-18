import React from 'react';
import Menu from '../Menu';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = 'Stronghold TCG' }) => {
    return (
        <header className="w-full px-8 py-4 bg-gray-800 text-white flex items-center justify-between shadow-lg no-print">
            <h1 className="m-0 text-2xl font-bold">{title}</h1>
            <Menu />
        </header>
    );
};

export default Header;