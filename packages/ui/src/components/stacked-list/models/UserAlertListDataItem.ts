import { Colours } from '../../../models/Colours';
import { ListItem } from './ListItem';

export type AlertSeverityType = 'error' | 'warning' | 'success' | 'none';

export interface UserAlertListDataItem extends ListItem {
  id?: string;
  avatarColor: string;
  alertSeverity: AlertSeverityType;
  profileDataUrl?: string;
  profileText?: string;
  menuIconClassName?: string;
  icon?: string;
  iconColor?: Colours;
}
