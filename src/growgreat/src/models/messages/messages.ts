import { Colours } from '@ecdlink/ui';

export type Message = {
  reference: string;
  title: string;
  message: string;
  dateCreated: string;
  priority: number;
  viewOnDashboard: boolean;
  actionText: string;
  icon: string;
  color: Colours;
  routeConfig?: MessageRouteConfig;
  viewType: MessageViewType;
  area: 'data-sync' | 'inactive' | 'practitioner' | 'walkthrough' | string;
  expiryDate?: string;
  action?: string;
  isFromBackend?: boolean;
  cta?: string;
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
