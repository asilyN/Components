import { useState } from "react";
import type { Task } from "../../types/task";

interface BasicTaskProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

export function BasicTask({ onSubmit }: BasicTaskProps) {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      completed: false,
    });
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray rounded-lg shadow-sm p-6 mb-8 justify-center "
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col flex-grow">
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
        <button
          type="submit"
          className="bg-blue-500 mt-6 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
