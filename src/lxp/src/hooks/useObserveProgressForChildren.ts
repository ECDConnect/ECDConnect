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
import { differenceInMonths, isBefore } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChildren = () => {
  const appDispatch = useAppDispatch();

  const children = useSelector(childrenSelectors.getChildren);

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
        childFirstName: child.user?.firstName,
        childProfileImageUrl: child.user?.profileImageUrl,
        ageInMonths: !!child.user?.dateOfBirth
          ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
          : undefined,
        report: childReport,
        isNotStarted: !childReport,
        isInProgress: childReport?.skillObservations.some(
          (x) => x.value === ProgressSkillValues.DoNotKnow
        ),
        isObservationsComplete: childReport?.isAllObservationsComplete,
      };
    });
  }, [children, baseReports]);

  const percentageReportsCompleted = useMemo(() => {
    return Math.ceil(
      (childReports.filter((x) => !!x.report?.isComplete).length /
        childReports.length) *
        100
    );
  }, [childReports]);

  const percentageObservationsCompleted = useMemo(() => {
    return Math.ceil(
      (childReports.filter((x) => x.isObservationsComplete).length /
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
  };
};
