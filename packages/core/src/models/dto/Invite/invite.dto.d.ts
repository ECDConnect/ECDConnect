import { PractitionerDto, UserDto } from '../Users';
import { EntityBase } from '../entity-base';

export interface InviteDto extends EntityBase {
  isAccepted?: boolean;
  status: string;
  acceptedDate?: Date;
  rejectedDate?: Date;
  practitioner?: PractitionerDto;
  practitionerId?: string;
  principalId?: string | undefined;
  principal?: PractitionerDto;
  user: UserDto;
}
