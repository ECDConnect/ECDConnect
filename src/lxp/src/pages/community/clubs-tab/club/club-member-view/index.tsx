import { BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { practitionerSelectors } from '@/store/practitioner';

export const ClubMemberView: React.FC = () => {
  const history = useHistory();
  const { practitionerId } = useParams<ClubsRouteState>();
  const practitioner = useSelector(
    practitionerSelectors.getPractitionerByUserId(practitionerId ?? '')
  );
  const firstName = practitioner?.user?.firstName ?? '';

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title="Add SmartStarter to a club"
      subTitle="1 of 1"
      onBack={() => history.goBack()}
    >
      <Typography type="h2" text={`${firstName}'s contributions to the club`} />
    </BannerWrapper>
  );
};
