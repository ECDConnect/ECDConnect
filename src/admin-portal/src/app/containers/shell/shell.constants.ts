import { format } from 'date-fns';
import ROUTES from '../../routes/app.routes-constants';
import { INavigation } from './shell.types';

export const navigationFromFrontend: INavigation[] = [
  {
    icon: 'UserGroupIcon',
    hide: true,
    name: `Notifications`,
    permissions: [],
    route: ROUTES.NOTIFICATIONS_VIEW,
    sequence: 0,
    description: 'View notifications',
  },
  {
    icon: 'UserGroupIcon',
    hide: true,
    name: `CHWs who have opted out - ${format(new Date(), 'MMMM yyyy')}`,
    permissions: [],
    route: ROUTES.HEALTH_CARE_WORKER.OPTED_OUT,
    sequence: 0,
    description: 'View CHWs who have opted out',
  },
];
