import mongoose, { Schema, Document } from "mongoose";

export interface IPresence extends Document {
  sessionId: string;
  lastSeen: Date;
}

const PresenceSchema = new Schema<IPresence>(
  {
    sessionId: { type: String, required: true, unique: true },
    lastSeen: { type: Date, default: Date.now, expires: 35 },
  },
  { timestamps: true }
);

export const PresenceModel =
  mongoose.models.Presence || mongoose.model<IPresence>("Presence", PresenceSchema);
