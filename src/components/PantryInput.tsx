import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, Sparkles, Check, Trash2, ArrowRight } from 'lucide-react';
import { COMMON_PANTRY_INGREDIENTS } from '../data/allRecipes';
import { normalizeIngredient } from '../utils/matching';

interface PantryInputProps {
  ingredients: string[];
  onAddIngredient: (item: string) => void;
  onRemoveIngredient: (item: string) => void;
  onClearIngredients: () => void;
  onNaturalLanguageQuery: (query: string) => void;
  onApplyPreset: (items: string[]) => void;
}

const PANTRY_PRESETS = [
  {
    name: 'Italian Trattoria',
    icon: '🍝',
    items: ['pasta', 'tomato', 'garlic', 'olive oil', 'parmesan', 'basil', 'flour'],
  },
  {
    name: 'Mediterranean Sun',
    icon: '🫒',
    items: ['chickpeas', 'lemon', 'olive oil', 'garlic', 'cucumber', 'feta', 'tomato'],
  },
  {
    name: 'Desi Spice Pantry',
    icon: '🇮🇳',
    items: ['potato', 'onion', 'tomato', 'ginger', 'garlic', 'chilli', 'cumin', 'rice', 'toor dal', 'ghee'],
  },
  {
    name: 'Quick & Hearty',
    icon: '🍳',
    items: ['egg', 'bread', 'cheese', 'tomato', 'onion', 'butter', 'potato', 'milk'],
  },
  {
    name: 'High Protein Athlete',
    icon: '💪',
    items: ['chicken', 'egg', 'paneer', 'spinach', 'chickpeas', 'yogurt', 'rice'],
  },
];

export const PantryInput: React.FC<PantryInputProps> = ({
  ingredients,
  onAddIngredient,
  onRemoveIngredient,
  onClearIngredients,
  onNaturalLanguageQuery,
  onApplyPreset,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close suggestion dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestion list based on input
  const suggestions = inputValue.trim().length > 0
    ? COMMON_PANTRY_INGREDIENTS.filter(item => {
        const queryNorm = inputValue.toLowerCase().trim();
        const itemNorm = item.name.toLowerCase();
        return itemNorm.includes(queryNorm) && !ingredients.some(ing => normalizeIngredient(ing) === normalizeIngredient(item.name));
      }).slice(0, 8)
    : [];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const query = inputValue.trim();

    // If user entered natural language sentence like "I have potatoes and onions" or "spicy under 30 mins"
    if (query.includes(' ') && (
        query.toLowerCase().startsWith('i have') ||
        query.toLowerCase().includes('something') ||
        query.toLowerCase().includes('want') ||
        query.toLowerCase().includes('spicy') ||
        query.toLowerCase().includes('minute') ||
        query.toLowerCase().includes('mins') ||
        query.toLowerCase().includes('vegetarian') ||
        query.toLowerCase().includes('dinner')
    )) {
      onNaturalLanguageQuery(query);
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    // Check if user entered comma-separated ingredients e.g. "eggs, milk, flour"
    if (query.includes(',')) {
      const parts = query.split(',').map(s => s.trim()).filter(Boolean);
      parts.forEach(part => onAddIngredient(part));
      setInputValue('');
      setShowSuggestions(false);
      return;
    }

    // Normal single ingredient addition
    onAddIngredient(query);
    setInputValue('');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (itemName: string) => {
    onAddIngredient(itemName);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Categories for quick-tap row
  const categories = ['All', 'Vegetables', 'Dairy', 'Grains', 'Meat', 'Lentils', 'Spices'];
  const filteredPills = activeCategory === 'All'
    ? COMMON_PANTRY_INGREDIENTS
    : COMMON_PANTRY_INGREDIENTS.filter(item => item.category === activeCategory);

  return (
    <section className="bg-gradient-to-b from-[#f3eee5] via-[#f8f5ef] to-[#faf8f5] pt-8 pb-10 border-b border-[#e5dfd2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#edf2e8] text-[#344420] text-xs font-semibold mb-3 border border-[#d5e0cd]">
            <Sparkles className="w-3.5 h-3.5 text-[#5c7343]" />
            <span>Zero Food Waste • Match authentic recipes with what you already own</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#231f1c] tracking-tight leading-tight">
            I have these ingredients.{' '}
            <span className="italic text-[#b85d43]">
              What can I make?
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#685f54] max-w-2xl mx-auto font-sans leading-relaxed">
            Add what you have in your fridge, pantry, or spice rack. We'll find recipes you can make right now,
            prioritizing dishes with zero or the fewest missing ingredients!
          </p>
        </div>

        {/* Main Input Box */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="relative flex items-center shadow-md shadow-[#2b2723]/5 rounded-2xl bg-white border-2 border-[#d9d2c4] focus-within:border-[#4a5e30] focus-within:ring-4 focus-within:ring-[#4a5e30]/15 transition-all">
              <div className="pl-4 text-[#8a8072]">
                <Search className="w-5 h-5 text-[#8a8072]" />
              </div>
              <input
                ref={inputRef}
                id="pantry-ingredient-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Type ingredients (e.g. olive oil, pasta, garlic, tomato) or ask 'quick dinner'..."
                className="w-full py-4 pl-3 pr-28 text-[#2b2723] placeholder:text-[#9e9587] text-sm sm:text-base font-medium rounded-2xl focus:outline-none bg-transparent"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                <button
                  type="submit"
                  id="btn-add-ingredient"
                  disabled={!inputValue.trim()}
                  className="flex items-center gap-1 px-4 py-2 bg-[#4a5e30] hover:bg-[#3b4c25] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-[#ded8cb] z-50 overflow-hidden divide-y divide-[#f0ece3] animate-in fade-in slide-in-from-top-2 duration-150"
            >
              <div className="p-2.5 text-xs font-semibold text-[#8a8072] uppercase tracking-wider bg-[#faf8f5]">
                Suggested Ingredients
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.name}
                  id={`suggest-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(item.name)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm text-[#2b2723] hover:bg-[#edf2e8] hover:text-[#2b3c18] transition-colors"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                  </span>
                  <span className="text-xs text-[#8a8072] flex items-center gap-1">
                    <span>Add to pantry</span>
                    <ArrowRight className="w-3 h-3 text-[#4a5e30]" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Ingredients Chips Container */}
        <div className="max-w-4xl mx-auto mb-6 bg-white/95 p-4 sm:p-5 rounded-2xl border border-[#ded8cb] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#2b2723]">La Dispensa (Your Fridge & Pantry)</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#edf2e8] text-[#344420] border border-[#d5e0cd]">
                {ingredients.length} item{ingredients.length === 1 ? '' : 's'}
              </span>
            </div>
            {ingredients.length > 0 && (
              <button
                id="btn-clear-all-ingredients"
                onClick={onClearIngredients}
                className="text-xs text-[#8a8072] hover:text-[#b85d43] font-medium flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {ingredients.length === 0 ? (
            <div className="py-6 text-center text-[#7a7164]">
              <p className="text-sm font-semibold font-serif text-[#2b2723]">Your pantry is currently empty</p>
              <p className="text-xs text-[#8c8274] mt-1">
                Tap common staples below or select an Italian or Mediterranean starter pack to discover recipes instantly.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((item) => {
                const iconMatch = COMMON_PANTRY_INGREDIENTS.find(
                  (c) => normalizeIngredient(c.name) === normalizeIngredient(item)
                )?.icon;

                return (
                  <span
                    key={item}
                    id={`chip-${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#f4f1ea] text-[#2b2723] border border-[#ded7c8] shadow-2xs hover:border-[#4a5e30] transition-all group"
                  >
                    {iconMatch && <span className="text-sm">{iconMatch}</span>}
                    <span className="capitalize">{item}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveIngredient(item)}
                      title={`Remove ${item}`}
                      className="p-0.5 rounded-md text-[#8a8072] hover:text-[#b85d43] hover:bg-[#fceeed] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tap Common Staples & Presets */}
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Preset Starter Kits */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#4a5e30]" />
              <span className="text-xs font-bold text-[#7a7164] uppercase tracking-wider">
                Quick Starter Packs (1-Click Fill)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {PANTRY_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  id={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onApplyPreset(preset.items)}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#ded8cb] hover:border-[#4a5e30] hover:bg-[#edf2e8]/40 hover:shadow-xs text-left transition-all group"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2b2723] truncate group-hover:text-[#4a5e30]">
                      {preset.name}
                    </p>
                    <p className="text-[10px] text-[#8a8072] truncate">
                      {preset.items.length} staples
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick-Add Staples Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#7a7164] uppercase tracking-wider">
                Quick-Tap Fridge & Pantry Staples
              </span>
              {/* Category selector */}
              <div className="flex gap-1 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-colors ${
                      activeCategory === cat
                        ? 'bg-[#4a5e30] text-white font-bold'
                        : 'bg-[#ede8df] text-[#6d6458] hover:bg-[#e2dcd1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {filteredPills.map((item) => {
                const isSelected = ingredients.some(
                  (ing) => normalizeIngredient(ing) === normalizeIngredient(item.name)
                );

                return (
                  <button
                    key={item.name}
                    id={`staple-btn-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      if (isSelected) {
                        onRemoveIngredient(item.name);
                      } else {
                        onAddIngredient(item.name);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#4a5e30] text-white shadow-xs font-semibold'
                        : 'bg-white text-[#38332c] border border-[#ded8cb] hover:bg-[#f6f3ec] hover:border-[#c8bfaf]'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 ml-0.5 text-white stroke-[2.5]" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 ml-0.5 text-[#8a8072]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
