export type AnalyticsState = {
  viewTracking: ViewTracking[] | undefined;
  eventTracking: EventTracking[] | undefined;
};

export interface ViewTracking {
  title: string;
  pageView: string;
}

export interface EventTracking {
  category: string;
  action: string;
  label?: string;
  value?: string;
}
