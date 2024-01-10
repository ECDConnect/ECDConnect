import { BannerWrapper, Button, DialogPosition } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { Step3 } from './steps/step-3';
import { Step1Props, Step2Props, Step3Props } from './index.types';
import { getAvatarColor, useDialog, useSnackbar } from '@ecdlink/core';
import { AddCollageDialog } from '../../0-components/add-collage';
import { ClubMeetingInput } from '@/services/ClubService/types';
import { useSelector } from 'react-redux';
import { clubActions, clubSelectors, clubThunkActions } from '@/store/club';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { OfflineModal } from '../../0-components/offline-modal';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import { ListDataItem } from '@/pages/calendar/components/calendar.types';

export const AddMeeting: React.FC = () => {
  const [step1, setStep1] = useState<Step1Props>();
  const [step2, setStep2] = useState<Step2Props>();
  const [step3, setStep3] = useState<Step3Props>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

  const history = useHistory();

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const { showMessage } = useSnackbar();

  const { isOnline } = useOnlineStatus();

  const addCalendarEvent = useCalendarAddEvent();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.ADD_CLUB_MEETING
  );

  const isFirstStep = step === 0;
  const isSecondStep = step === 1;
  const isLastStep = step === 2;

  const isScheduleInCalendar = step1?.hasMeetingHappened === false;
  const isNext = !isLastStep && !isScheduleInCalendar;

  const guests = useMemo(
    (): ListDataItem[] =>
      club?.clubMembers?.map((member) => ({
        id: member.userId,
        profileDataUrl: member.profileImageUrl,
        title: `${member.firstName ?? ''} ${member.surname ?? ''}`,
        alertSeverity: 'none',
        avatarColor: getAvatarColor() || '',
        hideAlertSeverity: true,
        extraData: {
          userId: member.userId,
          firstName: member.firstName,
          surname: member.surname,
          isClub: true,
        },
      })) ?? [],
    [club?.clubMembers]
  );

  const coachGuest = {
    id: club?.clubCoach?.userId,
    profileDataUrl: club?.clubCoach?.profileImageUrl,
    title: `${club?.clubCoach?.firstName ?? ''} ${
      club?.clubCoach?.surname ?? ''
    }`,
    alertSeverity: 'none',
    avatarColor: getAvatarColor() || '',
    hideAlertSeverity: true,
    extraData: {
      userId: club?.clubCoach?.userId,
      firstName: club?.clubCoach?.firstName,
      surname: club?.clubCoach?.surname,
      isClub: true,
    },
  } as ListDataItem;

  const onAddCollage = () => {
    if (!step3?.createdResource) return;

    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <AddCollageDialog onClose={onClose} />;
      },
    });
  };

  const onOffline = () => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return (
          <OfflineModal
            title="Meeting added! Go online to update"
            detailText="To make sure your meeting register is submitted to SmartStart before the deadline, please go online again as soon as possible."
            onClose={onClose}
          />
        );
      },
    });
  };

  const onSuccess = useCallback(() => {
    appDispatch(clubActions.forceMeetRegularlyDataReload());

    showMessage({
      message: `Meeting added! ${
        !isOnline ? 'It will be updated when you sync the app.' : ''
      }`,
      type: 'success',
      duration: isOnline ? 5000 : 10000,
    });
  }, [appDispatch, isOnline, showMessage]);

  const onSubmit = async () => {
    const payload: ClubMeetingInput = {
      meetingDate: step1?.date ?? '',
      meetingNotes: step3?.meetingNotes ?? '',
      clubId: club?.id ?? '',
      coachAttend: step3?.coachAttend ?? false,
      totalCaregiversAttended: 0,
      clubMeetingParticipants: step2?.participants ?? [],
    };

    appDispatch(clubActions.addClubMeeting(payload));

    if (isOnline) {
      await appDispatch(clubThunkActions.addClubMeeting(payload));
      onAddCollage();
    }

    if (!isOnline) {
      onOffline();
      onSuccess();
      history.goBack();
    }
  };

  const handleOnClick = () => {
    if (isNext) {
      setStep((prevStep) => prevStep + 1);
    } else if (isScheduleInCalendar) {
      const hours = new Date().toISOString().split('T')[1];
      const formattedDate = new Date(`${step1.date}T${hours}`);
      const start = formattedDate.toISOString();
      formattedDate.setHours(formattedDate.getHours() + 1);
      const end = formattedDate.toISOString();

      addCalendarEvent({
        guests: [coachGuest, ...guests],
        event: {
          eventTypeDisabled: true,
          eventType: 'Club Monthly Meeting',
          start,
          end,
        },
        onUpdated: () => {
          onSuccess();
          history.goBack();
        },
      });
    } else {
      onSubmit();
    }
  };

  const onClose = () => {
    history.goBack();
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep((prevStep) => prevStep - 1);
  };

  const renderButtonInfo = useMemo((): { icon: string; text: string } => {
    if (isScheduleInCalendar) {
      return {
        icon: 'CalendarIcon',
        text: 'Schedule in calendar',
      };
    }

    if (isNext) {
      return {
        icon: 'ArrowCircleRightIcon',
        text: 'Next',
      };
    }

    return {
      icon: 'SaveIcon',
      text: 'Save',
    };
  }, [isNext, isScheduleInCalendar]);

  useEffect(() => {
    if (isOnline && wasLoading && !isLoading) {
      if (isRejected) {
        showMessage({
          message: error,
          type: 'error',
        });
      } else {
        onSuccess();
        history.goBack();
      }
    }
  }, [
    appDispatch,
    club?.id,
    error,
    history,
    isLoading,
    isOnline,
    isRejected,
    onSuccess,
    showMessage,
    wasLoading,
  ]);

  return (
    <BannerWrapper
      renderBorder
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a meeting"
      subTitle={isScheduleInCalendar ? 'step 1 of 1' : `step ${step + 1} of 3`}
      onBack={handleOnBack}
      displayOffline={!isOnline}
    >
      {isFirstStep && (
        <Step1 setIsEnabledButton={setIsEnabledButton} setStep1={setStep1} />
      )}
      {isSecondStep && (
        <Step2 setIsEnabledButton={setIsEnabledButton} setStep2={setStep2} />
      )}
      {isLastStep && (
        <Step3 setIsEnabledButton={setIsEnabledButton} setStep3={setStep3} />
      )}
      <Button
        className="mt-auto"
        isLoading={isLoading}
        icon={renderButtonInfo.icon}
        type="filled"
        color="primary"
        textColor="white"
        text={renderButtonInfo.text}
        disabled={!isEnabledButton || isLoading}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
