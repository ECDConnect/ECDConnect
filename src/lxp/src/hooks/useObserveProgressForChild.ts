import { ChildProgressDetailedReport } from '@/models/progress/child-progress-report';
import { ChildProgressSkill } from '@/models/progress/progress-skill';
import { useAppDispatch } from '@/store';
import { childrenSelectors } from '@/store/children';
import { classroomsSelectors } from '@/store/classroom';
import {
  progressTrackingActions,
  progressTrackingSelectors,
} from '@/store/progress-tracking';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const useObserveProgressForChild = (childId: string) => {
  const appDispatch = useAppDispatch();

  const child = useSelector(childrenSelectors.getChildById(childId));

  const currentAgeGroup = useSelector(
    childrenSelectors.getProgressAgeGroupForChild(childId)
  );

  const skillsForAgeGroup = useSelector(
    progressTrackingSelectors.getSkillsForAgeGroup(currentAgeGroup?.id || 0)
  );

  const currentObservationsForChild = useSelector(
    progressTrackingSelectors.getCurrentObservationsForChild(childId)
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

  const isAllObservationsComplete =
    skillsForAgeGroup.length ===
    currentObservationsForChild?.skillObservations.length;

  const currentObservations = useMemo<ChildProgressSkill[]>(() => {
    return skillsForAgeGroup.map((x) => ({
      ...x,
      value: currentObservationsForChild?.skillObservations.find(
        (o) => o.skillId === x.id
      )?.value,
    }));
  }, [skillsForAgeGroup, currentObservationsForChild]);

  // Sets up reports, adding details for reporting period, kills names (for locale) etc
  const detailedReports = useMemo<ChildProgressDetailedReport[]>(() => {
    const details = allReports.map((observation) => {
      const reportingPeriod = allReportingPeriods.find(
        (x) => x.id === observation.reportingPeriodId
      );

      return {
        ...observation,
        skillObservations: observation.skillObservations.map((skillObs) => {
          const skill = skillsForAgeGroup.find(
            (x) => x.id === skillObs.skillId
          );
          return {
            ...skillObs,
            skillName: skill?.name || '',
            subCategoryId: skill?.subCategory.id || 0,
            categoryId: skill?.subCategory.category.id || 0,
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
      (x) => x.reportingPeriodId === currentReportingPeriod?.id
    );
  }, [detailedReports, currentReportingPeriod]);

  const completedReports = useMemo(() => {
    return detailedReports.filter((x) => x.isComplete);
  }, [detailedReports, currentReportingPeriod]);

  const addObservationForSkill = (skillId: number, value: string) => {
    if (!currentReportingPeriod) {
      return;
    }

    appDispatch(
      progressTrackingActions.updateSkill({
        childId,
        reportingPeriodId: currentReportingPeriod.id,
        skillId,
        value,
      })
    );
  };

  return {
    child,
    currentAgeGroup,
    skillsForAgeGroup,
    isAllObservationsComplete,
    currentObservations,
    currentReport,
    completedReports,
    currentReportingPeriod,
    addObservationForSkill,
  };
};
