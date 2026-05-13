import { callGroqAnalyze } from "@/lib/groq";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

/**
 * Tell Next.js this route can run up to 60 s.
 * Without this, Vercel/Next serverless cuts it at 10 s.
 */
export const maxDuration = 60;

/**
 * How long we wait for the background Groq task before
 * force-writing a "failed" status to the DB (ms).
 */
const BACKGROUND_TIMEOUT_MS = 55_000;

export async function POST(req: NextRequest) {

  try {

    const contentType = req.headers.get("content-type") ?? "";

    let title = "";

    let inputType: "text" | "pdf" | "url" = "text";

    let content: string | null = null;

    let sourceUrl: string | null = null;

    let file: unknown = null;

    // JSON body (Home.tsx uses JSON for text/url)
    if (contentType.includes("application/json")) {

      const body = await req.json();

      title =
        typeof body?.title === "string" ? body.title.trim() : "";

      inputType =
        body?.inputType === "pdf" ||
        body?.inputType === "url" ||
        body?.inputType === "text"
          ? body.inputType
          : "text";

      content =
        typeof body?.content === "string" ? body.content : null;

      sourceUrl =
        typeof body?.sourceUrl === "string" ? body.sourceUrl : null;

    } else {

      // Multipart form data (Home.tsx uses multipart for PDF)
      const formData = await req.formData();

      title =
        typeof formData.get("title") === "string"
          ? String(formData.get("title")).trim()
          : "";

      inputType =
        typeof formData.get("inputType") === "string"
          ? (String(formData.get("inputType")) as "text" | "pdf" | "url")
          : "text";

      content =
        typeof formData.get("content") === "string"
          ? String(formData.get("content"))
          : null;

      sourceUrl =
        typeof formData.get("sourceUrl") === "string"
          ? String(formData.get("sourceUrl"))
          : null;

      file = formData.get("file");
    }


    /**
     * Validation
     */
    if (!title) {

      return NextResponse.json(
        {
          error: "Title is required.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * TEXT validation
     */
    if (
      inputType === "text" &&
      (!content || content.length < 50)
    ) {

      return NextResponse.json(
        {
          error:
            "Please paste at least 50 characters of paper text.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * PDF validation
     */
    if (inputType === "pdf") {

      if (!(file instanceof File)) {

        return NextResponse.json(
          {
            error: "Please upload a PDF file.",
          },
          {
            status: 400,
          }
        );
      }

      if (!file.type.includes("pdf")) {

        return NextResponse.json(
          {
            error: "Uploaded file must be a PDF.",
          },
          {
            status: 400,
          }
        );
      }
    }

    /**
     * URL validation
     */
    if (
      inputType === "url" &&
      !sourceUrl
    ) {

      return NextResponse.json(
        {
          error: "URL input requires sourceUrl.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * For MVP:
     * Store uploaded file name only.
     *
     * In production:
     * upload to S3 / Cloudinary / storage.
     */
    let pdfUrl: string | null = null;

    if (
      inputType === "pdf" &&
      file instanceof File
    ) {

      pdfUrl = file.name;
    }

    /**
     * Save paper
     */
    const paper = await prisma.paper.create({

      data: {
        title,

        inputType,

        content: content ?? undefined,

        pdfUrl: pdfUrl ?? undefined,

        sourceUrl: sourceUrl ?? undefined,

        status: "processing",
      },

      select: {
        id: true,
      },
    });

    /**
     * Background AI processing.
     *
     * We wrap the whole task in a race against BACKGROUND_TIMEOUT_MS
     * so the DB is always updated — even if Gemini hangs or the
     * serverless function is about to be killed.
     */
    void (async () => {

      const timeoutHandle = setTimeout(async () => {
        await prisma.paper.update({
          where: { id: paper.id },
          data: {
            status: "failed",
            error: "Analysis timed out. Please try again.",
          },
        });
      }, BACKGROUND_TIMEOUT_MS);

      try {

        const result =
          await callGroqAnalyze({
            title,
            inputType,
            content,
            pdfUrl,
            sourceUrl,
          });

        clearTimeout(timeoutHandle);

        await prisma.paper.update({
          where: { id: paper.id },
          data: {
            status: "completed",
            result,
            error: null,
          },
        });

      } catch (err) {

        clearTimeout(timeoutHandle);

        const message =
          err instanceof Error
            ? err.message
            : "Groq analysis failed";

        await prisma.paper.update({
          where: { id: paper.id },
          data: {
            status: "failed",
            error: message,
          },
        });
      }
    })();

    /**
     * Success response
     */
    return NextResponse.json({
      id: paper.id,
    });

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Analyze failed";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}