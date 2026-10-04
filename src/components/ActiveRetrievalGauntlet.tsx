import React, { useState } from 'react';
import { RotateCw, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Award, Sparkles, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveLearningMatrix, RetrievalCard } from '../types';

interface ActiveRetrievalGauntletProps {
  data: ActiveLearningMatrix;
  onCompleted: () => void;
}

export const ActiveRetrievalGauntlet: React.FC<ActiveRetrievalGauntletProps> = ({
  data,
  onCompleted,
}) => {
  const [cards, setCards] = useState<RetrievalCard[]>(data.retrievalCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Update cards when data changes
  React.useEffect(() => {
    setCards(data.retrievalCards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [data]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRate = (status: 'mastered' | 'review') => {
    const updated = [...cards];
    updated[currentIndex] = { ...updated[currentIndex], userMastery: status };
    setCards(updated);

    const masteredCount = updated.filter((c) => c.userMastery === 'mastered').length;
    if (masteredCount === cards.length) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onCompleted();
    }

    handleNext();
  };

  const masteredCount = cards.filter((c) => c.userMastery === 'mastered').length;
  const progressPercent = Math.round((masteredCount / (cards.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Pillar 5: Cognitive Testing
              </span>
              <span className="text-xs text-slate-400">Active Retrieval Gauntlet</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Test Effortful Retrieval (No Passive Rereading)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Research in cognitive science proves that attempting to pull memory out of your brain physically rewires neural synaptic strength 300% more effectively than reviewing notes.
            </p>
          </div>

          {/* Progress gauge */}
          <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Mastery Progress</div>
              <div className="text-lg font-extrabold text-emerald-400">
                {masteredCount} / {cards.length} Cards
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* 3D Flashcard Stage */}
      <div className="flex flex-col items-center">
        {/* Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-2xl min-h-[300px] cursor-pointer perspective-1000 group transition-all"
        >
          <div
            className={`relative w-full h-full min-h-[300px] rounded-3xl p-8 border transition-all duration-500 flex flex-col justify-between shadow-2xl ${
              isFlipped
                ? 'bg-gradient-to-br from-slate-900 to-indigo-950/70 border-indigo-500/60 shadow-indigo-500/10'
                : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-700/80 group-hover:border-slate-500'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Bloom: {currentCard.bloomLevel || 'Analyze'}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1 group-hover:text-indigo-300 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Click to flip</span>
                </span>
              </div>
            </div>

            {/* Content Area */}
            <div className="my-6">
              {!isFlipped ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Active Retrieval Challenge:
                  </div>
                  <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                    {currentCard.question}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Mechanistic Answer:
                  </div>
                  <div className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
                    {currentCard.answer}
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-indigo-300">
                    <span className="font-bold text-indigo-200">The "Aha!" Insight: </span>
                    {currentCard.coreInsight}
                  </div>
                </div>
              )}
            </div>

            {/* Footer card indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3">
              <span>{isFlipped ? 'Answer Revealed' : 'Attempt recall before flipping'}</span>
              {currentCard.userMastery && (
                <span
                  className={`font-semibold ${
                    currentCard.userMastery === 'mastered' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  Status: {currentCard.userMastery === 'mastered' ? 'Mastered ✓' : 'Needs Review'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Self-Rating & Navigation Controls */}
        <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          {/* Card Prev/Next */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Effortful Rating Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleRate('review')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Need More Practice</span>
            </button>
            <button
              onClick={() => handleRate('mastered')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>I Mastered This Concept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
