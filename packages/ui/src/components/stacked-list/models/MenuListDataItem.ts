import { Colours } from '../../..';
import { ListItem } from './ListItem';

export interface MenuListDataItem extends ListItem {
  className?: string;
  menuIcon?: string;
  menuIconClassName?: string;
  showIcon?: boolean;
  iconHexBackgroundColor?: string;
  iconBackgroundColor?: Colours;
  iconColor?: Colours;
  menuIconUrl?: string;
  subItem?: string;
  childList?: boolean;
  backgroundColor?: Colours;
  hexBackgroundColor?: string;
  rightIcon?: string;
  rightIconClassName?: string;
}
