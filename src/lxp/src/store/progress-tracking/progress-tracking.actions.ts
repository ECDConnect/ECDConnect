import {
  PractitionerProgressReportSummaryDto,
  ProgressTrackingCategoryDto,
  ProgressTrackingLevelDto,
  ProgressTrackingSkillDto,
  ProgressTrackingSubCategoryDto,
} from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProgressTrackingService } from '@services/ProgressTrackingService';
import { RootState, ThunkApiType } from '../types';

export const getProgressTrackingCategories = createAsyncThunk<
  ProgressTrackingCategoryDto[],
  { locale: string; force?: boolean },
  ThunkApiType<RootState>
>(
  'getProgressTrackingCategories',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, force }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingCategories },
      user: { userLocalePreference },
    } = getState();

    if (
      !progressTrackingCategories ||
      userLocalePreference !== locale ||
      force
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
      return progressTrackingCategories;
    }
  }
);

export const getProgressTrackingSubCategories = createAsyncThunk<
  ProgressTrackingSubCategoryDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; force?: boolean },
  ThunkApiType<RootState>
>(
  'getProgressTrackingSubCategories',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, force }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingSubCategories },
      user: { userLocalePreference },
    } = getState();

    if (
      !progressTrackingSubCategories ||
      userLocalePreference !== locale ||
      force
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
      return progressTrackingSubCategories;
    }
  }
);

export const getProgressTrackingSkills = createAsyncThunk<
  ProgressTrackingSkillDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { locale: string; force?: boolean },
  ThunkApiType<RootState>
>(
  'getProgressTrackingSkills',
  // eslint-disable-next-line no-empty-pattern
  async ({ locale, force }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      progressTracking: { progressTrackingSkills },
      user: { userLocalePreference },
    } = getState();

    if (!progressTrackingSkills || userLocalePreference !== locale || force) {
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
      return progressTrackingSkills;
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
