import { coachSelectors } from '@/store/coach';
import { getQuarterMonths } from '@/utils/common/date.utils';
import { getAvatarColor } from '@ecdlink/core';
import {
  Alert,
  AlertSeverityType,
  Button,
  Dialog,
  DialogPosition,
  StackedList,
  Typography,
  UserAlertListDataItem,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { format, getQuarter, getYear, lastDayOfQuarter } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CustomSuccessCard } from '@/components/custom-success-card/custom-success-card';
import { AddCoachingCircle } from './components/add-coaching-circle/add-coaching-circle';

export const CoachCircles = () => {
  const date = new Date();
  const quarter = getQuarter(date);
  const year = getYear(date);
  const quarterMonths = getQuarterMonths(date);
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

  console.log({ coachCircleData });
  console.log({ showAddCircles });

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
          onActionClick: () => {},
        });
      });
    }

    if (clubsWithMeetings) {
      clubsWithMeetings?.map((item) => {
        return withMeetingsNotification.push({
          id: item.id,
          title: item?.name,
          subTitle: item?.cCMeetingStatus || '',
          alertSeverity:
            (item?.cCMeetingStatusColor.toLowerCase() as AlertSeverityType) ||
            'error',
          avatarColor: getAvatarColor() || '',
          onActionClick: () => {},
          breaksSubtitleLine: true,
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

  return (
    <div className="mb-4 p-4">
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
        ></StackedList>
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`Coaching circles held this quarter:`}
        className="py-4"
      ></Typography>
      <div className="flex w-full justify-center pt-2">
        <StackedList
          listItems={clubsWithMeetingsList || []}
          type={'UserAlertList'}
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
          onClick={() => {}}
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
      </div>
      <Dialog
        visible={showAddCircles}
        stretch={true}
        position={DialogPosition.Full}
      >
        <AddCoachingCircle setShowAddCircles={setShowAddCircles} />
      </Dialog>
    </div>
  );
};
