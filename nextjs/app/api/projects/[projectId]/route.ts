import { db } from "@/db";
import { projectsTable } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(1),
});

type RouteParams = {
  params: {
    projectId: string;
  };
};

export async function PATCH(request: NextRequest, context: RouteParams) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validatedData = updateProjectSchema.safeParse(body);

  if (!validatedData.success) {
    return NextResponse.json(
      { error: validatedData.error.errors },
      { status: 400 }
    );
  }

  const { title } = validatedData.data;

  const updatedProject = await db
    .update(projectsTable)
    .set({ title })
    .where(
      and(
        eq(projectsTable.userId, userId),
        eq(projectsTable.id, context.params.projectId)
      )
    )
    .returning();

  if (updatedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(updatedProject[0]);
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deletedProject = await db
    .delete(projectsTable)
    .where(
      and(
        eq(projectsTable.userId, userId),
        eq(projectsTable.id, context.params.projectId)
      )
    )
    .returning();

  if (deletedProject.length === 0) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(deletedProject[0]);
}
