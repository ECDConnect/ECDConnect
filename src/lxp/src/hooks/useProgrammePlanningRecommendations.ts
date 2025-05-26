import {
  ActivityDto,
  ProgrammeDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core/';
import { useSelector } from 'react-redux';
import { activitySelectors } from '@store/content/activity';
import { progressTrackingSelectors } from '@store/progress-tracking';
import { getAllGroupActivityIds } from '@utils/classroom/programme-planning/programmes.utils';
import { format, getDay, isBefore, parseISO } from 'date-fns';
import { ActivityType } from '@/constants/ActivitySearch';

export type RecommendedActivity = {
  subCategory?: ProgressTrackingSubCategoryDto;
  activity: ActivityDto;
};

export const useProgrammePlanningRecommendations = () => {
  const activities = useSelector(activitySelectors.getActivities);
  const subCategories = useSelector(
    progressTrackingSelectors.getProgressTrackingSubCategories()
  );

  const getCurrentProgrammeRecommendedActivitiesByThemeActivity = (
    programme?: ProgrammeDto,
    selectedDate?: Date
  ): RecommendedActivity[] => {
    if (!programme || !selectedDate) return [];

    const plannedActivities = getAllGroupActivityIds(programme);

    // at least 10 small group & large group activities planned
    if (plannedActivities.length < 10) return [];

    // 1. Theme activity - the activity chosen for that day for the theme; on Mondays to Fridays within a theme,
    // always show the activity or story selected on that day as the recommended one. ""This is the theme activity for the day!""
    const filteredDailyProgrammes = programme?.dailyProgrammes?.filter(
      (day) => {
        // const dayDate = parseISO(day.dayDate.replace('Z', ''));
        const dayDate = new Date(day.dayDate);
        return (
          // isBefore(dayDate, selectedDate) &&
          format(dayDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
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

  // TODO: Remove this function if not needed (EC-2594)
  // const getActivitiesWithLowPercentageSubcategories = (
  //   programme?: ProgrammeDto
  // ) => {
  //   if (!programme) return [];

  //   const plannedActivities = getAllGroupActivityIds(programme);

  //   // Filtering activities based on the programme's planned activities
  //   const selectedActivities = activities.filter((activity) =>
  //     plannedActivities.includes(activity.id)
  //   );

  //   const selectedSubCategories = selectedActivities.flatMap(
  //     (activity) => activity.subCategories
  //   );

  //   // Calculate subcategory percentages
  //   const subCategoryPercentages = subCategories.map((subCategory) => {
  //     const count = selectedSubCategories.filter(
  //       (selectedSubCategory) => selectedSubCategory?.id === subCategory?.id
  //     ).length;
  //     const percentage = (count / (selectedSubCategories.length || 1)) * 100;
  //     return { subCategory, percentage };
  //   });

  //   // Filter subcategories with less than 5% representation
  //   const lowPercentageSubCategoryIds = subCategoryPercentages
  //     .filter(({ percentage }) => percentage < 5)
  //     .map(({ subCategory }) => subCategory.id);

  //   // Return activities containing at least one low percentage subcategory
  //   return selectedActivities.filter((activity) =>
  //     activity.subCategories.some((subCat) =>
  //       lowPercentageSubCategoryIds.includes(subCat.id)
  //     )
  //   );
  // };

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

        if (Math.round(subCategoryPercentage) < 5) {
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

    const recommendedActivitiesByThemeActivityBySubCat =
      getCurrentProgrammeRecommendedActivitiesBySubcategory(programme);

    if (recommendedActivitiesByThemeActivityBySubCat.length) {
      return recommendedActivitiesByThemeActivityBySubCat;
    }

    return recommendedActivitiesByThemeActivity;
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

  const countSubCategoryFrequency = (
    programme: ProgrammeDto,
    activities: ActivityDto[]
  ): Map<number, number> => {
    const frequency = new Map<number, number>();

    programme?.dailyProgrammes?.forEach((day) => {
      [day.smallGroupActivityId, day.largeGroupActivityId].forEach(
        (activityId) => {
          const activity = activities.find((a) => a.id === activityId);
          activity?.subCategories.forEach((subCategory) => {
            frequency.set(
              subCategory.id,
              (frequency.get(subCategory.id) || 0) + 1
            );
          });
        }
      );
    });

    return frequency;
  };

  const getSortedActivities = (
    activities: ActivityDto[],
    programme: ProgrammeDto,
    type: ActivityType
  ) => {
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // TODO: Remove this function if not needed (EC-2594)
    // const topIds = getActivitiesWithLowPercentageSubcategories(programme)?.map(
    //   (activity) => activity.id
    // );

    //////////////////////////////////////////////////////////////////////////////////////////////////////

    let topActivities = activities;

    if (type !== 'Story time') {
      const frequency = countSubCategoryFrequency(programme, activities);

      // Prioritize activities with least frequent subcategories
      topActivities = activities
        ?.filter((a) => a.type === type)
        ?.sort((a, b) => {
          const aMinFrequency = Math.min(
            ...a.subCategories.map((sc) => frequency.get(sc.id) || Infinity)
          );
          const bMinFrequency = Math.min(
            ...b.subCategories.map((sc) => frequency.get(sc.id) || Infinity)
          );

          return aMinFrequency - bMinFrequency;
        })
        ?.reverse();
    }

    const endIds = programme?.dailyProgrammes?.map((day) => {
      switch (type) {
        case 'Small group':
          return day.smallGroupActivityId;
        case 'Large group':
          return day.largeGroupActivityId;
        default:
          return day.storyActivityId;
      }
    });

    return topActivities.sort((a, b) => {
      const aIsEnd = endIds?.includes(a.id);
      const bIsEnd = endIds?.includes(b.id);

      if (aIsEnd && !bIsEnd) {
        return 1; // Move 'a' to the end
      } else if (!aIsEnd && bIsEnd) {
        return -1; // Keep 'b' at the end
      } else {
        return 0; // keep the original order for unaffected items
      }
    });
    //////////////////////////////////////////////////////////////////////////////////////////////////////

    // TODO: Remove this function if not needed (EC-2594)
    // .sort((a, b) => {
    //   const aIsTop = topIds.includes(a.id);
    //   const bIsTop = topIds.includes(b.id);

    //   if (aIsTop && !bIsTop) {
    //     return -1; // Move 'a' to the top
    //   } else if (!aIsTop && bIsTop) {
    //     return 1; // Keep 'b' at the top
    //   } else {
    //     return 0; // keep the original order for unaffected items
    //   }
    // });

    //////////////////////////////////////////////////////////////////////////////////////////////////////
  };

  return {
    getCurrentProgrammeRecommendedActivities,
    getAdditionalRecommendedSubCategories,
    getSortedActivities,
  };
};
