"use client";

import { ResearchFeed } from "@/components/feed/ResearchFeed";
import { FileUpload } from "@/components/home/FileUpload";
import { Button } from "@/components/ui/shared/Button";
import { GlassCard } from "@/components/ui/shared/GlassCard";
import { Input } from "@/components/ui/shared/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shared/Tabs";
import { Textarea } from "@/components/ui/shared/Textarea";
import {
    ArrowRight,
    BookOpen,
    FileText,
    Globe,
    Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type InputType = "text" | "pdf" | "url";

export function Home() {
  const router = useRouter();

  const [title, setTitle]         = useState("");
  const [inputType, setInputType] = useState<InputType>("text");
  const [content, setContent]     = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [pdfFile, setPdfFile]     = useState<File | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (inputType === "text")  return content.trim().length >= 50;
    if (inputType === "pdf")   return !!pdfFile;
    if (inputType === "url")   return sourceUrl.trim().length > 0;
    return false;
  }, [title, inputType, content, pdfFile, sourceUrl]);

  async function onAnalyze() {
    setError(null);
    setLoading(true);
    try {
      if (inputType === "pdf") {
        if (!pdfFile) throw new Error("Please upload a PDF file.");
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("inputType", inputType);
        formData.append("file", pdfFile);
        const res  = await fetch("/api/analyze", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Analyze failed");
        router.push(`/processing/${data.id}`);
        return;
      }
      const payload = {
        title:     title.trim(),
        inputType,
        content:   inputType === "text" ? content   : undefined,
        sourceUrl: inputType === "url"  ? sourceUrl : undefined,
      };
      const res  = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Analyze failed");
      router.push(`/processing/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#080b14] text-slate-100">

      {/* ── Ambient glows ────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[500px] w-[700px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[500px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              PaperLens <span className="text-indigo-400">AI</span>
            </span>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-400 ring-1 ring-indigo-500/20">
            Beta
          </span>
        </div>
      </header>

      {/* ── Main layout: sidebar + feed ──────────────────────────── */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-8">

          {/* ── LEFT: sticky input panel ─────────────────────────── */}
          <aside className="w-full lg:sticky lg:top-[72px] lg:w-[400px] lg:shrink-0">

            {/* Hero copy */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
                Understand Research
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Papers Visually
                </span>
              </h1>
              <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
                Paste text, upload a PDF, or drop a URL. AI generates summaries,
                mind maps, and learning cards in seconds.
              </p>
            </div>

            {/* Input card */}
            <GlassCard gradient className="p-5">

              {/* Title */}
              <div className="mb-4">
                <label htmlFor="paper-title" className="mb-1.5 block text-xs font-medium text-slate-400">
                  Paper title
                </label>
                <Input
                  id="paper-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Attention Is All You Need"
                  aria-label="Paper title"
                />
              </div>

              {/* Tabs */}
              <Tabs value={inputType} onValueChange={(v) => setInputType(v as InputType)}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="text">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger value="pdf">
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    PDF
                  </TabsTrigger>
                  <TabsTrigger value="url">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <div className="space-y-1.5">
                    <label htmlFor="paper-content" className="block text-xs font-medium text-slate-400">
                      Paste paper content
                    </label>
                    <Textarea
                      id="paper-content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      placeholder="Paste the abstract or full text here…"
                      aria-label="Paper content"
                    />
                    <p className="text-[11px] text-slate-700">
                      {content.length} chars · min 50
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="pdf">
                  <div className="space-y-2.5">
                    <FileUpload onFileSelect={(f) => setPdfFile(f)} />
                    {pdfFile && (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300 ring-1 ring-emerald-500/20">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{pdfFile.name}</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="url">
                  <div className="space-y-1.5">
                    <label htmlFor="paper-url" className="block text-xs font-medium text-slate-400">
                      Paper URL
                    </label>
                    <Input
                      id="paper-url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://arxiv.org/abs/1706.03762"
                      aria-label="Paper URL"
                    />
                    <p className="text-[11px] text-slate-700">
                      arXiv, Semantic Scholar, or direct PDF link
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-3 flex items-start gap-2 rounded-xl bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300 ring-1 ring-red-500/20"
                >
                  <span className="mt-0.5 shrink-0">⚠</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                className="mt-4 w-full py-2.5"
                disabled={!canSubmit || loading}
                onClick={onAnalyze}
                aria-label="Analyze paper"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Analyze Paper
                    <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                  </>
                )}
              </Button>

              <p className="mt-2.5 text-center text-[11px] text-slate-700">
                ~15 seconds · powered by Llama 3.3 70B
              </p>
            </GlassCard>
          </aside>

          {/* ── RIGHT: research feed ─────────────────────────────── */}
          <div className="min-w-0 flex-1">
            <ResearchFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
