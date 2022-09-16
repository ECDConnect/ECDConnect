import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch, useAppSelector } from '@store';
import { syncActions, syncThunkActions } from '@store/sync';
import { ThunkActionStatuses } from '@store/types';
import localforage from 'localforage';
import { useCallback, useEffect } from 'react';
import hash from 'object-hash';

const useBackgroundSync = () => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();

  const { resetAppStore, initStoreSetup } = useStoreSetup();

  const { sync, analytics, settings, notifications, ...rest } = useAppSelector(
    (state) => state
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const stateHash = await localforage.getItem('state:hash');

      const hasStateChanged = stateHash !== hash(rest);

      hasStateChanged &&
        isOnline &&
        dispatch(syncThunkActions.syncOfflineData({}));
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isOnline, dispatch, rest]);

  const handleSyncSuccess = useCallback(async () => {
    await dispatch(syncActions.resetSyncState());
    await resetAppStore();
    await initStoreSetup();
  }, [dispatch, resetAppStore, initStoreSetup]);

  if (sync.status === ThunkActionStatuses.Fulfilled) {
    handleSyncSuccess();
  }
};

export default useBackgroundSync;
