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
import {
  replaceSkillText as baseReplaceSkillText,
  getProgressAgeGroupForChild,
} from '@/utils/child/child-progress-report.utils';
import { differenceInMonths } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChild = (childId: string) => {
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const practitionerForChild = useSelector(
    classroomsSelectors.getClassroomGroupByChildUserId(child!.userId!)
  );

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allReports = useSelector(
    progressTrackingSelectors.getProgressReportsForChild(childId)
  );

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );

  const currentObservationPeriod = useMemo(() => {
    if (!currentReportingPeriod) {
      return undefined;
    }

    if (
      allReports.some(
        (x) =>
          !!x.dateCompleted &&
          x.childProgressReportPeriodId === currentReportingPeriod.id
      )
    ) {
      // Report already completed for active report period, so just use the next available
      return allReportingPeriods
        .filter(
          (x) => new Date(x.endDate).getFullYear() === new Date().getFullYear()
        )
        .find(
          (x) => x.reportNumber === currentReportingPeriod.reportNumber + 1
        );
    }

    return currentReportingPeriod;
  }, [allReports, currentReportingPeriod, allReportingPeriods]);

  const observationsAgeGroup = !!currentObservationPeriod
    ? getProgressAgeGroupForChild(
        currentObservationPeriod.endDate,
        child!,
        allAgeGroups
      )
    : undefined;

  const currentAge = !!child?.user?.dateOfBirth
    ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
    : undefined;

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(
      observationsAgeGroup?.id || 0
    )
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  const report = allReports.find(
    (x) => x.childProgressReportPeriodId === currentObservationPeriod?.id
  );

  const currentObservations = useMemo<ChildProgressSkill[]>(() => {
    return skillsForAgeGroup.map((x) => ({
      ...x,
      value: report?.skillObservations.find((o) => o.skillId === x.id)?.value,
    }));
  }, [skillsForAgeGroup, report]);

  // Sets up reports, adding details for reporting period, skill names (for locale) etc
  const currentReport = useMemo<ChildProgressDetailedReport | undefined>(() => {
    if (!report) {
      return undefined;
    }

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
            skillDescription: skill?.description || '',
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
          skillDescription: skill?.description || '',
          subCategoryId: skill?.subCategory.id || 0,
          categoryId: skill?.subCategory.category.id || 0,
          isReverseScored: skill?.isReverseScored,
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
      hasNegativeScores:
        report.skillObservations
          .map((skillObs) => {
            const skill = allSkills.find((x) => x.id === skillObs.skillId);
            return {
              isNegative:
                !!skillObs.value &&
                ((!skill?.isReverseScored &&
                  skillObs.value === ProgressSkillValues.No) ||
                  (!!skill?.isReverseScored &&
                    skillObs.value === ProgressSkillValues.Yes)),
            };
          })
          .reduce((count, x) => (x.isNegative ? count + 1 : count), 0) !== 0,
      reportingPeriodStartDate: new Date(currentObservationPeriod!.startDate),
      reportingPeriodEndDate: new Date(currentObservationPeriod!.endDate),
      reportingPeriodNumber: currentObservationPeriod!.reportNumber,
      ageInMonthsAtReport: !!child?.user?.dateOfBirth
        ? differenceInMonths(
            new Date(currentObservationPeriod!.endDate),
            new Date(child.user.dateOfBirth)
          )
        : undefined,
    };
  }, [report]);

  const areObservationsComplete = (
    updatedSkillId?: number,
    updatedSkillValue?: ProgressSkillValues
  ) => {
    // Criteria:
    // 1: All questions answered
    // 2: User responded don't know to less than 25%

    // Check if we have added all observations
    const allObsMade = skillsForAgeGroup.every((x) => {
      return (
        updatedSkillId === x.id ||
        (currentReport?.skillObservations || []).findIndex(
          (y) => y.skillId === x.id
        ) >= 0
      );
    });

    let doNotKnowCount =
      currentReport?.skillObservations.filter(
        (x) =>
          x.skillId !== updatedSkillId &&
          x.value === ProgressSkillValues.DoNotKnow
      ).length || 0;

    if (
      !!updatedSkillValue &&
      updatedSkillValue === ProgressSkillValues.DoNotKnow
    ) {
      doNotKnowCount++;
    }

    const skillsToWorkOnWithoutSupport = currentReport?.skillsToWorkOn.filter(
      (x) => x.howToSupport !== ''
    );
    const skillsToWorkOnSelectedWithSupport =
      (currentReport &&
        currentReport?.skillsToWorkOn.length !== 0 &&
        skillsToWorkOnWithoutSupport?.length ===
          currentReport?.skillsToWorkOn.length) ||
      (currentReport &&
        skillsToWorkOnWithoutSupport?.length === 0 &&
        currentReport?.skillsToWorkOn.length === 0);

    const doNotKnowPerc = (doNotKnowCount / skillsForAgeGroup.length) * 100;
    const result =
      allObsMade && doNotKnowPerc < 25 && skillsToWorkOnSelectedWithSupport!;
    setObservationsCompleteDate(result);

    return result;
  };

  const setObservationsCompleteDate = (isCompleted: boolean) => {
    if (currentObservationPeriod) {
      if (!isCompleted) {
        appDispatch(
          progressTrackingActions.resetReportObservationDateComplete({
            childId,
            reportingPeriodId: currentObservationPeriod.id,
          })
        );
      } else {
        appDispatch(
          progressTrackingActions.markAllSkillsObserved({
            childId,
            reportingPeriodId: currentObservationPeriod.id,
          })
        );
      }
    }
  };

  const addObservationForSkill = async (
    skillId: number,
    value: ProgressSkillValues
  ) => {
    if (!currentObservationPeriod) {
      return;
    }
    await appDispatch(
      progressTrackingActions.updateSkill({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        skillId,
        value,
      })
    );

    // remove skill when it is reversed
    const skill = currentReport?.skillObservations.find(
      (x) => x.skillId === skillId
    );
    if (
      (skill?.isReverseScored && value !== ProgressSkillValues.Yes) ||
      value === ProgressSkillValues.DoNotKnow
    ) {
      await appDispatch(
        progressTrackingActions.removeSkillToWorkOn({
          childId,
          reportingPeriodId: currentObservationPeriod.id,
          skillId,
        })
      );
    }

    // Check if we have added all observations
    areObservationsComplete(skillId);
  };

  const addSkillToWorkOn = (skillId: number) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.addSkillToWorkOn({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        skillId,
      })
    );
  };

  const removeSkillToWorkOn = (skillId: number) => {
    if (!currentObservationPeriod) {
      return;
    }
    appDispatch(
      progressTrackingActions.removeSkillToWorkOn({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        skillId,
      })
    );

    // Check if we have added all observations
    areObservationsComplete(skillId);
  };

  const updateSkillToWorkOn = (skillId: number, value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateSkillToWorkOn({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        skillId,
        value,
      })
    );

    // Check if we have added all observations
    areObservationsComplete(skillId);
  };

  const updateHowToSupport = (value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateHowToSupport({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        value,
      })
    );
  };

  const updateNotes = (value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateNotes({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        value,
      })
    );
  };

  const updateChildEnjoys = (value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateChildEnjoys({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        value,
      })
    );
  };

  const updateGoodProgressWith = (value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateGoodProgressWith({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
        value,
      })
    );
  };

  const updateHowCanCaregiverSupport = (value: string) => {
    if (!currentObservationPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateHowCanCaregiverSupport({
        childId,
        reportingPeriodId: currentObservationPeriod.id,
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
        classroomName: classroom!.name,
        practitionerName: `${
          practitionerForChild?.practitioner?.user?.firstName
        } ${practitionerForChild?.practitioner?.user?.surname || ''}`,
        principalName: `${classroom?.principal.firstName} ${
          classroom?.principal.surname || ''
        }`,
        principalPhoneNumber: classroom!.principal.phoneNumber,
      })
    );
  };

  const syncChildProgressReports = async () => {
    // add check for complete before syncing the data
    areObservationsComplete();
    await appDispatch(
      progressTrackingThunkActions.syncChildProgressReports({})
    );
  };

  const replaceSkillText = (skillText: string) => {
    return baseReplaceSkillText(skillText, child?.user?.firstName || '');
  };

  return {
    child,
    currentAge,
    observationsAgeGroup,
    skillsForAgeGroup,
    currentReport,
    currentObservationPeriod,
    currentObservations,
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
