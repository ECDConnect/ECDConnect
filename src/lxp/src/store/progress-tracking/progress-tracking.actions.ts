import {
  PractitionerProgressReportSummaryDto,
  ProgressTrackingAgeGroupDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProgressTrackingService } from '@services/ProgressTrackingService';
import { RootState, ThunkApiType } from '../types';
import { OverrideCache } from '@/models/sync/override-cache';
import { isBefore } from 'date-fns';
import { ChildProgressReportModelInput, ResourceLink } from '@ecdlink/graphql';
import { ChildProgressReport } from '@/models/progress/child-progress-report';

export const ProgressTrackingActions = {
  GET_PROGRESS_TRACKING_AGE_GROUPS: 'getProgressTrackingAgeGroup',
  GET_PROGRESS_TRACKING_CATEGORIES: 'getProgressTrackingCategories',
  GET_PROGRESS_TRACKING_SUB_CATEGORIES: 'getProgressTrackingSubCategories',
  GET_PROGRESS_TRACKING_SKILLS: 'getProgressTrackingSkills',
  GET_PROGRESS_TRACKING_STRUCTURE: 'getProgressTrackingStructure',
  SYNC_CHILD_PROGRESS_REPORTS: 'syncChildProgressReports',
  GET_CHILD_PROGRESS_REPORTS: 'getChildProgressReports',
};

export const getProgressTrackingAgeGroups = createAsyncThunk<
  ProgressTrackingAgeGroupDto[],
  { locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_PROGRESS_TRACKING_AGE_GROUPS,
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingAgeGroups },
      user: { userLocalePreference },
    } = getState();

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (
      !!overrideCache ||
      !progressTrackingAgeGroups.dateRefreshed ||
      isBefore(
        new Date(progressTrackingAgeGroups.dateRefreshed),
        thirtyDaysAgo
      ) ||
      userLocalePreference !== locale
    ) {
      try {
        let categories: ProgressTrackingAgeGroupDto[] | undefined;

        if (userAuth?.auth_token) {
          categories = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingAgeGroups(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!categories) {
          return rejectWithValue('Error getting progress tracking categories');
        }

        return categories;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return progressTrackingAgeGroups.data;
    }
  }
);

export const getProgressTrackingContent = createAsyncThunk<
  ProgressTrackingCategoryDto[],
  { locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_PROGRESS_TRACKING_STRUCTURE,
  async ({ locale, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: {
        progressTrackingContentByLocale: progressTrackingCategoriesByLocale,
      },
      user: { userLocalePreference },
    } = getState();

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const currentLocaleData = progressTrackingCategoriesByLocale[locale];

    if (
      !!overrideCache ||
      !currentLocaleData ||
      !currentLocaleData.dateRefreshed ||
      isBefore(new Date(currentLocaleData.dateRefreshed), thirtyDaysAgo) ||
      userLocalePreference !== locale
    ) {
      try {
        let categories: ProgressTrackingCategoryDto[] | undefined;
        let subCategories: ProgressTrackingSubCategoryDto[] | undefined;
        let skills: ProgressTrackingSkillDto[] | undefined;

        if (userAuth?.auth_token) {
          // TODO - Once categories and sub categories are correctly set up for other languages, remove fixed en-za fetch and replace with locale variable
          categories = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingCategories(locale);

          // TODO - Once categories and sub categories are correctly set up for other languages, remove fixed en-za fetch and replace with locale variable
          subCategories = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingSubCategories(locale);

          skills = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingSkills(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!skills || !categories || !subCategories) {
          return rejectWithValue('Error getting progress tracking skills');
        }

        // Build full structure
        return categories.map((cat) => {
          return {
            ...cat,
            subCategories: cat?.subCategories
              ?.filter((x) => subCategories!.some((y) => y.id === x.id))
              .map((subCatMin) => {
                const subCategory = subCategories!.find(
                  (x) => x.id === subCatMin.id
                )!;

                return {
                  ...subCategory,
                  skills: subCategory?.skills
                    ?.filter((x) => skills!.some((y) => y.id === x.id))
                    .map((skillMin) => {
                      const skill = skills!.find((x) => x.id === skillMin.id)!;
                      return skill;
                    }),
                };
              }),
          };
        });
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return currentLocaleData.data;
    }
  }
);

export const getResourceLinks = createAsyncThunk<
  ResourceLink[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; force?: boolean },
  ThunkApiType<RootState>
>(
  'getResourceLinks',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, force }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { resourceLinks },
      user: { userLocalePreference },
    } = getState();

    if (!resourceLinks || userLocalePreference !== locale || force) {
      try {
        let resources: ResourceLink[] | undefined;

        if (userAuth?.auth_token) {
          resources = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressResourcesLinks(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!resources) {
          return rejectWithValue('Error getting progress tracking levels');
        }

        return resources;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return resourceLinks;
    }
  }
);

export const syncChildProgressReports = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.SYNC_CHILD_PROGRESS_REPORTS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { childProgressReports },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      if (userAuth?.auth_token && childProgressReports.some((x) => !x.synced)) {
        promises = childProgressReports
          .filter((x) => !x.synced)
          .map(async (report) => {
            const childProgressReportInput: ChildProgressReportModelInput = {
              childId: report.childId,
              childProgressReportPeriodId: report.childProgressReportPeriodId,
              dateCreated: new Date(report.dateCreated),
              id: report.id,
              dateCompleted: report.dateCompleted,
              howToSupport: report.howToSupport,
              notes: report.notes,
              skillObservations: report.skillObservations,
              skillsToWorkOn: report.skillsToWorkOn,
              observationsCompleteDate: report.observationsCompleteDate,
              childEnjoys: report.childEnjoys,
              goodProgressWith: report.goodProgressWith,
              howCanCaregiverSupport: report.howCanCaregiverSupport,
              classroomName: report.classroomName,
              practitionerName: report.practitionerName,
              principalName: report.principalName,
              principalPhoneNumber: report.principalPhoneNumber,
            };

            return await new ProgressTrackingService(
              userAuth?.auth_token
            ).createOrUpdateChildProgressReport(childProgressReportInput);
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getChildProgressReports = createAsyncThunk<
  ChildProgressReport[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_CHILD_PROGRESS_REPORTS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const reports = await new ProgressTrackingService(
          userAuth?.auth_token
        ).getChildProgressReportsForUser(userAuth.id);

        return reports;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getPractitionerProgressReportSummary = createAsyncThunk<
  PractitionerProgressReportSummaryDto,
  { reportingPeriod: string },
  ThunkApiType<RootState>
>(
  'getPractitionerProgressReportSummary',
  async ({ reportingPeriod }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const summary = await new ProgressTrackingService(
          userAuth?.auth_token
        ).practitionerProgressReportSummary(reportingPeriod);

        if (!summary) {
          return rejectWithValue('Error getting progress report summary');
        }

        return summary;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);
