export type ChildProgressReport = {
  childId: string;
  reportingPeriodId: string;
  //TODO - Whatever other details are required
  skillObservations: {
    skillId: number;
    value: string;
  }[];
};
