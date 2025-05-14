
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  alert?: boolean;
  alertTime?: Date;
}

export interface TaskNotification {
  id: string;
  taskId: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: Date;
  read: boolean;
}
