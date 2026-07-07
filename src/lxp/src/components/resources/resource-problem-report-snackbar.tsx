import { Alert, AlertType, renderIcon } from '@ecdlink/ui';
import { useEffect, useState } from 'react';

interface ResourceProblemReportSnackbarProps {
  message: string;
  type?: AlertType;
  onDismiss: () => void;
  duration?: number;
}

export const ResourceProblemReportSnackbar: React.FC<
  ResourceProblemReportSnackbarProps
> = ({ message, type = 'success', onDismiss, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleClose = () => {
    setVisible(false);
    onDismiss();
  };

  if (!visible) {
    return null;
  }

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
