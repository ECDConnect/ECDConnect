import {
  Alert,
  BannerWrapper,
  Button,
  FADButton,
  StackedList,
  StackedListType,
  Typography,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useLayoutEffect, useMemo } from 'react';
import { ClubsRouteState } from '../../index.types';
import { useSelector } from 'react-redux';
import { clubSelectors } from '@/store/club';
import { addDays, differenceInMonths, format } from 'date-fns';
import { daysToAcceptBeingLeader } from '@/constants/club';

export const ClubMembers: React.FC = () => {
  const history = useHistory();
  const { clubId } = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(clubId)
  );

  const nextLeaderFirstName = nextLeader?.practitioner?.user?.firstName;
  const today = new Date().setHours(0, 0, 0, 0);
  const dueDateNextLeader = addDays(
    new Date(nextLeader?.dateAssigned),
    daysToAcceptBeingLeader
  ).setHours(0, 0, 0, 0);
  const monthsSinceCurrentLeaderAccepted = differenceInMonths(
    new Date(),
    new Date(currentLeader?.dateAccepted ?? '')
  );

  const hasLeader = !!currentLeader;
  const isDueDateNextLeaderTodayOrFuture = dueDateNextLeader >= today;
  const isLeaderRequestSent = !!nextLeader && isDueDateNextLeaderTodayOrFuture;
  const isLeaderAcceptedAgreement =
    isDueDateNextLeaderTodayOrFuture &&
    club?.clubLeaders?.every((leader) => !!leader?.dateAccepted) &&
    club?.clubLeaders?.some((leader) => !!leader?.isActive);
  const isLeaderAcceptedOverSixMonths = monthsSinceCurrentLeaderAccepted > 6;
  const isToChangeLeader = hasLeader || isLeaderRequestSent;

  const coach: UserAlertListDataItem = {
    title: `${club?.coach?.user?.firstName || ''} ${
      club?.coach?.user?.surname || ''
    }`,
    profileText: `${club?.coach?.user?.firstName || ''} ${
      club?.coach?.user?.surname || ''
    }`,
    titleStyle: 'text-textDark',
    profileDataUrl: club?.coach?.user?.profileImageUrl || '',
    avatarColor: 'var(--primaryAccent2)',
    alertSeverity: 'none',
    hideAlertSeverity: true,
    // TODO: add onClick
    onActionClick: () => {},
  };

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

  const members: UserAlertListDataItem[] =
    club?.clubMembers?.map((member) => ({
      title: `${member?.practitioner?.user?.firstName || ''} ${
        member?.practitioner?.user?.surname || ''
      }`,
      profileText: `${member?.practitioner?.user?.firstName || ''} ${
        member?.practitioner?.user?.surname || ''
      }`,
      titleStyle: 'text-textDark',
      avatarColor: 'var(--primaryAccent2)',
      subTitle: member?.welcomeMessage || '',
      subTitleStyle: 'text-infoDark',
      profileDataUrl: member?.practitioner?.user?.profileImageUrl || '',
      alertSeverity: 'none',
      hideAlertSeverity: true,
      onActionClick: () =>
        history.push(
          ROUTES.COMMUNITY.CLUB.USER_PROFILE.MEMBER.replace(
            ':clubId',
            clubId
          ).replace(':practitionerId', member?.practitioner?.id)
        ),
    })) ?? [];

  useLayoutEffect(() => {
    if (!club?.clubMembers?.length) {
      history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId));
    }
  }, [club?.clubMembers?.length, clubId, history]);

  const renderAlert = useMemo(() => {
    let title;
    let list;

    // Scenario: there is no club leader assigned
    if (!hasLeader && !isLeaderRequestSent) {
      title = 'No club leader!';
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is no club leader currently assigned.
    else if (!isLeaderAcceptedAgreement && !hasLeader) {
      title = `${nextLeaderFirstName} has not accepted the club leader role yet.`;
      list = [
        `You assigned ${nextLeaderFirstName} the club leader role on ${
          nextLeader &&
          format(new Date(nextLeader?.dateAssigned), 'dd MMMM yyyy')
        }.`,
        `If ${nextLeaderFirstName} does not accept by ${format(
          new Date(dueDateNextLeader),
          'dd MMMM yyyy'
        )}, you will need to choose a different club leader.`,
      ];
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is currently a club leader assigned.
    else if (!isLeaderAcceptedAgreement && hasLeader) {
      title = `${nextLeaderFirstName} has not accepted the club leader role yet.`;
      list = [
        `You assigned ${nextLeaderFirstName} the club leader role on ${format(
          new Date(dueDateNextLeader),
          'dd MMMM yyyy'
        )}.`,
        `${currentLeader?.practitioner?.user?.firstName} will continue to be the club leader in the meantime.`,
      ];
    }

    // Scenario: the club leader has been in the role for more than 6 months
    else if (isLeaderAcceptedOverSixMonths) {
      title = `Choose a new club leader! ${currentLeader?.practitioner?.user?.firstName} has been a club leader for ${monthsSinceCurrentLeaderAccepted} months.`;
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
          club?.clubLeaders?.length && !isLeaderAcceptedAgreement ? (
            <Button
              type="filled"
              color="primary"
              textColor="white"
              icon="ChatIcon"
              text={`Contact ${nextLeader?.practitioner?.user?.firstName}`}
              // TODO: add onClick
              onClick={() => {}}
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
    isLeaderAcceptedAgreement,
    isLeaderAcceptedOverSixMonths,
    club?.clubLeaders?.length,
    nextLeader,
    nextLeaderFirstName,
    dueDateNextLeader,
    currentLeader?.practitioner?.user?.firstName,
    monthsSinceCurrentLeaderAccepted,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 pb-20"
      size="small"
      title={`${club?.name} club`}
      onBack={() =>
        history.push(ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', clubId))
      }
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
        <Button
          type="outlined"
          color="primary"
          textColor="primary"
          text={isToChangeLeader ? 'Change club leader' : 'Assign club leader'}
          icon="RefreshIcon"
          onClick={() =>
            history.push(
              ROUTES.COMMUNITY.CLUB.LEADER[
                isToChangeLeader ? 'EDIT' : 'ADD'
              ].replace(':clubId', clubId)
            )
          }
        />
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
        <Button
          type="outlined"
          color="primary"
          textColor="primary"
          text="Move members"
          icon="ArrowsExpandIcon"
          onClick={() =>
            history.push(
              ROUTES.COMMUNITY.CLUB.MEMBERS.EDIT.replace(':clubId', clubId)
            )
          }
        />
      </div>
      <div>
        <StackedList
          className="flex flex-col gap-2"
          isFullHeight={false}
          type={'UserAlertList' as StackedListType}
          listItems={members}
        />
      </div>
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
          history.push(
            ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(':clubId', clubId)
          )
        }
      />
    </BannerWrapper>
  );
};
