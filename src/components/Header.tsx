import React from 'react';
import { Sparkles, Brain, Award, Flame, FileText, PlusCircle, Volume2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenTransformModal: () => void;
  onOpenDossierModal: () => void;
  streakDays: number;
  totalMastered: number;
  activeTopicName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTransformModal,
  onOpenDossierModal,
  streakDays,
  totalMastered,
  activeTopicName,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
                  CogniForge
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  Active Study Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Converting Passive Rote Learning into 21st-Century Applied Skills
              </p>
            </div>
          </div>

          {/* Gamified stats & Action CTAs */}
          <div className="flex items-center space-x-3">
            {/* Streak & Stats */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <div className="flex items-center space-x-1 text-amber-400 font-medium">
                <Flame className="w-3.5 h-3.5 fill-amber-400/30" />
                <span>{streakDays} Day Streak</span>
              </div>
              <div className="w-px h-3.5 bg-slate-800" />
              <div className="flex items-center space-x-1 text-emerald-400 font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>{totalMastered} Concepts Mastered</span>
              </div>
            </div>

            {/* Hackathon Project Dossier */}
            <button
              onClick={onOpenDossierModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-indigo-500/50 hover:text-white"
              title="View Hackathon Problem, Solution & Architecture Overview"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Project Dossier</span>
            </button>

            {/* Transform New Study Material CTA */}
            <button
              onClick={onOpenTransformModal}
              className="relative group inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Transform Notes</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
