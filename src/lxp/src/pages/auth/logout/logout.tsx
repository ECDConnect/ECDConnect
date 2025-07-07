import { ActionModal, DialogPosition, Dialog } from '@ecdlink/ui';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';
import { syncThunkActions } from '@/store/sync';
import { useAppDispatch } from '@/store';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { settingActions } from '@/store/settings';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const Logout: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const { resetAuth, resetAppStore } = useStoreSetup();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
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
    }
  };

  return (
    <Dialog
      visible
      position={DialogPosition.Middle}
      fullScreen
      className="overflow-auto"
    >
      <ActionModal
        className={'mx-4'}
        title={'Are you sure you want to log out?'}
        importantText={''}
        icon={'ExclamationCircleIcon'}
        iconColor={'alertDark'}
        iconBorderColor={'alertBg'}
        actionButtons={[
          {
            text: 'Yes, log out',
            colour: 'quatenary',
            onClick: handleSync,
            type: 'filled',
            textColour: 'white',
            leadingIcon: 'CheckCircleIcon',
          },
          {
            text: 'No, cancel',
            textColour: 'white',
            colour: 'quatenary',
            type: 'filled',
            onClick: () => history.push(ROUTES.DASHBOARD),
            leadingIcon: 'XCircleIcon',
          },
        ]}
      />
    </Dialog>
  );
};
