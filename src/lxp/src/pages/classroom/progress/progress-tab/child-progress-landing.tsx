import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import {
  ActionModal,
  Button,
  Card,
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
import { ProgressTabNoReports } from './progress-tab-no-reports';
import { ProgressTabNoChildren } from './progress-tab-no-children';
import { ProgressTabAllChildrenOverFive } from './progress-tab-all-children-over-five';
import { ProgressTabReportSummary } from './progress-tab-report-summary';
import { useObserveProgressForChildren } from '@/hooks/useObserveProgressForChildren';
import { ProgressTabObservationsSummary } from './progress-tab-observations-summary';
import { format } from 'date-fns';
import { useCallback } from 'react';
import { ReactComponent as RobotIcon } from '@/assets/iconRobot.svg';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

export const ChildProgressLanding: React.FC = () => {
  const history = useHistory();
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const { hasPermissionToManageChildren } = useUserPermissions();
  const {
    isReportWindowSet,
    isWithinReportPeriod,
    childReports,
    currentReportingPeriod,
    percentageReportsCompleted,
    percentageObservationsCompleted,
  } = useObserveProgressForChildren();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const classroom = useSelector(classroomsSelectors.getClassroom);

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const canAddChildren =
    hasPermissionToManageChildren || !!practitioner?.isPrincipal;

  const handleContinueTrackingProgress = useCallback(() => {
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
  }, [dialog]);

  return (
    <>
      {/* No report periods defined and principal */}
      {!isReportWindowSet && !!practitioner?.isPrincipal && (
        <ProgressTabNoReportPeriodAndPrincipal />
      )}
      {/* No report periods defined and practitioner */}
      {!isReportWindowSet && !practitioner?.isPrincipal && (
        <ProgressTabNoReportPeriodAndPractitioner
          principalName={classroom?.principal.firstName || ''}
        />
      )}
      {/* Report period setup, children, but no reports yet */}
      {isReportWindowSet && childReports.every((x) => x.isNotStarted) && (
        <ProgressTabNoReports />
      )}
      {/* Report period setup, no children */}
      {isReportWindowSet && !childReports?.length && (
        <ProgressTabNoChildren
          canAddChildren={canAddChildren}
          isOnline={isOnline}
          showOnlineOnly={showOnlineOnly}
        />
      )}
      {/* Report period setup, all children over 5 years*/}
      {isReportWindowSet &&
        !!childReports?.length &&
        childReports.every((x) => !x.ageInMonths || x.ageInMonths > 60) && (
          <ProgressTabAllChildrenOverFive
            canAddChildren={canAddChildren}
            isOnline={isOnline}
            showOnlineOnly={showOnlineOnly}
          />
        )}
      {/* Observations sumamry */}
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
          )} and ${format(
            new Date(currentReportingPeriod?.endDate || ''),
            'd MMM yyyy'
          )}`}
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
        <Card className="bg-uiBg mb-4 mt-4 rounded-2xl p-4">
          <div className="justify-center">
            <ProgressBar
              label={`${
                isWithinReportPeriod
                  ? percentageReportsCompleted
                  : percentageObservationsCompleted
              }%`}
              hint={
                isWithinReportPeriod
                  ? 'Reports created'
                  : 'Observations completed'
              }
              subLabel=""
              isHiddenSubLabel={true}
              value={
                isWithinReportPeriod
                  ? percentageReportsCompleted
                  : percentageObservationsCompleted
              }
              primaryColour="alertMain"
              secondaryColour="textLight"
              textColour="textDark"
            />
          </div>
        </Card>
        {/* Within report period */}
        {isWithinReportPeriod && <ProgressTabReportSummary />}
        {/* Outside report period */}
        {!isWithinReportPeriod && <ProgressTabObservationsSummary />}
      </div>
    </>
  );
};
