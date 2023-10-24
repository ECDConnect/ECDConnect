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
import { useMemo } from 'react';
import {
  ClubActivities,
  MAX_MEMBERS_IN_CLUB,
  MIN_MEMBERS_IN_CLUB,
} from '@/constants/club';
import PositiveEmoticon from '@/assets/positive-bonus-emoticon.png';
import { useHistory } from 'react-router';
import ROUTES from '@/routes/routes';
import { useDialog } from '@ecdlink/core';
import { AddEventOrMeetingDialog } from './0-components/add-event-or-meeting-dialog';
import familyIcon from '@/assets/icon/family.svg';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import partnershipIcon from '@/assets/icon/partnership.svg';

export const ClubTab: React.FC = () => {
  const history = useHistory();

  const dialog = useDialog();

  // TODO: add integration
  const isLoading = false;

  // TODO: add integration
  const clubId = '1';
  const totalMembers = 6;
  const isClubInALeague = true;
  const isPurpleLeague = false;
  const isLeaderRequest = false;
  const isLeader = true;

  const onAddMeetingOrEvent = () => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <AddEventOrMeetingDialog onClose={onClose} />;
      },
    });
  };

  // TODO: add integration
  const coach: UserAlertListDataItem = {
    title: `{coachName}`,
    titleStyle: 'text-textDark',
    profileDataUrl: '',
    profileText: `CN`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {},
  };

  const clubSupportRole: UserAlertListDataItem = {
    title: `{supportRoleName}`,
    titleStyle: 'text-textDark',
    profileDataUrl: '',
    profileText: `SN`,
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () => {},
  };

  const leaderAlert = useMemo(() => {
    if (isLeaderRequest) {
      return (
        <Alert
          className="mt-5"
          title={`Accept the club leader agreement!`}
          type="warning"
          list={[
            'Your coach selected you for the {clubName} club leader role.',
            'If you do not want to accept the agreement, please contact your coach.',
          ]}
          button={
            <Button
              type="filled"
              color="primary"
              textColor="white"
              icon="ClipboardCheckIcon"
              text="Accept agreement"
              onClick={() => {}}
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
  }, [isLeader, isLeaderRequest]);

  // TODO: add integration
  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: `{leagueName}`,
      titleStyle: 'text-textDark',
      customIcon: (
        <div className="relative mr-4 flex h-11 w-11 items-center justify-center">
          <Badge
            className="absolute z-0 h-auto w-auto"
            fill={`var(--${true ? 'successMain' : 'secondary'})`}
          />
          <Typography
            className="relative z-10"
            color="white"
            type="h1"
            text={String(1)}
          />
        </div>
      ),
      backgroundColor: true ? 'successBg' : 'infoBb',
    }),
    []
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
          {/* TODO: add integration */}
          {true && (
            <ScoreCard
              className="mt-2"
              mainText={String(1150 || 0)}
              hint="points"
              currentPoints={1150}
              maxPoints={2000}
              barBgColour="uiLight"
              barColour="successMain"
              bgColour="uiBg"
              textColour="black"
              onClick={() => history.push(ROUTES.COMMUNITY.CLUB.POINTS.ROOT)}
            />
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
  }, [history, isClubInALeague, leagueCard]);

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

  return (
    <div className="p-4 pt-6">
      {isLoading ? (
        <LoadingSpinner
          className="mt-4"
          size="medium"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <>
          <Typography type="h2" text={'LadyBugs'} />
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
          <Typography className="mb-2" type="h3" text="Coach" />
          {true && (
            <div>
              <StackedList
                isFullHeight={false}
                type={'UserAlertList' as StackedListType}
                listItems={[coach]}
              />
            </div>
          )}
          <div className="mb-2 mt-6 flex items-center justify-between">
            <Typography type="h3" text="Club support role" />
            <Button
              type="outlined"
              color="primary"
              textColor="primary"
              text={'Change'}
              icon="RefreshIcon"
              onClick={() =>
                history.push(
                  ROUTES.PRACTITIONER.COMMUNITY.CLUB.SUPPORT_ROLE.EDIT
                )
              }
            />
          </div>
          <Typography
            className="mb-4"
            type="body"
            color="textMid"
            text="This club member can take meeting attendance & add events."
          />
          {true && (
            <StackedList
              isFullHeight={false}
              type={'UserAlertList' as StackedListType}
              listItems={[clubSupportRole]}
            />
          )}
          {renderActivitiesContent}
          <div className="mt-auto flex flex-col">
            <Button
              icon="PlusCircleIcon"
              className="mb-4 mt-8"
              type="filled"
              textColor="white"
              color="primary"
              text="Add a meeting or event"
              onClick={onAddMeetingOrEvent}
            />
            <Button
              icon="UserGroupIcon"
              type="outlined"
              textColor="primary"
              color="primary"
              text="See club members"
              onClick={() => {}}
            />
          </div>
        </>
      )}
    </div>
  );
};
