import { limitStringLength } from '@/utils/common/string.utils';
import { getAvatarColor } from '@ecdlink/core';
import {
  Alert,
  Card,
  StatusChip,
  Typography,
  RoundIcon,
  Dialog,
  DialogPosition,
  Radio,
  renderIcon,
} from '@ecdlink/ui/';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ActivityDetails from '../activity-details/activity-details';
import { ActivityCardProps } from './activity-card.types';

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  recommended,
  recommendedText,
  warningText,
  selected,
  onSelected,
  onDeselection,
}) => {
  const [displayDetails, setDisplayDetails] = useState(false);
  const activityCategories = useSelector(
    progressTrackingSelectors.getActivityCategories(activity)
  );
  const handleDetailsClick = () => {
    setDisplayDetails(true);
  };

  const handleActivitySelected = () => {
    onSelected();
  };

  return (
    <>
      <Card
        className={`bg-secondaryAccent2 relative mt-4 flex w-full flex-col ${
          selected ? 'border-secondary border-2' : ''
        }`}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        {recommended && (
          <StatusChip
            className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 transform"
            backgroundColour="infoDark"
            borderColour="transparent"
            textColour="white"
            text="Recommended"
          />
        )}
        <div
          className={`bg-uiBg rounded-lg p-2 ${selected ? 'bg-secondary' : ''}`}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="flex flex-row gap-2">
              {!!activity.subCategories &&
                activity.subCategories.map((subCat, idx) => {
                  const category = activityCategories.find((cat) =>
                    cat.subCategories.some((x) => x.id === subCat.id)
                  );
                  return (
                    <RoundIcon
                      key={subCat.id}
                      imageUrl={subCat.imageUrl}
                      hexBackgroundColor={category?.color || getAvatarColor()}
                      className={`transform text-white ${
                        idx % 2 === 0 ? 'translate-x-2' : ''
                      } border-2 border-solid border-white`}
                    />
                  );
                })}
            </div>
            <Typography type="body" text={activity.name} color={'textDark'} />
          </div>
          <div className="flex max-h-20 flex-row items-center justify-between gap-2 overflow-hidden">
            <Radio
              variant="slim"
              isActivity={true}
              description={limitStringLength(activity.materials, 50)}
              checked={selected}
              onChange={() => onSelected()}
              className={'max-h-20 truncate'}
            />
            <div onClick={handleDetailsClick} className={'mb-2'}>
              {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
            </div>
          </div>
        </div>
        {recommended && !!recommendedText && (
          <Alert type="info" message={recommendedText} variant="flat" />
        )}

        {/* {!!warningText && (
          <Alert type="warning" message={warningText} variant="flat" />
        )} */}
      </Card>
      <Dialog
        visible={displayDetails}
        position={DialogPosition.Full}
        fullScreen
      >
        <ActivityDetails
          isSelected={selected}
          activityId={activity.id}
          onActivityChanged={() => {
            onDeselection();
            setDisplayDetails(false);
          }}
          onBack={() => setDisplayDetails(false)}
          onActivitySelected={() => {
            handleActivitySelected();
            setDisplayDetails(false);
          }}
        />
      </Dialog>
    </>
  );
};
export default ActivityCard;
