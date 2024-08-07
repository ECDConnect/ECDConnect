import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { ChildDto, ProgressTrackingAgeGroupDto } from '@ecdlink/core';
import { differenceInMonths } from 'date-fns';

export const getProgressAgeGroupForChild = (
  currentProgressReportingPeriod: ProgressReportPeriod,
  child: ChildDto,
  ageGroups: ProgressTrackingAgeGroupDto[]
) => {
  if (!child.user?.dateOfBirth) {
    return;
  }

  const ageInMonths = differenceInMonths(
    new Date(currentProgressReportingPeriod.endDate),
    new Date(child.user.dateOfBirth)
  );

  // Now get age group that matches
  const ageGroup = ageGroups.find(
    (x) => x.startAgeInMonths <= ageInMonths && x.endAgeInMonths >= ageInMonths
  );

  return ageGroup;
};
