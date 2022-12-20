import { Card, Typography, ComponentBaseProps, classNames } from '@ecdlink/ui';
import * as styles from './progress-observation-sub-category-card.styles';

interface ProgressObservationSubCategoryCardProps extends ComponentBaseProps {
  color?: string;
  text: string;
  subText?: string;
  image: string;
  isFullCard?: boolean;
}

export const ProgressObsersvationSubCategoryCard: React.FC<
  ProgressObservationSubCategoryCardProps
> = ({ color, image, text, subText, className, isFullCard = false }) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isFullCard ? (
        <Card
          className={classNames(styles.fullWrapper, className)}
          borderRaduis={'md'}
          shadowSize={'md'}
        >
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: color ?? '#808080' }}
          >
            <img className={'m-auto'} src={image} alt="card" />
          </div>
          <Typography
            className="mt-2"
            text={text}
            type="body"
            weight="bold"
            lineHeight="snug"
          />

          <Typography
            className="mt-2"
            text={subText}
            type="body"
            lineHeight="snug"
          />
        </Card>
      ) : (
        <Card
          className={classNames(styles.wrapper, className)}
          borderRaduis={'md'}
          shadowSize={'md'}
        >
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: color ?? '#808080' }}
          >
            <div
              className={styles.iconWrapper}
              style={{ backgroundColor: color ?? '#808080' }}
            >
              <img className={'m-auto'} src={image} alt="card" />
            </div>
            <Typography text={text} type="body" lineHeight="snug" />

            <Typography text={subText} type="body" lineHeight="snug" />
          </div>
        </Card>
      )}
    </>
  );
};
