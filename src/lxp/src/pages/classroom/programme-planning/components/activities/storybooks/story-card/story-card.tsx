import {
  Button,
  Card,
  FADButton,
  StatusChip,
  Typography,
  Dialog,
  DialogPosition,
  classNames,
} from '@ecdlink/ui';
import { useState } from 'react';
import StoryActivityDetails from '../story-activity-details/story-activity-details';
import { StoryCardProps } from './story-card.types';

const StoryCard: React.FC<StoryCardProps> = ({
  storyBookId,
  activityId,
  title,
  type,
  selected,
  languages,
  onSelected,
  onCleared,
  onActivityCleared,
  buttonIcon,
  buttonText,
  className,
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
          `relative mt-4 flex w-full flex-col ${
            selected ? 'border-secondary border-2' : ''
          }`
        )}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        <div className="p-4">
          <div className="flex flex-row items-center justify-between">
            <Typography type="body" text={title} color={'textDark'} />

            <StatusChip
              backgroundColour={'infoBb'}
              borderColour={'infoBb'}
              textColour={'infoDark'}
              textType={'help'}
              text={type}
            />
          </div>
          <div>
            {languages && languages.length > 0 && (
              <>
                <Typography
                  className={'mt-2'}
                  type="body"
                  text={'Available in'}
                  color={'textDark'}
                />
                <Typography
                  type="help"
                  text={languages?.map((x) => x.description)?.join(', ')}
                  color={'textDark'}
                />
              </>
            )}

            {!hideDetails && (
              <Button
                type={'outlined'}
                color="primary"
                className="mt-2"
                size={'small'}
                onClick={handleDetailsClick}
              >
                See details
              </Button>
            )}
          </div>
        </div>

        <FADButton
          title={buttonText || selected ? `Story chosen` : `Choose story`}
          icon={buttonIcon || 'CheckCircleIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'ghost'}
          background={'transparent'}
          color={selected ? 'white' : 'uiMidDark'}
          shape={'normal'}
          className={`w-full border-t py-4 ${selected ? 'bg-secondary ' : ''}`}
          click={onSelected}
        />
      </Card>
      <Dialog
        visible={displayDetails}
        position={DialogPosition.Full}
        fullScreen
      >
        <StoryActivityDetails
          viewType="StoryBook"
          storyBookId={storyBookId}
          activityId={activityId}
          onBack={() => setDisplayDetails(false)}
          selected={selected}
          onStoryBookSelected={() => {
            setDisplayDetails(false);
            onSelected();
          }}
          onStoryBookSwitched={() => {
            setDisplayDetails(false);
            onCleared();
          }}
          onActivitySwitched={() => {
            setDisplayDetails(false);
            onActivityCleared && onActivityCleared();
          }}
        />
      </Dialog>
    </>
  );
};
export default StoryCard;
