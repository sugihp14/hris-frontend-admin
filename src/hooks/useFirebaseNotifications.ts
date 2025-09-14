import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNotificationStore } from '@/libs/stores/notification';

const initializeFirebaseNotifications = async () => {
  try {
    const { messaging, requestForToken, onMessageListener } = await import('@/libs/firebase');
    
    if (typeof window !== 'undefined' && 'Notification' in window && messaging) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get FCM token
        const token = await requestForToken();
        if (token) {
          console.log('FCM Token:', token);
        }
        
        
        onMessageListener().then((payload: any) => {
          console.log('Message received: ', payload);
         
          const newNotification = {
            title: payload.notification?.title || 'Notifikasi Baru',
            body: payload.notification?.body || 'Anda memiliki notifikasi baru'
          };
          
          
          toast.success(`${newNotification.title}: ${newNotification.body}`, {
            duration: 4000,
            position: 'top-right',
          });
        }).catch((error) => {
          console.log('Error setting up message listener:', error);
        });
      } else {
        console.log('Unable to get permission to notify.');
      }
    }
  } catch (error) {
    console.log('Firebase not available or not configured:', error);
  }
};

export const useFirebaseNotifications = () => {
  useEffect(() => {
    // Cek apakah kita dalam environment production atau development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      // Hanya inisialisasi Firebase di production
      initializeFirebaseNotifications();
    } else {
      console.log('Firebase notifications disabled in development mode');
    }
  }, []);
};