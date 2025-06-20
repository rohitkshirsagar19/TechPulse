// src/pages/NotificationsPage.jsx
import { useNotifications } from '../context/NotificationContext';

function NotificationsPage() {
  const { notifications, clearNotification } = useNotifications();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="border p-4 rounded-lg flex justify-between items-center"
            >
              <span>{notification.message}</span>
              <button
                onClick={() => clearNotification(notification.id)}
                className="text-red-500 hover:text-red-700"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No notifications yet.</p>
      )}
    </div>
  );
}
export default NotificationsPage;