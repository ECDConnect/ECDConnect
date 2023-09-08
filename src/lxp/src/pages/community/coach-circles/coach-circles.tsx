import { coachSelectors } from '@/store/coach';
import { getQuarterMonths } from '@/utils/common/date.utils';
import {
  ClubsLinkedMeetingsDto,
  CoachCirclesDto,
  getAvatarColor,
} from '@ecdlink/core';
import {
  AlertSeverityType,
  StackedList,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { format, getQuarter, getYear, lastDayOfQuarter } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const CoachCircles = () => {
  const date = new Date();
  const quarter = getQuarter(date);
  const year = getYear(date);
  const quarterMonths = getQuarterMonths(date);
  const quarterLastDay = format(lastDayOfQuarter(date), 'd MMM');
  const coachCircleData = useSelector(coachSelectors.getCoachCircles);
  const clubsWithoutMeetings = coachCircleData?.clubsWithNoLinkedMeetings;
  const clubsWithMeetings = coachCircleData?.clubsWithLinkedMeetings;
  console.log({ clubsWithoutMeetings });
  const [clubsWithoutMeetingsList, setClubsWithoutMeetingsList] =
    useState<UserAlertListDataItem[]>();
  const [clubsWithMeetingsList, setClubsWithMeetingsList] =
    useState<UserAlertListDataItem[]>();

  console.log({ coachCircleData });

  const handleNotificiationsItems = useCallback(() => {
    const noMeetingsNotification: UserAlertListDataItem[] = [];
    const withMeetingsNotification: UserAlertListDataItem[] = [];

    if (clubsWithoutMeetings) {
      clubsWithoutMeetings?.map((item) => {
        console.log(item?.cCMeetingStatusColor);
        return noMeetingsNotification.push({
          id: item.id,
          title: item?.name,
          subTitle: item?.cCMeetingStatus || '',
          alertSeverity:
            (item?.cCMeetingStatusColor.toLowerCase() as AlertSeverityType) ||
            'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => {},
        });
      });
    }

    if (clubsWithMeetings) {
      clubsWithMeetings?.map((item) => {
        console.log(item?.cCMeetingStatusColor);
        return withMeetingsNotification.push({
          id: item.id,
          title: item?.name,
          subTitle: item?.cCMeetingStatus || '',
          alertSeverity:
            (item?.cCMeetingStatusColor.toLowerCase() as AlertSeverityType) ||
            'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => {},
        });
      });
    }
    setClubsWithoutMeetingsList(noMeetingsNotification);
    setClubsWithMeetingsList(withMeetingsNotification);
  }, [clubsWithMeetings, clubsWithoutMeetings]);

  useEffect(() => {
    handleNotificiationsItems();
  }, [handleNotificiationsItems]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        color="textDark"
        text={`Coaching circles - Quarter ${quarter}`}
      ></Typography>
      <Typography
        type="body"
        color="textMid"
        text={`${quarterMonths} of ${year}`}
      ></Typography>
      <Typography
        type="body"
        color="textMid"
        text={`Schedule a coaching circle with these clubs before ${quarterLastDay}:`}
        className="pt-4"
      ></Typography>
      <div className="flex w-11/12 justify-center">
        <StackedList
          listItems={clubsWithoutMeetingsList || []}
          type={'UserAlertList'}
        ></StackedList>
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`Coaching circles held this quarter:`}
        className="pt-4"
      ></Typography>
      <div className="flex w-11/12 justify-center">
        <StackedList
          listItems={clubsWithMeetingsList || []}
          type={'UserAlertList'}
        ></StackedList>
      </div>
    </div>
  );
};
