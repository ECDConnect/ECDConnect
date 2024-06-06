import { ChildAttendanceOverallReportModel } from '@ecdlink/core';

export interface EditRegistersAttendanceListProps {
  onBack: () => void;
  selectedRegister: {
    date: Date;
    register: ChildAttendanceOverallReportModel[];
  };
}
