import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (conn) {
      return NextResponse.json({ ok: true, database: "mongodb" });
    }
    return NextResponse.json({ ok: false, message: "Database not connected" }, { status: 500 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ ok: false, error: errMessage }, { status: 500 });
  }
}
