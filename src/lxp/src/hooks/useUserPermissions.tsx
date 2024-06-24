import { useSelector } from 'react-redux';
import { getPractitioner } from '@/store/practitioner/practitioner.selectors';

export const useUserPermissions = () => {
  const practitioner = useSelector(getPractitioner);

  const hasPermissionToTakeAttendance = practitioner?.permissions?.some(
    (permission) => permission?.permissionName === 'take_attendance'
  );
  const hasPermissionToCreateProgressReports = practitioner?.permissions?.some(
    (permission) => permission?.permissionName === 'create_progress_reports'
  );
  const hasPermissionToPlanClassroomActivities =
    practitioner?.permissions?.some(
      (permission) => permission?.permissionName === 'plan_classroom_activities'
    );
  const hasPermissionToManageChildren = practitioner?.permissions?.some(
    (permission) => permission?.permissionName === 'manage_children'
  );

  return {
    hasPermissionToTakeAttendance,
    hasPermissionToCreateProgressReports,
    hasPermissionToPlanClassroomActivities,
    hasPermissionToManageChildren,
  };
};
