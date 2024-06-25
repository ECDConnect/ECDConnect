import { PractitionerDto } from '@/../../../packages/core/lib';
import { ClassroomDto } from '@/models/classroom/classroom.dto';

export interface PractitionerNotRegisterProps {
  practitioner?: PractitionerDto;
  classroom?: ClassroomDto;
}
