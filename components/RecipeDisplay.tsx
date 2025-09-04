import React, { useState, useEffect } from 'react';
import type { Recipe } from '../types';
import Spinner from './Spinner';
import { ShareIcon } from './icons/ShareIcon';
import { RegenerateIcon } from './icons/RegenerateIcon';
import { StarIcon } from './icons/StarIcon';
import { ChefHatIcon } from './icons/ChefHatIcon';
import { AlertIcon } from './icons/AlertIcon';
import { TrendingIcon } from './icons/TrendingIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { FireIcon } from './icons/FireIcon';
import { ProteinIcon } from './icons/ProteinIcon';
import { CarbsIcon } from './icons/CarbsIcon';
import { FatIcon } from './icons/FatIcon';


interface RecipeDisplayProps {
  recipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

const StarRating: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
    setFeedback(true);
    setTimeout(() => setFeedback(false), 2000);
  }

  if (feedback) {
    return <p className="text-center text-amber-600 font-semibold">Thanks for your feedback!</p>
  }
  
  return (
    <div className="flex justify-center items-center space-x-1">
       {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={starValue}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
            aria-label={`Rate ${starValue} star`}
          >
            <StarIcon 
              className={`h-7 w-7 transition-colors ${starValue <= (hoverRating || rating) ? 'text-amber-500' : 'text-stone-300'}`} 
            />
          </button>
        );
      })}
    </div>
  );
};

// Helper to scale ingredient quantities
const scaleIngredient = (ingredient: string, factor: number): string => {
  if (factor === 1 || !ingredient) return ingredient;

  return ingredient.replace(/(\d+\s*\/\s*\d+)|(\d*\.?\d+)/g, (match) => {
    let num;
    if (match.includes('/')) {
      const [numerator, denominator] = match.split('/').map(s => parseFloat(s.trim()));
      if (denominator === 0) return match;
      num = numerator / denominator;
    } else {
      num = parseFloat(match);
    }

    if (isNaN(num)) return match;
    
    const scaledNum = num * factor;
    if (scaledNum <= 0) return match;

    // Round to 2 decimal places and remove trailing zeros
    const rounded = parseFloat(scaledNum.toFixed(2));
    return rounded.toString();
  });
};

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, isLoading, error, onRegenerate }) => {
  const [copyStatus, setCopyStatus] = useState<string>('Share');
  const [displayServings, setDisplayServings] = useState(recipe?.servings || 0);

  useEffect(() => {
    if (recipe) {
      setDisplayServings(recipe.servings);
    }
  }, [recipe]);

  const handleShare = async () => {
    if (!recipe) return;
    const recipeTitle = recipe.title;
    const shareText = `Check out this recipe I found using Pantry Chef AI: "${recipe.description}"`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipeTitle, text: shareText });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      const ingredientsText = recipe.ingredients.map(ing => `- ${ing}`).join('\n');
      const instructionsText = recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join('\n');
      const fullRecipeText = `${recipe.title}\n\n"${recipe.description}"\n\n--- INGREDIENTS ---\n${ingredientsText}\n\n--- INSTRUCTIONS ---\n${instructionsText}`;
      
      try {
        await navigator.clipboard.writeText(fullRecipeText);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Share'), 2500);
      } catch (err) {
        console.error('Failed to copy recipe:', err);
        setCopyStatus('Error!');
        setTimeout(() => setCopyStatus('Share'), 2500);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center p-8 mt-8">
        <Spinner />
        <p className="text-lg text-stone-600 mt-4 font-serif">Simmering up some ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
        <p className="font-bold">Oh no!</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
       <div className="text-center p-12 mt-8 bg-white/50 border-2 border-dashed border-emerald-200 rounded-2xl">
         <ChefHatIcon className="h-16 w-16 mx-auto text-emerald-300" />
         <h3 className="mt-4 text-2xl font-serif text-emerald-800">Your Culinary Creation Awaits</h3>
         <p className="text-stone-500 mt-2 max-w-sm mx-auto">Add ingredients to your pantry list and let our AI chef craft a personalized recipe just for you.</p>
       </div>
    );
  }

  const scaleFactor = recipe.servings > 0 ? displayServings / recipe.servings : 1;
  const scaledIngredients = recipe.ingredients.map(ing => scaleIngredient(ing, scaleFactor));

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-stone-200 animate-fade-in-up">
      <div className="flex justify-center sm:justify-end gap-2 mb-4">
        <button onClick={onRegenerate} className="flex items-center justify-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all duration-200 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500" aria-label="Regenerate recipe" title="Get a new recipe with the same ingredients">
          <RegenerateIcon className="h-5 w-5 mr-2" /> Regenerate
        </button>
        <button onClick={handleShare} className="flex items-center justify-center px-4 py-2 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all duration-200 font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500" aria-label="Share recipe" title="Share recipe">
          <ShareIcon className="h-5 w-5 mr-2" /> {copyStatus}
        </button>
      </div>

      <h2 className="text-3xl md:text-4xl font-bold text-center text-emerald-800 mb-3">{recipe.title}</h2>
      <p className="text-center text-stone-600 mb-6 italic">"{recipe.description}"</p>

      <div className="flex justify-center mb-6">
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${difficultyColors[recipe.difficulty] || 'bg-stone-100 text-stone-800'}`}>
          {recipe.difficulty}
        </span>
      </div>

      {recipe.seasonalOrTrending && (
         <div className="mb-6 p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start text-emerald-900">
           <TrendingIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
           <div>
             <h4 className="font-bold">Seasonal Note</h4>
             <p className="text-sm">{recipe.seasonalOrTrending}</p>
           </div>
         </div>
      )}

      {recipe.allergens && recipe.allergens.length > 0 && (
        <div className="mb-6 p-4 bg-amber-100/60 border border-amber-200 rounded-lg flex items-start text-amber-900">
          <AlertIcon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Allergy Info</h4>
            <p className="text-sm">This recipe may contain: {recipe.allergens.join(', ')}.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 text-center mb-8 border-y border-stone-200 py-4">
        <div>
          <p className="font-bold text-stone-700">Prep Time</p>
          <p className="text-emerald-600 text-lg">{recipe.prepTime}</p>
        </div>
        <div className="border-l border-stone-200">
          <p className="font-bold text-stone-700">Cook Time</p>
          <p className="text-emerald-600 text-lg">{recipe.cookTime}</p>
        </div>
      </div>
      
      {recipe.nutrition && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-center text-stone-800 mb-4 font-serif">Nutritional Info <span className="text-sm font-normal text-stone-500">(per serving)</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center bg-amber-50/70 p-4 rounded-xl">
            <div className="flex flex-col items-center">
              <FireIcon className="h-6 w-6 text-red-500 mb-1" />
              <span className="text-sm font-semibold text-stone-600">Calories</span>
              <span className="font-bold text-emerald-700">{recipe.nutrition.calories}</span>
            </div>
            <div className="flex flex-col items-center">
              <ProteinIcon className="h-6 w-6 text-blue-500 mb-1" />
              <span className="text-sm font-semibold text-stone-600">Protein</span>
              <span className="font-bold text-emerald-700">{recipe.nutrition.protein}</span>
            </div>
            <div className="flex flex-col items-center">
              <CarbsIcon className="h-6 w-6 text-orange-500 mb-1" />
              <span className="text-sm font-semibold text-stone-600">Carbs</span>
              <span className="font-bold text-emerald-700">{recipe.nutrition.carbs}</span>
            </div>
            <div className="flex flex-col items-center">
              <FatIcon className="h-6 w-6 text-yellow-500 mb-1" />
              <span className="text-sm font-semibold text-stone-600">Fats</span>
              <span className="font-bold text-emerald-700">{recipe.nutrition.fats}</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-stone-800 mb-4 font-serif">Ingredients</h3>
          <div className="flex items-center gap-4 mb-4 bg-amber-50/70 p-2 rounded-full">
            <span className="font-semibold text-stone-700 pl-2">Servings:</span>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => setDisplayServings(s => Math.max(1, s - 1))} className="h-8 w-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 font-bold text-lg flex items-center justify-center" aria-label="Decrease servings">-</button>
              <span className="w-8 text-center font-bold text-emerald-700">{displayServings}</span>
              <button onClick={() => setDisplayServings(s => s + 1)} className="h-8 w-8 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 font-bold text-lg flex items-center justify-center" aria-label="Increase servings">+</button>
            </div>
          </div>
          <ul className="space-y-2 list-disc list-inside text-stone-700">
            {scaledIngredients.map((ingredient, index) => (
              <li key={index} className="pl-2">{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-2xl font-bold text-stone-800 mb-4 font-serif">Instructions</h3>
          <ol className="space-y-4 text-stone-700">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-3 flex-shrink-0 bg-emerald-600 text-white rounded-full h-7 w-7 flex items-center justify-center font-bold">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      
       {recipe.chefTips && recipe.chefTips.length > 0 && (
         <div className="mt-8 pt-6 border-t border-stone-200">
           <div className="flex items-center justify-center mb-4 gap-3">
            <LightbulbIcon className="h-6 w-6 text-amber-500" />
            <h3 className="text-xl font-bold text-stone-800 font-serif">AI Chef's Tips</h3>
           </div>
           <ul className="space-y-2 list-disc list-inside text-stone-700 max-w-2xl mx-auto">
             {recipe.chefTips.map((tip, index) => (
               <li key={index}>{tip}</li>
             ))}
           </ul>
         </div>
       )}

      <div className="mt-8 pt-6 border-t border-stone-200">
        <h3 className="text-center text-lg font-semibold text-stone-700 mb-3">Did you like this recipe?</h3>
        <StarRating />
      </div>
    </div>
  );
};

export default RecipeDisplay;