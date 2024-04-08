import { gql } from '@apollo/client';

export const GetReferralsSummary = gql`
  query GetReferralsSummary(
    $startDate: DateTime!
    $endDate: DateTime!
    $pagingInput: PagedQueryInput
  ) {
    referralsSummary(
      startDate: $startDate
      endDate: $endDate
      pagingInput: $pagingInput
    ) {
      type
      referralsRaised
      backReferralsMade
    }
  }
`;

export const GetReferrals = gql`
  query GetReferrals(
    $startDate: DateTime!
    $endDate: DateTime!
    $type: String
    $pagingInput: PagedQueryInput
  ) {
    referrals(
      startDate: $startDate
      endDate: $endDate
      type: $type
      pagingInput: $pagingInput
    ) {
      visitId
      visitDataStatusId
      type
      client
      healthCareWorker
      healthCareWorkerId
      createdDate
      completedDate
      isCompleted
      text
      isBackReferralCompleted
      healthCareWorkerBackReferralNote
      adminBackReferralNote
    }
  }
`;
