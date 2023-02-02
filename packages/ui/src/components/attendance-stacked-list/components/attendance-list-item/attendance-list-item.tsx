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
  walktrough?: boolean;
}

export const AttendanceListItem = ({
  item,
  onBadgeClick,
  className,
  walktrough,
}: React.PropsWithChildren<AttendanceListItemProps>) => {
  const [attendanceItem, setAttendanceItem] =
    useState<AttendanceListDataItem>(item);
  useEffect(() => {
    item.status = item.status ?? AttendanceStatus.Unknown;
    setAttendanceItem(item);
  }, [item]);

  const onBadgeClicked = () => {
    const currentItem = JSON.parse(JSON.stringify(attendanceItem));

    if (walktrough) {
      console.log({ walktrough, currentItem });
      if (
        currentItem.status &&
        currentItem.status === AttendanceStatus.Present
      ) {
        currentItem.status = AttendanceStatus.Absent;
      } else {
        currentItem.status = AttendanceStatus.Present;
      }
      setAttendanceItem(currentItem);
      if (onBadgeClick) {
        onBadgeClick(currentItem);
      }
      return;
    }

    if (currentItem.status && currentItem.status !== AttendanceStatus.Absent) {
      currentItem.status = currentItem.status + 1;
    } else {
      currentItem.status = AttendanceStatus.Unknown;
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
          return 'BadgeCheckIcon';
        case AttendanceStatus.Unknown:
          return 'BadgeCheckIcon';
        default:
          return 'BadgeCheckIcon';
      }
    } else {
      return 'BadgeCheckIcon';
    }
  };

  return (
    <div
      className={classNames(styles.menulistItemContainer, className)}
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
                avatarColor={item.avatarColor}
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
          </div>
        </div>
        <div>
          {renderIcon(
            getBadgeIcon(attendanceItem.status),
            styles.getColourByStatus(attendanceItem.status)
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceListItem;
