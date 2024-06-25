import { useEffect, useState } from 'react';
import { ComponentBaseProps } from '../../../../models/ComponentBaseProps';
import { classNames, renderIcon } from '../../../../utils';
import { Avatar } from '../../../avatar/avatar';
import Typography from '../../../typography/typography';
import { UserAvatar } from '../../../user-avatar/user-avatar';
import * as stackedListStyles from '../../attendance-stacked-list.styles';
import { AttendanceStatus } from '../../models/AttendanceItemStatus';
import { AttendanceListDataItem } from '../../models/AttendanceListDataItem';
import * as styles from './attendance-list-item.styles';

export interface AttendanceListItemProps extends ComponentBaseProps {
  item: AttendanceListDataItem;
  onBadgeClick?: (item: AttendanceListDataItem) => void;
  walkthrough?: boolean;
  type?: 'default' | 'light';
}

export const AttendanceListItem = ({
  item,
  onBadgeClick,
  className,
  walkthrough,
  type,
}: React.PropsWithChildren<AttendanceListItemProps>) => {
  const [attendanceItem, setAttendanceItem] =
    useState<AttendanceListDataItem>(item);

  useEffect(() => {
    item.status = item.status ?? AttendanceStatus.Present;
    setAttendanceItem(item);
  }, [item]);

  const onBadgeClicked = () => {
    const currentItem = JSON.parse(JSON.stringify(attendanceItem));

    if (walkthrough) {
      if (
        currentItem.status &&
        currentItem.status === AttendanceStatus.Present
      ) {
        currentItem.status = AttendanceStatus.Absent;
      } else if (currentItem.status === AttendanceStatus.Absent) {
        currentItem.status = AttendanceStatus.Present;
      }
      setAttendanceItem(currentItem);
      if (onBadgeClick) {
        onBadgeClick(currentItem);
      }
      return;
    }

    if (currentItem.status && currentItem.status === AttendanceStatus.Present) {
      currentItem.status = currentItem?.disabledAbsentStatus
        ? AttendanceStatus.None
        : AttendanceStatus.Absent;
    } else {
      currentItem.status = AttendanceStatus.Present;
    }

    setAttendanceItem(currentItem);
    if (onBadgeClick) {
      onBadgeClick(currentItem);
    }
  };

  const getBadgeIcon = (status?: AttendanceStatus) => {
    if (status) {
      switch (status) {
        case AttendanceStatus.Absent:
          return 'XCircleIcon';
        case AttendanceStatus.Present:
          return 'CheckCircleIcon';
        default:
          return 'CheckCircleIcon';
      }
    } else {
      return 'CheckCircleIcon';
    }
  };

  return (
    <div
      className={classNames(
        className,
        attendanceItem?.className,
        styles.menulistItemContainer(attendanceItem.status, type)
      )}
      onClick={() => {
        onBadgeClicked();
        attendanceItem.onActionClick && attendanceItem.onActionClick();
      }}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div>
            {attendanceItem.profileDataUrl ? (
              <Avatar
                size={'md'}
                dataUrl={attendanceItem.profileDataUrl}
                displayBorder
              />
            ) : (
              <UserAvatar
                size={'md'}
                avatarColor={
                  item.avatarColor ||
                  styles.avatarColor(attendanceItem.status, type)
                }
                text={attendanceItem.profileText ?? ''}
                displayBorder
              />
            )}
          </div>
          <div className={stackedListStyles.paragraphWrapper}>
            <Typography
              className="truncate"
              type="body"
              weight="bold"
              color="textMid"
              text={attendanceItem.title}
            ></Typography>
            <Typography
              className="truncate"
              type="help"
              color="textMid"
              text={attendanceItem.subTitle}
            ></Typography>
          </div>
        </div>
        <div>
          {attendanceItem.status === AttendanceStatus.None ? (
            <div className="border-primaryAccent1 h-5 w-5 rounded-full border bg-white"></div>
          ) : (
            renderIcon(
              getBadgeIcon(attendanceItem.status),
              styles.getColourByStatus(attendanceItem.status, type)
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceListItem;
