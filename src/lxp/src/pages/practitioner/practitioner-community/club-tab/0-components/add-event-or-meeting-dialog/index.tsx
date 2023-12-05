import { HostFamilyDaysRouteState } from '@/pages/community/clubs-tab/club/club-points/activities/host-family-days/index.types';
import ROUTES from '@/routes/routes';
import { clubSelectors } from '@/store/club';
import { ActionModal } from '@ecdlink/ui';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const AddEventOrMeetingDialog = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const history = useHistory();

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

  return (
    <ActionModal
      title="What do you want to add?"
      customIcon={
        <QuestionMarkCircleIcon className="text-infoMain h-10 w-10" />
      }
      actionButtons={[
        {
          colour: 'primary',
          text: 'Monthly meeting',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'CalendarIcon',
          onClick: () => {
            history.push(
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING
            );
            onClose();
          },
        },
        {
          colour: 'primary',
          text: 'Family day',
          textColour: 'primary',
          type: 'outlined',
          leadingIcon: 'CalendarIcon',
          onClick: () => {
            history.push(
              ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT.replace(
                ':clubId',
                club?.id ?? ''
              ),
              {
                isFromAddFamilyDayEvent: true,
              } as HostFamilyDaysRouteState
            );
            onClose();
          },
        },
      ]}
    />
  );
};
