import { TraineeDto, UserDto } from '@ecdlink/core';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
    userId: string;
  }
>;
export interface TraineeState {
  // Only Trainee
  trainee?: TraineeDto;

  // Both
  traineeChecklistVisitData: {
    [visitId: string]: VisitData[];
  };
  traineeOnboardTimeline: {
    [userId: string]: TraineeOnBoardTimeline;
  };
  coachSmartSpaceVisitData: {
    [visitId: string]: SmartSpaceVisit;
  };

  // Coach only
  franchiseeAgreementData: {
    [visitId: string]: SmartSpaceVisit;
  };
}

export type SmartSpaceVisit = {
  syncId?: string;
  visitId: string;
  traineeId: string;
  coachId: string;
  visitData: SmartSpaceVisitData[];
};

export type SmartSpaceVisitData = {
  visitSection: string;
  question: string;
  questionAnswer: string | undefined;
};
