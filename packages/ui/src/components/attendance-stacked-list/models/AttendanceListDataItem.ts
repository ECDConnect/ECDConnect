import { AttendanceStatus } from './AttendanceItemStatus';
import { ListItem } from './ListItem';

export interface AttendanceListDataItem extends ListItem {
  profileDataUrl?: string;
  profileText?: string;
  menuIconClassName?: string;
  attenendeeId: string;
  status?: AttendanceStatus;
  disabledAbsentStatus?: boolean;
  avatarColor: string;
  className?: string;
}
