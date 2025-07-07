import {
  Card,
  StatusChip,
  Typography,
  Dialog,
  DialogPosition,
  classNames,
  Radio,
  renderIcon,
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
  className,
  radioEnabled,
}) => {
  const [displayDetails, setDisplayDetails] = useState(false);
  const handleDetailsClick = () => {
    setDisplayDetails(true);
  };
  const languageList = languages?.map((x) => x.description)?.join(', ');

  return (
    <>
      <Card
        className={classNames(className, `bg-uiBg relative mt-1 flex flex-col`)}
        borderRaduis="lg"
      >
        {languages && languages.length > 0 && (
          <>
            {radioEnabled || radioEnabled !== false ? (
              <Radio
                variant="slim"
                description={title}
                hint={languageList}
                checked={selected}
                onChange={() => onSelected()}
                extraButtonIcon={renderIcon(
                  'InformationCircleIcon',
                  'h-6 w-6 text-infoMain'
                )}
                extraButtonOnClick={handleDetailsClick}
                statusChip={{
                  backgroundColour: 'quatenary',
                  borderColour: 'quatenary',
                  textColour: selected ? 'white' : 'primary',
                  text: type,
                  className: 'w-max mt-2',
                }}
              />
            ) : (
              <div className="flex items-center justify-between gap-2 p-4">
                <div>
                  <Typography type={'body'} color="textDark" text={title} />
                  <Typography
                    type={'help'}
                    color="textMid"
                    text={languageList}
                  />
                  <StatusChip
                    backgroundColour={'quatenary'}
                    borderColour={'quatenary'}
                    textColour={'primary'}
                    textType={'help'}
                    text={type}
                    className="mt-1 w-max"
                  />
                </div>
                <button onClick={handleDetailsClick} className={'mb-2'}>
                  {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
                </button>
              </div>
            )}
          </>
        )}
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
