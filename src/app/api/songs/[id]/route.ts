import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SongModel } from "@/models/Song";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable" },
        { status: 500 }
      );
    }

    const decodedId = decodeURIComponent(id);

    // Delete by MongoDB ObjectId or Song Title
    const isObjectId = mongoose.Types.ObjectId.isValid(decodedId);
    const deleteFilter = isObjectId
      ? { $or: [{ _id: decodedId }, { title: decodedId }] }
      : { title: decodedId };

    const deleted = await SongModel.findOneAndDelete(deleteFilter);

    if (!deleted) {
      // Fallback try matching title regex
      await SongModel.deleteOne({ title: { $regex: new RegExp(`^${decodedId}$`, "i") } });
    }

    return NextResponse.json({
      success: true,
      message: "Song deleted successfully from MongoDB database",
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
