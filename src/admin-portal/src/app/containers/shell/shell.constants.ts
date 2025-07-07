import { format } from 'date-fns';
import ROUTES from '../../routes/app.routes-constants';
import { INavigation, NavbarTypes } from './shell.types';

export const navigationFromFrontend: INavigation[] = [
  {
    icon: 'UserGroupIcon',
    hide: true,
    name: NavbarTypes.Notifications,
    permissions: [],
    route: ROUTES.NOTIFICATIONS_VIEW,
    sequence: 0,
    description: 'View notifications',
  },
];
