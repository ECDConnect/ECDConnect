import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { staticDataSelectors } from '@/store/static-data';
import {
  getProgressAgeGroupForChild,
  mapProgressReportDetails,
} from '@/utils/child/child-progress-report.utils';
import { WorkflowStatusEnum } from '@ecdlink/graphql';
import { differenceInMonths, format, isBefore } from 'date-fns';
import { isAfter } from 'date-fns/esm';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressForChildren = (
  useNextPeriod?: boolean,
  selectedPeriodId?: string
) => {
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

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );
  const nextReportingPeriod = useSelector(
    classroomsSelectors.getNextProgressReportPeriod()
  );
  const currentReportingPeriodForSummary = useSelector(
    classroomsSelectors.getExpiredProgressReportPeriod()
  );
  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );
  const isReportWindowSet = useSelector(
    classroomsSelectors.getIsReportingPeriodsSet()
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

  // ────────────────────────────────────────────────
  // Determine which reporting period to use (priority order)
  // 1. selectedPeriodId (explicit override – highest priority)
  // 2. next period (if useNextPeriod = true)
  // 3. current period if we're inside the reporting window
  // 4. fallback to summary/expired period
  // ────────────────────────────────────────────────
  const reportingPeriod = useMemo(() => {
    // Highest priority: explicit period selection
    if (selectedPeriodId) {
      return allReportingPeriods.find((p) => p.id === selectedPeriodId) || null;
    }

    // Then: logic based on useNextPeriod flag
    if (useNextPeriod) {
      return nextReportingPeriod;
    }

    const isWithinCurrentWindow =
      currentReportingPeriod &&
      isBefore(new Date(currentReportingPeriod.startDate), new Date()) &&
      isBefore(new Date(), new Date(currentReportingPeriod.endDate));

    return isWithinCurrentWindow
      ? currentReportingPeriod
      : currentReportingPeriodForSummary;
  }, [
    selectedPeriodId,
    allReportingPeriods,
    useNextPeriod,
    nextReportingPeriod,
    currentReportingPeriod,
    currentReportingPeriodForSummary,
  ]);

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      reportingPeriod?.id ?? ''
    )
  );

  const children = useMemo(() => {
    return (baseChildren || [])
      .filter((x) => x.workflowStatusId === childActiveWorkflow?.id)
      .map((child) => ({
        childId: child.id || '',
        childUserId: child.userId || '',
        childFirstName: child.user?.firstName || '',
        childProfileImageUrl: child.user?.profileImageUrl,
        childFullName: `${child.user?.firstName} ${child.user?.surname}`,
        ageInMonths:
          !!child.user?.dateOfBirth &&
          format(new Date(child?.user?.dateOfBirth), 'yyyy') !== '0001'
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

  const allReportsForYear = useSelector(
    progressTrackingSelectors.getProgressReports()
  );

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
    if (children?.length === 0) {
      return false;
    }
    // Report complete, or no age group (so no report can be created)
    return childReports.every((x) => !!x.report?.dateCompleted || !x.ageGroup);
  }, [children, reportingPeriod, childReports]);

  const isAllObservationsComplete = useMemo(() => {
    if (children?.length === 0) {
      return false;
    }
    // Report complete, or no age group (so no report can be created)
    return childReports.every(
      (x) => !!x.report?.observationsCompleteDate || !x.ageGroup
    );
  }, [children, reportingPeriod, childReports]);

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
    allReportingPeriods,
    allReportsForYear,
  };
};
