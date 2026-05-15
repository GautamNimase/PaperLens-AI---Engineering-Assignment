"use client";

import { UploadCloud } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
};

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.includes("pdf")) {
        alert("Please upload a PDF file.");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload PDF file"
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ease-out ${
        dragOver
          ? "border-indigo-400/60 bg-indigo-500/10 scale-[1.01]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
        dragOver ? "bg-indigo-500/20 ring-1 ring-indigo-500/30" : "bg-white/5 ring-1 ring-white/10"
      }`}>
        <UploadCloud className={`h-5 w-5 transition-colors duration-200 ${dragOver ? "text-indigo-300" : "text-slate-400"}`} />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-200">
          Drop your PDF here
        </p>
        <p className="mt-1 text-xs text-slate-500">
          or{" "}
          <span className="text-indigo-400 underline underline-offset-2">
            browse files
          </span>
        </p>
      </div>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="application/pdf"
        aria-label="PDF file input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
