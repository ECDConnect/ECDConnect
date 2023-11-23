import {
  Alert,
  BannerWrapper,
  Button,
  LoadingSpinner,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { ClubsRouteState } from '../../../../index.types';
import ROUTES from '@/routes/routes';
import partnershipIcon from '@/assets/icon/partnership.svg';
import { Header } from '../0-components/header';
import {
  formatStringWithFirstLetterCapitalized,
  useSnackbar,
} from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  getActivityMeetRegularDetails,
} from '@/store/club/club.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  getPointsActivityDateDetails,
  getScoreBarColor,
} from '@/pages/community/clubs-tab/index.filters';
import { getAlertSeverity } from '@/utils/common/string.utils';
import { ClubActivitiesPointsPerLeague } from '@/constants/club';
import { UserTypeEnum } from '@/models/auth/user/UserContext';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const MeetRegularly: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );
  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

  const isCelebratoryMessage =
    details?.points === ClubActivitiesPointsPerLeague.MeetRegularly.All.max;

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  );
  const { showMessage } = useSnackbar();

  const history = useHistory();
  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const activityId = 'meet-regularly';

  const isLeagueStarts = currentMonth >= 3;
  const isClubInALeague = !!club?.league;
  const isCoach = user?.roles?.some(
    (item) => item?.name === UserTypeEnum.Coach
  );

  const isToShowPoints = isLeagueStarts && isClubInALeague;

  const upcomingMeetings: UserAlertListDataItem[] =
    details?.upcomingMeetings?.map((item) => {
      const { meetingId, monthName, formattedDate } =
        getPointsActivityDateDetails(item?.meetingDate ?? '');

      return {
        title: monthName,
        alertSeverity: 'none',
        alertSeverityNoneIcon: 'CalendarIcon',
        alertSeverityNoneColor: 'primary',
        subTitle: `Scheduled: ${formattedDate}`,
        avatarColor: '',
        hideAvatar: true,
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
              ':meetingId',
              meetingId!
            ).replace(':clubId', clubId)
          ),
      };
    }) ?? [];

  const pastMeetings: UserAlertListDataItem[] =
    details?.pastMeetings?.map((item) => {
      const { meetingId, monthName } = getPointsActivityDateDetails(
        item?.meetingDate ?? ''
      );

      return {
        title: monthName,
        subItem: isToShowPoints ? `+ ${item?.points ?? 0}` : '',
        subTitle: item?.meetingAttendancePerc
          ? `${item?.meetingAttendancePerc}% attendance`
          : 'No register submitted',
        alertSeverity: getAlertSeverity(item?.meetingAttendanceColor ?? ''),
        titleStyle: 'text-textDark',
        avatarColor: '',
        hideAvatar: true,
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
              ':meetingId',
              meetingId!
            ).replace(':clubId', clubId)
          ),
      };
    }) ?? [];

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        getActivityMeetRegularDetails({
          clubId,
          month: currentMonth + 1,
          year: currentYear,
        })
      );
    }
  }, [appDispatch, clubId, currentMonth, currentYear, isOnline]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage(error);
    }
  }, [error, isRejected, showMessage, isLoading, wasLoading]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6"
      size="small"
      title={formatStringWithFirstLetterCapitalized(activityId)}
      subTitle={club?.name ?? ''}
      onBack={() => history.goBack()}
      displayOffline={!isOnline}
      displayHelp={isToShowPoints}
      onHelp={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.POINTS.HELP.replace(':clubId', clubId).replace(
            ':activityId',
            activityId
          )
        )
      }
    >
      {isLoading ? (
        <LoadingSpinner
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          <Header
            imageUrl={partnershipIcon}
            title={formatStringWithFirstLetterCapitalized(activityId)}
            date={new Date()}
          />
          {isToShowPoints && (
            <ScoreCard
              className="mt-5"
              mainText={String(details?.points ?? 0)}
              hint="points"
              currentPoints={details?.points || 18}
              maxPoints={ClubActivitiesPointsPerLeague.MeetRegularly.All.max}
              barBgColour="uiLight"
              barColour={getScoreBarColor(
                details?.points ?? 0,
                ClubActivitiesPointsPerLeague.MeetRegularly.All.green,
                ClubActivitiesPointsPerLeague.MeetRegularly.All.amber
              )}
              bgColour="uiBg"
              textColour="black"
            />
          )}
          {isCelebratoryMessage && (
            <Alert
              className="mt-4"
              type="successLight"
              title="Wow, great job!"
              customIcon={<PositiveEmoticon className="w-12" />}
            />
          )}
          {upcomingMeetings.length && (
            <div className="mt-4">
              <Typography
                className="mb-5"
                type="h3"
                text="Upcoming meetings:"
              />
              <StackedList
                className="flex flex-col gap-2"
                type={'UserAlertList' as StackedListType}
                listItems={upcomingMeetings}
              />
            </div>
          )}
          {pastMeetings.length && (
            <div className="mt-4 mb-5">
              <Typography className="mb-5" type="h3" text="Past meetings:" />
              <StackedList
                className="flex flex-col gap-2"
                type={'UserAlertList' as StackedListType}
                listItems={pastMeetings}
              />
            </div>
          )}
          {isToShowPoints && (
            <Alert
              className="mb-4"
              type="info"
              title="How can you help your club earn points?"
              list={[
                'Encourage all club members to attend meetings.',
                'Make sure you schedule meetings at a time that works for everyone.',
              ]}
            />
          )}
          {(isLeader || isSupportRole) && (
            <Button
              className="mt-auto"
              icon="PlusCircleIcon"
              type="filled"
              textColor="white"
              color="primary"
              text="Add a meeting"
              onClick={() =>
                history.push(
                  ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING
                )
              }
            />
          )}
          <Button
            className="mt-4"
            icon="ArrowCircleLeftIcon"
            type="outlined"
            textColor="primary"
            color="primary"
            text="Back to club"
            onClick={() =>
              history.push(
                isCoach
                  ? ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
                  : ROUTES.PRACTITIONER.COMMUNITY.ROOT
              )
            }
          />
        </>
      )}
    </BannerWrapper>
  );
};
