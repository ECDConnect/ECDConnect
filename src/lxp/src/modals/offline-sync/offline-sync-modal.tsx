import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch, useAppSelector } from '@store';
import { settingActions, settingSelectors } from '@store/settings';
import { syncActions, syncThunkActions } from '@store/sync';
import { ThunkActionStatuses } from '@store/types';
import OfflineSyncError from './offline-sync-error';
import { OfflineSyncExecuting } from './offline-sync-executing';
import { OfflineSyncInformation } from './offline-sync-information';
import OfflineSyncSuccess from './offline-sync-success';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { authSelectors } from '@/store/auth';
import { SettingsService } from '@/services/SettingsService';

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
  const userAuth = useSelector(authSelectors.getAuthUser);
  const [unableToSync, setUnableToSync] = useState(false);
  const { resetAppStore, initStoreSetup } = useStoreSetup();
  const history = useHistory();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const lastDataSyncDate = useSelector(
    settingSelectors.getLasUnformattedDataSync
  );

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
    asyncCheck();
  };

  const asyncCheck = async () => {
    if (userAuth?.auth_token) {
      const asyncCheckresponse = await new SettingsService(
        userAuth?.auth_token!
      ).queryChangesToSync(lastDataSyncDate);

      if (asyncCheckresponse === false) {
        window.location.reload();
      }
    }
  };

  const handleOnErrorSubmit = () => {
    setUnableToSync(false);
    dispatch(syncActions.setError(undefined));
    handleSync();
  };

  const handleSyncSuccess = async () => {
    onSubmit();
    await dispatch(syncActions.resetSyncState());
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
