import { pointsConstants } from '@/constants/points';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import { BannerWrapper, Button, Card, Colours, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PointsSummaryCard } from '../dashboard/components/points-summary-card/points-summary-card';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { RootState } from '@/store/types';
import { PointsLibraryStatusCard } from '../dashboard/components/points-library-status-card/points-library-status-card';

// TODO - fetch club standings
// TODO - add text that depends on relative club points
// TODO - Actions for share and detailed view

type CardData = {
  image: JSX.Element;
  primaryMessage: string;
  secondaryMessage: string;
  textColour: Colours;
  backgroundColour: Colours;
};

export const PointsSummary: React.FC = () => {
  const history = useHistory();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;

  const pointsSummaryDataWithLibrary = useSelector((state: RootState) =>
    pointsSelectors.getPointsSummaryWithLibrary(state, new Date())
  );
  const pointsTotal = pointsSummaryDataWithLibrary.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );
  const pointsMax =
    isPrincipal || isFundaAppAdmin
      ? pointsConstants.principalOrAdminMonthlyMax
      : pointsConstants.practitionerMonthlyMax;

  const percentageScore = (pointsTotal / pointsMax) * 100;

  const [celebrationCardDetails, setCelebrationCardDetails] = useState<
    CardData | undefined
  >(undefined);

  //TODO - Update this to use club data to set messages when available
  useEffect(() => {
    if (percentageScore < 60) {
      setCelebrationCardDetails({
        image: <EmojiOrangeSmile className="mr-2 h-16 w-16" />,
        primaryMessage: `Keep going ${practitioner?.user?.firstName}!`,
        secondaryMessage:
          'Check out the tips below to earn more points this month.',
        textColour: 'alertMain',
        backgroundColour: 'alertBg',
      });
    } else if (percentageScore < 80) {
      setCelebrationCardDetails({
        image: <EmojiBlueSmile className="mr-2 h-16 w-16" />,
        primaryMessage: `Wow, great job ${practitioner?.user?.firstName}!`,
        secondaryMessage:
          "You're doing well, keep it up! You can still earn more points this month.",
        textColour: 'secondary',
        backgroundColour: 'infoBb',
      });
    } else {
      setCelebrationCardDetails({
        image: <EmojiGreenSmile className="mr-2 h-16 w-16" />,
        primaryMessage: `Well done ${practitioner?.user?.firstName}!`,
        secondaryMessage: "You're doing well, keep it up!",
        textColour: 'successMain',
        backgroundColour: 'successBg',
      });
    }
  }, [percentageScore]);

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Points"
      backgroundColour="white"
    >
      <div className="flex-col justify-center p-4">
        <Typography
          type={'h1'}
          color="black"
          text={format(new Date(), 'MMM yyyy')}
        />
        <PointsSummaryCard
          currentPoints={pointsTotal}
          maxPoints={pointsMax}
          showIcon={false}
          useColourBackground={false}
        />
        {!!celebrationCardDetails && (
          <Card
            className={`rounded-10 mt-2 px-4 py-4 sm:px-6 bg-${celebrationCardDetails.backgroundColour}`}
          >
            <div className="flex gap-3">
              {celebrationCardDetails.image}
              <div className="flex-column gap-3">
                <Typography
                  type="h4"
                  color={celebrationCardDetails.textColour}
                  text={celebrationCardDetails.primaryMessage}
                  className="pt-2"
                />
                <Typography
                  type="h4"
                  color={'black'}
                  text={celebrationCardDetails.secondaryMessage}
                  className="pt-2"
                />
              </div>
            </div>
          </Card>
        )}
        {!!pointsSummaryDataWithLibrary &&
          pointsSummaryDataWithLibrary
            .filter((x) => x.pointsTotal !== x.maxMonthlyPoints)
            .map((pointsLibraryScore) => {
              return (
                <PointsLibraryStatusCard
                  currentPoints={pointsLibraryScore.pointsTotal}
                  maxPoints={pointsLibraryScore.maxMonthlyPoints}
                  description={pointsLibraryScore.description}
                />
              );
            })}
      </div>
      <div className="flex-column justify-end p-4">
        <Button
          size="normal"
          className="mb-4 w-full"
          type="filled"
          color="primary"
          text="Share"
          textColor="white"
          icon="ShareIcon"
          onClick={() => {}} // TODO
        />
        <Button
          size="normal"
          className="mb-4 w-full"
          type="outlined"
          color="primary"
          text="See detailed report"
          textColor="primary"
          icon="EyeIcon"
          onClick={() => {}} // TODO
        />
      </div>
    </BannerWrapper>
  );
};
