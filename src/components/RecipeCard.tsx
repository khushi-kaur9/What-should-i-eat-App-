import React from 'react';
import { Clock, Users, Heart, Check, Plus, ShoppingCart, Flame, ChevronRight } from 'lucide-react';
import { MatchResult, ShoppingItem } from '../types';

interface RecipeCardProps {
  matchResult: MatchResult;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipeId: string) => void;
  onAddToShoppingList: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  isInShoppingList: (itemName: string) => boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  matchResult,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
  onAddToShoppingList,
  isInShoppingList,
}) => {
  const {
    recipe,
    matchPercentage = 0,
    missingCount = 0,
    matchedIngredients = [],
    haveIngredients = [],
    missingIngredients = [],
  } = matchResult || {};

  const displayHave = (haveIngredients && haveIngredients.length > 0)
    ? haveIngredients
    : matchedIngredients;

  const getIngredientLabel = (item: any): string => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.item || item.original || '';
  };

  const isFullMatch = missingCount === 0;
  const isCloseMatch = missingCount <= 2;

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      className="bg-white rounded-2xl border border-[#ded8cb] shadow-2xs hover:shadow-xl hover:border-[#4a5e30]/40 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Recipe Photo with Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#f0ece3]">
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 text-[#2b2723] backdrop-blur-md shadow-xs">
              {recipe.cuisine} {recipe.region ? `• ${recipe.region}` : ''}
            </span>
            {recipe.isSpicy && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#b85d43]/90 text-white backdrop-blur-md">
                🌶️ Spicy
              </span>
            )}
            {recipe.isSweet && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#d48b52]/90 text-white backdrop-blur-md">
                🍯 Sweet
              </span>
            )}
          </div>

          <button
            id={`btn-fav-${recipe.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#2b2723] hover:text-[#b85d43] shadow-md hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-[#b85d43] text-[#b85d43]' : 'text-[#6e6559]'
              }`}
            />
          </button>
        </div>

        {/* Bottom Bar on Photo: Match Status Banner */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {isFullMatch ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-[#4a5e30] text-white shadow-md">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>100% Match • Ready to Cook!</span>
            </span>
          ) : isCloseMatch ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-[#b85d43] text-white shadow-md">
              <span>Missing {missingCount} {missingCount === 1 ? 'item' : 'items'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-[#2b2723]/85 text-white backdrop-blur-md">
              <span>Missing {missingCount} items</span>
            </span>
          )}

          <div className="flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
            <Clock className="w-3.5 h-3.5 text-[#f5ebd9]" />
            <span>{recipe.totalTime}m</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Match Percentage Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-[#7a7164]">Pantry Compatibility</span>
            <span
              className={
                isFullMatch
                  ? 'text-[#4a5e30]'
                  : isCloseMatch
                  ? 'text-[#b85d43]'
                  : 'text-[#6e6559]'
              }
            >
              {matchPercentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#f0ece3] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullMatch
                  ? 'bg-[#4a5e30]'
                  : isCloseMatch
                  ? 'bg-gradient-to-r from-[#b85d43] to-[#d48b52]'
                  : 'bg-[#9e9587]'
              }`}
              style={{ width: `${matchPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Title and Short Description */}
        <h3 
          onClick={() => onSelectRecipe(recipe.id)}
          className="font-serif text-xl font-bold text-[#231f1c] group-hover:text-[#4a5e30] transition-colors cursor-pointer line-clamp-1 mb-1"
        >
          {recipe.name}
        </h3>
        <p className="text-xs text-[#6e6559] line-clamp-2 mb-4 leading-relaxed font-sans">
          {recipe.description}
        </p>

        {/* Ingredients Breakdown */}
        <div className="space-y-2 mb-4 text-xs flex-1">
          {/* What user already has */}
          {displayHave.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#344420] uppercase tracking-wide mb-1">
                <Check className="w-3 h-3 text-[#4a5e30] stroke-[3]" />
                <span>You have ({displayHave.length}):</span>
              </div>
              <p className="text-[#6e6559] line-clamp-1 font-medium pl-4">
                {displayHave.map(getIngredientLabel).filter(Boolean).join(', ')}
              </p>
            </div>
          )}

          {/* Missing ingredients with 1-click cart addition */}
          {missingIngredients.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#b85d43] uppercase tracking-wide mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b85d43]"></span>
                <span>You need ({missingIngredients.length}):</span>
              </div>
              <div className="flex flex-wrap gap-1 pl-2">
                {missingIngredients.slice(0, 3).map((item, idx) => {
                  const itemName = getIngredientLabel(item);
                  const inCart = isInShoppingList(itemName);
                  const originalName = (typeof item === 'object' && item && item.original) ? item.original : itemName;

                  return (
                    <button
                      key={`${itemName}-${idx}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!inCart) {
                          onAddToShoppingList({
                            name: originalName || itemName,
                            recipeId: recipe.id,
                            recipeName: recipe.name,
                          });
                        }
                      }}
                      title={inCart ? 'Already in shopping list' : `Add ${itemName} to shopping list`}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                        inCart
                          ? 'bg-[#edf2e8] text-[#344420] border border-[#d5e0cd]'
                          : 'bg-[#fbf0ec] text-[#b85d43] border border-[#f3d9d0] hover:bg-[#f6e1da]'
                      }`}
                    >
                      <span>{itemName}</span>
                      {inCart ? (
                        <Check className="w-2.5 h-2.5 text-[#344420]" />
                      ) : (
                        <Plus className="w-2.5 h-2.5 text-[#b85d43]" />
                      )}
                    </button>
                  );
                })}
                {missingIngredients.length > 3 && (
                  <span className="text-[11px] text-[#9e9587] self-center">
                    +{missingIngredients.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Nutrition and Servings Quick Row */}
        <div className="flex items-center justify-between py-2 border-t border-[#f0ece3] text-[11px] text-[#7a7164] font-medium mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#b85d43]" />
              <span>{recipe.calories} kcal</span>
            </span>
            <span>{recipe.protein}g protein</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#8a8072]" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Card Action Button */}
        <button
          id={`btn-view-${recipe.id}`}
          type="button"
          onClick={() => onSelectRecipe(recipe.id)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2b2723] text-white font-bold text-xs sm:text-sm hover:bg-[#4a5e30] active:scale-98 transition-colors shadow-2xs"
        >
          <span>View Recipe & Steps</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
