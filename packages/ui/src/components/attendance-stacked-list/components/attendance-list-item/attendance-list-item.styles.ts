import { AttendanceStatus } from '../../models/AttendanceItemStatus';
export const contentWrapper =
  'flex items-center justify-between px-4 py-4 sm:px-6 ';
export const menuItemIconContainer =
  'flex-shrink-0 h-12  w-12 rounded-full flex justify-center items-center ';
export const menuItemIconContainerDefault = 'bg-primary text-white';
export const menuItemIcon = 'flex-shrink-0 h-6 w-6 ';
export const menuTitle = 'text-sm font-medium text-primary truncate';
export const menuSubTitle = 'flex pl-0.5 items-center text-sm text-textLight';
export const attendanceIconBase = 'h-6 w-6 text-textLight';
export const attendanceIconPresent = 'h-6 w-6 text-successMain';
export const attendanceIconAbsent = 'h-6 w-6 text-errorMain';
export const menulistItemContainer =
  'block bg-successBg cursor-pointer rounded-10';

export const getColourByStatus = (status?: AttendanceStatus) => {
  if (status) {
    switch (status) {
      case AttendanceStatus.Absent:
        return attendanceIconAbsent;
      case AttendanceStatus.Present:
        return attendanceIconPresent;
      default:
        return attendanceIconBase;
    }
  } else {
    return attendanceIconBase;
  }
};

export const getShapeClassByAlertSeverity = (type: string) => {
  switch (type) {
    case 'error':
      return 'h-2.5 w-2.5 bg-errorMain';
    case 'warning':
      return 'h-0 w-0 border-opacity-0 border-t-0 border-l-5 border-l-tranparent border-r-5 border-r-tranparent border-b-10 border-b-alertMain shadow-none';
    case 'success':
      return 'h-2.5 w-2.5 rounded-full bg-successMain';
    default:
      return 'h-2.5 w-2.5 rounded-full bg-successMain';
  }
};
