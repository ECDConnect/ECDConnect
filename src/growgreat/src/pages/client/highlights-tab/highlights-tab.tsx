import { useLayoutEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useWindowSize } from '@reach/window-size';

import { userSelectors } from '@/store/user';
import { getWeekDate } from '@ecdlink/core';
import {
  Alert,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { ReactComponent as ClipboardIcon } from '@/assets/clipboardIcon.svg';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { visitSelectors, visitThunkActions } from '@/store/visit';
import { useAppDispatch } from '@/store';
import { CLIENT_TABS } from '../client-dashboard/class-dashboard';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { VisitActions } from '@/store/visit/visit.actions';
import { healthCareWorkerSelectors } from '@/store/healthCareWorker';
import { PointsMonthViewRouteState } from '@/pages/practitioner/individual-points/month-view/types';
import { Card } from './components/card';

const HEADER_HEIGHT = 122;

export const HighlightsTab = () => {
  const today = new Date();

  const history = useHistory();
  const { height } = useWindowSize();
  const appDispatch = useAppDispatch();

  const user = useSelector(userSelectors.getUser);
  const highlightsData = useSelector(
    visitSelectors.getHealthCareWorkerHighlightsSelector
  );
  const currentIndividualPoints = useSelector(
    healthCareWorkerSelectors.getHealthCareWorkerTotalCompletedPointsByMonthSelector(
      today.getMonth() + 1
    )
  );

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_HCW_HIGHLIGHTS
  );

  const { isOnline } = useOnlineStatus();

  // Display Monday through Friday of the current week as subtitle text (show this from Monday 00:00 to Sunday 23:59; then switch to the next week -
  // so the user can review the summary for the previous week's visits on Saturday & Sunday as well)
  const dayNumber = new Date().getUTCDay(); // Mon 1 Tue 2 Wed 3 Thu 4 Fri 5 Sat 6 Sun 7

  let showThisWeek = true;
  let isHighlights = false;
  if (dayNumber >= 1 && dayNumber <= 5) {
    showThisWeek = true;
  } else {
    showThisWeek = false;
  }

  const thisWeek_startDate = `${getWeekDate('monday').getDate()} ${getWeekDate(
    'monday'
  ).toLocaleString('default', { month: 'long' })}`;
  const thisWeek_endDate = `${getWeekDate('friday').getDate()} ${getWeekDate(
    'friday'
  ).toLocaleString('default', { month: 'long' })}`;
  const lastWeek_startDate = `${
    getWeekDate('monday').getDate() - 7
  } ${getWeekDate('monday').toLocaleString('default', { month: 'long' })}`;
  const lastWeek_endDate = `${
    getWeekDate('friday').getDate() - 7
  } ${getWeekDate('friday').toLocaleString('default', { month: 'long' })}`;

  if (showThisWeek) {
    //-- IF 0 visits have been completed. 0 children's growth monitored and 0 new clients registered so far this week:
    if (
      highlightsData?.totalThisWeekFamilyVisits === 0 &&
      highlightsData.totalThisWeekGrowthMonitored === 0 &&
      highlightsData.totalThisWeekNewClients === 0
    ) {
      //-- IF today is Monday. show the ""last week"" celebratory card shown in UI
      if (dayNumber === 1) {
        isHighlights = false;
      } else {
        //-- IF today is NOT Monday. show dismissable info message (once user dismisses it. don't show again until the next week)"
        isHighlights = true;
      }
    } else {
      isHighlights = true;
    }
  }

  useLayoutEffect(() => {
    if (user?.id && isOnline) {
      appDispatch(
        visitThunkActions.getHealthCareWorkerHighlights({ userId: user?.id })
      ).unwrap();
    }
  }, [appDispatch, isOnline, user?.id]);

  const renderContent = useMemo(() => {
    if (isHighlights) {
      return (
        <>
          <Divider className="pb-4" dividerType="dashed" />
          {!!currentIndividualPoints && (
            <SuccessCard
              className="my-4"
              customIcon={<CelebrateIcon className="h-14	w-14" />}
              text={`Great job ${user?.firstName || ''}!`}
              subText={`You've earned ${currentIndividualPoints} points so far this month`}
              color="successMain"
            />
          )}
          <Card
            key="1"
            value={
              showThisWeek
                ? highlightsData?.totalThisWeekFamilyVisits
                : highlightsData?.totalLastWeekFamilyVisits
            }
            label="Families visited"
            icon="HomeIcon"
            points={0}
          />
          <Card
            key="2"
            value={
              showThisWeek
                ? highlightsData?.totalThisWeekGrowthMonitored
                : highlightsData?.totalLastWeekGrowthMonitored
            }
            label="Children growth monitored"
            icon="ChartBarIcon"
            points={0}
          />
          <Card
            key="3"
            value={
              showThisWeek
                ? highlightsData?.totalThisWeekNewClients
                : highlightsData?.totalLastWeekNewClients
            }
            label="New clients"
            icon="UserAddIcon"
            points={0}
          />
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <Alert
          type={'info'}
          className="mt-4 flex w-full items-center justify-center"
          title={`Keep going ${user?.firstName || ''}!`}
          list={[
            'You didn’t earn any points on CHW Connect last week',
            'Register new clients and do home visits to earn points!',
          ]}
        />
        <ClipboardIcon className="mb-4 mt-7" />
        <Typography
          type="h3"
          weight="bold"
          lineHeight="snug"
          align="center"
          className="mx-9"
          text="Start visiting & registering clients to see your highlights!"
        />
      </div>
    );
  }, [
    currentIndividualPoints,
    isHighlights,
    user?.firstName,
    highlightsData,
    showThisWeek,
  ]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="pt-4"
      />
    );
  }

  return (
    <div
      className="flex flex-col p-4"
      style={{ height: height - HEADER_HEIGHT }}
    >
      <Typography
        type="h2"
        weight="bold"
        lineHeight="snug"
        text="This week’s highlights"
      />
      <Typography
        type="h4"
        weight="bold"
        lineHeight="snug"
        color="textMid"
        className="mb-6"
        text={
          showThisWeek
            ? `${thisWeek_startDate} to ${thisWeek_endDate}`
            : `${lastWeek_startDate} to ${lastWeek_endDate}`
        }
      />
      {renderContent}
      <div className="flex h-full flex-col justify-end">
        <Button
          text="See upcoming visits"
          icon="CalendarIcon"
          type="filled"
          color="primary"
          textColor="white"
          className="mt-4 w-full"
          iconPosition="start"
          onClick={() =>
            history.push(ROUTES.CLIENTS.ROOT, {
              activeTabIndex: CLIENT_TABS.VISIT,
            })
          }
        />
        {isHighlights && (
          <Button
            text="See points summary"
            icon="StarIcon"
            type="outlined"
            color="primary"
            textColor="primary"
            className="mt-4 w-full"
            iconPosition="start"
            onClick={() =>
              history.push(ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.ROOT, {
                forceReload: true,
              } as PointsMonthViewRouteState)
            }
          />
        )}
      </div>
    </div>
  );
};
