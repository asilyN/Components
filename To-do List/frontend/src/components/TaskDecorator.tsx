import type { ReactNode } from 'react';
import type { Task } from '../types/task';

interface TaskDecoratorProps {
  task: Task;
  children: ReactNode;
}

export function TaskDecorator({ task, children }: TaskDecoratorProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const hasReminder = task.alert && task.alertTime;

  return (
    <div className="relative">
      {children}
      {(isOverdue || hasReminder) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {isOverdue && (
            <span className="text-red-500" title="Task is overdue">
              ⚠️
            </span>
          )}
          {hasReminder && (
            <span className="text-blue-500" title="Reminder set">
              🔔
            </span>
          )}
        </div>
      )}
    </div>
  );
} 