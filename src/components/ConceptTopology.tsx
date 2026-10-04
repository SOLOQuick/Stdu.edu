import React, { useState } from 'react';
import { Volume2, AlertOctagon, Lightbulb, Network, ShieldCheck, ChevronRight, Sparkles } from 'lucide-react';
import { ActiveLearningMatrix, ConceptNode } from '../types';
import { playTTS } from '../services/api';

interface ConceptTopologyProps {
  data: ActiveLearningMatrix;
  onAdvanceToFeynman: () => void;
}

export const ConceptTopology: React.FC<ConceptTopologyProps> = ({
  data,
  onAdvanceToFeynman,
}) => {
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(
    data.conceptGraph.nodes[0] || null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayMentalModelAudio = async () => {
    setIsPlayingAudio(true);
    try {
      await playTTS(data.mentalModel);
    } catch (e) {
      console.error(e);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const getNodeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'core':
        return 'from-indigo-600 to-indigo-800 border-indigo-400 text-white';
      case 'prerequisite':
        return 'from-slate-700 to-slate-900 border-slate-500 text-slate-200';
      case 'mechanism':
        return 'from-cyan-600 to-cyan-800 border-cyan-400 text-white';
      case 'application':
        return 'from-emerald-600 to-emerald-800 border-emerald-400 text-white';
      default:
        return 'from-violet-600 to-violet-800 border-violet-400 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {data.domainCategory}
          </span>
          <span className="text-xs text-slate-400">Pillar 1: Modern Intuition Anchor</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {data.topicTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium max-w-3xl leading-relaxed">
          {data.tagline}
        </p>

        {/* Traditional Rote Failure Callout */}
        <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-300">The Traditional Rote Learning Trap: </span>
            {data.traditionalPitfall}
          </div>
        </div>
      </div>

      {/* Mental Model Analogy */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">First-Principles Mental Model</h2>
              <p className="text-xs text-slate-400">Intuitive cognitive anchor replacing dry textbook definitions</p>
            </div>
          </div>
          <button
            onClick={handlePlayMentalModelAudio}
            disabled={isPlayingAudio}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
            title="Listen with Gemini TTS"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isPlayingAudio ? 'Playing...' : 'Audio Narration'}</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-slate-200 text-sm sm:text-base font-normal leading-relaxed italic">
          "{data.mentalModel}"
        </div>
      </div>

      {/* Key Mechanistic Principles */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Foundational Invariants & Principles</h2>
            <p className="text-xs text-slate-400">Core mechanistic rules and why they govern real-world systems</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.keyPrinciples.map((principle, idx) => (
            <div
              key={principle.name + idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-xs font-bold text-slate-100">{principle.name}</h3>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-indigo-300 mb-2">
                  {principle.rule}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
                <span className="font-semibold text-slate-300">Why it matters: </span>
                {principle.whyItMatters}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Topology Network Map */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Concept Topology Graph</h2>
              <p className="text-xs text-slate-400">Visual dependency architecture rather than linear text</p>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {data.conceptGraph.nodes.length} Nodes • {data.conceptGraph.edges.length} Relationships
          </span>
        </div>

        {/* Visual Graph Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-center min-h-[280px]">
            <div className="flex flex-wrap items-center justify-center gap-3 p-4">
              {data.conceptGraph.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`relative p-3 rounded-xl border text-left transition-all max-w-[200px] shrink-0 ${
                      isSelected
                        ? 'ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30 scale-105 ' + getNodeColor(node.category)
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500 hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {node.category}
                      </span>
                    </div>
                    <div className="text-xs font-bold leading-tight line-clamp-2">
                      {node.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Edge relationships ticker */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 justify-center">
              {data.conceptGraph.edges.map((edge, i) => (
                <span
                  key={i}
                  className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                >
                  <span className="text-indigo-400">{edge.from}</span>
                  <span className="text-slate-500 mx-1">--[{edge.relationship}]--&gt;</span>
                  <span className="text-cyan-400">{edge.to}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Node detail inspector card */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            {selectedNode ? (
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedNode.category} Node
                </span>
                <h3 className="text-base font-bold text-white mt-2 mb-2">
                  {selectedNode.label}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic">Select a node to inspect its architectural role</div>
            )}

            <div className="pt-4 border-t border-slate-800/80 mt-4">
              <button
                onClick={onAdvanceToFeynman}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
              >
                <span>Ready: Advance to Feynman Protocol</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
