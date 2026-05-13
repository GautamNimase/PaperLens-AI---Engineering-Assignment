import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Next.js 16 route params are async
 */
type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _req: Request,
  context: RouteContext
) {

  try {

    /**
     * Await params in Next.js 16
     */
    const { id } = await context.params;

    if (!id) {

      return NextResponse.json(
        {
          error: "Missing id",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Find paper in database
     */
    const paper = await prisma.paper.findUnique({
      where: {
        id,
      },
    });

    if (!paper) {

      return NextResponse.json(
        {
          error: "Not found",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * Return paper status
     */
    return NextResponse.json({
      status: paper.status,
      error: paper.error ?? undefined,
    });

  } catch (err) {

    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch status";

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