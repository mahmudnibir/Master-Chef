export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fats: string;
  };
  allergens: string[];
  seasonalOrTrending: string;
  chefTips: string[];
}