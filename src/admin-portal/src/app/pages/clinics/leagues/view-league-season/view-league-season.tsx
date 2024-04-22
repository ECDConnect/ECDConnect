import { Breadcrumb, BreadcrumbProps } from '@ecdlink/ui';

import ROUTES from '../../../../routes/app.routes-constants';

import { LeagueManagement } from './league-management/league-management';
import { LeaguePerformance } from './league-performance/league-performance';
import { useLocation } from 'react-router';
import { LeagueSeasonRouteState } from './types';
// import { checkIfIsNextSeasonManagement } from '../utils';

export const ViewLeagueSeason = () => {
  const { state } = useLocation<LeagueSeasonRouteState>();

  // TODO: remove the hardcoded value and uncomment the line below when the feature is ready
  const isLeagueManagement = /* checkIfIsNextSeasonManagement() */ true;

  const paths: BreadcrumbProps['paths'] = [
    {
      name: 'Clinics',
      url: ROUTES.CLINICS.ALL_CLINICS,
    },
    {
      name: 'Leagues',
      url: ROUTES.CLINICS.LEAGUES.ROOT,
    },
    {
      name: `${state?.startDate ?? ''} - ${state?.endDate ?? ''} Leagues`,
      url: '',
    },
  ];

  return (
    <>
      <Breadcrumb paths={paths} />
      {isLeagueManagement ? <LeagueManagement /> : <LeaguePerformance />}
    </>
  );
};
