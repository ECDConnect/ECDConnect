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

  const currentObservations = useSelector(
    progressTrackingSelectors.getCurrentObservationsForChild(childId)
  );

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const allSkillsWithCurrentObservation = useMemo<ChildProgressSkill[]>(() => {
    return skillsForAgeGroup.map((x) => ({
      ...x,
      value: currentObservations?.skillObservations.find(
        (o) => o.skillId === x.id
      )?.value,
    }));
  }, [skillsForAgeGroup, currentObservations]);

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
    allSkillsWithCurrentObservation,
    currentReportingPeriod,
    addObservationForSkill,
  };
};
