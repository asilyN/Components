import type { Task } from "../types/task";

export interface BackendTaskData {
  id: string;
  text: string;
  completed: boolean;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
  subtask?: string | null;
  alert?: boolean;
}

export class TaskAdapter {
  public static convertToInternalTask(backendTask: BackendTaskData): Task {
    return {
      id: backendTask.id,
      text: backendTask.text,
      completed: backendTask.completed ?? false,
      dueDate: backendTask.due_date
        ? new Date(backendTask.due_date)
        : undefined,
      createdAt: new Date(backendTask.created_at),
      updatedAt: new Date(backendTask.updated_at),
      notes: backendTask.subtask ?? undefined,
      alert: backendTask.alert ?? false,

    };
  }

  public static convertToExternalTask(task: Task): Partial<BackendTaskData> {
    return {
      id: task.id,
      text: task.text,
      completed: task.completed,
      due_date: task.dueDate?.toISOString().split("T")[0],
      subtask: task.notes,
      alert: task.alert,
    };
  }
}
