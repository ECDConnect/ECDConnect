import { TraineeDto } from '@ecdlink/core';
import { RootState } from '../types';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';
import { SectionQuestions } from '@/pages/trainee/trainee-onboarding/components/startup-support-agreement/startup-accept-agreement.types';

export const getTrainee = (state: RootState): TraineeDto | undefined =>
  state.trainee.trainee;

export const getTraineeOnboardTimeline = (
  state: RootState
): TraineeOnBoardTimeline | undefined => state.trainee.traineeOnboardTimeline;

export const getTraineeVisitData = (
  state: RootState
): VisitData[] | undefined => state.trainee.traineeVisitData;

export const getTraineeVisitDataProgrammeName = (
  state: RootState
): string | null | undefined => {
  const visitData = state.trainee.traineeVisitData;
  const visitProgrammeName = visitData?.find(
    (item) => item?.question === 'What is the name of your programme?'
  );
  return visitProgrammeName?.questionAnswer;
};

export const getCoachSmartSpaceVisitData = (
  state: RootState
): VisitData[] | undefined => state.trainee.coachSmartSpaceCheckData;

export const getTraineeVisitDataAssitantsNumber = (
  state: RootState
): string | null | undefined => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSections = visitData?.find(
    (item) => item?.visitSection === 'Programme details'
  );
  const programmeDetailsSectionsWithoutTypo = programmeDetailsSections as any;
  const questions = programmeDetailsSectionsWithoutTypo?.questions;
  return questions?.[0]?.answer;
};

export const getTraineeProgrammeType = (
  state: RootState
): string | null | undefined => {
  const visitData = state.trainee.traineeVisitData;
  const programmeDetailsSections = visitData
    ?.filter((item) => item?.visitSection === 'Programme details')
    .find(
      (item) =>
        item?.question ===
        ' What type of programme are you running or planning to run?'
    );

  return programmeDetailsSections?.questionAnswer;
};

export const getTraineeSmartSpaceAddress = (
  state: RootState
): string | null | undefined => {
  const visitData = state.trainee.traineeVisitData;
  const programmeDetailsSections = visitData
    ?.filter((item) => item?.visitSection === 'Programme details')
    .find((item) => item?.question === 'Where is your site located?');

  return programmeDetailsSections?.questionAnswer;
};
