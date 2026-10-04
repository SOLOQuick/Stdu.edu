import React from 'react';
import { X, Award, CheckCircle, Target, Users, Cpu, Rocket, Code2, Sparkles, Layers } from 'lucide-react';

interface HackathonDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDossierModal: React.FC<HackathonDossierModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Banner */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hackathon Project Submission Dossier</h2>
              <p className="text-xs text-slate-400">Track: Agentic AI & Everyday Automation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto scrollbar-thin">
          {/* Executive Overview */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <span className="font-bold text-indigo-300">Project Name: </span>
            <strong>CogniForge</strong> — An autonomous pedagogical transformation engine that converts traditional, passive rote memorization into active, multi-agent cognitive mastery and applied 21st-century career skills.
          </div>

          {/* Section 1: The Genuine Real-World Problem */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
              <Target className="w-4 h-4" />
              <h3>1. The Genuine Real-World Problem</h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>The Rote Learning Epidemic:</strong> For over a century, higher education has relied on passive learning modalities: rereading textbooks, highlighting paragraphs, and memorizing slide decks for multiple-choice exams.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>
                  <strong className="text-slate-300">The Ebbinghaus Forgetting Curve:</strong> Students forget over 70% of passively studied material within 48 hours.
                </li>
                <li>
                  <strong className="text-slate-300">The Illusion of Competence:</strong> Recognition is confused with recall. Students feel familiar with terms but freeze when asked to explain mechanisms or troubleshoot real systems.
                </li>
                <li>
                  <strong className="text-slate-300">The Modern Skill Gap:</strong> Employers report that graduates possess bookish knowledge but lack critical thinking, Socratic debate agility, systems decomposition, and applied portfolio artifacts.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2: Who Experiences It */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <h3>2. Target Audience & Stakeholders</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">University & STEM Students</div>
                <p className="text-slate-400 leading-relaxed">
                  Struggling with high-volume technical courses (CS, Medicine, Engineering) where passive cramming leads to burnout.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">Self-Directed Lifelong Learners</div>
                <p className="text-slate-400 leading-relaxed">
                  Professionals learning AI, Distributed Systems, or Economics who need fast intuition and interview-ready portfolios.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">Educators & Bootcamps</div>
                <p className="text-slate-400 leading-relaxed">
                  Professors looking to instantly turn static lecture syllabi into interactive Socratic sparring arenas.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: The Working Solution & Central Workflow */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
              <Layers className="w-4 h-4" />
              <h3>3. The Working Solution & Central Workflow</h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>
                CogniForge accepts any unstructured study notes, textbook excerpt, or topic title and autonomously compiles it into a 6-pillar Active Learning Matrix:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">1. Intuition & Topology: </span>
                  First-principles analogies, physical invariants, and interactive dependency graphs.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">2. Feynman Protocol: </span>
                  Inquisitive kid simulation that detects and bans jargon crutches while scoring clarity.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">3. Socratic Adversary Arena: </span>
                  Dialectical sparring partner that attacks hidden assumptions and tests edge cases.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">4. Real-World Case Simulator: </span>
                  Role-based operational dilemma with tactical choices and systemic consequences.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">5. Active Retrieval Gauntlet: </span>
                  High-yield conceptual spaced repetition flashcards with Bloom's taxonomy tags.
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="font-bold text-indigo-300">6. Skill Upgrade Engine: </span>
                  Translates concepts into marketable resume bullets and hands-on portfolio builds.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Technology & Architecture */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-violet-400 font-bold text-sm">
              <Code2 className="w-4 h-4" />
              <h3>4. Technology Stack</h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono">
              <div><strong className="text-white">AI Core: </strong>Google Gemini 3.8 Flash via modern <code>@google/genai</code> TypeScript SDK</div>
              <div><strong className="text-white">Audio Narration: </strong><code>gemini-3.8-flash-lite-tts</code> (Voice: Kore/Puck) with Web Speech fallback</div>
              <div><strong className="text-white">Full-Stack Backend: </strong>Express.js server with Vite middleware proxy to safeguard API keys</div>
              <div><strong className="text-white">Frontend Architecture: </strong>React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons</div>
            </div>
          </div>

          {/* Section 5: Future Development Plan */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <Rocket className="w-4 h-4" />
              <h3>5. Future Development Plan & Roadmap</h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Phase 1 (Completed):</strong> Autonomous 6-pillar active study generation, Feynman clarity grading, Socratic adversary, and crisis simulations.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Phase 2 (Next 60 Days):</strong> Institutional LMS integration (Canvas, Moodle, Blackboard) allowing professors to convert entire semesters into active simulations with 1 click.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong>Phase 3 (Next 180 Days):</strong> Peer-to-Peer Socratic Tournament mode and automated GitHub / LinkedIn skill verification badges.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
