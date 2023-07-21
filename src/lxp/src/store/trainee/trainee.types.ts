import { TraineeDto, UserDto } from '@ecdlink/core';
import { TraineeOnBoardTimeline, VisitData } from '@ecdlink/graphql';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
    userId: string;
  }
>;
export interface TraineeState {
  trainee?: TraineeDto;
  traineeOnboardTimeline?: TraineeOnBoardTimeline;
  traineeVisitData?: VisitData[];
  coachSmartSpaceCheckData?: VisitData[];
  coachFranchisorAgreementData?: VisitData[];
}
