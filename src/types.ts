export type CuisineType =
  | 'Indian'
  | 'Italian'
  | 'Mexican'
  | 'Chinese'
  | 'Japanese'
  | 'Korean'
  | 'Thai'
  | 'Mediterranean'
  | 'Middle Eastern'
  | 'American'
  | 'French'
  | 'Greek'
  | 'Turkish'
  | 'Vietnamese'
  | 'South Asian'
  | 'Other';

export type IndianRegion =
  | 'North Indian'
  | 'South Indian'
  | 'Bengali'
  | 'Gujarati'
  | 'Maharashtrian'
  | 'Punjabi'
  | 'Rajasthani'
  | 'Indo-Chinese'
  | 'Goan'
  | 'Kashmiri'
  | 'General Indian';

export type MealType =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snack'
  | 'Dessert'
  | 'Side'
  | 'Drink';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface IngredientItem {
  original: string; // e.g., "2 medium potatoes, boiled and cubed"
  item: string; // e.g., "potato"
  amount?: number;
  unit?: string;
  isCore?: boolean; // Core ingredient vs common pantry staple (salt, oil)
}

export interface Substitution {
  ingredient: string;
  substitutes: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: CuisineType;
  region?: IndianRegion | string;
  mealType: MealType;
  dietaryTags: string[]; // e.g. 'Vegetarian', 'Vegan', 'High Protein', 'Gluten Free'
  ingredients: IngredientItem[];
  optionalIngredients?: string[];
  substitutions?: Substitution[];
  steps: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  totalTime: number; // in minutes
  difficulty: DifficultyLevel;
  servings: number;
  calories: number; // per serving
  protein: number; // g per serving
  carbs: number; // g per serving
  fat: number; // g per serving
  fiber: number; // g per serving
  estimatedCost: number;
  currency: '₹' | '$';
  image: string;
  tags: string[];
  popularity: number; // 1-100
  isSpicy?: boolean;
  isSweet?: boolean;
}

export interface MatchResult {
  recipe: Recipe;
  matchedIngredients: string[];
  missingIngredients: (string | IngredientItem)[];
  haveIngredients?: (string | IngredientItem)[];
  matchPercentage: number; // 0 - 100
  missingCount: number;
  matchedCount: number;
  totalRequired: number;
  scaledServings?: number;
}

export type DietaryTag = 'Vegetarian' | 'Vegan' | 'Gluten Free' | 'High Protein' | 'Dairy Free' | string;

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: string;
  recipeId?: string;
  recipeName?: string;
  checked: boolean;
  completed?: boolean;
  createdAt?: number;
}

export type SortOption =
  | 'best-match'
  | 'fewest-missing'
  | 'match-percentage'
  | 'fastest'
  | 'quickest'
  | 'lowest-cost'
  | 'highest-protein'
  | 'lowest-calories'
  | 'calories-low'
  | 'most-popular'
  | 'popularity';

export interface FilterState {
  cuisine: string;
  region: string;
  mealType: string;
  dietary: string[];
  maxTime?: number | null;
  maxCookTime?: number | null;
  difficulty?: string | null;
  sortBy: SortOption;
  onlyCanMake?: boolean;
  missingLimit?: number | null;
  searchQuery: string;
}

export type ActiveTab =
  | 'home'
  | 'what-i-have'
  | 'explore'
  | 'favorites'
  | 'i-want-to-make'
  | 'shopping-list'
  | 'recently-viewed';
