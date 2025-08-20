import React, { useState, useEffect, useRef } from 'react';

export interface DropdownMenuItem {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
  menuClassName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  closeOnItemClick?: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  className = '',
  menuClassName = '',
  position = 'bottom-right',
  closeOnItemClick = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: DropdownMenuItem) => (e: React.MouseEvent) => {
    if (!item.disabled) {
      item.onClick(e);
      if (closeOnItemClick) {
        setIsOpen(false);
      }
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'top-full left-0 mt-1';
      case 'top-right':
        return 'bottom-full right-0 mb-1';
      case 'top-left':
        return 'bottom-full left-0 mb-1';
      case 'bottom-right':
      default:
        return 'top-full right-0 mt-1';
    }
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger element */}
      <div onClick={handleTriggerClick}>
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`
            absolute ${getPositionClasses()} 
            bg-white border border-gray-200 rounded-lg shadow-lg z-10 
            min-w-32 
            ${menuClassName}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, index) => (
            <div key={index}>
              <button
                onClick={handleItemClick(item)}
                disabled={item.disabled}
                className={`
                  w-full px-4 py-2 text-left text-sm 
                  hover:bg-gray-100 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${index === 0 ? 'rounded-t-lg' : ''}
                  ${index === items.length - 1 ? 'rounded-b-lg' : ''}
                  ${item.className || 'text-gray-700'}
                `}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
