import { Tag } from '@/components/tag';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
  EmptyPage,
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
import { LeagueType } from '@/constants/club';

// TODO: replace mockedClub with real data
export const mockedClub = {
  id: '01',
  name: 'Lady Bugs',
  members: [
    {
      name: 'Bulelwa Mahlangu',
      description: 'Lorem ipsum 😊',
    },
    {
      name: 'Hope Mokoena',
      description: '',
    },
    {
      name: 'Lerato Setsego',
      description: 'Lorem ipsum',
    },
    {
      name: 'Palesa Ndlovu',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing',
    },
  ],
  league: 'Lorem Ipsum league',
  leagueColor: 'purple',
  leagueRank: 1,
  points: 200,
  maxPoints: 1000,
  coach: 'Nothando Bhuyeni',
  leader: 'Cynthia Jacobs',
  leaderDescription: 'Learning & living',
  iconUrl:
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3087&q=80',
};

export const Club: React.FC = () => {
  const history = useHistory();
  const params = useParams<ClubsRouteState>();

  const club = useSelector(clubSelectors.getClubByIdSelector(params.clubId));
  const currentLeader = useSelector(
    clubSelectors.getCurrentClubLeaderByClubIdSelector(params.clubId)
  );
  const nextLeader = useSelector(
    clubSelectors.getNextClubLeaderByClubIdSelector(params.clubId)
  );

  const totalMembers = club?.clubMembers?.length || 0;

  const isClubInALeague = !!club?.league?.id;
  const isTop25Percent =
    !!club?.leaguePosition && Number(club?.leaguePosition) <= 3;
  const hasLeader = !!currentLeader;
  const isLeaderRequestSent = !!nextLeader;

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
          params.clubId
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
    { title: 'Meet regularly', menuIconUrl: partnershipIcon },
    { title: 'Be creative', menuIconUrl: paintPaletteIcon },
    { title: 'Host family days', menuIconUrl: familyIcon },
    { title: 'Leave no one behind', menuIconUrl: inclusiveIcon },
  ].map((item) => ({
    ...item,
    titleStyle: 'text-textDark',
    menuIconUrl: item.menuIconUrl,
    iconBackgroundColor: 'tertiary',
    showIcon: true,
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
            mainText={`${mockedClub.points}`}
            secondaryText="points"
            currentPoints={mockedClub.points}
            maxPoints={mockedClub.maxPoints}
            barBgColour="uiLight"
            barColour="black"
            bgColour="uiBg"
            textColour="black"
            // TODO: add onClick
            onClick={() => {}}
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
  }, [isClubInALeague, leagueCard]);

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
    <BannerWrapper
      showBackground={false}
      className="flex flex-col p-4 pt-6 "
      size="small"
      title={`${club?.name} club`}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
    >
      <Typography type="h2" text={club?.name ?? ''} />
      <div className="mt-3 flex gap-2">
        {club?.league?.leagueType?.name === LeagueType.Purple && (
          <Tag icon="StarIcon" title="Purple" color="primary" />
        )}
        <Tag
          title={String(totalMembers)}
          subTitle="members"
          color={
            !!totalMembers && totalMembers >= 4 && totalMembers <= 17
              ? 'successMain'
              : 'errorMain'
          }
        />
      </div>
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
                        params.clubId
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
              ].replace(':clubId', params.clubId)
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
              ROUTES.COMMUNITY.CLUB.EDIT.replace(':clubId', params.clubId)
            )
          }
        />
      </div>
    </BannerWrapper>
  );
};
