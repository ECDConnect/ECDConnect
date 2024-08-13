import { ComponentBaseProps } from '../../models';

export type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
  onNavigation?: (item: NavigationItem) => void;
  params?: any;
  hideItem?: boolean;
};

export type NavigationRouteItem = NavigationItem & {
  icon?: string;
  getNotificationCount?: () => number;
  showDivider?: boolean;
};

export type NavigationDropdown = {
  name: string;
  current: boolean;
  icon?: string;
  nestedChildren: NavigationItem[];
  showDivider?: boolean;
};

export interface SideMenuProps extends ComponentBaseProps {
  sidebarOpen: boolean;
  navigation: (NavigationRouteItem & NavigationDropdown)[];
  logoUrl: string;
  onNavigation: (item: NavigationItem) => void;
  setSidebarOpen: (value: boolean) => void;
  version?: string;
}
