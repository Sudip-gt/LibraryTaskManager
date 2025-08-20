export interface Task {
  _id?: string;
  book: string;
  user: string;
  title: string;
  dueDate: string;
  bookId: string;
  completed: boolean;
  relatedBook: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Task {
  title: string;
  dueDate: string;
}
