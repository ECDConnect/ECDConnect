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

  const isRadioEnabled = () => {
    if (radioEnabled === false) return false;
    return true;
  };

  return (
    <>
      <Card
        className={classNames(
          className,
          `relative mt-4 flex flex-col ${
            selected ? 'border-secondary border-2' : ''
          }`
        )}
        shadowSize={!isRadioEnabled() ? 'none' : 'lg'}
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
            {languages && languages.length > 0 && (
              <>
                <div className={selected ? 'bg-secondaryAccent2' : 'bg-uiBg'}>
                  <div className="flex max-h-20 items-center justify-between gap-2">
                    {radioEnabled || radioEnabled !== false ? (
                      <Radio
                        isActivity={true}
                        description={languageList}
                        checked={selected}
                        onChange={() => onSelected()}
                        className={'max-h-20 truncate'}
                      />
                    ) : (
                      <Typography
                        type={'small'}
                        text={languageList}
                        className={'px-4'}
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
            )}
          </div>
          <StatusChip
            backgroundColour={selected ? 'infoBb' : 'primaryAccent2'}
            borderColour={selected ? 'infoBb' : 'primaryAccent2'}
            textColour={selected ? 'white' : 'primary'}
            textType={'help'}
            text={type}
            className={'flex w-1/3 justify-center'}
          />
        </div>
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
