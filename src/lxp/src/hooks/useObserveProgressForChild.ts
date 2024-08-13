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
import { replaceSkillText as baseReplaceSkillText } from '@/utils/child/child-progress-report.utils';
import { getProgressAgeGroupForChild } from '@/utils/classroom/progress/progress.utils';
import { differenceInMonths } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChild = (childId: string) => {
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const currentObservationsForChild = useSelector(
    progressTrackingSelectors.getCurrentObservationsForChild(childId)
  );

  const allReports = useSelector(
    progressTrackingSelectors.getProgressReportsForChild(childId)
  );

  const activeReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );

  const currentReportingPeriod = useMemo(() => {
    if (!activeReportingPeriod) {
      return undefined;
    }

    if (
      allReports.some(
        (x) =>
          !!x.dateCompleted &&
          x.childProgressReportPeriodId === activeReportingPeriod.id
      )
    ) {
      // Report already completed for active report period, so just use the next available
      return allReportingPeriods
        .filter(
          (x) => new Date(x.endDate).getFullYear() === new Date().getFullYear()
        )
        .find((x) => x.reportNumber === activeReportingPeriod.reportNumber + 1);
    }

    return activeReportingPeriod;
  }, [allReports, activeReportingPeriod, allReportingPeriods]);

  const currentAgeGroup = !!currentReportingPeriod
    ? getProgressAgeGroupForChild(currentReportingPeriod, child!, allAgeGroups)
    : undefined;

  const currentAge = !!child?.user?.dateOfBirth
    ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
    : undefined;

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(currentAgeGroup?.id || 0)
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCateogryInfo()
  );

  const currentObservations = useMemo<ChildProgressSkill[]>(() => {
    return skillsForAgeGroup.map((x) => ({
      ...x,
      value: currentObservationsForChild?.skillObservations.find(
        (o) => o.skillId === x.id
      )?.value,
    }));
  }, [skillsForAgeGroup, currentObservationsForChild]);

  // Sets up reports, adding details for reporting period, skill names (for locale) etc
  const detailedReports = useMemo<ChildProgressDetailedReport[]>(() => {
    const details = allReports.map((report) => {
      const reportingPeriod = allReportingPeriods.find(
        (x) => x.id === report.childProgressReportPeriodId
      );

      const missedSkillCount =
        skillsForAgeGroup.length - report.skillObservations.length;
      const doNotKnowSkillCount = report.skillObservations.filter(
        (x) => x.value === ProgressSkillValues.DoNotKnow
      ).length;
      const doNotKnowPercentage =
        ((missedSkillCount + doNotKnowSkillCount) /
          report.skillObservations.length) *
        100;

      return {
        ...report,
        unknownPercentage: doNotKnowPercentage,
        unknownCount: missedSkillCount + doNotKnowSkillCount,
        skillsToWorkOn: report.skillsToWorkOn
          .map((skillToWorkOn) => {
            const skill = allSkills.find((x) => x.id === skillToWorkOn.skillId);
            return {
              ...skillToWorkOn,
              skillName: baseReplaceSkillText(
                skill?.name || '',
                child?.user?.firstName || ''
              ),
              subCategoryId: skill?.subCategory.id || 0,
              categoryId: skill?.subCategory.category.id || 0,
            };
          })
          .sort((a, b) => a.skillId - b.skillId),
        skillObservations: report.skillObservations.map((skillObs) => {
          const skill = allSkills.find((x) => x.id === skillObs.skillId);
          return {
            ...skillObs,
            skillName: baseReplaceSkillText(
              skill?.name || '',
              child?.user?.firstName || ''
            ),
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
        }),
        reportingPeriodStartDate: new Date(reportingPeriod!.startDate),
        reportingPeriodEndDate: new Date(reportingPeriod!.endDate),
        reportingPeriodNumber: reportingPeriod!.reportNumber,
      };
    });

    return details;
  }, [allReports, allReportingPeriods]);

  const currentReport = useMemo(() => {
    return detailedReports.find(
      (x) => x.childProgressReportPeriodId === currentReportingPeriod?.id
    );
  }, [detailedReports, currentReportingPeriod]);

  const completedReports = useMemo(() => {
    return detailedReports.filter((x) => !!x.dateCompleted);
  }, [detailedReports, currentReportingPeriod]);

  const addObservationForSkill = async (
    skillId: number,
    value: ProgressSkillValues
  ) => {
    if (!currentReportingPeriod) {
      return;
    }
    await appDispatch(
      progressTrackingActions.updateSkill({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        skillId,
        value,
      })
    );

    // Check if we have added all observations
    const allObsMade = skillsForAgeGroup.every((x) => {
      return (
        skillId === x.id ||
        (currentObservationsForChild?.skillObservations || []).findIndex(
          (y) => y.skillId === x.id
        ) >= 0
      );
    });
    if (allObsMade) {
      appDispatch(
        progressTrackingActions.markAllSkillsObserved({
          childId,
          reportingPeriodId: currentReportingPeriod.id,
        })
      );
    }
  };

  const addSkillToWorkOn = (skillId: number) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.addSkillToWorkOn({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        skillId,
      })
    );
  };

  const removeSkillToWorkOn = (skillId: number) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.removeSkillToWorkOn({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        skillId,
      })
    );
  };

  const updateSkillToWorkOn = (skillId: number, value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateSkillToWorkOn({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        skillId,
        value,
      })
    );
  };

  const updateHowToSupport = (value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateHowToSupport({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        value,
      })
    );
  };

  const updateNotes = (value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateNotes({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        value,
      })
    );
  };

  const updateChildEnjoys = (value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateChildEnjoys({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        value,
      })
    );
  };

  const updateGoodProgressWith = (value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateGoodProgressWith({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        value,
      })
    );
  };

  const updateHowCanCaregiverSupport = (value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateHowCanCaregiverSupport({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        value,
      })
    );
  };

  const completeReport = () => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.completeReport({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
      })
    );
  };

  const syncChildProgressReports = () => {
    appDispatch(progressTrackingThunkActions.syncChildProgressReports({}));
  };

  const replaceSkillText = (skillText: string) => {
    return baseReplaceSkillText(skillText, child?.user?.firstName || '');
  };

  return {
    child,
    currentAge,
    currentAgeGroup,
    skillsForAgeGroup,
    currentObservations,
    currentReport,
    completedReports,
    currentReportingPeriod,
    replaceSkillText,
    addObservationForSkill,
    addSkillToWorkOn,
    removeSkillToWorkOn,
    updateSkillToWorkOn,
    updateHowToSupport,
    updateNotes,
    syncChildProgressReports,
    updateChildEnjoys,
    updateGoodProgressWith,
    updateHowCanCaregiverSupport,
    completeReport,
  };
};
