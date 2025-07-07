import { useEffect, useState } from 'react';
import { ComponentBaseProps } from '../../models';
import { classNames } from '../../utils/style-class.utils';
import AttendanceListItem, {
  AttendanceListItemProps,
} from './components/attendance-list-item/attendance-list-item';
import { AttendanceListDataItem } from './models/AttendanceListDataItem';

export interface AttendanceStackedListProps extends ComponentBaseProps {
  type?: AttendanceListItemProps['type'];
  listItems: AttendanceListDataItem[];
  scroll?: boolean;
  onScroll?: (scrollTop: number) => void;
  onChange?: (updatedList: AttendanceListDataItem[]) => void;
}

export const AttendanceStackedList = ({
  listItems = [],
  className,
  onChange,
  scroll = true,
  onScroll,
  type,
}: React.PropsWithChildren<AttendanceStackedListProps>) => {
  const [renderList, setRenderList] =
    useState<AttendanceListDataItem[]>(listItems);
  const handleScroll = (e: any) => {
    const element = e.target;
    if (onScroll && element.scrollTop) {
      onScroll(element.scrollTop);
    }
  };

  useEffect(() => {
    const renderingList = JSON.parse(
      JSON.stringify(listItems)
    ) as AttendanceListDataItem[];
    setRenderList(renderingList);
  }, [listItems]);

  const updateItemAttendance = (
    currentAttendanceItem: AttendanceListDataItem
  ) => {
    const currentItems = renderList;

    const indexOfItem = currentItems.findIndex(
      (x) => x.attenendeeId === currentAttendanceItem.attenendeeId
    );

    if (indexOfItem !== -1) {
      currentItems[indexOfItem] = currentAttendanceItem;
    }
    setRenderList(currentItems);
    if (onChange) {
      onChange(currentItems);
    }
  };

  return (
    <div
      className={classNames(
        className,
        ' flex-1',
        scroll ? 'h-full overflow-auto' : ''
      )}
      onScroll={(e: any) => handleScroll(e)}
    >
      {renderList.map((item, index) => (
        <div key={'attendance-stackedList-listItem-' + index}>
          <AttendanceListItem
            type={type}
            item={item as AttendanceListDataItem}
            onBadgeClick={(currentAttendanceItem: AttendanceListDataItem) =>
              updateItemAttendance(currentAttendanceItem)
            }
            className="mt-1.5 flex flex-col"
          />
        </div>
      ))}
    </div>
  );
};

export default AttendanceStackedList;
