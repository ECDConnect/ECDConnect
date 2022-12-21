import { ActionModal, DialogPosition, Dialog } from '@ecdlink/ui';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';

export const Logout: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();
  const history = useHistory();

  return (
    <Dialog
      visible={true}
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
            colour: 'primary',
            onClick: async () => {
              await resetAuth();
              await resetAppStore();
              history.push('/');
            },
            type: 'filled',
            textColour: 'white',
            leadingIcon: 'CheckCircleIcon',
          },
          {
            text: 'No, cancel',
            textColour: 'white',
            colour: 'primary',
            type: 'filled',
            onClick: () => history.push(ROUTES.DASHBOARD),
            leadingIcon: 'XCircleIcon',
          },
        ]}
      />
    </Dialog>
  );
};
