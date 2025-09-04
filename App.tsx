import React, { useState, useCallback } from 'react';
import type { Recipe } from './types';
import { generateRecipe } from './services/geminiService';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import IngredientList from './components/IngredientList';
import RecipeDisplay from './components/RecipeDisplay';
import Footer from './components/Footer';
import CustomDropdown from './components/CustomDropdown';

const dietaryOptions = ['None', 'Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Low-Carb'];
const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Chinese', 'Indian', 'Thai', 'Japanese', 'American', 'Mediterranean'];
const calorieOptions = ['Any', 'Low', 'Medium', 'High'];

function App() {
  const [ingredients, setIngredients] = useState<string[]>(['Tomatoes', 'Chicken Breast', 'Garlic']);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<string>('None');
  const [cuisine, setCuisine] = useState<string>('Any');
  const [calorieLimit, setCalorieLimit] = useState<string>('Any');

  const addIngredient = (ingredient: string) => {
    const formattedIngredient = ingredient.trim().charAt(0).toUpperCase() + ingredient.trim().slice(1);
    if (formattedIngredient && !ingredients.includes(formattedIngredient)) {
      setIngredients([...ingredients, formattedIngredient]);
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const generatedRecipe = await generateRecipe(ingredients, dietaryPreference, cuisine, calorieLimit);
      setRecipe(generatedRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, dietaryPreference, cuisine, calorieLimit]);

  const filterConfigs = [
    {
      id: 'dietary-prefs',
      label: 'Dietary Preference',
      options: dietaryOptions,
      value: dietaryPreference,
      onChange: setDietaryPreference,
    },
    {
      id: 'cuisine-prefs',
      label: 'Cuisine',
      options: cuisineOptions,
      value: cuisine,
      onChange: setCuisine,
    },
    {
      id: 'calorie-prefs',
      label: 'Calorie Target',
      options: calorieOptions,
      value: calorieLimit,
      onChange: setCalorieLimit,
    },
  ];

  return (
    <div className="min-h-screen bg-amber-50 text-stone-800 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <section className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-stone-200">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-800 mb-2">What's in your pantry?</h2>
            <p className="text-center text-stone-600 mb-6">Add your ingredients and let our AI chef whip up a recipe for you!</p>
            
            <IngredientInput onAddIngredient={addIngredient} />
            <IngredientList ingredients={ingredients} onRemoveIngredient={removeIngredient} />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {filterConfigs.map((filter) => (
                <CustomDropdown
                  key={filter.id}
                  id={filter.id}
                  label={filter.label}
                  options={filter.options}
                  value={filter.value}
                  onChange={filter.onChange}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <button
                onClick={handleGenerateRecipe}
                disabled={isLoading || ingredients.length === 0}
                className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? 'Crafting Recipe...' : 'Generate Recipe'}
              </button>
            </div>
          </section>

          <RecipeDisplay recipe={recipe} isLoading={isLoading} error={error} onRegenerate={handleGenerateRecipe} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;