import React, { useState } from 'react';
import { 
  X, Heart, Clock, Users, Flame, ChefHat, Check, Plus, 
  ShoppingCart, Sparkles, AlertCircle, ArrowRight, Play, DollarSign,
  Minus
} from 'lucide-react';
import { Recipe, MatchResult, ShoppingItem } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe;
  matchResult?: MatchResult;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onClose: () => void;
  onStartCooking: (recipe: Recipe) => void;
  onAddToShoppingList: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
  onAddAllMissingToCart: (items: Array<Omit<ShoppingItem, 'id' | 'checked'>>) => void;
  isInShoppingList: (itemName: string) => boolean;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  matchResult,
  isFavorite,
  onToggleFavorite,
  onClose,
  onStartCooking,
  onAddToShoppingList,
  onAddAllMissingToCart,
  isInShoppingList,
}) => {
  const [servings, setServings] = useState<number>(recipe.servings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const scaleFactor = servings / recipe.servings;

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStepCheck = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Missing items list from match result
  const missingItems = Array.isArray(matchResult?.missingIngredients)
    ? matchResult.missingIngredients
    : [];

  const getMissingLabel = (m: any): string => {
    if (!m) return '';
    if (typeof m === 'string') return m;
    return m.item || m.original || '';
  };

  const handleAddAllMissing = () => {
    const itemsToAdd = missingItems.map(m => ({
      name: typeof m === 'object' && m?.original ? m.original : getMissingLabel(m),
      recipeId: recipe.id,
      recipeName: recipe.name,
    })).filter(i => Boolean(i.name));
    onAddAllMissingToCart(itemsToAdd);
  };

  return (
    <div 
      id="recipe-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto relative flex flex-col max-h-[92vh]">
        {/* Modal Top Bar / Close & Fav Action */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            id="modal-btn-favorite"
            onClick={() => onToggleFavorite(recipe.id)}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-rose-600 shadow-md hover:scale-105 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
              }`}
            />
          </button>
          <button
            id="modal-btn-close"
            onClick={onClose}
            title="Close modal"
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-stone-900 shadow-md hover:scale-105 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#f0ece3]">
          {/* Hero Image & Headings */}
          <div className="relative">
            <div className="aspect-[16/9] w-full bg-[#f0ece3] relative">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Bottom Overlaid Title */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <div className="flex flex-wrap gap-2 items-center mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4a5e30] text-white shadow-xs">
                    {recipe.cuisine} {recipe.region ? `• ${recipe.region}` : ''}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white">
                    {recipe.mealType}
                  </span>
                  {recipe.dietaryTags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#829c78]/85 backdrop-blur-md text-white">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {recipe.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Times Strip */}
          <div className="p-4 sm:p-6 bg-[#faf8f5] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-2xl bg-white border border-[#ded8cb] shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#7a7164] font-semibold mb-1">
                <Clock className="w-4 h-4 text-[#4a5e30]" />
                <span>Total Time</span>
              </div>
              <p className="text-lg font-extrabold text-[#2b2723]">{recipe.totalTime} mins</p>
              <p className="text-[10px] text-[#8a8072]">Prep {recipe.prepTime}m • Cook {recipe.cookTime}m</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#ded8cb] shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#7a7164] font-semibold mb-1">
                <Flame className="w-4 h-4 text-[#b85d43]" />
                <span>Calories</span>
              </div>
              <p className="text-lg font-extrabold text-[#2b2723]">{Math.round(recipe.calories * scaleFactor)} kcal</p>
              <p className="text-[10px] text-[#8a8072]">per serving</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#ded8cb] shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#7a7164] font-semibold mb-1">
                <ChefHat className="w-4 h-4 text-[#4a5e30]" />
                <span>Difficulty</span>
              </div>
              <p className="text-lg font-extrabold text-[#2b2723]">{recipe.difficulty}</p>
              <p className="text-[10px] text-[#8a8072]">Skill Level</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#ded8cb] shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-xs text-[#7a7164] font-semibold mb-1">
                <DollarSign className="w-4 h-4 text-[#4b6b82]" />
                <span>Est. Cost</span>
              </div>
              <p className="text-lg font-extrabold text-[#2b2723]">
                {recipe.currency}{Math.round((recipe.estimatedCost || 50) * scaleFactor)}
              </p>
              <p className="text-[10px] text-[#8a8072]">for {servings} servings</p>
            </div>
          </div>

          {/* Description & Nutrition Breakdown */}
          <div className="p-4 sm:p-6 bg-white">
            <p className="text-sm text-[#5f564b] leading-relaxed mb-5 font-sans">
              {recipe.description}
            </p>

            {/* Nutrition Bar */}
            <div className="bg-[#f7f4ed] p-3.5 rounded-2xl border border-[#ded8cb]">
              <span className="text-xs font-bold text-[#7a7164] uppercase tracking-wider block mb-2">
                Nutritional Profile (per serving)
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-xl border border-[#e8e2d7]">
                  <span className="text-[#8a8072] block text-[10px]">Protein</span>
                  <span className="font-extrabold text-[#2b2723]">{recipe.protein}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#e8e2d7]">
                  <span className="text-[#8a8072] block text-[10px]">Carbs</span>
                  <span className="font-extrabold text-[#2b2723]">{recipe.carbs}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#e8e2d7]">
                  <span className="text-[#8a8072] block text-[10px]">Fats</span>
                  <span className="font-extrabold text-[#2b2723]">{recipe.fat}g</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#e8e2d7]">
                  <span className="text-[#8a8072] block text-[10px]">Fiber</span>
                  <span className="font-extrabold text-[#2b2723]">{recipe.fiber}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Missing Ingredients Callout */}
          {missingItems.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#fbf0ec] border-l-4 border-[#b85d43]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-[#7a2e1d] text-sm mb-1">
                    <AlertCircle className="w-4 h-4 text-[#b85d43] shrink-0" />
                    <span>You're missing {missingItems.length} ingredient{missingItems.length === 1 ? '' : 's'} for this recipe:</span>
                  </div>
                  <p className="text-xs text-[#8e412c]">
                    {missingItems.map(getMissingLabel).filter(Boolean).join(', ')}
                  </p>
                </div>
                <button
                  id="btn-add-all-missing-cart"
                  onClick={handleAddAllMissing}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-[#b85d43] hover:bg-[#a24e36] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add all to Cart</span>
                </button>
              </div>
            </div>
          )}

          {/* Ingredients Section with Dynamic Servings Scaler */}
          <div className="p-4 sm:p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2b2723]">Ingredients</h3>
                <span className="text-xs text-[#8a8072] font-medium font-sans">
                  ({recipe.ingredients.length} items)
                </span>
              </div>

              {/* Servings Scaler Stepper */}
              <div className="flex items-center gap-2 bg-[#f0ece3] p-1 rounded-xl border border-[#ded8cb]">
                <span className="text-xs font-semibold text-[#6d6458] px-1">Servings:</span>
                <button
                  id="btn-servings-decrease"
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#2b2723] hover:bg-[#e2dcd1] text-xs font-bold transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-extrabold text-[#2b2723]">
                  {servings}
                </span>
                <button
                  id="btn-servings-increase"
                  onClick={() => setServings(servings + 1)}
                  className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#2b2723] hover:bg-[#e2dcd1] text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ingredients Checkable List */}
            <div className="space-y-2.5">
              {recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                const isMissing = missingItems.some(m => m.item === ing.item);
                const inCart = isInShoppingList(ing.item);

                // Calculate scaled amount
                const scaledAmount = ing.amount ? +(ing.amount * scaleFactor).toFixed(1) : null;
                const displayQuantity = scaledAmount
                  ? `${scaledAmount} ${ing.unit || ''}`
                  : '';

                return (
                  <div
                    key={idx}
                    id={`ingredient-row-${idx}`}
                    onClick={() => toggleIngredientCheck(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-[#f7f4ed] border-[#ded8cb] text-[#8a8072] line-through'
                        : isMissing
                        ? 'bg-[#fbf0ec]/60 border-[#f3d9d0] text-[#2b2723]'
                        : 'bg-white border-[#ded8cb] text-[#2b2723]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isChecked
                            ? 'bg-[#4a5e30] border-[#4a5e30] text-white'
                            : 'border-[#c8bfaf] bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm font-medium">
                        {displayQuantity ? (
                          <span className="font-bold mr-1.5">{displayQuantity}</span>
                        ) : null}
                        {ing.original || ing.item}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {isMissing ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!inCart) {
                              onAddToShoppingList({
                                name: ing.original || ing.item,
                                recipeId: recipe.id,
                                recipeName: recipe.name,
                              });
                            }
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            inCart
                              ? 'bg-[#edf2e8] text-[#344420] border border-[#d5e0cd]'
                              : 'bg-[#fbf0ec] text-[#b85d43] border border-[#f3d9d0] hover:bg-[#f6e1da]'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>In Cart</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#344420] bg-[#edf2e8] border border-[#d5e0cd] px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3 text-[#4a5e30]" />
                          <span>In Pantry</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Substitutions helper */}
            {recipe.substitutions && recipe.substitutions.length > 0 && (
              <div className="mt-4 p-3.5 rounded-xl bg-[#f7f4ed] border border-[#ded8cb] text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#4a5e30] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#4a5e30]" />
                  <span>Mediterranean Ingredient Substitutions:</span>
                </div>
                <div className="space-y-1 text-[#6e6559]">
                  {recipe.substitutions.map((sub, i) => (
                    <p key={i}>
                      • If you don't have <strong className="text-[#2b2723] capitalize">{sub.ingredient}</strong>: try using{' '}
                      <em className="text-[#b85d43]">{sub.substitutes.join(' or ')}</em>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cooking Instructions Section */}
          <div className="p-4 sm:p-6 bg-white">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2b2723] mb-4">
              Step-by-Step Preparations
            </h3>
            <div className="space-y-4">
              {recipe.steps.map((step, idx) => {
                const isStepDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    id={`step-card-${idx}`}
                    onClick={() => toggleStepCheck(idx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isStepDone
                        ? 'bg-[#f7f4ed] border-[#ded8cb] opacity-60'
                        : 'bg-white border-[#ded8cb] shadow-2xs hover:border-[#4a5e30]/50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-xs transition-colors ${
                        isStepDone
                          ? 'bg-[#4a5e30] text-white'
                          : 'bg-[#edf2e8] text-[#344420] border border-[#d5e0cd]'
                      }`}
                    >
                      {isStepDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed ${isStepDone ? 'line-through text-[#8a8072]' : 'text-[#38332c]'}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#ded8cb] flex items-center justify-between gap-3 shadow-lg">
          <div className="hidden sm:block">
            <span className="text-xs text-[#7a7164] font-medium">Ready to cook?</span>
            <p className="text-sm font-bold text-[#2b2723] font-serif">In Cucina: Step-by-Step Cooking Mode</p>
          </div>
          <button
            id="btn-start-cooking-mode"
            onClick={() => onStartCooking(recipe)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4a5e30] to-[#364621] text-white font-bold text-sm sm:text-base shadow-md shadow-[#4a5e30]/25 hover:opacity-95 active:scale-98 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Cooking Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
