import { TraineeDto } from '@ecdlink/core';
import { RootState } from '../types';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';
import {
  Question,
  SectionQuestions,
} from '@/pages/trainee/trainee-onboarding/components/startup-support-agreement/startup-accept-agreement.types';

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

export const getCoachSmartSpaceSection1VisitDataCount = (
  state: RootState
): SectionQuestions[] | string | undefined => {
  const [step1Count] =
    (state.trainee.coachSmartSpaceCheckData?.filter(
      (item) => item?.visitSection === 'SmartSpace check'
    ) as any) || [];
  const step1CountFormatted = step1Count?.questions?.filter(
    (item: any) => item?.answer === true || item?.answer === 'true'
  );
  return step1CountFormatted?.length || undefined;
};

export const getCoachSmartSpaceSection2VisitDataCount = (
  state: RootState
): SectionQuestions[] | string | undefined => {
  const [step2Count] =
    (state?.trainee?.coachSmartSpaceCheckData?.filter(
      (item) => item?.visitSection === 'Additional standards'
    ) as any) || [];
  const step2CountFormatted = step2Count?.questions?.filter(
    (item: any) => item?.answer === true || item?.answer === 'true'
  );
  return step2CountFormatted?.length || undefined;
};

export const getCoachSmartSpaceVisit1DataNotAttendedStandards = (
  state: RootState
): SectionQuestions[] | undefined | [] => {
  const step1Count = state?.trainee?.coachSmartSpaceCheckData?.[0] as unknown;
  const formattedStep1Count = step1Count as SectionQuestions;
  const step1CountFormatted = formattedStep1Count?.questions?.filter(
    (item) => item?.answer === false || item?.answer === 'false'
  );
  return (step1CountFormatted as []) || undefined;
};

export const getCoachSmartSpaceVisit2DataNotAttendedStandards = (
  state: RootState
): SectionQuestions[] | undefined | [] => {
  const step2Count = state.trainee.coachSmartSpaceCheckData?.[1] as unknown;
  const formateedStep2Count = step2Count as SectionQuestions;
  const step2CountFormatted = formateedStep2Count?.questions?.filter(
    (item) => item?.answer === false || item?.answer === 'false'
  );
  return (step2CountFormatted as []) || undefined;
};

export const getCoachFranchisorAgreementData = (
  state: RootState
): VisitData[] | undefined => state.trainee.coachFranchisorAgreementData;

export const getTraineeVisitDataAssitantsNumber = (
  state: RootState
): string | boolean | undefined => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSection = visitData?.find(
    (item) => item?.visitSection === 'Programme details'
  );

  return programmeDetailsSection?.questionAnswer as string;
};

export const getCoachVisitDataNextSteps = (
  state: RootState
): VisitData | null | undefined => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSections = visitData?.find(
    (item) => item?.visitSection === 'Discuss next steps'
  );
  return programmeDetailsSections;
};

export const getCoachVisitDataCovidStandards = (
  state: RootState
): null | undefined | VisitData[] => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSections = visitData?.filter(
    (item: VisitData) => item?.visitSection === 'COVID safety checklist (CC14)'
  );

  return programmeDetailsSections;
};

export const getCoachVisitDataStandardsChecklist = (
  state: RootState
): VisitData[] | undefined => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSections = visitData?.filter(
    (item) => item?.visitSection === 'Standards checklist'
  );

  return programmeDetailsSections;
};

export const getCoachVisitCapacity = (
  state: RootState
): VisitData[] | undefined => {
  const visitData = state.trainee.coachSmartSpaceCheckData;
  const programmeDetailsSections = visitData?.filter(
    (item) => item?.visitSection === 'Calculate programme capacity'
  );
  return programmeDetailsSections;
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
