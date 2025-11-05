import { JourneyTimeline } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';

export interface JourneyTimelineStepsProps {
  timelineItems: JourneyTimeline[];
  isLoading?: boolean;
  onView?: (visitId: string) => void;
}

export const journeyTimelineSteps = ({
  timelineItems,
  isLoading = false,
  onView,
}: JourneyTimelineStepsProps): StepItem[] => {
  const steps: StepItem[] = [];

  if (timelineItems && timelineItems.length > 0) {
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
