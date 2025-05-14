import { useState } from "react";
import type { Task } from "../../types/task";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistTaskProps {
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

export function ChecklistTask({ onSubmit }: ChecklistTaskProps) {
  const [text, setText] = useState("");
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      setChecklistItems([
        ...checklistItems,
        {
          id: `item-${Date.now()}`,
          text: newItemText.trim(),
          completed: false,
        },
      ]);
      setNewItemText("");
    }
  };

  const handleItemToggle = (itemId: string) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleItemDelete = (itemId: string) => {
    setChecklistItems((items) => items.filter((item) => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      text,
      completed: false,
      notes: JSON.stringify(checklistItems),
    });
    setText("");
    setChecklistItems([]);
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
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Checklist Items
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add new item"
            />
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleItemToggle(item.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span
                  className={`flex-1 ${
                    item.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleItemDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Checklist Task
        </button>
      </div>
    </form>
  );
}
