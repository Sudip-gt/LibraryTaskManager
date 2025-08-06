import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  dueDate: Date;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  relatedBook?: mongoose.Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    relatedBook: { type: Schema.Types.ObjectId, ref: 'Book' },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>('Task', taskSchema);
