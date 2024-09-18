import { limitStringLength } from '@/utils/common/string.utils';
import { getAvatarColor } from '@ecdlink/core';
import {
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
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { practitionerSelectors } from '@/store/practitioner';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useAppContext } from '@/walkthrougContext';

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  recommended,
  recommendedText,
  warningText,
  selected,
  onSelected,
  onDeselection,
  onClose,
}) => {
  const { setState, state } = useAppContext();
  const isWalkthrough = state?.run;
  const nextWalkthroughStep = (stepNr: number) => {
    setState({ stepIndex: stepNr });
  };

  const [displayDetails, setDisplayDetails] = useState(false);
  const activityCategories = useSelector(
    progressTrackingSelectors.getActivityCategories(activity)
  );

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isTrialPeriod = useIsTrialPeriod();

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  const handleDetailsClick = () => {
    if (isWalkthrough) {
      onClose();
      nextWalkthroughStep(9);
      return;
    }
    setDisplayDetails(true);
  };

  const handleActivitySelected = () => {
    onSelected();
  };

  return (
    <>
      <Card
        className={`bg-infoBb relative mt-2 flex w-full flex-col ${
          selected
            ? 'border-quatenary border-2'
            : recommended
            ? 'border-infoMain border-2'
            : 'border-transparent'
        }`}
        shadowSize={'lg'}
        borderRaduis="lg"
      >
        {recommended && (
          <StatusChip
            className="absolute top-0 right-2 z-10 -translate-y-1/2 transform"
            backgroundColour="infoDark"
            borderColour="transparent"
            textColour="white"
            text="Recommended"
          />
        )}
        <div id="walkthrough-small-group-activity-learn">
          <Radio
            isActivity
            customIcon={
              <>
                {!!activity?.subCategories &&
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
                          idx % 2 !== 0 ? '-translate-x-4' : 'relative z-10'
                        } border-quatenaryBg border-2 border-solid`}
                      />
                    );
                  })}
              </>
            }
            description={activity.name}
            hint={limitStringLength(activity.materials, 50)}
            checked={selected}
            onChange={onSelected}
            extraButtonIcon={renderIcon(
              'InformationCircleIcon',
              'h-6 w-6 text-infoMain'
            )}
            extraButtonOnClick={handleDetailsClick}
          />
        </div>
        {recommended && !!recommendedText && (
          <Typography
            type="markdown"
            text={recommendedText}
            className="text-infoDark p-4"
          />
        )}
      </Card>
      <Dialog
        visible={displayDetails}
        position={DialogPosition.Full}
        fullScreen
      >
        <ActivityDetails
          disabled={!hasPermissionToEdit}
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
          availableLanguages={activity.availableLanguages}
        />
      </Dialog>
    </>
  );
};
export default ActivityCard;
