import mongoose, { Document, Schema } from 'mongoose';

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

taskSchema.index({ user: 1, relatedBook: 1 });
taskSchema.index({ user: 1, completed: 1, dueDate: 1 });

export default mongoose.model<ITask>('Task', taskSchema);
