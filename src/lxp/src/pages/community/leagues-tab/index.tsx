import { LeagueType } from '@/constants/club';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { LeagueClubsDto } from '@/models/club/league.dto';
import ROUTES from '@/routes/routes';
import { useAppDispatch } from '@/store';
import { clubSelectors } from '@/store/club';
import { ClubActions, getLeaguesForCoach } from '@/store/club/club.actions';
import { userSelectors } from '@/store/user';
import {
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  StackedListType,
} from '@ecdlink/ui';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

export const LeaguesTab = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const leagues = useSelector(clubSelectors.getLeaguesForCoachSelector);
  const user = useSelector(userSelectors.getUser);

  const { isLoading } = useThunkFetchCall(
    'clubs',
    ClubActions.GET_LEAGUES_FOR_COACH
  );
  // Reload league data
  useEffect(() => {
    if (!!user && !!user.id) {
      appDispatch(getLeaguesForCoach({ coachUserId: user.id }));
    }
  }, [user]);

  const mapLeague = (league: LeagueClubsDto): MenuListDataItem => ({
    title: league.name,
    subTitle: league.leagueTypeName,
    backgroundColor:
      league.leagueTypeName === LeagueType.Purple ? 'primary' : 'uiBg',
    titleStyle:
      league.leagueTypeName === LeagueType.Purple
        ? 'text-white'
        : 'text-textDark',
    subTitleStyle:
      league.leagueTypeName === LeagueType.Purple
        ? 'text-white'
        : 'text-successDark',
    rightIcon:
      league.leagueTypeName === LeagueType.Purple
        ? 'ChevronRightIcon'
        : undefined,
    rightIconClassName: 'text-white w-6 h-6',
    onActionClick: () =>
      history.push(
        ROUTES.COMMUNITY.LEAGUE.ROOT.replace(':leagueId', league.id)
      ),
  });

  const purpleLeagues = leagues
    .filter((league) => league.leagueTypeName === LeagueType.Purple)
    .map(mapLeague);
  const otherLeagues = leagues
    .filter((league) => league.leagueTypeName !== LeagueType.Purple)
    .map(mapLeague);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

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
