import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';

export interface ClassroomAttendanceProps {
  practitionerClassroomGroups?: ClassroomGroupDto[];
  // TODO - NEED TO FIX TYPES
  practitionerClassroomsData?: any[];
}
