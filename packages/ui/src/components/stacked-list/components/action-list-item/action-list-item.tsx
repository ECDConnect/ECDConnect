import { Button } from '../../../button/button';
import { classNames, renderIcon } from '../../../../utils';
import { ActionListDataItem } from '../../models/ActionListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './action-list-item.styles';
import Typography from '../../../typography/typography';

export interface ActionListItemProps {
  item: ActionListDataItem;
  id?: string;
  onClickItem?: (item: any) => void;
}

export const ActionListItem: React.FC<ActionListItemProps> = ({
  item,
  id,
  onClickItem,
}) => {
  const getIcon = (iconType: string) => {
    return renderIcon(
      iconType,
      item?.textColor ? `h-4 w-4 text-${item?.textColor}` : styles.actionIcon
    );
  };

  const buttonType = item.buttonType ?? 'filled';

  return (
    <div
      className={classNames(
        item.containerStyle,
        styles.actionListItemContainer
      )}
      id={id || item.id}
    >
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div className={classNames(styles.actionParagraphWrapper)}>
            <>
              <p
                className={
                  !item.switchTextStyles
                    ? classNames(item.titleStyle, styles.actionTitle)
                    : classNames(item.titleStyle, styles.actionSubTitle)
                }
              >
                {item.title}
              </p>
              <p
                className={
                  item.switchTextStyles
                    ? classNames(item.subTitleStyle, styles.actionTitleInput)
                    : classNames(item.subTitleStyle, styles.actionSubTitle)
                }
              >
                {item.hasMarkup && (
                  <span
                    dangerouslySetInnerHTML={{ __html: item.subTitle || '' }}
                    className="truncate"
                  />
                )}

                {!item.hasMarkup && (
                  <span className="truncate">{item.subTitle}</span>
                )}
              </p>
            </>
          </div>
        </div>
        {(!!onClickItem || !!item.onActionClick) && (
          <div
            onClick={() => {
              if (!!item.onActionClick) item.onActionClick();
              else if (!!onClickItem) onClickItem(item);
            }}
          >
            {item.actionName && (
              <Button
                type={buttonType}
                color={item?.buttonColor || 'secondaryAccent2'}
                className={
                  `${item?.buttonColor}` ? `bg-${item.buttonColor}` : ''
                }
                size="small"
              >
                <Typography
                  className={'mr-1'}
                  type={'buttonSmall'}
                  color={item?.textColor ? item?.textColor : 'secondary'}
                  text={item.actionName}
                ></Typography>
                {item.actionIcon && getIcon(item.actionIcon)}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionListItem;
