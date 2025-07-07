import {
  ActivityDto,
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';
import { ProgressSkill } from '@/models/progress/progress-skill';
import { ChildProgressReport } from '@/models/progress/child-progress-report';
import { ProgressTrackingCategoriesByLocale } from './progress-tracking.types';
import { ResourceLink } from '@ecdlink/graphql';

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
        return progressContent[currentLocale]?.data;
      } else {
        return progressContent['en-za']?.data;
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
      return categories?.flatMap((x) => x.subCategories);
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
      const detailedSkills = categories?.flatMap((category) =>
        category?.subCategories?.flatMap((subCategory) =>
          subCategory?.skills?.map((skill) => ({
            id: skill.id,
            name: skill?.name,
            description: skill?.description,
            supportImage: skill?.supportImage,
            isReverseScored: skill?.isReverseScored,
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

export const getCurrentLocaleForReport = (state: RootState): string =>
  state.progressTracking.currentLocale || 'en-za';

export const getPractitionerProgressReportSummary = (
  state: RootState
): PractitionerProgressReportSummaryDto | undefined =>
  state.progressTracking.practitionerProgressReportSummary || undefined;

export const getSkillsForAgeGroup = (ageGroupId: number) =>
  createSelector(
    getProgressTrackingSkillsWithCategoryInfo(),
    (state: RootState) => state.progressTracking.progressTrackingAgeGroups.data,
    (
      detailedSkills: ProgressSkill[],
      ageGroups: ProgressTrackingAgeGroupDto[]
    ): ProgressSkill[] => {
      const ageGroup = ageGroups.find((x) => x.id === ageGroupId);

      if (!ageGroup || !detailedSkills) {
        return [];
      }

      return ageGroup.skills.map((ageGroupSkill) => {
        const skill = detailedSkills.find(
          (skill) => skill.id === ageGroupSkill
        );
        return skill!;
      });
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

export const getProgressReports = () =>
  createSelector(
    (state: RootState) => state.progressTracking.childProgressReports,
    (childProgressReports: ChildProgressReport[]) => {
      return childProgressReports;
    }
  );

export const getProgressAgeGroups = () =>
  createSelector(
    (state: RootState) => state.progressTracking.progressTrackingAgeGroups.data,
    (progressTrackingAgeGroups: ProgressTrackingAgeGroupDto[]) => {
      return progressTrackingAgeGroups;
    }
  );

export const getResourceLinks = () =>
  createSelector(
    (state: RootState) => state.progressTracking.resourceLinks,
    (resourceLinks: ResourceLink[] | undefined) => {
      return resourceLinks?.filter((item) => item?.title) || [];
    }
  );
