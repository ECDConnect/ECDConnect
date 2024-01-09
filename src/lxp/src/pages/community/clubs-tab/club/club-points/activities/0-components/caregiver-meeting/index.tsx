import { ActionModal, Dialog, DialogPosition } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as Robot } from '@/assets/iconRobot.svg';
import { useSnackbar } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { useHistory, useParams } from 'react-router';
import { ClubsRouteState } from '@/pages/community/clubs-tab/index.types';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { clubActions, clubSelectors } from '@/store/club';
import {
  ClubActions,
  addCaregiverReportBackMeeting,
} from '@/store/club/club.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

interface CaregiverMeetingProps {
  isToShowWellDoneMessage: boolean;
  onClose: () => void;
}

export const CaregiverMeeting = ({
  onClose,
  isToShowWellDoneMessage,
}: CaregiverMeetingProps) => {
  const [isLogCaregiverMeeting, setIsLogCaregiverMeeting] = useState<boolean>();

  const currentMonth = new Date().getMonth();
  const isAfterJuly = currentMonth > 6;

  const history = useHistory();
  const { showMessage } = useSnackbar();
  const appDispatch = useAppDispatch();

  const { clubId } = useParams<ClubsRouteState>();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.ADD_CAREGIVER_REPORT_BACK_MEETING
  );

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const user = useSelector(userSelectors.getUser);

  const { isOnline } = useOnlineStatus();

  const onSubmitCaregiverReportBack = useCallback(() => {
    const input = { clubId: clubId, userId: user?.id! };

    appDispatch(clubActions.addCaregiverReportBackMeeting(input));

    if (isOnline) {
      appDispatch(addCaregiverReportBackMeeting(input));
    } else {
      showMessage({
        message: `Saved, remember to sync changes next time you are online`,
        type: 'success',
      });
    }
  }, [clubId, user?.id, appDispatch, isOnline, showMessage]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error,
          type: 'error',
        });
      } else {
        showMessage({
          message: `Submitted`,
          type: 'success',
        });
        onClose();
      }
    }
  }, [error, isLoading, isRejected, onClose, showMessage, wasLoading]);

  const config: {
    title: string;
    detailText: string;
    primaryButtonIcon: string;
    primaryButtonText: string;
    primaryButtonOnClick: () => void;
    secondaryButtonText: string;
    secondaryButtonOnClick: () => void;
  } = useMemo(() => {
    if (isLogCaregiverMeeting !== false) {
      return {
        title:
          'Did you hold a caregiver meeting to share progress reports with caregivers?',
        detailText: isToShowWellDoneMessage
          ? 'Well done on finishing all of your progress reports!'
          : '',
        primaryButtonIcon: 'CheckIcon',
        primaryButtonText: 'Yes I did!',
        primaryButtonOnClick: onSubmitCaregiverReportBack,
        secondaryButtonText: 'Not yet',
        secondaryButtonOnClick: () => setIsLogCaregiverMeeting(false),
      };
    }

    return {
      title: 'Oh no!',
      detailText: `Make sure to meet with caregivers before ${
        isAfterJuly ? '30 November for the November' : '31 July for the June'
      } progress period!
      Reach out to your coach if you need support.`,
      primaryButtonIcon: 'PhoneIcon',
      primaryButtonText: 'Contact coach',
      primaryButtonOnClick: () =>
        history.push(
          ROUTES.COMMUNITY.CLUB.USER_PROFILE.COACH.replace(
            ':clubId',
            clubId
          ).replace(':coachId', club?.clubCoach?.userId ?? '')
        ),
      secondaryButtonText: 'Close',
      secondaryButtonOnClick: onClose,
    };
  }, [
    club?.clubCoach?.userId,
    clubId,
    history,
    isAfterJuly,
    isLogCaregiverMeeting,
    isToShowWellDoneMessage,
    onClose,
    onSubmitCaregiverReportBack,
  ]);

  return (
    <Dialog className="m-4" visible position={DialogPosition.Middle}>
      <ActionModal
        customIcon={<Robot className="mb-4" />}
        title={config.title}
        detailText={config.detailText}
        actionButtons={[
          {
            isLoading,
            disabled: isLoading,
            type: 'filled',
            colour: 'primary',
            textColour: 'white',
            text: config.primaryButtonText,
            leadingIcon: config.primaryButtonIcon,
            onClick: config.primaryButtonOnClick,
          },
          {
            disabled: isLoading,
            type: 'outlined',
            colour: 'primary',
            textColour: 'primary',
            text: config.secondaryButtonText,
            leadingIcon: 'XIcon',
            onClick: config.secondaryButtonOnClick,
          },
        ]}
      />
    </Dialog>
  );
};
