import { pointsConstants } from '@/constants/points';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import {
  BannerWrapper,
  Button,
  CelebrationCard,
  Dialog,
  DialogPosition,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { ReactComponent as Balloons } from '@ecdlink/ui/src/assets/emoji/balloons.svg';
import { format } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import { PointsMonthSummary } from './components/points-month-summary';
import ROUTES from '@/routes/routes';
import { PointsShare } from '../points-share/points-share';
import { captureAndDownloadComponent } from '@ecdlink/core';
import { PointsInfoPage } from '../info/points-info-page';
import { childrenSelectors } from '@/store/children';

export const PointsYearView: React.FC = () => {
  const history = useHistory();
  const currentMonth = new Date().getMonth();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const children = useSelector(childrenSelectors.getChildren);
  const userStanding = useSelector(
    pointsSelectors.getCurrentClubPercentileStandingForYear()
  );

  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;

  const [showInfo, setShowInfo] = useState(false);

  const [monthsLoaded, setMonthsLoaded] = useState<number[]>([currentMonth]);
  const [loadNextMonthDisabled, setLoadNextMonthDisabled] = useState<boolean>(
    currentMonth === 0
  );

  const currentMonthPoints = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(new Date())
  );

  const pointsTotalForYear = useSelector(
    pointsSelectors.getPointsTotalForYear()
  );

  const pointsMax =
    isPrincipal || isFundaAppAdmin
      ? pointsConstants.principalOrAdminYearlyMax
      : pointsConstants.practitionerYearlyMax;

  const percentageScore = (pointsTotalForYear / pointsMax) * 100;

  const loadNextMonth = useCallback(() => {
    const nextMonthToLoad = Math.min(...monthsLoaded) - 1;
    setMonthsLoaded([...monthsLoaded, nextMonthToLoad]);
    setLoadNextMonthDisabled(nextMonthToLoad === 0);
  }, [monthsLoaded, setMonthsLoaded, setLoadNextMonthDisabled]);

  //TODO - Update this to use club data to set messages when available
  const celebrationCard = useMemo(() => {
    if (!!userStanding) {
      if (userStanding === 100) {
        return (
          <CelebrationCard
            image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
            secondaryMessage="You are the top points earner in your club! You've earned the most points so far this year."
            primaryTextColour="successMain"
            secondaryTextColour="black"
            backgroundColour="successBg"
          />
        );
      }
      if (userStanding > 75) {
        return (
          <CelebrationCard
            image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
            secondaryMessage="You are one of the top points earners in your club!"
            primaryTextColour="successMain"
            secondaryTextColour="black"
            backgroundColour="successBg"
          />
        );
      }
      if (userStanding >= 50) {
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Good job ${practitioner?.user?.firstName}!`}
          secondaryMessage="So far this year, you have more points than most other SmartStarters in you club!"
          primaryTextColour="secondary"
          secondaryTextColour="black"
          backgroundColour="infoBb"
        />;
      }
      if (userStanding < 50) {
        return (
          <CelebrationCard
            image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
            primaryTextColour="errorMain"
            backgroundColour="errorBg"
            secondaryMessage={`Most of the SmartStarters in you club have more than ${pointsTotalForYear} points this year! Earn more points to join them.`}
            secondaryTextColour="black"
          />
        );
      }
    }

    if (pointsTotalForYear === 0) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
          primaryMessage="No points earned yet"
          secondaryMessage="Keep going to earn points."
          primaryTextColour="alertMain"
          secondaryTextColour="alertMain"
          backgroundColour="alertBg"
        />
      );
    } else if (percentageScore < 60) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
          secondaryMessage="Keep using Funda App to earn points."
          primaryTextColour="alertMain"
          secondaryTextColour="alertMain"
          backgroundColour="alertBg"
        />
      );
    } else if (percentageScore < 80) {
      return (
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, great job ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep earning points!"
          primaryTextColour="secondary"
          secondaryTextColour="secondary"
          backgroundColour="infoBb"
        />
      );
    } else {
      return (
        <CelebrationCard
          image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Well done ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep it up!"
          primaryTextColour="successMain"
          secondaryTextColour="successMain"
          backgroundColour="successBg"
        />
      );
    }
  }, [
    userStanding,
    pointsTotalForYear,
    percentageScore,
    practitioner?.user?.firstName,
  ]);

  // SHARE LOGIC
  const shareRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);
  const filteredPointsSummaries = currentMonthPoints.filter(
    (x) => x.pointsYTD > 0
  );

  return (
    <BannerWrapper
      size="medium"
      renderBorder={true}
      onBack={() => history.goBack()}
      title="Points"
      backgroundColour="white"
      displayHelp={true}
      onHelp={() => setShowInfo(true)}
    >
      <div className="mt-5 flex-col justify-center p-4">
        <Typography
          type={'h1'}
          color="black"
          text={format(new Date(), 'MMM yyyy')}
        />
        <ScoreCard
          className="mt-5"
          mainText={`${pointsTotalForYear}`}
          secondaryText="points"
          currentPoints={pointsTotalForYear}
          maxPoints={pointsMax}
          image={
            percentageScore > 80 ? (
              <Balloons className="mr-2 h-16 w-16" />
            ) : undefined
          }
          barBgColour="uiLight"
          barColour={
            percentageScore < 60
              ? 'errorMain'
              : percentageScore < 80
              ? 'infoMain'
              : 'successMain'
          }
          bgColour="uiBg"
          textColour="black"
        />
        {celebrationCard}
        {pointsTotalForYear > 0 && (
          <>
            <Typography
              className="mt-10"
              type={'h1'}
              color="black"
              text={'What you earned points for:'}
            />
            {monthsLoaded.map((month) => {
              return <PointsMonthSummary month={month} />;
            })}
          </>
        )}
      </div>
      {pointsTotalForYear > 0 && (
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
            onClick={() => {
              setShowPrintData(true);
              setTimeout(() => {
                if (shareRef.current) {
                  captureAndDownloadComponent(
                    shareRef.current,
                    'points-year-summary.jpg'
                  );
                  setShowPrintData(false);
                }
              }, 100);
            }}
          />
        </div>
      )}
      {pointsTotalForYear === 0 && (
        <div className="flex-column mt-10 justify-end p-4">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="primary"
            text="Find out how you can earn points"
            textColor="white"
            icon="LightBulbIcon"
            onClick={() => setShowInfo(true)}
          />
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="primary"
            text="Ask your coach for help"
            textColor="primary"
            icon="ChatIcon"
            onClick={() => history.push(ROUTES.PRACTITIONER.CONTACT_COACH)}
          />
        </div>
      )}
      <div ref={shareRef} style={{ display: showPrintData ? 'block' : 'none' }}>
        <PointsShare
          viewMode="Year"
          pointsSummaries={filteredPointsSummaries}
          userFullName={`${practitioner?.user?.firstName} ${practitioner?.user?.surname}`}
          childCount={children?.length || 0}
          clubStanding={userStanding}
          clubName={practitioner?.clubName || 'Unknown Club'}
        />
      </div>
      <Dialog
        fullScreen={true}
        visible={showInfo}
        position={DialogPosition.Full}
      >
        <PointsInfoPage onClose={() => setShowInfo(false)} />
      </Dialog>
    </BannerWrapper>
  );
};
