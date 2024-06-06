export interface AttendanceItemStatus<T> {
  item: T;
  status?: AttendanceStatus;
}

export enum AttendanceStatus {
  Present = 1,
  Absent = 2,
  None = 3,
}
