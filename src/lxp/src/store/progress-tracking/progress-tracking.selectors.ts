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
import { ProgressSkill } from '@/models/progress/progress-skill';
import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { getCurrentProgressReportPeriod as getCurrentProgressReportPeriod } from '../classroom/classroom.selectors';
import { ProgressReportPeriod } from '@/models/progress/progress-report-period';

// CATEGORIES
export const getProgressTrackingCategories = (
  state: RootState
): ProgressTrackingCategoryDto[] =>
  state.progressTracking.progressTrackingCategories.data;

export const getProgressTrackingCategoryById = (categoryId?: number) =>
  createSelector(
    (state: RootState) =>
      state.progressTracking.progressTrackingCategories.data,
    (
      categories: ProgressTrackingCategoryDto[]
    ): ProgressTrackingCategoryDto | undefined => {
      if (!categories || !categoryId) return;

      return categories.find((category) => category.id === categoryId);
    }
  );

// SUB- CATEGORIES
export const getProgressTrackingSubCategories = (
  state: RootState
): ProgressTrackingSubCategoryDto[] =>
  state.progressTracking.progressTrackingSubCategories.data;

export const getProgressTrackingSubCategoriesByCategoryId = (
  categoryId?: number
) =>
  createSelector(
    (state: RootState) => state,
    (rootState: RootState) => {
      if (!rootState || !categoryId) return;

      const category =
        rootState.progressTracking.progressTrackingCategories.data.find(
          (x) => x.id === categoryId
        );
      const subCategoryIds = category?.subCategories?.map((x) => x.id);

      return rootState.progressTracking?.progressTrackingSubCategories.data.filter(
        (subCategory) => subCategoryIds?.includes(subCategory.id)
      );
    }
  );

export const getProgressTrackingSubCategoryById = (subCategoryId?: number) =>
  createSelector(
    (state: RootState) =>
      state.progressTracking.progressTrackingSubCategories.data,
    (
      subCategories: ProgressTrackingSubCategoryDto[]
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

      progressTrackingState.progressTrackingCategories.data.forEach((x) => {
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
  state.progressTracking.progressTrackingSkills.data;

export const getProgressTrackingSkillById = (skillId: number) =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingSkills.data,
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
        rootState.progressTracking.progressTrackingSubCategories.data.find(
          (x) => x.id === subCategoryId
        );
      const skillIds = subCategory?.skills.map((x) => x.id);

      return rootState.progressTracking?.progressTrackingSkills.data.filter(
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
        state.progressTrackingSubCategories.data
          .filter((subCategory) => subCategoryIds.includes(subCategory.id || 0))
          .sort((a, b) => (b?.id || 0) - (a?.id || 0)) || [];

      const level = state.progressTrackingLevels?.find(
        (level) => level.id === levelId
      );
      // redux state only has the id in the data.
      const subCategoriesSkillIds: number[] = subCategories?.flatMap(
        (subCategory) => subCategory.skills.map((skill) => skill.id)
      );

      const subCategoryLevelSkills = state.progressTrackingSkills.data.filter(
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
      state.progressTracking.progressTrackingCategories.data,
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

export const getSkillsForAgeGroup = (ageGroupId: number) =>
  createSelector(
    (state: RootState) =>
      state.progressTracking.progressTrackingCategories.data,
    (state: RootState) =>
      state.progressTracking.progressTrackingSubCategories.data,
    (state: RootState) => state.progressTracking.progressTrackingSkills.data,
    (
      categories: ProgressTrackingCategoryDto[],
      subCategories: ProgressTrackingSubCategoryDto[],
      skills: ProgressTrackingSkillDto[]
    ) => {
      // Get all skills for age group
      const ageSkills = skills.filter((x) =>
        x.ageGroups?.some((x) => x.id === ageGroupId)
      );

      // Add categories and skills
      return ageSkills.map((skill) => {
        const subCategory = subCategories.find((x) =>
          x.skills.some((x) => x.id === skill.id)
        );
        const category = categories.find((x) =>
          x.subCategories.some((x) => x.id === subCategory?.id)
        );

        return {
          id: skill.id,
          name: skill.name,
          description: skill.description,
          subCategory: {
            id: subCategory?.id,
            name: subCategory?.name,
            category: {
              id: category?.id,
              name: category?.name,
            },
          },
        } as ProgressSkill;
      });
    }
  );

export const getCurrentObservationsForChild = (childId: string) =>
  createSelector(
    getCurrentProgressReportPeriod(),
    (state: RootState) => state.progressTracking.childProgressReports,
    (
      currentReportPeriod: ProgressReportPeriod | undefined,
      childProgressReports: ChildProgressReport[]
    ) => {
      if (!currentReportPeriod) {
        return undefined;
      }

      return childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.reportingPeriodId === currentReportPeriod.id
      );
    }
  );

export const getProgressReportsForChild = (childId: string) =>
  createSelector(
    (state: RootState) => state.progressTracking.childProgressReports,
    (childProgressReports: ChildProgressReport[]) => {
      return childProgressReports.filter((x) => x.childId === childId);
    }
  );
