import { Breadcrumb, BreadcrumbProps } from '@ecdlink/ui';

import ROUTES from '../../../../routes/app.routes-constants';

import { LeagueManagement } from './league-management/league-management';
import { LeaguePerformance } from './league-performance/league-performance';

export const ViewLeagueSeason = () => {
  // TODO: add logic to determine if its league management
  const isLeagueManagement = false;

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
      name: '{startDate} - {endDate} Leagues',
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
