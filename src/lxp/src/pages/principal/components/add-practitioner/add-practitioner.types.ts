import { PermissionDto } from '@ecdlink/core';

export type AddNewPractitionerModel = {
  firstName?: string;
  surname?: string;
  idNumber?: string;
  userId?: string;
  username?: string;
  userPermissions?: PermissionDto[];
};

export const AddPractitinerInitialState = {
  firstName: '',
  surname: '',
  idNumber: '',
  userId: '',
  username: '',
};
