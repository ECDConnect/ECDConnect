import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
  Checkbox,
  DropDownOption,
  Dropdown,
  Typography,
} from '@ecdlink/ui';
import { useHistory } from 'react-router';
import PositiveEmoticon from '@/assets/positive-bonus-emoticon.png';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { clubSelectors } from '@/store/club';
import { useCallback, useEffect, useState } from 'react';
import {
  notificationActions,
  notificationsSelectors,
} from '@/store/notifications';
import { notificationTagConfig } from '@/constants/notifications';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  ClubActions,
  acceptNewClubLeaderRole,
} from '@/store/club/club.actions';
import { useSnackbar } from '@ecdlink/core';
import { disableBackendNotification } from '@/store/notifications/notifications.actions';
import { practitionerSelectors } from '@/store/practitioner';

export const AcceptClubLeaderRole: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<string>();
  const [isAccepted, setIsAccepted] = useState(false);

  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubForPractitionerSelector);
  const notification = useSelector(
    notificationsSelectors.getAllNotifications
  ).find((item) =>
    item?.message?.cta?.includes(
      notificationTagConfig?.AcceptAgreement?.cta ?? ''
    )
  );

  const { isLoading: isLoadingClub } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUB_FOR_USER
  );

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.ACCEPT_NEW_CLUB_LEADER_ROLE
  );

  const activityId = 'club-leader-agreement';

  const practitionerId = club?.clubMembers?.find(
    (member) => member.userId === user?.id
  )?.practitionerId;

  const membersOptions: DropDownOption<string>[] =
    club?.clubMembers
      ?.filter((member) => member.userId !== user?.id)
      ?.map((member) => ({
        label: `${member.firstName} ${member.surname}`,
        value: member.practitionerId,
      })) || [];

  const onBack = useCallback(() => {
    history.push(
      ROUTES.PRACTITIONER.COMMUNITY[
        practitioner?.isNewInClub ? 'WELCOME' : 'ROOT'
      ]
    );
  }, [history, practitioner?.isNewInClub]);

  const onSubmit = async () => {
    if (!isOnline) {
      return showMessage({
        message: 'You are offline. Please check your internet connection.',
        type: 'error',
      });
    }

    await appDispatch(
      acceptNewClubLeaderRole({
        clubId: club?.id ?? '',
        clubSupportPractitionerId: selectedMember ?? '',
        practitionerId,
      })
    );
  };

  const onCallback = useCallback(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error?.message,
          type: 'error',
        });
      } else {
        showMessage({
          message: 'You have accepted the club leader role!',
        });
        appDispatch(notificationActions.removeNotification(notification!));
        appDispatch(
          disableBackendNotification({
            notificationId: notification?.message?.reference ?? '',
          })
        );
        history.push(ROUTES.PRACTITIONER.COMMUNITY.CLUB.ROOT);
      }
    }
  }, [
    appDispatch,
    error?.message,
    history,
    isLoading,
    isRejected,
    notification,
    showMessage,
    wasLoading,
  ]);

  useEffect(() => {
    onCallback();
  }, [onCallback]);

  useEffect(() => {
    if (!notification) {
      onBack();
    }
  }, [notification, onBack]);

  return (
    <BannerWrapper
      isLoading={isLoadingClub}
      showBackground={false}
      size="medium"
      renderBorder
      title="Accept club leader role"
      subTitle={club?.name}
      color="primary"
      className="flex flex-col p-4 pt-6"
      onBack={onBack}
      displayOffline={!isOnline}
    >
      <Typography type="h2" text="Accept the club leader agreement" />
      <Alert
        className="my-4"
        type="successLight"
        customIcon={
          <div className="h-24 w-24">
            <img src={PositiveEmoticon} alt="positive emoticon" />
          </div>
        }
        title={`You have been selected as the ${
          club?.name
        } club leader for ${new Date().getFullYear()}!`}
        message={`Well done ${user?.firstName}! You were chosen because you are a leader in your community.`}
        messageColor="textDark"
      />
      <Dropdown<string>
        label="Choose another club member who can upload images & take attendance for the club."
        subLabel="You can change this at any time."
        placeholder="Select club member"
        list={membersOptions}
        selectedValue={selectedMember}
        onChange={setSelectedMember}
        className="mb-4"
      />
      <Typography className="mb-4" type="h4" text="Club leader agreement" />
      <Checkbox
        descriptionColor="textDark"
        description={
          <div className="text-textMid">
            I accept the{' '}
            <button
              className="text-secondary border-secondary border-b"
              onClick={() =>
                history.push(
                  ROUTES.COMMUNITY.HELP.replace(
                    ':clubId',
                    club?.id ?? ''
                  ).replace(':activityId', activityId)
                )
              }
            >
              club leader commitment
            </button>
          </div>
        }
        checked={isAccepted}
        onCheckboxChange={(event) => setIsAccepted(event.checked)}
      />
      <Alert
        className="my-4"
        type="info"
        title="If you do not agree or if you have any concerns or questions, please contact your coach."
        button={
          <Button
            icon="ChatIcon"
            type="filled"
            color="primary"
            textColor="white"
            text="Contact coach"
            onClick={() =>
              history.push(
                ROUTES.COMMUNITY.CLUB.USER_PROFILE.COACH.replace(
                  ':clubId',
                  club?.id ?? ''
                ).replace(':coachId', club?.clubCoach.userId!)
              )
            }
          />
        }
      />
      {isAccepted && (
        <Alert
          className="mb-4"
          type="successLight"
          title="Great! Your signature will be added when you tap save."
        />
      )}
      <Button
        isLoading={isLoading}
        disabled={!isAccepted || !selectedMember || isLoading}
        className="mt-auto"
        icon="SaveIcon"
        type="filled"
        color="primary"
        textColor="white"
        text="Save"
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
