import { GoogleGenerativeAI } from "@google/generative-ai";

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

/**
 * Required top-level keys
 */
const REQUIRED_KEYS = [
  "summary",
  "concepts",
  "math",
  "mindmap",
  "learningCards",
  "relatedTopics",
] as const;

/**
 * Gemini sometimes returns:
 *
 * ```json
 * {...}
 * ```
 *
 * This removes markdown wrappers safely.
 */
function safeJsonParse(text: string) {

  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  return JSON.parse(cleaned);
}

/**
 * Analyze research paper with Gemini
 */
export async function callGeminiAnalyze(input: {
  title: string;
  inputType: string;
  content: string | null;
  pdfUrl: string | null;
  sourceUrl: string | null;
}): Promise<PaperAnalysisResult> {

  /**
   * Load API key from .env
   */
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  /**
   * Initialize Gemini SDK
   */
  const genAI = new GoogleGenerativeAI(apiKey);

  /**
   * Gemini 2.0 Flash — stable, fast, free-tier supported
   *
   * OLD BROKEN:
   * gemini-1.5-flash  (removed from v1beta API)
   */
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  /**
   * Current MVP:
   * Only analyze pasted text.
   *
   * PDF extraction not added yet.
   */
  const paperText = input.content
    ? input.content.slice(0, 12000)
    : "";

  /**
   * AI prompt
   */
  const prompt = `
You are PaperLens AI.

Analyze the research paper and return ONLY valid STRICT JSON.

Return this exact schema:

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
    "symbols": [
      {
        "symbol": "",
        "meaning": ""
      }
    ],
    "steps": [""],
    "simpleExplanation": ""
  },

  "mindmap": {
    "nodes": [],
    "edges": []
  },

  "learningCards": [
    {
      "question": "",
      "answer": ""
    }
  ],

  "relatedTopics": [""]
}

Rules:

- Return ONLY JSON
- No markdown
- No explanation text
- No code fences

Mindmap rules:

- Include one center node
- center node id must be "center"
- Add 5-10 concept nodes
- Each node needs:
  {
    "id": "",
    "data": {
      "label": ""
    }
  }

- Connect concept nodes to center node

Paper Information:

Title:
${input.title}

Input Type:
${input.inputType}

Source URL:
${input.sourceUrl ?? ""}

PDF URL:
${input.pdfUrl ?? ""}

Paper Content:
${paperText}

Now generate the JSON.
`;

  /**
   * Generate AI response with a 30-second timeout.
   * Gemini free-tier can be slow — without a timeout the
   * background task hangs silently and the DB stays "processing".
   */
  const TIMEOUT_MS = 30_000;

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error("Gemini request timed out after 30 s")),
      TIMEOUT_MS
    )
  );

  const resp = await Promise.race([
    model.generateContent(prompt),
    timeoutPromise,
  ]);

  /**
   * Extract text
   */
  const text = resp.response.text();

  /**
   * Parse JSON safely
   */
  const parsed = safeJsonParse(text);

  /**
   * Validate required keys
   */
  for (const key of REQUIRED_KEYS) {

    if (!(key in parsed)) {

      throw new Error(
        `Gemini JSON missing key: ${key}`
      );
    }
  }

  /**
   * Return validated result
   */
  return parsed as PaperAnalysisResult;
}