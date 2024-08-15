import { useMemo } from 'react';
import { useTenant } from './useTenant';

export const useTenantModules = () => {
  const tenant = useTenant();
  const modules = tenant?.tenant?.modules;

  const tenantModules = useMemo(() => {
    return {
      attendanceEnabled: modules?.attendanceEnabled,
      businessEnabled: modules?.businessEnabled,
      calendarEnabled: modules?.calendarEnabled,
      classroomActivitiesEnabled: modules?.classroomActivitiesEnabled,
      coachRoleEnabled: modules?.coachRoleEnabled,
      progressEnabled: modules?.progressEnabled,
      trainingEnabled: modules?.trainingEnabled,
    };
  }, [
    modules?.attendanceEnabled,
    modules?.businessEnabled,
    modules?.calendarEnabled,
    modules?.classroomActivitiesEnabled,
    modules?.coachRoleEnabled,
    modules?.progressEnabled,
    modules?.trainingEnabled,
  ]);

  return tenantModules;
};
