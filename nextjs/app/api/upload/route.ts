import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const { userId } = await auth();
        if (!userId) {
          return {};
        }

        return {
          allowedContentTypes: [
            "video/mp4",
            "video/quicktime",
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            "text/plain",
            "text/markdown",
          ],
          maximumSize: 2 * 1024 * 1024 * 1024, // 2GB
          tokenPayload: clientPayload,
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        if (!tokenPayload) return;

        const { projectId, fileType, mimeType, size } =
          JSON.parse(tokenPayload);

        console.log(
          `Saving blob URL ${blob.url} to database for project ${projectId} with filename ${blob.pathname}`
        );

        try {
          // Insert into assets table
          const { data: newAsset, error: assetError } = await supabase
            .from("assets")
            .insert({
              project_id: projectId,
              title: blob.pathname.split("/").pop() || blob.pathname,
              file_name: blob.pathname,
              file_url: blob.url,
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
        } catch {
          throw new Error(
            "Could not save asset or asset processing job to database"
          );
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
