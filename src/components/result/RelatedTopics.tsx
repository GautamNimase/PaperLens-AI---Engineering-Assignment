"use client";

import { Card } from "@/components/ui/shared/Card";

function buildSearchUrl(q: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}

export function RelatedTopics({ relatedTopics }: { relatedTopics: string[] }) {
  return (
    <Card className="bg-white/5 p-6 ring-1 ring-white/10">
      <div className="text-sm font-medium text-indigo-100">Related topics</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(relatedTopics ?? []).length ? (
          (relatedTopics ?? []).map((t, i) => (
            <a
              key={`${t}-${i}`}
              href={buildSearchUrl(t)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-2 text-xs text-slate-100 ring-1 ring-white/10 hover:brightness-110 transition"
            >
              {t}
            </a>
          ))
        ) : (
          <div className="text-sm text-slate-300">No related topics found.</div>
        )}
      </div>
    </Card>
  );
}

