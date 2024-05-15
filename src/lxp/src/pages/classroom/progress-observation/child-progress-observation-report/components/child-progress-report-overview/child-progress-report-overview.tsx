import { ProgressTrackingCategoryDto, useDialog } from '@ecdlink/core';
import {
  Alert,
  Button,
  Typography,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { ChildProgressReportOverviewProps } from './child-progress-report-overview.types';
import { ChildProgressAssessmentSteps } from '../../../child-progress-assessment/child-progress-assessment.types';
import ObservationCategoryCard from '../../../components/observation-category-card/observation-category-card';
import { DownloadProgressTrackingReportPrompt } from '../../../components/progress-tracking-prompts/download-progress-tracking-report-prompt/download-progress-tracking-report-prompt';
import { classroomsSelectors } from '@store/classroom';
import { getCategoryFromCurrentReport } from '@utils/child/child-progress-report.utils';
import { contentReportSelectors } from '@store/content/report';
import { getReportingPeriod } from '@utils/child/child-profile-utils';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { analyticsActions } from '@store/analytics';
import { useState } from 'react';

export const ChildProgressReportOverview: React.FC<
  ChildProgressReportOverviewProps
> = ({ childId, reportingDate }) => {
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const dialog = useDialog();
  const child = useSelector(childrenSelectors.getChildById(childId));

  const childLearner = useSelector(classroomsSelectors.getChildLearner(child));
  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );
  const reportingDateAsDate = reportingDate
    ? new Date(reportingDate)
    : new Date();
  const { isOnline } = useOnlineStatus();
  const [showObservations, setShowObservations] = useState<boolean>(false);
  const reportingPeriod = getReportingPeriod(reportingDateAsDate);

  const report = useSelector(
    contentReportSelectors.getChildProgressObservationReportByReportingPeriod(
      reportingDateAsDate,
      childId
    )
  );
  const { currentReport, completeReport, completeReportLocally } =
    useChildProgressObservation(childId, report);

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

  const createCaregiverReport = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <DownloadProgressTrackingReportPrompt
            reportingPeriod={currentReport?.reportingPeriod || ''}
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
        await completeReport(
          currentReport,
          childLearner?.classroomGroupId || ''
        );
        history.replace('/download-child-progress-observation-reports', {
          childId: childId,
        });
      } else {
        completeReportLocally(
          currentReport,
          childLearner?.classroomGroupId || ''
        );
        history.replace('/completed-child-progress-observation-reports', {
          childId: childId,
        });
      }
    }
  };

  return (
    <>
      <div className={'flex h-full w-full flex-col px-4'}>
        <Typography
          type={'h2'}
          color={'textDark'}
          text={`Check and edit your observations & create report`}
          className="mb-2"
        />
        <Typography
          type={'h4'}
          color={'textDark'}
          text={getReportingPeriodText()}
          className={'mb-4'}
        />
        <Alert
          type={'info'}
          title={`Check and edit your responses to the four categories or create the report.`}
          message={` Your responses below will be shared with ${child?.user?.firstName}’s caregiver.`}
          messageColor="textDark"
        />
        <Button
          className="mt-4 w-full"
          size="small"
          color="primary"
          type="filled"
          onClick={createCaregiverReport}
        >
          {renderIcon('DocumentReportIcon', 'h-5 w-5 text-white')}
          <Typography
            type="h6"
            className="ml-2"
            text="Create caregiver report"
            color="white"
          />
        </Button>
        <Button
          className="mt-4 w-full"
          size="small"
          color="primary"
          type="outlined"
          onClick={() => setShowObservations(!showObservations)}
        >
          {renderIcon(
            showObservations ? 'EyeOffIcon' : 'EyeIcon',
            'h-5 w-5 text-primary'
          )}
          <Typography
            type="h6"
            className="ml-2"
            text={
              showObservations ? 'Hide observations' : 'See & edit observations'
            }
            color="primary"
          />
        </Button>
        {showObservations &&
          currentReport &&
          categories.map((cat: ProgressTrackingCategoryDto) => {
            const categoryFromReport = getCategoryFromCurrentReport(
              cat.id,
              currentReport
            );

            return (
              <ObservationCategoryCard
                key={`completed-${cat.id}`}
                className={'mt-4'}
                categoryImageUrl={cat.imageUrl}
                categoryName={cat.name}
                categoryColour={cat.color}
                isCompetentWithCategory={
                  [
                    ProgressTrackingLevels.LevelThree,
                    ProgressTrackingLevels.LevelTwo,
                  ].includes(categoryFromReport?.achievedLevelId ?? 0) &&
                  !categoryFromReport?.supportingTask
                }
                levelId={categoryFromReport?.achievedLevelId || 0}
                childName={`${child?.user?.firstName}`}
                helpingSkillId={categoryFromReport?.supportingTask?.taskId || 0}
                toDoNote={categoryFromReport?.supportingTask?.todoText || ''}
                onEdit={() => onCategoryNavigation(cat.id)}
              />
            );
          })}
      </div>
    </>
  );
};
