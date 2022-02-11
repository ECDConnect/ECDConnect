export interface AttendanceItemStatus<T> {
  item: T;
  status?: AttendanceStatus;
}

export enum AttendanceStatus {
  Unknown = 1,
  Present = 2,
  Absent = 3,
}
