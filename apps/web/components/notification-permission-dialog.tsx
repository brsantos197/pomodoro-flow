'use client';

import { useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@workspace/ui/components/dialog';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/use-notifications';

export function NotificationPermissionDialog() {
  const { requestPermission, hasAskedForPermission, setHasAskedForPermission, permission } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Determine if modal should be shown
  useEffect(() => {
    if (isClient) {
      const show = !hasAskedForPermission && permission === 'default';
      setShouldShow(show);

      if (show) {
        // Show dialog after a short delay to ensure app is loaded
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isClient, hasAskedForPermission, permission]);

  const handleRequestPermission = async () => {
    await requestPermission();
    setHasAskedForPermission(true);
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setHasAskedForPermission(true);
    setIsOpen(false);
  };

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle>Ativar Notificações</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-4">
            <div className="space-y-3">
              <p>
                As notificações ajudam a manter você focado e nunca perder quando um ciclo termina.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">✓</span>
                  <span>Seja notificado quando cada ciclo de foco terminar</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">✓</span>
                  <span>Receba alertas quando intervalos terminarem</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">✓</span>
                  <span>Mantenha o foco sem precisar olhar a tela constantemente</span>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={handleDismiss}>
            Talvez Depois
          </Button>
          <Button onClick={handleRequestPermission} className="bg-blue-600 hover:bg-blue-700">
            Ativar Notificações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
