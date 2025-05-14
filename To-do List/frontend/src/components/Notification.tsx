import { useEffect, useState } from 'react';
import type { TaskNotification } from '../types/task';

interface NotificationProps {
  notifications: TaskNotification[];
  onNotificationRead: (id: string) => void;
}

export function Notification({ notifications, onNotificationRead }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (unreadCount > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  const getNotificationIcon = (type: TaskNotification['type']) => {
    switch (type) {
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">Notifications ({unreadCount})</h3>
          <button 
            onClick={() => setIsVisible(!isVisible)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>

        {isVisible && (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                  notification.read ? 'bg-white' : 'bg-blue-50'
                } hover:bg-gray-50`}
                onClick={() => onNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div>
                    <p className={`text-sm ${
                      notification.read ? 'text-gray-600' : 'text-gray-900'
                    }`}>
                      {notification.message}
                    </p>
                    <small className="text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 