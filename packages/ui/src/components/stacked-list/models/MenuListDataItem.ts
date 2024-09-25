import { ReactElement } from 'react';
import { Colours } from '../../..';
import { ListItem } from './ListItem';

export interface MenuListDataItem<T = {}> extends Omit<ListItem, 'subTitle'> {
  className?: string;
  menuIcon?: string;
  menuIconClassName?: string;
  showIcon?: boolean;
  iconHexBackgroundColor?: string;
  iconBackgroundColor?: Colours;
  iconColor?: Colours;
  menuIconUrl?: string;
  customIcon?: ReactElement | undefined;
  subItem?: string;
  childList?: boolean;
  backgroundColor?: Colours;
  hexBackgroundColor?: string;
  rightIcon?: string;
  rightIconClassName?: string;
  extraData?: T;
  subTitle?: string | ReactElement;
  hideRightIcon?: boolean;
  likesItem?: ReactElement;
}
