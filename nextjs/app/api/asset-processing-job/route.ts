import { db } from "@/db";
import { assetProcessingJobTable } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation for updating asset processing jobs
const updateAssetJobSchema = z.object({
  status: z
    .enum([
      "created",
      "in_progress",
      "failed",
      "completed",
      "max_attempts_exceeded",
    ])
    .optional(),
  errorMessage: z.string().optional(),
  attempts: z.number().optional(),
  lastHeartBeat: z.string().optional(),
});

/**
 * GET /api/asset-processing-job
 * Retrieves all asset processing jobs that are not in a terminal state
 * Used by the worker service to find jobs that need processing
 * No authentication required as this is a secure route protected by middleware
 */
export async function GET() {
  console.log("Fetching asset processing job that are not in a terminal state");

  try {
    // Query jobs that are in non-terminal states (created, failed, or in_progress)
    const availableJobs = await db
      .select()
      .from(assetProcessingJobTable)
      .where(
        inArray(
          assetProcessingJobTable.status,
          // non-terminal states
          ["created", "failed", "in_progress"]
        )
      )
      .execute();

    return NextResponse.json(availableJobs);
  } catch (error) {
    console.error("Error fetching asset processing jobs", error);
    return NextResponse.json(
      { error: "Error fetching asset processing jobs" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/asset-processing-job?jobId={id}
 * Updates the status and metadata of an asset processing job
 * Used by the worker service to update job progress and status
 * No authentication required as this is a secure route protected by middleware
 */
export async function PATCH(request: NextRequest) {
  try {
    // Extract jobId from query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json(
        { error: "Missing jobId parameter" },
        { status: 400 }
      );
    }

    // Validate request body against schema
    const body = await request.json();
    const validationResult = updateAssetJobSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request body",
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { status, errorMessage, attempts, lastHeartBeat } =
      validationResult.data;

    // Update job status and metadata in database
    const updatedJob = await db
      .update(assetProcessingJobTable)
      .set({
        status,
        errorMessage,
        attempts,
        lastHeartBeat: lastHeartBeat ? new Date(lastHeartBeat) : undefined,
      })
      .where(eq(assetProcessingJobTable.id, jobId))
      .returning();

    if (updatedJob.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(updatedJob[0]);
  } catch (error) {
    console.error("Error updating asset processing job", error);
    return NextResponse.json(
      { error: "Error updating asset processing job" },
      { status: 500 }
    );
  }
}
