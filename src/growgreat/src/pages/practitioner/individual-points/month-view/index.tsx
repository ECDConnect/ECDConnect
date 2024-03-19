import { MaxIndividualPoints } from '@/constants/Community';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import ROUTES from '@/routes/routes';
import { getIndividualPointsUIDetails } from '@/utils/community/individual-points';
import {
  BannerWrapper,
  Button,
  PointsProgressCard,
  ScoreCard,
  Typography,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useHistory } from 'react-router';
import { ComparativeMessage } from '../components/comparative-message';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useMemo } from 'react';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import { useSelector } from 'react-redux';
import { getHealthCareWorkerTotalPointsPerMonthSelector } from '@/store/healthCareWorker/healthCareWorker.selectors';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';

export const IndividualPointsMonthView = () => {
  const history = useHistory();

  const today = new Date();

  const { isOnline } = useOnlineStatus();

  const { isLoading } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_POINTS
  );

  const currentIndividualPoints = useSelector(
    getHealthCareWorkerTotalPointsPerMonthSelector(today.getMonth() + 1)
  );

  const individualPointsUIDetails = getIndividualPointsUIDetails(
    currentIndividualPoints,
    'month'
  );

  const pointsToEarn = useMemo((): {
    imageUrl?: string;
    icon?: string;
    description: string;
    currentPoints: number;
    maxPoints: number;
  }[] => {
    const childFolders = {
      imageUrl: Infant,
      description: 'Open 2 child folders',
      // TODO: add real points
      currentPoints: 80,
      maxPoints: 100,
    };
    const momFolders = {
      imageUrl: Pregnant,
      description: 'Open 2 pregnant mom folders',
      // TODO: add real points
      currentPoints: 2,
      maxPoints: 50,
    };
    const visits = {
      icon: 'HomeIcon',
      description: 'Complete 8 visits due this month',
      // TODO: add real points
      currentPoints: 180,
      maxPoints: 260,
    };
    const referrals = {
      icon: 'ClipboardListIcon',
      description: 'Make 2 referrals',
      // TODO: add real points
      currentPoints: 25,
      maxPoints: 40,
    };

    // TODO: Add conditions to check if the user has completed some task
    return [childFolders, momFolders, visits, referrals];
  }, []);

  return (
    <BannerWrapper
      isLoading={isLoading}
      displayHelp
      displayOffline={!isOnline}
      renderBorder
      size="small"
      title="Points"
      onBack={() => history.push(ROUTES.DASHBOARD)}
      onHelp={() =>
        history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.INFO_PAGE)
      }
      className="flex flex-col p-4 pt-6"
    >
      <Typography type="h2" text={format(today, 'MMMM yyyy')} />
      <ScoreCard
        className="my-4"
        mainText={String(currentIndividualPoints ?? 0)}
        hint="points"
        currentPoints={currentIndividualPoints}
        maxPoints={MaxIndividualPoints.PerMonth}
        barBgColour="uiLight"
        barColour={individualPointsUIDetails.mainColour}
        bgColour="uiBg"
        barSize="medium"
        textColour="black"
      />
      <ComparativeMessage />
      <Typography
        className="mt-6"
        type="h3"
        text={`How you can earn more points in ${format(today, 'MMMM')}:`}
      />
      {pointsToEarn?.map((item, index) => (
        <PointsProgressCard
          key={'points_' + index}
          icon={item?.icon ?? ''}
          imageUrl={item?.imageUrl ?? ''}
          currentPoints={item.currentPoints}
          maxPoints={item.maxPoints}
          description={item.description}
          barColour="secondary"
          badgeImage={
            <Badge
              style={{
                objectFit: 'cover',
                width: '100%',
                height: '100%',
              }}
              fill="var(--secondary)"
            />
          }
        />
      ))}
      <div className={`mt-auto flex flex-col gap-4 pt-8`}>
        <Button
          icon="ShareIcon"
          type="filled"
          textColor="white"
          color="primary"
          text="Share"
          onClick={() => {
            // TODO: Implement share
          }}
        />
        <Button
          icon="EyeIcon"
          type="outlined"
          textColor="primary"
          color="primary"
          text="See more"
          onClick={() =>
            history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.YEAR_VIEW)
          }
        />
      </div>
    </BannerWrapper>
  );
};
