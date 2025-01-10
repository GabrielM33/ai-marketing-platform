"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createProject() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("User not found");
  }

  // Get or create user mapping
  const { data: userMapping } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", clerkId)
    .single();

  // If user mapping doesn't exist, create it
  const finalUserMapping =
    userMapping ||
    (await supabase
      .from("users")
      .insert([{ clerk_id: clerkId }])
      .select()
      .single()
      .then((res) => res.data));

  if (!finalUserMapping) {
    throw new Error("Failed to get or create user mapping");
  }

  // Create project in database
  const { data: newProject, error } = await supabase
    .from("projects")
    .insert([
      {
        title: "New Project",
        user_id: finalUserMapping.id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error("Failed to create project: " + error.message);
  }

  return newProject;

  // TODO: LATER: redirect to detail view
  // redirect => /projects/${newProject.id}
}
