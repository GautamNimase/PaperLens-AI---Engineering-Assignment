"use client";

import { Card } from "@/components/ui/shared/Card";
import { BookOpen, HelpCircle, Lightbulb, Sparkles, Target } from "lucide-react";

const QUESTIONS = [
  { icon: Target, q: "What problem does this solve?" },
  { icon: BookOpen, q: "What is the main idea?" },
  { icon: Lightbulb, q: "Why does it work?" },
  { icon: HelpCircle, q: "Applications?" },
  { icon: Sparkles, q: "What to learn next?" },
];

type Summary = {
  problemSolved?: string;
  oneLineSummary?: string;
  methodUsed?: string;
  learningCards?: Array<{ question: string; answer: string }>;
};

export function LearningCards({
  summary,
  concepts,
}: {
  summary: Summary | null | undefined;
  concepts: string[];
}) {
  // Use Gemini-provided cards if available; otherwise generate from summary.
  const cards =
    summary?.learningCards?.length ? summary.learningCards : ([] as Array<{ question: string; answer: string }>);


  const derived = cards.length
    ? cards
    : QUESTIONS.map((x, i) => ({
        question: x.q,
        answer:
          i === 0
            ? summary?.problemSolved || "Explained in the paper summary."
            : i === 1
              ? summary?.oneLineSummary || "Main idea summarized."
              : i === 2
                ? summary?.methodUsed || "Method explained."
                : i === 3
                  ? `You can apply this to topics related to: ${(concepts ?? []).slice(0, 2).join(", ") || "your domain"}.`
                  : `Next, study: ${(concepts ?? []).slice(0, 3).join(", ") || "foundational concepts"}.`,
      }));

  return (
    <Card className="bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-sm font-medium text-indigo-100">Learning cards</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(derived ?? []).slice(0, 5).map((c, idx) => (
          <div key={idx} className="rounded-2xl bg-slate-950/50 p-4 ring-1 ring-white/10">
            <div className="text-xs text-slate-400">Question</div>
            <div className="mt-2 text-sm font-medium text-slate-100">{c.question}</div>
            <div className="mt-3 text-sm text-slate-300">{c.answer}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

