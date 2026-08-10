import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SongModel } from "@/models/Song";

const kumarSanu90sPlaylist = [
  {
    title: "Tujhe Dekha To Yeh Jaana Sanam",
    artist: "Kumar Sanu & Lata Mangeshkar (DDLJ)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    coverUrl: "/artwork/ddlj.jpg",
    duration: 304,
    tags: ["kumar-sanu", "90s-bollywood", "ddlj"],
  },
  {
    title: "Dheere Dheere Se Meri Zindagi",
    artist: "Kumar Sanu & Anuradha Paudwal (Aashiqui)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    coverUrl: "/artwork/aashiqui.jpg",
    duration: 330,
    tags: ["kumar-sanu", "90s-bollywood", "aashiqui"],
  },
  {
    title: "Churai Ke Dil Mera Goriya Chali",
    artist: "Kumar Sanu & Alka Yagnik (Main Khiladi Tu Anari)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3",
    coverUrl: "/artwork/main-khiladi.jpg",
    duration: 312,
    tags: ["kumar-sanu", "90s-bollywood"],
  },
  {
    title: "Ek Ladki Ko Dekha Toh Aisa Laga",
    artist: "Kumar Sanu (1942: A Love Story)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
    coverUrl: "/artwork/1942-love-story.jpg",
    duration: 275,
    tags: ["kumar-sanu", "90s-bollywood"],
  },
  {
    title: "Mera Dil Bhi Kitna Pagal Hai",
    artist: "Kumar Sanu & Alka Yagnik (Saajan)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c9e656e1b6.mp3",
    coverUrl: "/artwork/saajan.jpg",
    duration: 325,
    tags: ["kumar-sanu", "90s-bollywood", "saajan"],
  },
  {
    title: "Jab Koi Baat Bigad Jaye",
    artist: "Kumar Sanu & Sadhana Sargam (Jurm)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92db1.mp3",
    coverUrl: "/artwork/jurm.jpg",
    duration: 298,
    tags: ["kumar-sanu", "90s-bollywood"],
  },
  {
    title: "Do Dil Mil Rahe Hain",
    artist: "Kumar Sanu (Pardes)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c35b0b2e8a.mp3",
    coverUrl: "/artwork/pardes.jpg",
    duration: 340,
    tags: ["kumar-sanu", "90s-bollywood", "pardes"],
  },
  {
    title: "Sochenge Tumhe Pyar Kare Ke Nahi",
    artist: "Kumar Sanu (Deewana)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    coverUrl: "/artwork/deewana.jpg",
    duration: 360,
    tags: ["kumar-sanu", "90s-bollywood", "deewana"],
  },
  {
    title: "Ye Kaali Kaali Aankhen",
    artist: "Kumar Sanu & Anu Malik (Baazigar)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3",
    coverUrl: "/artwork/baazigar.jpg",
    duration: 370,
    tags: ["kumar-sanu", "90s-bollywood", "baazigar"],
  },
  {
    title: "Tum Dil Ki Dhadkan Mein",
    artist: "Kumar Sanu & Alka Yagnik (Dhadkan)",
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3",
    coverUrl: "/artwork/dhadkan.jpg",
    duration: 315,
    tags: ["kumar-sanu", "90s-bollywood", "dhadkan"],
  },
];

export async function GET() {
  try {
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        {
          success: false,
          error: "MongoDB connection failed or MONGODB_URI not found",
        },
        { status: 500 }
      );
    }

    // Delete existing songs and re-seed with 10 pure 90s Kumar Sanu classics
    await SongModel.deleteMany({});
    const insertedSongs = await SongModel.insertMany(kumarSanu90sPlaylist);

    return NextResponse.json({
      success: true,
      message: "Database re-seeded with 10 pure 90s Bollywood Kumar Sanu classics!",
      count: insertedSongs.length,
      songs: insertedSongs,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Seeding failed";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
