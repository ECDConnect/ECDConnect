import { BannerWrapper } from '@ecdlink/ui';
import * as styles from './calendar-add-event.styles';
import { format } from 'date-fns';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useHistory, useLocation } from 'react-router-dom';
import { CalendarAddEventPageState } from './calendar-add-event.types';

export const CalendarAddEvent: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { state: routeState } = useLocation<CalendarAddEventPageState>();

  const currentDate = new Date();

  return (
    <div className={styles.contentWrapper}>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={'Calendar'}
        subTitle={format(currentDate, 'EEEE, d LLLL yyyy')}
        color={'primary'}
        onBack={() => {
          history.goBack();
        }}
        displayOffline={!isOnline}
      ></BannerWrapper>
    </div>
  );
};
