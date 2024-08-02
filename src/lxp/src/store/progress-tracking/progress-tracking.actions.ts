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
import {
  ChildAttendanceReportModel,
  ChildProgressReportModel,
  ChildProgressReportModelInput,
} from '@ecdlink/graphql';
import { ChildProgressReport } from '@/models/progress/child-progress-report';

export const ProgressTrackingActions = {
  GET_PROGRESS_TRACKING_AGE_GROUPS: 'getProgressTrackingAgeGroup',
  GET_PROGRESS_TRACKING_CATEGORIES: 'getProgressTrackingCategories',
  GET_PROGRESS_TRACKING_SUB_CATEGORIES: 'getProgressTrackingSubCategories',
  GET_PROGRESS_TRACKING_SKILLS: 'getProgressTrackingSkills',
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

export const getProgressTrackingCategories = createAsyncThunk<
  ProgressTrackingCategoryDto[],
  { locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_PROGRESS_TRACKING_CATEGORIES,
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingCategories },
      user: { userLocalePreference },
    } = getState();

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (
      !!overrideCache ||
      !progressTrackingCategories.dateRefreshed ||
      isBefore(
        new Date(progressTrackingCategories.dateRefreshed),
        thirtyDaysAgo
      ) ||
      userLocalePreference !== locale
    ) {
      try {
        let categories: ProgressTrackingCategoryDto[] | undefined;

        if (userAuth?.auth_token) {
          categories = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingCategories(locale);
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
      return progressTrackingCategories.data;
    }
  }
);

export const getProgressTrackingSubCategories = createAsyncThunk<
  ProgressTrackingSubCategoryDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_PROGRESS_TRACKING_SUB_CATEGORIES,
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingSubCategories },
      user: { userLocalePreference },
    } = getState();

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (
      !!overrideCache ||
      !progressTrackingSubCategories.dateRefreshed ||
      isBefore(
        new Date(progressTrackingSubCategories.dateRefreshed),
        thirtyDaysAgo
      ) ||
      userLocalePreference !== locale
    ) {
      try {
        let subCategories: ProgressTrackingSubCategoryDto[] | undefined;

        if (userAuth?.auth_token) {
          subCategories = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingSubCategories(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!subCategories) {
          return rejectWithValue(
            'Error getting progress tracking sub-categories'
          );
        }

        return subCategories;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return progressTrackingSubCategories.data;
    }
  }
);

export const getProgressTrackingSkills = createAsyncThunk<
  ProgressTrackingSkillDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ProgressTrackingActions.GET_PROGRESS_TRACKING_SKILLS,
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingSkills },
      user: { userLocalePreference },
    } = getState();

    let thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (
      !!overrideCache ||
      !progressTrackingSkills.dateRefreshed ||
      isBefore(new Date(progressTrackingSkills.dateRefreshed), thirtyDaysAgo) ||
      userLocalePreference !== locale
    ) {
      try {
        let skills: ProgressTrackingSkillDto[] | undefined;

        if (userAuth?.auth_token) {
          skills = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingSkills(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!skills) {
          return rejectWithValue('Error getting progress tracking skills');
        }

        return skills;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return progressTrackingSkills.data;
    }
  }
);

export const getProgressTrackingLevels = createAsyncThunk<
  ProgressTrackingLevelDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; force?: boolean },
  ThunkApiType<RootState>
>(
  'getProgressTrackingLevels',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, force }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingLevels },
      user: { userLocalePreference },
    } = getState();

    if (!progressTrackingLevels || userLocalePreference !== locale || force) {
      try {
        let levels: ProgressTrackingLevelDto[] | undefined;

        if (userAuth?.auth_token) {
          levels = await new ProgressTrackingService(
            userAuth?.auth_token
          ).getProgressTrackingLevels(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!levels) {
          return rejectWithValue('Error getting progress tracking levels');
        }

        return levels;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return progressTrackingLevels;
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  { reportingPeriod: string },
  ThunkApiType<RootState>
>(
  'getPractitionerProgressReportSummary',
  // eslint-disable-next-line no-empty-pattern
  async ({ reportingPeriod }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let summary: PractitionerProgressReportSummaryDto | undefined;

      if (userAuth?.auth_token) {
        summary = await new ProgressTrackingService(
          userAuth?.auth_token
        ).practitionerProgressReportSummary(reportingPeriod);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!summary) {
        return rejectWithValue('Error getting progress tracking skills');
      }

      return summary;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
