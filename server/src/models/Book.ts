import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  available: boolean;
  borrowFee: number;
  isBorrowed?: boolean;
  borrowedBy?: mongoose.Types.ObjectId | null;
  borrowedAt?: Date | null;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true },
  borrowFee: { type: Number, required: true },
  isBorrowed: { type: Boolean, default: false },
  borrowedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  borrowedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.model<IBook>('Book', bookSchema);
