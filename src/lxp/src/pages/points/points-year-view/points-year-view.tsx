import { pointsConstants } from '@/constants/points';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import { BannerWrapper, Button, Card, Colours, Typography } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { PointsSummaryCard } from '../../dashboard/components/points-summary-card/points-summary-card';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { RootState } from '@/store/types';
import { PointsMonthSummary } from './components/points-month-summary';

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

export const PointsYearView: React.FC = () => {
  const history = useHistory();
  const currentMonth = new Date().getMonth();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;

  const [monthsLoaded, setMonthsLoaded] = useState<number[]>([currentMonth]);
  const [loadNextMonthDisabled, setLoadNextMonthDisabled] = useState<boolean>(
    currentMonth === 0
  );

  const currentMonthPoints = useSelector((state: RootState) =>
    pointsSelectors.getPointsSummaryWithLibrary(state, new Date())
  );

  const pointsTotalForYear = currentMonthPoints.reduce(
    (total, current) => (total += current.pointsYTD),
    0
  );

  const pointsMax =
    isPrincipal || isFundaAppAdmin
      ? pointsConstants.principalOrAdminYearlyMax
      : pointsConstants.practitionerYearlyMax;

  const percentageScore = (pointsTotalForYear / pointsMax) * 100;

  const [celebrationCardDetails, setCelebrationCardDetails] = useState<
    CardData | undefined
  >(undefined);

  const loadNextMonth = useCallback(() => {
    const nextMonthToLoad = Math.min(...monthsLoaded) - 1;
    setMonthsLoaded([...monthsLoaded, nextMonthToLoad]);
    setLoadNextMonthDisabled(nextMonthToLoad === 0);
  }, [monthsLoaded, setMonthsLoaded, setLoadNextMonthDisabled]);

  //TODO - Update this to use club data to set messages when available
  useEffect(() => {
    if (percentageScore < 60) {
      setCelebrationCardDetails({
        image: <EmojiOrangeSmile className="mr-2 h-16 w-16" />,
        primaryMessage: `Keep going ${practitioner?.user?.firstName}!`,
        secondaryMessage: 'Keep using Funda App to earn points.',
        textColour: 'alertMain',
        backgroundColour: 'alertBg',
      });
    } else if (percentageScore < 80) {
      setCelebrationCardDetails({
        image: <EmojiBlueSmile className="mr-2 h-16 w-16" />,
        primaryMessage: `Wow, great job ${practitioner?.user?.firstName}!`,
        secondaryMessage: "You're doing well, keep earning points!",
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
      <div className="mt-5 flex-col justify-center p-4">
        <Typography
          type={'h1'}
          color="black"
          text={format(new Date(), 'MMM yyyy')}
        />
        <PointsSummaryCard
          currentPoints={pointsTotalForYear}
          maxPoints={pointsMax}
          showIcon={false}
          useColourBackground={false}
        />
        {!!celebrationCardDetails && (
          <Card
            className={`mt-2 px-4 py-4 sm:px-6 bg-${celebrationCardDetails.backgroundColour}`}
            borderRaduis="lg"
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
        <Typography
          className="mt-10"
          type={'h1'}
          color="black"
          text={'What you earned points for:'}
        />
        {monthsLoaded.map((month) => {
          return <PointsMonthSummary month={month} />;
        })}
      </div>
      <div className="flex-column mt-10 justify-end p-4">
        <Button
          size="normal"
          className="mb-4 w-full"
          type="outlined"
          color="primary"
          text="See more months"
          textColor="primary"
          icon="EyeIcon"
          disabled={loadNextMonthDisabled}
          onClick={loadNextMonth}
        />
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
      </div>
    </BannerWrapper>
  );
};
