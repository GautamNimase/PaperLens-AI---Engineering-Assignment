"use client";

import { Card } from "@/components/ui/shared/Card";
import { Link2 } from "lucide-react";
import { useMemo } from "react";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

/**
 * Configure PDF.js worker
 * Required for Next.js + react-pdf
 */
pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfPreview({
  pdfUrl,
  sourceUrl,
}: {
  pdfUrl: string | null;
  sourceUrl: string | null;
}) {
  const showPdf = !!pdfUrl;

  const showUrl = !showPdf && !!sourceUrl;

  const fileProps = useMemo(() => {
    if (!pdfUrl) return null;

    return {
      file: pdfUrl as string,
    };
  }, [pdfUrl]);

  return (
    <Card className="overflow-hidden bg-white/5 p-6 ring-1 ring-white/10">
      {showPdf ? (
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
            <span className="text-indigo-200">
              PDF Preview
            </span>
          </div>

          <div className="mt-3 rounded-xl bg-slate-950/50 p-3 ring-1 ring-white/10">
            <Document
              file={fileProps?.file ?? ""}
              loading={
                <div className="text-xs text-slate-400">
                  Loading first page…
                </div>
              }
              error={
                <div className="text-xs text-red-200">
                  Failed to load PDF preview.
                </div>
              }
              noData={
                <div className="text-xs text-slate-400">
                  No PDF available.
                </div>
              }
            >
              <Page
                pageNumber={1}
                width={520}
              />
            </Document>
          </div>
        </div>
      ) : showUrl ? (
        <div>
          <div className="text-sm font-medium text-indigo-100">
            Source link
          </div>

          <div className="mt-3 rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Link2 className="h-4 w-4 text-indigo-200" />

              <a
                className="underline underline-offset-4"
                href={sourceUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
              >
                {sourceUrl}
              </a>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              PDF preview not available for URL inputs
              (MVP).
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm font-medium text-indigo-100">
            Paper preview
          </div>

          <div className="mt-3 rounded-xl bg-slate-950/50 p-4 ring-1 ring-white/10">
            <div className="text-sm text-slate-300">
              No PDF or source URL provided.
            </div>

            <div className="mt-1 text-xs text-slate-400">
              Upload a PDF to see a first-page
              preview.
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}