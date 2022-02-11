import { ComponentBaseProps } from '../../models';

export type NavigationItem = {
  name: string;
  href: string;
  current: boolean;
  icon?: string;
  params?: any;
  getNotificationCount?: () => number;
};

export interface SideMenuProps extends ComponentBaseProps {
  sidebarOpen: boolean;
  navigation: NavigationItem[];
  logoUrl: string;
  onNavigation: (item: NavigationItem) => void;
  setSidebarOpen: (value: boolean) => void;
  version?: string;
}
