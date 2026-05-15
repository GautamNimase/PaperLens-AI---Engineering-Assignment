"use client";

import { GlassCard } from "@/components/ui/shared/GlassCard";
import { SectionHeader } from "@/components/ui/shared/SectionHeader";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Download,
  FileText,
  Link2,
} from "lucide-react";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

/* ── Types ──────────────────────────────────────────────────────────── */
type PdfState = "loading" | "loaded" | "error";

/* ── Download button ────────────────────────────────────────────────── */
function DownloadButton({
  href,
  filename,
  disabled = false,
}: {
  href: string;
  filename: string;
  disabled?: boolean;
}) {
  const [state, setState] = useState<"idle" | "downloading" | "unavailable">("idle");

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (disabled) {
        e.preventDefault();
        setState("unavailable");
        setTimeout(() => setState("idle"), 2500);
        return;
      }
      setState("downloading");
      setTimeout(() => setState("idle"), 2000);
    },
    [disabled]
  );

  const label =
    state === "downloading"  ? "Downloading…"
    : state === "unavailable" ? "File not stored on server"
    : "Download Original PDF";

  const icon =
    state === "downloading"  ? <CheckCircle2 className="h-4 w-4 shrink-0" />
    : state === "unavailable" ? <AlertTriangle className="h-4 w-4 shrink-0" />
    : <Download className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />;

  const colorClass =
    state === "downloading"
      ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/10"
      : state === "unavailable"
      ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/25"
      : disabled
      ? "bg-white/[0.06] text-slate-400 ring-1 ring-white/[0.08] cursor-not-allowed"
      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:brightness-110 hover:-translate-y-px active:scale-[0.98]";

  return (
    <a
      href={disabled ? "#" : href}
      download={disabled ? undefined : filename}
      onClick={handleClick}
      aria-label={`Download ${filename}`}
      aria-disabled={disabled}
      className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-out ${colorClass}`}
    >
      {icon}
      {label}
    </a>
  );
}

/* ── Metadata row ───────────────────────────────────────────────────── */
function MetaRow({
  filename,
  isHostedUrl,
}: {
  filename: string;
  isHostedUrl: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filename chip */}
      <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 ring-1 ring-white/[0.07]">
        <FileText className="h-3 w-3 shrink-0 text-slate-500" />
        <span className="max-w-[220px] truncate font-mono text-[11px] text-slate-400">
          {filename}
        </span>
      </div>

      {/* File type badge */}
      <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-indigo-500/20">
        PDF
      </span>

      {/* Analysis status */}
      <div className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 ring-1 ring-emerald-500/20">
        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] font-semibold text-emerald-400">
          Analyzed
        </span>
      </div>

      {/* Hosted indicator */}
      {!isHostedUrl && (
        <span className="rounded-md bg-slate-500/10 px-2 py-1 text-[10px] text-slate-600 ring-1 ring-slate-500/15">
          Local upload
        </span>
      )}
    </div>
  );
}

/* ── Fallback when PDF cannot be rendered in-browser ───────────────── */
function PdfFallback({
  filename,
  isHostedUrl,
}: {
  filename: string;
  isHostedUrl: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#0a0d16] ring-1 ring-white/[0.06]">
      {/* Top: decorative document illustration */}
      <div className="relative flex items-center justify-center border-b border-white/[0.05] bg-[#080b14] px-6 py-10">
        {/* Subtle grid backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_65%)]"
        />

        {/* Document icon stack */}
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative">
            {/* Shadow doc behind */}
            <div className="absolute -bottom-1 -right-1 h-14 w-11 rounded-lg bg-indigo-500/10 ring-1 ring-indigo-500/15" />
            {/* Main doc */}
            <div className="relative flex h-14 w-11 flex-col items-center justify-center rounded-lg bg-[#111827] ring-1 ring-white/[0.12] shadow-xl shadow-black/40">
              <FileText className="h-5 w-5 text-indigo-400" />
              {/* Page lines */}
              <div className="mt-1.5 space-y-1 px-2 w-full">
                <div className="h-px w-full rounded-full bg-white/10" />
                <div className="h-px w-3/4 rounded-full bg-white/8" />
                <div className="h-px w-1/2 rounded-full bg-white/6" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-200">
              In-browser preview not available
            </p>
            <p className="mt-1.5 max-w-[280px] text-xs leading-relaxed text-slate-500">
              Uploaded files aren&apos;t stored on a server in this build, so
              the preview can&apos;t be rendered here. Your paper was read and
              analyzed in full — everything above reflects the actual content.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: metadata + download — always shown */}
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <MetaRow filename={filename} isHostedUrl={isHostedUrl} />
        <DownloadButton
          href={isHostedUrl ? filename : "#"}
          filename={filename}
          disabled={!isHostedUrl}
        />
      </div>
    </div>
  );
}

/* ── Loaded PDF viewer ──────────────────────────────────────────────── */
function PdfViewer({
  pdfUrl,
  filename,
  onError,
}: {
  pdfUrl: string;
  filename: string;
  onError: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl bg-[#080b14] ring-1 ring-white/[0.07]">
      {/* Loading state */}
      {!loaded && (
        <div className="flex h-52 items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-700 border-t-slate-500" />
            Loading preview…
          </div>
        </div>
      )}

      {/* react-pdf */}
      <div className={loaded ? "block" : "hidden"}>
        <Document
          file={pdfUrl}
          onLoadSuccess={() => setLoaded(true)}
          onLoadError={onError}
          loading={null}
          error={null}
          noData={null}
        >
          <Page
            pageNumber={1}
            width={560}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            onRenderError={onError}
          />
        </Document>
      </div>

      {/* Metadata + download bar below the preview */}
      {loaded && (
        <div className="flex flex-col gap-3 border-t border-white/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <MetaRow filename={filename} isHostedUrl />
          <DownloadButton href={pdfUrl} filename={filename} />
        </div>
      )}
    </div>
  );
}

/* ── Main export ────────────────────────────────────────────────────── */
export function PdfPreview({
  pdfUrl,
  sourceUrl,
}: {
  pdfUrl: string | null;
  sourceUrl: string | null;
}) {
  const showPdf = !!pdfUrl;
  const showUrl = !showPdf && !!sourceUrl;

  const [pdfState, setPdfState] = useState<PdfState>("loading");

  /* Extract bare filename from whatever pdfUrl contains */
  const filename = useMemo(() => {
    if (!pdfUrl) return "";
    return pdfUrl.split(/[\\/]/).pop() ?? pdfUrl;
  }, [pdfUrl]);

  /*
   * In this MVP, pdfUrl stores only the original filename (e.g. "paper.pdf"),
   * not a hosted URL. Detect this so we can skip react-pdf entirely and show
   * the fallback without triggering an InvalidPDFException.
   */
  const isHostedUrl = useMemo(() => {
    if (!pdfUrl) return false;
    try {
      const u = new URL(pdfUrl);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch {
      return false;
    }
  }, [pdfUrl]);

  if (!showPdf && !showUrl) return null;

  return (
    <GlassCard className="p-6 animate-fade-up">
      <SectionHeader
        icon={<FileText className="h-4 w-4" />}
        title={showPdf ? "Document" : "Source"}
        description={
          showPdf
            ? "Original paper file and analysis status."
            : "Source URL provided for this paper."
        }
      />

      {/* ── PDF branch ──────────────────────────────────────────── */}
      {showPdf && (
        <>
          {!isHostedUrl ? (
            /* Local filename — skip react-pdf, show premium fallback */
            <PdfFallback filename={filename} isHostedUrl={false} />
          ) : pdfState === "error" ? (
            /* Hosted URL but PDF failed to parse */
            <PdfFallback filename={filename} isHostedUrl />
          ) : (
            /* Hosted URL — attempt real preview */
            <PdfViewer
              pdfUrl={pdfUrl!}
              filename={filename}
              onError={() => setPdfState("error")}
            />
          )}
        </>
      )}

      {/* ── URL branch ──────────────────────────────────────────── */}
      {showUrl && (
        <div className="overflow-hidden rounded-xl bg-[#0a0d16] ring-1 ring-white/[0.06]">
          <a
            href={sourceUrl ?? "#"}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between px-4 py-3.5 transition-all duration-200 hover:bg-white/[0.03]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 ring-1 ring-indigo-500/20">
                <Link2 className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">
                  Source URL
                </p>
                <span className="truncate text-sm text-slate-300 group-hover:text-white transition-colors duration-200 block">
                  {sourceUrl}
                </span>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-indigo-400 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ml-3" />
          </a>

          {/* Metadata row for URL papers */}
          <div className="border-t border-white/[0.05] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-indigo-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-400 ring-1 ring-indigo-500/20">
                URL
              </span>
              <div className="flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                <span className="text-[10px] font-semibold text-emerald-400">
                  Analyzed
                </span>
              </div>
              <span className="text-[11px] text-slate-700">
                PDF preview not available for URL inputs
              </span>
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
