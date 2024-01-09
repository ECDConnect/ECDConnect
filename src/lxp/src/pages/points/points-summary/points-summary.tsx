import { pointsActivitiesIds, pointsConstants } from '@/constants/points';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import {
  BannerWrapper,
  Button,
  CelebrationCard,
  Dialog,
  DialogPosition,
  PointsProgressCard,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { format } from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import { PointsSummaryDto, captureAndDownloadComponent } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { PointsShare } from '../points-share/points-share';
import { PointsInfoPage } from '../info/points-info-page';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { childrenSelectors } from '@/store/children';

export const PointsSummary: React.FC = () => {
  const history = useHistory();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const children = useSelector(childrenSelectors.getChildren);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;

  const [showInfo, setShowInfo] = useState(false);

  const pointsSummaryDataWithLibrary = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(new Date())
  );
  const userStanding = useSelector(
    pointsSelectors.getCurrentPercentileClubStandingForMonth()
  );
  const pointsTotalForYear = useSelector(
    pointsSelectors.getPointsTotalForYear()
  );
  const filteredPointsSummaries = pointsSummaryDataWithLibrary.filter(
    (x) => x.pointsTotal > 0
  );

  const pointsTodoList = useMemo(() => {
    const pointsList: PointsSummaryDto[] = [];

    pointsSummaryDataWithLibrary.forEach((pointsActivity) => {
      // Regular non-maxed monthly activities
      if (
        (pointsActivity.pointsLibraryId ===
          pointsActivitiesIds.SubmitAttendance ||
          pointsActivity.pointsLibraryId ===
            pointsActivitiesIds.SubmitIncomeStatement ||
          pointsActivity.pointsLibraryId ===
            pointsActivitiesIds.MonthlyPreschoolFeesAdded) &&
        pointsActivity.pointsTotal !== pointsActivity.maxMonthlyPoints
      ) {
        pointsList.push(pointsActivity);
      }
      // Updated fees for the year (Principals/FAAs only)
      else if (
        pointsActivity.pointsLibraryId ===
          pointsActivitiesIds.MonthlyPreschoolFeeUpdated &&
        pointsActivity.pointsYTD === 0 &&
        (practitioner?.isPrincipal || practitioner?.isFundaAppAdmin)
      ) {
        pointsList.push(pointsActivity);
      }
    });

    return pointsList;
  }, [
    pointsSummaryDataWithLibrary,
    practitioner?.isFundaAppAdmin,
    practitioner?.isPrincipal,
  ]);

  const pointsTotal = pointsSummaryDataWithLibrary.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );
  let pointsMax =
    isPrincipal || isFundaAppAdmin
      ? pointsConstants.principalOrAdminMonthlyMax
      : pointsConstants.practitionerMonthlyMax;

  const percentageScore = (pointsTotal / pointsMax) * 100;

  // without this rule the progress bar goes beyond the component
  if (pointsTotal > pointsMax) {
    pointsMax = pointsTotal;
  }

  const celebrationCard = useMemo(() => {
    if (!!userStanding) {
      if (userStanding === 100) {
        return (
          <CelebrationCard
            image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Wow, well done ${practitioner?.user?.firstName}!`}
            secondaryMessage="You are the top points earner in your club! Keep it up!"
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
            secondaryMessage="You are one of the top points earners in your club! Keep it up!"
            primaryTextColour="successMain"
            secondaryTextColour="black"
            backgroundColour="successBg"
          />
        );
      }
      if (userStanding >= 50) {
        return (
          <CelebrationCard
            image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Good job ${practitioner?.user?.firstName}!`}
            secondaryMessage="You have more points than most other SmartStarters in your club!"
            primaryTextColour="secondary"
            secondaryTextColour="black"
            backgroundColour="infoBb"
          />
        );
      }
      if (userStanding < 50) {
        return (
          <CelebrationCard
            image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
            primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
            primaryTextColour="alertMain"
            backgroundColour="alertBg"
            secondaryMessage={`Most of the SmartStarters in you club have more than ${pointsTotalForYear} points! Earn more points to join them.`}
            secondaryTextColour="black"
          />
        );
      }
    }

    if (percentageScore < 60) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
          primaryTextColour="alertMain"
          backgroundColour="alertBg"
          secondaryMessage="Check out the tips below to earn more points this month."
          secondaryTextColour="black"
        />
      );
    } else if (percentageScore < 80) {
      return (
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, great job ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep it up! You can still earn more points this month."
          primaryTextColour="secondary"
          secondaryTextColour="black"
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
          secondaryTextColour="black"
          backgroundColour="successBg"
        />
      );
    }
  }, [
    percentageScore,
    pointsTotalForYear,
    practitioner?.user?.firstName,
    userStanding,
  ]);

  // SHARE LOGIC
  const shareRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);

  return (
    <>
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
            mainText={`${pointsTotal} points`}
            currentPoints={pointsTotal}
            maxPoints={pointsMax}
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
          {!!pointsTodoList && !!pointsTodoList.length && (
            <Typography
              className="mt-10"
              type={'h1'}
              color="black"
              text={`How you can earn more points in ${format(
                new Date(),
                'MMMM'
              )}:`}
            />
          )}
          {!!pointsTodoList &&
            pointsTodoList.map((pointsLibraryScore) => {
              return (
                <PointsProgressCard
                  currentPoints={pointsLibraryScore.pointsTotal}
                  maxPoints={
                    pointsLibraryScore.maxMonthlyPoints !== 0
                      ? pointsLibraryScore.maxMonthlyPoints
                      : pointsLibraryScore.maxYearlyPoints
                  }
                  description={pointsLibraryScore.todoDescription || 'Unknown'}
                  badgeImage={
                    <Badge
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                      fill="var(--primary)"
                    />
                  }
                />
              );
            })}
        </div>
        <div className="flex-column mt-10 justify-end p-4">
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
                    'points-month-summary.jpg'
                  );
                  setShowPrintData(false);
                }
              }, 100);
            }}
          />
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="primary"
            text="See detailed report"
            textColor="primary"
            icon="EyeIcon"
            onClick={() => history.push(ROUTES.PRACTITIONER.POINTS.YEAR)}
          />
        </div>
      </BannerWrapper>
      <Dialog
        fullScreen={true}
        visible={showInfo}
        position={DialogPosition.Full}
      >
        <PointsInfoPage onClose={() => setShowInfo(false)} />
      </Dialog>
      <div ref={shareRef} style={{ display: showPrintData ? 'block' : 'none' }}>
        <PointsShare
          viewMode="Month"
          pointsSummaries={filteredPointsSummaries}
          userFullName={`${practitioner?.user?.firstName} ${practitioner?.user?.surname}`}
          childCount={children?.length || 0}
          clubStanding={userStanding}
          clubName={practitioner?.clubName || 'Unknown Club'}
        />
      </div>
    </>
  );
};
