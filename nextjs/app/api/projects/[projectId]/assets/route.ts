import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/server/supabase";
import { createClient as createStorageClient } from "@supabase/supabase-js";

// Initialize Supabase storage client with service role for full access
const supabaseStorage = createStorageClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/projects/[projectId]/assets
 * Retrieves all assets associated with a specific project
 * Requires user authentication via Clerk
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;

  // Verify user authentication using Clerk
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize Supabase client for database operations
    const supabase = await createClient();

    // Query all assets that belong to the specified project
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

/**
 * DELETE /api/projects/[projectId]/assets
 * Deletes a specific asset and its associated storage file
 * Requires user authentication via Clerk
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await context.params;
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");

  if (!assetId) {
    return NextResponse.json(
      { error: "Asset ID is required" },
      { status: 400 }
    );
  }

  // Verify user authentication using Clerk
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize Supabase client for database operations
    const supabase = await createClient();

    // First, get the asset details to know the file path
    const { data: asset, error: fetchError } = await supabase
      .from("assets")
      .select("*")
      .eq("id", assetId)
      .eq("project_id", projectId)
      .single();

    if (fetchError) {
      console.error("Failed to fetch asset:", fetchError);
      throw fetchError;
    }

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Delete the file from storage
    const { error: storageError } = await supabaseStorage.storage
      .from("assets")
      .remove([asset.file_name]);

    if (storageError) {
      console.error("Failed to delete file from storage:", storageError);
      throw storageError;
    }

    // Delete the asset record and related processing jobs
    const { error: deleteError } = await supabase
      .from("assets")
      .delete()
      .eq("id", assetId)
      .eq("project_id", projectId);

    if (deleteError) {
      console.error("Failed to delete asset record:", deleteError);
      throw deleteError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete asset:", error);
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
