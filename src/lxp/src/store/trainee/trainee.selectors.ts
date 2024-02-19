import { TraineeDto } from '@ecdlink/core';
import { RootState } from '../types';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';
import { createSelector } from '@reduxjs/toolkit';

export const getTrainee = (state: RootState): TraineeDto | undefined =>
  state.trainee.trainee;

export const getTraineeOnboardTimeline = (userId: string) =>
  createSelector(
    (state: RootState) => {
      return state.trainee.traineeOnboardTimeline[userId];
    },
    (timeline: TraineeOnBoardTimeline | undefined) => timeline
  );

export const getTraineeVisitData = (visitId: string) =>
  createSelector(
    (state: RootState) => {
      return state.trainee.traineeChecklistVisitData[visitId] || [];
    },
    (visitData) => visitData
  );

export const getTraineeVisitDataProgrammeName = (visitId: string) =>
  createSelector(getTraineeVisitData(visitId), (visitData) => {
    const visitProgrammeName = visitData.find(
      (item) => item?.question === 'What is the name of your programme?'
    );
    return visitProgrammeName?.questionAnswer;
  });

export const getCoachSmartSpaceVisitData = (visitId: string) =>
  createSelector(
    (state: RootState) => {
      return state.trainee.coachSmartSpaceVisitData[visitId];
    },
    (visit) => visit
  );

export const getCoachSmartSpaceSectionAnswers = (
  visitId: string,
  sectionName: string
) =>
  createSelector(getCoachSmartSpaceVisitData(visitId), (visit) => {
    const sectionData = visit?.visitData?.filter(
      (section) => section.visitSection === sectionName
    );

    return sectionData || [];
  });

export const getCoachSmartSpaceSectionScore = (
  visitId: string,
  sectionName: string
) =>
  createSelector(
    getCoachSmartSpaceSectionAnswers(visitId, sectionName),
    (answers) => {
      if (!answers.length) {
        return undefined;
      }

      const positiveAnswers = answers.filter(
        (item) => item.questionAnswer === 'true'
      );

      return positiveAnswers.length;
    }
  );

export const getCoachSmartSpaceSectionFailedQuestions = (
  visitId: string,
  sectionName: string
) =>
  createSelector(
    getCoachSmartSpaceSectionAnswers(visitId, sectionName),
    (answers) => {
      const falseAnswers = answers.filter(
        (item) => item?.questionAnswer === 'false'
      );
      return falseAnswers;
    }
  );

export const getCoachFranchisorAgreementData = (visitId: string) =>
  createSelector(
    (state: RootState) => {
      return state.trainee.franchiseeAgreementData[visitId] || [];
    },
    (visitData) => visitData
  );

export const getCoachFranchisorAgreementSectionData = (
  visitId: string,
  sectionName: string
) =>
  createSelector(getCoachFranchisorAgreementData(visitId), (visit) => {
    const sectionData = visit?.visitData?.filter(
      (section) => section.visitSection === sectionName
    );

    return sectionData || [];
  });

export const getVisitDataAssitantsNumber = (visitId: string) =>
  createSelector(
    getCoachSmartSpaceSectionAnswers(visitId, 'Programme details'),
    (answers) => {
      const programmeDetailsSection = answers[0]?.questionAnswer;

      return programmeDetailsSection || undefined;
    }
  );

export const getCoachVisitDataNextSteps = (visitId: string) =>
  createSelector(
    getCoachSmartSpaceSectionAnswers(visitId, 'Discuss next steps'),
    (answers) => {
      const programmeDetailsSections = answers.find(
        (item) => item?.questionAnswer !== ''
      );

      return programmeDetailsSections;
    }
  );

export const getTraineeProgrammeType = (visitId: string) =>
  createSelector(getTraineeVisitData(visitId), (visitData) => {
    const programmeDetailsSections = visitData
      ?.filter((item) => item?.visitSection === 'Programme details')
      .find(
        (item) =>
          item?.question ===
          ' What type of programme are you running or planning to run?'
      );

    return programmeDetailsSections?.questionAnswer;
  });

export const getTraineeSmartSpaceAddress = (visitId: string) =>
  createSelector(getTraineeVisitData(visitId), (visitData) => {
    const programmeDetailsSections = visitData
      ?.filter((item) => item?.visitSection === 'Programme details')
      .find((item) => item?.question === 'Where is your site located?');

    return programmeDetailsSections?.questionAnswer;
  });
