import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPass) {
      return NextResponse.json({
        success: true,
        message: "Admin authenticated successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Incorrect admin password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
