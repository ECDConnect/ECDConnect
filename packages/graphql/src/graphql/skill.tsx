import { gql } from '@apollo/client';

export const GetAllProgressTrackingSkill = gql`
  {
    GetAllProgressTrackingSkill {
      id
      levelId
      description
      subCategoryId
      level {
        title
      }
      subCategory {
        title
      }
      value
    }
  }
`;

export const GetProgressTrackingSkillId = gql`
  query GetProgressTrackingSkillId($id: UUID) {
    GetProgressTrackingSkillId(id: $id) {
      id
      LevelId
      description
      subCategoryId
      level {
        title
      }
      subCategory {
        title
      }
      value
    }
  }
`;

export const CreateProgressTrackingSkill = gql`
  mutation createProgressTrackingSkill($input: ProgressTrackingSkillInput) {
    createProgressTrackingSkill(input: $input) {
      id
    }
  }
`;

export const UpdateProgressTrackingSkill = gql`
  mutation updateProgressTrackingSkill(
    $input: ProgressTrackingSkillInput
    $id: UUID
  ) {
    updateProgressTrackingSkill(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteProgressTrackingSkill = gql`
  mutation deleteProgressTrackingSkill($id: UUID!) {
    deleteProgressTrackingSkill(id: $id)
  }
`;
