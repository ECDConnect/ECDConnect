import { useHistory } from 'react-router-dom';
import { NotificationHeaderCard } from '@/pages/dashboard/components/notification-header-card/notification-header-card';
import ROUTES from '@routes/routes';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';

export const CompleteProfile: React.FC = () => {
  const userData = useSelector(userSelectors.getUser);
  const history = useHistory();

  return (
    <div className="px-4">
      <NotificationHeaderCard
        header={'Tell us more about you!'}
        message={
          'Share more information about your programme to make Funda App useful for you.'
        }
        actionText={'Tell us more about you!'}
        onActioned={() => history.push(ROUTES.PRACTITIONER.PROFILE.EDIT)}
      />
    </div>
  );
};

export default CompleteProfile;
