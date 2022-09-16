import { useHistory } from 'react-router-dom';
import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';
import ROUTES from '@routes/routes';

export const CompleteProfile: React.FC = () => {
  const history = useHistory();
  return (
    <div className="px-4">
      <NotificationHeaderCard
        header={'Complete your profile'}
        message={
          'Share more information about your programme to make Funda App useful for you.'
        }
        actionText={'Complete your profile'}
        onActioned={() => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)}
      />
    </div>
  );
};

export default CompleteProfile;
