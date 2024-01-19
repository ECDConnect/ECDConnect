import {
  IssuesTasks,
  MAX_MEMBERS_IN_CLUB,
  MIN_MEMBERS_IN_CLUB,
} from '@/constants/club';
import {
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { AddIssuesAndTasksItem, IssuesAndTasksProps } from './index.types';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';
import { useCallback, useEffect } from 'react';
import { usePrevious } from '@ecdlink/core';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import {
  ClubActions,
  getActivityMeetRegularDetails,
} from '@/store/club/club.actions';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { ActivityMeetRegular } from '@ecdlink/graphql';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const IssuesAndTasks = ({
  club,
  issuesAndTasks,
  setIssuesAndTasks,
  totalMembers,
  currentLeader,
  nextLeader,
  isLeaderRequestSent,
  isLeaderAcceptedOverSixMonths,
  onOnlineNavigation,
}: IssuesAndTasksProps) => {
  const previousIssuesAndTasks = usePrevious(issuesAndTasks) as
    | MenuListDataItem[]
    | undefined;

  const clubId = club?.id ?? '';

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const { isOnline } = useOnlineStatus();

  const history = useHistory();
  const appDispatch = useAppDispatch();

  const meetings = useSelector(
    clubSelectors.getActivityMeetRegularDetailsSelector(clubId)
  );
  const previousMeetings = usePrevious(meetings) as
    | ActivityMeetRegular
    | undefined;

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_ACTIVITY_MEET_REGULAR_DETAILS
  );

  const getMonthNumber = useCallback(
    (monthAbbreviation: string) => {
      const date = new Date(`${monthAbbreviation} 10, ${currentYear}`);

      return date.getMonth() + 1;
    },
    [currentYear]
  );

  const addIssuesAndTasksItem = useCallback(
    (newItem: AddIssuesAndTasksItem) => {
      const items = issuesAndTasks ?? [];

      if (items.some((item) => item.title === newItem.title)) return;

      items.push({
        ...newItem,
        showIcon: true,
        titleStyle: 'text-textMid whitespace-normal',
        subTitleStyle: 'text-textDark',
        iconColor: 'white',
      });

      setIssuesAndTasks(items);
    },
    [issuesAndTasks, setIssuesAndTasks]
  );

  const itemsFromBackend = club?.issuesTasks?.filter(
    (item) =>
      !item?.secondaryText?.includes(IssuesTasks.notAcceptedClubLeader) &&
      !item?.secondaryText?.includes(IssuesTasks.notEnoughClubMembers) &&
      !item?.secondaryText?.includes(IssuesTasks.tooManyClubMembers) &&
      !item?.secondaryText?.includes(IssuesTasks.clubLeaderMonths) &&
      !item?.secondaryText?.includes(IssuesTasks.assignClubLeader)
  );

  const clubAttendance = itemsFromBackend?.find((item) =>
    item?.secondaryText?.includes(IssuesTasks.clubAttendance)
  );

  const getCoachAttendFirstMeetingItem = useCallback(() => {
    // if there is an upcoming first club meeting is scheduled in Funda App for sometime within the next 30 days
    const firstMeeting = itemsFromBackend?.find((item) =>
      item?.secondaryText?.includes(IssuesTasks.coachAttendFirstMeeting)
    );

    if (!!firstMeeting) {
      const date = firstMeeting?.secondaryText?.split(',')?.[0];

      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'Attend the first club meeting',
        subTitle: date,
        iconBackgroundColor: 'infoMain',
        backgroundColor: 'infoBb',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
              ':clubId',
              clubId
            )
          ),
      });
    }
  }, [addIssuesAndTasksItem, clubId, itemsFromBackend, onOnlineNavigation]);

  const getCoachMeetingAttended = useCallback(() => {
    // Show alert if the coach has NOT attended a club meeting
    const meeting = itemsFromBackend?.find((item) =>
      item?.secondaryText?.includes(IssuesTasks.coachMeetingAttended)
    );

    if (!!meeting) {
      const date = meeting?.secondaryText?.split(',')?.[0];

      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'Attend the next club meeting',
        subTitle: date,
        iconBackgroundColor: 'infoMain',
        backgroundColor: 'infoBb',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT.replace(
              ':clubId',
              clubId
            )
          ),
      });
    }
  }, [addIssuesAndTasksItem, clubId, itemsFromBackend, onOnlineNavigation]);

  const getMissingRegisterItem = useCallback(() => {
    // show alert from the 1st of the month IF the club did not submit a club meeting attendance register for the previous month
    const missingRegister = itemsFromBackend?.find((item) =>
      item?.secondaryText?.includes(IssuesTasks.missingRegister)
    );

    if (!!missingRegister) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: missingRegister?.secondaryText,
        subTitle: missingRegister?.secondaryDescription,
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.PLAYGROUP_REASSIGNED.replace(
              ':clubId',
              clubId
            )
          ),
      });
    }
  }, [addIssuesAndTasksItem, clubId, itemsFromBackend, onOnlineNavigation]);

  const getClubAttendanceItem = useCallback(() => {
    // if practitioner attendance at the previous month's club meeting was less than 60%

    const month = clubAttendance?.secondaryText?.split('in')[1].trim();

    if (!month) return;

    const monthNumber = getMonthNumber(month);

    if (!!clubAttendance) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: clubAttendance?.secondaryText,
        subTitle: clubAttendance?.secondaryDescription,
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS.replace(
              ':meetingId',
              `-${monthNumber}-`
            ).replace(':clubId', clubId)
          ),
      });
    }
  }, [
    addIssuesAndTasksItem,
    clubAttendance,
    clubId,
    getMonthNumber,
    onOnlineNavigation,
  ]);

  const getNoClubLeaderItem = useCallback(() => {
    // if there is currently no club leader assigned (ie no club leader has been chosen.)
    if (
      itemsFromBackend?.some((item) =>
        item?.secondaryText?.includes(IssuesTasks.noClubLeader)
      ) &&
      !isLeaderRequestSent
    ) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'No club leader assigned',
        subTitle: 'Assign club leader',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.LEADER.ADD.replace(':clubId', clubId)
          ),
      });
    }
  }, [
    addIssuesAndTasksItem,
    clubId,
    isLeaderRequestSent,
    itemsFromBackend,
    onOnlineNavigation,
  ]);

  const getNotAcceptedClubLeaderItem = useCallback(() => {
    // if a new club leader was assigned
    if (!currentLeader && !!nextLeader && isLeaderRequestSent) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'Club leader has not accepted agreement',
        subTitle: `Contact ${nextLeader?.firstName}`,
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          history.push(
            ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
              ':clubId',
              clubId
            ).replace(':leaderId', nextLeader?.practitionerId)
          ),
      });
    }
  }, [
    addIssuesAndTasksItem,
    clubId,
    currentLeader,
    history,
    isLeaderRequestSent,
    nextLeader,
  ]);

  const getNotEnoughClubMembersItem = useCallback(() => {
    // if there are less than 4 practitioners in the club
    if (totalMembers < MIN_MEMBERS_IN_CLUB) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'Not enough club members',
        subTitle: 'Add members',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(':clubId', clubId)
          ),
      });
    }
  }, [addIssuesAndTasksItem, clubId, onOnlineNavigation, totalMembers]);

  const getCreateClubItem = useCallback(() => {
    // if there are more than 17 practitioners in the club
    if (totalMembers > MAX_MEMBERS_IN_CLUB) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationCircleIcon',
        title: 'Too many club members',
        subTitle: 'Create an additional club',
        iconBackgroundColor: 'errorMain',
        backgroundColor: 'errorBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.ADD.replace(':clubId', 'new')
          ),
      });
    }
  }, [addIssuesAndTasksItem, onOnlineNavigation, totalMembers]);

  const getClubLeaderMonthsItem = useCallback(() => {
    // if there the current club leader has been in the role for 6 months or more
    if (isLeaderAcceptedOverSixMonths) {
      addIssuesAndTasksItem({
        menuIcon: 'ExclamationIcon',
        title: 'Choose a new club leader',
        subTitle: `${currentLeader?.firstName} has been a club leader for 6 or more months`,
        iconBackgroundColor: 'alertMain',
        backgroundColor: 'alertBg',
        onActionClick: () =>
          onOnlineNavigation(
            ROUTES.COMMUNITY.CLUB.LEADER.EDIT.replace(':clubId', clubId)
          ),
      });
    }
  }, [
    addIssuesAndTasksItem,
    clubId,
    currentLeader?.firstName,
    isLeaderAcceptedOverSixMonths,
    onOnlineNavigation,
  ]);

  const handleIssuesAndTasks = useCallback(() => {
    getMissingRegisterItem();
    getClubAttendanceItem();
    getNoClubLeaderItem();
    getNotAcceptedClubLeaderItem();
    getNotEnoughClubMembersItem();
    getCreateClubItem();
    getClubLeaderMonthsItem();
    getCoachAttendFirstMeetingItem();
    getCoachMeetingAttended();
  }, [
    getClubAttendanceItem,
    getClubLeaderMonthsItem,
    getCoachAttendFirstMeetingItem,
    getCoachMeetingAttended,
    getCreateClubItem,
    getMissingRegisterItem,
    getNoClubLeaderItem,
    getNotAcceptedClubLeaderItem,
    getNotEnoughClubMembersItem,
  ]);

  useEffect(() => {
    if (
      !issuesAndTasks?.length ||
      previousIssuesAndTasks?.length !== issuesAndTasks?.length
    ) {
      handleIssuesAndTasks();
    }
  }, [issuesAndTasks, handleIssuesAndTasks, previousIssuesAndTasks]);

  useEffect(() => {
    if (
      isOnline &&
      !!clubAttendance &&
      meetings?.pastMeetings?.length !== previousMeetings?.pastMeetings?.length
    ) {
      appDispatch(
        getActivityMeetRegularDetails({
          clubId,
          month: currentMonth + 1,
          year: currentYear,
        })
      );
    }
  }, [
    appDispatch,
    clubAttendance,
    clubId,
    currentMonth,
    currentYear,
    isOnline,
    itemsFromBackend,
    meetings?.pastMeetings?.length,
    previousMeetings?.pastMeetings?.length,
  ]);

  if (!issuesAndTasks?.length) return <></>;

  if (isLoading)
    return (
      <LoadingSpinner
        className="mt-4"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );

  return (
    <div>
      <Typography className="mb-2 mt-4" type="h3" text="Issues & tasks" />
      <StackedList
        className="flex flex-col gap-2"
        isFullHeight={false}
        type={'MenuList' as StackedListType}
        listItems={issuesAndTasks}
      />
    </div>
  );
};
