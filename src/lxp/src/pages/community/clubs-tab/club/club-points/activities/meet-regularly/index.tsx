import {
  Alert,
  BannerWrapper,
  Button,
  EmptyPage,
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
import { useEffect, useMemo } from 'react';
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
import { OfflineAlert } from '@/components/offline-alert';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { ActivityMeetRegularDetail, Maybe } from '@ecdlink/graphql';

export const MeetRegularly: React.FC = () => {
  const { clubId } = useParams<ClubsRouteState>();

  const user = useSelector(userSelectors.getUser);
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const details = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );
  const isLeader = club?.clubLeader?.userId === user?.id;
  const isSupportRole = club?.clubSupport?.userId === user?.id;

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

  const isCelebratoryMessage =
    !isCoach &&
    details?.points === ClubActivitiesPointsPerLeague.MeetRegularly.All.max;
  const isToShowPoints = isLeagueStarts && isClubInALeague;

  function populateMissingMonths(
    meetingArray: Maybe<Maybe<ActivityMeetRegularDetail>[]>
  ) {
    const monthsToPopulate = [
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];

    const currentMonth = new Date().getMonth() + 1;
    const monthsToPopulateFrom = monthsToPopulate.filter(
      (month) => Number(month) < currentMonth
    );

    const mutableMeetingArray = [...(meetingArray ?? [])];

    const year = new Date().getFullYear();

    for (const month of monthsToPopulateFrom) {
      // Check if a meeting for the current month already exists in the mutableMeetingArray
      const existingMeeting = mutableMeetingArray?.find((item) => {
        // Extract the month from the item's meetingDate
        const itemMonth = item?.meetingDate.slice(5, 7);

        return itemMonth === month;
      });

      if (!existingMeeting) {
        const date = `${year}-${month}-10T00:00:00.000`;

        mutableMeetingArray?.push({
          meetingAbsentees: [],
          meetingAttendanceColor: 'Error',
          meetingAttendancePerc: -1,
          meetingDate: date,
          meetingNotes: '',
          meetingParticipants: [],
          points: 0,
          clubLeaderContacted: false,
          id: '',
        });
      }
    }

    mutableMeetingArray?.sort((a, b) =>
      a?.meetingDate > b?.meetingDate ? 1 : -1
    );

    return mutableMeetingArray;
  }

  useEffect(() => {
    if (isOnline) {
      appDispatch(
        getActivityMeetRegularDetails({
          forceReload: false,
          args: {
            clubId,
            month: 0,
            year: currentYear,
          },
        })
      );
    }
  }, [clubId, currentYear, isOnline]);

  useEffect(() => {
    if (wasLoading && !isLoading && isRejected) {
      showMessage({ message: error, type: 'error' });
    }
  }, [error, isRejected, showMessage, isLoading, wasLoading]);

  const upcomingMeetings: UserAlertListDataItem[] = useMemo(
    () =>
      details?.upcomingMeetings?.map((item) => {
        const { monthName, formattedDate } = getPointsActivityDateDetails(
          item?.meetingDate ?? ''
        );

        return {
          title: monthName,
          alertSeverity: 'none',
          alertSeverityNoneIcon: 'CalendarIcon',
          alertSeverityNoneColor: 'primary',
          subTitle: `Scheduled: ${formattedDate}`,
          avatarColor: '',
          hideAvatar: true,
          onActionClick:
            isLeader || isSupportRole
              ? () =>
                  history.push(
                    ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING.UPCOMING_MEETING.replace(
                      ':eventId',
                      item?.eventId ?? ''
                    ),
                    { clubId }
                  )
              : undefined,
        };
      }) ?? [],
    [clubId, details?.upcomingMeetings, history, isLeader, isSupportRole]
  );

  const pastMeetings: UserAlertListDataItem[] = useMemo(
    () =>
      [...(populateMissingMonths(details?.pastMeetings ?? []) ?? [])]
        ?.reverse()
        ?.map((item) => {
          const { meetingId, monthName } = getPointsActivityDateDetails(
            item?.meetingDate ?? ''
          );

          return {
            title: monthName,
            subItem: isToShowPoints ? `+ ${item?.points ?? 0}` : '',
            subTitle:
              item?.meetingAttendancePerc !== -1 &&
              item?.meetingAttendancePerc !== undefined
                ? `${Math.round(item?.meetingAttendancePerc)}% attendance`
                : 'No register submitted',
            alertSeverity: getAlertSeverity(item?.meetingAttendanceColor ?? ''),
            titleStyle: 'text-textDark',
            avatarColor: '',
            hideAvatar: true,
            ...(!!item?.meetingAttendancePerc && {
              onActionClick: () =>
                history.push(
                  ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
                    ':meetingId',
                    meetingId!
                  ).replace(':clubId', clubId),
                  { clubId }
                ),
            }),
          };
        }) ?? [],
    [clubId, details?.pastMeetings, history, isToShowPoints]
  );

  const renderContent = useMemo(() => {
    if (!isOnline) {
      return <OfflineAlert />;
    }

    if (!details?.pastMeetings?.length && !details?.upcomingMeetings?.length) {
      return (
        <EmptyPage
          image={AlienImage}
          title="No items to show yet this year. "
          subTitle=""
        />
      );
    }

    return (
      <>
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
        {!!upcomingMeetings.length && (
          <div className="mt-4">
            <Typography className="mb-5" type="h3" text="Upcoming meetings:" />
            <StackedList
              className="flex flex-col gap-2"
              type={'UserAlertList' as StackedListType}
              listItems={upcomingMeetings}
            />
          </div>
        )}
        {!!pastMeetings.length && (
          <div className="mt-4 mb-5">
            <Typography className="mb-5" type="h3" text="Past meetings:" />
            <StackedList
              className="flex flex-col gap-2"
              type={'UserAlertList' as StackedListType}
              listItems={pastMeetings}
            />
          </div>
        )}
        {isToShowPoints && !isCoach && (
          <Alert
            className="mb-4"
            type="info"
            title="How can you help your club earn points?"
            list={
              isLeader
                ? [
                    'Encourage all club members to attend meetings.',
                    'Make sure you schedule meetings at a time that works for everyone.',
                  ]
                : ['Attend all club meetings & encourage others to attend!']
            }
          />
        )}
      </>
    );
  }, [
    isLeader,
    isCoach,
    details?.pastMeetings?.length,
    details?.points,
    details?.upcomingMeetings?.length,
    isCelebratoryMessage,
    isOnline,
    isToShowPoints,
    pastMeetings,
    upcomingMeetings,
  ]);

  return (
    <BannerWrapper
      isLoading={isLoading}
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
            ':helpSection',
            'Meet Regularly'
          )
        )
      }
      renderBorder
    >
      <Header
        imageUrl={partnershipIcon}
        title={formatStringWithFirstLetterCapitalized(activityId)}
        date={new Date()}
      />
      {renderContent}
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
              ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING.ROOT
            )
          }
        />
      )}
      <Button
        className={isLeader || isSupportRole ? 'mt-4' : 'mt-auto'}
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
    </BannerWrapper>
  );
};
