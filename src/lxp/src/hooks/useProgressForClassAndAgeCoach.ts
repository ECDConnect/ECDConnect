import { progressTrackingSelectors } from '@/store/progress-tracking';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ProgressReportsCategorySummary } from '@/models/progress/child-progress-report';
import { useProgressForChildrenCoach } from './useProgressForChildrenCoach';

export const useProgressForClassAndAgeGroupCoach = (
  practitionerId: string,
  ageGroupId: number
) => {
  const allAgeGroups = useSelector(
    progressTrackingSelectors.getProgressAgeGroups()
  );

  const categories = useSelector(
    progressTrackingSelectors.getProgressTrackingCategories()
  );

  const { childReports: allChildReports, currentReportingPeriodForSummary } =
    useProgressForChildrenCoach(practitionerId, true);

  const reportsSummary: ProgressReportsCategorySummary[] = useMemo(() => {
    const skillsToWorkOn = allChildReports
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
  }, [allChildReports, categories]);

  const ageGroup = useMemo(() => {
    return allAgeGroups.find((x) => x.id === ageGroupId)!;
  }, [allAgeGroups]);

  return {
    allChildReports,
    reportsSummary,
    ageGroup,
    currentReportingPeriodForSummary,
  };
};
