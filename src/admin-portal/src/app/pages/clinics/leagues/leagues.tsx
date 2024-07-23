import {
  MenuListDataItem,
  StackedList,
  StackedListType,
  Typography,
} from '@ecdlink/ui';
import Trophy from '../../../../assets/trophy.svg';
import { useHistory } from 'react-router';
import ROUTES from '../../../routes/app.routes-constants';
import { LeagueSeasonRouteState } from './view-league-season/types';
import { checkIfIsNextSeasonManagement } from './utils';

export const Leagues = () => {
  const history = useHistory();

  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const nextYear = currentYear + 1;

  const isNextSeasonManagement = checkIfIsNextSeasonManagement();

  const isAfterSeptember = today.getMonth() >= 9;

  const leagues: MenuListDataItem[] = [
    ...(!isAfterSeptember
      ? [
          {
            type: 'view-leagues',
            startDate: `Oct ${lastYear}`,
            endDate: `Sep ${currentYear}`,
            description: 'See this year’s scoreboards.',
          },
        ]
      : []),
    ...(isNextSeasonManagement || isAfterSeptember
      ? [
          {
            type: isAfterSeptember ? 'view-leagues' : 'league-management',
            startDate: `Oct ${currentYear}`,
            endDate: `Sep ${nextYear}`,
            description: isAfterSeptember
              ? 'See this year’s scoreboards.'
              : 'Start assigning clinics to leagues for next year.',
          },
        ]
      : []),
  ].map((item) => ({
    title: `${item.startDate} - ${item.endDate} Leagues`,
    subTitle: item.description,
    id: 'league1',
    backgroundColor: 'white',
    menuIconUrl: Trophy,
    iconBackgroundColor: 'secondary',
    iconColor: 'white',
    showIcon: true,
    className: 'border-b border-gray-200',
    titleStyle: 'text-lg text-textMid font-semibold',
    subTitleStyle: 'text-sm text-textLight',
    onActionClick: () =>
      history.push(
        item.type === 'view-leagues'
          ? ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT
          : ROUTES.CLINICS.LEAGUES.LEAGUE_MANAGEMENT.ROOT,
        {
          startDate: item.startDate,
          endDate: item.endDate,
        } as LeagueSeasonRouteState
      ),
  }));

  return (
    <>
      <Typography
        type="h1"
        text="Choose a league"
        color="textMid"
        className="mb-8"
      />
      <StackedList type={'MenuList' as StackedListType} listItems={leagues} />
    </>
  );
};
