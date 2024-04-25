import ROUTES from '../../routes/app.routes-constants';

export enum NavbarTypes {
  Dashboard = 'Dashboard',
  Users = 'Users',
  Clinics = 'Clinics',
  RolesPermissions = 'Roles & Permissions',
  Referrals = 'Referrals',
  TLMeetings = 'TL Meetings',
  Documents = 'Documents',
  CMS = 'Content Management',
  Reporting = 'Reporting',
  Messaging = 'Messaging',
  League = 'League',
  TeamMeetings = 'Team meetings',
  SiteData = 'Site data',
  Settings = 'Settings',
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
