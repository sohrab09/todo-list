export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: "new" | "ongoing" | "done";
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
}
