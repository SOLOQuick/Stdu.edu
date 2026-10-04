import React from 'react';
import { CheckCircle2, Circle, TrendingUp, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

interface StudyMetricsBarProps {
  pillarsCompleted: {
    intuition: boolean;
    feynman: boolean;
    socratic: boolean;
    simulation: boolean;
    retrieval: boolean;
    project: boolean;
  };
  activePillar: string;
  onSelectPillar: (pillar: string) => void;
}

export const StudyMetricsBar: React.FC<StudyMetricsBarProps> = ({
  pillarsCompleted,
  activePillar,
  onSelectPillar,
}) => {
  const completedCount = Object.values(pillarsCompleted).filter(Boolean).length;
  const retentionEstimate = Math.min(94, 25 + completedCount * 14);

  const pillars = [
    { id: 'intuition', label: '1. Mental Model', completed: pillarsCompleted.intuition },
    { id: 'feynman', label: '2. Feynman Protocol', completed: pillarsCompleted.feynman },
    { id: 'socratic', label: '3. Socratic Arena', completed: pillarsCompleted.socratic },
    { id: 'simulation', label: '4. Case Simulation', completed: pillarsCompleted.simulation },
    { id: 'retrieval', label: '5. Active Retrieval', completed: pillarsCompleted.retrieval },
    { id: 'project', label: '6. Skill Upgrade', completed: pillarsCompleted.project },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Cognitive Retention Shift Comparison */}
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Cognitive Retention Index
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {retentionEstimate}% Retained
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Traditional passive reading yields <span className="text-amber-400 font-semibold">~25%</span> retention; active retrieval & Socratic challenge lifts retention to <span className="text-emerald-400 font-semibold">90%+</span>.
            </p>
          </div>
        </div>

        {/* Pillars completion nav pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {pillars.map((p) => {
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPillar(p.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : p.completed
                    ? 'bg-slate-800/90 text-emerald-300 border border-emerald-500/30 hover:bg-slate-800'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {p.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-200' : 'text-slate-600'}`} />
                )}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
