import { VisitDataStatus } from '@ecdlink/graphql';
import { RootState } from '../types';

export const getReferralsForInfantSelector = (
  state: RootState
): VisitDataStatus[] | undefined => state.referrals.referralsForInfant;
