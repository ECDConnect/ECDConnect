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
          `relative mt-4 flex w-full flex-col ${
            selected ? 'border-secondary border-2' : ''
          }`
        )}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        <div
          className={
            selected
              ? 'bg-secondaryAccent2 rounded-lg p-4'
              : 'bg-uiBg rounded-lg p-4'
          }
        >
          <div className="flex flex-row items-center justify-between">
            <Typography
              type="body"
              text={title}
              color={'textDark'}
              className={'semibold'}
            />
          </div>
          <div>
            <>
              <div className={selected ? 'bg-secondaryAccent2' : 'bg-uiBg'}>
                <div className="flex max-h-20 items-center justify-between gap-2">
                  {hideRadio ? (
                    <Typography
                      type="help"
                      color="textMid"
                      text={limitStringLength(
                        material.charAt(0).toUpperCase() + material.slice(1),
                        50
                      )}
                    />
                  ) : (
                    <Radio
                      isActivity={true}
                      description={limitStringLength(
                        material.charAt(0).toUpperCase() + material.slice(1),
                        50
                      )}
                      checked={selected}
                      onChange={() => onSelected()}
                      className={'truncate border-0'}
                    />
                  )}
                  <div onClick={handleDetailsClick} className={'mb-2'}>
                    {renderIcon(
                      'InformationCircleIcon',
                      'h-6 w-6 text-infoMain'
                    )}
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
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
