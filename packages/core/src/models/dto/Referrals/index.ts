export interface ReferralDetails {
  visitBackReferralId?: string;
  visitId?: string;
  visitDataStatusId?: string;
  type?: string;
  client?: string;
  healthCareWorker?: string;
  healthCareWorkerId?: string;
  createdDate?: string;
  completedDate?: string;
  isCompleted?: boolean;
  text?: string;
  isBackReferralCompleted?: boolean;
  healthCareWorkerBackReferralNote?: string;
  adminBackReferralNote?: string;
}

export interface ReferralSummary {
  type?: string;
  referralsRaised?: number;
  referralsMade?: number;
  backReferralsMade?: number;
}
