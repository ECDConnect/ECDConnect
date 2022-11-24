import { HealthCareWorkerDto } from '@ecdlink/core';

// export type PrincipalPractitioners = Partial<
//   Pick<UserDto, 'firstName' | 'surname' | 'idNumber' | 'id'> & {
//     userId: string;
//   }
// >;
export interface HealthCareWorkerState {
  healthCareWorker?: HealthCareWorkerDto | undefined;
  healthCareWorkers?: HealthCareWorkerDto[] | undefined;
}
