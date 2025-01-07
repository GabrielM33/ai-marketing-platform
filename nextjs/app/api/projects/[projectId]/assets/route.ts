import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/db/supabase";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  // Auth check
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient();

    const { data: assets, error } = await supabase
      .from("assets")
      .select("*")
      .eq("project_id", projectId);

    if (error) throw error;

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Failed to fetch assets", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
