import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  available: boolean;
  borrowFee: number;
  isBorrowed?: boolean;
  borrowedBy?: IUser | mongoose.Types.ObjectId | null;
  borrowedAt?: Date | null;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  available: { type: Boolean, default: true },
  borrowFee: { type: Number, required: true },
  isBorrowed: { type: Boolean, default: false },
  borrowedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  borrowedAt: { type: Date, default: null },
}, { timestamps: true });

bookSchema.index({ borrowedBy: 1 });
bookSchema.index({ isBorrowed: 1 });
bookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model<IBook>('Book', bookSchema);
