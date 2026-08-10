import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PresenceModel } from "@/models/Presence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, count: 1 });
    }

    const cutoff = new Date(Date.now() - 25000);
    const count = await PresenceModel.countDocuments({ lastSeen: { $gte: cutoff } });

    return NextResponse.json({
      success: true,
      count: Math.max(count, 1),
    });
  } catch {
    return NextResponse.json({ success: true, count: 1 });
  }
}

export async function POST(req: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, count: 1 });
    }

    const body = await req.json().catch(() => ({}));
    const { sessionId, leave } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing sessionId" }, { status: 400 });
    }

    if (leave) {
      await PresenceModel.deleteOne({ sessionId });
    } else {
      await PresenceModel.findOneAndUpdate(
        { sessionId },
        { lastSeen: new Date() },
        { upsert: true, new: true }
      );
    }

    const cutoff = new Date(Date.now() - 25000);
    const count = await PresenceModel.countDocuments({ lastSeen: { $gte: cutoff } });

    return NextResponse.json({
      success: true,
      count: Math.max(count, 1),
    });
  } catch {
    return NextResponse.json({ success: true, count: 1 });
  }
}
