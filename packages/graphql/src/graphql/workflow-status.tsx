import { gql } from '@apollo/client';

export const GetAllWorkflowStatus = gql`
  {
    GetAllWorkflowStatus {
      id
      description
      workflowStatusType {
        id
        description
      }
    }
  }
`;

export const GetWorkflowStatusById = gql`
  query GetWorkflowStatusById($id: UUID) {
    GetWorkflowStatusById(id: $id) {
      id
      description
      workflowStatusType {
        id
        description
      }
    }
  }
`;

export const CreateWorkflowStatus = gql`
  mutation createWorkflowStatus($input: WorkflowStatusInput) {
    createWorkflowStatus(input: $input) {
      id
    }
  }
`;

export const UpdateWorkflowStatus = gql`
  mutation updateWorkflowStatus($input: WorkflowStatusInput, $id: UUID) {
    updateWorkflowStatus(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteWorkflowStatus = gql`
  mutation deleteWorkflowStatus($id: UUID!) {
    deleteWorkflowStatus(id: $id)
  }
`;
