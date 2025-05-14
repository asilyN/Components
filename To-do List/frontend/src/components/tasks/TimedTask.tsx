import { useState } from "react";
import type { Task } from "../../types/task";

interface TimedTaskProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

export function TimedTask({ onSubmit }: TimedTaskProps) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [alert, setAlert] = useState(false);
  const [alertTime, setAlertTime] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      alert,
      alertTime: alertTime ? new Date(alertTime) : undefined,
    });
    setText("");
    setDueDate("");
    setAlert(false);
    setAlertTime("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label
            htmlFor="text"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Task Description
          </label>
          <input
            type="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="dueDate"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="alert"
            checked={alert}
            onChange={(e) => setAlert(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="alert" className="ml-2 text-sm text-gray-700">
            Set Alert
          </label>
        </div>
        {alert && (
          <div className="flex flex-col">
            <label
              htmlFor="alertTime"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Alert Time
            </label>
            <input
              type="datetime-local"
              id="alertTime"
              value={alertTime}
              onChange={(e) => setAlertTime(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Timed Task
        </button>
      </div>
    </form>
  );
}
