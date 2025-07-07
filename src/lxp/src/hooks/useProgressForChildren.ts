import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import {
  getProgressAgeGroupForChild,
  mapProgressReportDetails,
} from '@/utils/child/child-progress-report.utils';
import { differenceInMonths, format, isBefore, isValid } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressForChildren = () => {
  const baseChildren = useSelector(childrenSelectors.getChildren);

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
  );

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      currentReportingPeriod?.id || ''
    )
  );

  const isWithinReportPeriod = useMemo(() => {
    if (!currentReportingPeriod) {
      return false;
    }

    return (
      isBefore(new Date(currentReportingPeriod.startDate), new Date()) &&
      isBefore(new Date(), new Date(currentReportingPeriod.endDate))
    );
  }, [currentReportingPeriod]);

  const children = useMemo(() => {
    return (baseChildren || []).map((child) => ({
      childId: child.id || '',
      childUserId: child.userId || '',
      childFirstName: child.user?.firstName || '',
      childProfileImageUrl: child.user?.profileImageUrl,
      childFullName: `${child.user?.firstName} ${child.user?.surname}`,
      ageInMonths:
        !!child.user?.dateOfBirth &&
        format(new Date(child?.user?.dateOfBirth), 'yyyy') != '0001'
          ? differenceInMonths(new Date(), new Date(child?.user?.dateOfBirth))
          : undefined,
      ageGroup: !!currentReportingPeriod
        ? getProgressAgeGroupForChild(
            currentReportingPeriod.endDate,
            child!,
            allAgeGroups
          )
        : undefined,
    }));
  }, [baseChildren, currentReportingPeriod]);

  const childReports = useMemo(() => {
    return (children || [])
      .filter((x) => !!x.ageGroup)
      .map((child) => {
        const childReport = baseReports.find(
          (x) =>
            x.childProgressReportPeriodId === currentReportingPeriod?.id &&
            x.childId === child.childId
        );

        return {
          ...child,
          ...mapProgressReportDetails(
            childReport,
            allSkills,
            child.childFirstName,
            child.ageGroup?.skills.length || 0
          ),
        };
      });
  }, [baseChildren, baseReports, currentReportingPeriod]);

  const ageGroupsAvailableForTracking = useMemo(() => {
    return allAgeGroups.filter((x) =>
      childReports.some((y) => y.ageGroup?.id === x.id)
    );
  }, [childReports, allAgeGroups]);

  const percentageReportsCompleted = useMemo(() => {
    const validReports = childReports.filter((x) => !!x.ageGroup);
    return Math.ceil(
      (validReports.filter((x) => !!x.report?.dateCompleted).length /
        validReports.length) *
        100
    );
  }, [childReports]);

  const percentageObservationsCompleted = useMemo(() => {
    const validReports = childReports.filter((x) => !!x.ageGroup);
    return Math.ceil(
      (validReports.filter((x) => x.isObservationsComplete).length /
        validReports.length) *
        100
    );
  }, [childReports]);

  const isAllReportsComplete = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    return childReports.every((x) => !!x.report?.dateCompleted || !x.ageGroup);
  }, [baseChildren, currentReportingPeriod, childReports]);

  const isAllObservationsComplete = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    return childReports.every(
      (x) => !!x.report?.observationsCompleteDate || !x.ageGroup
    );
  }, [baseChildren, currentReportingPeriod, childReports]);

  return {
    isAllObservationsComplete,
    isAllReportsComplete,
    isReportWindowSet,
    currentReportingPeriod,
    isWithinReportPeriod,
    children,
    childReports,
    percentageReportsCompleted,
    percentageObservationsCompleted,
    ageGroupsAvailableForTracking,
  };
};
