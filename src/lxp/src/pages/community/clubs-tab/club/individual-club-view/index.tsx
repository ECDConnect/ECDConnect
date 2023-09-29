import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
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
import { useMemo } from 'react';
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
  LeagueType,
  MAX_MEMBERS_IN_CLUB,
  MIN_MEMBERS_IN_CLUB,
  daysToAcceptBeingLeader,
} from '@/constants/club';
import { addDays, differenceInMonths } from 'date-fns';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ClubActions } from '@/store/club/club.actions';

export function isCurrentPointsAtLeast80PercentOfTotal(
  currentPoints: number,
  totalPoints: number
): boolean {
  const targetPercentage = 0.8; // 80%
  const targetPoints = totalPoints * targetPercentage;
  return currentPoints >= targetPoints;
}

export const Club: React.FC = () => {
  const history = useHistory();

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ALL_CLUBS_DETAILS_FOR_COACH
  );

  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(clubId)
  );

  const totalMembers = club?.clubMembers?.length || 0;
  const monthsSinceCurrentLeaderAccepted = differenceInMonths(
    new Date(),
    new Date(currentLeader?.dateAccepted ?? '')
  );
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDateNextLeader = nextLeader
    ? addDays(
        new Date(nextLeader?.dateAssigned),
        daysToAcceptBeingLeader
      ).setHours(0, 0, 0, 0)
    : undefined;

  const isDueDateNextLeaderTodayOrFuture =
    dueDateNextLeader && dueDateNextLeader >= today;
  const isLeaderAcceptedOverSixMonths = monthsSinceCurrentLeaderAccepted > 6;
  const isClubInALeague = !!club?.league?.id;
  const isTop25Percent =
    !!club?.leaguePosition && Number(club?.leaguePosition) <= 3;
  const hasLeader = !!currentLeader;
  const isLeaderRequestSent = !!nextLeader && isDueDateNextLeaderTodayOrFuture;
  // TODO: check this rule
  const isPurpleLeague = club?.league?.leagueType?.name === LeagueType.Purple;

  const leader: UserAlertListDataItem = {
    title: `${currentLeader?.practitioner?.user?.firstName ?? ''} ${
      currentLeader?.practitioner?.user?.surname ?? ''
    }`,
    titleStyle: 'text-textDark',
    profileDataUrl: currentLeader?.practitioner?.user?.profileImageUrl ?? '',
    profileText: `${currentLeader?.practitioner?.user?.firstName ?? ''} ${
      currentLeader?.practitioner?.user?.surname ?? ''
    }`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
          ':clubId',
          clubId
        ).replace(':leaderId', currentLeader?.practitioner?.id) // TODO: check if it's practitionerId or userId
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
            text={String(club?.leaguePosition || 0)}
          />
        </div>
      ),
      backgroundColor: isTop25Percent ? 'successBg' : 'infoBb',
    }),
    [isTop25Percent, club]
  );

  const activities: MenuListDataItem[] = [
    {
      title: 'Meet regularly',
      menuIconUrl: partnershipIcon,
      route: ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(!isPurpleLeague
      ? [
          {
            title: 'Be creative',
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
            title: 'Capture child attendance',
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
      title: 'Host family days',
      menuIconUrl: familyIcon,
      route: ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT.replace(
        ':clubId',
        clubId
      ),
    },
    ...(isPurpleLeague
      ? [
          {
            title: 'Complete child progress reports',
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
      title: 'Leave no one behind',
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

  const renderLeagueContent = useMemo(() => {
    if (isClubInALeague) {
      return (
        <div className="mt-7 mb-5">
          <Typography
            className="mb-2"
            type="h3"
            text="League position & points"
          />
          <StackedList
            isFullHeight={false}
            type={'MenuList' as StackedListType}
            listItems={[leagueCard]}
          />
          <ScoreCard
            mainText={String(club?.totalClubPoints || 0)}
            hint="points"
            currentPoints={club?.totalClubPoints}
            maxPoints={club?.maxClubPoints}
            barBgColour="uiLight"
            barColour={
              isCurrentPointsAtLeast80PercentOfTotal(
                club?.totalClubPoints || 0,
                club?.maxClubPoints || 0
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
    club?.maxClubPoints,
    club?.totalClubPoints,
    clubId,
    history,
    isClubInALeague,
    leagueCard,
  ]);

  const renderActivitiesContent = useMemo(() => {
    if (isClubInALeague) return <></>;

    return (
      <div className="mt-7 mb-5">
        <Typography className="mb-2" type="h3" text="Activities" />
        <StackedList
          className="flex flex-col gap-2"
          type={'MenuList' as StackedListType}
          listItems={activities}
        />
      </div>
    );
  }, [activities, isClubInALeague]);

  const renderIssuesAndTasksContent = useMemo(() => {
    const items: MenuListDataItem[] = [];

    // if there is currently no club leader assigned (ie no club leader has been chosen.)
    if (!currentLeader && !nextLeader && !!club?.clubMembers?.length) {
      items.push({
        showIcon: true,
        menuIcon: 'ExclamationCircleIcon',
        title: 'No club leader assigned',
        subTitle: 'Assign club leader',
        subTitleStyle: 'text-textDark',
        titleStyle: 'text-textMid whitespace-normal',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.LEADER.ADD.replace(':clubId', clubId)
          ),
      });
    }

    // if a new club leader was assigned
    if (!currentLeader && isLeaderRequestSent) {
      items.push({
        showIcon: true,
        menuIcon: 'ExclamationCircleIcon',
        title: 'Club leader has not accepted agreement',
        subTitle: `Contact ${nextLeader.practitioner?.user?.firstName}`,
        subTitleStyle: 'text-textDark',
        titleStyle: 'text-textMid whitespace-normal',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
              ':clubId',
              clubId
            ).replace(':leaderId', nextLeader.practitioner?.id)
          ),
      });
    }

    // if there are less than 4 practitioners in the club
    if (totalMembers < MIN_MEMBERS_IN_CLUB) {
      items.push({
        showIcon: true,
        menuIcon: 'ExclamationCircleIcon',
        title: 'Not enough club members',
        subTitle: 'Add members',
        subTitleStyle: 'text-textDark',
        titleStyle: 'text-textMid whitespace-normal',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(':clubId', clubId)
          ),
      });
    }

    // if there are more than 17 practitioners in the club
    if (totalMembers > MAX_MEMBERS_IN_CLUB) {
      items.push({
        showIcon: true,
        menuIcon: 'ExclamationCircleIcon',
        title: 'Too many club members',
        subTitle: 'Create an additional club',
        subTitleStyle: 'text-textDark',
        titleStyle: 'text-textMid whitespace-normal',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          history.push(ROUTES.COMMUNITY.CLUB.ADD.replace(':clubId', 'new')),
      });
    }

    // if there the current club leader has been in the role for 6 months or more
    if (isLeaderAcceptedOverSixMonths) {
      items.push({
        showIcon: true,
        menuIcon: 'ExclamationIcon',
        title: 'Choose a new club leader',
        subTitle: `${currentLeader?.practitioner?.user?.firstName} has been a club leader for 6 or more months`,
        subTitleStyle: 'text-textDark',
        titleStyle: 'text-textMid whitespace-normal',
        iconBackgroundColor: 'alertMain',
        backgroundColor: 'alertBg',
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.LEADER.EDIT.replace(':clubId', clubId)
          ),
      });
    }

    if (!items.length) return <></>;

    return (
      <div>
        <Typography className="mb-2 mt-4" type="h3" text="Issues & tasks" />
        <StackedList
          className="flex flex-col gap-2"
          isFullHeight={false}
          type={'MenuList' as StackedListType}
          listItems={items}
        />
      </div>
    );
  }, [
    currentLeader,
    nextLeader,
    club?.clubMembers?.length,
    isLeaderRequestSent,
    totalMembers,
    isLeaderAcceptedOverSixMonths,
    history,
    clubId,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${club?.name} club`}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
    >
      {isLoading ? (
        <LoadingSpinner
          className="mt-6"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          <Typography type="h2" text={club?.name ?? ''} />
          <div className="mt-3 flex gap-2">
            {club?.league?.leagueType?.name === LeagueType.Purple && (
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
          {renderIssuesAndTasksContent}
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
                        history.push(
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
                history.push(
                  ROUTES.COMMUNITY.CLUB.MEMBERS[
                    !!totalMembers ? 'ROOT' : 'ADD'
                  ].replace(':clubId', clubId)
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
                history.push(
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
