import React, { useState } from 'react';
import { Sparkles, MessageSquare, AlertCircle, CheckCircle2, Volume2, ShieldAlert, Award, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveLearningMatrix, FeynmanEvaluation } from '../types';
import { evaluateFeynmanExplanation, playTTS } from '../services/api';

interface FeynmanProtocolProps {
  data: ActiveLearningMatrix;
  onCompleted: () => void;
}

export const FeynmanProtocol: React.FC<FeynmanProtocolProps> = ({
  data,
  onCompleted,
}) => {
  const [explanation, setExplanation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<FeynmanEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { beginnerQuestion, coreInsightRequired, bannedJargon } = data.feynmanProtocol;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) {
      setError('Please provide an explanation to evaluate.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const result = await evaluateFeynmanExplanation({
        topic: data.topicTitle,
        beginnerQuestion,
        bannedJargon,
        studentExplanation: explanation,
      });

      setEvaluation(result);
      if (result.clarityScore >= 75) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onCompleted();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handlePlayGoldStandardAudio = async () => {
    if (!evaluation?.feynmanGoldStandard) return;
    setIsPlayingAudio(true);
    try {
      await playTTS(evaluation.feynmanGoldStandard);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Pillar 2: Active Synthesis
          </span>
          <span className="text-xs text-slate-400">The Feynman Protocol: Teach to Learn</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Explain It to an Inquisitive 12-Year-Old
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Richard Feynman observed: <span className="italic text-indigo-300">"If you can’t explain it simply, you don’t understand it well enough."</span> Test yourself by explaining without hiding behind fancy textbook vocabulary.
        </p>

        {/* The Beginner Challenge Box */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>The Inquisitive Question:</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-white pl-6">
            "{beginnerQuestion}"
          </div>
          <div className="text-xs text-slate-400 pl-6">
            <span className="text-slate-300 font-semibold">Core insight to convey: </span>
            {coreInsightRequired}
          </div>
        </div>

        {/* Banned Jargon Crutches */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>Banned Jargon Crutches:</span>
          </div>
          {bannedJargon.map((word) => (
            <span
              key={word}
              className="text-xs font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 line-through decoration-rose-400/80"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Your Plain-Language Explanation:
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {explanation.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            rows={5}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Imagine sitting across from a curious kid. Use a vivid real-world analogy (like a playground game, kitchen recipe, or postal service). Avoid abstract textbook words..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none leading-relaxed"
          />

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-400 italic hidden sm:block">
              AI evaluates clarity, flags jargon crutches, and pinpoints logical gaps.
            </div>
            <button
              type="submit"
              disabled={isEvaluating || !explanation.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Feynman Rigor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Evaluate with Feynman AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Evaluation Result */}
      {evaluation && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl animate-fade-in">
          {/* Score Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Pedagogical Evaluation</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Assessed against first-principles cognitive clarity</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-black text-white">{evaluation.clarityScore}/100</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Clarity Index
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                  evaluation.clarityScore >= 80
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : evaluation.clarityScore >= 60
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {evaluation.level}
              </span>
            </div>
          </div>

          {/* Constructive Feynman Feedback */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-slate-200 text-xs sm:text-sm leading-relaxed">
            <span className="font-bold text-indigo-300">Feynman's Critique: </span>
            {evaluation.constructiveCritique}
          </div>

          {/* Strengths & Gaps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Lucid Strengths & Analogies:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Gaps */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>Conceptual Gaps or Vagueness:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                {evaluation.conceptualGaps.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Jargon detected warning if any */}
          {evaluation.jargonDetected.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-xs text-rose-300">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>
                <strong>Jargon crutches flagged:</strong> {evaluation.jargonDetected.join(', ')}
              </span>
            </div>
          )}

          {/* Feynman's Gold Standard */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">
                  Feynman's Gold Standard Explanation:
                </span>
              </div>
              <button
                onClick={handlePlayGoldStandardAudio}
                disabled={isPlayingAudio}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-indigo-200 italic font-mono p-3 bg-slate-900 rounded-xl border border-slate-800">
              "{evaluation.feynmanGoldStandard}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
