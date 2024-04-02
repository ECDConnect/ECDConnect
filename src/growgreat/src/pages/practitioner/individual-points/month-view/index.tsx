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
import { useHistory, useLocation } from 'react-router';
import { ComparativeMessage } from '../components/comparative-message';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Pregnant from '@/assets/pregnant.svg';
import Infant from '@/assets/infant.svg';
import { useSelector } from 'react-redux';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { HealthCareWorkerActions } from '@/store/healthCareWorker/healthCareWorker.actions';
import { PointsShare } from '../components/points-share';
import {
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from '@/store/healthCareWorker';
import { useSnackbar } from '@ecdlink/core';
import { PointsMonthViewRouteState } from './types';
import { useAppDispatch } from '@/store';
import {
  VisitActions,
  getHealthCareWorkerVisitStatus,
} from '@/store/visit/visit.actions';

export const IndividualPointsMonthView = () => {
  const [isDownloadPointsShare, setIsDownloadPointsShare] = useState(false);

  const history = useHistory();
  const location = useLocation<PointsMonthViewRouteState>();

  const today = new Date()!;

  const { isOnline } = useOnlineStatus();

  const { showMessage } = useSnackbar();

  const appDispatch = useAppDispatch();

  const todoPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerPointsTodoItemsSelector
  );
  const currentIndividualPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTotalCompletedPointsByMonthSelector(
      today.getMonth() + 1
    )
  );
  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const individualPointsUIDetails = getIndividualPointsUIDetails(
    currentIndividualPoints,
    'month'
  );

  const childFoldersItem = todoPoints?.find((item) =>
    item.message.includes('child')
  );
  const momFoldersItem = todoPoints?.find((item) =>
    item.message.includes('mom')
  );
  const visitsItem = todoPoints?.find((item) => item.message.includes('visit'));
  const referralsItem = todoPoints?.find((item) =>
    item.message.includes('referral')
  );

  const { isLoading: isLoadingVisitStatus } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_STATUS
  );

  const {
    isLoading: isLoadingCompletedPoints,
    wasLoading: wasLoadingCompletedPoints,
    isRejected: isRejectedCompletedPoints,
    error: errorCompletedPoints,
  } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_POINTS
  );
  const {
    isLoading: isLoadingTodoPoints,
    wasLoading: wasLoadingTodoItems,
    isRejected: isRejectedTodoItems,
    error: errorTodoItems,
  } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_POINTS_TODO_ITEMS
  );
  const {
    isLoading: isLoadingTeamStanding,
    wasLoading: wasLoadingTeamStanding,
    isRejected: isRejectedTeamStanding,
    error: errorTeamStanding,
  } = useThunkFetchCall(
    'healthCareWorker',
    HealthCareWorkerActions.GET_HEALTH_CARE_WORKER_TEAM_STANDING
  );

  const isLoading =
    isLoadingCompletedPoints || isLoadingTodoPoints || isLoadingTeamStanding;
  const wasLoading =
    wasLoadingTodoItems || wasLoadingCompletedPoints || wasLoadingTeamStanding;
  const isRejected =
    isRejectedCompletedPoints || isRejectedTodoItems || isRejectedTeamStanding;
  const error = errorCompletedPoints || errorTodoItems || errorTeamStanding;

  const refreshData = useCallback(() => {
    const promises = [];

    if (
      location.state?.forceReload &&
      healthCareWorker?.user?.id &&
      healthCareWorker?.id
    ) {
      const oneYearAgo = new Date();
      oneYearAgo.setMonth(today.getMonth() - 12);

      promises.push(
        appDispatch(
          healthCareWorkerThunkActions.getHealthCareWorkerPoints({
            userId: healthCareWorker.user.id,
            startDate: oneYearAgo,
          })
        )
      );
      promises.push(
        appDispatch(
          healthCareWorkerThunkActions.getHealthCareWorkerPointsTodoItems({
            healthCareWorkerId: healthCareWorker.id,
          })
        )
      );
      promises.push(
        appDispatch(
          healthCareWorkerThunkActions.getHealthCareWorkerTeamStanding({
            userId: healthCareWorker.user.id,
          })
        )
      );
      promises.push(
        appDispatch(
          getHealthCareWorkerVisitStatus({
            userId: healthCareWorker.user.id,
          })
        )
      );

      history.replace(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.ROOT, {
        forceReload: undefined,
      });
    }

    Promise.all(promises);
  }, [
    appDispatch,
    healthCareWorker,
    history,
    location.state?.forceReload,
    today,
  ]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({
        message: error,
        type: 'error',
      });
    }
  }, [error, isLoading, isRejected, showMessage, wasLoading]);

  useEffect(() => {
    refreshData();
    // trigger refreshData only when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pointsToEarn = useMemo((): {
    imageUrl?: string;
    icon?: string;
    description: string;
    currentPoints: number;
    maxPoints: number;
  }[] => {
    const todoItems = [];

    if (childFoldersItem) {
      const childFolders = {
        imageUrl: Infant,
        description: childFoldersItem.message,
        currentPoints:
          (childFoldersItem.percentageComplete / 100) * childFoldersItem.points,
        maxPoints: childFoldersItem.points,
      };

      todoItems.push(childFolders);
    }

    if (momFoldersItem) {
      const momFolders = {
        imageUrl: Pregnant,
        description: momFoldersItem.message,
        currentPoints:
          (momFoldersItem.percentageComplete / 100) * momFoldersItem.points,
        maxPoints: momFoldersItem.points,
      };

      todoItems.push(momFolders);
    }

    if (visitsItem) {
      const visits = {
        icon: 'HomeIcon',
        description: visitsItem.message,
        currentPoints:
          (visitsItem.percentageComplete / 100) * visitsItem.points,
        maxPoints: visitsItem.points,
      };

      todoItems.push(visits);
    }

    if (referralsItem) {
      const referrals = {
        icon: 'ClipboardListIcon',
        description: referralsItem.message,
        currentPoints:
          (referralsItem.percentageComplete / 100) * referralsItem.points,
        maxPoints: referralsItem.points,
      };

      todoItems.push(referrals);
    }

    return todoItems;
  }, [childFoldersItem, momFoldersItem, referralsItem, visitsItem]);

  const onShare = () => {
    setIsDownloadPointsShare(true);
    setTimeout(() => {
      setIsDownloadPointsShare(false);
    }, 1000);
  };

  return (
    <>
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
        <ComparativeMessage viewMode="month" />
        {!!todoPoints?.length && (
          <Typography
            className="mt-6"
            type="h3"
            text={`How you can earn more points in ${format(today, 'MMMM')}:`}
          />
        )}
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
            isLoading={isDownloadPointsShare || isLoadingVisitStatus}
            disabled={isDownloadPointsShare || isLoadingVisitStatus}
            onClick={onShare}
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
      {isDownloadPointsShare && <PointsShare viewMode="month" />}
    </>
  );
};
