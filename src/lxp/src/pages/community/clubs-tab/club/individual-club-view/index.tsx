import { Tag } from '@/components/tag';
import { PointsSummaryCard } from '@/pages/dashboard/components/points-summary-card/points-summary-card';
import ROUTES from '@/routes/routes';
import {
  Alert,
  BannerWrapper,
  Button,
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Badge } from '@ecdlink/ui/src/assets/badge/badge_neutral.svg';
import { useMemo } from 'react';
import { useHistory } from 'react-router';
import familyIcon from '@/assets/icon/family.svg';
import inclusiveIcon from '@/assets/icon/inclusive.svg';
import paintPaletteIcon from '@/assets/icon/paint-palette.svg';
import partnershipIcon from '@/assets/icon/partnership.svg';

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

  // TODO: replace mocked rule with real data
  const isClubInALeague = true;
  const isTop25Percent = true;

  const leader: MenuListDataItem = {
    title: mockedClub.leader,
    titleStyle: 'text-textDark',
    menuIconUrl: mockedClub.iconUrl,
  };

  const leagueCard: MenuListDataItem = useMemo(
    () => ({
      title: mockedClub.leader,
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
            text={String(mockedClub.leagueRank)}
          />
        </div>
      ),
      backgroundColor: isTop25Percent ? 'successBg' : 'infoBb',
    }),
    [isTop25Percent]
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
          <PointsSummaryCard
            currentPoints={mockedClub.points}
            maxPoints={mockedClub.maxPoints}
            showIcon={false}
            useColourBackground={false}
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
      title={`${mockedClub.name} club`}
      onBack={() => history.push(ROUTES.COMMUNITY.ROOT)}
    >
      <Typography type="h2" text={mockedClub.name} />
      <div className="mt-3 flex gap-2">
        {isClubInALeague && (
          <Tag icon="StarIcon" title="Purple" color="primary" />
        )}
        <Tag
          title={String(mockedClub.members.length)}
          subTitle="members"
          color="successMain"
        />
      </div>
      {renderLeagueContent}
      <Typography className="mb-2" type="h3" text="Club leader" />
      <div>
        <StackedList
          isFullHeight={false}
          type={'MenuList' as StackedListType}
          listItems={[leader]}
        />
      </div>
      {renderActivitiesContent}
      <div className="mt-auto flex flex-col">
        <Button
          icon="UserGroupIcon"
          className="mb-4 mt-8"
          type="filled"
          textColor="white"
          color="primary"
          text="See all members"
          onClick={() =>
            history.push(
              ROUTES.COMMUNITY.CLUB.MEMBERS.replace(':clubId', mockedClub.id)
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
              ROUTES.COMMUNITY.CLUB.EDIT.replace(':clubId', mockedClub.id)
            )
          }
        />
      </div>
    </BannerWrapper>
  );
};
