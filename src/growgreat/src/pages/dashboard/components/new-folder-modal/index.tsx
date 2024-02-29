import ROUTES from '@/routes/routes';
import { ActionModal } from '@ecdlink/ui';
import { useHistory } from 'react-router';

interface NewFolderModalProps {
  onClose: () => void;
}

export const NewFolderModal = ({ onClose }: NewFolderModalProps) => {
  const history = useHistory();

  return (
    <ActionModal
      className="z-50"
      title="Open a new folder"
      actionButtons={[
        {
          colour: 'primary',
          text: 'Pregnant mom',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'UserAddIcon',
          onClick: async () => {
            onClose();
            history.push(ROUTES.MOM_REGISTER);
          },
        },
        {
          colour: 'primary',
          text: 'Child',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'UserGroupIcon',
          onClick: () => {
            onClose();
            history.push(ROUTES.INFANT_REGISTER);
          },
        },
      ]}
    />
  );
};
