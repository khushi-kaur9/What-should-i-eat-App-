import React from 'react';
import { UtensilsCrossed, Sparkles, Heart, ShoppingCart, Compass, ChefHat, RotateCcw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'discover' | 'explore' | 'shopping' | 'favorites';
  setActiveTab: (tab: 'discover' | 'explore' | 'shopping' | 'favorites') => void;
  pantryCount: number;
  shoppingCount: number;
  favoritesCount: number;
  onSurpriseMe: () => void;
  onResetPantry: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pantryCount,
  shoppingCount,
  favoritesCount,
  onSurpriseMe,
  onResetPantry,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e8e2d7] transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Branding */}
          <div 
            id="brand-logo-button"
            onClick={() => setActiveTab('discover')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#4a5e30] flex items-center justify-center text-white shadow-md shadow-[#4a5e30]/25 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 text-[#f5f2eb]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2b2723] tracking-tight">
                  What Should I Eat?
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#edf2e8] text-[#3b4c25] border border-[#d5e0cd]">
                  Cucina & Pantry
                </span>
              </div>
              <p className="text-xs text-[#70675c] font-medium hidden md:block">
                Turn whatever ingredients you have into delicious home-cooked meals
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#f0ece3] p-1.5 rounded-2xl border border-[#ded8cb]">
            <button
              id="nav-tab-discover"
              onClick={() => setActiveTab('discover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'discover'
                  ? 'bg-white text-[#2c2723] shadow-xs border border-[#ded8cb]/80'
                  : 'text-[#6d6458] hover:text-[#2c2723] hover:bg-white/60'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-[#4a5e30]" />
              <span>What Can I Make?</span>
              {pantryCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#4a5e30] text-white leading-none">
                  {pantryCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-explore"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-[#2c2723] shadow-xs border border-[#ded8cb]/80'
                  : 'text-[#6d6458] hover:text-[#2c2723] hover:bg-white/60'
              }`}
            >
              <Compass className="w-4 h-4 text-[#5c7343]" />
              <span>Browse Recipes</span>
            </button>

            <button
              id="nav-tab-favorites"
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'favorites'
                  ? 'bg-white text-[#2c2723] shadow-xs border border-[#ded8cb]/80'
                  : 'text-[#6d6458] hover:text-[#2c2723] hover:bg-white/60'
              }`}
            >
              <Heart className="w-4 h-4 text-[#b85d43]" />
              <span>Saved Dishes</span>
              {favoritesCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#fbf0ec] text-[#b85d43] border border-[#f3d9d0] leading-none">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-shopping"
              onClick={() => setActiveTab('shopping')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'shopping'
                  ? 'bg-white text-[#2c2723] shadow-xs border border-[#ded8cb]/80'
                  : 'text-[#6d6458] hover:text-[#2c2723] hover:bg-white/60'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-[#4b6b82]" />
              <span>Shopping List</span>
              {shoppingCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#4b6b82] text-white leading-none">
                  {shoppingCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {pantryCount > 0 && (
              <button
                id="btn-reset-pantry"
                onClick={onResetPantry}
                title="Clear pantry ingredients"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#6e6559] hover:text-[#2c2723] hover:bg-[#ede8df] rounded-xl border border-[#ded8cb] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#857a6c]" />
                <span>Reset ({pantryCount})</span>
              </button>
            )}

            <button
              id="btn-surprise-me"
              onClick={onSurpriseMe}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b85d43] to-[#9c4c34] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#b85d43]/20 hover:shadow-lg hover:shadow-[#b85d43]/30 hover:opacity-95 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#fae9e2] animate-pulse" />
              <span>Surprise Me!</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#e8e2d7] overflow-x-auto gap-1">
          <button
            id="mobile-tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'discover'
                ? 'bg-[#edf2e8] text-[#3b4c25]'
                : 'text-[#6e6559]'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-[#4a5e30]" />
            <span>Pantry ({pantryCount})</span>
          </button>
          <button
            id="mobile-tab-explore"
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'explore'
                ? 'bg-[#edf2e8] text-[#3b4c25]'
                : 'text-[#6e6559]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#5c7343]" />
            <span>All Recipes</span>
          </button>
          <button
            id="mobile-tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-[#fbf0ec] text-[#b85d43]'
                : 'text-[#6e6559]'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#b85d43]" />
            <span>Saved ({favoritesCount})</span>
          </button>
          <button
            id="mobile-tab-shopping"
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'shopping'
                ? 'bg-[#edf2e8] text-[#3b4c25]'
                : 'text-[#6e6559]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#4b6b82]" />
            <span>Cart ({shoppingCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
