import { useAppDispatch } from '@/store';
import { classroomsSelectors } from '@/store/classroom';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useObserveProgressForChildren } from './useObserveProgressForChildren';

export const useObserveProgressForClassAndAgeGroup = (
  classroomGroupId: string,
  ageGroupId: number
) => {
  const appDispatch = useAppDispatch();

  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );

  const { childReports: allChildReports, currentReportingPeriod } =
    useObserveProgressForChildren();

  const childReports = useMemo(() => {
    return allChildReports.filter((report) =>
      classroomGroup?.learners.some(
        (learner) =>
          learner.childUserId === report.childUserId &&
          report.ageGroup?.id === ageGroupId
      )
    );
  }, [allChildReports, classroomGroup, ageGroupId]);

  const reportsSummary = useMemo(() => {
    const skillsToWorkOn = childReports
      .flatMap((x) => x.report.skillsToWorkOn || [])
      .map((x) => x.skillId);

    const structureWithCounts = categories
      // Filter to on categories in use
      .filter((c) =>
        c.subCategories
          .flatMap((sc) => sc.skills)
          .some((s) => skillsToWorkOn.some((wo) => wo === s.id))
      )
      .map((cat) => ({
        ...cat,
        subCategories: cat.subCategories
          .filter((sc) =>
            sc.skills.some((s) => skillsToWorkOn.some((wo) => wo === s.id))
          )
          .map((subCat) => ({
            ...subCat,
            skills: subCat.skills
              .filter((s) => skillsToWorkOn.some((wo) => wo === s.id))
              .map((skill) => ({
                ...skill,
                childrenWorkingOnSkillCount: skillsToWorkOn.filter(
                  (x) => x === skill.id
                ).length,
              })),
          })),
      }));

    return structureWithCounts;
  }, [childReports, categories]);

  const ageGroup = useMemo(() => {
    return allAgeGroups.find((x) => x.id === ageGroupId)!;
  }, [allAgeGroups]);

  return {
    classroomGroup,
    currentReportingPeriod,
    childReports,
    reportsSummary,
    ageGroup,
  };
};
