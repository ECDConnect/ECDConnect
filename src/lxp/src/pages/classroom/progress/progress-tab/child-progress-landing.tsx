import { classroomsSelectors } from '@/store/classroom';
import { practitionerSelectors } from '@/store/practitioner';
import { Button, DialogPosition, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as Emoji4Icon } from '@/assets/ECD_Connect_emoji4.svg';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useProgressTracking } from '@/hooks/useProgressTracking';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import { ProgressTabNoReportPeriodAndPrincipal } from './progress-tab-no-report-period-and-principal';
import { ProgressTabNoReportPeriodAndPractitioner } from './progress-tab-no-report-period-and-practitioner';
import { ProgressTabNoReports } from './progress-tab-no-reports';
import { ProgressTabNoChildren } from './progress-tab-no-children';
import { ProgressTabAllChildrenOverFive } from './progress-tab-all-children-over-five';

export const ChildProgressLanding: React.FC = () => {
  const dialog = useDialog();
  const { isOnline } = useOnlineStatus();

  const { hasPermissionToManageChildren } = useUserPermissions();
  const {
    isReportWindowSet,
    currentReports,
    currentReportingPeriod,
    children,
  } = useProgressTracking();

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
      {isReportWindowSet && !currentReports.length && !!children?.length && (
        <ProgressTabNoReports />
      )}
      {/* Report period setup, no children */}
      {isReportWindowSet && !children?.length && (
        <ProgressTabNoChildren
          canAddChildren={canAddChildren}
          isOnline={isOnline}
          showOnlineOnly={showOnlineOnly}
        />
      )}
      {/* Report period setup, all children over 5 years*/}
      {isReportWindowSet &&
        !!children?.length &&
        children.every((x) => !x.ageInMonths || x.ageInMonths > 60) && (
          <ProgressTabAllChildrenOverFive
            canAddChildren={canAddChildren}
            isOnline={isOnline}
            showOnlineOnly={showOnlineOnly}
          />
        )}
    </>
  );
};
