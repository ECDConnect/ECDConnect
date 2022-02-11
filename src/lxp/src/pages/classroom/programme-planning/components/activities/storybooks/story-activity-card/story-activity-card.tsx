import { Button, Card, FADButton, Typography, Dialog, Alert } from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { classNames } from '@ecdlink/ui';
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
  warningText,
  buttonIcon,
  buttonText,
  className,
  onCleared,
  onStoryCleared,
  hideDetails,
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
          `flex flex-col w-full relative mt-4 ${selected ? 'border-2 border-secondary' : ''}`
        )}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        <div className="p-4">
          <div className="flex flex-row justify-between items-center">
            <Typography type="body" text={title} color={'textDark'} />
          </div>
          <div>
            <Typography className={'mt-2'} type="body" text={'Materials'} color={'textDark'} />

            <Typography type="help" text={material} color={'textDark'} />
            {!hideDetails && (
              <Button
                type={'outlined'}
                color="primary"
                className="mt-2"
                size={'small'}
                onClick={handleDetailsClick}
              >
                see details
              </Button>
            )}
          </div>
        </div>

        {!!warningText && <Alert type="warning" message={warningText} variant="flat" />}

        <FADButton
          title={buttonText || selected ? 'Activity chosen' : 'Choose activity'}
          icon={buttonIcon || 'CheckCircleIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'ghost'}
          background={'transparent'}
          color={selected ? 'white' : 'uiMidDark'}
          shape={'normal'}
          className={`py-4 w-full border-t ${selected ? 'bg-secondary ' : ''}`}
          click={() => onSelected()}
        />
      </Card>
      <Dialog visible={displayDetails} position={DialogPosition.Full} fullScreen>
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
