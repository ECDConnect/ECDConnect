import { VisitDataStatus } from '@ecdlink/graphql';

export interface ReferralState {
  referralsForInfant?: VisitDataStatus[];
  referralsForMother?: VisitDataStatus[];
}
