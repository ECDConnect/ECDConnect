import {
  Alert,
  Button,
  Card,
  FADButton,
  StatusChip,
  Typography,
  RoundIcon,
  Dialog,
  DialogPosition,
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
  const activityCategories = useSelector(progressTrackingSelectors.getActivityCategories(activity));
  const handleDetailsClick = () => {
    setDisplayDetails(true);
  };

  const handleActivitySelected = () => {
    onSelected();
  };

  return (
    <>
      <Card
        className={`flex flex-col w-full relative mt-4 ${
          selected ? 'border-2 border-secondary' : ''
        }`}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        {recommended && (
          <StatusChip
            className="absolute top-0 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
            backgroundColour="infoDark"
            borderColour="transparent"
            textColour="white"
            text="Recommended"
          />
        )}
        <div className="p-4">
          <div className="flex flex-row justify-between items-center">
            <Typography type="body" text={activity.name} color={'textDark'} />
            <div className="flex flex-row">
              {!!activity.subCategories &&
                activity.subCategories.map((subCat, idx) => {
                  const category = activityCategories.find((cat) =>
                    cat.subCategories.some((x) => x.id === subCat.id)
                  );
                  return (
                    <RoundIcon
                      key={subCat.id}
                      imageUrl={subCat.imageUrl}
                      hexBackgroundColor={category?.color}
                      className={`text-white transform ${
                        idx % 2 === 0 ? 'translate-x-2' : ''
                      } border-2 border-solid border-white`}
                    />
                  );
                })}
            </div>
          </div>
          <div>
            <Typography type="body" text={'Materials'} color={'textLight'} fontSize={'14'} />
            <Typography type="body" text={activity.materials} color={'textDark'} />
            <Button type={'outlined'} color="primary" className="mt-2" onClick={handleDetailsClick}>
              see details
            </Button>
          </div>
        </div>
        {recommended && !!recommendedText && (
          <Alert type="info" message={recommendedText} variant="flat" />
        )}

        {!!warningText && <Alert type="warning" message={warningText} variant="flat" />}

        <FADButton
          title={selected ? 'Activity chosen' : 'Choose activity'}
          icon={'CheckCircleIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'ghost'}
          background={'transparent'}
          color={selected ? 'white' : 'uiMidDark'}
          shape={'normal'}
          className={`py-4 w-full ${selected ? 'bg-secondary ' : ''}`}
          click={handleActivitySelected}
        />
      </Card>
      <Dialog visible={displayDetails} position={DialogPosition.Full} fullScreen>
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
