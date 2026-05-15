"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
import {
    BookOpen,
    HelpCircle,
    Lightbulb,
    Sparkles,
    Target,
} from "lucide-react";

const FALLBACK_QUESTIONS = [
  { icon: Target,      q: "What problem does this paper solve?" },
  { icon: BookOpen,    q: "What is the main idea?" },
  { icon: Lightbulb,   q: "Why does the approach work?" },
  { icon: HelpCircle,  q: "What are the real-world applications?" },
  { icon: Sparkles,    q: "What should you study next?" },
] as const;

const CARD_ACCENTS = [
  "from-indigo-500/10 to-purple-500/5",
  "from-purple-500/10 to-fuchsia-500/5",
  "from-sky-500/10 to-indigo-500/5",
  "from-violet-500/10 to-purple-500/5",
  "from-fuchsia-500/10 to-pink-500/5",
] as const;

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
  const aiCards = summary?.learningCards ?? [];

  const derived = aiCards.length
    ? aiCards
    : FALLBACK_QUESTIONS.map((x, i) => ({
        question: x.q,
        answer:
          i === 0 ? summary?.problemSolved || "Explained in the paper summary."
          : i === 1 ? summary?.oneLineSummary || "Main idea summarized."
          : i === 2 ? summary?.methodUsed || "Method explained."
          : i === 3 ? `Apply to: ${(concepts ?? []).slice(0, 2).join(", ") || "your domain"}.`
          : `Study next: ${(concepts ?? []).slice(0, 3).join(", ") || "foundational concepts"}.`,
      }));

  return (
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<BookOpen className="h-4 w-4" />}
        title="Learning Cards"
        description="Flashcard-style Q&A to reinforce understanding."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {derived.slice(0, 6).map((c, idx) => (
          <div
            key={idx}
            className={`group rounded-2xl bg-gradient-to-br ${CARD_ACCENTS[idx % CARD_ACCENTS.length]} p-px transition-all duration-200 hover:scale-[1.01]`}
          >
            <div className="h-full rounded-2xl bg-[#0d1117] p-4 group-hover:bg-[#111827] transition-colors duration-200">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 mb-2">
                Question
              </p>
              <p className="text-sm font-semibold text-slate-100 leading-snug mb-3">
                {c.question}
              </p>
              <div className="h-px bg-white/[0.06] mb-3" />
              <p className="text-sm text-slate-400 leading-relaxed">
                {c.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
