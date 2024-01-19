import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubsRouteState } from '@/pages/community/clubs-tab/index.types';
import { useAppDispatch } from '@/store';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { ClubActions } from '@/store/club/club.actions';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { useSnackbar } from '@ecdlink/core';
import { Alert, BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';

export const PlaygroupsReassigned = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const { showMessage } = useSnackbar();

  const { clubId } = useParams<ClubsRouteState>();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUB_MEETINGS_WITH_MISSING_REGISTERS
  );
  const { isLoading: isSubmitting } = useThunkFetchCall(
    'clubs',
    ClubActions.SET_CONTACT_CLUB_LEADER_STATUS_FOR_MEETING
  );

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const meetings = useSelector(
    clubSelectors.getClubMeetingsWithMissingRegistersSelector(clubId)
  );

  const clubLeaderFirstName = club?.clubLeader?.firstName;

  const onWhatsapp = () => {
    const whatsAppNumber = club?.clubLeader?.whatsAppNumber;

    if (whatsAppNumber) {
      return window.open(`whatsapp://send?text=${whatsAppNumber}`);
    }

    return showMessage({
      message: 'WhatsApp number is not available',
      type: 'error',
    });
  };

  const onCall = () => {
    const phoneNumber = club?.clubLeader?.phoneNumber;

    if (phoneNumber) {
      return window.open(`tel:${phoneNumber}`);
    }

    return showMessage({
      message: 'Phone number is not available',
      type: 'error',
    });
  };

  const onSubmit = () => {
    const promises = meetings?.map((meeting) =>
      appDispatch(
        clubThunkActions.setContactClubLeaderStatusForMeeting({
          clubMeetingId: meeting.id,
        })
      )
    );

    Promise.all(promises ?? []).then(() => {
      appDispatch(clubThunkActions.getClubById({ clubId }));
      history.goBack();
    });
  };

  useEffect(() => {
    appDispatch(
      clubThunkActions.getClubMeetingsWithMissingRegisters({ clubId })
    );
  }, [clubId, appDispatch]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      showBackground={false}
      className="flex flex-col p-4"
      size="small"
      title="Playgroups Reassigned"
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
    >
      <div className="flex gap-2">
        <Typography
          text={String(meetings?.length ?? 0)}
          type="h4"
          color="white"
          className="bg-alertMain h-6 w-6 rounded-full pt-px text-center"
        />
        <Typography text="Meeting registers missing this year" type="h4" />
      </div>
      <Typography
        type="h3"
        className="my-4"
        text="Reach out to the club leader"
      />
      <Typography
        type="body"
        text="Encourage the club to meet regularly. Reach out to the club leader and find out if they need help submitting the meeting attendance register each month."
      />
      <Typography
        type="h3"
        className="mt-4"
        text={`Contact ${clubLeaderFirstName}`}
      />
      <Typography
        type="body"
        className="mt-1"
        color="primary"
        text={`${
          club?.clubLeader?.phoneNumber ||
          club?.clubLeader?.whatsAppNumber ||
          '000 000 0000'
        }`}
      />
      <div className="my-4 flex flex-wrap justify-between gap-4">
        <Button
          className="flex-grow"
          type="outlined"
          color="primary"
          textColor="primary"
          onClick={onWhatsapp}
        >
          <img
            src={getLogo(LogoSvgs.whatsapp)}
            alt="whatsapp"
            className="mr-2"
          />
          <Typography
            type="button"
            text={`WhatsApp ${clubLeaderFirstName}`}
            color="primary"
          />
        </Button>
        <Button
          className="flex-grow"
          icon="PhoneIcon"
          type="outlined"
          color="primary"
          text={`Call ${clubLeaderFirstName}`}
          textColor="primary"
          onClick={onCall}
        />
      </div>
      <Alert
        type="info"
        title="WhatsApps and phone calls will be charged at your standard carrier rates."
      />
      <Button
        type="filled"
        color="primary"
        className="mt-auto"
        text="I have contacted the club leader"
        textColor="white"
        icon="CheckCircleIcon"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        onClick={onSubmit}
      />
    </BannerWrapper>
  );
};
