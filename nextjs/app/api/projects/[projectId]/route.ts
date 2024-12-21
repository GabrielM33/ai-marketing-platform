import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(1),
});

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  // TODO: check to make sure the user us authorized to edit thso project

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

  // Get the Supabase user mapping first
  const { data: userMapping } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!userMapping) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Update the project
  const { data: updatedProject, error } = await supabase
    .from("projects")
    .update({ title: validatedData.data.title })
    .eq("id", params.projectId)
    .eq("user_id", userMapping.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }

  if (!updatedProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // TODO: return the updated project

  // TODO: handle errors

  return NextResponse.json(updatedProject);
}
