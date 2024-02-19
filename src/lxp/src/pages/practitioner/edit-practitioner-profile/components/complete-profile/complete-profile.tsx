import { useHistory } from 'react-router-dom';
import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { traineeSelectors } from '@/store/trainee';
import { timelineSteps } from '@/pages/trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export const CompleteProfile: React.FC = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const timeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline(practitioner?.userId || '')
  );
  const { isOnline } = useOnlineStatus();
  const isOnStipend = practitioner?.isOnStipend;
  const dialog = useDialog();

  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined,
    '',
    timeline?.consolidationMeetingStatus,
    isOnStipend
  ).filter((item) => item?.type === 'completed');

  const hasPractitionerRole = userData?.roles?.some(
    (role) => role.name === 'Practitioner'
  );

  const notRegistered = !Boolean(practitioner?.isRegistered);
  const addedByPrincipal =
    Boolean(practitioner?.principalHierarchy) && !practitioner?.isPrincipal;

  const handleOnlineCallback = (callback: () => void) => {
    if (isOnline) {
      callback();
    } else {
      dialog({
        color: 'bg-white',
        position: DialogPosition.Middle,
        render: (onSubmit) => {
          return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
        },
      });
    }
  };

  const showNotificationForPractitionerFlow =
    (hasPractitionerRole || addedByPrincipal) && notRegistered;
  if (
    practitioner?.isTrainee === true &&
    ((practitioner?.isOnStipend && completedSteps?.length < 8) ||
      (practitioner?.isOnStipend !== true && completedSteps?.length < 7))
  ) {
    return (
      <div className="px-4">
        <NotificationHeaderCard
          header={'Start your trainee journey!'}
          message={
            'Sign your franchisee & start-up support agreements, start registering children, and make sure your venue meets the SmartSpace standards.'
          }
          actionText={'Get started'}
          onActioned={
            practitioner?.setupTraineeInitiated
              ? () => history.push(ROUTES.TRAINEE.TRAINEE_ONBOARDING)
              : () => history.push(ROUTES.TRAINEE.SETUP_TRAINEE)
          }
        />
      </div>
    );
  } else {
    return (
      <div className="px-4">
        <NotificationHeaderCard
          header={'Tell us more about you!'}
          message={
            'Share more information about your programme to make Funda App useful for you.'
          }
          actionText={'Tell us more about you!'}
          onActioned={() =>
            handleOnlineCallback(() =>
              showNotificationForPractitionerFlow
                ? history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
                : history.push(ROUTES.PRINCIPAL.SETUP_PROFILE)
            )
          }
        />
      </div>
    );
  }
};

export default CompleteProfile;
