import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';
import { ChildProgressSkill } from '@/models/progress/progress-skill';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { replaceSkillText } from '@/utils/child/child-progress-report.utils';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useProgressWalkthrough = () => {
  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const ageGroup = allAgeGroups.find((x) => x.endAgeInMonths === 5)!;

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(ageGroup?.id || 0)
  );

  const walkthroughObservations = useMemo<ChildProgressSkill[]>(() => {
    return skillsForAgeGroup.map((x) => ({
      ...x,
      value: undefined,
    }));
  }, [skillsForAgeGroup]);

  const walkthroughReplaceSkillText = (skillText: string) =>
    replaceSkillText(skillText, 'Temba');

  const walkthroughReportingPeriod: ProgressReportPeriod = {
    id: 'walkthrough',
    reportNumber: 1,
    startDate: new Date(new Date().getFullYear(), 8, 27),
    endDate: new Date(new Date().getFullYear(), 9, 5),
  };

  const walkthroughReport: ChildProgressDetailedReport = {
    id: 'walkthrough',
    childId: 'walkthrough',
    childProgressReportPeriodId: 'walkthrough',
    reportingPeriodNumber: walkthroughReportingPeriod.reportNumber,
    reportingPeriodStartDate: walkthroughReportingPeriod.startDate,
    reportingPeriodEndDate: walkthroughReportingPeriod.endDate,
    skillsToWorkOn: [],
    unknownPercentage: 0,
    unknownCount: 0,
    skillObservations: [],
    ageInMonthsAtReport: 3,
  };

  return {
    ageGroup,
    walkthroughObservations,
    walkthroughReportingPeriod,
    walkthroughReport,
    walkthroughReplaceSkillText,
  };
};
