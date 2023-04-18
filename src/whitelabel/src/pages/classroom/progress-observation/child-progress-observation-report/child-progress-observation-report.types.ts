export interface ChildProgressObservationReportState {
  childId: string;
  reportingDate?: string;
}

export enum ChildProgressObservationReportSteps {
  ChildEnjoys = 1,
  ChildMadeProgressWith = 2,
  HowCanCaregiverHelpChild = 3,
  OverviewReport = 4,
}
