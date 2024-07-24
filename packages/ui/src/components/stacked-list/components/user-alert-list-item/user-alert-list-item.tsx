import { useMemo } from 'react';
import { classNames, renderIcon } from '../../../../utils';
import { Avatar } from '../../../avatar/avatar';
import { RoundIcon } from '../../../round-icon/round-icon';
import Typography from '../../../typography/typography';
import UserAvatar from '../../../user-avatar/user-avatar';
import { UserAlertListDataItem } from '../../models/UserAlertListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './user-alert-list-item.styles';
import { ListItem } from '../../models/ListItem';

export interface UserAlertListItemProps {
  item: UserAlertListDataItem;
  onClickItem?: (item: any) => void;
}

export const UserAlertListItem: React.FC<UserAlertListItemProps> = ({
  item,
  onClickItem,
}) => {
  const hasClickHandler =
    (!!onClickItem || !!item.onActionClick) && !item.noClick;
  const renderAvatar = useMemo(() => {
    if (item.icon) {
      if (item.icon.indexOf('/') >= 0) {
        return (
          <RoundIcon
            className="mr-4"
            imageUrl={item.icon}
            hexBackgroundColor={item.avatarColor}
          />
        );
      }
      return (
        <RoundIcon
          className="mr-4"
          icon={item.icon}
          hexBackgroundColor={item.avatarColor}
        />
      );
    }

    if (item.profileDataUrl) {
      return (
        <Avatar
          className="mr-4"
          size={'md-lg'}
          dataUrl={item.profileDataUrl}
          displayBorder
          borderColor={item.avatarColor}
        />
      );
    }

    return (
      <UserAvatar
        className="mr-4"
        size={'md'}
        avatarColor={item.avatarColor}
        text={item.profileText ?? ''}
        displayBorder
      />
    );
  }, []);

  return (
    <div
      className={
        item?.successColor || item?.backgroundColor
          ? styles.menuItemIconContainerCoachCirclesNoAction(
              item?.backgroundColor || 'successMain'
            )
          : hasClickHandler
          ? styles.menulistItemContainer
          : styles.menuItemIconContainerNoAction
      }
      onClick={() => {
        if (!item.noClick) {
          if (!!item.onActionClick) item.onActionClick();
          else if (onClickItem) onClickItem(item);
        }
      }}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          {!item?.hideAvatar && <div>{renderAvatar}</div>}
          <div className={stackedListStyles.paragraphWrapper}>
            <div>
              <Typography
                className={
                  item.titleStyle
                    ? classNames(item.titleStyle, styles.actionTitle)
                    : 'text-textMid truncate'
                }
                type="h4"
                weight="bold"
                text={item.title}
              ></Typography>
              {!!item.subTitle && (
                <div
                  className={
                    item?.alertSeverity === 'none'
                      ? styles.menuSubTitleWithAlertSeverityNone
                      : styles.menuSubTitle
                  }
                >
                  {!item.hideAlertSeverity ? (
                    item.alertSeverityNoneIcon &&
                    item.alertSeverity === 'none' ? (
                      renderIcon(
                        item.alertSeverityNoneIcon,
                        classNames(
                          'w-4 h-4',
                          item.alertSeverityNoneColor &&
                            `text-${item.alertSeverityNoneColor}`
                        )
                      )
                    ) : (
                      <div
                        className={styles.getShapeClassByAlertSeverity(
                          item.alertSeverity
                        )}
                      ></div>
                    )
                  ) : null}
                  <Typography
                    className={classNames(
                      item.subTitleStyle,
                      item?.breaksSubtitleLine
                        ? 'w-11/12 break-words pl-1'
                        : item?.alertSeverity === 'none'
                        ? 'truncate'
                        : 'truncate pl-1'
                    )}
                    type="help"
                    weight="skinny"
                    color={styles.getColourByAlertSeverity(item.alertSeverity)}
                    text={item.subTitle ?? ''}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {item?.subItem && (
            <p
              className={
                'bg-primary mr-6 truncate rounded-3xl px-2 py-1 text-base font-medium text-white'
              }
            >
              {item?.subItem}
            </p>
          )}
          {hasClickHandler &&
            renderIcon(
              !!item.rightIcon ? item.rightIcon : 'ChevronRightIcon',
              styles.menuChevron
            )}
        </div>
      </div>
    </div>
  );
};

export default UserAlertListItem;
