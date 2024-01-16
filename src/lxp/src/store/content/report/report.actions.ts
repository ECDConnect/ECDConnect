import {
  ChildProgressObservationReport,
  ChildProgressReportSummaryModel,
} from '@ecdlink/core';
import {
  ChildProgressReport,
  ChildProgressReportInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentReportService } from '@services/ContentReportService';
import { RootState, ThunkApiType } from '../../types';
import { ChildProgressReportQueryParams } from './report.types';

export const getUserContentChildProgressReports = createAsyncThunk<
  any[],
  ChildProgressReportQueryParams,
  ThunkApiType<RootState>
>(
  'getUserContentChildProgressReports',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      let content: any[] | undefined;

      if (userAuth?.auth_token) {
        content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).getUserContentChildProgressReports(userId);
      } else {
        return rejectWithValue('no access token');
      }

      if (!content) {
        return rejectWithValue('Error getting Child Progress Reports');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveUserContentChildProgressReport = createAsyncThunk<
  ChildProgressReport,
  ChildProgressReportInput,
  ThunkApiType<RootState>
>(
  'saveUserContentChildProgressReport',
  // eslint-disable-next-line no-empty-pattern
  async (childProgressReportInput, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).updateChildProgressReport(
          childProgressReportInput,
          childProgressReportInput.Id
        );
        return content;
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const syncChildProgressReports = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'syncChildProgressReports',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
      contentReportData: {
        unsyncedChildProgressReportsIds,
        childProgressionReports,
      },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      if (userAuth?.auth_token && unsyncedChildProgressReportsIds) {
        promises = unsyncedChildProgressReportsIds.map(async (x) => {
          const currentReportCopy = childProgressionReports?.find(
            (z) => z.id === x.reportId
          );
          if (!currentReportCopy) return Promise.resolve<boolean>(true);

          const childProgressReportInput: ChildProgressReportInput = {
            ChildId: currentReportCopy.childId,
            ClassroomGroupId: x.classroomGroupId,
            Id: currentReportCopy.id,
            ReportDate: currentReportCopy.reportingDate,
            ReportContent: JSON.stringify(currentReportCopy),
            IsActive: true,
            DateCompleted: currentReportCopy.dateCompleted,
          };

          return await new ContentReportService(
            userAuth?.auth_token,
            userLocalePreference
          ).syncChildProgressReport(childProgressReportInput);
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type UpdateChildProgressReportRequest = {
  input: ChildProgressReportInput;
  id: string;
};

export const updateChildProgressReport = createAsyncThunk<
  ChildProgressReport,
  UpdateChildProgressReportRequest,
  ThunkApiType<RootState>
>(
  'updateChildProgressReport',
  // eslint-disable-next-line no-empty-pattern
  async ({ input, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).updateChildProgressReport(input, id);

        return content;
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type GenerateChildProgressReportRequest = {
  childId: string;
  classgroupId: string;
  reportDate: Date;
};

export const generateChildProgressReport = createAsyncThunk<
  string,
  GenerateChildProgressReportRequest,
  ThunkApiType<RootState>
>(
  'generateChildProgressReport',
  // eslint-disable-next-line no-empty-pattern
  async (
    { childId, classgroupId, reportDate },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).generateChildProgressReport(childId, classgroupId, reportDate);

        return content;
      } else {
        return rejectWithValue('no access token');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getChildProgressReportSummary = createAsyncThunk<
  any,
  number,
  ThunkApiType<RootState>
>(
  'getChildProgressReportSummary',
  // eslint-disable-next-line no-empty-pattern
  async (count, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      let content: ChildProgressReportSummaryModel[] | undefined;

      if (userAuth?.auth_token) {
        content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).getChildProgressReportsSummary(count);
      } else {
        return rejectWithValue('no access token');
      }

      if (!content) {
        return rejectWithValue('Error getting Child Progress Reports');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDetailedProgressReports = createAsyncThunk<
  any,
  number,
  ThunkApiType<RootState>
>(
  'getDetailedProgressReports',
  // eslint-disable-next-line no-empty-pattern
  async (count, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      let content: ChildProgressObservationReport[] | undefined;

      if (userAuth?.auth_token) {
        content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).getDetailedProgressReports(count);
      } else {
        return rejectWithValue('no access token');
      }

      if (!content) {
        return rejectWithValue('Error getting Child Progress Reports');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDetailedProgressReport = createAsyncThunk<
  any,
  string,
  ThunkApiType<RootState>
>(
  'getDetailedProgressReport',
  // eslint-disable-next-line no-empty-pattern
  async (reportId, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      user: { userLocalePreference },
    } = getState();

    try {
      let content: ChildProgressObservationReport | undefined;

      if (userAuth?.auth_token) {
        content = await new ContentReportService(
          userAuth?.auth_token,
          userLocalePreference
        ).getDetailedProgressReport(reportId);
      } else {
        return rejectWithValue('no access token');
      }

      if (!content) {
        return rejectWithValue('Error getting Progress Report');
      }

      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
