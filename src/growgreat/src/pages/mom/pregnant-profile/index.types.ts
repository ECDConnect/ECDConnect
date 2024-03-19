export type PregnantProfileRouteState = {
  isInfantEvent?: boolean;
  activeTabIndex?: number;
  linkedInfantId?: string;
  recordEventInput?: {
    eventRecordTypeId: string;
    notes?: string;
    infantId: string;
  };
  displayHelp?: boolean;
};

export interface PregnantProfileParams {
  id: string;
}
