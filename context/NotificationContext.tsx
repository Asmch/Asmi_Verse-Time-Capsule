"use client"
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

interface NotificationStore {
  notifications: Notification[];
  socket: Socket | null;
  isConnected: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  connectSocket: (userId: string) => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  socket: null,
  isConnected: false,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  connectSocket: (userId: string) => {
    const socket = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to notification server');
      set({ isConnected: true });
      socket.emit('join-user-room', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from notification server');
      set({ isConnected: false });
    });

    socket.on('new-notification', (notification) => {
      get().addNotification({
        type: 'info',
        title: notification.title || 'New Notification',
        message: notification.message,
      });
    });

    socket.on('capsule-update', (data) => {
      if (data.type === 'unlocked') {
        get().addNotification({
          type: 'success',
          title: 'Time Capsule Unlocked!',
          message: `Your capsule "${data.data.title}" is ready to view.`,
          action: {
            label: 'View Capsule',
            url: `/view-capsule/${data.data._id}`,
          },
        });
      }
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

// Hook for using notifications in components
export const useNotifications = () => {
  const store = useNotificationStore();

  return {
    ...store,
    unreadCount: store.notifications.filter((n) => !n.read).length,
  };
};

// Component for managing socket connection
export const NotificationProvider = ({ children, userId }: { children: React.ReactNode; userId?: string }) => {
  const { connectSocket, disconnectSocket } = useNotificationStore();

  useEffect(() => {
    if (userId) {
      connectSocket(userId);
    }

    return () => {
      disconnectSocket();
    };
  }, [userId, connectSocket, disconnectSocket]);

  return <>{children}</>;
}; 