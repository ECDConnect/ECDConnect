import {
  ActivityDto,
  ProgrammeDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core/';
import { useSelector } from 'react-redux';
import { activitySelectors } from '@store/content/activity';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { getAllGroupActivityIds } from '@utils/classroom/programme-planning/programmes.utils';
import { getDay, isBefore, parseISO } from 'date-fns';

export type RecommendedActivity = {
  subCategory?: ProgressTrackingSubCategoryDto;
  activity: ActivityDto;
};

export const useProgrammePlanningRecommendations = () => {
  const activities = useSelector(activitySelectors.getActivities);
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories
  );

  const getCurrentProgrammeRecommendedActivitiesByThemeActivity = (
    programme?: ProgrammeDto,
    selectedDate?: Date
  ): RecommendedActivity[] => {
    if (!programme || !selectedDate) return [];

    const plannedActivities = getAllGroupActivityIds(programme);

    // at least 10 small group & large group activities planned
    if (plannedActivities.length < 10) return [];

    const filteredDailyProgrammes = programme?.dailyProgrammes?.filter(
      (day) => {
        const dayDate = parseISO(day.dayDate.replace('Z', ''));

        return (
          isBefore(dayDate, selectedDate) &&
          getDay(dayDate) === getDay(selectedDate)
        );
      }
    );

    if (filteredDailyProgrammes?.length) {
      const filteredActivities = getAllGroupActivityIds({
        ...programme,
        dailyProgrammes: filteredDailyProgrammes,
      });

      const selectedActivities = activities?.filter((x) =>
        filteredActivities?.includes(x.id)
      );

      return selectedActivities?.map((activity) => ({
        activity,
      }));
    }

    return [];
  };

  const getCurrentProgrammeRecommendedActivitiesBySubcategory = (
    programme?: ProgrammeDto
  ): RecommendedActivity[] => {
    if (!programme) return [];

    const plannedActivities = getAllGroupActivityIds(programme);

    // at least 10 small group & large group activities planned
    if (plannedActivities.length >= 10) {
      const selectedActivities = activities.filter((x) =>
        plannedActivities?.includes(x.id)
      );

      const selectedSubCategories: ProgressTrackingSubCategoryDto[] =
        selectedActivities.flatMap((x) => x.subCategories);
      const recommendedActivities: RecommendedActivity[] = [];

      for (const subCategory of subCategories) {
        const subCategoryPercentage =
          (selectedSubCategories.filter(
            (selectedSubCategory) => selectedSubCategory?.id === subCategory?.id
          ).length /
            (selectedSubCategories.length || 1)) *
          100;

        if (subCategoryPercentage < 5) {
          // exclude existing planned activities
          const recommendedActivity = activities.find(
            (activity) =>
              (activity.subCategories || []).some(
                (subCat) => subCat?.id === subCategory?.id
              ) && !plannedActivities.some((pa) => pa === activity.id)
          );

          if (recommendedActivity)
            recommendedActivities.push({
              subCategory,
              activity: recommendedActivity,
            });
        }
      }

      return recommendedActivities;
    }

    return [];
  };

  const getCurrentProgrammeRecommendedActivities = (
    programme?: ProgrammeDto,
    selectedDate?: Date
  ): RecommendedActivity[] => {
    const recommendedActivitiesByThemeActivity =
      getCurrentProgrammeRecommendedActivitiesByThemeActivity(
        programme,
        selectedDate
      );

    if (recommendedActivitiesByThemeActivity.length) {
      return recommendedActivitiesByThemeActivity;
    }

    return getCurrentProgrammeRecommendedActivitiesBySubcategory(programme);
  };

  const getAdditionalRecommendedSubCategories = (
    programme?: ProgrammeDto
  ): ProgressTrackingSubCategoryDto[] => {
    if (!programme) return [];

    const plannedActivities = getAllGroupActivityIds(programme);

    // LETS MAKE SURE WE HAVE 10x ACTIVITIES SELECTED
    if (plannedActivities.length < 10) return [];

    const currentActivities = activities.filter((x) =>
      plannedActivities?.includes(x.id)
    );

    const recommendedSubCategories: ProgressTrackingSubCategoryDto[] = [];
    const selectedSubCategories: ProgressTrackingSubCategoryDto[] =
      currentActivities.flatMap((x) => x.subCategories);

    for (const subCategory of subCategories) {
      const subCategoryPercentage =
        (selectedSubCategories.filter(
          (selectedSubCategory) => selectedSubCategory?.id === subCategory?.id
        ).length /
          (selectedSubCategories.length || 1)) *
        100;

      if (subCategoryPercentage < 5) {
        if (
          !recommendedSubCategories.some(
            (recommendedSubCat) => recommendedSubCat?.id === subCategory?.id
          )
        )
          recommendedSubCategories.push(subCategory);
      }
    }

    return recommendedSubCategories;
  };

  return {
    getCurrentProgrammeRecommendedActivities,
    getAdditionalRecommendedSubCategories,
  };
};
