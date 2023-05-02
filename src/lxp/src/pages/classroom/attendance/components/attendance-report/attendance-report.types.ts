import { ClassroomDto, ClassroomGroupDto } from '@ecdlink/core';
import { ComponentBaseProps } from '@ecdlink/ui';

export interface AttendanceReportProps extends ComponentBaseProps {
  classroom?: ClassroomDto;
  currentClassroomGroup?: ClassroomGroupDto;
  classroomGroups?: ClassroomGroupDto[];
}
