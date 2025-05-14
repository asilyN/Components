import type { Task } from '../types/task';
import { BasicTask } from './tasks/BasicTask';
import { TimedTask } from './tasks/TimedTask';
import { ChecklistTask } from './tasks/ChecklistTask';

interface TaskFactoryProps {
  type: 'basic' | 'timed' | 'checklist';
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function TaskFactory({ type, onSubmit }: TaskFactoryProps) {
  switch (type) {
    case 'basic':
      return <BasicTask onSubmit={onSubmit} />;
    case 'timed':
      return <TimedTask onSubmit={onSubmit} />;
    case 'checklist':
      return <ChecklistTask onSubmit={onSubmit} />;
    default:
      return <BasicTask onSubmit={onSubmit} />;
  }
} 