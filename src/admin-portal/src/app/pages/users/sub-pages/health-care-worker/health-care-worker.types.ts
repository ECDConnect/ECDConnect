import { QueryAllHealthCareWorkersArgs } from '@ecdlink/graphql';

export enum AppVisitActivity {
  High = 'High activity (at least 20 visits in past month)',
  Medium = 'Medium activity (at least 10 visits in past month)',
  Low = 'Low activity (no home visits in the past month)',
}

export type HcwRouteState = {
  clinicIds?: string[];
};

export interface HealthCareWorkerRouteState {
  queryVariables: QueryAllHealthCareWorkersArgs;
}
