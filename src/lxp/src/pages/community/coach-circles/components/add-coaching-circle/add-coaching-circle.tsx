import { BannerWrapper } from '@ecdlink/ui';
import { Step1 } from './components/step-1';
import { useCallback, useEffect, useState } from 'react';
import { Step2 } from './components/step-2';
import { useAppDispatch } from '@/store';
import { coachThunkActions } from '@/store/coach';
import { ClubMeetingModelInput } from '@ecdlink/graphql';

export enum ChildProgressAssessmentSteps {
  AddCoachingCircleStepOne = 1,
  AddCoachingCircleStepTwo = 2,
}

export interface CoachingCirclesAttendanceProps {
  practitionerId: string;
  attended: boolean;
}

interface AddCoachingCircleProps {
  setShowAddCircles: (item: boolean) => void;
}

export const AddCoachingCircle: React.FC<AddCoachingCircleProps> = ({
  setShowAddCircles,
}) => {
  const appDispatch = useAppDispatch();
  const [addCoachingCircleForm, setAddCoachingCircleForm] =
    useState<ClubMeetingModelInput>({
      clubId: '',
      meetingDate: '',
    });
  const [activeStep, setActiveStep] = useState(1);
  const [coachingCircleAttendance, setCoachingCircleAttendance] =
    useState<CoachingCirclesAttendanceProps[]>();

  const AddCoachingCircleSteps = (step: ChildProgressAssessmentSteps) => {
    switch (step) {
      case ChildProgressAssessmentSteps?.AddCoachingCircleStepTwo:
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

  console.log({ coachingCircleAttendance });

  const addCoachingCircle = useCallback(() => {
    const input: ClubMeetingModelInput = {
      clubId: 'c2432594-521d-e911-824d-0800274bb0e4',
      meetingDate: addCoachingCircleForm?.meetingDate,
      meetingNotes: addCoachingCircleForm?.meetingNotes,
      clubMeetingParticipants: coachingCircleAttendance,
    };
    console.log({ input });
    // appDispatch(coachThunkActions?.addCoachCircleMeeting({input}))
  }, [
    addCoachingCircleForm?.meetingDate,
    addCoachingCircleForm?.meetingNotes,
    appDispatch,
    coachingCircleAttendance,
  ]);

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
        //   displayOffline={!isOnline}
      >
        {AddCoachingCircleSteps(activeStep)}
      </BannerWrapper>
    </>
  );
};
