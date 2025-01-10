import { db } from "@/server/db";
import { generatedContentTable } from "@/server/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const generatedContent = await db
      .select()
      .from(generatedContentTable)
      .where(eq(generatedContentTable.projectId, params.projectId))
      .orderBy(generatedContentTable.order);

    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch generated content" },
      { status: 500 }
    );
  }
}
