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
// import { checkIfIsNextSeasonManagement } from './utils';

export const Leagues = () => {
  const history = useHistory();

  const today = new Date();
  const currentYear = today.getFullYear();
  const lastYear = currentYear - 1;
  const nextYear = currentYear + 1;

  // TODO: remove the hardcoded value and uncomment the line below when the feature is ready
  const isNextSeasonManagement = /* checkIfIsNextSeasonManagement() */ true;

  const leagues: MenuListDataItem[] = [
    {
      hide: false,
      startDate: `Oct ${lastYear}`,
      endDate: `Sep ${currentYear}`,
      description: 'See this year’s scoreboards.',
    },
    ...(isNextSeasonManagement
      ? [
          {
            startDate: `Oct ${currentYear}`,
            endDate: `Sep ${nextYear}`,
            description: 'Start assigning clinics to leagues for next year.',
          },
        ]
      : []),
  ]
    .filter((item) => !item.hide)
    .map((item) => ({
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
        history.push(ROUTES.CLINICS.LEAGUES.VIEW_LEAGUE_SEASON.ROOT, {
          startDate: item.startDate,
          endDate: item.endDate,
        } as LeagueSeasonRouteState),
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
