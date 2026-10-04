import { ActiveLearningMatrix, FeynmanEvaluation } from '../types';

export async function transformStudyMaterial(
  title: string,
  content: string,
  targetDepth: 'introductory' | 'deep-dive' | 'advanced-mastery' = 'deep-dive'
): Promise<ActiveLearningMatrix> {
  const response = await fetch('/api/transform-study', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, targetDepth }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function evaluateFeynmanExplanation(params: {
  topic: string;
  beginnerQuestion: string;
  bannedJargon: string[];
  studentExplanation: string;
}): Promise<FeynmanEvaluation> {
  const response = await fetch('/api/feynman-evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function submitSocraticArgument(params: {
  topic: string;
  premise: string;
  history: Array<{ role: 'socrates' | 'user'; content: string }>;
  userArgument: string;
}): Promise<{
  socratesResponse: string;
  intellectualRigorRating: number;
  identifiedAssumption: string;
  nextParadoxChallenge: string;
}> {
  const response = await fetch('/api/socratic-dialectic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function playTTS(text: string, voice = 'Kore'): Promise<void> {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        await audio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Backend TTS failed, falling back to Web Speech API', err);
  }

  // Graceful browser fallback
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }
}
