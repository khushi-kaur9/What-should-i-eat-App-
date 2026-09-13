import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, 
  Play, Pause, RotateCcw, Volume2, Sparkles, ChefHat, Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerInitial, setTimerInitial] = useState<number>(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const totalSteps = recipe.steps.length;
  const currentStepText = recipe.steps[currentStepIndex];

  // Auto-detect minutes mentioned in the current step
  useEffect(() => {
    const match = currentStepText.match(/(\d+)\s*(minutes|mins|min)/i);
    if (match && match[1]) {
      const minutes = parseInt(match[1], 10);
      const secs = minutes * 60;
      setTimerInitial(secs);
      setTimerSeconds(secs);
      setIsTimerRunning(false);
    } else {
      setTimerSeconds(null);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, currentStepText]);

  // Timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            // Fire mini confetti on timer complete!
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.8 },
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextStep();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevStep();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps]);

  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Completed all steps!
      triggerCelebration();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const isLastStep = currentStepIndex === totalSteps - 1;

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      id="cooking-mode-screen"
      className="fixed inset-0 z-50 bg-stone-950 text-white flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4a5e30] flex items-center justify-center text-white shadow-md">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#edd5be] uppercase tracking-wider">
              In Cucina • Guided Cooking
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-stone-100 truncate max-w-xs sm:max-w-md">
              {recipe.name}
            </h2>
          </div>
        </div>

        {/* Close Button */}
        <button
          id="btn-exit-cooking"
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <span>Exit</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center Main Stage */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col justify-center">
        {/* Step Badge & Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm font-bold text-stone-400 mb-2">
            <span>
              Passo <span className="text-[#edd5be] text-lg font-serif font-black">{currentStepIndex + 1}</span> of {totalSteps}
            </span>
            <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% Complete</span>
          </div>

          <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#829c78] to-[#4a5e30] transition-all duration-300 rounded-full"
              style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Big Step Instruction Text */}
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md mb-6">
          <p className="text-xl sm:text-2xl md:text-3xl font-serif font-medium leading-relaxed sm:leading-relaxed text-stone-100">
            {currentStepText}
          </p>
        </div>

        {/* Interactive Step Kitchen Timer */}
        {timerSeconds !== null && (
          <div className="flex items-center justify-center gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800 max-w-md mx-auto w-full">
            <Timer className="w-6 h-6 text-[#edd5be]" />
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-[#edd5be]">
              {formatTimer(timerSeconds)}
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-cooking-timer-toggle"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-10 h-10 rounded-xl bg-[#4a5e30] hover:bg-[#3d4e27] text-white flex items-center justify-center font-bold shadow-md transition-all"
              >
                {isTimerRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              <button
                id="btn-cooking-timer-reset"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(timerInitial);
                }}
                className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="p-4 sm:p-6 border-t border-stone-800/80 bg-stone-900/90">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button
            id="btn-cooking-prev-step"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-sm sm:text-base transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          <div className="text-xs text-stone-500 hidden sm:block">
            Press <kbd className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded text-xs font-mono">Space</kbd> or{' '}
            <kbd className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded text-xs font-mono">→</kbd> for next
          </div>

          <button
            id="btn-cooking-next-step"
            onClick={handleNextStep}
            className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl font-extrabold text-sm sm:text-base shadow-lg transition-all ${
              isLastStep
                ? 'bg-[#4a5e30] text-white shadow-[#4a5e30]/30 hover:scale-105'
                : 'bg-gradient-to-r from-[#4a5e30] via-[#5a733b] to-[#4a5e30] text-white shadow-[#4a5e30]/20 hover:opacity-95'
            }`}
          >
            <span>{isLastStep ? 'Buon Appetito! (Done)' : 'Next Step'}</span>
            {isLastStep ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
