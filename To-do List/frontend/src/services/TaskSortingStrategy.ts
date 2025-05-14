import type { Task } from '../types/task';

export class TaskSortingStrategy {
  public static sortByDate(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  public static sortByName(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.text.localeCompare(b.text));
  }

  public static sortById(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => a.id.localeCompare(b.id));
  }
}