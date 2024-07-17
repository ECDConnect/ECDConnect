import { ReactElement } from 'react';
import { Colours } from '../../../models/Colours';
import { ListItem } from './ListItem';

export type AlertSeverityType = 'error' | 'warning' | 'success' | 'none';

export interface UserAlertListDataItem<T = {}> extends ListItem {
  id?: string;
  avatarColor: string;
  hideAlertSeverity?: boolean;
  alertSeverity: AlertSeverityType;
  alertSeverityNoneIcon?: string;
  alertSeverityNoneColor?: Colours;
  profileDataUrl?: string;
  profileText?: string;
  menuIconClassName?: string;
  icon?: string;
  iconColor?: Colours;
  extraData?: T;
  breaksSubtitleLine?: boolean;
  rightIcon?: string;
  noClick?: boolean;
  subItem?: string;
  successColor?: boolean;
  hideAvatar?: boolean;
  backgroundColor?: Colours;
}
