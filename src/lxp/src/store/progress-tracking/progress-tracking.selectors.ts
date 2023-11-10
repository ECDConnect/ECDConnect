import {
  ActivityDto,
  PractitionerProgressReportSummaryDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { ProgressTrackingState } from '.';
import { ChildProgressSubCategoryAssessment } from '@models/classroom/progress-observation/ChildProgressAssessment';
import { RootState } from '../types';

// CATEGORIES
export const getProgressTrackingCategories = (
  state: RootState
): ProgressTrackingCategoryDto[] =>
  state.progressTracking.progressTrackingCategories || [];

export const getProgressTrackingCategoryById = (categoryId?: number) =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingCategories,
    (
      categories: ProgressTrackingCategoryDto[] | undefined
    ): ProgressTrackingCategoryDto | undefined => {
      if (!categories || !categoryId) return;

      return categories.find((category) => category.id === categoryId);
    }
  );

// SUB- CATEGORIES
export const getProgressTrackingSubCategories = (
  state: RootState
): ProgressTrackingSubCategoryDto[] =>
  state.progressTracking.progressTrackingSubCategories || [];

export const getProgressTrackingSubCategoriesByCategoryId = (
  categoryId?: number
) =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState || !categoryId) return;

      const category =
        rootState.progressTracking.progressTrackingCategories?.find(
          (x) => x.id === categoryId
        );
      const subCategoryIds = category?.subCategories?.map((x) => x.id);

      return rootState.progressTracking?.progressTrackingSubCategories?.filter(
        (subCategory) => subCategoryIds?.includes(subCategory.id)
      );
    }
  );

export const getProgressTrackingSubCategoryById = (subCategoryId?: number) =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingSubCategories,
    (
      subCategories: ProgressTrackingSubCategoryDto[] | undefined
    ): ProgressTrackingSubCategoryDto | undefined => {
      if (!subCategories || !subCategoryId) return;

      return subCategories.find(
        (subCategory) => subCategory.id === subCategoryId
      );
    }
  );

export const getProgressTrackingCategoryBySubCategoryId = (
  subCategoryId?: number
) =>
  createSelector(
    (state: RootState) => state.progressTracking,
    (
      progressTrackingState: ProgressTrackingState | undefined
    ): ProgressTrackingCategoryDto | undefined => {
      if (!progressTrackingState || !subCategoryId) return;

      let category: ProgressTrackingCategoryDto | undefined = undefined;

      progressTrackingState.progressTrackingCategories?.forEach((x) => {
        const ids = x.subCategories?.map((x) => x.id);

        if (ids && ids.includes(subCategoryId)) category = x;
      });

      return category;
    }
  );

// SKILLS
export const getProgressTrackingSkills = (
  state: RootState
): ProgressTrackingSkillDto[] =>
  state.progressTracking.progressTrackingSkills || [];

export const getProgressTrackingSkillById = (skillId: number) =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingSkills || [],
    (skills: ProgressTrackingSkillDto[]) => skills.find((x) => x.id === skillId)
  );

export const getProgressTrackingSkillsBySubCategoryId = (
  subCategoryId?: number
) =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState || !subCategoryId) return;

      const subCategory =
        rootState.progressTracking.progressTrackingSubCategories?.find(
          (x) => x.id === subCategoryId
        );
      const skillIds = subCategory?.skills.map((x) => x.id);

      return rootState.progressTracking?.progressTrackingSkills?.filter(
        (skill) => skillIds?.includes(skill.id)
      );
    }
  );

export const getChildProgressSubCategoryAssessments = (
  subCategoryIds?: number[],
  levelId?: number
) =>
  createSelector(
    (state: RootState) => state.progressTracking,
    (state: ProgressTrackingState) => {
      if (!state || !subCategoryIds || !levelId) return;

      const subCategoryAssessments: ChildProgressSubCategoryAssessment[] = [];

      const subCategories: ProgressTrackingSubCategoryDto[] =
        state.progressTrackingSubCategories
          ?.filter((subCategory) =>
            subCategoryIds.includes(subCategory.id || 0)
          )
          .sort((a, b) => (b?.id || 0) - (a?.id || 0)) || [];

      const level = state.progressTrackingLevels?.find(
        (level) => level.id === levelId
      );
      // redux state only has the id in the data.
      const subCategoriesSkillIds: number[] = subCategories?.flatMap(
        (subCategory) => subCategory.skills.map((skill) => skill.id)
      );

      const subCategoryLevelSkills = state.progressTrackingSkills?.filter(
        (skill) =>
          subCategoriesSkillIds.includes(skill.id) &&
          skill.level[0]?.id === levelId
      );

      if (subCategories && level && subCategoryLevelSkills) {
        for (const subCategory of subCategories) {
          const subCategorySkillIds = subCategory.skills.map((x) => x.id);

          const subCategorySkills = subCategoryLevelSkills
            .filter((skill) => subCategorySkillIds.includes(skill.id))
            .sort((a, b) => (b?.id || 0) - (a?.id || 0));

          const assessment: ChildProgressSubCategoryAssessment = {
            subCategory: subCategory,
            level: level,
            skills: subCategorySkills,
          };

          subCategoryAssessments.push(assessment);
        }
      }

      return subCategoryAssessments;
    }
  );

// LEVELS
export const getProgressTrackingLevels = (
  state: RootState
): ProgressTrackingLevelDto[] =>
  state.progressTracking.progressTrackingLevels || [];

export const getProgressTrackingLevelById = (levelId?: number) =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingLevels,
    (levels: ProgressTrackingLevelDto[] | undefined) => {
      if (!levels || !levelId) return;

      return levels.find((level) => level.id === levelId);
    }
  );

export const getActivityCategories = (activity: ActivityDto) =>
  createSelector(
    (state: RootState) =>
      state.progressTracking.progressTrackingCategories || [],
    (categories: ProgressTrackingCategoryDto[]) => {
      if (!activity || !activity.subCategories) return [];

      return categories.filter((cat) =>
        cat?.subCategories?.some((subCat) =>
          activity.subCategories.some((actSubCat) => actSubCat.id === subCat.id)
        )
      );
    }
  );

export const getPractitionerProgressReportSummary = (
  state: RootState
): PractitionerProgressReportSummaryDto | undefined =>
  state.progressTracking.practitionerProgressReportSummary || undefined;
