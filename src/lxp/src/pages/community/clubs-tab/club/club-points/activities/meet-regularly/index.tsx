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
import { Roles } from '@/constants/roles';
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
import { ClubActivitiesMaxPointsPerLeague, LeagueType } from '@/constants/club';
import { ReactComponent as PositiveEmoticon } from '@/assets/positive-green-emoticon.svg';

export const MeetRegularly: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );
  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

  const isClubInNewStarts =
    club?.league?.leagueTypeName === LeagueType.NewStars;
  const isClubInRisingStars =
    club?.league?.leagueTypeName === LeagueType.RisingStars;

  const isCelebratoryMessage =
    (isClubInRisingStars &&
      details?.points ===
        ClubActivitiesMaxPointsPerLeague.MeetRegularly.RisingStars) ||
    (isClubInNewStarts &&
      details?.points ===
        ClubActivitiesMaxPointsPerLeague.MeetRegularly.NewStars);

  const { isLoading, wasLoading, isRejected, error } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  );
  const { showMessage } = useSnackbar();

  const history = useHistory();
  const appDispatch = useAppDispatch();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const activityId = 'meet-regularly';
  const isPractitioner = user?.roles?.some(
    (item) => item?.name === Roles.PRACTITIONER
  );

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
        subItem: `+ ${item?.points ?? 0}`,
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
    appDispatch(
      getActivityMeetRegularDetails({
        clubId,
        month: currentMonth,
        year: currentYear,
      })
    );
  }, [appDispatch, clubId, currentMonth, currentYear]);

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
      displayHelp
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
          {/* EC-1909 - Suppress ticket */}
          {/* <ScoreCard
            className="mt-5"
            mainText={String(details?.points ?? 0)}
            hint="points"
            currentPoints={details?.points || 18}
            maxPoints={800}
            barBgColour="uiLight"
            barColour={getScoreBarColor(details?.points ?? 0, 600, 599)}
            bgColour="uiBg"
            textColour="black"
          /> */}
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
                isPractitioner
                  ? ROUTES.PRACTITIONER.COMMUNITY.ROOT
                  : ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId)
              )
            }
          />
        </>
      )}
    </BannerWrapper>
  );
};
