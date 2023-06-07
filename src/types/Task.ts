export default interface Task {
  id?: number;
  description?: string;
  priority?: number;
  tomatoes?: string;
  completed?: boolean;
  remaining?: number;
  pomodoros?: number;
  createdAt?: string;
  dueDate?: string;
}
