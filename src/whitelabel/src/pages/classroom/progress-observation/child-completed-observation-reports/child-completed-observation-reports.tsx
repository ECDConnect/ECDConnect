import { useDialog } from '@ecdlink/core';
import {
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  Divider,
  ListItem,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { DateFormats } from '../../../../constants/Dates';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { OfflineSyncModal } from '../../../../modals';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { useAppDispatch } from '@store';
import { childrenSelectors } from '@store/children';
import { contentReportSelectors } from '@store/content/report';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { analyticsActions } from '@store/analytics';
import { ChildCompletedObservsationReportsState } from './child-completed-observation-reports.types';

export const ChildCompletedObservationReports: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { state: routeState } =
    useLocation<ChildCompletedObservsationReportsState>();

  const [latestCompletedSummary, previouslyCompletedSummary] = useSelector(
    contentReportSelectors.getChildLatestCompletedReports(routeState?.childId)
  );
  const currentChild = useSelector(
    childrenSelectors.getChildById(routeState?.childId)
  );
  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const hasUnsyncedReports = useSelector(
    contentReportSelectors.hasUnsyncedReports
  );
  const childReportSummaries = useSelector(
    contentReportSelectors.getChildProgressReportSummaries(routeState?.childId)
  );
  const allCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories
  );

  const allLevels = useSelector(
    progressTrackingSelectors.getProgressTrackingLevels
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

  useEffect(() => {
    if (isOnline && hasUnsyncedReports) {
      dialog({
        position: DialogPosition.Bottom,
        render: (onSubmit, onCancel) => {
          return (
            <OfflineSyncModal
              avoidNavigation={true}
              generalMessageOveride={'You have unsynced progress reports!'}
              recommendationTextOveride={
                'If you choose not to sync you will only be able to download synced reports'
              }
              onSubmit={() => {
                onSubmit();
              }}
              onCancel={onCancel}
            ></OfflineSyncModal>
          );
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadReports = () => {
    if (isOnline) {
      history.push('/download-child-progress-observation-reports', {
        childId: routeState?.childId,
      });
    } else {
      showOnlineOnly();
    }
  };

  const viewReport = (reportId: string) => {
    if (isOnline) {
      history.push('/view-child-progress-observation-report', {
        childId: routeState?.childId,
        reportId,
      });
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${currentChildUser?.firstName}'s progress`}
      onBack={history.goBack}
    >
      <div className={'flex flex-col px-4 pb-4'}>
        <Typography
          className={'mt-4'}
          type="h1"
          color={'primary'}
          text={`How has ${currentChildUser?.firstName} grown?`}
        />
        <Alert
          className={'mt-4'}
          type={'info'}
          title={`Don't worry if ${currentChildUser?.firstName} hasn't changed a lot in 6 months - child development takes time!`}
        />

        <div
          className={'border-uiLight mt-4 flex flex-col items-stretch border-b'}
        >
          <div
            className={
              'border-uiLight flex flex-row items-center justify-between border-b pl-4'
            }
          >
            <Typography type={'body'} className={'w-1/2'} text={''} />
            <div className={'flex flex-shrink-0 flex-row'}>
              {latestCompletedSummary && (
                <Typography
                  type={'small'}
                  className={`mr-8 uppercase`}
                  align="center"
                  text={`${new Date(
                    latestCompletedSummary?.reportDate
                  ).toLocaleString(
                    'en-za',
                    DateFormats.shortMonthNameAndYear
                  )}`}
                  color={'textMid'}
                />
              )}
              {previouslyCompletedSummary && (
                <Typography
                  type={'small'}
                  className={'mr-5 uppercase'}
                  align="center"
                  text={`${new Date(
                    previouslyCompletedSummary.reportDate
                  ).toLocaleString(
                    'en-za',
                    DateFormats.shortMonthNameAndYear
                  )}`}
                  color={'textMid'}
                />
              )}
            </div>
          </div>
          {latestCompletedSummary &&
            latestCompletedSummary.categories.map((cat, idx) => {
              const categoryDetails = allCategories.find(
                (aCat) => aCat.id === cat.categoryId
              );
              const achievedLevel = allLevels.find(
                (level) => level.id === cat.achievedLevelId
              );
              const prevAchievedLevel = allLevels.find(
                (level) =>
                  level.id ===
                  previouslyCompletedSummary?.categories.find(
                    (pCat) => pCat.categoryId === cat.categoryId
                  )?.achievedLevelId
              );
              return (
                <div
                  key={cat.categoryId}
                  className={`flex min-w-0 flex-row items-center justify-between p-4 bg-${
                    idx % 2 === 0 ? 'white' : 'transparent'
                  }`}
                >
                  <Typography
                    type={'body'}
                    className={'w-1/2 overflow-ellipsis'}
                    text={categoryDetails?.name || ''}
                  />
                  <div className={'flex flex-shrink-0 flex-row'}>
                    {achievedLevel && (
                      <div
                        className={'flex flex-shrink-0 flex-row items-center'}
                      >
                        <img
                          className={'m-auto'}
                          src={achievedLevel.imageUrl}
                          alt="achieved level"
                        />

                        <Typography
                          type={'small'}
                          color={'textMid'}
                          text={achievedLevel.name}
                          className={'ml-2'}
                        />
                      </div>
                    )}
                    {prevAchievedLevel && (
                      <div
                        className={
                          'mx-1 flex flex-shrink-0 flex-row items-center'
                        }
                      >
                        <img
                          className={'m-auto'}
                          src={prevAchievedLevel.imageUrl}
                          alt="previous level"
                        />

                        <Typography
                          type={'small'}
                          color={'textMid'}
                          text={prevAchievedLevel.name}
                          className={'ml-2'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          <Divider className={'mb-4'} />

          {childReportSummaries && childReportSummaries.length > 1 && (
            <div className={'flex flex-col'}>
              <Typography text={'See a report:'} type={'body'} />
              {childReportSummaries.map((report, idx) => {
                return (
                  <ListItem
                    key={idx.toString()}
                    title={`${new Date(report.reportDate).toLocaleString(
                      'en-za',
                      DateFormats.shortMonthNameAndYear
                    )}`}
                    showButton
                    buttonColor={'primary'}
                    buttonType={'outlined'}
                    buttonIcon={'EyeIcon'}
                    buttonText={'View'}
                    buttonTextColor={'primary'}
                    withPaddingY
                    showDivider={idx > 0}
                    dividerType={'dashed'}
                    dividerColor={'uiLight'}
                    onButtonClick={() => {
                      viewReport(report.reportId);
                    }}
                  />
                );
              })}
            </div>
          )}

          <Button
            onClick={downloadReports}
            disabled={childReportSummaries.length === 0}
            className="w-full"
            size="small"
            color="primary"
            type="filled"
          >
            {renderIcon('DownloadIcon', 'h-5 w-5 text-white')}
            <Typography
              type="h6"
              className="ml-2"
              text="Download a report"
              color="white"
            />
          </Button>
        </div>
      </div>
    </BannerWrapper>
  );
};
