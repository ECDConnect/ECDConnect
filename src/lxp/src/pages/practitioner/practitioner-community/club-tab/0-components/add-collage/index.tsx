import ROUTES from '@/routes/routes';
import { ActionModal } from '@ecdlink/ui';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router';

export const AddCollageDialog = ({ onClose }: { onClose: () => void }) => {
  const history = useHistory();

  return (
    <ActionModal
      title="Meeting added!"
      detailText="Would you like to add a collage of your “Be creative” activity now?"
      customIcon={<CheckCircleIcon className="text-successMain h-10 w-10" />}
      actionButtons={[
        {
          colour: 'primary',
          text: 'Add collage',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'PhotographIcon',
          onClick: () => {
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.COLLAGE_EVENT.ADD_EVENT
            );
            onClose();
          },
        },
        {
          colour: 'primary',
          text: 'Do this later',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'ClockIcon',
          onClick: () => {
            onClose();
          },
        },
      ]}
    />
  );
};
