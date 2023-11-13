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
    | 'progress-report';
  expiryDate?: string;
};

export type MessageRouteConfig = {
  route: string;
  params?: any;
};

export type MessageViewType = 'Messages' | 'Hub' | 'Both' | 'None';
