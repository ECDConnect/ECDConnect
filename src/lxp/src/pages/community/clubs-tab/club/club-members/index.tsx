import {
  Alert,
  BannerWrapper,
  Button,
  DialogPosition,
  FADButton,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { addDays, differenceInMonths, format } from 'date-fns';
import { daysToAcceptBeingLeader } from '@/constants/club';
import { useDialog, useSnackbar } from '@ecdlink/core';
import { userSelectors } from '@/store/user';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const ClubMembers: React.FC = () => {
  const history = useHistory();
  const { clubId } = useParams<ClubsRouteState>();
  const { showMessage } = useSnackbar();

  const user = useSelector(userSelectors.getUser);
  const isCoach = user?.roles?.some((role) => role.name === 'Coach');
  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(clubId)
  );

  const { isOnline } = useOnlineStatus();

  const dialog = useDialog();

  const isClubCoach = user?.id === club?.clubCoach.userId;

  const nextLeaderFirstName = nextLeader?.firstName;
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDateNextLeader = nextLeader
    ? addDays(
        new Date(nextLeader?.dateAssigned),
        daysToAcceptBeingLeader
      ).setHours(0, 0, 0, 0)
    : undefined;
  const monthsSinceCurrentLeaderAccepted = differenceInMonths(
    new Date(),
    new Date(currentLeader?.dateAccepted ?? '')
  );

  const hasLeader = !!currentLeader;
  const isDueDateNextLeaderTodayOrFuture =
    dueDateNextLeader && dueDateNextLeader >= today;
  const isLeaderRequestSent = !!nextLeader && isDueDateNextLeaderTodayOrFuture;
  const isLeaderAcceptedAgreement =
    isDueDateNextLeaderTodayOrFuture && club?.incomingClubLeader?.dateAccepted;
  const isLeaderAcceptedOverSixMonths = monthsSinceCurrentLeaderAccepted > 6;
  const isToChangeLeader = hasLeader || isLeaderRequestSent;

  const coach: UserAlertListDataItem = {
    title: `${club?.clubCoach.firstName || ''} ${
      club?.clubCoach.surname || ''
    }`,
    profileText: `${club?.clubCoach.firstName || ''} ${
      club?.clubCoach.surname || ''
    }`,
    titleStyle: 'text-textDark',
    profileDataUrl: club?.clubCoach.profileImageUrl || '',
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.COACH.replace(
          ':clubId',
          clubId
        ).replace(':coachId', club?.clubCoach.userId!)
      ),
  };

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

  const members: UserAlertListDataItem[] =
    club?.clubMembers
      .filter(
        (item) =>
          (!currentLeader ||
            item.practitionerId !== currentLeader?.practitionerId) &&
          (!nextLeader || item.practitionerId !== nextLeader?.practitionerId)
      )
      ?.map((member) => ({
        title: `${member.firstName} ${member.surname}`,
        profileText: `${member?.firstName} ${member.surname}`,
        titleStyle: 'text-textDark',
        avatarColor: 'var(--primaryAccent2)',
        subTitle: member?.welcomeMessage || '',
        subTitleStyle: 'text-infoDark',
        profileDataUrl: member.profileImageUrl || '',
        alertSeverity: 'none',
        hideAlertSeverity: true,
        onActionClick: () => {
          const isSupportRole = member?.userId === club?.clubSupport?.userId;

          history.push(
            ROUTES.COMMUNITY.CLUB.USER_PROFILE[
              isSupportRole ? 'SUPPORT_ROLE' : 'MEMBER'
            ]
              .replace(':clubId', clubId)
              .replace(':practitionerId', member.practitionerId)
              .replace(':supportRoleId', member.userId)
          );
        },
      })) ?? [];

  const onOffline = () => {
    return dialog({
      position: DialogPosition.Middle,
      blocking: true,
      render: (onClose) => {
        return <OnlineOnlyModal onSubmit={onClose} />;
      },
    });
  };

  const onOnlineNavigation = (route: string) => {
    if (isOnline) {
      return history.push(route);
    }

    return onOffline();
  };

  const onCall = useCallback(() => {
    const nextLeaderPhoneNumber = nextLeader?.phoneNumber;
    if (nextLeaderPhoneNumber) {
      return window.open(`tel:${nextLeaderPhoneNumber}`);
    }

    return showMessage({
      message: 'Phone number is not available',
      type: 'error',
    });
  }, [nextLeader?.phoneNumber, showMessage]);

  useLayoutEffect(() => {
    if (!club?.clubMembers.length) {
      history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId));
    }
  }, [club?.clubMembers.length, clubId, history]);

  const renderAlert = useMemo(() => {
    let title;
    let list;

    // Scenario: there is no club leader assigned
    if (!hasLeader && !isLeaderRequestSent) {
      title = 'No club leader!';
      list = isClubCoach
        ? []
        : [
            `Reach out to your club coach and ask them to choose a new club leader.`,
          ];
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is no club leader currently assigned.
    else if (nextLeader && !isLeaderAcceptedAgreement && !hasLeader) {
      title = `${nextLeaderFirstName} has not accepted the club leader role yet.`;
      list = [
        `You assigned ${nextLeaderFirstName} the club leader role on ${
          nextLeader &&
          format(new Date(nextLeader?.dateAssigned), 'dd MMMM yyyy')
        }.`,
        `If ${nextLeaderFirstName} does not accept by ${
          dueDateNextLeader &&
          format(new Date(dueDateNextLeader), 'dd MMMM yyyy')
        }, you will need to choose a different club leader.`,
      ];
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is currently a club leader assigned.
    else if (nextLeader && !isLeaderAcceptedAgreement && hasLeader) {
      title = `${nextLeaderFirstName} has not accepted the club leader role yet.`;
      list = [
        `You assigned ${nextLeaderFirstName} the club leader role on ${
          dueDateNextLeader &&
          format(new Date(dueDateNextLeader), 'dd MMMM yyyy')
        }.`,
        `${currentLeader?.firstName} will continue to be the club leader in the meantime.`,
      ];
    }

    // Scenario: the club leader has been in the role for more than 6 months
    else if (isLeaderAcceptedOverSixMonths) {
      title = `Choose a new club leader! ${currentLeader?.firstName} has been a club leader for ${monthsSinceCurrentLeaderAccepted} months.`;
      list = ['Remember to assign a new club leader every 6 months.'];
    }

    if (!title) return <></>;

    return (
      <Alert
        className="mb-4"
        type="warning"
        title={title}
        list={list}
        button={
          club?.incomingClubLeader && !isLeaderAcceptedAgreement ? (
            <Button
              type="filled"
              color="primary"
              textColor="white"
              icon="ChatIcon"
              text={`Contact ${nextLeader?.firstName}`}
              onClick={onCall}
            />
          ) : (
            <></>
          )
        }
      />
    );
  }, [
    hasLeader,
    isLeaderRequestSent,
    nextLeader,
    isLeaderAcceptedAgreement,
    isLeaderAcceptedOverSixMonths,
    club?.incomingClubLeader,
    onCall,
    isClubCoach,
    nextLeaderFirstName,
    dueDateNextLeader,
    currentLeader?.firstName,
    monthsSinceCurrentLeaderAccepted,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 pb-20"
      size="small"
      title={`${club?.name} club`}
      onBack={() => {
        isCoach
          ? history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId))
          : history.push(ROUTES.PRACTITIONER.COMMUNITY.ROOT);
      }}
    >
      <Typography type="h2" text={`${club?.name} club members`} />
      <Typography className="mb-4 mt-6" type="h3" text="Coach" />
      <div>
        <StackedList
          isFullHeight={false}
          type={'UserAlertList' as StackedListType}
          listItems={[coach]}
        />
      </div>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <Typography type="h3" text="Club leader" />
        {isClubCoach && (
          <Button
            type="outlined"
            color="primary"
            textColor="primary"
            text={
              isToChangeLeader ? 'Change club leader' : 'Assign club leader'
            }
            icon="RefreshIcon"
            onClick={() =>
              onOnlineNavigation(
                ROUTES.COMMUNITY.CLUB.LEADER[
                  isToChangeLeader ? 'EDIT' : 'ADD'
                ].replace(':clubId', clubId)
              )
            }
          />
        )}
      </div>
      <div>
        {renderAlert}
        {hasLeader && (
          <StackedList
            isFullHeight={false}
            type={'UserAlertList' as StackedListType}
            listItems={[leader]}
          />
        )}
      </div>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <Typography className="mb-2" type="h3" text="Club members" />
        {isClubCoach && (
          <Button
            type="outlined"
            color="primary"
            textColor="primary"
            text="Move members"
            icon="ArrowsExpandIcon"
            onClick={() =>
              onOnlineNavigation(
                ROUTES.COMMUNITY.CLUB.MEMBERS.EDIT.replace(':clubId', clubId)
              )
            }
          />
        )}
      </div>
      <div>
        <StackedList
          className="flex flex-col gap-2"
          isFullHeight={false}
          type={'UserAlertList' as StackedListType}
          listItems={members}
        />
      </div>
      {isClubCoach && (
        <FADButton
          title="Add club members"
          icon="PlusIcon"
          iconDirection="left"
          textToggle
          type="filled"
          color="primary"
          shape="round"
          className="absolute bottom-1 right-1 z-10 m-3 px-3.5 py-2.5"
          click={() =>
            onOnlineNavigation(
              ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(':clubId', clubId)
            )
          }
        />
      )}
    </BannerWrapper>
  );
};
