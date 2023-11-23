import { BannerWrapper, Button } from '@ecdlink/ui';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { Step1 } from './steps/step-1';
import { Step2 } from './steps/step-2';
import { Step3 } from './steps/step-3';
import { useSnackbar } from '@ecdlink/core';
import { Step1Props, Step2Props, Step3Props } from './index.types';
import { ClubMeetingInput } from '@/services/ClubService/types';
import { useSelector } from 'react-redux';
import { clubActions, clubSelectors, clubThunkActions } from '@/store/club';
import { useAppDispatch } from '@/store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';

export const AddAFamilyDayEvent: React.FC = () => {
  const [step1, setStep1] = useState<Step1Props>();
  const [step2, setStep2] = useState<Step2Props>();
  const [step3, setStep3] = useState<Step3Props>();

  const [step, setStep] = useState(0);
  const [isEnabledButton, setIsEnabledButton] = useState(false);

  const club = useSelector(clubSelectors.getClubForPractitionerSelector);

  const history = useHistory();
  const { showMessage } = useSnackbar();

  const appDispatch = useAppDispatch();

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.ADD_FAMILY_DAY_MEETING
  );

  const { isOnline } = useOnlineStatus();

  const isFirstStep = step === 0;
  const isSecondStep = step === 1;
  const isLastStep = step === 2;

  const isNext = !isLastStep;

  const termConfig = useMemo(() => {
    const month = new Date().getMonth();

    if (month >= 0 && month <= 3) {
      return {
        term: 'Term 1',
        initialMonth: 'January',
        lastMonth: 'April',
      };
    } else if (month >= 4 && month <= 6) {
      return {
        term: 'Term 2',
        initialMonth: 'May',
        lastMonth: 'July',
      };
    } else if (month >= 7 && month <= 9) {
      return {
        term: 'Term 3',
        initialMonth: 'August',
        lastMonth: 'October',
      };
    }
  }, []);

  const formatDate = (date: Date) => {
    // "2023-11-01 08:00"
    return `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const onClose = () => {
    history.goBack();
  };

  const onSuccess = useCallback(() => {
    showMessage({ message: 'Event added!' });
  }, [showMessage]);

  const onSubmit = () => {
    const payload: ClubMeetingInput = {
      clubId: club?.id ?? '',
      meetingType: step1?.meetingType ?? '',
      meetingNotes: step1?.meetingNotes ?? '',
      totalCaregiversAttended: step3?.totalCaregiversAttended ?? 0,
      meetingDate: formatDate(new Date()),
      clubMeetingParticipants: step2?.participants ?? [],
      fileType: step3?.fileType ?? '',
      imageBase64: step3?.imageBase64 ?? '',
    };

    appDispatch(clubActions.addFamilyDayMeeting(payload));

    if (isOnline) {
      appDispatch(clubThunkActions.addFamilyDayMeeting(payload));
    }

    if (!isOnline) {
      onSuccess();
      onClose();
    }
  };

  const handleOnClick = () => {
    if (isNext) {
      setStep((prevStep) => prevStep + 1);
    } else {
      onSubmit();
    }
  };

  const handleOnBack = () => {
    if (isFirstStep) {
      return onClose();
    }

    setStep((prevStep) => prevStep - 1);
  };

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
      displayOffline={!isOnline}
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add a family day event"
      subTitle={`step ${step + 1} of 3`}
      onBack={handleOnBack}
    >
      {isFirstStep && (
        <Step1
          termConfig={termConfig}
          setIsEnabledButton={setIsEnabledButton}
          setStep1={setStep1}
        />
      )}
      {isSecondStep && (
        <Step2
          termConfig={termConfig}
          setIsEnabledButton={setIsEnabledButton}
          setStep2={setStep2}
        />
      )}
      {isLastStep && (
        <Step3
          termConfig={termConfig}
          setIsEnabledButton={setIsEnabledButton}
          setStep3={setStep3}
        />
      )}
      <Button
        className="mt-auto"
        icon={!isLastStep ? 'ArrowCircleRightIcon' : 'SaveIcon'}
        type="filled"
        color="primary"
        textColor="white"
        text={!isLastStep ? 'Next' : 'Save'}
        disabled={!isEnabledButton || isLoading}
        isLoading={isLoading}
        onClick={handleOnClick}
      />
    </BannerWrapper>
  );
};
