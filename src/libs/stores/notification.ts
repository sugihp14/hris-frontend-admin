// src/libs/stores/notification.ts

import { create } from 'zustand';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { messaging, requestForToken } from '@/libs/firebase';
import { onMessage } from 'firebase/messaging';

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  isRead: boolean;
};

type NotificationStore = {
  notifications: NotificationItem[];
  unreadCount: number;
  lastToastMessage: NotificationItem | null;
  listenToDatabase: () => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  initializeFirebase: () => Promise<void>;
  resetLastToastMessage: () => void;
};

const db = getDatabase();
const notificationsRef = ref(db, 'profile-updates');

const initialState = {
  notifications: [],
  unreadCount: 0,
  lastToastMessage: null,
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...initialState, 

  listenToDatabase: () => {
    onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationList = Object.keys(data).map(key => {
          const item = data[key];
          
          const userName = item.userName || 'User'; 
          const fieldName = Object.keys(item.changes)[0] || 'unknown field'; 
          
          const title = `Update Profile By ${userName}`;
          const body = `Melakukan perubahan pada field: ${fieldName}`;

          return {
            id: key,
            title,
            body,
            timestamp: new Date(item.timestamp).getTime(),
            isRead: item.isRead || false,
          };
        }).sort((a, b) => b.timestamp - a.timestamp);
        
        const unreadCount = notificationList.filter(n => !n.isRead).length;
        set({ notifications: notificationList, unreadCount });
      } else {
        set({ notifications: [], unreadCount: 0 });
      }
    });
  },

  markAsRead: async (id) => {
    try {
      const itemRef = ref(db, `profile-updates/${id}`);
      await update(itemRef, { isRead: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  markAllAsRead: async () => {
    const notifications = get().notifications;
    const batchUpdates: { [key: string]: any } = {};
    notifications.forEach((notif) => {
      if (!notif.isRead) {
        batchUpdates[`${notif.id}/isRead`] = true;
      }
    });
    
    try {
      if (Object.keys(batchUpdates).length > 0) {
        await update(notificationsRef, batchUpdates);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  },

  initializeFirebase: async () => {
    try {
      get().listenToDatabase();

      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await requestForToken();
          if (token) {
            console.log("FCM Token: ", token);
          }
          
          if (messaging) {
            onMessage(messaging, (payload) => {
              console.log('Foreground message received:', payload);
              set({
                lastToastMessage: {
                  id: payload.messageId || new Date().toISOString(),
                  title: payload.notification?.title || 'Notifikasi Baru',
                  body: payload.notification?.body || 'Anda memiliki notifikasi baru',
                  timestamp: Date.now(),
                  isRead: false
                }
              });
            });
          }
        }
      }
    } catch (error) {
      console.log('Error initializing Firebase:', error);
    }
  },

  resetLastToastMessage: () => {
    set({ lastToastMessage: null });
  }
}));