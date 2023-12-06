import { BeCreativeRouteState } from '@/pages/community/clubs-tab/club/club-points/activities/be-creative/index.types';
import ROUTES from '@/routes/routes';
import { clubSelectors } from '@/store/club';
import { ActionModal } from '@ecdlink/ui';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const AddCollageDialog = ({ onClose }: { onClose: () => void }) => {
  const history = useHistory();

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

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
              ROUTES.COMMUNITY.CLUB.POINTS.BE_CREATIVE.replace(
                ':clubId',
                club?.id ?? ''
              ),
              {
                isFromAddCollageEvent: true,
              } as BeCreativeRouteState
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
            // TODO: add integration
            onClose();
          },
        },
      ]}
    />
  );
};
