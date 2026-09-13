import React, { useState, useEffect } from 'react';
import { Sparkles, Dices, X, ArrowRight, Check, Clock, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MatchResult } from '../types';

interface SurpriseMeModalProps {
  candidates: MatchResult[];
  onSelectRecipe: (recipeId: string) => void;
  onClose: () => void;
}

export const SurpriseMeModal: React.FC<SurpriseMeModalProps> = ({
  candidates,
  onSelectRecipe,
  onClose,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(true);

  const spinForRecipe = () => {
    if (candidates.length === 0) return;
    setIsSpinning(true);

    // Prioritize 0-missing or ≤2 missing if available
    const topPicks = candidates.filter(c => c.missingCount <= 2);
    const pool = topPicks.length > 0 ? topPicks : candidates;

    let iterations = 0;
    const maxIterations = 14;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedMatch(pool[randomIndex]);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsSpinning(false);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, 90);
  };

  useEffect(() => {
    spinForRecipe();
  }, []);

  if (!selectedMatch) return null;

  const { recipe, matchPercentage, missingCount } = selectedMatch;

  return (
    <div
      id="surprise-me-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative text-stone-900 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-700 hover:text-stone-950 shadow-md transition-transform active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#4a5e30] via-[#59713b] to-[#384824] p-6 text-white text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Chef's Choice • Suggerimento dello Chef</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Here's What You Should Eat!
          </h2>
          <p className="text-xs text-[#edd5be] mt-1 font-sans">
            Hand-picked recommendation based on what is already waiting in your kitchen
          </p>
        </div>

        {/* Recipe Display Card */}
        <div className="p-6 bg-[#faf8f5]">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#f0ece3] mb-4 shadow-sm border border-[#ded8cb]">
            <img
              src={recipe.image}
              alt={recipe.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isSpinning ? 'blur-xs scale-105 opacity-70' : 'scale-100 opacity-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md">
                {recipe.cuisine} {recipe.region ? `• ${recipe.region}` : ''}
              </span>
              <span className="flex items-center gap-1 bg-[#4a5e30] text-white px-2.5 py-1 rounded-lg shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>{recipe.totalTime}m</span>
              </span>
            </div>
          </div>

          {/* Dish Details */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold mb-2 bg-[#edf2e8] text-[#344420] border border-[#d5e0cd]">
              <Check className="w-3.5 h-3.5 stroke-[3] text-[#4a5e30]" />
              <span>{matchPercentage}% Match • {missingCount === 0 ? 'Ready to cook now!' : `Missing only ${missingCount} item`}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2b2723] tracking-tight">
              {recipe.name}
            </h3>
            <p className="text-xs text-[#6e6559] mt-2 line-clamp-2 px-4 leading-relaxed font-sans">
              {recipe.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              id="btn-surprise-accept"
              disabled={isSpinning}
              onClick={() => {
                onClose();
                onSelectRecipe(recipe.id);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#4a5e30] to-[#364621] text-white font-bold text-sm shadow-md shadow-[#4a5e30]/25 hover:opacity-95 active:scale-98 transition-all"
            >
              <span>Yes! Let's Make This</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-surprise-spin-again"
              disabled={isSpinning}
              onClick={spinForRecipe}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#ede8df] hover:bg-[#e2dcd1] text-[#2b2723] font-bold text-xs transition-colors border border-[#ded8cb]"
            >
              <Dices className="w-4 h-4 text-[#7a7164]" />
              <span>Spin Again for Another Dish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
