import { TraineeDto, UserDto } from '@ecdlink/core';
import { PractitionerTimeline } from '@ecdlink/graphql';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
    userId: string;
  }
>;
export interface TraineeState {
  trainee?: TraineeDto;
  traineeOnboardTimeline?: PractitionerTimeline;
}
