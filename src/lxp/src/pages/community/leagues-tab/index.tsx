import { LeagueType } from '@/constants/club';
import ROUTES from '@/routes/routes';
import { MenuListDataItem, StackedList, StackedListType } from '@ecdlink/ui';
import { useHistory } from 'react-router';

export const mockedLeagues = [
  {
    id: '1',
    name: 'League 1',
    type: LeagueType.Purple,
  },
  {
    id: '2',
    name: 'League 2',
    type: LeagueType.NewStars,
  },
  {
    id: '3',
    name: 'League 3',
    type: LeagueType.RisingStars,
  },
];

export const LeaguesTab = () => {
  const history = useHistory();

  const mapLeague = (league: {
    id: string;
    name: string;
    type: string;
  }): MenuListDataItem => ({
    title: league.name,
    subTitle: league.type,
    backgroundColor: league.type === LeagueType.Purple ? 'primary' : 'uiBg',
    titleStyle:
      league.type === LeagueType.Purple ? 'text-white' : 'text-textDark',
    subTitleStyle:
      league.type === LeagueType.Purple ? 'text-white' : 'text-successDark',
    rightIcon:
      league.type === LeagueType.Purple ? 'ChevronRightIcon' : undefined,
    rightIconClassName: 'text-white w-6 h-6',
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.LEAGUE.ROOT.replace(':leagueId', league.id)
      ),
  });

  const purpleLeagues = mockedLeagues
    .filter((league) => league.type === LeagueType.Purple)
    .map(mapLeague);
  const otherLeagues = mockedLeagues
    .filter((league) => league.type !== LeagueType.Purple)
    .map(mapLeague);

  return (
    <div className="p-4">
      <StackedList
        type={'MenuList' as StackedListType}
        listItems={purpleLeagues}
        className="mb-4 flex flex-col gap-1"
      />
      <StackedList
        type={'MenuList' as StackedListType}
        listItems={otherLeagues}
        className="mb-4 flex flex-col gap-2"
      />
    </div>
  );
};
