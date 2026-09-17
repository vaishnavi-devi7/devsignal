import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 w-56 rounded-md bg-surface border border-border shadow-dropdown animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical" onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon: Icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-2 text-sm text-primary hover:bg-surfaceHover transition-colors ${className}`}
      role="menuitem"
    >
      {Icon && <span className="mr-2 text-secondary"><Icon size={16} /></span>}
      {children}
    </button>
  );
};

export default Dropdown;
