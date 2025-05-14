import { useState, useEffect } from "react";
import type { Task } from "../types/task";
import { TaskManager } from "../services/TaskManager";
import { TaskSortingStrategy } from "../services/TaskSortingStrategy";
import { TaskDecorator } from "./TaskDecorator";
import { TaskAdapter, type BackendTaskData } from "../services/TaskAdapter";

type SortOption = "date" | "name" | "id";

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function TaskList({ tasks, setTasks }: TaskListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTasksAndUpdateState = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5001/task");
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Failed to fetch tasks. Status: ${response.status}. Server response: ${errorBody}`
          );
          TaskManager.loadTasks([]);
          setTasks([]);
          return;
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          const formattedTasks = data.map((task: BackendTaskData) =>
            TaskAdapter.convertToInternalTask(task)
          );
          TaskManager.loadTasks(formattedTasks);
          setTasks(formattedTasks);
        } else {
          console.error("Fetched data is not an array:", data);
          TaskManager.loadTasks([]);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error during fetchTasks execution:", error);
        TaskManager.loadTasks([]);
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasksAndUpdateState();
  }, [setTasks]);

  const sortStrategy = (tasksToSort: Task[], sortType: SortOption): Task[] => {
    switch (sortType) {
      case "date":
        return TaskSortingStrategy.sortByDate(tasksToSort);
      case "name":
        return TaskSortingStrategy.sortByName(tasksToSort);
      case "id":
        return TaskSortingStrategy.sortById(tasksToSort);
      default:
        return tasksToSort;
    }
  };

  const handleTaskUpdate = async (updatedTask: Task) => {
    try {
      await TaskManager.updateTask(updatedTask);
      setTasks(sortStrategy(TaskManager.getAllTasks(), sortBy));
      setEditingTaskId(null);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      await TaskManager.removeTask(taskId);
      setTasks(sortStrategy(TaskManager.getAllTasks(), sortBy));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditText("");
  };

  const saveEdit = (task: Task) => {
    handleTaskUpdate({ ...task, text: editText });
  };

  const sortedTasks = sortStrategy(tasks, sortBy);
  const filteredTasks = searchQuery
    ? sortedTasks.filter((task) =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sortedTasks;

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-500 text-lg">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="px-3 py-2 border border-gray-300 rounded-md bg-white flex-1"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="date">Sort by Due Date</option>
            <option value="name">Sort by Name</option>
            <option value="id">Sort by ID</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 && !isLoading && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No tasks match your search."
                : "No tasks found. Add a new task to get started!"}
            </p>
          </div>
        )}
        {filteredTasks.map((task) => (
          <TaskDecorator key={task.id} task={task}>
            <div
              className={`p-4 rounded-lg shadow-sm border-l-4 border-blue-300 bg-gray-50`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      handleTaskUpdate({ ...task, completed: !task.completed })
                    }
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  {editingTaskId === task.id ? (
                    <>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="px-2 py-1 border rounded mr-2"
                      />
                      <button
                        onClick={() => saveEdit(task)}
                        className="px-2 py-1 bg-green-500 text-white rounded mr-1"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1 bg-gray-300 text-gray-700 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <h3
                        className={`text-lg font-medium ${
                          task.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {task.text}
                      </h3>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 ">
                  <button
                    onClick={() => startEdit(task)}
                    className="px-2 py-1 mt-6 text-sm bg-blue-500 text-white hover:bg-blue-50 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="px-3 py-1 text-sm mt-6 text-white bg-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                {task.dueDate && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {task.notes &&
                (() => {
                  let checklist: {
                    id: string;
                    text: string;
                    completed: boolean;
                  }[] = [];
                  try {
                    if (typeof task.notes === "string") {
                      checklist = JSON.parse(task.notes);
                    }
                  } catch {
                    console.error("Failed to parse checklist:", task.notes);
                  }
                  if (
                    Array.isArray(checklist) &&
                    checklist.length > 0 &&
                    checklist.some(
                      (item) => item && typeof item.text !== "undefined"
                    )
                  ) {
                    const handleChecklistToggle = (itemId: string) => {
                      const updatedChecklist = checklist.map((item) =>
                        item.id === itemId
                          ? { ...item, completed: !item.completed }
                          : item
                      );
                      handleTaskUpdate({
                        ...task,
                        notes: JSON.stringify(updatedChecklist),
                      });
                    };
                    return (
                      <ul className="mt-2 ml-4 list-disc text-gray-700 text-sm">
                        {checklist.map((item) => (
                          <li key={item.id} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleChecklistToggle(item.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span
                              className={
                                item.completed
                                  ? "line-through text-gray-400"
                                  : ""
                              }
                            >
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (
                    typeof task.notes === "string" &&
                    task.notes.trim() !== ""
                  ) {
                    return (
                      <div className="mt-2 text-sm text-gray-600">
                        <p>{task.notes}</p>
                      </div>
                    );
                  }
                  return null;
                })()}
            </div>
          </TaskDecorator>
        ))}
      </div>
    </div>
  );
}
