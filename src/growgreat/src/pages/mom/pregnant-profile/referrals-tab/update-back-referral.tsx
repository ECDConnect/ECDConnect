import { useWindowSize } from '@reach/window-size';
import { VisitBackReferralFilterInput } from '@ecdlink/graphql/lib';
import { useHistory } from 'react-router';
import { BannerWrapper } from '@ecdlink/ui';

const HEADER_HEIGHT = 64;

export const MotherBackReferralUpdate: React.FC<
  VisitBackReferralFilterInput
> = () => {
  const { height } = useWindowSize();
  const history = useHistory();

  // const backReferralsForInfant = useSelector(infantSelectors.getBackReferralsForInfantSelector);
  // const referralCompleted = false;
  // const backReferralCompleted = false;

  // Getting back referrals created
  // useLayoutEffect(() => {
  //   appDispatch(
  //     infantThunkActions.getBackReferralsForInfant({ infantId, referralCompleted, backReferralCompleted })
  //   ).unwrap();
  // }, [appDispatch, infantId, referralCompleted, backReferralCompleted]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Update back-referral"
      subTitle="Back referral name/comment"
      backgroundColour="white"
    ></BannerWrapper>
  );
};
