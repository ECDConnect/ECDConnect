export type PregnantProfileRouteState = {
  activeTabIndex?: number;
  linkedInfantId?: string;
  recordEventInput?: {
    eventRecordTypeId: string;
    notes?: string;
    infantId: string;
  };
};
