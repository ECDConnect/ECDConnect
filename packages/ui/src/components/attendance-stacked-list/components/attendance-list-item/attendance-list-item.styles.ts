import { AttendanceStatus } from '../../models/AttendanceItemStatus';
import { AttendanceListItemProps } from './attendance-list-item';

export const contentWrapper =
  'flex items-center justify-between px-4 py-4 sm:px-6 ';
export const menuItemIconContainer =
  'flex-shrink-0 h-12  w-12 rounded-full flex justify-center items-center ';
export const menuItemIconContainerDefault = 'bg-primary text-white';
export const menuItemIcon = 'flex-shrink-0 h-6 w-6 ';
export const menuTitle = 'text-sm font-medium text-primary truncate';
export const menuSubTitle = 'flex pl-0.5 items-center text-sm text-textLight';
// export const attendanceIconBase = 'h-6 w-6 text-textLight';
export const attendanceIconPresent = 'h-6 w-6 text-successMain';
export const attendanceIconAbsent = 'h-6 w-6 text-errorMain';
export const attendanceIconAbsentLight = 'h-6 w-6 text-primaryAccent2';
export const presentListItemContainer =
  'block bg-successBg cursor-pointer rounded-10';
export const absentListItemContainer =
  'block bg-errorBg cursor-pointer rounded-10';
export const absentListItemContainerLight =
  'block bg-uiBg cursor-pointer rounded-10';
export const noneListItemContainer = 'block bg-uiBg cursor-pointer rounded-10';

export const avatarColor = (
  status?: AttendanceStatus,
  type?: AttendanceListItemProps['type']
) => {
  switch (status) {
    case AttendanceStatus.Absent:
      return type === 'light' ? 'var(--primaryAccent2)' : 'var(--errorMain)';
    case AttendanceStatus.Present:
      return 'var(--successMain)';
    default:
      return 'var(--successMain)';
  }
};

export const menulistItemContainer = (
  status?: AttendanceStatus,
  type?: AttendanceListItemProps['type']
) => {
  if (status) {
    switch (status) {
      case AttendanceStatus.None:
        return noneListItemContainer;
      case AttendanceStatus.Absent:
        return type === 'light'
          ? absentListItemContainerLight
          : absentListItemContainer;
      case AttendanceStatus.Present:
        return presentListItemContainer;
      default:
        return presentListItemContainer;
    }
  } else {
    return presentListItemContainer;
  }
};

export const getColourByStatus = (
  status?: AttendanceStatus,
  type?: AttendanceListItemProps['type']
) => {
  if (status) {
    switch (status) {
      case AttendanceStatus.Absent:
        return type === 'light'
          ? attendanceIconAbsentLight
          : attendanceIconAbsent;
      case AttendanceStatus.Present:
        return attendanceIconPresent;
      default:
        return attendanceIconPresent;
    }
  } else {
    return attendanceIconPresent;
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
