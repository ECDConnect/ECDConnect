import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { useAppDispatch } from '@/store';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { replaceSkillText } from '@/utils/child/child-progress-report.utils';
import { getProgressAgeGroupForChild } from '@/utils/classroom/progress/progress.utils';
import { differenceInMonths, isBefore } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChildren = () => {
  const baseChildren = useSelector(childrenSelectors.getChildren);

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCateogryInfo()
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

  const children = useMemo(() => {
    return (baseChildren || []).map((child) => ({
      childId: child.id,
      childUserId: child.userId,
      childFirstName: child.user?.firstName || '',
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
    }));
  }, [baseChildren, currentReportingPeriod]);

  const childReports = useMemo(() => {
    return (children || []).map((child) => {
      const childReport = baseReports.find(
        (x) =>
          x.childProgressReportPeriodId === currentReportingPeriod?.id &&
          x.childId === child.childId
      );

      return {
        ...child,
        isNotStarted: !childReport,
        isInProgress: childReport?.skillObservations.some(
          (x) => x.value === ProgressSkillValues.DoNotKnow
        ),
        report: {
          ...childReport,
          skillObservations: (childReport?.skillObservations || []).map(
            (skillObs) => {
              const skill = allSkills.find((x) => x.id === skillObs.skillId);
              return {
                ...skillObs,
                skillName: replaceSkillText(
                  skill?.name || '',
                  child.childFirstName
                ),
                skillDescription: skill?.description,
                subCategoryId: skill?.subCategory.id || 0,
                categoryId: skill?.subCategory.category.id || 0,
                isPositive:
                  !!skillObs.value &&
                  ((!skill?.isReverseScored &&
                    skillObs.value === ProgressSkillValues.Yes) ||
                    (!!skill?.isReverseScored &&
                      skillObs.value === ProgressSkillValues.No)),
                isNegative:
                  !!skillObs.value &&
                  ((!skill?.isReverseScored &&
                    skillObs.value === ProgressSkillValues.No) ||
                    (!!skill?.isReverseScored &&
                      skillObs.value === ProgressSkillValues.Yes)),
              };
            }
          ),
        },
        isObservationsComplete: !!childReport?.observationsCompleteDate,
      };
    });
  }, [baseChildren, baseReports, currentReportingPeriod]);

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

  const isAllReportsComplete = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    return childReports.every((x) => !!x.report?.dateCompleted || !x.ageGroup);
  }, [baseChildren, currentReportingPeriod, childReports]);

  const isAllObservationsComplete = useMemo(() => {
    // Report complete, or no age group (so no report can be created)
    console.log('childReports', childReports);
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
