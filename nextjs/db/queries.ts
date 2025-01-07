"server-only";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type UserMapping = {
  id: string;
  clerk_id: string;
  created_at?: string;
};

export async function createUserMapping(clerkId: string): Promise<UserMapping> {
  // Check if mapping already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("id, clerk_id, created_at")
    .eq("clerk_id", clerkId)
    .single();

  if (existingUser) {
    return existingUser as UserMapping;
  }

  // Create new user mapping
  const { data: newUser, error } = await supabase
    .from("users")
    .insert([{ clerk_id: clerkId }])
    .select()
    .single();

  if (error || !newUser) {
    throw new Error("Failed to create user mapping: " + error?.message);
  }

  return newUser as UserMapping;
}

export async function getProjectsForUser() {
  // Get authenticated user from Clerk auth
  const { userId } = await auth();

  // Verify user exists in database
  if (!userId) {
    throw new Error("User not found");
  }

  // First, get the Supabase user mapping
  const { data: userMapping } = await supabase
    .from("users")
    .select("id, clerk_id")
    .eq("clerk_id", userId)
    .single();

  // If user mapping doesn't exist, create it
  const finalUserMapping = userMapping || (await createUserMapping(userId));

  if (!finalUserMapping) {
    throw new Error("Failed to get or create user mapping");
  }

  // Fetch projects from database using Supabase
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", finalUserMapping.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return projects || [];
}

export async function getProject(projectId: string) {
  // Get authenticated user from Clerk auth
  const { userId } = await auth();

  // Verify user exists in database
  if (!userId) {
    throw new Error("User not found");
  }

  // First, get the Supabase user mapping
  const { data: userMapping } = await supabase
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single();

  if (!userMapping) {
    throw new Error("User mapping not found");
  }

  // First check if the project exists
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  // Return null if project doesn't exist
  if (error || !project) {
    return null;
  }

  // Then verify if the user has access to it
  if (project.user_id !== userMapping.id) {
    throw new Error("You don't have permission to view this project");
  }

  return project;
}
