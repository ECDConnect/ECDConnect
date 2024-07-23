import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useHistory } from 'react-router';
import { useWindowSize } from '@reach/window-size';

import {
  Button,
  Card,
  Divider,
  LoadingSpinner,
  RoundIcon,
  Typography,
} from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';
import Pregnant from '@/assets/pregnant.svg';
import ROUTES from '@/routes/routes';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { getWeekDate } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { visitSelectors, visitThunkActions } from '@/store/visit';
import { useSelector } from 'react-redux';
import { userSelectors } from '@/store/user';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';

const HEADER_HEIGHT = 122;

const SuccessCard = ({ text, subText }: { text: string; subText?: string }) => (
  <Card
    borderRaduis="xl"
    className="bg-successMain my-4 flex items-center gap-3 px-4 py-3"
  >
    <CelebrateIcon
      className="h-14	w-20"
      style={subText ? { alignSelf: 'baseline' } : {}}
    />
    <div>
      <Typography
        type="body"
        weight="normal"
        lineHeight="snug"
        color="white"
        text={text}
      />
      {subText && (
        <Typography
          className="mt-2"
          type="body"
          weight="normal"
          lineHeight="snug"
          color="white"
          text={subText}
        />
      )}
    </div>
  </Card>
);

export const VisitList: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const appDispatch = useAppDispatch();

  const calendarAddEvent = useCalendarAddEvent();

  const user = useSelector(userSelectors.getUser);
  const visitStatus = useSelector(visitSelectors.getVisitStatus);

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_VISIT_STATUS
  );

  const { isOnline } = useOnlineStatus();

  const startDate = `${getWeekDate('monday').getDate()} ${getWeekDate(
    'monday'
  ).toLocaleString('default', { month: 'long' })}`;
  const endDate = `${getWeekDate('friday').getDate()} ${getWeekDate(
    'friday'
  ).toLocaleString('default', { month: 'long' })}`;

  const navigate = useCallback(
    (location) => () => {
      history.push(location);
    },
    [history]
  );

  useLayoutEffect(() => {
    if (user?.id && isOnline) {
      appDispatch(
        visitThunkActions.getHealthCareWorkerVisitStatus({ userId: user?.id })
      ).unwrap();
    }
  }, [appDispatch, isOnline, user?.id]);

  const renderContent = useMemo(
    () => (
      <>
        <div className="mb-1 flex items-center gap-3">
          <RoundIcon imageUrl={Pregnant} backgroundColor="tertiary" />
          <Typography
            type="h4"
            weight="bold"
            lineHeight="snug"
            color="textMid"
            text="Pregnancy visits"
          />
        </div>
        {!visitStatus?.motherOverDueVisits && !visitStatus?.motherDueVisits ? (
          <SuccessCard text="All your pregnancy visits are up to date, no visits due this week!" />
        ) : (
          <>
            {!!visitStatus.motherOverDueVisits && (
              <Typography
                type="body"
                weight="normal"
                color="alertDark"
                fontSize="16"
                text={`${visitStatus.motherOverDueVisits} overdue ${
                  Number(visitStatus.motherOverDueVisits) > 1
                    ? 'visits'
                    : 'visit'
                }`}
              />
            )}
            <Typography
              type="body"
              weight="skinny"
              color="black"
              fontSize="16"
              text={`${visitStatus.motherDueVisits} ${
                Number(visitStatus.motherDueVisits) > 1 ? 'visits' : 'visit'
              } due this week`}
            />
          </>
        )}
        <Button
          text={`See all pregnancy visits`}
          icon="EyeIcon"
          type="outlined"
          color="primary"
          textColor="primary"
          className="mt-3 h-8 w-56 rounded-lg"
          iconPosition="start"
          onClick={navigate(ROUTES.CLIENTS.VISIT_TAB.PREGNANCY_VISITS)}
        />
        <Divider className="p-4" dividerType="dashed" />
        <div className="mb-1 flex items-center gap-3">
          <RoundIcon imageUrl={Infant} backgroundColor="secondary" />
          <Typography
            type="h4"
            weight="bold"
            lineHeight="snug"
            color="textMid"
            text="Child visits"
          />
        </div>
        {!visitStatus?.childDueVisits ? (
          <SuccessCard text="All your child visits are up to date, no visits due this week!" />
        ) : (
          <Typography
            type="body"
            weight="skinny"
            color="black"
            fontSize="16"
            text={`${visitStatus.childDueVisits} ${
              Number(visitStatus.childDueVisits) > 1 ? 'visits' : 'visit'
            } due this week`}
          />
        )}
        <Button
          text={`See all child visits`}
          icon="EyeIcon"
          type="outlined"
          color="primary"
          textColor="primary"
          className="mt-3 h-8 w-56 rounded-lg"
          iconPosition="start"
          onClick={navigate(ROUTES.CLIENTS.VISIT_TAB.CHILD_VISITS)}
        />
      </>
    ),
    [navigate, visitStatus]
  );

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

  const onBookVisit = () => {
    calendarAddEvent({
      event: {},
    });
  };

  return (
    <div
      className="flex flex-col p-4"
      style={{ height: height - HEADER_HEIGHT }}
    >
      <Typography
        type="h2"
        weight="bold"
        lineHeight="snug"
        text="Your visits"
      />
      <Typography
        type="h4"
        weight="bold"
        lineHeight="snug"
        color="textMid"
        text={`${startDate} to ${endDate}`}
      />
      <Divider className="p-4" dividerType="dashed" />
      {!visitStatus?.childDueVisits &&
      !visitStatus?.motherDueVisits &&
      !visitStatus?.motherOverDueVisits ? (
        <SuccessCard
          text="All your visits are up to date, no visits due this week!"
          subText="Stay up to date by booking your next visit"
        />
      ) : (
        renderContent
      )}
      <div className="flex h-full flex-col justify-end">
        <Button
          text="Start a visit"
          icon="HomeIcon"
          type="filled"
          color="primary"
          textColor="white"
          className="my-4 w-full"
          iconPosition="start"
          onClick={navigate(ROUTES.CLIENTS.VISIT_TAB.START_VISIT)}
        />
        <Button
          text="Book a visit"
          icon="CalendarIcon"
          type="outlined"
          color="primary"
          textColor="primary"
          className="w-full"
          iconPosition="start"
          onClick={onBookVisit}
        />
      </div>
    </div>
  );
};
