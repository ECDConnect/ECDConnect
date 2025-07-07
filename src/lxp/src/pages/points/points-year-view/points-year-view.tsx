import { pointsConstants } from '@/constants/points';
import { pointsSelectors, pointsThunkActions } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import {
  BannerWrapper,
  Button,
  CelebrationCard,
  Dialog,
  DialogPosition,
  Divider,
  PointsProgressCard,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { ReactComponent as EmojiGreenSmile } from '@ecdlink/ui/src/assets/emoji/emoji_green_bigsmile.svg';
import { ReactComponent as EmojiBlueSmile } from '@ecdlink/ui/src/assets/emoji/emoji_blue_smileEyes.svg';
import { ReactComponent as EmojiOrangeSmile } from '@ecdlink/ui/src/assets/emoji/emoji_orange_smile.svg';
import { ReactComponent as EmojiYellowHappy } from '../../../assets/ECD_Connect_emoji3.svg';
import happyOverlay from '../../../assets/happy_overlay.svg';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PointsShare } from '../points-share/points-share';
import { captureAndDownloadComponent } from '@ecdlink/core';
import { PointsInfoPage } from '../info/points-info-page';
import { useAppDispatch } from '@/store';
import { PointsUserYearMonthSummary } from '@ecdlink/graphql';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { PointsService } from '@/services/PointsService';
import { authSelectors } from '@/store/auth';

export interface PointsYearViewRouteState {
  userRankingData?: any;
}

export const PointsYearView: React.FC = () => {
  const history = useHistory();
  const { state } = useLocation<PointsYearViewRouteState>();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const dispatch = useAppDispatch();
  const messageNr = state?.userRankingData?.messageNr;
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const isPrincipal = practitioner?.isPrincipal;

  const [showInfo, setShowInfo] = useState(false);

  const [pointsShareData, setPointsShareData] = useState<any>();
  const [monthsIndex, setMonthsIndex] = useState(1);
  const [pointsYearSummary, setPointsYearSummary] =
    useState<PointsUserYearMonthSummary>();

  const getYearPoints = useCallback(async () => {
    const response = await dispatch(
      pointsThunkActions.yearPointsView({
        userId: practitioner?.userId!,
      })
    );
    setPointsYearSummary(response?.payload as PointsUserYearMonthSummary);
  }, []);

  useEffect(() => {
    getYearPoints();
  }, []);

  const pointsMax = isPrincipal
    ? pointsConstants.principalOrAdminYearlyMax
    : pointsConstants.practitionerYearlyMax;

  const percentageScore = (pointsYearSummary?.total! / pointsMax) * 100;

  const getYearShareData = useCallback(async () => {
    const response = await new PointsService(userAuth?.auth_token!).sharedData(
      practitioner?.userId!,
      false
    );
    setPointsShareData(response);
    return response;
  }, [practitioner?.userId, userAuth?.auth_token]);

  useEffect(() => {
    getYearShareData();
  }, []);

  const celebrationCard = useMemo(() => {
    if (pointsYearSummary?.total === 0) {
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
    }

    if (percentageScore < 60) {
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
    }

    if (percentageScore < 80) {
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
    }

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
  }, [
    practitioner?.user?.firstName,
    pointsYearSummary?.total,
    percentageScore,
  ]);

  // SHARE LOGIC
  const shareRef = useRef<HTMLDivElement>(null);
  const [showPrintData, setShowPrintData] = useState(false);

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
      <div className="mt-5 flex-col justify-center">
        <Typography
          type={'h1'}
          color="black"
          text={`Points ${format(new Date(), 'yyyy')}`}
          className="px-4"
        />
        <div className="px-4">
          <ScoreCard
            className="mt-5"
            hint="Points"
            isHiddenSubLabel={true}
            isBigTitle={true}
            mainText={
              pointsYearSummary?.total ? `${pointsYearSummary?.total}` : '0'
            }
            secondaryText="points"
            currentPoints={pointsYearSummary?.total || 0}
            maxPoints={pointsMax}
            image={
              percentageScore >= 80 ? (
                <EmojiYellowHappy className="mr-2 mb-12 h-16 w-16" />
              ) : undefined
            }
            barBgColour="white"
            barColour={
              percentageScore < 60
                ? 'alertMain'
                : percentageScore < 80
                ? 'quatenary'
                : 'successMain'
            }
            bgColour={
              percentageScore < 60
                ? 'alertBg'
                : percentageScore < 80
                ? 'quatenaryBg'
                : 'successBg'
            }
            textColour="black"
          />
        </div>
        {percentageScore > 80 && (
          <img src={happyOverlay} alt="happy overlay" className="my-4 w-full" />
        )}
        {pointsYearSummary && pointsYearSummary?.total > 0 && (
          <>
            <Typography
              className="mt-10 px-4"
              type={'h3'}
              color="black"
              text={'What you earned points for:'}
            />
          </>
        )}
      </div>
      {pointsYearSummary && (
        <div className="px-4">
          {pointsYearSummary?.monthSummary
            ?.slice(0, monthsIndex)
            ?.map((item) => {
              return (
                <div>
                  <Divider dividerType="dashed" className="mt-3 mb-3" />
                  <Typography
                    type={'h4'}
                    color="black"
                    text={String(item?.month)}
                  />
                  <Typography
                    type={'body'}
                    color="textMid"
                    text={`${item?.total} points`}
                  />
                  {item?.activityDetail?.map((activity, index) => (
                    <PointsProgressCard
                      key={'points_' + index}
                      hideProgressBar={true}
                      isYearView={true}
                      currentPoints={activity?.timesScored!}
                      description={activity?.activity || 'Unknown'}
                      badgeImage={
                        <div className="relative mr-4 flex h-14 w-14 items-center justify-center">
                          <Badge
                            className="absolute z-0 h-12 w-12"
                            fill="var(--secondary)"
                          />
                          <Typography
                            className="relative z-10"
                            color="white"
                            type="h3"
                            text={String(activity?.pointsTotal)}
                          />
                        </div>
                      }
                    />
                  ))}
                </div>
              );
            })}
        </div>
      )}
      {pointsYearSummary && pointsYearSummary?.total > 0 && (
        <div className="flex-column mt-10 justify-end p-4">
          <Button
            size="normal"
            className="mb-4 w-full"
            type="outlined"
            color="quatenary"
            text="See more months"
            textColor="quatenary"
            icon="EyeIcon"
            disabled={monthsIndex === pointsYearSummary?.monthSummary?.length!}
            onClick={() =>
              monthsIndex < pointsYearSummary?.monthSummary?.length!
                ? setMonthsIndex(monthsIndex + 1)
                : {}
            }
          />
          <Button
            size="normal"
            className="mb-4 w-full"
            type="filled"
            color="quatenary"
            text="Share"
            textColor="white"
            icon="ShareIcon"
            onClick={() => {
              setShowPrintData(true);
              setTimeout(() => {
                if (shareRef.current) {
                  captureAndDownloadComponent(
                    shareRef.current,
                    `points-year-summary-${format(new Date(), 'yyyy')}`
                  );
                  setShowPrintData(false);
                }
              }, 100);
            }}
          />
        </div>
      )}
      <div ref={shareRef} style={{ display: showPrintData ? 'block' : 'none' }}>
        <PointsShare
          viewMode="Year"
          messageNr={messageNr}
          pointsSummaries={pointsShareData?.activityDetail}
          pointsTotal={String(pointsYearSummary?.total)}
          userFullName={
            practitioner?.user?.surname
              ? `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`
              : `${practitioner?.user?.firstName}`
          }
          childCount={pointsShareData?.totalChildren || 0}
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
