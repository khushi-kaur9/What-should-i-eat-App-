import { Recipe } from '../types';
import { NORTH_INDIAN_RECIPES } from './indianRecipesNorth';
import { SOUTH_INDIAN_RECIPES } from './indianRecipesSouth';
import { REGIONAL_INDIAN_RECIPES } from './indianRecipesRegional';
import { GLOBAL_RECIPES } from './globalRecipes';

export const ALL_RECIPES: Recipe[] = [
  ...NORTH_INDIAN_RECIPES,
  ...SOUTH_INDIAN_RECIPES,
  ...REGIONAL_INDIAN_RECIPES,
  ...GLOBAL_RECIPES,
];

// Curated pantry staples & fresh ingredients for quick-tap adding
export const COMMON_PANTRY_INGREDIENTS = [
  { name: 'Potato', icon: '🥔', category: 'Vegetables' },
  { name: 'Tomato', icon: '🍅', category: 'Vegetables' },
  { name: 'Onion', icon: '🧅', category: 'Vegetables' },
  { name: 'Garlic', icon: '🧄', category: 'Vegetables' },
  { name: 'Ginger', icon: '🫚', category: 'Spices' },
  { name: 'Chilli', icon: '🌶️', category: 'Vegetables' },
  { name: 'Rice', icon: '🍚', category: 'Grains' },
  { name: 'Paneer', icon: '🧀', category: 'Dairy' },
  { name: 'Egg', icon: '🥚', category: 'Dairy' },
  { name: 'Chicken', icon: '🍗', category: 'Meat' },
  { name: 'Milk', icon: '🥛', category: 'Dairy' },
  { name: 'Yogurt', icon: '🥣', category: 'Dairy' },
  { name: 'Wheat Flour', icon: '🌾', category: 'Grains' },
  { name: 'Pasta', icon: '🍝', category: 'Grains' },
  { name: 'Noodles', icon: '🍜', category: 'Grains' },
  { name: 'Cheese', icon: '🧀', category: 'Dairy' },
  { name: 'Butter', icon: '🧈', category: 'Dairy' },
  { name: 'Ghee', icon: '🫙', category: 'Dairy' },
  { name: 'Lemon', icon: '🍋', category: 'Produce' },
  { name: 'Spinach', icon: '🥬', category: 'Vegetables' },
  { name: 'Capsicum', icon: '🫑', category: 'Vegetables' },
  { name: 'Cumin', icon: '🌿', category: 'Spices' },
  { name: 'Turmeric', icon: '✨', category: 'Spices' },
  { name: 'Mustard', icon: '🟡', category: 'Spices' },
  { name: 'Peanut', icon: '🥜', category: 'Nuts' },
  { name: 'Coconut', icon: '🥥', category: 'Produce' },
  { name: 'Toor Dal', icon: '🥣', category: 'Lentils' },
  { name: 'Chana Dal', icon: '🫘', category: 'Lentils' },
  { name: 'Urad Dal', icon: '⚪', category: 'Lentils' },
  { name: 'Chickpeas', icon: '🧆', category: 'Lentils' },
  { name: 'Coriander', icon: '🌿', category: 'Herbs' },
  { name: 'Bread', icon: '🍞', category: 'Bakery' },
  { name: 'Soy Sauce', icon: '🍶', category: 'Condiments' },
];

export const CUISINES_LIST = [
  'All',
  'Indian',
  'Italian',
  'Mexican',
  'Japanese',
  'Korean',
  'Thai',
  'Middle Eastern',
  'Greek',
  'American',
];

export const REGIONS_LIST = [
  'All',
  'North Indian',
  'South Indian',
  'Bengali',
  'Gujarati',
  'Maharashtrian',
  'Rajasthani',
  'Indo-Chinese',
];

export const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Side'];
