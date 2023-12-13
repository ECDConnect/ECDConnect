import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  EmptyPage,
  LoadingSpinner,
  MenuListDataItem,
  ScoreCard,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useCallback, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import familyIcon from '@/assets/icon/family.svg';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import partnershipIcon from '@/assets/icon/partnership.svg';
import AlienImage from '@/assets/ECD_Connect_alien.svg';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import {
  ClubActivities,
  LeagueType,
  MAX_MEMBERS_IN_CLUB,
  MIN_MEMBERS_IN_CLUB,
  daysToAcceptBeingLeader,
} from '@/constants/club';
import { addDays, differenceInMonths } from 'date-fns';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';
import { getScoreBarColor } from '../../index.filters';
import { shouldShowPoints } from '@/utils/club';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineAlert } from '@/components/offline-alert';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { IssuesAndTasks } from './issues-and-tasks';

export function isCurrentPointsAtLeast80PercentOfTotal(
  currentPoints: number,
  totalPoints: number
): boolean {
  const targetPercentage = 0.8; // 80%
  const targetPoints = totalPoints * targetPercentage;
  return currentPoints >= targetPoints;
}

export const Club: React.FC = () => {
  const [currentIssuesAndTasks, setCurrentIssuesAndTasks] =
    useState<MenuListDataItem[]>();

  const history = useHistory();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_CLUBS_FOR_COACH
  );

  const { clubId } = useParams<ClubsRouteState>();

  const { isOnline } = useOnlineStatus();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(clubId)
  );

  const dialog = useDialog();

  const totalMembers = club?.clubMembers?.length || 0;
  const monthsSinceCurrentLeaderAccepted = differenceInMonths(
    new Date(),
    new Date(currentLeader?.dateAccepted ?? '')
  );
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDateNextLeader = nextLeader
    ? addDays(
        new Date(nextLeader.dateAssigned),
        daysToAcceptBeingLeader
      ).setHours(0, 0, 0, 0)
    : undefined;

  const isDueDateNextLeaderTodayOrFuture =
    !!dueDateNextLeader && dueDateNextLeader >= today;
  const isLeaderAcceptedOverSixMonths = monthsSinceCurrentLeaderAccepted > 6;
  const isClubInALeague = !!club?.league?.id;
  const isTop25Percent = club?.leagueRanking && club?.leagueRanking <= 3;
  const hasLeader = !!currentLeader;
  const isLeaderRequestSent = !!nextLeader && isDueDateNextLeaderTodayOrFuture;
  const isPurpleLeague = club?.league?.leagueTypeName === LeagueType.Purple;

  const onOffline = useCallback(() => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <OnlineOnlyModal onSubmit={onClose} />;
      },
    });
  }, [dialog]);

  const onOnlineNavigation = useCallback(
    (route: string) => {
      if (isOnline) {
        return history.push(route);
      }

      return onOffline();
    },
    [history, isOnline, onOffline]
  );

  const leader: UserAlertListDataItem = {
    title: `${currentLeader?.firstName ?? ''} ${currentLeader?.surname ?? ''}`,
    titleStyle: 'text-textDark',
    profileDataUrl: currentLeader?.profileImageUrl ?? '',
    profileText: `${currentLeader?.firstName ?? ''} ${
      currentLeader?.surname ?? ''
    }`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
          ':clubId',
          clubId
        ).replace(':leaderId', currentLeader?.practitionerId ?? '')
      ),
  };

  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: club?.league?.name ?? '',
      titleStyle: 'text-textDark',
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
            text={String(club?.leagueRanking || 0)}
          />
        </div>
      ),
      backgroundColor: isTop25Percent ? 'successBg' : 'infoBb',
    }),
    [isTop25Percent, club]
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

  const isToShowPointsScreen = shouldShowPoints();

  const renderLeagueContent = useMemo(() => {
    if (isClubInALeague) {
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
              {isToShowPointsScreen && (
                <ScoreCard
                  className="mt-5"
                  mainText={String(club?.pointsTotal || 0)}
                  hint="points"
                  currentPoints={club?.pointsTotal}
                  maxPoints={club?.maxPointsTotal}
                  barBgColour="uiLight"
                  barColour={getScoreBarColor(
                    club?.pointsTotal ?? 0,
                    1500,
                    1499
                  )}
                  bgColour="uiBg"
                  textColour="black"
                  onClick={() =>
                    history.push(
                      ROUTES.COMMUNITY.CLUB.POINTS.ROOT.replace(
                        ':clubId',
                        clubId
                      )
                    )
                  }
                />
              )}
            </>
          ) : (
            <OfflineAlert />
          )}
        </div>
      );
    }

    return (
      <Alert
        className="mt-5 mb-7"
        type="info"
        title="This club is not in a league."
      />
    );
  }, [
    isOnline,
    club?.maxPointsTotal,
    club?.pointsTotal,
    clubId,
    history,
    isClubInALeague,
    leagueCard,
    isToShowPointsScreen,
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
  }, [isOnline, activities, isClubInALeague]);

  return (
    <BannerWrapper
      displayOffline={!isOnline}
      showBackground={false}
      renderBorder
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${club?.name} club`}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
    >
      {isLoading ? (
        <LoadingSpinner
          className="mt-4"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          <Typography type="h2" text={club?.name ?? ''} />
          <div className="mt-3 flex gap-2">
            {club?.league?.leagueTypeName === LeagueType.Purple && (
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
          <IssuesAndTasks
            issuesAndTasks={currentIssuesAndTasks ?? []}
            setIssuesAndTasks={setCurrentIssuesAndTasks}
            club={club}
            currentLeader={currentLeader}
            nextLeader={nextLeader}
            totalMembers={totalMembers}
            onOnlineNavigation={onOnlineNavigation}
            isLeaderRequestSent={isLeaderRequestSent}
            isLeaderAcceptedOverSixMonths={isLeaderAcceptedOverSixMonths}
          />
          {!!totalMembers ? (
            <>
              {renderLeagueContent}
              <Typography className="mb-2" type="h3" text="Club leader" />
              {hasLeader && (
                <div>
                  <StackedList
                    isFullHeight={false}
                    type={'UserAlertList' as StackedListType}
                    listItems={[leader]}
                  />
                </div>
              )}
              {!hasLeader && !isLeaderRequestSent && (
                <Alert
                  title="No club leader!"
                  type="warning"
                  button={
                    <Button
                      type="filled"
                      color="primary"
                      textColor="white"
                      icon="UserAddIcon"
                      text="Assign a club leader!"
                      onClick={() =>
                        onOnlineNavigation(
                          ROUTES.COMMUNITY.CLUB.LEADER.ADD.replace(
                            ':clubId',
                            clubId
                          )
                        )
                      }
                    />
                  }
                />
              )}
              {!hasLeader && isLeaderRequestSent && (
                <Alert
                  type="warning"
                  title="Waiting for new club leader to accept agreement."
                />
              )}
              {renderActivitiesContent}
            </>
          ) : (
            <EmptyPage
              image={AlienImage}
              title="This club does not have any members yet!"
              subTitle=""
            />
          )}
          <div className="mt-auto flex flex-col">
            <Button
              icon={!!totalMembers ? 'UserGroupIcon' : 'PlusCircleIcon'}
              className="mb-4 mt-8"
              type="filled"
              textColor="white"
              color="primary"
              text={!!totalMembers ? 'See all members' : 'Add club members'}
              onClick={() =>
                !!totalMembers
                  ? history.push(
                      ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT.replace(
                        ':clubId',
                        clubId
                      )
                    )
                  : onOnlineNavigation(
                      ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(
                        ':clubId',
                        clubId
                      )
                    )
              }
            />
            <Button
              icon="PencilIcon"
              type="outlined"
              textColor="primary"
              color="primary"
              text="Change club name"
              onClick={() =>
                onOnlineNavigation(
                  ROUTES.COMMUNITY.CLUB.EDIT.replace(':clubId', clubId)
                )
              }
            />
          </div>
        </>
      )}
    </BannerWrapper>
  );
};
