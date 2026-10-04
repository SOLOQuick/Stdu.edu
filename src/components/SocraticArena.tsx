import React, { useState } from 'react';
import { Sparkles, MessageCircle, Send, Volume2, ShieldCheck, Scale, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { ActiveLearningMatrix, SocraticMessage } from '../types';
import { submitSocraticArgument, playTTS } from '../services/api';

interface SocraticArenaProps {
  data: ActiveLearningMatrix;
  onCompleted: () => void;
}

export const SocraticArena: React.FC<SocraticArenaProps> = ({
  data,
  onCompleted,
}) => {
  const [messages, setMessages] = useState<SocraticMessage[]>([
    {
      id: 'init',
      role: 'socrates',
      content: `${data.socraticDebate.openingQuestion} Consider the premise: "${data.socraticDebate.provocativePremise}". How do you defend or falsify this?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputArg, setInputArg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rigorScore, setRigorScore] = useState<number | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputArg.trim() || isSubmitting) return;

    const userMsg: SocraticMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: inputArg,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputArg('');
    setIsSubmitting(true);

    try {
      const response = await submitSocraticArgument({
        topic: data.topicTitle,
        premise: data.socraticDebate.provocativePremise,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
        userArgument: userMsg.content,
      });

      const socratesMsg: SocraticMessage = {
        id: 'soc_' + Date.now(),
        role: 'socrates',
        content: response.socratesResponse,
        timestamp: Date.now(),
        rigorRating: response.intellectualRigorRating,
        identifiedAssumption: response.identifiedAssumption,
        nextParadoxChallenge: response.nextParadoxChallenge,
      };

      setMessages((prev) => [...prev, socratesMsg]);
      setRigorScore(response.intellectualRigorRating);

      if (response.intellectualRigorRating >= 75) {
        onCompleted();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlaySpeech = async (msg: SocraticMessage) => {
    setActiveAudioId(msg.id);
    try {
      await playTTS(msg.content, 'Puck');
    } catch (e) {
      console.error(e);
    } finally {
      setActiveAudioId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Pillar 3: Dialectical Reasoning
          </span>
          <span className="text-xs text-slate-400">Socratic Adversary Arena</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Spar With an Intellectual Devil's Advocate
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
          Traditional tests check if you remember facts. The Socratic method checks if your logic holds up under edge cases, paradoxical contradictions, and hostile cross-examination.
        </p>

        {/* Provocative Dialectic Premise */}
        <div className="mt-4 p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 flex items-start space-x-3">
          <Scale className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-200">
            <span className="font-bold text-violet-300">The Socratic Paradox: </span>
            "{data.socraticDebate.provocativePremise}"
          </div>
        </div>
      </div>

      {/* Dialectic Dialogue Box */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-2 mb-1 px-1">
                  <span className="text-[11px] font-bold text-slate-400">
                    {isUser ? 'You (Student)' : 'Socrates'}
                  </span>
                  {!isUser && (
                    <button
                      onClick={() => handlePlaySpeech(m)}
                      className="text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors"
                      title="Listen with Gemini TTS"
                    >
                      <Volume2
                        className={`w-3.5 h-3.5 ${
                          activeAudioId === m.id ? 'text-cyan-400 animate-pulse' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-600/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  {m.content}

                  {/* Socratic feedback tags */}
                  {!isUser && m.identifiedAssumption && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 font-mono">
                      <span className="font-semibold text-amber-400">Uncovered Assumption: </span>
                      {m.identifiedAssumption}
                    </div>
                  )}

                  {!isUser && m.rigorRating !== undefined && (
                    <div className="mt-1 text-[10px] text-emerald-400 font-mono">
                      Argument Rigor: {m.rigorRating}/100
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSubmitting && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 italic p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
              <span>Socrates is formulating a dialectical counter-question...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputArg}
            onChange={(e) => setInputArg(e.target.value)}
            disabled={isSubmitting}
            placeholder="Argue your case using first principles, counter-examples, or definitions..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting || !inputArg.trim()}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition-all disabled:opacity-50"
          >
            <span>Debate</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
