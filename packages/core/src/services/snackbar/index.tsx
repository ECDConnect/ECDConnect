import { Alert, AlertType, renderIcon } from '@ecdlink/ui';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  duration: number;
  type: AlertType;
  onClose: () => void;
}

interface MessageEvent {
  message: string;
  duration?: number;
  type?: AlertType;
}

interface SnackbarContextValue {
  showMessage: (event: MessageEvent) => void;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  duration,
  type,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) {
      onClose();
    }
  }, [visible, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 w-11/12 -translate-x-1/2 transform rounded-md transition-opacity ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <Alert
        type={type}
        title={message}
        variant="outlined"
        button={
          <button
            onClick={handleClose}
            className="absolute top-0 bottom-0 right-4 my-0"
          >
            {renderIcon(
              'XIcon',
              `${type === 'success' ? 'text-white' : 'text-gray-900'} h-6 w-6`
            )}
          </button>
        }
      />
    </div>
  );
};

const SnackbarContext = createContext<SnackbarContextValue | undefined>(
  undefined
);

export const SnackbarProvider: React.FC = ({ children }) => {
  const [message, setMessage] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarDuration, setSnackbarDuration] = useState(5000);
  const [snackbarType, setSnackbarType] = useState<AlertType>('success');
  const showMessage = ({ message, duration, type }: MessageEvent) => {
    setMessage(message);
    setIsSnackbarOpen(true);
    if (type) {
      setSnackbarType(type);
    }

    if (duration) {
      setSnackbarDuration(duration);
    } else {
      setSnackbarDuration(5000);
    }
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      {isSnackbarOpen && (
        <Snackbar
          message={message}
          duration={snackbarDuration}
          onClose={closeSnackbar}
          type={snackbarType}
        />
      )}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextValue => {
  const context = useContext(SnackbarContext);

  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }

  return context;
};
