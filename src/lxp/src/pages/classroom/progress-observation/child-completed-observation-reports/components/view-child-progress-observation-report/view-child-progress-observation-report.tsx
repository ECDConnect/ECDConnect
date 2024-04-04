import {
  BannerWrapper,
  Button,
  Typography,
  renderIcon,
  LoadingSpinner,
} from '@ecdlink/ui';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ViewChildProgressObservationReportState } from './view-child-progress-observation-report.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { ChildProgressObservationReport } from '@ecdlink/core';
import { contentReportThunkActions } from '@store/content/report';
import ObservationCategoryCard from '../../../components/observation-category-card/observation-category-card';
import {
  getCategoryFromCurrentReport,
  saveBase64Pdf,
} from '@utils/child/child-progress-report.utils';
import { ProgressTrackingLevels } from '@enums/ProgressTrackingLevels';
import { classroomsSelectors } from '@store/classroom';
import { analyticsActions } from '@store/analytics';
import { DateFormats } from '@/constants/Dates';

export const ViewChildProgressObservationReport: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const [currentReport, setCurrentReport] =
    useState<ChildProgressObservationReport>();
  const { state: routeState } =
    useLocation<ViewChildProgressObservationReportState>();
  const [loading, setLoading] = useState(false);

  const currentChild = useSelector(
    childrenSelectors.getChildById(routeState.childId)
  );
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const currentChildLearner = useSelector(
    classroomsSelectors.getChildLearner(currentChild)
  );
  const allCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Progress Observation Report',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const downloadReport = async () => {
    if (!currentReport) return;

    setLoading(true);

    const base64Pdf = await appDispatch(
      contentReportThunkActions.generateChildProgressReport({
        childId: currentReport.childId,
        classgroupId: currentChildLearner?.classroomGroupId || '',
        reportDate: currentReport.reportingDate
          ? new Date(currentReport.reportingDate)
          : new Date(),
      })
    ).unwrap();

    setLoading(false);

    saveBase64Pdf(
      base64Pdf,
      `${currentChildUser?.firstName}${currentChildUser?.surname}-${currentReport.reportingPeriod}`
    );
  };

  useEffect(() => {
    const getReport = async () => {
      setLoading(true);
      const report = await appDispatch(
        contentReportThunkActions.getDetailedProgressReport(routeState.reportId)
      ).unwrap();
      setCurrentReport(report);
      setLoading(false);
    };
    getReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedDate = `${new Date(
    (currentReport?.reportingPeriod === 'First'
      ? currentReport?.dateCreated
      : currentReport?.reportingDate) || 0
  ).toLocaleString('en-za', DateFormats.shortMonthNameAndYear)}`;

  if (loading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  return (
    <BannerWrapper
      size={'small'}
      onBack={() => {
        if (loading) return;
        history.goBack();
      }}
      title={`${currentChildUser?.firstName}'s progress`}
      displayOffline={!isOnline}
    >
      <div className={'flex flex-col p-4'}>
        <Typography type={'h2'} color={'textDark'} text={'Progress report'} />
        <Typography
          type={'h4'}
          color="textDark"
          text={
            currentReport?.reportingPeriod === 'First'
              ? `First observations ${formattedDate}`
              : `${formattedDate}`
          }
        />

        {currentReport &&
          allCategories &&
          allCategories.map((cat) => {
            const categoryFromReport = getCategoryFromCurrentReport(
              cat.id,
              currentReport
            );
            return (
              <ObservationCategoryCard
                key={`completed-${cat.id}`}
                className={'border-uiLight mt-4 border-2 bg-white'}
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
                childName={`${currentChildUser?.firstName}`}
                helpingSkillId={categoryFromReport?.supportingTask?.taskId || 0}
                toDoNote={categoryFromReport?.supportingTask?.todoText || ''}
              />
            );
          })}

        {currentReport?.reportingPeriod !== 'First' && (
          <Button
            onClick={downloadReport}
            className="w-full"
            size="small"
            color="primary"
            type="filled"
            isLoading={loading}
          >
            {!loading && renderIcon('ShareIcon', 'h-5 w-5 text-white')}
            <Typography
              type="h6"
              className="ml-2"
              text={`Share caregiver report`}
              color="white"
            />
          </Button>
        )}
      </div>
    </BannerWrapper>
  );
};
