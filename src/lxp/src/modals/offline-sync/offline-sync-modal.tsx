import React, { useState } from 'react';
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
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

export type OfflineSyncModalProps = {
  onSubmit: () => void;
  onCancel?: () => void;
  isManual?: boolean;
  generalMessageOveride?: string;
  recommendationTextOveride?: string;
};

const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({
  onSubmit,
  onCancel,
  isManual = false,
  generalMessageOveride,
  recommendationTextOveride,
}) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const [unableToSync, setUnableToSync] = useState(false);
  const { resetAppStore, initStoreSetup } = useStoreSetup();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const [isLoadingRefreshedData, setIsLoadingRefreshedData] = useState(false);

  const { status, error, currentAction, currentStep, stepTotal } =
    useAppSelector((state) => state.sync);

  const handleSync = async () => {
    if (practitioner?.isPrincipal === true) {
      await dispatch(syncThunkActions.syncOfflineData({}));
      dispatch(settingActions.setLastDataSync());
    } else {
      dispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
    }
    dispatch(settingActions.setLastDataSync());
  };

  const handleOnErrorSubmit = () => {
    setUnableToSync(false);
    dispatch(syncActions.setError(undefined));
    handleSync();
  };

  const handleSyncSuccess = async () => {
    setIsLoadingRefreshedData(true);
    dispatch(syncActions.resetSyncState());
    await resetAppStore(true, true);
    await initStoreSetup();
    setIsLoadingRefreshedData(false);
    window.location.reload();
    onSubmit();
  };

  if (status === ThunkActionStatuses.Fulfilled) {
    return (
      <OfflineSyncSuccess
        isLoading={isLoadingRefreshedData}
        onSubmit={handleSyncSuccess}
      ></OfflineSyncSuccess>
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
