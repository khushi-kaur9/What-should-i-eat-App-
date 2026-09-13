import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { PantryInput } from './components/PantryInput';
import { FilterBar } from './components/FilterBar';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { CookingModeModal } from './components/CookingModeModal';
import { ShoppingListView } from './components/ShoppingListModal';
import { FavoritesView } from './components/FavoritesView';
import { SurpriseMeModal } from './components/SurpriseMeModal';

import { ALL_RECIPES } from './data/allRecipes';
import { 
  Recipe, MatchResult, FilterState, ShoppingItem 
} from './types';
import { 
  normalizeIngredient, 
  filterAndRankRecipes, 
  parseNaturalLanguageQuery,
  calculateRecipeMatch
} from './utils/matching';
import { 
  UtensilsCrossed, Sparkles, ChefHat, Search, ArrowRight,
  RefreshCw, Check, Compass, AlertCircle
} from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  cuisine: 'All',
  region: 'All',
  mealType: 'All',
  dietary: [],
  maxCookTime: null,
  missingLimit: null,
  sortBy: 'fewest-missing',
  searchQuery: '',
};

// Starting ingredients to provide instant delight upon initial load
const INITIAL_PANTRY_DEFAULTS = ['potato', 'onion', 'tomato', 'garlic', 'ginger', 'chilli'];

export default function App() {
  // --- Persistent State ---
  const [ingredients, setIngredients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wse_pantry_ingredients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_PANTRY_DEFAULTS;
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('wse_shopping_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wse_favorite_recipes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ['butter-chicken', 'masala-dosa', 'pasta-arrabbiata'];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wse_pantry_ingredients', JSON.stringify(ingredients));
    } catch {
      // ignore
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem('wse_shopping_list', JSON.stringify(shoppingList));
    } catch {
      // ignore
    }
  }, [shoppingList]);

  useEffect(() => {
    try {
      localStorage.setItem('wse_favorite_recipes', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<'discover' | 'explore' | 'shopping' | 'favorites'>('discover');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [cookingRecipe, setCookingRecipe] = useState<Recipe | null>(null);
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState(false);
  const [naturalLanguageNotice, setNaturalLanguageNotice] = useState<string | null>(null);

  // --- Matching & Ranking ---
  const matchResults = useMemo(() => {
    return filterAndRankRecipes(ALL_RECIPES, ingredients, filters);
  }, [ingredients, filters]);

  // Dictionary lookup for fast access by recipe ID
  const matchResultsMap = useMemo(() => {
    const map: Record<string, MatchResult> = {};
    ALL_RECIPES.forEach((recipe) => {
      map[recipe.id] = calculateRecipeMatch(recipe, ingredients);
    });
    return map;
  }, [ingredients]);

  // Selected recipe object
  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeId) return null;
    return ALL_RECIPES.find((r) => r.id === selectedRecipeId) || null;
  }, [selectedRecipeId]);

  // Favorite Recipe objects
  const favoriteRecipes = useMemo(() => {
    return ALL_RECIPES.filter((r) => favorites.includes(r.id));
  }, [favorites]);

  // --- Handlers ---
  const handleAddIngredient = (rawItem: string) => {
    const normalized = normalizeIngredient(rawItem);
    if (!normalized) return;

    if (!ingredients.some((i) => normalizeIngredient(i) === normalized)) {
      setIngredients((prev) => [...prev, rawItem.trim().toLowerCase()]);
    }
  };

  const handleRemoveIngredient = (itemToRemove: string) => {
    const norm = normalizeIngredient(itemToRemove);
    setIngredients((prev) => prev.filter((i) => normalizeIngredient(i) !== norm));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  const handleApplyPreset = (presetItems: string[]) => {
    const merged = [...ingredients];
    presetItems.forEach((item) => {
      const norm = normalizeIngredient(item);
      if (!merged.some((m) => normalizeIngredient(m) === norm)) {
        merged.push(item);
      }
    });
    setIngredients(merged);
  };

  const handleNaturalLanguageQuery = (query: string) => {
    const parsed = parseNaturalLanguageQuery(query);
    
    // Add parsed ingredients
    if (parsed.extractedIngredients.length > 0) {
      const merged = [...ingredients];
      parsed.extractedIngredients.forEach((item) => {
        const norm = normalizeIngredient(item);
        if (!merged.some((m) => normalizeIngredient(m) === norm)) {
          merged.push(item);
        }
      });
      setIngredients(merged);
    }

    // Apply filters from natural language
    const updatedFilters = { ...filters };
    if (parsed.inferredCuisine) updatedFilters.cuisine = parsed.inferredCuisine;
    if (parsed.inferredMealType) updatedFilters.mealType = parsed.inferredMealType;
    if (parsed.inferredDietary && parsed.inferredDietary.length > 0) {
      const currentDietary = Array.isArray(updatedFilters.dietary) ? updatedFilters.dietary : [];
      updatedFilters.dietary = Array.from(new Set([...currentDietary, ...parsed.inferredDietary]));
    }
    if (parsed.inferredMaxTime) updatedFilters.maxCookTime = parsed.inferredMaxTime;
    setFilters(updatedFilters);

    setNaturalLanguageNotice(
      `Understood! Extracted ${parsed.extractedIngredients.length} ingredients and applied your preferences.`
    );
    setTimeout(() => setNaturalLanguageNotice(null), 5000);
  };

  // Shopping list handlers
  const handleAddToShoppingList = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const id = `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setShoppingList((prev) => {
      // Don't add duplicate if already present and unchecked
      if (prev.some((p) => p.name.toLowerCase() === item.name.toLowerCase() && !p.checked)) {
        return prev;
      }
      return [...prev, { ...item, id, checked: false }];
    });
  };

  const handleAddAllMissingToCart = (items: Array<Omit<ShoppingItem, 'id' | 'checked'>>) => {
    setShoppingList((prev) => {
      const updated = [...prev];
      items.forEach((item) => {
        if (!updated.some((p) => p.name.toLowerCase() === item.name.toLowerCase() && !p.checked)) {
          updated.push({
            ...item,
            id: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${Math.random()}`,
            checked: false,
          });
        }
      });
      return updated;
    });
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedShopping = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const handleClearAllShopping = () => {
    setShoppingList([]);
  };

  const handleMoveBoughtToPantry = (boughtNames: string[]) => {
    const updatedPantry = [...ingredients];
    boughtNames.forEach((name) => {
      const norm = normalizeIngredient(name);
      if (!updatedPantry.some((p) => normalizeIngredient(p) === norm)) {
        updatedPantry.push(name);
      }
    });
    setIngredients(updatedPantry);
    // Remove bought from shopping list
    setShoppingList((prev) => prev.filter((item) => !boughtNames.includes(item.name)));
    setActiveTab('discover');
  };

  const isInShoppingList = (itemName: string) => {
    const norm = normalizeIngredient(itemName);
    return shoppingList.some(
      (item) => normalizeIngredient(item.name) === norm && !item.checked
    );
  };

  const handleToggleFavorite = (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col font-sans text-[#2b2723] selection:bg-[#edd5be] selection:text-[#2b2723]">
      {/* App Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pantryCount={ingredients.length}
        shoppingCount={shoppingList.filter((i) => !i.checked).length}
        favoritesCount={favorites.length}
        onSurpriseMe={() => setIsSurpriseMeOpen(true)}
        onResetPantry={handleClearIngredients}
      />

      {/* Natural Language Query Feedback Banner */}
      {naturalLanguageNotice && (
        <div className="bg-gradient-to-r from-[#4a5e30] to-[#5a733b] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center shadow-xs flex items-center justify-center gap-2 animate-in slide-in-from-top duration-200">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>{naturalLanguageNotice}</span>
        </div>
      )}

      {/* Main Views Routing */}
      <main className="flex-1">
        {activeTab === 'discover' && (
          <div>
            {/* Fridge / Pantry Input Module */}
            <PantryInput
              ingredients={ingredients}
              onAddIngredient={handleAddIngredient}
              onRemoveIngredient={handleRemoveIngredient}
              onClearIngredients={handleClearIngredients}
              onNaturalLanguageQuery={handleNaturalLanguageQuery}
              onApplyPreset={handleApplyPreset}
            />

            {/* Filter & Sort Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              totalResults={matchResults.length}
              totalPossible={ALL_RECIPES.length}
            />

            {/* Results Grid Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Ready to Cook highlight banner */}
              {matchResults.filter((m) => m.missingCount === 0).length > 0 && (
                <div className="mb-6 p-4.5 rounded-2xl bg-[#4a5e30] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-lg sm:text-xl">
                        You have 100% of the ingredients for {matchResults.filter((m) => m.missingCount === 0).length} dish{matchResults.filter((m) => m.missingCount === 0).length === 1 ? '' : 'es'}!
                      </h4>
                      <p className="text-xs text-[#edd5be] font-sans">
                        Tutto pronto! No grocery run required — you can start cooking immediately.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFilters({ ...filters, missingLimit: 0 })}
                    className="px-4 py-2 bg-white text-[#344420] font-bold text-xs sm:text-sm rounded-xl hover:bg-[#faf8f5] shadow-xs transition-colors"
                  >
                    View 100% Matches
                  </button>
                </div>
              )}

              {/* Empty Results State */}
              {matchResults.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#ded8cb] shadow-2xs max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#edf2e8] flex items-center justify-center text-[#4a5e30] mx-auto mb-4">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#2b2723]">No matching recipes found</h3>
                  <p className="text-xs sm:text-sm text-[#7a7164] max-w-md mx-auto mt-2 mb-6 font-sans">
                    Try broadening your filters, or tap some additional Mediterranean pantry staples like tomatoes, garlic, pasta, or olive oil above!
                  </p>
                  <button
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2b2723] text-white text-xs sm:text-sm font-bold shadow-xs hover:bg-[#4a5e30] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchResults.map((match) => (
                    <RecipeCard
                      key={match.recipe.id}
                      matchResult={match}
                      isFavorite={favorites.includes(match.recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectRecipe={setSelectedRecipeId}
                      onAddToShoppingList={handleAddToShoppingList}
                      isInShoppingList={isInShoppingList}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Explore All Recipes View */}
        {activeTab === 'explore' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#ded8cb]">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#4a5e30] flex items-center justify-center text-white shadow-xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2723] tracking-tight">
                    Ricettario & Recipe Library
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-[#7a7164] mt-1 font-sans">
                  Explore all {ALL_RECIPES.length} authentic Mediterranean, Italian, Indian, and world recipes
                </p>
              </div>

              {/* Search filter in explore mode */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#9e9587]" />
                <input
                  type="text"
                  placeholder="Search recipes, pasta, curries..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#ded8cb] rounded-xl text-xs sm:text-sm text-[#2b2723] focus:outline-none focus:ring-2 focus:ring-[#4a5e30]/20 focus:border-[#4a5e30] shadow-2xs"
                />
              </div>
            </div>

            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              totalResults={matchResults.length}
              totalPossible={ALL_RECIPES.length}
            />

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchResults.map((match) => (
                <RecipeCard
                  key={match.recipe.id}
                  matchResult={match}
                  isFavorite={favorites.includes(match.recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectRecipe={setSelectedRecipeId}
                  onAddToShoppingList={handleAddToShoppingList}
                  isInShoppingList={isInShoppingList}
                />
              ))}
            </div>
          </div>
        )}

        {/* Shopping List Tab */}
        {activeTab === 'shopping' && (
          <ShoppingListView
            items={shoppingList}
            onToggleItem={handleToggleShoppingItem}
            onRemoveItem={handleRemoveShoppingItem}
            onAddItem={(name) => handleAddToShoppingList({ name })}
            onClearCompleted={handleClearCompletedShopping}
            onClearAll={handleClearAllShopping}
            onMoveToPantry={handleMoveBoughtToPantry}
          />
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favorites={favoriteRecipes}
            matchResults={matchResultsMap}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={setSelectedRecipeId}
            onAddToShoppingList={handleAddToShoppingList}
            isInShoppingList={isInShoppingList}
            onGoToDiscover={() => setActiveTab('discover')}
          />
        )}
      </main>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          matchResult={matchResultsMap[selectedRecipe.id]}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedRecipeId(null)}
          onStartCooking={(recipe) => {
            setSelectedRecipeId(null);
            setCookingRecipe(recipe);
          }}
          onAddToShoppingList={handleAddToShoppingList}
          onAddAllMissingToCart={handleAddAllMissingToCart}
          isInShoppingList={isInShoppingList}
        />
      )}

      {/* Full-Screen Guided Cooking Mode Wizard */}
      {cookingRecipe && (
        <CookingModeModal
          recipe={cookingRecipe}
          onClose={() => setCookingRecipe(null)}
        />
      )}

      {/* Surprise Me Roulette Modal */}
      {isSurpriseMeOpen && (
        <SurpriseMeModal
          candidates={matchResults.length > 0 ? matchResults : ALL_RECIPES.map((r) => calculateRecipeMatch(r, ingredients))}
          onSelectRecipe={(id) => {
            setIsSurpriseMeOpen(false);
            setSelectedRecipeId(id);
          }}
          onClose={() => setIsSurpriseMeOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#f0ece3] border-t border-[#ded8cb] py-8 text-center text-xs text-[#7a7164]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4a5e30] flex items-center justify-center text-white text-xs font-bold">
              <ChefHat className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-sm text-[#2b2723]">What Should I Eat?</span>
            <span>• Smart Pantry Assistant</span>
          </div>

          <p className="text-[#8a8072]">
            Featuring authentic Italian, Mediterranean, and global recipes • Zero food waste.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('discover')}
              className="hover:text-[#2b2723] transition-colors"
            >
              Pantry Matcher
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="hover:text-[#2b2723] transition-colors"
            >
              Browse Ricettario
            </button>
            <button
              onClick={() => setIsSurpriseMeOpen(true)}
              className="text-[#b85d43] font-semibold hover:underline"
            >
              Surprise Me
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
