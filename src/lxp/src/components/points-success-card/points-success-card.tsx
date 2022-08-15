import { useTheme } from '@ecdlink/core';
import { classNames, renderIcon, Typography } from '@ecdlink/ui';
import * as styles from './points-success-card.styles';
import { PointsSuccessCardProps } from './points-success-card.types';

export const PointsSuccessCard: React.FC<PointsSuccessCardProps> = ({
  icon = '',
  message = '',
  prePointsText,
  postPointsText,
  points,
  isSmartStartUser,
  className,
  visible,
  onClose,
}: PointsSuccessCardProps) => {
  const { theme } = useTheme();
  const getPointsText = () => {
    return points ? points.toString() + ' points' : '';
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {visible && (
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
              <div className={'flex flex-1 flex-row'}>
                <div>
                  <div className={styles.iconRound}>
                    {renderIcon(icon, 'h-6 w-6 text-white')}
                  </div>
                </div>
                <div
                  className={styles.textWrapper}
                  data-testid="important-wrapper"
                >
                  {message?.length > 0 && (
                    <Typography
                      type={'body'}
                      weight={'bold'}
                      text={message}
                      color={'white'}
                    />
                  )}
                  {isSmartStartUser && (
                    <div>
                      <div className={'flex flex-row mt-2'}>
                        <div>
                          {renderIcon('GiftIcon', 'h-5 w-5 text-white mr-1.5')}
                        </div>
                        <Typography
                          type={'body'}
                          weight={'bold'}
                          text={prePointsText ?? 'Keep going to earn'}
                          color={'white'}
                        />
                      </div>
                      <div className={'flex flex-row'}>
                        {points && (
                          <Typography
                            type={'body'}
                            weight={'bold'}
                            text={getPointsText()}
                            color={'white'}
                            className={'mr-1'}
                          />
                        )}
                        <Typography
                          type={'body'}
                          weight={'bold'}
                          text={postPointsText ?? 'each month.'}
                          color={'white'}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.closeWrapper}>
                  <div onClick={() => onClose && onClose()}>
                    {renderIcon('XIcon', 'h-6 w-6 text-white')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PointsSuccessCard;
