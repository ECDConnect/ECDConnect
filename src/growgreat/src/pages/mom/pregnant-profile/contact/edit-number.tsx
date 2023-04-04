import { BannerWrapper } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { useTheme } from '@/../../../packages/core/lib';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const MotherContactNumber: React.FC = () => {
  const { theme } = useTheme();
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  return (
    <div className={'h-full overflow-y-auto'}>
      <BannerWrapper
        showBackground={true}
        backgroundUrl={theme?.images.graphicOverlayUrl}
        backgroundImageColour={'primary'}
        title={'Edit phone number'}
        color={'primary'}
        size="large"
        renderBorder={true}
        renderOverflow={false}
        onBack={() => history.goBack()}
        displayOffline={!isOnline}
      ></BannerWrapper>
    </div>
  );
};
