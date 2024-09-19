import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import {
  replaceSkillText as baseReplaceSkillText,
  getProgressAgeGroupForChild,
} from '@/utils/child/child-progress-report.utils';
import { differenceInMonths } from 'date-fns';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressForChild = (childId: string) => {
  const child = useSelector(childrenSelectors.getChildById(childId));

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const allReports = useSelector(
    progressTrackingSelectors.getProgressReportsForChild(childId)
  );

  const allReportingPeriods = useSelector(
    classroomsSelectors.getAllProgressReportPeriods()
  );

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const currentAgeGroup = !!currentReportingPeriod
    ? getProgressAgeGroupForChild(
        currentReportingPeriod.endDate,
        child!,
        allAgeGroups
      )
    : undefined;

  const ageInMonths = !!child?.user?.dateOfBirth
    ? differenceInMonths(new Date(), new Date(child.user.dateOfBirth))
    : undefined;

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(currentAgeGroup?.id || 0)
  );

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  // Sets up reports, adding details for reporting period, skill names (for locale) etc
  const detailedReports = useMemo<ChildProgressDetailedReport[]>(() => {
    // Filter out incomplete reports from past reporting periods
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
        reportingPeriodStartDate: reportingPeriod!.startDate,
        reportingPeriodEndDate: reportingPeriod!.endDate,
        reportingPeriodNumber: reportingPeriod!.reportNumber,
        ageInMonthsAtReport: !!child?.user?.dateOfBirth
          ? differenceInMonths(
              new Date(reportingPeriod!.endDate),
              new Date(child.user.dateOfBirth)
            )
          : undefined,
      };
    });

    return details;
  }, [allReports, allReportingPeriods, currentReportingPeriod]);

  const currentReport = detailedReports.find(
    (x) => x.childProgressReportPeriodId === currentReportingPeriod?.id
  );

  return {
    child,
    ageInMonths,
    detailedReports,
    currentReportingPeriod,
    currentAgeGroup,
    currentReport,
  };
};
