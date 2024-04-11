import { gql } from '@apollo/client';

export const GetReferralsSummary = gql`
  query GetReferralsSummary(
    $startDate: DateTime!
    $endDate: DateTime!
    $pagingInput: PagedQueryInput
    $clinicIds: [UUID!]
  ) {
    referralsSummary(
      startDate: $startDate
      endDate: $endDate
      clinicIds: $clinicIds
      pagingInput: $pagingInput
    ) {
      type
      referralsRaised
      referralsMade
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
    $clinicIds: [UUID!]
  ) {
    referrals(
      startDate: $startDate
      endDate: $endDate
      type: $type
      clinicIds: $clinicIds
      pagingInput: $pagingInput
    ) {
      visitBackReferralId
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

export const AddVisitBackReferralAdminComment = gql`
  mutation AddVisitBackReferralAdminComment(
    $visitDataStatusId: UUID!
    $comment: String!
  ) {
    addVisitBackReferralAdminComment(
      visitDataStatusId: $visitDataStatusId
      comment: $comment
    )
  }
`;
