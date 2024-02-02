import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
  useDialog,
} from '@ecdlink/core';
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
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { useAppDispatch } from '@store';
import { childrenSelectors } from '@store/children';
import { contentReportSelectors } from '@store/content/report';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { analyticsActions } from '@store/analytics';
import { ChildCompletedObservsationReportsState } from './child-completed-observation-reports.types';
import NoProgressEmoticon from '../../../../assets/no-progress-emoticon.png';
import ROUTES from '@/routes/routes';
import { getReportingPeriod } from '@/utils/child/child-profile-utils';
import { practitionerSelectors } from '@/store/practitioner';
import { childrenForPractitionerSelectors } from '@/store/childrenForPractitioner';
import { classroomsSelectors } from '@/store/classroom';

export const ChildCompletedObservationReports: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { state: routeState } =
    useLocation<ChildCompletedObservsationReportsState>();

  const childId = routeState?.childId;
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const childrenForPrincipal = useSelector(
    childrenForPractitionerSelectors?.getChildrenForPractitioner
  );
  const isPrincipalChild = childrenForPrincipal?.find(
    (item) => item?.userId === currentChild?.userId
  );

  const allowTracking = (!!isPrincipal && !!isPrincipalChild) || !isPrincipal;

  const currentChildUser = useSelector(
    childrenSelectors.getChildUserById(currentChild?.userId)
  );
  const [latestCompletedSummary] = useSelector(
    contentReportSelectors.getChildLatestCompletedReports(routeState?.childId)
  );
  const childReportSummaries = useSelector(
    contentReportSelectors.getChildProgressReportSummaries(routeState?.childId)
  );
  const childProgressReports = useSelector(
    contentReportSelectors.getChildProgressObservationReports(
      routeState?.childId
    )
  );
  const classroomGroupId = useSelector(
    classroomsSelectors.getLearnerClassGroupId(currentChild?.userId)
  );
  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );
  const childPractioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(classroomGroup?.userId || '')
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

  const completedFirstProgressReport =
    !!childReportSummaries &&
    childReportSummaries.findIndex((s) => s.reportPeriod === 'First') !== -1;
  const completedStandardReport =
    childReportSummaries &&
    childReportSummaries.length > (completedFirstProgressReport ? 1 : 0);

  const startTrackingProgress = (firstObservation: boolean) => {
    var reportingDate: Date = new Date();
    if (firstObservation) {
      reportingDate = new Date(2000, 0, 1);
    } else {
      const period = getReportingPeriod(reportingDate, false);
      reportingDate = new Date(`${period.monthName}-01-${period.year}`);
    }
    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION, {
      childId: routeState?.childId,
      firstObservation,
      reportingDate,
    });
  };

  const trackProgress = () => {
    const reports = inProgressAndCompleteReports();
    if (reports.length > 0) {
      const lastReport = reports[reports.length - 1];
      if (!lastReport.summaryReport) {
        editProgress(
          lastReport.reportingPeriod === 'First',
          new Date(lastReport.reportDate)
        );
        return;
      }
    }
    startTrackingProgress(false);
  };

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

  const editProgress = (firstObservation: boolean, reportingDate: Date) => {
    history.push(ROUTES.CHILD_PROGRESS_OBSERVATION, {
      childId: routeState?.childId,
      firstObservation: firstObservation,
      reportingDate: reportingDate,
    });
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const inProgressAndCompleteReports = () => {
    const reports: {
      reportId: string;
      reportDate: string;
      reportingPeriod: string;
      displayDate: string;
      progressReport: ChildProgressObservationReport | undefined;
      summaryReport: ChildProgressReportSummaryModel | undefined;
    }[] = [
      ...childProgressReports.map((r) => ({
        reportId: r.id,
        reportDate: r.reportingDate,
        reportingPeriod: r.reportingPeriod,
        displayDate:
          r.reportingPeriod === 'First' ? r.dateCreated : r.reportingDate,
        progressReport: r,
        summaryReport: undefined,
      })),
    ];
    childReportSummaries.forEach((r) => {
      var report = reports.find((x) => x.reportId === r.reportId);
      if (!report) {
        report = {
          reportId: r.reportId,
          reportDate: r.reportDate,
          reportingPeriod: r.reportPeriod,
          displayDate:
            r.reportPeriod === 'First' ? r.reportDateCreated : r.reportDate,
          progressReport: undefined,
          summaryReport: undefined,
        };
        reports.push(report);
      }
      report.summaryReport = r;
    });
    reports.sort(
      (a, b) =>
        new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime()
    );
    return reports;
  };

  return (
    <BannerWrapper
      size={'small'}
      title={`${currentChildUser?.firstName}'s progress`}
      onBack={() =>
        history.replace(ROUTES.CHILD_PROFILE, { childId: routeState.childId })
      }
    >
      <div className={'flex flex-col px-4 pb-4'}>
        <Typography
          className={'mt-4'}
          type="h2"
          color={'textDark'}
          text={`How has ${currentChildUser?.firstName} grown?`}
        />
        {childReportSummaries.length > 1 && (
          <Alert
            className={'mt-4'}
            type={'info'}
            title={`Don't worry if ${currentChildUser?.firstName} hasn't changed a lot in 6 months - child development takes time!`}
          />
        )}
        {(!childProgressReports || childProgressReports.length === 0) &&
          childReportSummaries.length === 0 && (
            <div className={'border-uiLight mt-4 flex flex-col items-stretch'}>
              <div className="grid grid-cols-1 justify-center gap-4">
                <div className="flex justify-center">
                  <img
                    width={'30%'}
                    src={NoProgressEmoticon}
                    alt="No progress reports"
                  />
                </div>
                <div className="flex justify-center">
                  <div className="flex w-8/12 justify-center">
                    <Typography
                      type="h3"
                      color="textDark"
                      text={`${currentChildUser?.firstName} doesn't have any progress reports yet!`}
                      className={'text-center'}
                    />
                  </div>
                </div>
                {!!isPrincipal && !isPrincipalChild && (
                  <div className="flex justify-center">
                    <div className="flex w-8/12 justify-center">
                      <Typography
                        type="body"
                        color="textMid"
                        text={`Encourage ${
                          childPractioner?.user?.firstName || 'the practioner'
                        } to start observing ${
                          currentChildUser?.firstName
                        } & track progress on Funda App.`}
                        className={'text-center'}
                      />
                    </div>
                  </div>
                )}
                {allowTracking && (
                  <div className="flex justify-center">
                    <Typography
                      type="body"
                      color="textMid"
                      text={'Tap the button below to start'}
                      className={'mb-4'}
                    />
                  </div>
                )}
              </div>
              {allowTracking && (
                <Button
                  onClick={() => startTrackingProgress(true)}
                  disabled={false}
                  className="w-full"
                  size="small"
                  color="primary"
                  type="filled"
                >
                  {renderIcon('PencilIcon', 'h-5 w-5 text-white')}
                  <Typography
                    type="h6"
                    className="ml-2"
                    text="Start tracking progress"
                    color="white"
                  />
                </Button>
              )}
            </div>
          )}
        {((childReportSummaries && childReportSummaries.length > 0) ||
          (childProgressReports && childProgressReports.length > 0)) && (
          <div>
            <div className={'mt-4 flex flex-col'}>
              {latestCompletedSummary && (
                <div className="overflow-x-auto">
                  <table className="body min-w-full text-left">
                    <thead>
                      <tr className="bg-uiBg border-secondary border-b-4">
                        <th className="min-w-160 p-4 font-medium" key="0">
                          <Typography type={'body'} text={' '} />
                        </th>
                        {childReportSummaries.map((report, idx) => {
                          const firstObservation =
                            report.reportPeriod === 'First';
                          const formattedDate = `${new Date(
                            firstObservation
                              ? report.reportDateCreated
                              : report.reportDate
                          ).toLocaleString(
                            'en-za',
                            DateFormats.longMonthNameAndYear
                          )}`;
                          return (
                            <th
                              className="min-w-160 p-4 font-medium"
                              key={`${idx + 1}`}
                            >
                              <Typography
                                hasMarkup={true}
                                type={'body'}
                                text={
                                  firstObservation
                                    ? `FIRST OBSERVATIONS</br>${formattedDate}`
                                    : formattedDate
                                }
                              />
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {latestCompletedSummary.categories.map((cat, idx) => {
                        const categoryDetails = allCategories.find(
                          (aCat) => aCat.id === cat.categoryId
                        );
                        return (
                          <tr
                            className={`bg-${
                              idx % 2 === 0 ? 'white' : 'uiBg'
                            } text-left`}
                            key={`${cat.categoryId}`}
                          >
                            <td>
                              <Typography
                                type={'body'}
                                className="p-2"
                                text={categoryDetails?.name || ''}
                                key={'0'}
                              />
                            </td>
                            {childReportSummaries.map((report, idx) => {
                              const summaryReportCategory =
                                report.categories.find(
                                  (x) => x.categoryId === cat.categoryId
                                );
                              const achievedLevel = allLevels.find(
                                (level) =>
                                  level.id ===
                                  summaryReportCategory?.achievedLevelId
                              );
                              return (
                                <td className="p-2" key={`${idx + 1}`}>
                                  <div className={'flex flex-row items-center'}>
                                    {!!achievedLevel &&
                                      !!achievedLevel.imageUrl && (
                                        <img
                                          src={achievedLevel?.imageUrl}
                                          alt="achieved level"
                                        />
                                      )}
                                    <Typography
                                      type={'body'}
                                      color={'textDark'}
                                      text={achievedLevel?.name}
                                      className={'ml-2 font-medium uppercase'}
                                    />
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <Typography
                text={'Reports & observations'}
                type={'h4'}
                className="mt-8 mb-2"
              />
              <div className="flex flex-col">
                {inProgressAndCompleteReports().map((report, idx) => {
                  if (!!isPrincipal && !isPrincipalChild) return null;
                  const firstObservation = report.reportingPeriod === 'First';
                  const formattedDate = `${new Date(
                    report.displayDate
                  ).toLocaleString(
                    'en-za',
                    DateFormats.shortMonthNameAndYear
                  )}`;
                  const summaryReport = report.summaryReport;
                  const isComplete = !!summaryReport;
                  return (
                    <div className={'mb-4'} key={idx.toString()}>
                      <Divider dividerType="dashed" />
                      <ListItem
                        className="mt-4"
                        key={idx.toString()}
                        title={
                          firstObservation
                            ? 'First progress observations'
                            : formattedDate
                        }
                        titleTypographyType="h4"
                        titleColor="textDark"
                        subTitle={firstObservation ? formattedDate : undefined}
                        subTitleTypographyType="help"
                        subTitleColor="textMid"
                        showButton
                        buttonColor={
                          isComplete ? 'secondaryAccent2' : 'primary'
                        }
                        buttonType={'filled'}
                        buttonIcon={isComplete ? 'EyeIcon' : 'PencilIcon'}
                        buttonText={isComplete ? 'View' : 'Edit'}
                        buttonTextColor={isComplete ? 'secondary' : 'white'}
                        onButtonClick={() => {
                          if (isComplete) {
                            viewReport(report.reportId);
                          } else {
                            editProgress(
                              firstObservation,
                              new Date(report.reportDate)
                            );
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {completedStandardReport && (
                <Button
                  onClick={downloadReports}
                  disabled={childReportSummaries.length === 0}
                  className="w-full"
                  size="small"
                  color="primary"
                  type="filled"
                >
                  {renderIcon('ShareIcon', 'h-5 w-5 text-white')}
                  <Typography
                    type="h6"
                    className="ml-2"
                    text="Share a report"
                    color="white"
                  />
                </Button>
              )}
            </div>
            {allowTracking && (
              <Button
                onClick={() => trackProgress()}
                disabled={false}
                className="mt-4 w-full"
                size="small"
                color="primary"
                type={completedStandardReport ? 'outlined' : 'filled'}
              >
                {renderIcon(
                  'ArrowCircleRightIcon',
                  `h-5 w-5 text-${
                    completedStandardReport ? 'primary' : 'white'
                  }`
                )}
                <Typography
                  type="h6"
                  className="ml-2"
                  text="Track progress"
                  color={completedStandardReport ? 'primary' : 'white'}
                />
              </Button>
            )}
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
