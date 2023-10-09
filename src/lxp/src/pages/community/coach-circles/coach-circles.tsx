import { coachSelectors, coachThunkActions } from '@/store/coach';
import { getQuarterMonths } from '@/utils/common/date.utils';
import { getAvatarColor } from '@ecdlink/core';
import {
  Alert,
  AlertSeverityType,
  Button,
  Card,
  Dialog,
  DialogPosition,
  StackedList,
  Typography,
  UserAlertListDataItem,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import {
  format,
  getQuarter,
  getYear,
  lastDayOfQuarter,
  startOfQuarter,
} from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CustomSuccessCard } from '@/components/custom-success-card/custom-success-card';
import { AddCoachingCircle } from './components/add-coaching-circle/add-coaching-circle';
import { CircleTopics } from './components/circle-topics/circle-topics';
import { CheckCircleIcon, XIcon } from '@heroicons/react/solid';
import { useAppDispatch } from '@/store';
import { userSelectors } from '@/store/user';
import { useLocation } from 'react-router';
import { CoachCircleRouteState } from './coach-circles.types';

export const CoachCircles = () => {
  const { state } = useLocation<CoachCircleRouteState>();
  const dispatch = useAppDispatch();
  const date = new Date();
  const quarter = getQuarter(date);
  const year = getYear(date);
  const quarterMonths = getQuarterMonths(date);
  const quarterStartDate = startOfQuarter(new Date());
  const user = useSelector(userSelectors.getUser);
  const quarterLastDayDate = lastDayOfQuarter(new Date());
  const quarterLastDay = format(lastDayOfQuarter(date), 'd MMM');
  const coachCircleData = useSelector(coachSelectors.getCoachCircles);
  const clubsWithoutMeetings = coachCircleData?.clubsWithNoLinkedMeetings;
  const clubsWithMeetings = coachCircleData?.clubsWithLinkedMeetings;
  const [clubsWithoutMeetingsList, setClubsWithoutMeetingsList] =
    useState<UserAlertListDataItem[]>();
  const [clubsWithMeetingsList, setClubsWithMeetingsList] =
    useState<UserAlertListDataItem[]>();
  const noSubmittedAnyClub = useMemo(
    () => clubsWithMeetings?.length === 0,
    [clubsWithMeetings?.length]
  );
  const submittedAllClubs = useMemo(
    () =>
      clubsWithMeetings &&
      clubsWithoutMeetings?.length === 0 &&
      clubsWithMeetings?.length > 0,
    [clubsWithMeetings, clubsWithoutMeetings?.length]
  );
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [showAddCircles, setShowAddCircles] = useState(false);
  const [showCircleTopics, setShowCircleTopics] = useState(false);
  const [showSuccessCircleMeetingAdded, setShowSuccessCircleMeetingAdded] =
    useState(false);

  const handleNotificiationsItems = useCallback(() => {
    const noMeetingsNotification: UserAlertListDataItem[] = [];
    const withMeetingsNotification: UserAlertListDataItem[] = [];

    if (clubsWithoutMeetings) {
      clubsWithoutMeetings?.map((item) => {
        return noMeetingsNotification.push({
          id: item.id,
          title: item?.name,
          subTitle: item?.cCMeetingStatus || '',
          alertSeverity:
            (item?.cCMeetingStatusColor.toLowerCase() as AlertSeverityType) ||
            'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => setShowAddCircles(true),
          hideAvatar: true,
        });
      });
    }

    if (clubsWithMeetings) {
      clubsWithMeetings?.map((item) => {
        const splittedString = item?.cCMeetingStatus?.split(': ');
        const dateFormatted = new Date(splittedString[1] || new Date());

        return withMeetingsNotification.push({
          id: item.id,
          title: item?.name,
          subTitle: `${splittedString[0]}: ${format(
            dateFormatted,
            'd MMM yyyy'
          )}`,
          alertSeverity:
            (item?.cCMeetingStatusColor.toLowerCase() as AlertSeverityType) ||
            'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => {},
          breaksSubtitleLine: true,
          noClick: true,
          successColor: true,
          hideAvatar: true,
        });
      });
    }
    setClubsWithoutMeetingsList(noMeetingsNotification);
    setClubsWithMeetingsList(withMeetingsNotification);
  }, [clubsWithMeetings, clubsWithoutMeetings]);

  useEffect(() => {
    handleNotificiationsItems();
  }, [handleNotificiationsItems]);

  useEffect(() => {
    if (submittedAllClubs) {
      setShowSuccessCard(true);
    }
  }, [submittedAllClubs]);

  useEffect(() => {
    if (showSuccessCircleMeetingAdded) {
      setTimeout(() => {
        setShowSuccessCircleMeetingAdded(false);
      }, 4000);
    }
  }, [showSuccessCircleMeetingAdded]);

  useEffect(() => {
    dispatch(
      coachThunkActions.getAllCoachingCircleClubsForCoach({
        coachId: user?.id || '',
        startDate: quarterStartDate,
        endDate: quarterLastDayDate,
      })
    ).unwrap();
    if (state.addCoachCircle === true) {
      setShowAddCircles(true);
    }
  }, []);

  return (
    <div className="mb-4 h-screen p-4">
      {showSuccessCard && (
        <CustomSuccessCard
          className="my-4"
          customIcon={<CelebrateIcon className="h-14	w-14" />}
          text={`Well done, you held coaching circles for every club this month!`}
          color="successMain"
          onClose={() => setShowSuccessCard(false)}
        />
      )}
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
      {clubsWithoutMeetingsList && clubsWithoutMeetingsList?.length > 0 && (
        <div>
          <Typography
            type="body"
            color="textMid"
            text={`Schedule a coaching circle with these clubs before ${quarterLastDay}:`}
            className="pt-4"
          ></Typography>
          <div className="w-fulljustify-center flex py-4">
            <StackedList
              listItems={clubsWithoutMeetingsList || []}
              type={'UserAlertList'}
              className="flex flex-col gap-1"
            ></StackedList>
          </div>
        </div>
      )}
      <Typography
        type="body"
        color="textMid"
        text={`Coaching circles held this quarter:`}
        className="py-2"
      ></Typography>
      <div className="flex w-full justify-center pt-2 pb-48">
        <StackedList
          listItems={clubsWithMeetingsList || []}
          type={'UserAlertList'}
          className="flex flex-col gap-1"
        ></StackedList>
      </div>
      {noSubmittedAnyClub && (
        <Alert
          className="mt-4"
          type="warning"
          title={`You haven’t held any coaching circles this quarter yet!`}
        />
      )}
      <div className="absolute bottom-0 left-0 right-0 max-h-40 bg-white p-4">
        <Button
          onClick={() => setShowAddCircles(true)}
          className="mb-4 w-full rounded-2xl"
          size="small"
          color="primary"
          type="filled"
        >
          {renderIcon('PlusCircleIcon', classNames('h-5 w-5 text-white'))}
          <Typography
            type="h6"
            className="ml-2"
            text="Add a coaching circle"
            color="white"
          />
        </Button>
        <Button
          onClick={() => setShowCircleTopics(true)}
          className="mb-4 w-full rounded-2xl"
          size="small"
          color="primary"
          type="outlined"
        >
          {renderIcon('EyeIcon', classNames('h-5 w-5 text-primary'))}
          <Typography
            type="h6"
            className="ml-2"
            text="See topics"
            color="primary"
          />
        </Button>
        {showSuccessCircleMeetingAdded && (
          <Card
            className={
              'bg-successMain absolute bottom-16 left-0 right-0 mx-4 mt-4 rounded-xl'
            }
          >
            <div className="flex items-center gap-2 p-4">
              <CheckCircleIcon className="h-4 w-4 text-white" />
              <Typography
                type="h4"
                className="ml-2"
                text="Coaching circle added!"
                color="white"
              />
              <XIcon
                className="absolute right-4 h-6 w-6"
                onClick={() => setShowSuccessCircleMeetingAdded(false)}
              />
            </div>
          </Card>
        )}
      </div>
      <Dialog
        visible={showAddCircles}
        stretch={true}
        position={DialogPosition.Full}
      >
        <AddCoachingCircle
          setShowAddCircles={setShowAddCircles}
          setShowSuccessCircleMeetingAdded={setShowSuccessCircleMeetingAdded}
        />
      </Dialog>
      <Dialog
        visible={showCircleTopics}
        stretch={true}
        position={DialogPosition.Full}
      >
        <CircleTopics
          setShowCircleTopics={setShowCircleTopics}
          setShowAddCircles={setShowAddCircles}
        />
      </Dialog>
    </div>
  );
};
