import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { ChildProgressSkill } from '@/models/progress/progress-skill';
import { useAppDispatch } from '@/store';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import {
  progressTrackingActions,
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { getProgressAgeGroupForChild } from '@/utils/classroom/progress/progress.utils';
import { differenceInMonths, isBefore } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChildren = () => {
  const appDispatch = useAppDispatch();

  const children = useSelector(childrenSelectors.getChildren);

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
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
      isBefore(new Date(), new Date(currentReportingPeriod.startDate)) &&
      isBefore(new Date(currentReportingPeriod.endDate), new Date())
    );
  }, [currentReportingPeriod]);

  const childReports = useMemo(() => {
    return (children || []).map((child) => {
      const childReport = baseReports.find((x) => x.childId === child.id);

      return {
        childId: child.id,
        childUserId: child.userId,
        childFirstName: child.user?.firstName,
        childProfileImageUrl: child.user?.profileImageUrl,
        ageInMonths: !!child.user?.dateOfBirth
          ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
          : undefined,
        ageGroup: !!currentReportingPeriod
          ? getProgressAgeGroupForChild(
              currentReportingPeriod,
              child!,
              allAgeGroups
            )
          : undefined,
        report: childReport,
        isNotStarted: !childReport,
        isInProgress: childReport?.skillObservations.some(
          (x) => x.value === ProgressSkillValues.DoNotKnow
        ),
        isObservationsComplete: !!childReport?.observationsCompleteDate,
      };
    });
  }, [children, baseReports]);

  const ageGroupsAvailableForTracking = useMemo(() => {
    return allAgeGroups.filter((x) =>
      childReports.some((y) => y.ageGroup?.id === x.id)
    );
  }, [childReports, allAgeGroups]);

  const percentageReportsCompleted = useMemo(() => {
    return Math.ceil(
      (childReports.filter((x) => !!x.ageGroup && !!x.report?.dateCompleted)
        .length /
        childReports.length) *
        100
    );
  }, [childReports]);

  const percentageObservationsCompleted = useMemo(() => {
    return Math.ceil(
      (childReports.filter((x) => !!x.ageGroup && x.isObservationsComplete)
        .length /
        childReports.length) *
        100
    );
  }, [childReports]);

  return {
    isReportWindowSet,
    currentReportingPeriod,
    isWithinReportPeriod,
    childReports,
    percentageReportsCompleted,
    percentageObservationsCompleted,
    ageGroupsAvailableForTracking,
  };
};
