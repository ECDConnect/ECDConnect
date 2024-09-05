import { gql } from '@apollo/client';

export const settingGoogleReport = gql`
  {
    settings {
      Google {
        DashboardGoogleReport
      }
    }
  }
`;

export const settingGrafanaReport = gql`
  {
    settings {
      Grafana {
        GeneralDashboard
      }
    }
  }
`;

export const GetAllSystemSetting = gql`
  {
    GetAllSystemSetting {
      id
      grouping
      isActive
      name
      value
      isSystemValue
      fullPath
    }
  }
`;

export const CreateSystemSetting = gql`
  mutation createSystemSetting($input: SystemSettingInput) {
    createSystemSetting(input: $input) {
      id
    }
  }
`;

export const UpdateSystemSetting = gql`
  mutation updateSystemSetting($input: SystemSettingInput, $id: UUID) {
    updateSystemSetting(input: $input, id: $id) {
      id
    }
  }
`;

export const DeleteSystemSetting = gql`
  mutation deleteSystemSetting($id: UUID!) {
    deleteSystemSetting(id: $id)
  }
`;
