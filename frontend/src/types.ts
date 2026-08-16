export type TaskList = {
  id: number;
  title: string;
  position: number;
};

export type Card = {
  id: number;
  listId: number;
  title: string;
  position: number;
  priority: string;
  createdAt: string;
};
