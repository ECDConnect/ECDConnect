import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { staticDataSelectors } from '@/store/static-data';
import {
  getProgressAgeGroupForChild,
  mapProgressReportDetails,
} from '@/utils/child/child-progress-report.utils';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { differenceInMonths, format, isBefore, parseISO } from 'date-fns';
import { isAfter } from 'date-fns/esm';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressForChildren = (useNextPeriod?: boolean) => {
  const baseChildren = useSelector(childrenSelectors.getChildren);

  const workflowStatus = useSelector(staticDataSelectors.getWorkflowStatuses);

  const childActiveWorkflow = workflowStatus?.find(
    (x) => x.enumId === WorkflowStatusEnum.ChildActive
  );

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  const currentReportingPeriodForSummary = useSelector(
    classroomsSelectors.getExpiredProgressReportPeriod()
  );

  const nextReportingPeriod = useSelector(
    classroomsSelectors.getNextProgressReportPeriod()
  );

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
  );

  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
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

  const reportingPeriod = useMemo(() => {
    return isWithinReportPeriod
      ? currentReportingPeriod
      : useNextPeriod
      ? nextReportingPeriod
      : currentReportingPeriodForSummary;
  }, [
    currentReportingPeriod,
    currentReportingPeriodForSummary,
    isWithinReportPeriod,
    nextReportingPeriod,
    useNextPeriod,
  ]);

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      reportingPeriod?.id || ''
    )
  );

  const children = useMemo(() => {
    return (baseChildren || [])
      .filter(
        (x) => x.workflowStatusId === childActiveWorkflow?.workflowStatusTypeId
      )
      .map((child) => ({
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
        ageGroup: !!reportingPeriod
          ? getProgressAgeGroupForChild(
              reportingPeriod.endDate,
              child!,
              allAgeGroups
            )
          : undefined,
      }));
  }, [baseChildren, reportingPeriod]);

  const childReports = useMemo(() => {
    return (children || [])
      .filter((x) => !!x.ageGroup)
      .map((child) => {
        const childReport = baseReports.find(
          (x) =>
            x.childProgressReportPeriodId === reportingPeriod?.id &&
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
  }, [baseChildren, baseReports, reportingPeriod]);

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
  }, [baseChildren, reportingPeriod, childReports]);

  const isAllObservationsComplete = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    return childReports.every(
      (x) => !!x.report?.observationsCompleteDate || !x.ageGroup
    );
  }, [baseChildren, reportingPeriod, childReports]);

  const lastReport = useMemo(() => {
    if (!allReportingPeriods || allReportingPeriods.length === 0) return null;
    // sort by endDate (most recent last)
    const sorted = [...allReportingPeriods].sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
    return sorted[sorted.length - 1];
  }, [allReportingPeriods]);

  const isAfterLastReport = lastReport
    ? isAfter(new Date(), lastReport.endDate)
    : false;

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
    currentReportingPeriodForSummary,
    isAfterLastReport,
  };
};
