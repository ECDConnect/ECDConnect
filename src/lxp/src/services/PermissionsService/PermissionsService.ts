import {
  UpdateUserPermissionInputModelInput,
  UserPermissionModel,
} from '@ecdlink/graphql';
import { api } from '../axios.helper';
import { Config, PermissionDto } from '@ecdlink/core';
class PermissionsService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getPermissions(): Promise<PermissionDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetPractitionerRolePermissions() {
    practitionerRolePermissions() {
        id
        name 
        normalizedName
        grouping
    }
}   `,
    });

    if (response.status !== 200) {
      throw new Error('Get permissions Failed - Server connection error');
    }
    return response.data.data.practitionerRolePermissions;
  }

  async UpdateUserPermission(
    input: UpdateUserPermissionInputModelInput
  ): Promise<UserPermissionModel[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { updateUserPermission: UserPermissionModel[] };
      errors?: {};
    }>(``, {
      query: `mutation UpdateUserPermission($input: UpdateUserPermissionInputModelInput) {
          updateUserPermission(input: $input) {
            id
            userId
            permissionId
            isActive
            permissionName
            permissionNormalizedName
            permissionGrouping
          }
        }`,
      variables: {
        input: input,
      },
    });

    if (response.status !== 200 || !!response.data.errors) {
      throw new Error('UpdateUserPermission - Server connection error');
    }

    return response.data.data.updateUserPermission;
  }
}

export default PermissionsService;
