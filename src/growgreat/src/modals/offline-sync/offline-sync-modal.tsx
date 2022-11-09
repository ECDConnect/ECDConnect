import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch, useAppSelector } from '@store';
import { settingActions } from '@store/settings';
import { syncActions, syncThunkActions } from '@store/sync';
import { ThunkActionStatuses } from '@store/types';
import OfflineSyncError from './offline-sync-error';
import { OfflineSyncExecuting } from './offline-sync-executing';
import { OfflineSyncInformation } from './offline-sync-information';
import OfflineSyncSuccess from './offline-sync-success';
import ROUTES from '@routes/routes';

export type OfflineSyncModalProps = {
  onSubmit: () => void;
  onCancel?: () => void;
  isManual?: boolean;
  avoidNavigation?: boolean;
  generalMessageOveride?: string;
  recommendationTextOveride?: string;
};

const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  onSubmit,
  onCancel,
  isManual = false,
  avoidNavigation = false,
  generalMessageOveride,
  recommendationTextOveride,
}) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const [unableToSync, setUnableToSync] = useState(false);
  const { resetAppStore, initStoreSetup } = useStoreSetup();
  const history = useHistory();

  const { status, error, currentAction, currentStep, stepTotal } =
    useAppSelector((state) => state.sync);

  const handleSync = () => {
    dispatch(syncThunkActions.syncOfflineData({}));
    dispatch(settingActions.setLastDataSync());
  };

  const handleOnErrorSubmit = () => {
    setUnableToSync(false);
    dispatch(syncActions.setError(undefined));
    handleSync();
  };

  const handleSyncSuccess = async () => {
    onSubmit();
    await dispatch(syncActions.clearSyncState());
    await resetAppStore();
    await initStoreSetup();
    if (!avoidNavigation) history.push(ROUTES.ROOT);
  };

  if (status === ThunkActionStatuses.Fulfilled) {
    return (
      <OfflineSyncSuccess onSubmit={handleSyncSuccess}></OfflineSyncSuccess>
    );
  }

  if (unableToSync) {
    return (
      <OfflineSyncError
        onSubmit={handleOnErrorSubmit}
        onCancel={onCancel}
      ></OfflineSyncError>
    );
  }

  if (
    (status === ThunkActionStatuses.Pending && currentAction) ||
    (status === ThunkActionStatuses.Rejected && error)
  ) {
    return (
      <OfflineSyncExecuting
        title={currentAction}
        step={currentStep}
        stepTotal={stepTotal}
        error={error}
        onSyncIssueClick={() => setUnableToSync(true)}
      ></OfflineSyncExecuting>
    );
  }

  return (
    <OfflineSyncInformation
      generalMessageOveride={generalMessageOveride}
      recommendationTextOveride={recommendationTextOveride}
      isManual={isManual}
      isOnline={isOnline}
      onSubmit={handleSync}
      onCancel={onCancel}
    ></OfflineSyncInformation>
  );
};

export default OfflineSyncModal;
