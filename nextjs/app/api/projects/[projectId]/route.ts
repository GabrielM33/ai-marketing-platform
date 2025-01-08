import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema validation for project updates
const updateProjectSchema = z.object({
  title: z.string().min(1),
});

/**
 * PATCH /api/projects/[projectId]
 * Updates a project's title
 * Requires user authentication via Clerk
 * Validates input using Zod schema
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  // Verify user authentication using Clerk
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse and validate request body
  const body = await request.json();
  const validatedData = updateProjectSchema.safeParse(body);

  if (!validatedData.success) {
    return NextResponse.json(
      { error: validatedData.error.errors },
      { status: 400 }
    );
  }

  const { title } = validatedData.data;

  // Update project title in database, ensuring user owns the project
  const updatedProject = await db
    .update(projectsTable)
    .set({ title })
    .where(
      and(
        eq(projectsTable.userId, userId),
        eq(projectsTable.id, params.projectId)
      )
    )
    .returning();

  if (updatedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(updatedProject[0]);
}

/**
 * DELETE /api/projects/[projectId]
 * Deletes a specific project
 * Requires user authentication via Clerk
 * Only allows deletion if user owns the project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  // Verify user authentication using Clerk
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete project from database, ensuring user owns the project
  const deletedProject = await db
    .delete(projectsTable)
    .where(
      and(
        eq(projectsTable.userId, userId),
        eq(projectsTable.id, params.projectId)
      )
    )
    .returning();

  if (deletedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(deletedProject[0]);
}
