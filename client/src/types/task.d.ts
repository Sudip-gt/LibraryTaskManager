export interface Task {
  _id: string;
  user: string;
  title: string;
  dueDate: string;
  completed: boolean;
  relatedBook?: string;
  priority?: 'low' | 'medium' | 'high';
}
