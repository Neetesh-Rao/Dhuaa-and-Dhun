import { NextResponse } from "next/server";
import { generateSignature, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || "music/audio";
    const sigData = generateSignature(folder);
    return NextResponse.json(sigData);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
