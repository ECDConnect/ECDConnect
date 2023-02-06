import { useHistory } from 'react-router';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper } from '@ecdlink/ui';
import ROUTES from '@/routes/routes';

import { CLIENT_TABS } from '../../client-dashboard/class-dashboard';

export const UpcomingVisit: React.FC = () => {
  const { isOnline } = useOnlineStatus();

  const history = useHistory();

  const goBack = () => {
    history.push(ROUTES.CLIENTS.ROOT, {
      activeTabIndex: CLIENT_TABS.HIGHLIGHTS,
    });
  };

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Coming soon'}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
      className="p-4"
    >
      Coming soon
    </BannerWrapper>
  );
};
export default UpcomingVisit;
