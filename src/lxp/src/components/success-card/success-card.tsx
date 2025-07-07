import { classNames, renderIcon, Typography } from '@ecdlink/ui';
import { SuccessCardProps } from './success-card.types';
import * as styles from './success-card.styles';
import { useTheme } from '@ecdlink/core';
export const SuccessCard: React.FC<SuccessCardProps> = ({
  icon,
  text,
  subText,
  onClose,
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div className={className}>
      <div
        className={classNames(styles.wrapper)}
        style={{
          backgroundImage: `url(${theme?.images.graphicOverlayUrl})`,
          backgroundColor: 'successMain',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className={styles.contentWrapper}>
          <div className={'flex flex-1 flex-row items-start'}>
            <div className={styles.iconRound}>
              {renderIcon(icon, 'h-6 w-6 text-white')}
            </div>
            <div className={styles.textWrapper} data-testid="important-wrapper">
              <Typography
                type={'help'}
                fontSize={'16'}
                weight={'bold'}
                text={text}
                color={'white'}
              />
              {!!subText && (
                <div className={'flex flex-row mt-2'}>
                  <Typography
                    type={'help'}
                    fontSize={'16'}
                    weight={'skinny'}
                    text={subText}
                    color={'white'}
                  />
                </div>
              )}
            </div>
            {onClose && (
              <div className={styles.closeWrapper}>
                <div onClick={() => onClose && onClose()}>
                  {renderIcon('XIcon', 'h-6 w-6 text-white')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
