import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SongModel } from "@/models/Song";

export async function GET() {
  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json({
        success: true,
        source: "static_fallback",
        songs: [],
      });
    }

    const songsFromDb = await SongModel.find().sort({ createdAt: -1 }).lean();

    const formattedSongs = songsFromDb.map((s) => ({
      id: s._id.toString(),
      title: s.title,
      artist: s.artist,
      audioUrl: s.audioUrl,
      coverUrl: s.coverUrl,
      duration: s.duration,
      tags: s.tags,
    }));

    return NextResponse.json({
      success: true,
      source: "mongodb",
      songs: formattedSongs,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Database error";
    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        error: errMessage,
        songs: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB connection string (MONGODB_URI) is not configured in .env",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { title, artist, audioUrl, coverUrl, duration, tags } = body;

    if (!title || !artist || !audioUrl || !coverUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, artist, audioUrl, coverUrl",
        },
        { status: 400 }
      );
    }

    const newSong = await SongModel.create({
      title,
      artist,
      audioUrl,
      coverUrl,
      duration: duration || 0,
      tags: tags || ["90s", "retro"],
    });

    return NextResponse.json(
      {
        success: true,
        song: {
          id: newSong._id.toString(),
          title: newSong.title,
          artist: newSong.artist,
          audioUrl: newSong.audioUrl,
          coverUrl: newSong.coverUrl,
          duration: newSong.duration,
          tags: newSong.tags,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to create song";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
