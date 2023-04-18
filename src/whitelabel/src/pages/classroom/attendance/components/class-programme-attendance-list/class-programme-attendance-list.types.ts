import { ClassroomGroupDto } from '@ecdlink/core';
import { AttendanceListDataItem, ComponentBaseProps } from '@ecdlink/ui';

export interface ClassProgrammeAttendanceListProps extends ComponentBaseProps {
  isPrimaryClass: boolean;
  classroomGroup: ClassroomGroupDto;
  attendanceDate: Date;
  onAttendanceUpdated: (state: AttendanceListState) => void;
}

export interface AttendanceListState {
  listItems: AttendanceListDataItem[];
}
