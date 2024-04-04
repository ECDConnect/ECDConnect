export interface DashboardRouteState {
  isFromLogin: string;
  isFromSignUp: string;
}

export enum NavigationTypes {
  Home = 'Home',
  ClientFolders = 'Client folders',
  Clients = 'Clients',
  Visits = 'Visits',
  Highlights = 'Highlights',
  Calendar = 'Calendar',
  Profile = 'Profile',
  Messages = 'Messages',
  Training = 'Training',
  Community = 'Community',
  Logout = 'Log out',
}
