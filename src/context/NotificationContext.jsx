// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from './UserContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
    });
    newSocket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
    });
    newSocket.on('notification', (notification) => {
      console.log('Received notification:', notification);
      if (user && notification.username === user.username && notification.type !== 'new_post') {
        console.log('Adding notification to state:', notification);
        setNotifications((prev) => [
          ...prev,
          { id: Date.now(), ...notification },
        ]);
      } else {
        console.log('Notification ignored:', { user: user?.username, notification });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}