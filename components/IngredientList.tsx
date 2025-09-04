
import React from 'react';
import { XIcon } from './icons/XIcon';

interface IngredientListProps {
  ingredients: string[];
  onRemoveIngredient: (ingredient: string) => void;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onRemoveIngredient }) => {
  if (ingredients.length === 0) {
    return <p className="text-center text-stone-500 italic">Add some ingredients to get started!</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {ingredients.map((ingredient) => (
        <span
          key={ingredient}
          className="flex items-center bg-amber-200 text-amber-900 text-sm font-medium px-3 py-1 rounded-full animate-fade-in"
        >
          {ingredient}
          <button
            onClick={() => onRemoveIngredient(ingredient)}
            className="ml-2 text-amber-700 hover:text-amber-900"
            aria-label={`Remove ${ingredient}`}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
    </div>
  );
};

export default IngredientList;
