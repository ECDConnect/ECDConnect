import * as React from 'react';
import { SharedPanel, SharedPanelOptions } from './SharedPanel';

const PanelServiceContext = React.createContext<
  (options: SharedPanelOptions) => Promise<void>
>(Promise.reject);

export const usePanel = () => React.useContext(PanelServiceContext);
export const PanelServiceProvider = ({ children }: any) => {
  const [dialogState, setDialogState] =
    React.useState<SharedPanelOptions | null>(null);

  const awaitingPromiseRef = React.useRef<{
    resolve: () => void;
    reject: () => void;
  }>();

  const openConfirmation = (options: SharedPanelOptions) => {
    setDialogState(options);
    return new Promise<void>((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleClose = () => {
    if (
      dialogState &&
      dialogState.catchOnCancel &&
      awaitingPromiseRef.current
    ) {
      awaitingPromiseRef.current.reject();
    }

    setDialogState(null);
  };

  const handleSubmit = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }

    setDialogState(null);
  };

  return (
    <>
      <PanelServiceContext.Provider
        value={openConfirmation}
        children={children}
      />

      <SharedPanel
        open={Boolean(dialogState)}
        onSubmit={handleSubmit}
        onClose={handleClose}
        {...dialogState}
      />
    </>
  );
};
