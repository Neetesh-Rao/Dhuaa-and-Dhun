import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISong extends Document {
  id?: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  duration?: number;
  tags?: string[];
  createdAt: Date;
}

const SongSchema: Schema = new Schema<ISong>(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    audioUrl: { type: String, required: true },
    coverUrl: { type: String, required: true },
    duration: { type: Number, default: 0 },
    tags: { type: [String], default: ["90s", "retro"] },
  },
  { timestamps: true }
);

export const SongModel: Model<ISong> =
  mongoose.models.Song || mongoose.model<ISong>("Song", SongSchema);
