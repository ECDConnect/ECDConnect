import { classNames, renderIcon } from '../../../utils';
import Button from '../../button/button';
import { Card } from '../../card/card';
import Typography from '../../typography/typography';
import { CelebrationCardProps } from './celebration-card.types';

export const CelebrationCard: React.FC<CelebrationCardProps> = ({
  className,
  image,
  primaryTextColour,
  secondaryTextColour,
  scoreMessage,
  scoreIcon,
  primaryMessage,
  secondaryMessage,
  backgroundColour,
  onDismiss,
}) => {
  return (
    <Card
      className={classNames(
        className,
        `mt-2 px-4 py-4 sm:px-6 bg-${backgroundColour}`
      )}
      borderRaduis="lg"
    >
      <div className="flex flex-row gap-3">
        {image}
        <div className="flex-column gap-3">
          <Typography
            type="h3"
            color={primaryTextColour}
            text={primaryMessage}
            className="pt-2"
          />
          <Typography
            type="body"
            color={secondaryTextColour || 'black'}
            text={secondaryMessage}
            className="pt-2"
          />
          {!!scoreMessage && (
            <div className={'mt-2 flex flex-1 flex-row'}>
              {!!scoreIcon && (
                <div>
                  {renderIcon(
                    scoreIcon,
                    `h-6 w-6 text-${secondaryTextColour} mr-1.5`
                  )}
                </div>
              )}
              <Typography
                type={'h3'}
                text={scoreMessage}
                color={secondaryTextColour || 'black'}
              />
            </div>
          )}
        </div>
        {!!onDismiss && (
          <div
            className="items-top mb-2 flex pr-1"
            style={{ marginLeft: 'auto' }}
          >
            <Button onClick={onDismiss} type={'ghost'} color={backgroundColour}>
              {renderIcon('XIcon', `h-6 w-6 text-${secondaryTextColour}`)}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CelebrationCard;
