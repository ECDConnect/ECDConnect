import {
  Alert,
  BannerWrapper,
  Button,
  FADButton,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { mockedClub } from '../individual-club-view';
import { useHistory, useParams } from 'react-router';
import ROUTES from '@/routes/routes';
import { useMemo } from 'react';
import { ClubsRouteState } from '../../index.types';

export const ClubMembers: React.FC = () => {
  const history = useHistory();
  const params = useParams<ClubsRouteState>();

  // TODO: replace mocked rule with real data
  const hasLeader = true;
  const isLeaderMoreThan6Months = hasLeader && false;
  const isLeaderAcceptedAgreement = false;
  const isLeaderRequestSent = true;

  const coach: MenuListDataItem = {
    title: mockedClub.coach,
    titleStyle: 'text-textDark',
    menuIconUrl: mockedClub.iconUrl,
  };

  const leader: MenuListDataItem = {
    title: mockedClub.leader,
    titleStyle: 'text-textDark',
    subTitle: mockedClub.leaderDescription,
    subTitleStyle: 'text-infoDark',
    menuIconUrl: mockedClub.iconUrl,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER.replace(
          ':clubId',
          params.clubId
        ).replace(':leaderId', mockedClub.id)
      ),
  };

  const members: MenuListDataItem[] = mockedClub.members.map((member) => ({
    title: member.name,
    titleStyle: 'text-textDark',
    subTitle: member.description,
    subTitleStyle: 'text-infoDark',
    menuIconUrl: mockedClub.iconUrl,
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.CLUB.USER_PROFILE.MEMBER.replace(
          ':clubId',
          params.clubId
        ).replace(':practitionerId', mockedClub.id)
      ),
  }));

  const renderAlert = useMemo(() => {
    let title;
    let list;

    // Scenario: there is no club leader assigned
    if (!hasLeader && !isLeaderRequestSent) {
      title = 'No club leader!';
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is no club leader currently assigned.
    else if (!isLeaderAcceptedAgreement && !hasLeader) {
      title = '{newLeader} has not accepted the club leader role yet.';
      list = [
        'You assigned {newLeader} the club leader role on { date }.',
        'If {newLeader} does not accept by { date }, you will need to choose a different club leader.',
      ];
    }

    // Scenario: the assigned club leader has not accepted the club leader agreement yet AND there is currently a club leader assigned.
    else if (!isLeaderAcceptedAgreement && hasLeader) {
      title = '{newLeader} has not accepted the club leader role yet.';
      list = [
        'You assigned {newLeader} the club leader role on { date }.',
        '{leader} will continue to be the club leader in the meantime.',
      ];
    }

    // Scenario: the club leader has been in the role for more than 6 months
    else if (isLeaderMoreThan6Months) {
      title =
        'Choose a new club leader! {leader} has been a club leader for 7 months.';
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
          !isLeaderAcceptedAgreement ? (
            <Button
              type="filled"
              color="primary"
              textColor="white"
              icon="ChatIcon"
              text="Contact {newLeader}"
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
    isLeaderAcceptedAgreement,
    isLeaderMoreThan6Months,
    isLeaderRequestSent,
  ]);

  return (
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${mockedClub.name} club`}
      onBack={() =>
        history.push(
          ROUTES.COMMUNITY.CLUB.ROOT.replace(':clubId', params.clubId)
        )
      }
    >
      <Typography type="h2" text={`${mockedClub.name} club members`} />
      <Typography className="mb-4 mt-6" type="h3" text="Coach" />
      <div>
        <StackedList
          isFullHeight={false}
          type={'MenuList' as StackedListType}
          listItems={[coach]}
        />
      </div>
      <div className="mb-4 mt-6 flex items-center justify-between">
        <Typography type="h3" text="Club leader" />
        <Button
          type="outlined"
          color="primary"
          textColor="primary"
          text={hasLeader ? 'Change club leader' : 'Assign club leader'}
          icon="RefreshIcon"
          onClick={() =>
            history.push(
              ROUTES.COMMUNITY.CLUB.LEADER.EDIT.replace(
                ':clubId',
                params.clubId
              )
            )
          }
        />
      </div>
      <div>
        {renderAlert}
        <StackedList
          isFullHeight={false}
          type={'MenuList' as StackedListType}
          listItems={[leader]}
        />
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
              ROUTES.COMMUNITY.CLUB.MEMBERS.EDIT.replace(
                ':clubId',
                params.clubId
              )
            )
          }
        />
      </div>
      <div>
        <StackedList
          className="flex flex-col gap-2"
          isFullHeight={false}
          type={'MenuList' as StackedListType}
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
            ROUTES.COMMUNITY.CLUB.MEMBERS.ADD.replace(':clubId', params.clubId)
          )
        }
      />
    </BannerWrapper>
  );
};
