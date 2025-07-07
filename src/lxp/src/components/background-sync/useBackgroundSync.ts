import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch, useAppSelector } from '@store';
import { syncActions, syncThunkActions } from '@store/sync';
import { ThunkActionStatuses } from '@store/types';
import localforage from 'localforage';
import { useCallback, useEffect } from 'react';
import hash from 'object-hash';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

const useBackgroundSync = () => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);

  const { resetAppStore, initStoreSetup } = useStoreSetup();
  const minutesBetweenSync = 30;

  const { sync, analytics, settings, notifications, ...rest } = useAppSelector(
    (state) => state
  );

  useEffect(() => {
    const interval = setInterval(async () => {
      const stateHash = await localforage.getItem('state:hash');

      const hasStateChanged = stateHash !== hash(rest);

      if (practitioner?.isPrincipal === true) {
        hasStateChanged &&
          isOnline &&
          dispatch(syncThunkActions.syncOfflineData({}));
      } else {
        hasStateChanged &&
          isOnline &&
          dispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
      }
    }, minutesBetweenSync * 60 * 1000);

    return () => clearInterval(interval);
  }, [isOnline, dispatch, rest, practitioner?.isPrincipal]);

  const handleSyncSuccess = useCallback(async () => {
    await dispatch(syncActions.resetSyncState());
    await resetAppStore();
    await initStoreSetup();
  }, [dispatch, resetAppStore, initStoreSetup]);

  useEffect(() => {
    async function callHandleSuccess() {
      if (sync.status === ThunkActionStatuses.Fulfilled) {
        await handleSyncSuccess();
      }
    }
    callHandleSuccess();
  }, [handleSyncSuccess, sync.status]);
};

export default useBackgroundSync;
