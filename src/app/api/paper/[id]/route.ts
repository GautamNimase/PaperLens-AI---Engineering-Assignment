import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing id" },
      { status: 400 }
    );
  }

  const paper = await prisma.paper.findUnique({
    where: { id },
  });

  if (!paper) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: paper.id,
    title: paper.title,
    inputType: paper.inputType,
    content: paper.content,
    pdfUrl: paper.pdfUrl,
    sourceUrl: paper.sourceUrl,
    status: paper.status,
    error: paper.error,
    result: paper.result,
    createdAt: paper.createdAt,
  });
}