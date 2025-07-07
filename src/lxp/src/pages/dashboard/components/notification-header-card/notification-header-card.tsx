import { Button, Typography } from '@ecdlink/ui';
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
        <Typography
          type={'h2'}
          text={header}
          color={'textDark'}
          className={styles.header}
        />
        <Typography
          type={'body'}
          text={message}
          color={'textMid'}
          className={styles.text}
        />
        {!!actionText && (
          <Button
            icon="ArrowCircleRightIcon"
            text={actionText}
            onClick={onActioned}
            type={'filled'}
            color={'quatenary'}
            background={'filled'}
            textColor={'white'}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};
