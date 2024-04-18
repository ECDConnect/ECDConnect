import { ReferralDetails } from '@ecdlink/core';

export interface EditBackReferralRouteParams {
  visitDataStatusId: string;
}

export interface EditBackReferralRouteState {
  clinicIds: string[];
  referral: ReferralDetails;
}
