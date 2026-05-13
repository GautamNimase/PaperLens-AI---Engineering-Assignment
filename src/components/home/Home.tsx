"use client";

import { FileUpload } from "@/components/home/FileUpload";
import { Button } from "@/components/ui/shared/Button";
import { Card } from "@/components/ui/shared/Card";
import { Input } from "@/components/ui/shared/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shared/Tabs";

import { Textarea } from "@/components/ui/shared/Textarea";

import {
  FileText,
  Globe,
  Sparkles,
  Upload,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";

export type InputType = "text" | "pdf" | "url";

export function Home() {

  const router = useRouter();

  const [title, setTitle] = useState("");

  const [inputType, setInputType] =
    useState<InputType>("text");

  const [content, setContent] = useState("");

  const [sourceUrl, setSourceUrl] =
    useState("");

  /**
   * Store REAL uploaded file
   */
  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /**
   * Validate form before submit
   */
  const canSubmit = useMemo(() => {

    if (!title.trim()) {
      return false;
    }

    if (inputType === "text") {
      return content.trim().length >= 50;
    }

    if (inputType === "pdf") {
      return !!pdfFile;
    }

    if (inputType === "url") {
      return sourceUrl.trim().length > 0;
    }

    return false;

  }, [
    title,
    inputType,
    content,
    pdfFile,
    sourceUrl,
  ]);

  /**
   * Analyze paper
   */
  async function onAnalyze() {

    setError(null);

    setLoading(true);

    try {

      /**
       * PDF upload flow
       */
      if (inputType === "pdf") {

        if (!pdfFile) {
          throw new Error("Please upload a PDF file.");
        }

        const formData = new FormData();

        formData.append("title", title.trim());

        formData.append("inputType", inputType);

        formData.append("file", pdfFile);

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data?.error ?? "Analyze failed"
          );
        }

        router.push(`/processing/${data.id}`);

        return;
      }

      /**
       * Text + URL flow
       */
      const payload = {
        title: title.trim(),
        inputType,
        content:
          inputType === "text"
            ? content
            : undefined,

        sourceUrl:
          inputType === "url"
            ? sourceUrl
            : undefined,
      };

      const res = await fetch("/api/analyze", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ?? "Analyze failed"
        );
      }

      router.push(`/processing/${data.id}`);

    } catch (e) {

      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-slate-900 text-slate-100">

      <div className="mx-auto max-w-6xl px-4 py-10">

        {/* Navbar */}
        <div className="mb-10 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/10">

              <Sparkles className="h-5 w-5 text-indigo-200" />

            </div>

            <div>
              <div className="text-sm font-medium text-slate-200">
                PaperLens AI
              </div>

              <div className="text-xs text-slate-400">
                Understand research visually
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            AI SaaS MVP
          </div>
        </div>

        {/* Hero */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">

          {/* Left Section */}
          <div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">

              Understand Research Papers
              Visually with AI

            </h1>

            <p className="mt-4 text-slate-300">

              Transform complex research papers
              into summaries, mind maps,
              learning cards, and beginner-friendly explanations.

            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">

              {[
                {
                  label: "Summaries",
                  icon: <FileText className="h-4 w-4" />,
                },

                {
                  label: "Mind Map",
                  icon: <Upload className="h-4 w-4" />,
                },

                {
                  label: "Math Explained",
                  icon: <Sparkles className="h-4 w-4" />,
                },

                {
                  label: "Learning Cards",
                  icon: <Globe className="h-4 w-4" />,
                },

              ].map((x) => (

                <Card
                  key={x.label}
                  className="p-3 bg-white/5 ring-1 ring-white/10"
                >

                  <div className="flex items-center gap-2 text-sm text-slate-200">

                    <span className="text-indigo-200">
                      {x.icon}
                    </span>

                    {x.label}

                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <Card className="overflow-hidden bg-white/5 ring-1 ring-white/10">

            <div className="p-6">

              <div className="mb-4">

                <div className="text-sm font-medium text-slate-200">
                  Add paper
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  Paste text, upload PDF, or provide a URL.
                </div>

              </div>

              <div className="space-y-3">

                <label className="text-xs font-medium text-slate-300">
                  Paper title
                </label>

                <Input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="e.g., Attention Is All You Need"
                />

                <Tabs
                  value={inputType}
                  onValueChange={(v) =>
                    setInputType(v as InputType)
                  }
                >

                  <TabsList className="grid w-full grid-cols-3 bg-white/5">

                    <TabsTrigger value="text">
                      Text
                    </TabsTrigger>

                    <TabsTrigger value="pdf">
                      PDF
                    </TabsTrigger>

                    <TabsTrigger value="url">
                      URL
                    </TabsTrigger>

                  </TabsList>

                  {/* TEXT TAB */}
                  <TabsContent value="text">

                    <div className="mt-3 space-y-3">

                      <label className="text-xs font-medium text-slate-300">
                        Paste paper content
                      </label>

                      <Textarea
                        value={content}
                        onChange={(e) =>
                          setContent(e.target.value)
                        }
                        rows={10}
                        placeholder="Paste the main paper text here..."
                      />

                      <div className="text-[11px] text-slate-400">
                        Tip: paste at least ~50 characters.
                      </div>

                    </div>
                  </TabsContent>

                  {/* PDF TAB */}
                  <TabsContent value="pdf">

                    <div className="mt-3">

                      <label className="text-xs font-medium text-slate-300">
                        Upload PDF
                      </label>

                      <div className="mt-2">

                        <FileUpload
                          onFileSelect={(file) =>
                            setPdfFile(file)
                          }
                        />

                      </div>

                      {pdfFile ? (

                        <div className="mt-2 text-xs text-green-300">
                          PDF selected: {pdfFile.name}
                        </div>

                      ) : (

                        <div className="mt-2 text-xs text-slate-400">
                          Drag-and-drop a research PDF.
                        </div>

                      )}
                    </div>
                  </TabsContent>

                  {/* URL TAB */}
                  <TabsContent value="url">

                    <div className="mt-3 space-y-3">

                      <label className="text-xs font-medium text-slate-300">
                        Paper URL
                      </label>

                      <Input
                        value={sourceUrl}
                        onChange={(e) =>
                          setSourceUrl(e.target.value)
                        }
                        placeholder="https://arxiv.org/abs/..."
                      />

                    </div>
                  </TabsContent>
                </Tabs>

                {error ? (

                  <div className="rounded-lg bg-red-500/15 p-3 text-sm text-red-200 ring-1 ring-red-500/30">

                    {error}

                  </div>

                ) : null}

                <Button
                  className="w-full"
                  disabled={!canSubmit || loading}
                  onClick={onAnalyze}
                >

                  {loading
                    ? "Analyzing..."
                    : "Analyze Paper"}

                </Button>

                <div className="text-[11px] text-slate-400">

                  This runs AI analysis asynchronously
                  and redirects to the result page.

                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}