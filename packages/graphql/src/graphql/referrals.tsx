import { gql } from '@apollo/client';

export const GetReferralsSummary = gql`
  query (
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
