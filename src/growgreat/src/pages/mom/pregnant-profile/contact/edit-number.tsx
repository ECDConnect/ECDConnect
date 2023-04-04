import { useWindowSize } from '@reach/window-size';
import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { getMotherById } from '@/store/mother/mother.selectors';

const HEADER_HEIGHT = 122;

export const MotherContactNumber: React.FC = () => {
  const location = useLocation();
  const { height } = useWindowSize();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [, , , motherId] = location.pathname.split('/');
  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Edit phone number"
      backgroundColour="white"
      displayOffline={!isOnline}
    >
      <div
        className="mt-16 flex flex-col p-4 "
        style={{ height: height - HEADER_HEIGHT }}
      >
        <Typography
          type="h5"
          weight="bold"
          lineHeight="snug"
          text="Comming Soon!"
        />
      </div>
    </BannerWrapper>
  );
};
