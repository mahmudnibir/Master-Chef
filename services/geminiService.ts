import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A creative and appealing name for the recipe."
    },
    description: {
      type: Type.STRING,
      description: "A short, enticing summary of the dish."
    },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of all ingredients required, including quantities."
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "Step-by-step cooking instructions."
    },
    prepTime: {
      type: Type.STRING,
      description: "Estimated preparation time, e.g., '15 minutes'."
    },
    cookTime: {
      type: Type.STRING,
      description: "Estimated cooking time, e.g., '30 minutes'."
    },
    servings: {
      type: Type.NUMBER,
      description: "The number of servings this recipe is designed for, as a number."
    },
    difficulty: {
      type: Type.STRING,
      description: "The difficulty level of the recipe, which must be one of: 'Easy', 'Medium', or 'Hard'."
    },
    nutrition: {
      type: Type.OBJECT,
      description: "Estimated nutritional information per serving.",
      properties: {
        calories: { type: Type.STRING, description: "Estimated calories, e.g., '450 kcal'." },
        protein: { type: Type.STRING, description: "Estimated protein, e.g., '30g'." },
        carbs: { type: Type.STRING, description: "Estimated carbohydrates, e.g., '40g'." },
        fats: { type: Type.STRING, description: "Estimated fats, e.g., '20g'." },
      },
      required: ["calories", "protein", "carbs", "fats"],
    },
    allergens: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of potential common allergens (e.g., 'Gluten', 'Dairy', 'Nuts'). Provide an empty array if none are obvious."
    },
    seasonalOrTrending: {
      type: Type.STRING,
      description: "A brief explanation if the recipe is seasonal or currently trending. For example: 'Perfect for autumn with seasonal squash.' or 'A trending dish on social media.' Leave empty if not applicable."
    },
    chefTips: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of 2-3 expert cooking tips, plating suggestions, or variations for the recipe."
    }
  },
  required: ["title", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings", "difficulty", "nutrition", "allergens", "seasonalOrTrending", "chefTips"],
};

export async function generateRecipe(ingredients: string[], dietaryPreference: string, cuisine: string, calorieLimit: string): Promise<Recipe> {
  const dietaryInstruction = dietaryPreference !== 'None' ? `The recipe MUST be ${dietaryPreference}.` : '';
  const cuisineInstruction = cuisine !== 'Any' ? `The recipe should be of ${cuisine} cuisine.` : '';

  let calorieInstruction = '';
  switch (calorieLimit) {
    case 'Low':
      calorieInstruction = 'The recipe should be low in calories, ideally under 400 calories per serving.';
      break;
    case 'Medium':
      calorieInstruction = 'The recipe should be moderate in calories, ideally between 400 and 700 calories per serving.';
      break;
    case 'High':
      calorieInstruction = 'The recipe can be high in calories, suitable for a bulking diet, over 700 calories per serving.';
      break;
  }

  const prompt = `You are a world-class chef. Create a delicious and creative recipe using primarily the following ingredients: ${ingredients.join(', ')}. 
  ${dietaryInstruction}
  ${cuisineInstruction}
  ${calorieInstruction}
  You can assume common pantry staples like salt, pepper, oil, water, flour, sugar, and basic spices are available, but mention them in the ingredient list if used.
  The recipe should be practical for a home cook, popular, and highly-rated. Make the title unique and the description enticing.
  Provide an estimated nutritional breakdown (calories, protein, carbs, fats) per serving.
  Provide a brief explanation if the recipe is seasonal or currently trending. 
  Also, provide a few expert "AI Chef Tips" for presentation, variations, or cooking techniques.
  The recipe should be for 4 servings.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });
    
    const text = response.text.trim();
    const recipeData = JSON.parse(text);

    return recipeData as Recipe;

  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate a recipe from the AI. The chef might be on a break!");
  }
}