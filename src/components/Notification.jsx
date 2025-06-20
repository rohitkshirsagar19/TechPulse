// src/components/Notification.jsx
import { useNotifications } from '../context/NotificationContext';
import { useEffect } from 'react';

function Notification() {
  const { notifications, clearNotification } = useNotifications();

  useEffect(() => {
    console.log('Current notifications:', notifications); // Log notifications
    const timers = notifications.map((notification) =>
      setTimeout(() => clearNotification(notification.id), 5000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, clearNotification]);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex justify-between items-center"
        >
          <span>{notification.message}</span>
          <button
            onClick={() => clearNotification(notification.id)}
            className="ml-4 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
export default Notification;