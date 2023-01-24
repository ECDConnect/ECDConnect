import { classNames, renderIcon, Typography } from '@ecdlink/ui';
import { SuccessCardProps } from './success-card.types';
import * as styles from './success-card.styles';
import { useTheme } from '@ecdlink/core';
export const SuccessCard: React.FC<SuccessCardProps> = ({
  icon,
  customIcon,
  text,
  subText,
  color,
  onClose,
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div className={className}>
      <div
        className={classNames(styles.wrapper)}
        style={
          color
            ? { backgroundColor: color }
            : {
                backgroundImage: `url(${theme?.images.graphicOverlayUrl})`,
                backgroundColor: 'successMain',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }
        }
      >
        <div className={styles.contentWrapper}>
          <div className={'flex flex-1 flex-row items-center'}>
            {customIcon || (
              <div className={styles.iconRound}>
                {icon && renderIcon(icon, 'h-6 w-6 text-white')}
              </div>
            )}
            <div className={styles.textWrapper} data-testid="important-wrapper">
              <Typography
                type={'help'}
                fontSize={'16'}
                weight="bold"
                text={text}
                color={'white'}
              />
              {!!subText && (
                <div className={'mt-2 flex flex-row'}>
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
