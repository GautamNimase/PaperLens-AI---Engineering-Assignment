import OpenAI from "openai";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PaperAnalysisResult = {
  summary: {
    title: string;
    category: string;
    difficulty: string;
    oneLineSummary: string;
    problemSolved: string;
    methodUsed: string;
  };

  concepts: string[];

  math: {
    equation: string;
    meaning: string;

    symbols: {
      symbol: string;
      meaning: string;
    }[];

    steps: string[];

    simpleExplanation: string;
  };

  mindmap: {
    nodes: Array<{
      id: string;
      data: {
        label: string;
      };
      position?: {
        x: number;
        y: number;
      };
    }>;

    edges: Array<{
      id: string;
      source: string;
      target: string;
    }>;
  };

  learningCards: Array<{
    question: string;
    answer: string;
  }>;

  relatedTopics: string[];
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL = "llama-3.3-70b-versatile";

const TIMEOUT_MS = 30_000;

/**
 * Required top-level keys — used to validate the model response.
 */
const REQUIRED_KEYS = [
  "summary",
  "concepts",
  "math",
  "mindmap",
  "learningCards",
  "relatedTopics",
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip markdown code fences that LLMs sometimes wrap JSON in.
 *
 * Handles:
 *   ```json\n{...}\n```
 *   ```\n{...}\n```
 *   plain {...}
 */
function safeJsonParse(text: string): unknown {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Analyze a research paper with Groq (llama-3.3-70b-versatile).
 *
 * Uses the OpenAI-compatible SDK pointed at Groq's base URL.
 * Returns a validated, typed PaperAnalysisResult.
 */
export async function callGroqAnalyze(input: {
  title: string;
  inputType: string;
  content: string | null;
  pdfUrl: string | null;
  sourceUrl: string | null;
}): Promise<PaperAnalysisResult> {

  // ── API key ──────────────────────────────────────────────────────────────
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing from environment variables");
  }

  // ── Client ───────────────────────────────────────────────────────────────
  const client = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
    timeout: TIMEOUT_MS,
  });

  // ── Input ────────────────────────────────────────────────────────────────
  // Cap content to keep token usage reasonable on free tier
  const paperText = input.content ? input.content.slice(0, 12_000) : "";

  // ── Prompt ───────────────────────────────────────────────────────────────
  const userPrompt = `
You are PaperLens AI.

Analyze the research paper below and return ONLY valid strict JSON.
No markdown. No explanation. No code fences. Just raw JSON.

Return this exact schema (fill every field):

{
  "summary": {
    "title": "",
    "category": "",
    "difficulty": "",
    "oneLineSummary": "",
    "problemSolved": "",
    "methodUsed": ""
  },
  "concepts": [""],
  "math": {
    "equation": "",
    "meaning": "",
    "symbols": [{ "symbol": "", "meaning": "" }],
    "steps": [""],
    "simpleExplanation": ""
  },
  "mindmap": {
    "nodes": [],
    "edges": []
  },
  "learningCards": [{ "question": "", "answer": "" }],
  "relatedTopics": [""]
}

Mindmap rules:
- One center node with id "center"
- 5–10 concept nodes, each: { "id": "", "data": { "label": "" } }
- Connect every concept node to the center node via edges

Paper Information:
Title: ${input.title}
Input Type: ${input.inputType}
Source URL: ${input.sourceUrl ?? ""}
PDF URL: ${input.pdfUrl ?? ""}

Paper Content:
${paperText}

Now output the JSON.
`.trim();

  // ── Call Groq ─────────────────────────────────────────────────────────────
  const completion = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,       // low temperature → more deterministic JSON
    max_tokens: 4096,
    response_format: { type: "json_object" }, // enforce JSON mode
    messages: [
      {
        role: "system",
        content:
          "You are PaperLens AI. You always respond with valid JSON only. No markdown, no prose.",
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  // ── Extract text ──────────────────────────────────────────────────────────
  const rawText = completion.choices[0]?.message?.content;

  if (!rawText) {
    throw new Error("Groq returned an empty response");
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let parsed: unknown;

  try {
    parsed = safeJsonParse(rawText);
  } catch {
    throw new Error(`Failed to parse Groq JSON response: ${rawText.slice(0, 200)}`);
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Groq response is not a JSON object");
  }

  // ── Validate required keys ────────────────────────────────────────────────
  for (const key of REQUIRED_KEYS) {
    if (!(key in parsed)) {
      throw new Error(`Groq JSON response is missing required key: "${key}"`);
    }
  }

  return parsed as PaperAnalysisResult;
}
