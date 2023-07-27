import { useHistory } from 'react-router-dom';
import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { traineeSelectors } from '@/store/trainee';
import { timelineSteps } from '@/pages/trainee/trainee-onboarding/components/trainee-onboarding-dashboard/timeline-steps';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const CompleteProfile: React.FC = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const { isOnline } = useOnlineStatus();

  const completedSteps = timelineSteps(
    timeline!,
    () => {},
    false,
    isOnline,
    // @ts-ignore
    undefined
  ).filter((item) => item?.type === 'completed');

  const hasPractitionerRole = userData?.roles?.some(
    (role) => role.name === 'Practitioner'
  );

  const notRegistered = !Boolean(practitioner?.isRegistered);
  const addedByPrincipal =
    Boolean(practitioner?.principalHierarchy) && !practitioner?.isPrincipal;

  const showNotificationForPractitionerFlow =
    (hasPractitionerRole || addedByPrincipal) && notRegistered;
  if (practitioner?.isTrainee && completedSteps?.length < 7) {
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
          onActioned={
            showNotificationForPractitionerFlow
              ? () => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)
              : () => history.push(ROUTES.PRINCIPAL.SETUP_PROFILE)
          }
        />
      </div>
    );
  }
};

export default CompleteProfile;
