import React from 'react';
import { SlidersHorizontal, Clock, Sparkles, Filter, X, ArrowUpDown } from 'lucide-react';
import { FilterState, DietaryTag, MealType } from '../types';
import { CUISINES_LIST, REGIONS_LIST, MEAL_TYPES } from '../data/allRecipes';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
  totalPossible: number;
}

const DIETARY_OPTIONS: DietaryTag[] = ['Vegetarian', 'Vegan', 'Gluten Free', 'High Protein', 'Dairy Free'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  totalPossible,
}) => {
  const dietaryList = Array.isArray(filters.dietary) ? filters.dietary : [];

  const isFiltered =
    filters.cuisine !== 'All' ||
    filters.region !== 'All' ||
    filters.mealType !== 'All' ||
    dietaryList.length > 0 ||
    filters.maxCookTime !== null ||
    filters.missingLimit !== null ||
    filters.searchQuery !== '';

  const handleToggleDietary = (tag: DietaryTag) => {
    const next = dietaryList.includes(tag)
      ? dietaryList.filter((t) => t !== tag)
      : [...dietaryList, tag];
    onFilterChange({ ...filters, dietary: next });
  };

  return (
    <div className="bg-[#faf8f5] border-b border-[#ded8cb] sticky top-16 sm:top-20 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Top Tier: Match Status Pills & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e8e2d7]">
          {/* Missing Ingredients Quick Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-[#7a7164] uppercase tracking-wider mr-1 shrink-0 hidden sm:inline">
              Match:
            </span>
            <button
              id="filter-missing-all"
              onClick={() => onFilterChange({ ...filters, missingLimit: null })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.missingLimit === null
                  ? 'bg-[#2b2723] text-white shadow-xs'
                  : 'bg-[#ede8df] text-[#6d6458] hover:bg-[#e2dcd1]'
              }`}
            >
              All Matches
            </button>
            <button
              id="filter-missing-0"
              onClick={() => onFilterChange({ ...filters, missingLimit: 0 })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.missingLimit === 0
                  ? 'bg-[#4a5e30] text-white shadow-xs'
                  : 'bg-[#edf2e8] text-[#344420] border border-[#d5e0cd] hover:bg-[#e2edd9]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#829c78]"></span>
              <span>Can Cook Now (0 Missing)</span>
            </button>
            <button
              id="filter-missing-1"
              onClick={() => onFilterChange({ ...filters, missingLimit: 1 })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.missingLimit === 1
                  ? 'bg-[#b85d43] text-white shadow-xs'
                  : 'bg-[#fbf0ec] text-[#b85d43] border border-[#f3d9d0] hover:bg-[#f6e1da]'
              }`}
            >
              <span>Missing ≤ 1 Item</span>
            </button>
            <button
              id="filter-missing-2"
              onClick={() => onFilterChange({ ...filters, missingLimit: 2 })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.missingLimit === 2
                  ? 'bg-[#a24e36] text-white shadow-xs'
                  : 'bg-[#f7ece8] text-[#8e412c] border border-[#f0d3cb] hover:bg-[#edd0c7]'
              }`}
            >
              <span>Missing ≤ 2 Items</span>
            </button>
            <button
              id="filter-missing-3"
              onClick={() => onFilterChange({ ...filters, missingLimit: 3 })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.missingLimit === 3
                  ? 'bg-[#595046] text-white shadow-xs'
                  : 'bg-[#ede8df] text-[#6d6458] hover:bg-[#e2dcd1]'
              }`}
            >
              <span>Missing ≤ 3</span>
            </button>
          </div>

          {/* Sort Selector & Results Count */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <div className="text-xs font-semibold text-[#7a7164]">
              <span className="text-[#2b2723] font-extrabold">{totalResults}</span> of {totalPossible} dishes
            </div>

            <div className="flex items-center gap-1.5 bg-[#f0ece3] rounded-xl p-1 border border-[#ded8cb]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7a7164] ml-1.5" />
              <select
                id="sort-by-select"
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    sortBy: e.target.value as FilterState['sortBy'],
                  })
                }
                className="bg-transparent text-xs font-semibold text-[#2b2723] focus:outline-none pr-2 py-1 cursor-pointer"
              >
                <option value="fewest-missing">Fewest Missing (Smartest)</option>
                <option value="match-percentage">Highest Match %</option>
                <option value="fastest">Quickest Cook Time</option>
                <option value="popularity">Most Popular</option>
                <option value="calories-low">Lowest Calories</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Tier: Cuisine, Region, Diet, Time */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {/* Cuisine Selector */}
          <div className="relative">
            <select
              id="filter-cuisine"
              value={filters.cuisine}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  cuisine: e.target.value,
                  region: 'All', // Reset regional filter when cuisine changes
                })
              }
              className="text-xs font-semibold bg-[#ede8df] hover:bg-[#e2dcd1] text-[#2b2723] rounded-xl px-3 py-1.5 border border-[#ded8cb] focus:outline-none cursor-pointer"
            >
              <option value="All">All Cuisines</option>
              {CUISINES_LIST.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c} Cuisine
                </option>
              ))}
            </select>
          </div>

          {/* Regional Sub-filter (for Indian cuisine) */}
          {(filters.cuisine === 'All' || filters.cuisine === 'Indian') && (
            <div className="relative">
              <select
                id="filter-region"
                value={filters.region}
                onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
                className="text-xs font-semibold bg-[#edf2e8] text-[#344420] rounded-xl px-3 py-1.5 border border-[#d5e0cd] focus:outline-none cursor-pointer"
              >
                <option value="All">All Regions</option>
                {REGIONS_LIST.filter((r) => r !== 'All').map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Meal Type */}
          <div className="relative">
            <select
              id="filter-meal-type"
              value={filters.mealType}
              onChange={(e) =>
                onFilterChange({ ...filters, mealType: e.target.value as MealType | 'All' })
              }
              className="text-xs font-semibold bg-[#ede8df] hover:bg-[#e2dcd1] text-[#2b2723] rounded-xl px-3 py-1.5 border border-[#ded8cb] focus:outline-none cursor-pointer"
            >
              <option value="All">All Meals</option>
              {MEAL_TYPES.filter((m) => m !== 'All').map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Max Cook Time */}
          <div className="flex items-center gap-1">
            {[20, 30, 45].map((time) => (
              <button
                key={time}
                id={`filter-time-${time}`}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    maxCookTime: filters.maxCookTime === time ? null : time,
                  })
                }
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filters.maxCookTime === time
                    ? 'bg-[#4a5e30] text-white font-bold shadow-2xs'
                    : 'bg-[#ede8df] text-[#6d6458] hover:bg-[#e2dcd1]'
                }`}
              >
                &lt; {time}m
              </button>
            ))}
          </div>

          {/* Dietary pills */}
          <div className="flex items-center gap-1 ml-auto overflow-x-auto">
            {DIETARY_OPTIONS.map((tag) => {
              const isSelected = dietaryList.includes(tag);
              return (
                <button
                  key={tag}
                  id={`filter-diet-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleToggleDietary(tag)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#4a5e30] text-white font-bold shadow-2xs'
                      : 'bg-[#ede8df] text-[#6d6458] hover:bg-[#e2dcd1]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {isFiltered && (
              <button
                id="btn-reset-filters"
                onClick={onResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#b85d43] hover:bg-[#fbf0ec] border border-[#f3d9d0] transition-colors ml-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
