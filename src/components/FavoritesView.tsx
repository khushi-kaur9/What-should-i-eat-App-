import React from 'react';
import { Heart, UtensilsCrossed, Sparkles, ChefHat } from 'lucide-react';
import { Recipe, MatchResult, ShoppingItem } from '../types';
import { RecipeCard } from './RecipeCard';

interface FavoritesViewProps {
  favorites: Recipe[];
  matchResults: Record<string, MatchResult>;
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipeId: string) => void;
  onAddToShoppingList: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  isInShoppingList: (itemName: string) => boolean;
  onGoToDiscover: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  matchResults,
  onToggleFavorite,
  onSelectRecipe,
  onAddToShoppingList,
  isInShoppingList,
  onGoToDiscover,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#ded8cb]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#b85d43] flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2723] tracking-tight">
              I Miei Preferiti
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7a7164] mt-1 font-sans">
            Your personal cookbook of favorite and saved recipes
          </p>
        </div>

        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#fbf0ec] text-[#b85d43] border border-[#f3d9d0]">
          {favorites.length} saved
        </span>
      </div>

      {favorites.length === 0 ? (
        <div className="py-20 text-center bg-[#faf8f5] rounded-3xl border border-dashed border-[#ded8cb]">
          <div className="w-16 h-16 rounded-full bg-[#fbf0ec] flex items-center justify-center text-[#b85d43] mx-auto mb-3 shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2b2723]">No saved recipes yet!</h3>
          <p className="text-xs sm:text-sm text-[#7a7164] max-w-sm mx-auto mt-1 mb-6 font-sans">
            Tap the heart icon on any recipe card to save your go-to dishes for easy access anytime.
          </p>
          <button
            onClick={onGoToDiscover}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2b2723] text-white text-xs sm:text-sm font-bold shadow-sm hover:bg-[#4a5e30] transition-colors"
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Find What to Cook</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((recipe) => {
            const match = matchResults[recipe.id] || {
              recipe,
              matchPercentage: 0,
              missingCount: recipe.ingredients.length,
              matchedCount: 0,
              totalRequired: recipe.ingredients.length,
              matchedIngredients: [],
              haveIngredients: [],
              missingIngredients: recipe.ingredients,
            };

            return (
              <RecipeCard
                key={recipe.id}
                matchResult={match}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onSelectRecipe={onSelectRecipe}
                onAddToShoppingList={onAddToShoppingList}
                isInShoppingList={isInShoppingList}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
