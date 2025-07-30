import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  available: boolean;
  borrowFee: number;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true },
  borrowFee: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IBook>('Book', bookSchema);
