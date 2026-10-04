import React, { useState } from 'react';
import { Briefcase, Code, Download, CheckSquare, Sparkles, Award, ExternalLink, Check } from 'lucide-react';
import { ActiveLearningMatrix } from '../types';

interface SkillUpgradePortfolioProps {
  data: ActiveLearningMatrix;
  onCompleted: () => void;
}

export const SkillUpgradePortfolio: React.FC<SkillUpgradePortfolioProps> = ({
  data,
  onCompleted,
}) => {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [downloaded, setDownloaded] = useState(false);

  const toggleStep = (idx: number) => {
    const updated = { ...checkedSteps, [idx]: !checkedSteps[idx] };
    setCheckedSteps(updated);
    if (Object.values(updated).filter(Boolean).length === data.miniProjectChallenge.steps.length) {
      onCompleted();
    }
  };

  const handleExportBrief = () => {
    const markdown = `# CogniForge Skill Dossier: ${data.topicTitle}
**Domain Category:** ${data.domainCategory}
**Generated Date:** ${new Date().toLocaleDateString()}

## 1. First-Principles Mental Model
> "${data.mentalModel}"

## 2. Invariants & Key Principles
${data.keyPrinciples.map((p, i) => `${i + 1}. **${p.name}**: \`${p.rule}\`\n   - *Why it matters:* ${p.whyItMatters}`).join('\n')}

## 3. Marketable 21st-Century Skills Acquired
${data.modernSkillsUpgraded.map((s) => `### ${s.skillName} (${s.category})
- **Market Relevance:** ${s.marketRelevance}
- **Portfolio Showcase:** ${s.portfolioApplication}`).join('\n\n')}

## 4. Mini Project Challenge
**Title:** ${data.miniProjectChallenge.title}
**Objective:** ${data.miniProjectChallenge.objective}
**Deliverable:** ${data.miniProjectChallenge.deliverable}

### Steps:
${data.miniProjectChallenge.steps.map((st, i) => `${i + 1}. [ ] ${st}`).join('\n')}

### Evaluation Criteria:
${data.miniProjectChallenge.evaluationChecklist.map((c) => `- [ ] ${c}`).join('\n')}

---
*Created with CogniForge Active Study & Skill Engine powered by Google Gemini.*
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-skill-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pillar 6: Career & Portfolio Translation
              </span>
              <span className="text-xs text-slate-400">21st-Century Skill Upgrade</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Transform Textbook Theory into Marketable Capability
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Employers don't hire test-takers; they hire engineers, researchers, and strategists who can apply principles to build resilient systems.
            </p>
          </div>

          <button
            onClick={handleExportBrief}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Exported to Markdown!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Skill Brief (.MD)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upgraded Skills Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.modernSkillsUpgraded.map((skill, idx) => (
          <div
            key={idx}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {skill.category}
                </span>
                <Briefcase className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{skill.skillName}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                <span className="font-semibold text-slate-200">Industry Value: </span>
                {skill.marketRelevance}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-indigo-300 font-mono">
              <span className="font-bold text-slate-400 block mb-1">Resume & GitHub Proof:</span>
              {skill.portfolioApplication}
            </div>
          </div>
        ))}
      </div>

      {/* Mini-Project Challenge Build */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
              Proof-of-Competence Mini Build
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {data.miniProjectChallenge.title}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">Target Objective:</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {data.miniProjectChallenge.objective}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-300">Tangible Deliverable:</div>
            <p className="text-xs text-indigo-300 font-mono leading-relaxed">
              {data.miniProjectChallenge.deliverable}
            </p>
          </div>
        </div>

        {/* Implementation Steps Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Build Execution Steps:
          </h4>
          <div className="space-y-2">
            {data.miniProjectChallenge.steps.map((step, idx) => {
              const isChecked = !!checkedSteps[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center space-x-3 transition-all ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-medium leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Checklist */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-300">Portfolio Review Criteria:</div>
          <ul className="text-xs text-slate-400 space-y-1 pl-5 list-disc">
            {data.miniProjectChallenge.evaluationChecklist.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
