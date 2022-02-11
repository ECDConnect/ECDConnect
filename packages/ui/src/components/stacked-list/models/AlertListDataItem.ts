import { Colours } from '../../../models/Colours';
import { ListItem } from './ListItem';

export type AlertSeverityType = 'error' | 'warning' | 'success' | 'none';

export interface AlertListDataItem extends ListItem {
  alertSeverity: AlertSeverityType;
  menuIconClassName?: string;
  icon?: string;
  iconColor?: Colours;
  chipText?: string;
  chipIcon: string;
}
