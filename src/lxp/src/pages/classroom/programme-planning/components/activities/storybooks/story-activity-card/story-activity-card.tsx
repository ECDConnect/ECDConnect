import { limitStringLength } from '@/utils/common/string.utils';
import {
  Card,
  Typography,
  Dialog,
  DialogPosition,
  classNames,
  renderIcon,
  Radio,
} from '@ecdlink/ui';
import { useState } from 'react';
import StoryActivityDetails from '../story-activity-details/story-activity-details';
import { StoryActivityCardProps } from './story-activity-card.types';

const StoryActivityCard: React.FC<StoryActivityCardProps> = ({
  activityId,
  storyBookId,
  title,
  selected,
  material,
  onSelected,
  className,
  onCleared,
  onStoryCleared,
  hideRadio,
}) => {
  const [displayDetails, setDisplayDetails] = useState(false);
  const handleDetailsClick = () => {
    setDisplayDetails(true);
  };

  return (
    <>
      <Card
        className={classNames(
          className,
          `bg-uiBg relative mt-1 flex w-full flex-col`
        )}
        borderRaduis="lg"
      >
        {hideRadio ? (
          <div className="flex items-center justify-between p-4">
            <div>
              <Typography type={'body'} color="textDark" text={title} />
              <Typography
                type="help"
                color="textMid"
                text={limitStringLength(
                  material
                    ? material.charAt(0).toUpperCase() + material.slice(1)
                    : '',
                  50
                )}
              />
            </div>
            <button onClick={handleDetailsClick}>
              {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
            </button>
          </div>
        ) : (
          <Radio
            variant="slim"
            description={title}
            hint={limitStringLength(
              material
                ? material.charAt(0).toUpperCase() + material.slice(1)
                : '',
              50
            )}
            checked={selected}
            onChange={() => onSelected()}
            className={'truncate border-0'}
            extraButtonIcon={renderIcon(
              'InformationCircleIcon',
              'h-6 w-6 text-infoMain'
            )}
            extraButtonOnClick={handleDetailsClick}
          />
        )}
      </Card>
      <Dialog
        visible={displayDetails}
        position={DialogPosition.Full}
        fullScreen
      >
        <StoryActivityDetails
          activityId={activityId}
          storyBookId={storyBookId}
          viewType={'StoryActivity'}
          onBack={() => setDisplayDetails(false)}
          onActivitySelected={() => {
            setDisplayDetails(false);
            onSelected();
          }}
          onActivitySwitched={() => {
            setDisplayDetails(false);
            onCleared();
          }}
          onStoryBookSwitched={() => {
            setDisplayDetails(false);
            onStoryCleared && onStoryCleared();
          }}
          selected={selected}
        />
      </Dialog>
    </>
  );
};
export default StoryActivityCard;
