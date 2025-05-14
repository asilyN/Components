import { useState } from 'react'
import type { Task, TaskNotification } from './types/task'
import { TaskFactory } from './components/TaskFactory'
import { TaskList } from './components/TaskList'
import { Notification } from './components/Notification'
import { TaskManager } from './services/TaskManager'
import './App.css'

function App() {
  const [selectedTaskType, setSelectedTaskType] = useState<'basic' | 'timed' | 'checklist'>('basic')
  const [notifications, setNotifications] = useState<TaskNotification[]>([])
  const [tasks, setTasks] = useState<Task[]>(TaskManager.getAllTasks());

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask = await TaskManager.addTask(taskData)
    setTasks(TaskManager.getAllTasks());
    setNotifications((prev: TaskNotification[]) => [{
      id: `notif-${Date.now()}`,
      taskId: newTask.id,
      message: `New task "${newTask.text}" created`,
      type: 'info',
      timestamp: new Date(),
      read: false
    }, ...prev])
  }

  const handleNotificationRead = (id: string) => {
    setNotifications((prev: TaskNotification[]) => prev.map((notification: TaskNotification) =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto bg-white w-full p-8 rounded-lg shadow-lg">
      <h1 className="text-5xl font-bold text-gray-900 mb-8 mt-10 text-center">To-do List 🔔</h1>
      <Notification
      notifications={notifications}
      onNotificationRead={handleNotificationRead}
      />
      
      <div className="mb-6">
      <div className="flex gap-2 justify-center mb-4">
        <button
        onClick={() => setSelectedTaskType('basic')}
        className={`px-4 py-2 rounded-md ${
        selectedTaskType === 'basic' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        >
        Basic Task
        </button>
        <button
        onClick={() => setSelectedTaskType('timed')}
        className={`px-4 py-2 rounded-md ${
        selectedTaskType === 'timed' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        >
        Timed Task
        </button>
        <button
        onClick={() => setSelectedTaskType('checklist')}
        className={`px-4 py-2 rounded-md ${
        selectedTaskType === 'checklist' ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}
        >
        Checklist Task
        </button>
      </div>
      <TaskFactory type={selectedTaskType} onSubmit={handleTaskSubmit} />
      </div>
      <div className='bg-blue-100 rounded-lg shadow-sm p-6 mb-8'>
      <TaskList tasks={tasks} setTasks={setTasks} />
      </div>
      </div>
    </div>
  )
}

export default App
