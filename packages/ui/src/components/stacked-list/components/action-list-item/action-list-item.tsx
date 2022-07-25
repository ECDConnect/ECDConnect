import { Button } from '../../../button/button';
import { classNames, renderIcon } from '../../../../utils';
import { ActionListDataItem } from '../../models/ActionListDataItem';
import * as stackedListStyles from '../../stacked-list.styles';
import * as styles from './action-list-item.styles';
import Typography from '../../../typography/typography';

export interface ActionListItemProps {
  item: ActionListDataItem;
}

export const ActionListItem: React.FC<ActionListItemProps> = ({ item }) => {
  const getIcon = (iconType: string) => {
    return renderIcon(iconType, styles.actionIcon);
  };

  const buttonType = item.buttonType ?? 'filled';

  return (
    <div className={styles.actionListItemContainer}>
      <div className={styles.contentWrapper}>
        <div className={stackedListStyles.textRowsWrapper}>
          <div className={classNames('pl-4', styles.actionParagraphWrapper)}>
            <>
              <p
                className={
                  !item.switchTextStyles
                    ? styles.actionTitle
                    : styles.actionSubTitle
                }
              >
                {item.title}
              </p>
              <p
                className={
                  item.switchTextStyles
                    ? styles.actionTitleInput
                    : styles.actionSubTitle
                }
              >
                <span className="truncate">{item.subTitle}</span>
              </p>
            </>
          </div>
        </div>
        {item.onActionClick && (
          <div onClick={() => item.onActionClick && item.onActionClick()}>
            {item.actionName && (
              <Button type={buttonType} color="secondaryAccent2" size="small">
                <Typography
                  className={'mr-1'}
                  type={'buttonSmall'}
                  color={'secondary'}
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
