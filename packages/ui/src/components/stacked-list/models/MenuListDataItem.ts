import { Colours } from '../../..';
import { ListItem } from './ListItem';

export interface MenuListDataItem extends ListItem {
  menuIcon?: string;
  menuIconClassName?: string;
  showIcon?: boolean;
  iconHexBackgroundColor?: string;
  iconBackgroundColor?: Colours;
  iconColor?: Colours;
  menuIconUrl?: string;
}
