import { ActionModal, BannerWrapper } from '@ecdlink/ui';
import { DialogPosition, Dialog } from '@ecdlink/ui';
import { useStoreSetup } from '@hooks/useStoreSetup';
import { useHistory } from 'react-router-dom';
import { useDialog } from '@ecdlink/core';
import ROUTES from '@/routes/routes';

export const Logout: React.FC = () => {
  const { resetAuth, resetAppStore } = useStoreSetup();
  const history = useHistory();
  const dialog = useDialog();

  return (
    <Dialog
      visible={true}
      position={DialogPosition.Middle}
      fullScreen
      className="overflow-auto"
    >
      <ActionModal
        className={'mx-4'}
        title={'Logout & reset data'}
        importantText={'Are you sure want to log out'}
        icon={'ExclamationCircleIcon'}
        iconColor={'alertDark'}
        iconBorderColor={'alertBg'}
        actionButtons={[
          {
            text: 'Okay',
            colour: 'primary',
            onClick: async () => {
              //   onSubmit();
              await resetAuth();
              await resetAppStore();
              history.push('/');
            },
            type: 'filled',
            textColour: 'white',
            leadingIcon: 'CheckCircleIcon',
          },
          {
            text: 'Cancel',
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
