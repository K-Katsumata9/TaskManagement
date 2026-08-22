export type TaskList = {
  id: number;
  title: string;
  position: number;
};

export type Card = {
  id: number;
  listId: number;
  title: string;
  description: string | null;
  position: number;
  priority: string;
  dueDate: string | null;
  createdAt: string;
};
