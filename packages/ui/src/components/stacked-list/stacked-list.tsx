// import { Typography } from '..';
import { ComponentBaseProps } from '../../models';
import { classNames } from '../../utils/style-class.utils';
import ActionListItem from './components/action-list-item/action-list-item';
import AlertListItem from './components/alert-list-item/alert-list-item';
import MenuListItem from './components/menu-list-item/menu-list-item';
import TitleListItem from './components/title-list-item/title-list-item';
import UserAlertListItem from './components/user-alert-list-item/user-alert-list-item';
import { ActionListDataItem } from './models/ActionListDataItem';
import { AlertListDataItem } from './models/AlertListDataItem';
import { MenuListDataItem } from './models/MenuListDataItem';
import { TitleListDataItem } from './models/TitleListDataItem';
import { UserAlertListDataItem } from './models/UserAlertListDataItem';

export type StackedListType =
  | 'ActionList'
  | 'MenuList'
  | 'TitleList'
  | 'UserAlertList'
  | 'AlertList';

export type StackedListItemType =
  | ActionListDataItem
  | MenuListDataItem
  | TitleListDataItem
  | UserAlertListDataItem
  | AlertListDataItem;

export interface StackedListProps<T> extends ComponentBaseProps {
  type: string;
  listItems: StackedListItemType[];
  isFullHeight?: boolean;
  onScroll?: (scrollTop: number) => void;
  id?: string;
  onClickItem?: (item: any) => void;
}

export const StackedList = <T extends {}>({
  type,
  listItems,
  className,
  isFullHeight = true,
  id,
  onScroll,
  onClickItem,
}: StackedListProps<T>) => {
  const getItemComponent = (
    type: string,
    item: StackedListItemType,
    index: number
  ) => {
    switch (type) {
      case 'ActionList':
        return (
          <ActionListItem
            key={item.title + '-stackedList-listItem-' + index}
            item={item as ActionListDataItem}
            id={'actionList' + index}
            onClickItem={onClickItem}
          ></ActionListItem>
        );
      case 'MenuList':
        return (
          <MenuListItem
            key={item.title + '-stackedList-listItem-' + index}
            item={item as MenuListDataItem}
            onClickItem={onClickItem}
          ></MenuListItem>
        );
      case 'TitleList':
        return (
          <TitleListItem
            key={item.title + '-stackedList-listItem-' + index}
            item={item as TitleListDataItem}
            onClickItem={onClickItem}
          ></TitleListItem>
        );
      case 'UserAlertList':
        return (
          <UserAlertListItem
            key={item.title + '-stackedList-listItem-' + index}
            item={item as UserAlertListDataItem}
            onClickItem={onClickItem}
          ></UserAlertListItem>
        );
      case 'AlertList':
        return (
          <AlertListItem
            key={item.title + '-stackedList-listItem-' + index}
            item={item as AlertListDataItem}
            onClickItem={onClickItem}
          ></AlertListItem>
        );
      default:
        return <div></div>;
    }
  };

  const handleScroll = (e: any) => {
    const element = e.target;
    if (onScroll && element.scrollTop) {
      onScroll(element.scrollTop);
    }
  };

  return (
    <div
      id={id}
      className={classNames(
        className,
        isFullHeight ? 'h-full' : '',
        'flex-1 overflow-auto'
      )}
      onScroll={(e: any) => handleScroll(e)}
    >
      {listItems.map((item, idx) => getItemComponent(type, item, idx))}
    </div>
  );
};

export default StackedList;
