import React, { useState } from 'react';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useHistory } from 'react-router-dom';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useAppDispatch, useAppSelector } from '@store';
import { syncActions, syncThunkActions } from '@store/sync';
import { ThunkActionStatuses } from '@store/types';
import OfflineSyncError from '../offline-sync/offline-sync-error';
import { OfflineSyncExecuting } from '../offline-sync/offline-sync-executing';
import { LogoutInformation } from './logout-information';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { settingActions } from '@/store/settings';
import ROUTES from '@/routes/routes';

export type LogoutModalProps = {
  onSubmit: () => void;
  onCancel?: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onSubmit, onCancel }) => {
  const { isOnline } = useOnlineStatus();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [unableToSync, setUnableToSync] = useState(false);
  const { resetAppStore, resetAuth } = useStoreSetup();
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const { status, error, currentAction, currentStep, stepTotal } =
    useAppSelector((state) => state.sync);

  const sync = async () => {
    if (practitioner?.isPrincipal === true) {
      await dispatch(syncThunkActions.syncOfflineData({}));
    } else {
      await dispatch(syncThunkActions.syncOfflineDataForPractitioner({}));
    }

    dispatch(settingActions.setLastDataSync());
  };

  const handleSync = async () => {
    if (isOnline) {
      await sync();
      await resetAppStore();
      await resetAuth();
      history.push('/');
    } else {
      history.push(ROUTES.LOGIN);
      onCancel?.();
    }
  };

  const handleOnErrorSubmit = () => {
    setUnableToSync(false);
    dispatch(syncActions.setError(undefined));
    handleSync();
  };

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
    <LogoutInformation
      isOnline={isOnline}
      onSubmit={handleSync}
      onCancel={onCancel}
    ></LogoutInformation>
  );
};

export default LogoutModal;
