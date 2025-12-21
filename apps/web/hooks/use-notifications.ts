'use client';

import { useState, useCallback, useEffect } from 'react';
import useLocalStorage from './use-local-storage';

export type NotificationPermission = 'granted' | 'denied' | 'default';

interface UseNotificationsReturn {
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (title: string, options?: NotificationOptions) => void;
  hasAskedForPermission: boolean;
  setHasAskedForPermission: (value: boolean) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [hasAskedForPermission, setHasAskedForPermission] = useLocalStorage<boolean>(
    '@pomodoro-flow:notification-permission-asked',
    false
  );
  const [isClient, setIsClient] = useState(false);

  // Initialize permission status on client
  useEffect(() => {
    setIsClient(true);
    if ('Notification' in window) {
      const notificationPermission = Notification.permission as NotificationPermission;
      setPermission(notificationPermission);
      // If permission was already granted or denied, mark as asked
      if (notificationPermission !== 'default') {
        setHasAskedForPermission(true);
      }
    }
  }, [setHasAskedForPermission]);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isClient || !('Notification' in window)) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      setHasAskedForPermission(true);
      return result as NotificationPermission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, [isClient, setHasAskedForPermission]);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isClient || !('Notification' in window)) {
        console.log(`[Notification] ${title}`, options);
        return;
      }

      // Check current permission status
      const currentPermission = Notification.permission;
      console.log('Current notification permission:', currentPermission);

      if (currentPermission === 'granted') {
        try {
          const notification = new Notification(title, {
            icon: '/images/logo.png',
            ...options,
          });

          console.log('Notification shown:', title);

          // Listen for click on notification
          notification.onclick = () => {
            console.log('Notification clicked!');
            window.focus();
            // Dispatch custom event to trigger challenge dialog
            const event = new CustomEvent('notification-clicked', { detail: { title } });
            window.dispatchEvent(event);
            console.log('notification-clicked event dispatched');
            notification.close();
          };
        } catch (error) {
          console.error('Error showing notification:', error);
        }
      } else {
        console.warn('Notification permission not granted. Current permission:', currentPermission);
      }
    },
    [isClient]
  );

  return {
    permission,
    requestPermission,
    showNotification,
    hasAskedForPermission,
    setHasAskedForPermission,
  };
}
