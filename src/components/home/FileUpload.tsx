"use client";

import { UploadCloud } from "lucide-react";
import React, { useCallback, useState } from "react";

type FileUploadProps = {
  onFileSelect: (file: File) => void;
};

export function FileUpload({
  onFileSelect,
}: FileUploadProps) {

  const [dragOver, setDragOver] = useState(false);


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

    if (!file) return;

    handleFile(file);
  },
  [handleFile]
);

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-dashed p-6 transition ${
        dragOver
          ? "border-indigo-400/60 bg-indigo-500/10"
          : "border-white/15 bg-white/5"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >

      <div className="text-center">

        <UploadCloud className="mx-auto h-7 w-7 text-indigo-200" />

        <div className="mt-2 text-sm text-slate-200">
          Drag & drop PDF here
        </div>

        <div className="mt-1 text-xs text-slate-400">
          Upload a research paper PDF
        </div>

        <div className="mt-3">

          <label className="inline-flex cursor-pointer items-center rounded-lg bg-white/10 px-3 py-2 text-xs text-slate-100 ring-1 ring-white/10 hover:bg-white/15">

            Choose file

            <input
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                handleFile(file);
              }}
            />
          </label>

        </div>
      </div>
    </div>
  );
}