import { DialogPosition, Dialog, ActionModal } from '@ecdlink/ui';
import { useStoreSetup } from '@/hooks/useStoreSetup';
import { useHistory } from 'react-router-dom';
import ROUTES from '@/routes/routes';

export const Logout: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();

  const history = useHistory();

  return (
    <Dialog
      fullScreen
      visible={true}
      className="overflow-auto"
      position={DialogPosition.Middle}
    >
      <ActionModal
        className={'mx-4'}
        importantText={''}
        iconColor={'alertDark'}
        iconBorderColor={'alertBg'}
        icon={'ExclamationCircleIcon'}
        title={'Are you sure you want to log out?'}
        actionButtons={[
          {
            text: 'Yes, log out',
            colour: 'primary',
            type: 'filled',
            textColour: 'white',
            onClick: async () => {
              await resetAuth();
              await resetAppStore();
              history.push('/');
            },
            leadingIcon: 'CheckCircleIcon',
          },
          {
            type: 'filled',
            colour: 'primary',
            text: 'No, cancel',
            textColour: 'white',
            leadingIcon: 'XCircleIcon',
            onClick: () => history.push(ROUTES.DASHBOARD),
          },
        ]}
      />
    </Dialog>
  );
};
