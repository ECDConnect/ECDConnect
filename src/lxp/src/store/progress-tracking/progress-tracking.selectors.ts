import {
  ActivityDto,
  ChildDto,
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
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
import { ProgressTrackingCategoriesByLocale } from './progress-tracking.types';

// CATEGORIES
export const getProgressTrackingCategories = () =>
  createSelector(
    (state: RootState) => state.progressTracking.currentLocale,
    (state: RootState) =>
      state.progressTracking.progressTrackingContentByLocale,
    (
      currentLocale: string,
      progressContent: ProgressTrackingCategoriesByLocale
    ) => {
      if (!!progressContent[currentLocale]) {
        return progressContent[currentLocale].data;
      } else {
        return progressContent['en-za'].data;
      }
    }
  );

export const getProgressTrackingCategoryById = (categoryId?: number) =>
  createSelector(
    getProgressTrackingCategories(),
    (
      categories: ProgressTrackingCategoryDto[]
    ): ProgressTrackingCategoryDto | undefined => {
      if (!categories || !categoryId) return;

      return categories.find((category) => category.id === categoryId);
    }
  );

// SUB- CATEGORIES
export const getProgressTrackingSubCategories = () =>
  createSelector(
    getProgressTrackingCategories(),
    (
      categories: ProgressTrackingCategoryDto[]
    ): ProgressTrackingSubCategoryDto[] => {
      return categories.flatMap((x) => x.subCategories);
    }
  );

export const getProgressTrackingSubCategoriesByCategoryId = (
  categoryId?: number
) =>
  createSelector(
    getProgressTrackingCategories(),
    (categories: ProgressTrackingCategoryDto[]) => {
      if (!categoryId) return;

      const category = categories.find((x) => x.id === categoryId);

      return category?.subCategories;
    }
  );

export const getProgressTrackingSubCategoryById = (subCategoryId?: number) =>
  createSelector(
    getProgressTrackingSubCategories(),
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
  subCategoryId: number
) =>
  createSelector(
    getProgressTrackingCategories(),
    (
      categories: ProgressTrackingCategoryDto[]
    ): ProgressTrackingCategoryDto | undefined => {
      return categories.find((x) =>
        x.subCategories.some((y) => y.id === subCategoryId)
      );
    }
  );

export const getProgressTrackingSkills = () =>
  createSelector(
    getProgressTrackingCategories(),
    (categories: ProgressTrackingCategoryDto[]) => {
      return categories
        .flatMap((x) => x.subCategories)
        .flatMap((x) => x.skills);
    }
  );

export const getProgressTrackingSkillsWithCategoryInfo = () =>
  createSelector(
    getProgressTrackingCategories(),
    (categories: ProgressTrackingCategoryDto[]): ProgressSkill[] => {
      const detailedSkills = categories.flatMap((category) =>
        category.subCategories.flatMap((subCategory) =>
          subCategory.skills.map((skill) => ({
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
          }))
        )
      );

      return detailedSkills;
    }
  );

export const getProgressTrackingSkillById = (skillId: number) =>
  createSelector(
    getProgressTrackingSkills(),
    (skills: ProgressTrackingSkillDto[]) => skills.find((x) => x.id === skillId)
  );

export const getProgressTrackingSkillsBySubCategoryId = (
  subCategoryId: number
) =>
  createSelector(
    getProgressTrackingSubCategories(),
    (subCategories: ProgressTrackingSubCategoryDto[]) => {
      return subCategories.find((x) => x.id === subCategoryId)?.skills;
    }
  );

export const getChildProgressSubCategoryAssessments = (
  subCategoryIds?: number[],
  levelId?: number
) =>
  createSelector(
    getProgressTrackingSkills(),
    getProgressTrackingSubCategories(),
    (state: RootState) => state.progressTracking.progressTrackingLevels,
    (
      progressTrackingSkills: ProgressTrackingSkillDto[],
      progressTrackingSubCategories: ProgressTrackingSubCategoryDto[],
      progressTrackingLevels: ProgressTrackingLevelDto[] | undefined
    ) => {
      if (!subCategoryIds || !levelId) return;

      const subCategoryAssessments: ChildProgressSubCategoryAssessment[] = [];

      const subCategories: ProgressTrackingSubCategoryDto[] =
        progressTrackingSubCategories
          .filter((subCategory) => subCategoryIds.includes(subCategory.id || 0))
          .sort((a, b) => (b?.id || 0) - (a?.id || 0)) || [];

      const level = progressTrackingLevels?.find(
        (level) => level.id === levelId
      );
      // redux state only has the id in the data.
      const subCategoriesSkillIds: number[] = subCategories?.flatMap(
        (subCategory) => subCategory.skills.map((skill) => skill.id)
      );

      const subCategoryLevelSkills = progressTrackingSkills.filter(
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
    getProgressTrackingCategories(),
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
    getProgressTrackingSkills(),
    getProgressTrackingSkillsWithCategoryInfo(),
    (skills: ProgressTrackingSkillDto[], detailedSkills: ProgressSkill[]) => {
      // Get all skills for age group
      const ageSkills = skills.filter((x) =>
        x.ageGroups?.some((x) => x.id === ageGroupId)
      );

      return detailedSkills.filter((x) => ageSkills.some((y) => y.id === x.id));
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
          x.childProgressReportPeriodId === currentReportPeriod.id
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

export const getProgressReportsForReportingPeriod = (
  childProgressReportPeriodId: string
) =>
  createSelector(
    (state: RootState) => state.progressTracking.childProgressReports,
    (childProgressReports: ChildProgressReport[]) => {
      return childProgressReports.filter(
        (x) => x.childProgressReportPeriodId === childProgressReportPeriodId
      );
    }
  );

export const getProgressAgeGroups = () =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingAgeGroups.data,
    (progressTrackingAgeGroups: ProgressTrackingAgeGroupDto[]) => {
      return progressTrackingAgeGroups;
    }
  );
