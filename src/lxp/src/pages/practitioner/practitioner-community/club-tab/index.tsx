import { Tag } from '@/components/tag';
import {
  Alert,
  Button,
  DialogPosition,
  LoadingSpinner,
  MenuListDataItem,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClubActivities,
  LeagueType,
  MAX_MEMBERS_IN_CLUB,
  MIN_MEMBERS_IN_CLUB,
} from '@/constants/club';
import PositiveEmoticon from '@/assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useDialog, usePrevious } from '@ecdlink/core';
import { AddEventOrMeetingDialog } from './0-components/add-event-or-meeting-dialog';
import familyIcon from '@/assets/icon/family.svg';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import partnershipIcon from '@/assets/icon/partnership.svg';
import { ClubActions } from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { getClubForPractitionerSelector } from '@/store/club/club.selectors';
import { isCurrentPointsAtLeast80PercentOfTotal } from '@/pages/community/clubs-tab/club/individual-club-view';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { userSelectors } from '@/store/user';
import { coachSelectors } from '@/store/coach';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { clubSelectors, clubThunkActions } from '@/store/club';
import { getTermNumberForCurrentMonth, shouldShowPoints } from '@/utils/club';
import { OfflineAlert } from '@/components/offline-alert';
import { SupportRoleAlert } from './0-components/support-role-alert';
import { getAllNotifications } from '@/store/notifications/notifications.selectors';
import { notificationTagConfig } from '@/constants/notifications';
import { PractitionerCommunityRouteState } from '../index.types';
import { CaregiverMeeting } from '@/pages/community/clubs-tab/club/club-points/activities/0-components/caregiver-meeting';
import { Notification } from '@/store/notifications';

export const ClubTab: React.FC = () => {
  const club = useSelector(getClubForPractitionerSelector);
  const user = useSelector(userSelectors.getUser);
  const coach = useSelector(coachSelectors.getCoach);

  const [caregiverMeetingNotification, setCaregiverMeetingNotification] =
    useState<Notification | undefined>();

  const previousClub = usePrevious(club);

  const clubId = club?.id ?? '';

  const detailsMeetRegular = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );
  const detailsHostFamily = useSelector(
    clubSelectors.getActivityHostFamilyDetailsSelector(clubId)
  );
  const notifications = useSelector(getAllNotifications);
  const clubRankingPercentage = useSelector(
    clubSelectors.getClubRankingPercentageSelector(clubId)
  );

  const history = useHistory();

  const dialog = useDialog();

  const appDispatch = useAppDispatch();

  const { isOnline } = useOnlineStatus();

  const { isLoading: isLoadingClub } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUB_FOR_USER
  );
  const { isLoading: isLoadingMeetRegular } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  );
  const { isLoading: isLoadingHostFamily } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_HOST_FAMILY_DETAILS
  );

  const isLoading =
    isLoadingClub || isLoadingMeetRegular || isLoadingHostFamily;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const addedMeetingRegularThisMonth = detailsMeetRegular?.pastMeetings?.some(
    (meeting) =>
      new Date(meeting?.meetingDate).getMonth() === currentMonth &&
      new Date(meeting?.meetingDate).getFullYear() === currentYear
  );

  const addedFamilyDayThisQuarter = getTermNumberForCurrentMonth()
    ? detailsHostFamily?.terms
        ?.find((term) => term?.termNr === getTermNumberForCurrentMonth())
        ?.documentStatus?.toLocaleLowerCase() !== 'not completed'
    : false;

  const isClubInALeague = !!club?.league;
  const totalMembers = club?.clubMembers?.length ?? 0;
  const isPurpleLeague = club?.league?.leagueTypeName === LeagueType.Purple;
  const isLeader = club?.clubLeader?.userId === user?.id;
  const isLeaderRequest = notifications?.some((notification) =>
    notification?.message?.cta?.includes(
      notificationTagConfig.AcceptAgreement?.cta!
    )
  );
  const isSupportRole = club?.clubSupport?.userId === user?.id;
  const isToShowPointsScreen = shouldShowPoints();
  const isTop25Percent =
    (club?.leagueRanking && club?.leagueRanking <= 3) ||
    (clubRankingPercentage && clubRankingPercentage <= 25);

  const termNumber = getTermNumberForCurrentMonth();

  // From EC-1515
  //////////////////////////////////////////////
  const isScenario1 =
    !addedMeetingRegularThisMonth && (addedFamilyDayThisQuarter || !termNumber);
  const isScenario2 =
    addedMeetingRegularThisMonth && !addedFamilyDayThisQuarter && termNumber;
  const isScenario3 =
    !addedMeetingRegularThisMonth && !addedFamilyDayThisQuarter && termNumber;
  //////////////////////////////////////////////

  const onAddMeetingOrEvent = () => {
    if (isScenario1) {
      return history.push(
        ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING.ROOT
      );
    }

    if (isScenario2) {
      return history.push(
        ROUTES.PRACTITIONER.COMMUNITY.CLUB.FAMILY_DAY_EVENT.ADD_EVENT
      );
    }

    if (isScenario3) {
      return dialog({
        position: DialogPosition.Middle,
        blocking: false,
        render: (onClose) => {
          return <AddEventOrMeetingDialog onClose={onClose} />;
        },
      });
    }

    return;
  };

  const showSupportRoleAlert = useCallback(() => {
    if (
      isSupportRole &&
      club?.clubSupport?.isNewInSupportRole &&
      !previousClub
    ) {
      return dialog({
        position: DialogPosition.Middle,
        blocking: true,
        render: (onClose) => {
          return (
            <SupportRoleAlert
              practitionerId={club?.clubSupport?.practitionerId ?? ''}
              onClose={onClose}
            />
          );
        },
      });
    }
  }, [
    club?.clubSupport?.isNewInSupportRole,
    club?.clubSupport?.practitionerId,
    dialog,
    isSupportRole,
    previousClub,
  ]);

  useEffect(() => {
    showSupportRoleAlert();
  }, [showSupportRoleAlert]);

  useEffect(() => {
    if (isOnline && (isLeader || isSupportRole)) {
      appDispatch(
        clubThunkActions.getActivityMeetRegularDetails({
          forceReload: false,
          args: {
            clubId,
            month: 0,
            year: currentYear,
          },
        })
      );
      appDispatch(clubThunkActions.getActivityHostFamilyDetails({ clubId }));
    }
  }, [clubId, currentYear, isLeader, isOnline, isSupportRole]);

  const coachItem: UserAlertListDataItem = {
    title: `${coach?.user?.firstName} ${coach?.user?.surname}`,
    titleStyle: 'text-textDark',
    profileDataUrl: '',
    profileText:
      (coach?.user?.firstName?.charAt(0) || '') +
      (coach?.user?.surname?.charAt(0) || ''),
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.COACH.replace(
          ':clubId',
          clubId
        ).replace(':coachId', coach?.user?.id ?? '')
      );
    },
  };

  const leader: UserAlertListDataItem = {
    title: `${club?.clubLeader?.firstName ?? ''} ${
      club?.clubLeader?.surname ?? ''
    }`,
    titleStyle: 'text-textDark',
    profileDataUrl: club?.clubLeader?.profileImageUrl ?? '',
    profileText: `${club?.clubLeader?.firstName ?? ''} ${
      club?.clubLeader?.surname ?? ''
    }`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
          ':clubId',
          clubId
        ).replace(':leaderId', club?.clubLeader?.practitionerId ?? '')
      );
    },
  };

  const clubSupportRole: UserAlertListDataItem = {
    title: `${club?.clubSupport?.firstName ?? ''} ${
      club?.clubSupport?.surname ?? ''
    }`,
    titleStyle: 'text-textDark',
    profileDataUrl: '',
    profileText:
      (club?.clubSupport?.firstName?.[0] || '') +
      (club?.clubSupport?.surname?.[0] || ''),
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.SUPPORT_ROLE.replace(
          ':clubId',
          clubId
        ).replace(':supportRoleId', club?.clubSupport?.userId ?? '')
      );
    },
  };

  const leaderAlert = useMemo(() => {
    if (isLeaderRequest) {
      return (
        <Alert
          className="mt-5"
          title={`Accept the club leader agreement!`}
          type="warning"
          list={[
            `Your coach selected you for the ${club?.name} club leader role.`,
            'If you do not want to accept the agreement, please contact your coach.',
          ]}
          button={
            <Button
              type="filled"
              color="primary"
              textColor="white"
              icon="ClipboardCheckIcon"
              text="Accept agreement"
              onClick={() =>
                history.push(
                  ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE
                )
              }
            />
          }
        />
      );
    }

    if (isLeader) {
      return (
        <Alert
          customIcon={
            <div className="h-12 w-14">
              <img src={PositiveEmoticon} alt="positive emoticon" />
            </div>
          }
          className="mt-5"
          title={`You are the club leader for ${new Date().getFullYear()}!`}
          type="successLight"
        />
      );
    }

    return <></>;
  }, [club?.name, history, isLeader, isLeaderRequest]);

  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: 'in the league',
      titleStyle: 'text-textDark',
      onActionClick: () => {
        history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT, {
          activeTabIndex: 1,
        } as PractitionerCommunityRouteState);
      },
      customIcon: (
        <div className="relative mr-4 flex h-11 w-11 items-center justify-center">
          <Badge
            className="absolute z-0 h-auto w-auto"
            fill={`var(--${isTop25Percent ? 'successMain' : 'secondary'})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(club?.leagueRanking ?? 0)}
          />
        </div>
      ),
      backgroundColor: isTop25Percent ? 'successBg' : 'infoBb',
    }),
    [club?.leagueRanking, history, isTop25Percent]
  );

  const activities: MenuListDataItem[] = [
    {
      title: ClubActivities.MeetRegularly,
      menuIconUrl: partnershipIcon,
      route: ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(!isPurpleLeague
      ? [
          {
            title: ClubActivities.BeCreative,
            menuIconUrl: paintPaletteIcon,
            route: ROUTES.COMMUNITY.CLUB.POINTS.BE_CREATIVE.replace(
              ':clubId',
              clubId
            ),
          },
        ]
      : []),
    ...(isPurpleLeague
      ? [
          {
            title: ClubActivities.CaptureChildAttendance,
            menuIcon: 'ClipboardCheckIcon',
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.CAPTURE_CHILD_ATTENDANCE.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: ClubActivities.HostFamilyDays,
      menuIconUrl: familyIcon,
      route: ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(isPurpleLeague
      ? [
          {
            title: ClubActivities.CompleteChildProgressReports,
            menuIcon: 'DocumentReportIcon',
            route:
              ROUTES.COMMUNITY.CLUB.POINTS.COMPLETE_CHILD_PROGRESS_REPORTS.replace(
                ':clubId',
                clubId
              ),
          },
        ]
      : []),
    {
      title: ClubActivities.LeaveNoOneBehind,
      menuIconUrl: inclusiveIcon,
      route: ROUTES.COMMUNITY.CLUB.POINTS.LEAVE_NO_ONE_BEHIND.replace(
        ':clubId',
        clubId
      ),
    },
  ].map((item) => ({
    ...item,
    ...(item.menuIconUrl && { menuIconUrl: item.menuIconUrl }),
    ...(item.menuIcon && { menuIcon: item.menuIcon }),
    titleStyle: 'text-textDark whitespace-normal',
    iconBackgroundColor: 'tertiary',
    showIcon: true,
    onActionClick: () => history.push(item.route),
  }));

  useEffect(() => {
    if (notifications.length > 0 && isPurpleLeague) {
      const notification = notifications?.find(
        (notification) =>
          notification?.isNew &&
          notification?.message?.title?.includes(
            "Well done, you've created progress reports for all children!"
          )
      );

      setCaregiverMeetingNotification(notification);
    }
  }, [appDispatch, isPurpleLeague, notifications]);

  const renderLeagueContent = useMemo(() => {
    if (isClubInALeague && isToShowPointsScreen) {
      return (
        <div className="mt-7 mb-5">
          <Typography
            className="mb-2"
            type="h3"
            text="League position & points"
          />
          {isOnline ? (
            <>
              <StackedList
                isFullHeight={false}
                type={'MenuList' as StackedListType}
                listItems={[leagueCard]}
              />
              <ScoreCard
                className="mt-2"
                mainText={String(club?.pointsTotal ?? 0)}
                hint="points"
                currentPoints={club?.pointsTotal || 18}
                maxPoints={club?.maxPointsTotal ?? 0}
                barBgColour="uiLight"
                barColour={
                  isCurrentPointsAtLeast80PercentOfTotal(
                    club?.pointsTotal || 0,
                    club?.maxPointsTotal || 0
                  )
                    ? 'successMain'
                    : 'secondary'
                }
                bgColour="uiBg"
                textColour="black"
                onClick={() =>
                  history.push(
                    ROUTES.COMMUNITY.CLUB.POINTS.ROOT.replace(':clubId', clubId)
                  )
                }
              />
            </>
          ) : (
            <OfflineAlert />
          )}
        </div>
      );
    }

    return <></>;
  }, [
    isClubInALeague,
    isToShowPointsScreen,
    isOnline,
    leagueCard,
    club?.pointsTotal,
    club?.maxPointsTotal,
    history,
    clubId,
  ]);

  const renderActivitiesContent = useMemo(() => {
    if (isClubInALeague) return <></>;

    return (
      <div className="mt-7 mb-5">
        <Typography className="mb-2" type="h3" text="Activities" />
        {isOnline ? (
          <StackedList
            className="flex flex-col gap-2"
            type={'MenuList' as StackedListType}
            listItems={activities}
          />
        ) : (
          <OfflineAlert />
        )}
      </div>
    );
  }, [activities, isClubInALeague, isOnline]);

  return (
    <div className="h-full overflow-auto p-4 pt-6">
      {isLoading ? (
        <LoadingSpinner
          className="mt-4"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <div className="flex h-full flex-col">
          <Typography type="h2" text={club?.name ?? ''} />
          <div className="mt-4 flex gap-2">
            {isPurpleLeague && (
              <Tag icon="StarIcon" title="Purple" color="primary" />
            )}
            <Tag
              title={String(totalMembers)}
              subTitle="members"
              color={
                !!totalMembers &&
                totalMembers >= MIN_MEMBERS_IN_CLUB &&
                totalMembers <= MAX_MEMBERS_IN_CLUB
                  ? 'successMain'
                  : 'errorMain'
              }
            />
          </div>
          {leaderAlert}
          {renderLeagueContent}
          {!!coach && (
            <>
              <Typography className="my-2" type="h3" text="Coach" />
              <div>
                <StackedList
                  isFullHeight={false}
                  type={'UserAlertList' as StackedListType}
                  listItems={[coachItem]}
                />
              </div>
            </>
          )}
          {!!club?.clubLeader?.userId && !isLeader && (
            <>
              <Typography className="mb-2 mt-6" type="h3" text="Club leader" />
              <div>
                <StackedList
                  isFullHeight={false}
                  type={'UserAlertList' as StackedListType}
                  listItems={[leader]}
                />
              </div>
            </>
          )}
          {!!club?.clubSupport?.userId && (
            <div>
              <div className="mb-2 mt-6 flex items-center justify-between">
                <Typography type="h3" text="Club support role" />
                {(isLeader || isSupportRole) && (
                  <Button
                    type="outlined"
                    color="primary"
                    textColor="primary"
                    text="Change"
                    icon="RefreshIcon"
                    onClick={() =>
                      history.push(
                        ROUTES.PRACTITIONER.COMMUNITY.CLUB.SUPPORT_ROLE.EDIT
                      )
                    }
                  />
                )}
              </div>
              <Typography
                className="mb-4"
                type="body"
                color="textMid"
                text="This club member can take meeting attendance & add events."
              />
              <StackedList
                isFullHeight={false}
                type={'UserAlertList' as StackedListType}
                listItems={[clubSupportRole]}
              />
            </div>
          )}
          {renderActivitiesContent}
          <div className={`mt-auto flex flex-col py-4`}>
            {(isLeader || isSupportRole) &&
              (isScenario1 || isScenario2 || isScenario3) && (
                <Button
                  icon="PlusCircleIcon"
                  className="mb-4 mt-8"
                  type="filled"
                  textColor="white"
                  color="primary"
                  text="Add a meeting or event"
                  onClick={onAddMeetingOrEvent}
                />
              )}
            <Button
              icon="UserGroupIcon"
              type={isLeader || isSupportRole ? 'outlined' : 'filled'}
              textColor={isLeader || isSupportRole ? 'primary' : 'white'}
              color="primary"
              text="See club members"
              onClick={() =>
                history.push(
                  ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(':clubId', clubId)
                )
              }
            />
          </div>
        </div>
      )}

      {!!caregiverMeetingNotification && (
        <CaregiverMeeting
          isToShowWellDoneMessage={true}
          onClose={() => setCaregiverMeetingNotification(undefined)}
        />
      )}
    </div>
  );
};
