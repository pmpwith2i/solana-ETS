import { Notification } from '@/components/notifications/Notification';
import { Portal } from '@/hoc/portal';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { v4 as uuidv4 } from 'uuid';

export type Toast = {
  id: string;
  type: 'success' | 'error';
  message: string;
  isShown: boolean;
};

type ToastContextType = {
  // eslint-disable-next-line no-unused-vars
  toast: (message: string) => void;
};

const toastCtx = createContext<ToastContextType>({
  toast: () => {},
});

const ToastContext = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<Toast[]>([]);
  // eslint-disable-next-line no-undef
  const timeoutIdsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const toast = useCallback(
    (message: string) => {
      const uuid = uuidv4();
      const newToast: Toast = {
        id: uuid,
        type: 'success',
        message,
        isShown: true,
      };
      setQueue((prev) => [...prev, newToast]);

      const tId = setTimeout(() => {
        setQueue((prev) =>
          prev.map((toast) => {
            if (toast.id === uuid) {
              return { ...toast, isShown: false };
            }
            return toast;
          })
        );
      }, 3000);

      timeoutIdsRef.current[uuid] = tId;

      setTimeout(() => {
        setQueue((prev) => prev.filter((toast) => toast.id !== uuid));
      }, 3500);
    },
    [setQueue]
  );

  const handleCloseToast = useCallback(
    (id: string) => {
      if (timeoutIdsRef.current[id]) {
        clearTimeout(timeoutIdsRef.current[id]);
      }
      setQueue((prev) =>
        prev.map((toast) => {
          if (toast.id === id) {
            return { ...toast, isShown: false };
          }
          return toast;
        })
      );
    },
    [setQueue]
  );

  return (
    <toastCtx.Provider value={{ toast }}>
      <>
        {queue.length > 0 && (
          <Portal selector='#toast-container'>
            <div className='fixed bottom-0 right-0 z-50'>
              {queue.map((toast) => (
                <Notification
                  key={toast.id}
                  text={toast.message}
                  uuid={toast.id}
                  show={toast.isShown}
                  closeNotification={() => handleCloseToast(toast.id)}
                />
              ))}
            </div>
          </Portal>
        )}
        {children}
      </>
    </toastCtx.Provider>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  return <ToastContext>{children}</ToastContext>;
};

export const useToast = () => {
  return useContext(toastCtx);
};
