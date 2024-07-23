import { DialogPosition } from '@ecdlink/ui';
import * as React from 'react';
import { DialogModal } from './dialog';

export interface DialogModalOptions {
  render: (onSubmit: () => void, onCancel: () => void) => React.ReactNode;
  position?: DialogPosition;
  color?: string;
  transitionClassName?: string;
  blocking?: boolean;
}
const DialogServiceContext = React.createContext<
  (options: DialogModalOptions) => void
>(() => {
  throw new Error('Please ensure you register the dialog provider!');
});

export const useDialog = () => React.useContext(DialogServiceContext);

export const DialogServiceProvider = ({ children }: any) => {
  const [dialogState, setDialogState] =
    React.useState<DialogModalOptions | null>(null);

  const openConfirmation = (options: DialogModalOptions) => {
    setDialogState(options);
  };

  const handleClose = () => {
    if (dialogState?.blocking) {
      return;
    }
    setDialogState(null);
  };

  const handleSubmit = () => {
    setDialogState(null);
  };

  return (
    <>
      <DialogServiceContext.Provider
        value={openConfirmation}
        children={children}
      />
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
