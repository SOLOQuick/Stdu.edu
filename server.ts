import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;

// Initialize shared Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for safe JSON parse
function cleanAndParseJSON(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

// 1. Transform passive study material into active modern learning matrix
app.post('/api/transform-study', async (req: Request, res: Response) => {
  try {
    const { title, content, targetDepth } = req.body;

    if (!title && !content) {
      return res.status(400).json({ error: 'Title or study content is required' });
    }

    const prompt = `
You are the world's leading Cognitive Scientist, Pedagogical Architect, and Master Educator.
Convert the following traditional study material or topic into a complete Modern Active Learning Matrix.

Input Topic/Title: "${title || 'Self-Directed Subject'}"
Content/Notes: "${(content || title || '').slice(0, 4000)}"
Depth Level: "${targetDepth || 'deep-dive'}"

Traditional learning (reading text line-by-line, highlighting, memorizing definitions) causes the "illusion of competence" and 70% forgetting.
Your transformation must turn this into ACTIVE, Socratic, scenario-based mastery that translates directly into high-leverage 21st-century professional skills.

Provide a comprehensive, high-quality JSON object adhering to this schema:
{
  "topicTitle": "Crisp modern title",
  "tagline": "Punchy 1-sentence mental model",
  "domainCategory": "Computer Science / Bio-Medicine / Economics / AI / Psychology / Engineering",
  "traditionalPitfall": "Exactly why students fail or forget this when studying the old way (passive re-reading, memorizing formulas without intuition)",
  "mentalModel": "A memorable real-world analogy and intuitive anchor that makes the concept click instantly",
  "keyPrinciples": [
    {
      "name": "Principle name",
      "rule": "Core formulation or mechanistic law",
      "whyItMatters": "Practical implication in real-world systems"
    }
  ],
  "conceptGraph": {
    "nodes": [
      { "id": "n1", "label": "Node Label", "category": "core | prerequisite | mechanism | application", "description": "Short explanation" }
    ],
    "edges": [
      { "from": "n1", "to": "n2", "relationship": "drives | enables | bounds | transforms" }
    ]
  },
  "feynmanProtocol": {
    "beginnerQuestion": "An inquisitive question an intelligent 12-year-old would ask about this topic",
    "coreInsightRequired": "The key realization the student must convey",
    "bannedJargon": ["list of 4-6 technical words they CANNOT lean on as crutches"]
  },
  "socraticDebate": {
    "provocativePremise": "A challenging edge case, paradox, or counter-intuitive claim that challenges dogmatic understanding",
    "openingQuestion": "First question to test the student's dialectical reasoning"
  },
  "realWorldSimulation": {
    "scenarioTitle": "High-stakes realistic mission",
    "role": "e.g. Lead Systems Architect / Chief Medical Officer / Economic Policy Director",
    "context": "Urgent crisis or high-stakes challenge that requires applying the concept",
    "dilemma": "The core tension or trade-off",
    "choices": [
      {
        "id": "A",
        "action": "First tactical approach",
        "tradeOff": "Pros and immediate trade-off",
        "outcome": "Systemic result and analysis of correctness"
      },
      {
        "id": "B",
        "action": "Second tactical approach",
        "tradeOff": "Pros and immediate trade-off",
        "outcome": "Systemic result and analysis of correctness"
      },
      {
        "id": "C",
        "action": "Optimal synthesis approach",
        "tradeOff": "Nuanced strategic balance",
        "outcome": "Systemic result and analysis of correctness"
      }
    ]
  },
  "retrievalCards": [
    {
      "id": "rc1",
      "question": "Deep conceptual retrieval question (avoid simple rote definitions)",
      "answer": "Concise mechanistic explanation",
      "coreInsight": "The 'aha!' point",
      "bloomLevel": "Apply"
    }
  ],
  "modernSkillsUpgraded": [
    {
      "skillName": "Marketable Skill (e.g. Distributed Fault Tolerance, Mechanistic Diagnostics)",
      "category": "Technical | Cognitive | Systems Thinking",
      "marketRelevance": "Why top engineering, research, or product teams seek this skill",
      "portfolioApplication": "How to show this on a GitHub/Resume/Portfolio"
    }
  ],
  "miniProjectChallenge": {
    "title": "Hands-on real-world mini build",
    "objective": "Clear deliverable demonstrating applied mastery",
    "deliverable": "Artifact description (e.g. interactive notebook, simulation script, architectural blueprint)",
    "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "evaluationChecklist": ["Criterion 1", "Criterion 2", "Criterion 3"]
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Transform study error:', error);
    res.status(500).json({ error: error.message || 'Failed to transform study material' });
  }
});

// 2. Evaluate Feynman Technique Explanation
app.post('/api/feynman-evaluate', async (req: Request, res: Response) => {
  try {
    const { topic, bannedJargon, beginnerQuestion, studentExplanation } = req.body;

    if (!studentExplanation || !studentExplanation.trim()) {
      return res.status(400).json({ error: 'Explanation is required' });
    }

    const prompt = `
You are Richard Feynman, evaluating a student who is trying to explain the topic "${topic}" to a smart 12-year-old.
The question asked was: "${beginnerQuestion}"
Banned Jargon Crutches: ${(bannedJargon || []).join(', ')}

Student's Explanation:
"${studentExplanation}"

Evaluate their explanation with high pedagogical rigor, humor, and empathy. Check:
1. Did they fall back on opaque jargon or buzzwords instead of first-principles physical intuition?
2. Did they convey the true causal mechanism?
3. Where are the conceptual holes or misunderstandings?
4. What was exceptionally lucid?

Respond in JSON format:
{
  "clarityScore": 85, // integer 0 to 100
  "level": "Novice Memorizer" | "Developing Explainer" | "Concept Master",
  "jargonDetected": ["list of jargon words they used without explaining"],
  "conceptualGaps": ["specific points where the logic broke down or was hand-waved"],
  "strengths": ["specific analogies or lucid phrases that demonstrated real intuition"],
  "constructiveCritique": "Feynman-style honest, friendly feedback directly addressing the student",
  "feynmanGoldStandard": "How Feynman himself would explain this in 2 crystalline, punchy sentences using ordinary objects"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Feynman evaluation error:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate explanation' });
  }
});

// 3. Socratic Dialectic Arena Interaction
app.post('/api/socratic-dialectic', async (req: Request, res: Response) => {
  try {
    const { topic, premise, history, userArgument } = req.body;

    const conversationContext = (history || [])
      .map((msg: { role: string; content: string }) => `${msg.role === 'user' ? 'Student' : 'Socrates'}: ${msg.content}`)
      .join('\n');

    const prompt = `
You are Socrates, engaging in dialectic inquiry about the topic: "${topic}".
The core premise being challenged: "${premise}"

Previous dialogue:
${conversationContext}

Student's latest argument:
"${userArgument}"

Your objective is NOT to give direct answers or lecture. Your role is:
1. Pinpoint the underlying assumptions in the student's argument.
2. Present a rigorous counter-example, boundary condition, or cognitive dissonance.
3. If they demonstrated sound logic, advance the inquiry to a deeper philosophical or engineering layer.
4. Keep your response under 100 words. Be intellectually stimulating, sharp, and encouraging.

Respond in JSON:
{
  "socratesResponse": "Dialectical counter-question or response",
  "intellectualRigorRating": 88, // 0-100 evaluating the student's argument
  "identifiedAssumption": "The implicit assumption the student made",
  "nextParadoxChallenge": "Short next challenge prompt"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = cleanAndParseJSON(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Socratic dialectic error:', error);
    res.status(500).json({ error: error.message || 'Failed to process Socratic debate' });
  }
});

// 4. Text-To-Speech with gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Limit text to avoid exceeding limits
    const trimmedText = text.slice(0, 1000);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style: 'Crisp, engaging educational mentor with natural pacing',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated' });
    }

    res.json({
      success: true,
      audioUrl: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'TTS generation failed' });
  }
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`CogniForge server running on port ${port}`);
  });
}

startServer();
