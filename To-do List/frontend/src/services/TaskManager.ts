import type { Task } from "../types/task";
import { TaskAdapter, type BackendTaskData } from "./TaskAdapter"; // Import TaskAdapter and BackendTaskData

const API_BASE_URL = "http://localhost:5001/task";

class TaskManagerClass {
  private static instance: TaskManagerClass;
  private tasks: Task[] = [];
  private constructor() {
  }

  public static getInstance(): TaskManagerClass {
    if (!TaskManagerClass.instance) {
      TaskManagerClass.instance = new TaskManagerClass();
    }
    return TaskManagerClass.instance;
  }

  public loadTasks(apiTasks: Task[]): void {
    this.tasks = [...apiTasks];
  }

  public async addTask(
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): Promise<Task> {
    const payload: Partial<BackendTaskData> = {
      text: taskData.text,
    };

    if (taskData.dueDate) {
      payload.due_date = taskData.dueDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    }
    if (taskData.alert !== undefined) {
      payload.alert = taskData.alert;
    }

    if (taskData.notes) {
      payload.subtask = taskData.notes;
    }

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to add task. Status: ${response.status}. Server response: ${errorBody}`
      );
    }

    const createdBackendTask: BackendTaskData = await response.json();
    const newTask = TaskAdapter.convertToInternalTask(createdBackendTask);
    this.tasks.push(newTask);
    this.tasks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return newTask;
  }

  public async removeTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to delete task. Status: ${response.status}. Server response: ${errorBody}`
      );
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  public async updateTask(updatedTaskData: Task): Promise<Task> {
    const payload: Partial<BackendTaskData> = {
      text: updatedTaskData.text,
      completed: updatedTaskData.completed,
      due_date: updatedTaskData.dueDate
        ? updatedTaskData.dueDate.toISOString().split("T")[0]
        : null,
      alert: updatedTaskData.alert,
      subtask: updatedTaskData.notes,
    };

    const response = await fetch(`${API_BASE_URL}/${updatedTaskData.id}`, {

      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Failed to update task. Status: ${response.status}. Server response: ${errorBody}`
      );
    }
    const updatedBackendTaskResponse: BackendTaskData = await response.json();
    const newTask = TaskAdapter.convertToInternalTask(
      updatedBackendTaskResponse
    );

    this.tasks = this.tasks.map((task) =>
      task.id === newTask.id ? newTask : task
    );
    this.tasks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return newTask;
  }

  public getTask(taskId: string): Task | undefined {
    return this.tasks.find((task) => task.id === taskId);
  }

  public getAllTasks(): Task[] {
    return [...this.tasks];
  }

  public searchTasks(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return this.tasks.filter((task) =>
      task.text.toLowerCase().includes(lowerQuery)
    );
  }
}

export const TaskManager = TaskManagerClass.getInstance();
