import { UserDto } from '../Users/user.dto';
import { ClassProgrammeDto } from './class-programme.dto';
import { RowInput } from 'jspdf-autotable';

export interface AttendanceDto {
  classroomProgrammeId?: string;
  classroomProgramme?: ClassProgrammeDto;
  user?: UserDto;
  userId?: string;
  parentRecordId?: string;
  weekOfYear?: number;
  monthOfYear?: number;
  year?: number;
  attended?: boolean;
  attendanceDate?: Date | string;
}

export interface AttendanceReportTableDataDto {
  tableName: string;
  headers: {
    header: string;
    dataKey: string;
  }[];
  data: {
    [key: string]: any;
  }[];
  footer: RowInput[];
  totalAttendance: string;
  totalExpected: string;
  totalChildren: string;
}
