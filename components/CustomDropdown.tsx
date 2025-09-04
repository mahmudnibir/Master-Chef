import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface CustomDropdownProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ id, label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label htmlFor={id} className="block text-center text-stone-700 font-semibold mb-2">{label}</label>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-stone-800">{value}</span>
        <ChevronDownIcon className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          className="absolute z-20 w-full bg-white border border-stone-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto animate-fade-in"
          role="listbox"
          aria-labelledby={id}
        >
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className={`p-3 cursor-pointer hover:bg-amber-50 ${value === option ? 'font-bold text-emerald-700' : 'text-stone-700'}`}
              role="option"
              aria-selected={value === option}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
