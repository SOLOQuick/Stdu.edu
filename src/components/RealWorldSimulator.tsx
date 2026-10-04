import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Award, ArrowRight, RefreshCw, Zap, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActiveLearningMatrix, SimulationChoice } from '../types';

interface RealWorldSimulatorProps {
  data: ActiveLearningMatrix;
  onCompleted: () => void;
}

export const RealWorldSimulator: React.FC<RealWorldSimulatorProps> = ({
  data,
  onCompleted,
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const simulation = data.realWorldSimulation;

  const handleSelectChoice = (choice: SimulationChoice) => {
    setSelectedChoiceId(choice.id);
    if (choice.id === 'C' || choice.outcome.includes('MASTERY') || choice.outcome.includes('PRECISION') || choice.outcome.includes('TRIUMPH')) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
      onCompleted();
    }
  };

  const selectedChoice = simulation.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="space-y-6">
      {/* Briefing Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Pillar 4: Applied Decision Simulation
          </span>
          <span className="text-xs text-slate-400">High-Stakes Crisis Simulation</span>
        </div>

        <div className="flex items-center space-x-2 mt-1">
          <Briefcase className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
            Assigned Role: {simulation.role}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
          {simulation.scenarioTitle}
        </h2>

        {/* Context & Dilemma */}
        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="font-bold text-slate-100">Situation Briefing: </span>
            {simulation.context}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed flex items-start space-x-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">The Core Operational Dilemma: </span>
              {simulation.dilemma}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Choices Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
          <span>Choose your strategic course of action:</span>
          {selectedChoiceId && (
            <button
              onClick={() => setSelectedChoiceId(null)}
              className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Choices</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3">
          {simulation.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            return (
              <button
                key={choice.id}
                onClick={() => handleSelectChoice(choice)}
                className={`text-left p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-xl text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {choice.id}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                        {choice.action}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        <span className="text-slate-300 font-semibold">Immediate Trade-Off: </span>
                        {choice.tradeOff}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Outcome Analysis Reveal */}
      {selectedChoice && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl animate-fade-in">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Systemic Outcome & Debrief</h3>
          </div>

          <div
            className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
              selectedChoice.outcome.includes('FAILURE') || selectedChoice.outcome.includes('FATAL') || selectedChoice.outcome.includes('DEFEAT')
                ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                : selectedChoice.outcome.includes('SUB-OPTIMAL') || selectedChoice.outcome.includes('DETERIORATION') || selectedChoice.outcome.includes('COLLAPSE')
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            }`}
          >
            {selectedChoice.outcome}
          </div>

          <p className="text-xs text-slate-400 italic">
            Modern professionals learn through post-mortem simulations where failure teaches as much as success.
          </p>
        </div>
      )}
    </div>
  );
};
