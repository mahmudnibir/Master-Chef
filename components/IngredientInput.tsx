import React, { useState, useEffect, useRef } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { suggestions } from '../data/suggestions';
import ConfirmationModal from './ConfirmationModal';

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ onAddIngredient }) => {
  const [ingredient, setIngredient] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingredientToConfirm, setIngredientToConfirm] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setFilteredSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIngredient(value);
    if (value.length > 1) {
      const lowercasedValue = value.toLowerCase();
      const filtered = suggestions.filter(s => 
        s.toLowerCase().includes(lowercasedValue)
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onAddIngredient(suggestion);
    setIngredient('');
    setFilteredSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedIngredient = ingredient.trim();
    if (trimmedIngredient) {
      const isKnownIngredient = suggestions.some(
        (s) => s.toLowerCase() === trimmedIngredient.toLowerCase()
      );

      if (isKnownIngredient) {
        onAddIngredient(trimmedIngredient);
        setIngredient('');
        setFilteredSuggestions([]);
      } else {
        setIngredientToConfirm(trimmedIngredient);
        setIsModalOpen(true);
      }
    }
  };

  const handleConfirmAdd = () => {
    if (ingredientToConfirm) {
      onAddIngredient(ingredientToConfirm);
    }
    handleCloseModal();
    setIngredient('');
    setFilteredSuggestions([]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIngredientToConfirm(null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-1">
        <input
          type="text"
          value={ingredient}
          onChange={handleInputChange}
          placeholder="Add an ingredient..."
          className="flex-grow p-3 border border-amber-200 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-amber-800 placeholder:opacity-60 bg-white"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-white p-3 rounded-full hover:bg-emerald-600 transition-colors flex-shrink-0 shadow transform hover:scale-105"
          aria-label="Add Ingredient"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </form>
      {filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-stone-200 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion) => (
            <li 
              key={suggestion} 
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-3 cursor-pointer hover:bg-amber-50"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        title="Unrecognized Ingredient"
        message={
          <>
            <p>The ingredient <strong className="text-emerald-700">"{ingredientToConfirm}"</strong> is not on our suggestion list.</p>
            <p className="mt-2 text-sm text-stone-500">Using it might affect the quality of the recipe results. Do you still want to add it?</p>
          </>
        }
      />
    </div>
  );
};

export default IngredientInput;
