import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StudyMetricsBar } from './components/StudyMetricsBar';
import { TopicSelector } from './components/TopicSelector';
import { ConceptTopology } from './components/ConceptTopology';
import { FeynmanProtocol } from './components/FeynmanProtocol';
import { SocraticArena } from './components/SocraticArena';
import { RealWorldSimulator } from './components/RealWorldSimulator';
import { ActiveRetrievalGauntlet } from './components/ActiveRetrievalGauntlet';
import { SkillUpgradePortfolio } from './components/SkillUpgradePortfolio';
import { TransformInputModal } from './components/TransformInputModal';
import { HackathonDossierModal } from './components/HackathonDossierModal';
import { PRESET_TOPICS } from './data/presetTopics';
import { ActiveLearningMatrix } from './types';

export default function App() {
  const [topics, setTopics] = useState<ActiveLearningMatrix[]>(() => {
    try {
      const saved = localStorage.getItem('cogniforge_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_TOPICS;
  });

  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [activePillar, setActivePillar] = useState<string>('intuition');

  const [pillarsCompleted, setPillarsCompleted] = useState<Record<string, {
    intuition: boolean;
    feynman: boolean;
    socratic: boolean;
    simulation: boolean;
    retrieval: boolean;
    project: boolean;
  }>>({});

  const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  const [streakDays, setStreakDays] = useState(4);
  const [totalMastered, setTotalMastered] = useState(12);

  const currentTopic = topics[activeTopicIndex] || topics[0] || PRESET_TOPICS[0];
  const currentCompleted = pillarsCompleted[currentTopic.topicTitle] || {
    intuition: true,
    feynman: false,
    socratic: false,
    simulation: false,
    retrieval: false,
    project: false,
  };

  const markPillarComplete = (pillarKey: keyof typeof currentCompleted) => {
    setPillarsCompleted((prev) => ({
      ...prev,
      [currentTopic.topicTitle]: {
        ...(prev[currentTopic.topicTitle] || currentCompleted),
        [pillarKey]: true,
      },
    }));
    setTotalMastered((prev) => prev + 1);
  };

  const handleTransformed = (newMatrix: ActiveLearningMatrix) => {
    const updated = [newMatrix, ...topics];
    setTopics(updated);
    setActiveTopicIndex(0);
    setActivePillar('intuition');
    try {
      localStorage.setItem('cogniforge_topics', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Header
        onOpenTransformModal={() => setIsTransformModalOpen(true)}
        onOpenDossierModal={() => setIsDossierModalOpen(true)}
        streakDays={streakDays}
        totalMastered={totalMastered}
        activeTopicName={currentTopic.topicTitle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Topic Selector Bar */}
        <TopicSelector
          topics={topics}
          activeTopicIndex={activeTopicIndex}
          onSelectTopic={(idx) => {
            setActiveTopicIndex(idx);
            setActivePillar('intuition');
          }}
          onOpenTransformModal={() => setIsTransformModalOpen(true)}
        />

        {/* Cognitive Shift Metrics & Pillar Steps Nav */}
        <StudyMetricsBar
          pillarsCompleted={currentCompleted}
          activePillar={activePillar}
          onSelectPillar={(pillarId) => setActivePillar(pillarId)}
        />

        {/* Active Study Pillar Views */}
        <div className="transition-all duration-300">
          {activePillar === 'intuition' && (
            <ConceptTopology
              data={currentTopic}
              onAdvanceToFeynman={() => {
                markPillarComplete('intuition');
                setActivePillar('feynman');
              }}
            />
          )}

          {activePillar === 'feynman' && (
            <FeynmanProtocol
              data={currentTopic}
              onCompleted={() => markPillarComplete('feynman')}
            />
          )}

          {activePillar === 'socratic' && (
            <SocraticArena
              data={currentTopic}
              onCompleted={() => markPillarComplete('socratic')}
            />
          )}

          {activePillar === 'simulation' && (
            <RealWorldSimulator
              data={currentTopic}
              onCompleted={() => markPillarComplete('simulation')}
            />
          )}

          {activePillar === 'retrieval' && (
            <ActiveRetrievalGauntlet
              data={currentTopic}
              onCompleted={() => markPillarComplete('retrieval')}
            />
          )}

          {activePillar === 'project' && (
            <SkillUpgradePortfolio
              data={currentTopic}
              onCompleted={() => markPillarComplete('project')}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <TransformInputModal
        isOpen={isTransformModalOpen}
        onClose={() => setIsTransformModalOpen(false)}
        onTransformed={handleTransformed}
      />

      <HackathonDossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>
          CogniForge Active Study & Skill Engine • Built for Hackathon Tracks: Agentic AI & Everyday Automation
        </p>
      </footer>
    </div>
  );
}
