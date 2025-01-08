import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, fileType, mimeType, size, file, filename } =
      await request.json();

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/quicktime",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "text/plain",
      "text/markdown",
    ];

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size (2GB max)
    if (size > 2 * 1024 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("assets")
      .upload(`${projectId}/${filename}`, Buffer.from(file), {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("assets").getPublicUrl(uploadData.path);

    try {
      // Insert into assets table
      const { data: newAsset, error: assetError } = await supabase
        .from("assets")
        .insert({
          project_id: projectId,
          title: filename,
          file_name: uploadData.path,
          file_url: publicUrl,
          file_type: fileType,
          mime_type: mimeType,
          size: size,
        })
        .select()
        .single();

      if (assetError) throw assetError;

      // Insert into asset_processing_jobs table
      const { error: jobError } = await supabase
        .from("asset_processing_jobs")
        .insert({
          asset_id: newAsset.id,
          project_id: projectId,
          status: "created",
        });

      if (jobError) throw jobError;

      return NextResponse.json({
        url: publicUrl,
        path: uploadData.path,
      });
    } catch (error) {
      throw new Error(
        "Could not save asset or asset processing job to database"
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
