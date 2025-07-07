import { Button, classNames, renderIcon, Typography } from '@ecdlink/ui';
import { CustomSuccessCardProps } from './custom-success-card.types';
import * as styles from './custom-success-card.styles';
import { useTheme } from '@ecdlink/core';
export const CustomSuccessCard: React.FC<CustomSuccessCardProps> = ({
  icon,
  customIcon,
  text,
  textColour,
  subText,
  subTextColours,
  color,
  onClose,
  className,
  button,
}) => {
  const { theme } = useTheme();

  return (
    <div className={className}>
      <div
        className={classNames(
          styles.wrapper,
          color ? `bg-${color}` : 'bg-successMain'
        )}
        style={
          color
            ? { backgroundColor: 'successBg' }
            : {
                backgroundImage: `url(${theme?.images.graphicOverlayUrl})`,
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
                color={textColour || 'white'}
              />
              {!!subText && (
                <div className={'mt-2 flex flex-row'}>
                  <Typography
                    type={'help'}
                    fontSize={'16'}
                    weight={'skinny'}
                    text={subText}
                    color={subTextColours || 'white'}
                  />
                </div>
              )}
              {button && <Button {...button} />}
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
