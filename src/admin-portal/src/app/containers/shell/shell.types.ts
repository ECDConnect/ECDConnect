import { NavigationDto } from '@ecdlink/core';
import ROUTES from '../../routes/app.routes-constants';

export enum NavbarTypes {
  Dashboard = 'Dashboard',
  Users = 'Users',
  RolesPermissions = 'Roles & Permissions',
  Documents = 'Documents',
  CMS = 'Content Management',
  Reporting = 'Reporting',
  Messaging = 'Messaging',
  SiteData = 'Site data',
  Settings = 'Settings',
  Notifications = 'Notifications',
}

export const NotificationNavigationModel = {
  description: 'Notifications',
  icon: 'PresentationChartBarIcon',
  id: '5fe2f748-2df6-4467-9b32-80fc66725e41',
  isActive: true,
  name: 'Notifications',
  permissions: [],
  route: ROUTES.NOTIFICATIONS_VIEW,
  sequence: 8,
};

export type INavigation = NavigationDto & { hide?: boolean };
