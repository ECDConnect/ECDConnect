import {
  ActivityDto,
  DailyProgrammeDto,
  ProgrammeThemeDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingSubCategoryDto,
  StoryBookDto,
} from '@ecdlink/core';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import { RecommendedActivity } from '@hooks/useProgrammePlanningRecommendations';

export const filterActivitiesByTheme = (
  activities: ActivityDto[],
  selectedThemes: ProgrammeThemeDto,
  type: DailyRoutineItemType
): ActivityDto[] => {
  const allThemeActivitesForType = getThemeActivities(selectedThemes, type);

  if (allThemeActivitesForType.length === 0) return [];

  return activities.filter((act) =>
    allThemeActivitesForType.some((themeAct) => act.id === themeAct.id)
  );
};

export const filterStorybooksByTheme = (
  storybooks: StoryBookDto[],
  selectedThemes: ProgrammeThemeDto
): StoryBookDto[] => {
  const allThemeStoryBooks = getThemeStoryBooks(selectedThemes);

  if (allThemeStoryBooks.length === 0) return [];

  return storybooks.filter((book) =>
    allThemeStoryBooks.some((themeStory) => book.id === themeStory.id)
  );
};

export const getProgressTrackingCategoryActivities = (
  activities: ActivityDto[],
  category: ProgressTrackingCategoryDto
) => {
  if (!category || !activities) return [];

  const filteredActivities: ActivityDto[] = [];

  for (const subCategory of category.subCategories) {
    const subCategoryActivities = activities.filter((activity) =>
      activity.subCategories.some(
        (activitySubCategory) => activitySubCategory.id === subCategory.id
      )
    );

    const distinctActivities = subCategoryActivities.filter(
      (subCategoryActivity) =>
        !filteredActivities.some(
          (filteredActivity) => filteredActivity.id === subCategoryActivity.id
        )
    );
    filteredActivities.push(...distinctActivities);
  }

  return filteredActivities;
};

export const getProgressTrackingSubCategoryActivities = (
  activities: ActivityDto[],
  subCategory: ProgressTrackingSubCategoryDto
) => {
  if (!subCategory || !activities) return [];

  return activities.filter((activity) => {
    if (activity?.subCategories?.length > 0) {
      return activity.subCategories.some(
        (activitySubCategory) => activitySubCategory.id === subCategory.id
      );
    }
    return false;
  });
};

const getThemeStoryBooks = (theme: ProgrammeThemeDto): StoryBookDto[] => {
  const validDays = theme.themeDays.filter((day) => day.storyBook);
  return validDays.map((day) => day.storyBook[0]);
};

const getThemeActivities = (
  theme: ProgrammeThemeDto,
  type: DailyRoutineItemType
): ActivityDto[] => {
  switch (type) {
    case DailyRoutineItemType.smallGroup: {
      const validDays = theme.themeDays.filter((day) => day.smallGroupActivity);

      return validDays.map((day) => day.smallGroupActivity[0]);
    }
    case DailyRoutineItemType.largeGroup: {
      const validDays = theme.themeDays.filter((day) => day.largeGroupActivity);
      return validDays.map((day) => day.largeGroupActivity[0]);
    }

    case DailyRoutineItemType.storyBook: {
      const validDays = theme.themeDays.filter((day) => day.storyActivity);
      return validDays.map((day) => day.storyActivity[0]);
    }
  }

  return [];
};

export const filterActivitiesByType = (
  type: string,
  activities: ActivityDto[]
) =>
  activities.filter(
    (act) => act.type && act.type.toLowerCase() === type.toLowerCase()
  );

export const getFirstActivityByType = (
  activities: RecommendedActivity[],
  type: DailyRoutineItemType
) => {
  if (!activities || !type) return undefined;

  return activities.find((act) => act.activity.type === type);
};

export const getRequiredActivitiesCount = (day?: DailyProgrammeDto): number => {
  if (!day) return 3;

  const undefinedActivityCount = [
    day.smallGroupActivityId,
    day.largeGroupActivityId,
    day.storyActivityId,
  ].filter((x) => x === undefined).length;
  return undefinedActivityCount;
};
