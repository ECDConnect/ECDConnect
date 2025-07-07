import { Colours } from '@ecdlink/ui';

export type Message = {
  reference: string;
  title: string;
  message: string;
  dateCreated: string;
  priority: number;
  viewOnDashboard: boolean;
  actionText: string;
  isFromBackend?: boolean;
  cta?: string;
  icon: string;
  color: Colours;
  routeConfig?: MessageRouteConfig;
  viewType: MessageViewType;
  area:
    | 'data-sync'
    | 'inactive'
    | 'practitioner'
    | 'coach'
    | 'tracking-attendance'
    | 'child-registration'
    | 'programme-planning'
    | 'progress-report'
    | 'points';
  expiryDate?: string;
  action?: string;
};

export type MessageRouteConfig = {
  route: string;
  params?: any;
};

export interface MessageActionConfig {
  buttonName: string;
  buttonIcon?: string;
  url: string;
  state?: any;
}

export type MessageViewType = 'Messages' | 'Hub' | 'Both' | 'None';
