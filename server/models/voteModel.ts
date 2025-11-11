import mongoose, { Schema, Document, Types } from "mongoose";

export interface IVote extends Document {
  userId: Types.ObjectId;
  type: "news" | "price" | "insight" | "meme";
  itemId: string;       
  value: 1 | -1;        // 👍 = 1, 👎 = -1
  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type:   { type: String, enum: ["news", "price", "insight", "meme"], required: true },
    itemId: { type: String, required: true },
    value:  { type: Number, enum: [1, -1], required: true },
  },
  { timestamps: true }
);

voteSchema.index({ userId: 1, type: 1, itemId: 1 }, { unique: true });

export default mongoose.model<IVote>("Vote", voteSchema);
