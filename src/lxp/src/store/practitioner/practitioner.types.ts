import { PractitionerDto, UserDto } from '@ecdlink/core';
import { NotificationDisplay } from '@ecdlink/graphql';

export type PrincipalPractitioners = Partial<
  Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id' | 'phoneNumber'> & {
    userId: string;
  }
>;
export interface PractitionerState {
  practitioner?: PractitionerDto;
  practitioners?: PractitionerDto[];
  principalPractitioners?: PrincipalPractitioners[];
  practitionersMetrics?: NotificationDisplay[];
}
