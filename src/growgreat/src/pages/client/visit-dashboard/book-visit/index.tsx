import { useHistory } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper } from '@ecdlink/ui';
import ROUTES from '@/routes/routes';

import { CLIENT_TABS } from '../../class-dashboard/class-dashboard';

export const BookVisitFromVisitDashboard: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, { activeTabIndex: CLIENT_TABS.VISIT });
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Book a visit'}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
      className="p-4"
    >
      Coming soon
    </BannerWrapper>
  );
};
export default BookVisitFromVisitDashboard;
