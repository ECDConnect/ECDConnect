import { JourneyTimeline } from '@ecdlink/graphql';
import { StepItem } from '@ecdlink/ui';
import { parseCourseNameFromTimelineItem } from '@/utils/certificate/certificate.constants';

export interface JourneyTimelineStepsProps {
  timelineItems: JourneyTimeline[];
  isLoading?: boolean;
  onView?: (visitId: string) => void;
  onCertificate?: (courseName: string, completedDate: string) => void;
  tenantName: string;
  startDate: string;
}

const isCourseTimelineItem = (type?: string | null) =>
  type?.toLowerCase() === 'course';

export const journeyTimelineSteps = ({
  timelineItems,
  isLoading = false,
  onView,
  onCertificate,
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
      const isCourse = isCourseTimelineItem(timelineItem?.type);
      const hasViewButton = Boolean(visitId && onView);
      const hasCertificateButton = isCourse && Boolean(onCertificate);
      const showActionButton = hasViewButton || hasCertificateButton;

      steps.push({
        title: timelineItem?.name || '',
        subTitle:
          timelineItem?.secondaryText || timelineItem?.dateCompleted || '',
        subTitleColor:
          timelineItem?.iconName === 'ExclamationCircleIcon'
            ? 'alertMain'
            : 'textLight',
        completedStepIcon: timelineItem?.iconName || '',
        color:
          timelineItem?.iconName === 'ExclamationCircleIcon'
            ? 'alertMain'
            : undefined,
        type: 'completed',
        extraData: timelineItem?.dateCompleted || '',
        showActionButton,
        actionButtonText: isCourse ? 'Certificate' : 'View',
        actionButtonTextColor: 'secondary',
        actionButtonIsLoading: isLoading,
        actionButtonColor: 'secondaryAccent2',
        actionButtonOnClick: showActionButton
          ? () =>
              isCourse
                ? onCertificate?.(
                    parseCourseNameFromTimelineItem(timelineItem?.name || ''),
                    timelineItem?.dateCompleted || ''
                  )
                : onView?.(visitId!)
          : undefined,
      });
    });
  }

  return steps;
};
