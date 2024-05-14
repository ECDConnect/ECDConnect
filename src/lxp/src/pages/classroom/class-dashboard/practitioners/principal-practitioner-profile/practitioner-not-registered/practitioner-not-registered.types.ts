import { PractitionerDto } from '@/../../../packages/core/lib';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import { PractitionerRemovalHistory } from '@ecdlink/graphql';

export interface PractitionerNotRegisterProps {
  practitioner?: PractitionerDto;
  classroom?: ClassroomDto;
  existingRemoval?: PractitionerRemovalHistory;
}
