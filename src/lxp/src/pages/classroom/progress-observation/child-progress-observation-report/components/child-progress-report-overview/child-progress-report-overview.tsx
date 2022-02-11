import { ProgressTrackingCategoryDto, useDialog } from '@ecdlink/core';
import { Alert, Button, Divider, Typography } from '@ecdlink/ui';
import { DialogPosition } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useChildProgressObservation } from '../../../../../../hooks/useChildProgressObservations';
import { childrenSelectors } from '../../../../../../store/children';
import { progressTrackingSelectors } from '../../../../../../store/progress-tracking';
import { ProgressTrackingLevels } from '../../../../../../enums/ProgressTrackingLevels';
import { ChildProgressReportOverviewProps } from './child-progress-report-overview.types';
import { ChildProgressAssessmentSteps } from '../../../child-progress-assessment/child-progress-assessment.types';
import ObservationCategoryCard from '../../../components/observation-category-card/observation-category-card';
import { DownloadProgressTrackingReportPrompt } from '../../../components/progress-tracking-prompts/download-progress-tracking-report-prompt/download-progress-tracking-report-prompt';
import { classroomsSelectors } from '../../../../../../store/classroom';
import { getCategoryFromCurrentReport } from '../../../../../../utils/child/child-progress-report.utils';
import { contentReportSelectors } from '../../../../../../store/content/report';
import { getReportingPeriod } from '../../../../../../utils/child/child-profile-utils';
import { useOnlineStatus } from '../../../../../../hooks/useOnlineStatus';
import { useAppDispatch } from '../../../../../../store';
import { analyticsActions } from '../../../../../../store/analytics';

export const ChildProgressReportOverview: React.FC<ChildProgressReportOverviewProps> = ({
  childId,
  reportingDate,
}) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(childrenSelectors.getChildUserById(child?.userId));
  const childLearner = useSelector(classroomsSelectors.getChildLearner(child));
  const categories = useSelector(progressTrackingSelectors.getProgressTrackingCategories);
  const reportingDateAsDate = reportingDate ? new Date(reportingDate) : new Date();
  const { isOnline } = useOnlineStatus();
  const reportingPeriod = getReportingPeriod(reportingDateAsDate);

  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDateAsDate,
      childId
    )
  );
  const { currentReport, completeReport, completeReportLocally } = useChildProgressObservation(
    childId,
    report
  );

  const onCategoryNavigation = (categoryId: number) => {
    history.push('child-progress-assessment', {
      step: ChildProgressAssessmentSteps.assessmentStepOne,
      childId: childId,
      progressTrackingCategoryId: categoryId,
      returnToOverview: true,
      reportingDate: reportingDate,
    });
  };

  const getReportingPeriodText = () => {
    if (!currentReport) return '';

    return currentReport.reportingPeriod === 'June'
      ? `January to June ${reportingPeriod.year}`
      : `July to November ${reportingPeriod.year}`;
  };

  const displayDownloadReportPrompt = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <DownloadProgressTrackingReportPrompt
            onClose={onClose}
            onProceed={() => {
              onSubmit();
              downloadReport();

              appDispatch(
                analyticsActions.createEventTracking({
                  action: 'Child progress report click',
                  category: 'Child progress report click',
                })
              );
            }}
          />
        );
      },
    });
  };

  const downloadReport = async () => {
    if (currentReport) {
      if (isOnline) {
        await completeReport(currentReport, childLearner?.classroomGroupId || '');
        history.replace('/download-child-progress-observation-reports', { childId: childId });
      } else {
        completeReportLocally(currentReport, childLearner?.classroomGroupId || '');
        history.replace('/completed-child-progress-observation-reports', { childId: childId });
      }
    }
  };

  return (
    <>
      <div className={'h-full w-full flex flex-col px-4'}>
        <Typography type={'h1'} color={'primary'} text={`Check your progress observations:`} />
        <Typography
          type={'body'}
          color={'black'}
          text={getReportingPeriodText()}
          className={'mb-4'}
        />
        <Alert
          type={'info'}
          message={`Check and edit your responses to the four categories or download the report. Your responses below will be shared with ${childUser?.firstName}’s caregiver.`}
        />
        {currentReport &&
          categories.map((cat: ProgressTrackingCategoryDto) => {
            const categoryFromReport = getCategoryFromCurrentReport(cat.id, currentReport);

            return (
              <ObservationCategoryCard
                key={`completed-${cat.id}`}
                className={'mt-4'}
                categoryName={cat.name}
                categoryColour={cat.color}
                isCompetentWithCategory={
                  [ProgressTrackingLevels.LevelThree, ProgressTrackingLevels.LevelTwo].includes(
                    categoryFromReport?.achievedLevelId ?? 0
                  ) && !categoryFromReport?.supportingTask
                }
                levelId={categoryFromReport?.achievedLevelId || 0}
                childName={`${childUser?.firstName}`}
                helpingSkillId={categoryFromReport?.supportingTask?.taskId || 0}
                toDoNote={categoryFromReport?.supportingTask?.todoText || ''}
                onEdit={() => onCategoryNavigation(cat.id as number)}
              />
            );
          })}

        <Divider className={'my-4'} />

        <Button
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          onClick={displayDownloadReportPrompt}
        >
          {renderIcon('DownloadIcon', 'h-5 w-5 text-white')}
          <Typography type="h6" className="ml-2" text="Create report" color="white" />
        </Button>
      </div>
    </>
  );
};
