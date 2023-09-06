import { BannerWrapper } from '@ecdlink/ui';
import { useHistory } from 'react-router';
import { IconInformationIndicator } from '../classroom/programme-planning/components/icon-information-indicator/icon-information-indicator';

export const PointsSummary: React.FC = () => {
  const history = useHistory();
  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Points"
      backgroundColour="white"
    >
      <IconInformationIndicator
        title="Coming soon!"
        subTitle="I'm busy building this!"
        icon="InformationCircleIcon"
      />
    </BannerWrapper>
  );
};
