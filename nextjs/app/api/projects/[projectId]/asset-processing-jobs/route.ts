import { db } from "@/server/db";
import { assetProcessingJobTable } from "@/server/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

/**
 * GET /api/projects/[projectId]/asset-processing-jobs
 * Retrieves all asset processing jobs for a specific project
 * Requires user authentication via Clerk
 * Uses Drizzle ORM for database operations
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params;

    // Verify user authentication using Clerk
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query all asset processing jobs for the specified project using Drizzle ORM
    const assetProcessingJobs = await db
      .select()
      .from(assetProcessingJobTable)
      .where(eq(assetProcessingJobTable.projectId, projectId))
      .execute();

    return NextResponse.json(assetProcessingJobs);
  } catch (error) {
    console.error("Failed to fetch asset processing jobs", error);
    return NextResponse.json(
      { error: "Failed to fetch asset processing jobs" },
      { status: 500 }
    );
  }
}
