import { ClassroomDto, PractitionerDto } from '@/../../../packages/core/lib';
import { PractitionerRemovalHistory } from '@ecdlink/graphql';

export interface PractitionerNotRegisterProps {
  practitioner?: PractitionerDto;
  classroom?: ClassroomDto;
  existingRemoval?: PractitionerRemovalHistory;
}
