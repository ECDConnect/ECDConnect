import { Button } from '../../../button/button';
import { renderIcon } from '../../../../utils';
import { ActionListDataItem } from '../../../../models';
import * as styles from './action-list-item.styles';
import Typography from '../../../typography/typography';

export interface ActionListItemProps {
  item: ActionListDataItem;
}

export const ActionListItem: React.FC<ActionListItemProps> = ({ item }) => {
  const getIcon = (iconType: string) => {
    return renderIcon(iconType, styles.actionIcon);
  };

  const buttonType = item.buttonType ?? 'outlined';

  return (
    <div>
      <div className={styles.actionListItemContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.textRowsWrapper}>
            <div className={styles.paragraphWrapper}>
              <div>
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
              </div>
            </div>
          </div>
          {item.onActionClick && (
            <div onClick={() => item.onActionClick && item.onActionClick()}>
              {item.actionName && (
                <Button type={buttonType} color="primary" size="small">
                  <Typography
                    className={'mr-1'}
                    type={'small'}
                    color={buttonType === 'outlined' ? 'primary' : 'white'}
                    text={item.actionName}
                  ></Typography>
                  {item.actionIcon && getIcon(item.actionIcon)}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionListItem;
