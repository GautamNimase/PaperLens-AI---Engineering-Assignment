import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/papers
 * Returns the 20 most recently analyzed (completed) papers for the feed.
 */
export async function GET() {
  try {
    const papers = await prisma.paper.findMany({
      where: { status: "completed" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        inputType: true,
        pdfUrl: true,
        sourceUrl: true,
        status: true,
        createdAt: true,
        // Pull only the summary slice from the JSON result
        result: true,
      },
    });

    return NextResponse.json({ papers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch papers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
