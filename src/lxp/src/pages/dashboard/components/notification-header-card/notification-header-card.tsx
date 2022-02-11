import { renderIcon, Typography } from '@ecdlink/ui';
import * as styles from './notification-header-card.styles';
import { NotificationHeaderCardProps } from './notification-header-card.types';

export const NotificationHeaderCard: React.FC<NotificationHeaderCardProps> = ({
  header,
  message,
  actionText,
  onActioned,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Typography type={'h3'} text={header} color={'textDark'} className={styles.header} />
        <Typography type={'body'} text={message} color={'textLight'} className={styles.text} />
        {!!actionText && (
          <div className={styles.linkText}>
            <div onClick={onActioned}>
              <Typography
                type={'help'}
                weight={'bold'}
                color={'primary'}
                text={actionText}
                className={styles.texthover}
              />
            </div>
            {renderIcon('ArrowNarrowRightIcon', styles.icon)}
          </div>
        )}
      </div>
    </div>
  );
};
