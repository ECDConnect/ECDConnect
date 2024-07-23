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

export const PermissionsNames = {
  take_attendance: 'take_attendance',
  create_progress_reports: 'create_progress_reports',
  plan_classroom_actitivies: 'plan_classroom_activities',
  manage_children: 'manage_children',
};
