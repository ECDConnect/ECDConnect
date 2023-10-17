import { pointsActivitiesIds, pointsConstants } from '@/constants/points';
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
import { format } from 'date-fns';
import { useMemo, useRef, useState } from 'react';
import { PointsSummaryDto, captureAndDownloadComponent } from '@ecdlink/core';
import { PointsProgressCard } from '@/pages/dashboard/components/points-progress-card/points-progress-card';
import ROUTES from '@/routes/routes';
import { PointsShare } from '../points-share/points-share';
import { PointsInfoPage } from '../info/points-info-page';

// TODO - fetch club standings
// TODO - add text that depends on relative club points
// TODO - Actions for share

export const PointsSummary: React.FC = () => {
  const history = useHistory();

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;
  const isFundaAppAdmin = practitioner?.isFundaAppAdmin;

  const [showInfo, setShowInfo] = useState(false);

  const pointsSummaryDataWithLibrary = useSelector(
    pointsSelectors.getPointsSummaryWithLibrary(new Date())
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
  }, [pointsSummaryDataWithLibrary]);

  const pointsTotal = pointsSummaryDataWithLibrary.reduce(
    (total, current) => (total += current.pointsTotal),
    0
  );
  const pointsMax =
    isPrincipal || isFundaAppAdmin
      ? pointsConstants.principalOrAdminMonthlyMax
      : pointsConstants.practitionerMonthlyMax;

  const percentageScore = (pointsTotal / pointsMax) * 100;

  //TODO - Update this to use club data to set messages when available
  const celebrationCard = useMemo(() => {
    if (percentageScore < 60) {
      return (
        <CelebrationCard
          image={<EmojiOrangeSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Keep going ${practitioner?.user?.firstName}!`}
          primaryTextColour="errorMain"
          backgroundColour="errorBg"
          secondaryMessage="Check out the tips below to earn more points this month."
          secondaryTextColour="errorMain"
        />
      );
    } else if (percentageScore < 80) {
      return (
        <CelebrationCard
          image={<EmojiBlueSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Wow, great job ${practitioner?.user?.firstName}!`}
          secondaryMessage="You're doing well, keep it up! You can still earn more points this month."
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
  }, [percentageScore]);

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
                  description={pointsLibraryScore.subActivity || 'Unknown'}
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
          childCount={12} // TODO get correct count for practitioner
        />
      </div>
    </>
  );
};
