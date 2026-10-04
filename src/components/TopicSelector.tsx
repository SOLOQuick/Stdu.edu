import React from 'react';
import { BookOpen, Sparkles, Layers, Cpu, HeartPulse, DollarSign, Compass } from 'lucide-react';
import { ActiveLearningMatrix } from '../types';

interface TopicSelectorProps {
  topics: ActiveLearningMatrix[];
  activeTopicIndex: number;
  onSelectTopic: (index: number) => void;
  onOpenTransformModal: () => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  activeTopicIndex,
  onSelectTopic,
  onOpenTransformModal,
}) => {
  const getDomainIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('computer') || cat.includes('system') || cat.includes('code')) {
      return <Cpu className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (cat.includes('bio') || cat.includes('med') || cat.includes('physiol')) {
      return <HeartPulse className="w-3.5 h-3.5 text-rose-400" />;
    }
    if (cat.includes('econ') || cat.includes('market') || cat.includes('financ')) {
      return <DollarSign className="w-3.5 h-3.5 text-amber-400" />;
    }
    return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
      <div className="flex items-center text-xs font-semibold text-slate-400 shrink-0 mr-1">
        <Compass className="w-4 h-4 mr-1.5 text-indigo-400" />
        <span>Subjects:</span>
      </div>

      {topics.map((t, idx) => {
        const isSelected = activeTopicIndex === idx;
        return (
          <button
            key={t.topicTitle + idx}
            onClick={() => onSelectTopic(idx)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
              isSelected
                ? 'bg-indigo-900/60 border border-indigo-500/80 text-white shadow-sm shadow-indigo-500/20'
                : 'bg-slate-900/70 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {getDomainIcon(t.domainCategory)}
            <span className="max-w-[200px] truncate">{t.topicTitle}</span>
            {idx >= 3 && (
              <span className="text-[10px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded font-mono">
                Custom
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={onOpenTransformModal}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 bg-slate-900/50 border border-dashed border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/40 hover:border-indigo-400 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>+ Transform New Topic</span>
      </button>
    </div>
  );
};
