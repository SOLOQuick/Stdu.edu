import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Wand2, FileText, ArrowRight, Loader2, Check } from 'lucide-react';
import { transformStudyMaterial } from '../services/api';
import { ActiveLearningMatrix } from '../types';

interface TransformInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransformed: (newMatrix: ActiveLearningMatrix) => void;
}

const SAMPLE_NOTES = [
  {
    title: "Backpropagation & Neural Loss Landscapes",
    snippet: "Neural networks update weights using reverse-mode automatic differentiation. The chain rule calculates partial derivatives of the loss function with respect to each weight. Vanishing gradients occur when multiplying many small derivatives in deep networks with sigmoid activation.",
    category: "AI & Deep Learning"
  },
  {
    title: "Quantum Entanglement & Bell's Theorem",
    snippet: "Entangled particle pairs exhibit correlated quantum states regardless of the spatial distance separating them. Bell's inequalities proved that no local hidden variable theory can reproduce all quantum mechanical correlations, disproving Einstein's 'spooky action at a distance' skepticism.",
    category: "Quantum Physics"
  },
  {
    title: "Constitutional Law: Strict Scrutiny Standard",
    snippet: "Under the Equal Protection Clause, government classifications based on suspect classes (race, national origin) or affecting fundamental rights face strict scrutiny. The law must be narrowly tailored to serve a compelling governmental interest using the least restrictive means.",
    category: "Legal Studies"
  },
  {
    title: "Cognitive Load Theory & Dual Process Thinking",
    snippet: "System 1 is fast, unconscious, and heuristic-driven; System 2 is slow, analytical, and cognitively expensive. Working memory holds only 4±1 chunks of novel information simultaneously. Intrinsic vs extraneous cognitive load dictates instructional design effectiveness.",
    category: "Cognitive Psychology"
  }
];

export const TransformInputModal: React.FC<TransformInputModalProps> = ({
  isOpen,
  onClose,
  onTransformed,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetDepth, setTargetDepth] = useState<'introductory' | 'deep-dive' | 'advanced-mastery'>('deep-dive');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  if (!isOpen) return null;

  const loadingSteps = [
    "Deconstructing passive textbook text into first-principles...",
    "Extracting Socratic paradoxes and dialectic edge cases...",
    "Designing high-stakes real-world scenario simulation...",
    "Formulating Feynman Protocol challenge questions...",
    "Mapping 21st-century professional skills & mini-project...",
  ];

  const handleApplySample = (sample: typeof SAMPLE_NOTES[0]) => {
    setTitle(sample.title);
    setContent(sample.snippet);
  };

  const handleTransform = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) {
      setError('Please provide a topic title or paste study notes.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(0);

    // Step cycle animation
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
    }, 1800);

    try {
      const result = await transformStudyMaterial(title, content, targetDepth);
      clearInterval(interval);
      onTransformed(result);
      onClose();
    } catch (err: any) {
      clearInterval(interval);
      console.error(err);
      setError(err.message || 'Failed to transform study material. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Transform Study Material</h2>
              <p className="text-xs text-slate-400">Turn passive text/notes into an active modern mastery matrix</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleTransform} className="p-6 space-y-4">
          {/* Quick preset chips */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Or pick a sample syllabus topic:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_NOTES.map((sample) => (
                <button
                  type="button"
                  key={sample.title}
                  onClick={() => handleApplySample(sample)}
                  className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {sample.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{sample.snippet}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Topic or Chapter Title <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CRISPR Gene Editing, Operating System Deadlocks, Game Theory Nash Equilibrium"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Raw Text Notes or Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Paste Notes, Textbook Excerpt, or Lecture Transcript (Optional)
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste raw text here, or leave blank and Gemini will generate the complete active curriculum directly from the topic title..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-mono text-xs"
            />
          </div>

          {/* Target Depth */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cognitive Depth</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'introductory', label: 'Introductory', desc: 'Core intuition & basics' },
                { id: 'deep-dive', label: 'Deep-Dive', desc: 'Systems & failure modes' },
                { id: 'advanced-mastery', label: 'Mastery', desc: 'Industry edge cases' },
              ].map((tier) => (
                <button
                  type="button"
                  key={tier.id}
                  onClick={() => setTargetDepth(tier.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    targetDepth === tier.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">{tier.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tier.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-300 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Transforming with Gemini 3.8 Flash...</span>
              </div>
              <p className="text-xs text-slate-300 font-mono animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing Matrix...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Forge Active Learning Matrix</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
