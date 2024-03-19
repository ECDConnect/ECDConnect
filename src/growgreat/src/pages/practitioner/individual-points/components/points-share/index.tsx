import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { captureAndDownloadComponent, useTheme } from '@ecdlink/core';
import {
  BannerWrapper,
  Colours,
  PointsDetailsCard,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { ReactComponent as PollyInformational } from '@/assets/pollyInformational.svg';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { ReactComponent as CelebrateIconLight } from '@/assets/celebrateIconLight.svg';
import { ReactComponent as AwardIconDark } from '@/assets/awardIconDark.svg';
import { useEffect, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { communitySelectors } from '@/store/community';

export const PointsShare = ({ viewMode }: { viewMode: 'year' | 'month' }) => {
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (shareRef.current) {
        captureAndDownloadComponent(shareRef.current, 'GGC-points');
      }
    }, 100);
  }, []);

  const { theme } = useTheme();

  const today = new Date();

  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );
  const yearlyPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerPointsDetailsSelector
  );
  const monthlyPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerPointsByMonthSelector(
      today.getMonth() + 1
    )
  );
  const standing = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTeamStandingSelector
  );
  const clinic = useSelector(communitySelectors.getClinicSelector);

  const yearlyDescription = `Jan - ${format(today, 'MMM')} ${format(
    today,
    'yyyy'
  )}`;
  const monthlyDescription = `1 to ${format(today, 'd MMMM yyyy')}`;
  const description =
    viewMode === 'year' ? yearlyDescription : monthlyDescription;

  const percentageMembersWithFewerPoints =
    (viewMode === 'year'
      ? standing?.percentageMembersWithFewerPointsForCurrentYear
      : standing?.percentageMembersWithFewerPointsForCurrentMonth) ?? 0;

  const points =
    viewMode === 'year'
      ? yearlyPoints.filter((point) => point.year === today.getFullYear())
      : monthlyPoints;

  const sortedPoints = points
    ?.sort((a, b) => b.pointsTotal - a.pointsTotal)
    .slice(0, 8);

  const totalPoints = points?.reduce((acc, curr) => acc + curr.pointsTotal, 0);

  // TODO: replace with real data
  const childrenVisited = `{count}`;
  // TODO: replace with real data
  const momsVisited = `{count}`;

  const renderSummaryMessage = useMemo(() => {
    let message = 'Well done!';
    let colour: Colours = 'secondary';
    let Icon = CelebrateIconLight;

    if (percentageMembersWithFewerPoints === 100) {
      message = `Top CHW ${
        clinic?.name ? `at ${clinic.name}` : ''
      } for this period!`;
      colour = 'successMain';
      Icon = AwardIconDark;
    } else if (percentageMembersWithFewerPoints > 75) {
      message = `One of the top CHWs ${
        clinic?.name ? `at ${clinic.name}` : ''
      } for this period!`;
      colour = 'successMain';
      Icon = AwardIconDark;
    } else if (percentageMembersWithFewerPoints > 50) {
      message = 'High points earner!';
      colour = 'secondary';
      Icon = CelebrateIconLight;
    }

    return (
      <div className={`flex items-center gap-4 p-4 bg-${colour} rounded-10`}>
        <Icon className="h-16 w-16" />
        <div className="mb-4">
          <Typography type="h4" color="white" text={message} />
          <Typography
            type="h5"
            color="white"
            text={`★ ${totalPoints} points`}
          />
        </div>
      </div>
    );
  }, [percentageMembersWithFewerPoints, totalPoints, clinic?.name]);

  return (
    <div ref={shareRef} className="overflow-auto">
      <BannerWrapper
        backgroundColour={'white'}
        backgroundImageColour={'primary'}
        menuLogoUrl={theme?.images.logoUrl}
        showBackground
        size="normal"
        renderBorder
        backgroundUrl={theme?.images.graphicOverlayUrl}
      >
        <div
          className="bg-uiBg flex w-full flex-col items-center justify-center px-4 pb-6"
          style={{ marginTop: 52 }}
        >
          <Typography
            type="h2"
            color="textDark"
            text={`${healthCareWorker?.user?.firstName} ${
              healthCareWorker?.user?.surname ?? ''
            }'ss GGC points`}
          />
          <Typography type="h4" color="textDark" text={description} />
        </div>
        <div className="p-4">
          {renderSummaryMessage}
          <Typography
            className="mb-4"
            type="h4"
            color="textDark"
            text="You earned most of your points from these activities:"
          />
          {sortedPoints?.map((item, index) => (
            <PointsDetailsCard
              isShare
              key={item.pointsActivityId + index}
              pointsEarned={item?.pointsTotal}
              activityCount={item?.timesScored}
              title={item?.activityName}
              size="medium"
              className="mb-1"
              colour="uiBg"
              badgeTextColour="white"
              badgeImage={
                <Badge
                  className="absolute z-0 h-full w-full"
                  fill={'var(--secondary)'}
                />
              }
            />
          ))}
          <div className="mt-4 flex items-center gap-2">
            <PollyInformational className="h-24 w-24" />
            <Typography
              className="mb-4"
              type="body"
              color="textDark"
              text={`During this period, you visited ${childrenVisited} children & their caregivers, and ${momsVisited} pregnant moms. You are helping to build a healthy, happy community!`}
            />
          </div>
        </div>
      </BannerWrapper>
    </div>
  );
};
