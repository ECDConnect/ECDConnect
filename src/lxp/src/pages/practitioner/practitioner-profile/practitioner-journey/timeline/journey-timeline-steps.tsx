import { JourneyTimeline } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';

export interface JourneyTimelineStepsProps {
  timelineItems: JourneyTimeline[];
  isLoading?: boolean;
  onView?: (visitId: string) => void;
  tenantName: string;
  startDate: string;
}

export const journeyTimelineSteps = ({
  timelineItems,
  isLoading = false,
  onView,
  tenantName,
  startDate,
}: JourneyTimelineStepsProps): StepItem[] => {
  const steps: StepItem[] = [];

  // Add "Registered" step
  const registeredItem: StepItem = {
    title: `Registered for ${tenantName}`,
    subTitle: startDate,
    subTitleColor: 'textLight',
    completedStepIcon: 'CheckIcon',
    type: 'completed',
    showActionButton: false,
  };

  steps.push(registeredItem);

  // Add timeline steps
  if (timelineItems?.length) {
    timelineItems.forEach((timelineItem) => {
      const visitId = timelineItem?.visitId;
      const hasViewButton = Boolean(visitId && onView);

      steps.push({
        title: timelineItem?.name || '',
        subTitle: timelineItem?.dateCompleted || '',
        subTitleColor: 'textLight',
        completedStepIcon: timelineItem?.iconName || '',
        type: 'completed',
        extraData: timelineItem?.dateCompleted || '',
        showActionButton: hasViewButton,
        actionButtonText: 'View',
        actionButtonTextColor: 'secondary',
        actionButtonIsLoading: isLoading,
        actionButtonColor: 'secondaryAccent2',
        actionButtonOnClick: hasViewButton
          ? () => onView?.(visitId!)
          : undefined,
      });
    });
  }

  return steps;
};
