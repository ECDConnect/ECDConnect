import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import {
  ActionModal,
  Alert,
  Button,
  Card,
  Colours,
  DialogPosition,
  ProgressBar,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import { ProgressTabNoReportPeriodAndPrincipal } from './progress-tab-no-report-period-and-principal';
import { ProgressTabNoReportPeriodAndPractitioner } from './progress-tab-no-report-period-and-practitioner';
import { useProgressGenerateSummaryPdfReport as usePdfFromHtml } from '@/hooks/useProgressGenerateSummaryPdfReport';
import { ProgressTabNoReports } from './progress-tab-no-reports';
import { ProgressTabNoChildren } from './progress-tab-no-children';
import { ProgressTabAllChildrenOverFive } from './progress-tab-all-children-over-five';
import { ProgressTabReportSummary } from './progress-tab-report-summary';
import { ProgressTabObservationsSummary } from './progress-tab-observations-summary';
import { format } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { useProgressForChildren } from '@/hooks/useProgressForChildren';
import { ProgressCaregiverReportPdf } from '../caregiver-report-pdf/caregiver-report-pdf';
import { ReactComponent as Balloons } from '@/assets/balloons.svg';

export type ChildProgressLandingRouteState = {
  childId: string;
};

interface ChildProgressLandingProps {
  messageReference?: string;
}

export const ChildProgressLanding: React.FC<ChildProgressLandingProps> = ({
  messageReference,
}) => {
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const {
    hasPermissionToManageChildren,
    hasPermissionToCreateProgressReports,
  } = useUserPermissions();
  const {
    children,
    isReportWindowSet,
    isWithinReportPeriod,
    childReports,
    currentReportingPeriod,
    percentageReportsCompleted,
    percentageObservationsCompleted,
    isAllObservationsComplete,
    isAllReportsComplete,
  } = useProgressForChildren();

  const [generatedReports, setGeneratedReports] = useState<{
    [reportId: string]: boolean;
  }>({});
  const [generatingReports, setGeneratingReports] = useState(false);

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  const { asyncGenerateReport } = usePdfFromHtml();

  const canAddChildren: any =
    (hasPermissionToManageChildren && !practitioner?.isPrincipal) ||
    practitioner?.isPrincipal;

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const shareRef = useRef<HTMLDivElement>(null);

  const handleContinueTrackingProgress = useCallback(() => {
    if (!currentReportingPeriod) {
      dialog({
        position: DialogPosition.Middle,
        render: (submit, cancel) => (
          <ActionModal
            customIcon={<RobotIcon className="mb-6" />}
            importantText="There are no reports coming up!"
            detailText="Looks like all your progress reports are done for the year"
            actionButtons={[
              {
                text: 'Close',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  cancel();
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        ),
      });
    } else {
      dialog({
        position: DialogPosition.Middle,
        render: (submit, cancel) => (
          <ActionModal
            customIcon={<RobotIcon className="mb-6" />}
            importantText="How would you like to track progress today?"
            detailText="Would you prefer to track progress for a specific child, or by developmental category?"
            actionButtons={[
              {
                text: 'Individual child',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  history.push(ROUTES.PROGRESS_SELECT_CHILD_TO_TRACK);
                  submit();
                },
                leadingIcon: 'UserIcon',
              },
              {
                text: 'Category',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  submit();
                  history.push(ROUTES.PROGRESS_SELECT_CATEGORY_TO_TRACK);
                },
                leadingIcon: 'ClipboardListIcon',
              },
            ]}
          />
        ),
      });
    }
  }, [dialog, currentReportingPeriod]);

  const generateAllReports = async () => {
    setGeneratingReports(true);
    // Add all reports to reports generation state
    const reports: { [reportId: string]: boolean } = {};
    childReports.forEach((report) => {
      const reportId = report.report.id;
      if (reportId) reports[reportId] = false;
    });
    setGeneratedReports(reports);

    // Generate all reports
    const reportElements = Array.from(
      shareRef.current?.children || []
    ).entries();
    for await (const [index, element] of reportElements) {
      await asyncGenerateReport(
        element as HTMLElement,
        (element as HTMLElement)?.offsetWidth || 750,
        ` - ${childReports[index].childFullName}`
      );
      const reportId = childReports[index].report.id as string;
      setGeneratedReports({
        ...generatedReports,
        [reportId]: true,
      });
    }
  };

  const generateButtonLabel = () => {
    const totalReports = childReports.length;
    const completedReports = Object.values(generatedReports).filter(
      (x) => x
    ).length;
    return generatingReports
      ? `${completedReports} of ${totalReports} reports generated`
      : 'Download all progress reports';
  };

  useEffect(() => {
    const allReportsGenerated = Object.values(generatedReports).every((x) => x);
    if (allReportsGenerated) {
      setGeneratingReports(false);
    }
  }, [generatedReports]);

  const isComingSoon = false;

  if (isComingSoon) {
    return (
      <div className="mt-2 flex flex-col p-4">
        <Typography color="textDark" text={`Coming soon`} type={'h2'} />
      </div>
    );
  }

  const childrenUnder5Years = children.filter(
    (x) => !x.ageInMonths || x.ageInMonths <= 60
  );
  const childrenOver5Years = children.filter(
    (x) => !x.ageInMonths || x.ageInMonths > 60
  );

  const progressBarColour: Colours = hasPermissionToCreateProgressReports
    ? (isWithinReportPeriod && percentageReportsCompleted === 100) ||
      (!isWithinReportPeriod && percentageObservationsCompleted === 100)
      ? 'successMain'
      : 'alertMain'
    : percentageObservationsCompleted === 100
    ? 'successMain'
    : 'alertMain';

  const showBalloon: boolean = hasPermissionToCreateProgressReports
    ? (isWithinReportPeriod && percentageReportsCompleted === 100) ||
      (!isWithinReportPeriod && percentageObservationsCompleted === 100)
    : percentageObservationsCompleted === 100;

  return (
    <>
      {/* No report periods defined and principal */}
      {!isReportWindowSet && !!practitioner?.isPrincipal && (
        <ProgressTabNoReportPeriodAndPrincipal
          messageReference={messageReference}
        />
      )}
      {/* No report periods defined and practitioner */}
      {!isReportWindowSet && !practitioner?.isPrincipal && (
        <ProgressTabNoReportPeriodAndPractitioner
          principalName={classroom?.principal.firstName || ''}
        />
      )}
      {/* Report period setup, no children */}
      {isReportWindowSet && !children?.length && (
        <ProgressTabNoChildren
          canAddChildren={canAddChildren}
          isOnline={isOnline}
          showOnlineOnly={showOnlineOnly}
        />
      )}
      {/* Report period setup, children, but no reports yet */}
      {isReportWindowSet &&
        !!children.length &&
        !!childrenUnder5Years.length &&
        childReports.every((x) => x.isNotStarted) && (
          <ProgressTabNoReports
            trackProgress={handleContinueTrackingProgress}
          />
        )}
      {/* Report period setup, all children over 5 years*/}
      {isReportWindowSet &&
        !!children?.length &&
        childrenOver5Years?.length === children?.length && (
          <ProgressTabAllChildrenOverFive
            canAddChildren={canAddChildren}
            isOnline={isOnline}
            showOnlineOnly={showOnlineOnly}
          />
        )}
      {/* Observations summary */}
      {isReportWindowSet &&
        !!children.length &&
        !!childrenUnder5Years.length &&
        childReports.some((x) => !x.isNotStarted) && (
          <div className="mt-2 flex flex-col p-4">
            <Typography
              color="textDark"
              text={`Report ${currentReportingPeriod?.reportNumber}`}
              type={'h2'}
            />
            <Typography
              type="h4"
              color="textDark"
              text={`${format(
                new Date(currentReportingPeriod?.startDate || ''),
                'd MMM'
              )} - ${format(
                new Date(currentReportingPeriod?.endDate || ''),
                'd MMM yyyy'
              )}`}
            />
            {(!hasPermissionToCreateProgressReports && isWithinReportPeriod
              ? !isAllObservationsComplete
              : !isAllReportsComplete) && (
              <Button
                onClick={handleContinueTrackingProgress}
                className="mt-4 w-full"
                size="small"
                color="quatenary"
                textColor="white"
                type="filled"
                icon={'PresentationChartBarIcon'}
                text={'Continue tracking progress'}
              />
            )}
            {/* Show progress bar  */}
            <Card className="bg-uiBg mb-4 mt-4 flex rounded-2xl p-4">
              <div className="flex w-full justify-center">
                {showBalloon && (
                  <div className="mt-6 mr-6 flex justify-center">
                    <Balloons className="h-20 w-20" />
                  </div>
                )}
                <ProgressBar
                  label={`${
                    hasPermissionToCreateProgressReports && isWithinReportPeriod
                      ? percentageReportsCompleted
                      : percentageObservationsCompleted
                  }%`}
                  hint={
                    hasPermissionToCreateProgressReports && isWithinReportPeriod
                      ? 'Reports completed'
                      : 'Observations completed'
                  }
                  subLabel=""
                  isHiddenSubLabel={true}
                  value={
                    hasPermissionToCreateProgressReports && isWithinReportPeriod
                      ? percentageReportsCompleted
                      : percentageObservationsCompleted
                  }
                  primaryColour={progressBarColour}
                  secondaryColour="textLight"
                  textColour="textDark"
                  className="w-full"
                />
              </div>
            </Card>

            {/* Outside report period */}
            {!isWithinReportPeriod &&
              !isAllObservationsComplete &&
              !practitioner?.isPrincipal && <ProgressTabObservationsSummary />}

            {/* Within report period */}
            {isWithinReportPeriod && (
              <>
                {/* Permission view */}
                {!isAllReportsComplete &&
                  hasPermissionToCreateProgressReports && (
                    <ProgressTabReportSummary />
                  )}
                {/* No permission view */}
                {!isAllObservationsComplete &&
                  !hasPermissionToCreateProgressReports && (
                    <ProgressTabObservationsSummary />
                  )}

                {isAllObservationsComplete &&
                  !isAllReportsComplete &&
                  !hasPermissionToCreateProgressReports &&
                  !practitioner?.isPrincipal && (
                    <>
                      <Alert
                        type="success"
                        title="Well done!"
                        message="You can keep observing children and change your responses."
                        className="mt-4"
                      />
                      <Button
                        onClick={handleContinueTrackingProgress}
                        className="mt-4 w-full"
                        size="small"
                        color="quatenary"
                        textColor="white"
                        type="filled"
                        icon={'PresentationChartBarIcon'}
                        text={'Continue tracking progress'}
                      />
                    </>
                  )}
                {isAllReportsComplete && (
                  <>
                    <Button
                      onClick={() => generateAllReports()}
                      className="mt-auto w-full"
                      size="small"
                      color="quatenary"
                      textColor="white"
                      type="filled"
                      icon={generatingReports ? undefined : 'DownloadIcon'}
                      text={generateButtonLabel()}
                      disabled={generatingReports || !isOnline}
                    />
                    <Button
                      onClick={() =>
                        history.replace(
                          ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP
                        )
                      }
                      className="mt-4 w-full"
                      size="small"
                      color="quatenary"
                      textColor="quatenary"
                      type="outlined"
                      icon={'EyeIcon'}
                      text={'See Summary'}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}
      <div hidden={true}>
        <div ref={shareRef}>
          {childReports &&
            childReports.map((report) =>
              report.report.id ? (
                <div key={report.childId} style={{ letterSpacing: '0.01px' }}>
                  <ProgressCaregiverReportPdf
                    childId={report.childId}
                    reportId={report.report.id as string}
                  />
                </div>
              ) : null
            )}
        </div>
      </div>
    </>
  );
};
