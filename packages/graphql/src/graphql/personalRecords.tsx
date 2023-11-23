import { gql } from '@apollo/client';

export const PersonalRecordsList = gql`
  query GetAllClientRecords($pagingInput: PagedQueryInput, $search: String) {
    allClientRecords(pagingInput: $pagingInput, search: $search) {
      id
      user {
        firstName
        surname
        __typename
      }
      clientName
      createdByName
      createdUserId
      createdUser {
        firstName
        surname
        __typename
      }
      userId
      reference
      name
      workflowStatusId
      workflowStatus {
        id
        workflowStatusTypeId
        description
        __typename
      }
      documentTypeId
      documentType {
        id
        name
        description
        __typename
      }
      insertedDate
      __typename
    }
  }
`;
