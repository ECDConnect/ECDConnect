import { useHistory } from 'react-router-dom';
import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@store/user';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { RoleSystemNameEnum, useDialog } from '@ecdlink/core';
import { DialogPosition } from '@ecdlink/ui';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

export const CompleteProfile: React.FC = () => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const dialog = useDialog();

  const hasPractitionerRole = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Practitioner
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
};

export default CompleteProfile;
