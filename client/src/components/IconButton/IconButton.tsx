import React from 'react';

interface IconButtonProps {
    icon: 'three-dots' | 'edit' | 'delete' | 'add' | 'close';
    size?: 'sm' | 'md' | 'lg';
    onClick: (e: React.MouseEvent) => void;
    className?: string;
    disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ 
    icon, 
    size = 'md', 
    onClick, 
    className = '', 
    disabled = false 
}) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const buttonSizeClasses = {
        sm: 'p-1',
        md: 'p-2',
        lg: 'p-3'
    };

    const getIcon = () => {
        switch (icon) {
            case 'three-dots':
                return (
                    <svg className={`${sizeClasses[size]} text-gray-500`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                );
            case 'edit':
                return (
                    <svg className={`${sizeClasses[size]} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case 'delete':
                return (
                    <svg className={`${sizeClasses[size]} text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                );
            case 'add':
                return (
                    <svg className={`${sizeClasses[size]} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
            case 'close':
                return (
                    <svg className={`${sizeClasses[size]} text-gray-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`
                ${buttonSizeClasses[size]} 
                hover:bg-gray-100 
                rounded-full 
                transition-colors 
                duration-200 
                disabled:opacity-50 
                disabled:cursor-not-allowed
                ${className}
            `}
        >
            {getIcon()}
        </button>
    );
};

export default IconButton;
