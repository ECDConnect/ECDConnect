import { useSelector } from 'react-redux';
import { getPractitioner } from '@/store/practitioner/practitioner.selectors';

export const useUserPermissions = () => {
  const practitioner = useSelector(getPractitioner);

  const hasPermissionToTakeAttendance = practitioner?.permissions?.some(
    (permission) =>
      permission?.permissionName === 'take_attendance' && permission?.isActive
  );

  const hasPermissionToCreateProgressReports =
    practitioner?.permissions?.some(
      (permission) =>
        permission?.permissionName === 'create_progress_reports' &&
        permission?.isActive
    ) || practitioner?.isPrincipal;

  const hasPermissionToPlanClassroomActivities =
    practitioner?.permissions?.some(
      (permission) =>
        permission?.permissionName === 'plan_classroom_activities' &&
        permission?.isActive
    );
  const hasPermissionToManageChildren = practitioner?.permissions?.some(
    (permission) =>
      permission?.permissionName === 'manage_children' && permission?.isActive
  );

  return {
    hasPermissionToTakeAttendance,
    hasPermissionToCreateProgressReports,
    hasPermissionToPlanClassroomActivities,
    hasPermissionToManageChildren,
  };
};
