import { ActionSelectItem } from './models/ActionSelectItem';
import * as styles from './action-select.style';
import { XIcon } from '@heroicons/react/solid';
import Typography from '../typography/typography';
import { ComponentBaseProps } from '../../models';
import { classNames } from '../../utils/style-class.utils';
import LoadingSpinner from '../loading-spinner/loading-spinner';

export interface ActionSelectProps<T> extends ComponentBaseProps {
  title: string;
  actions: ActionSelectItem<T>[];
  isLoading?: boolean;
  onActionSelected: (value: T) => void;
  onClose: () => void;
}

export const ActionSelect = <T,>({
  title,
  actions,
  isLoading,
  onActionSelected,
  onClose,
}: ActionSelectProps<T>) => {
  return (
    <div className={`${styles.wrapper}`}>
      <div className={styles.titleWrapper}>
        <Typography type={'h3'} color={'textMid'} text={title} />
        <XIcon
          data-testid={'action-select-close-icon'}
          style={{ height: '24px', width: '24px' }}
          onClick={() => !isLoading && onClose()}
          color={'grey'}
        />
      </div>
      <div className={styles.actionsFlexWrapper}>
        {actions.map((action, index) => {
          return (
            <div
              data-testid={`action-select-action-${index}`}
              className={styles.actionWrapper}
              onClick={() => !isLoading && onActionSelected(action.value)}
              key={`action-select-action-${index}`}
            >
              <div
                className={classNames(
                  styles.actionCircle,
                  `bg-${action.actionColour}` ?? 'bg-primary',
                  isLoading ? 'cursor-not-allowed opacity-70' : ''
                )}
              >
                {isLoading ? (
                  <LoadingSpinner
                    size="small"
                    backgroundColor="white"
                    spinnerColor="textMid"
                  />
                ) : (
                  action.icon
                )}
              </div>
              <Typography
                type={'help'}
                className={'py-0.5'}
                text={action.title}
                color={'textLight'}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionSelect;
