import { BannerWrapper } from '@ecdlink/ui';
import { Step1 } from './components/step-1';
import { useCallback, useEffect, useState } from 'react';
import { Step2 } from './components/step-2';
import { useAppDispatch } from '@/store';
import { coachThunkActions } from '@/store/coach';
import { ClubMeetingModelInput } from '@ecdlink/graphql';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { startOfQuarter, lastDayOfQuarter } from 'date-fns';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import { userSelectors } from '@/store/user';

export enum CoachingCircleSteps {
  AddCoachingCircleStepOne = 1,
  AddCoachingCircleStepTwo = 2,
}

export interface CoachingCirclesAttendanceProps {
  practitionerId: string;
  attended: boolean;
}

interface AddCoachingCircleProps {
  setShowAddCircles: (item: boolean) => void;
  setShowSuccessCircleMeetingAdded: (item: boolean) => void;
}

export const AddCoachingCircle: React.FC<AddCoachingCircleProps> = ({
  setShowAddCircles,
  setShowSuccessCircleMeetingAdded,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const user = useSelector(userSelectors.getUser);
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [addCoachingCircleForm, setAddCoachingCircleForm] =
    useState<ClubMeetingModelInput>({
      clubId: '',
      meetingDate: '',
    });
  const [activeStep, setActiveStep] = useState(1);
  const [coachingCircleAttendance, setCoachingCircleAttendance] =
    useState<CoachingCirclesAttendanceProps[]>();
  const coach = useSelector(coachSelectors.getCoach);

  const AddCoachingCircleSteps = (step: CoachingCircleSteps) => {
    switch (step) {
      case CoachingCircleSteps?.AddCoachingCircleStepTwo:
        return (
          <Step2
            setCoachingCircleAttendance={setCoachingCircleAttendance}
            addCoachingCircle={addCoachingCircle}
          />
        );
      default:
        return (
          <Step1
            setActiveStep={setActiveStep}
            activeStep={activeStep}
            setAddCoachingCircleForm={setAddCoachingCircleForm}
            addCoachingCircleForm={addCoachingCircleForm}
          />
        );
    }
  };

  const addCoachingCircle = useCallback(() => {
    const input: ClubMeetingModelInput = {
      name: 'Test 1',
      clubId: addCoachingCircleForm?.clubId,
      meetingDate: addCoachingCircleForm?.meetingDate,
      meetingNotes: addCoachingCircleForm?.meetingNotes,
      clubMeetingParticipants: coachingCircleAttendance,
    };

    const quarterStartDate = startOfQuarter(new Date());
    const quarterLastDay = lastDayOfQuarter(new Date());

    appDispatch(coachThunkActions?.addCoachCircleMeeting({ input }));
    appDispatch(
      coachThunkActions.getAllCoachingCircleClubsForCoach({
        coachId: user?.id || '',
        startDate: quarterStartDate,
        endDate: quarterLastDay,
      })
    ).unwrap();
    setShowAddCircles(false);
    setShowSuccessCircleMeetingAdded(true);
  }, [
    addCoachingCircleForm?.clubId,
    addCoachingCircleForm?.meetingDate,
    addCoachingCircleForm?.meetingNotes,
    appDispatch,
    coachingCircleAttendance,
    setShowAddCircles,
    setShowSuccessCircleMeetingAdded,
    user?.id,
  ]);

  const getContent = useCallback(async () => {
    if (!isOnline) return;

    appDispatch(
      coachThunkActions.getCoachingCircleTopics({
        locale: language.locale,
      })
    );
  }, [appDispatch, isOnline, language.locale]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <>
      <BannerWrapper
        size={'normal'}
        renderBorder={true}
        title={'Add a coaching circle'}
        subTitle={`step ${activeStep}  of 2`}
        onBack={() => setShowAddCircles(false)}
        renderOverflow
        backgroundColour={'white'}
      >
        {AddCoachingCircleSteps(activeStep)}
      </BannerWrapper>
    </>
  );
};
