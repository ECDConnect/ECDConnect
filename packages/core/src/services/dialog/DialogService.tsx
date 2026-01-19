import { DialogPosition } from '@ecdlink/ui';
import * as React from 'react';
import { DialogModal } from './dialog';

export interface DialogModalOptions {
  render: (onSubmit: () => void, onCancel: () => void) => React.ReactNode;
  position?: DialogPosition;
  color?: string;
  transitionClassName?: string;
  blocking?: boolean;
  fullOverlay?: boolean;
}

const DialogServiceContext = React.createContext<
  (options: DialogModalOptions) => void
>(() => {
  throw new Error('Please ensure you register the dialog provider!');
});

export const useDialog = () => React.useContext(DialogServiceContext);

export const DialogServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dialogState, setDialogState] =
    React.useState<DialogModalOptions | null>(null);

  const openConfirmation = React.useCallback((options: DialogModalOptions) => {
    setDialogState(options);
  }, []);

  const handleClose = React.useCallback(() => {
    if (!dialogState?.blocking) {
      setDialogState(null);
    }
  }, [dialogState]);

  const handleSubmit = React.useCallback(() => {
    setDialogState(null);
  }, []);

  return (
    <>
      <DialogServiceContext.Provider value={openConfirmation}>
        {children}
      </DialogServiceContext.Provider>
      {dialogState && (
        <DialogModal
          open={Boolean(dialogState)}
          onSubmit={handleSubmit}
          onClose={handleClose}
          {...dialogState}
        />
      )}
    </>
  );
};
