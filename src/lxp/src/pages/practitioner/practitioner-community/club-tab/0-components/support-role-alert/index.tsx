import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useAppDispatch } from '@/store';
import { clubActions, clubThunkActions } from '@/store/club';
import { ClubActions } from '@/store/club/club.actions';
import { ActionModal } from '@ecdlink/ui';
import { ExclamationCircleIcon } from '@heroicons/react/solid';

export const SupportRoleAlert = ({
  onClose,
  practitionerId,
}: {
  practitionerId: string;
  onClose: () => void;
}) => {
  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.UPDATE_CLUB_SUPPORT_STATUS
  );

  const onSubmit = async () => {
    appDispatch(clubActions.updateClubSupportStatus({ practitionerId }));
    await appDispatch(
      clubThunkActions.updateClubSupportStatus({ practitionerId })
    );
    onClose();
  };

  return (
    <ActionModal
      title="You have been given the club support role!"
      detailText="Your club lead has chosen you for this role. You can submit meetings, events and images to support your club when your club leader can't!"
      customIcon={<ExclamationCircleIcon className="text-infoMain h-10 w-10" />}
      actionButtons={[
        {
          isLoading,
          disabled: isLoading,
          colour: 'primary',
          text: 'Get started',
          textColour: 'white',
          type: 'filled',
          leadingIcon: 'ArrowCircleRightIcon',
          onClick: () => {
            onSubmit();
          },
        },
      ]}
    />
  );
};
