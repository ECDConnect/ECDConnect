import { useAppDispatch } from '@/store';
import {
  progressTrackingActions,
  progressTrackingSelectors,
  progressTrackingThunkActions,
} from '@/store/progress-tracking';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useProgressForChildren } from './useProgressForChildren';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { classroomsSelectors } from '@/store/classroom';
import { childrenSelectors } from '@/store/children';
import { differenceInMonths } from 'date-fns';
import { ChildDto } from '@ecdlink/core';
import {
  getProgressAgeGroupForChild,
  mapProgressReportDetails,
} from '@/utils/child/child-progress-report.utils';

export const useObserveProgressForAgeGroupAndCategory = (
  categoryId: number,
  ageGroupId: number
) => {
  const appDispatch = useAppDispatch();

  const baseChildren = useSelector(childrenSelectors.getChildren);

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const activeReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );

  const nextReportingPeriod = useMemo(() => {
    if (!activeReportingPeriod) {
      return undefined;
    }

    return allReportingPeriods
      .filter(
        (x) => new Date(x.endDate).getFullYear() === new Date().getFullYear()
      )
      .find((x) => x.reportNumber === activeReportingPeriod.reportNumber + 1);
  }, [activeReportingPeriod, allReportingPeriods]);

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReports()
  );

  const getIsCurrentReportCompleteForChild = (childId: string) => {
    return !!baseReports.find(
      (x) =>
        x.childId === childId &&
        x.childProgressReportPeriodId === activeReportingPeriod?.id
    )?.dateCompleted;
  };

  const getAgeGroupForChild = (
    child: ChildDto,
    activeReportComplete: boolean
  ) => {
    if (!!activeReportingPeriod && !activeReportComplete) {
      return getProgressAgeGroupForChild(
        activeReportingPeriod.endDate,
        child!,
        allAgeGroups
      );
    }

    if (activeReportComplete && nextReportingPeriod) {
      return getProgressAgeGroupForChild(
        nextReportingPeriod.endDate,
        child!,
        allAgeGroups
      );
    }

    return undefined;
  };

  const childReports = useMemo(() => {
    const children = (baseChildren || []).map((child) => {
      const activeReportComplete = getIsCurrentReportCompleteForChild(
        child.id!
      );

      return {
        childId: child.id,
        childUserId: child.userId,
        childFirstName: child.user?.firstName || '',
        childProfileImageUrl: child.user?.profileImageUrl,
        childFullName: `${child.user?.firstName} ${child.user?.surname}`,
        ageInMonths: !!child.user?.dateOfBirth
          ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
          : undefined,
        activeReportComplete: activeReportComplete,
        activeReportingPeriodForChild: activeReportComplete
          ? nextReportingPeriod
          : activeReportingPeriod,
        ageGroup: getAgeGroupForChild(child, activeReportComplete),
      };
    });

    return (children || [])
      .filter((x) => !!x.ageGroup && x.ageGroup.id === ageGroupId)
      .map((child) => {
        const childReport = baseReports.find(
          (x) =>
            ((!child.activeReportComplete &&
              x.childProgressReportPeriodId === activeReportingPeriod?.id) ||
              (child.activeReportComplete &&
                x.childProgressReportPeriodId === nextReportingPeriod?.id)) &&
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
  }, [baseChildren, baseReports, activeReportingPeriod, nextReportingPeriod]);

  const ageGroup = useMemo(() => {
    return allAgeGroups.find((x) => x.id === ageGroupId)!;
  }, [allAgeGroups]);

  const category = useMemo(() => {
    return categories.find((x) => x.id === categoryId)!;
  }, [categoryId, categories]);

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(ageGroupId || 0)
  );

  const skillsForAgeGroupAndCategory = useMemo(() => {
    return skillsForAgeGroup.filter(
      (skill) => skill.subCategory.category.id === categoryId
    );
  }, [categoryId, skillsForAgeGroup]);

  const addObservationForSkill = async (
    childId: string,
    reportingPeriodId: string,
    skillId: number,
    value: ProgressSkillValues
  ) => {
    await appDispatch(
      progressTrackingActions.updateSkill({
        childId,
        reportingPeriodId,
        skillId,
        value,
      })
    );
  };

  const syncChildProgressReports = () => {
    appDispatch(progressTrackingThunkActions.syncChildProgressReports({}));
  };

  return {
    childReports,
    ageGroup,
    category,
    skillsForAgeGroupAndCategory,
    addObservationForSkill,
    syncChildProgressReports,
  };
};
