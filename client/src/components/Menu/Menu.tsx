import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuProps {
    className?: string;
}

const Menu: React.FC<MenuProps> = ({ className }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/sets', label: 'All Sets' },
        { path: '/sets/pokemon', label: 'Pokémon' },
        { path: '/sets/lorcana', label: 'Lorcana' },
        { path: '/sets/magic', label: 'Magic' },
        { path: '/sets/yugioh', label: 'Yu-Gi-Oh!' },
        { path: '/sets/create', label: 'Create Set' },
    ];

    const isActivePath = (path: string) => {
        if (path === '/sets') {
            return location.pathname === '/' || location.pathname === '/sets';
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <nav className={className}>
            <ul className="flex list-none m-0 p-0 gap-8">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <Link
                            to={item.path}
                            className={`text-base no-underline transition-colors duration-200 hover:text-white ${
                                isActivePath(item.path) 
                                    ? 'text-white font-semibold' 
                                    : 'text-gray-300 font-normal'
                            }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Menu;
