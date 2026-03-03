import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import { syncActions } from '.';
import { analyticsThunkActions } from '../analytics';
import { attendanceThunkActions } from '../attendance';
import { caregiverThunkActions } from '../caregiver';
import { childrenThunkActions } from '../children';
import { classroomsThunkActions } from '../classroom';
import { documentThunkActions } from '../document';
import { notesThunkActions } from '../notes';
import { programmeThunkActions } from '../programme';
import { RootState, ThunkApiType } from '../types';
import { userThunkActions } from '../user';

import { pqaThunkActions } from '../pqa';
import { calendarThunkActions } from '../calendar';
import { progressTrackingThunkActions } from '../progress-tracking';
import { statementsThunkActions } from '../statements';
import { practitionerThunkActions } from '../practitioner';
import { pointsThunkActions } from '../points';
import { settingActions } from '../settings';
import {
  classroomsForCoachActions,
  classroomsForCoachThunkActions,
} from '../classroomForCoach';
import { UserSyncStatus } from '@ecdlink/graphql';

type SyncStep = {
  title: string;
  action: AsyncThunk<boolean[] | any, any, any>;
};

const isNetworkError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;

  return (
    // Common fetch/axios-like network errors
    !('response' in error) &&
    (error.message.includes('Network') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed') ||
      error.name === 'TimeoutError' ||
      (error as any).code === 'ECONNABORTED')
  );
};

// Helper – same as you already have in the file
const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelayMs?: number;
    onRetry?: (attempt: number, error: unknown) => void;
  } = {}
): Promise<T> => {
  const { maxAttempts = 3, baseDelayMs = 1000, onRetry } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;

      if (!isNetworkError(err) || attempt === maxAttempts) {
        throw err;
      }

      const delay = baseDelayMs * 2 ** (attempt - 1);
      onRetry?.(attempt, err);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  throw lastError!;
};

export const syncOfflineData = createAsyncThunk<
  void,
  void,
  ThunkApiType<RootState>
>('sync/offlineData', async (any, { rejectWithValue, dispatch }) => {
  const syncSteps: SyncStep[] = [
    { title: 'User', action: userThunkActions.updateUser },
    { title: 'Calendar', action: calendarThunkActions.upsertCalendarEvents },
    { title: 'Care givers', action: caregiverThunkActions.upsertCareGivers },
    { title: 'Children', action: childrenThunkActions.upsertChildren },
    { title: 'Classrooms', action: classroomsThunkActions.upsertClassroom },
    {
      title: 'Classroom groups',
      action: classroomsThunkActions.upsertClassroomGroups,
    },
    {
      title: 'Classroom group programmes',
      action: classroomsThunkActions.upsertClassroomGroupProgrammes,
    },
    {
      title: 'Classroom group learners',
      action: classroomsThunkActions.upsertClassroomGroupLearners,
    },
    {
      title: 'Child progress reports',
      action: progressTrackingThunkActions.syncChildProgressReports,
    },
    { title: 'Attendance', action: attendanceThunkActions.trackAttendanceSync },
    { title: 'Notes', action: notesThunkActions.upsertNotes },
    { title: 'Programmes', action: programmeThunkActions.updateProgrammes },
    { title: 'Documents', action: documentThunkActions.createDocument },
    { title: 'User Consent', action: userThunkActions.upsertUserConsents },
    { title: 'Analytics', action: analyticsThunkActions.pushAnalytics },
    {
      title: 'Calendar events',
      action: calendarThunkActions.cancelCalendarEvent,
    },
    {
      title: 'Statements',
      action: statementsThunkActions.upsertIncomeStatements,
    },
  ];

  let hasCriticalError = false;
  let firstError: unknown = null;

  for (let i = 0; i < syncSteps.length; i++) {
    const { title, action } = syncSteps[i];

    dispatch(
      syncActions.setCurrentActionState({
        title: title,
        step: i + 1,
        stepTotal: syncSteps.length,
      })
    );

    try {
      await retryWithExponentialBackoff(() => dispatch(action({})).unwrap(), {
        maxAttempts: 3,
        baseDelayMs: 1000,
        onRetry: (attempt, err) => {
          console.warn(`[${title}] Network retry ${attempt}/3 after:`, err);
        },
      });
    } catch (err) {
      console.error(`Sync failed at "${title}":`, err);

      // Keep first error only (most meaningful one usually)
      if (!firstError) {
        firstError = err;
      }

      dispatch(
        syncActions.setError(
          err instanceof Error ? err.message : 'Unknown sync error'
        )
      );

      // Most steps are critical → stop on first real error
      hasCriticalError = true;
      break;
    }
  }

  if (hasCriticalError) {
    return rejectWithValue(
      firstError instanceof Error ? firstError.message : 'Offline sync failed'
    );
  }
});

export const syncOfflineDataForPractitioner = createAsyncThunk<
  void,
  void,
  ThunkApiType<RootState>
>(
  'sync/offlineDataForPractitioner',
  async (any, { rejectWithValue, dispatch }) => {
    const syncSteps: SyncStep[] = [
      { title: 'User', action: userThunkActions.updateUser },
      { title: 'Calendar', action: calendarThunkActions.upsertCalendarEvents },
      { title: 'Care givers', action: caregiverThunkActions.upsertCareGivers },
      { title: 'Children', action: childrenThunkActions.upsertChildren },
      {
        title: 'Classroom groups',
        action: classroomsThunkActions.upsertClassroomGroups,
      },
      {
        title: 'Classroom group programmes',
        action: classroomsThunkActions.upsertClassroomGroupProgrammes,
      },
      {
        title: 'Classroom group learners',
        action: classroomsThunkActions.upsertClassroomGroupLearners,
      },
      {
        title: 'Child progress reports',
        action: progressTrackingThunkActions.syncChildProgressReports,
      },
      {
        title: 'Attendance',
        action: attendanceThunkActions.trackAttendanceSync,
      },
      { title: 'Notes', action: notesThunkActions.upsertNotes },
      { title: 'Programmes', action: programmeThunkActions.updateProgrammes },
      { title: 'Documents', action: documentThunkActions.createDocument },
      { title: 'User Consent', action: userThunkActions.upsertUserConsents },
      { title: 'Analytics', action: analyticsThunkActions.pushAnalytics },
      { title: 'PQAs', action: pqaThunkActions.addVisitFormData },
      {
        title: 'PQAs Support Visits',
        action: pqaThunkActions.addSupportVisitFormData,
      },
      {
        title: 'PQAs Requested Support Visits',
        action: pqaThunkActions.addRequestedSupportVisitFormData,
      },
      {
        title: 'PQAs Follow up Visits',
        action: pqaThunkActions.addFollowUpVisitForPractitioner,
      },
      {
        title: 'ReAccreditation Follow up Visits',
        action: pqaThunkActions.addReAccreditationFollowUpVisitForPractitioner,
      },
      {
        title: 'Calendar events',
        action: calendarThunkActions.cancelCalendarEvent,
      },
    ];

    let hasCriticalError = false;
    let firstError: unknown = null;

    for (let i = 0; i < syncSteps.length; i++) {
      const { title, action } = syncSteps[i];

      dispatch(
        syncActions.setCurrentActionState({
          title: title,
          step: i + 1,
          stepTotal: syncSteps.length,
        })
      );

      try {
        await retryWithExponentialBackoff(() => dispatch(action({})).unwrap(), {
          maxAttempts: 3,
          baseDelayMs: 1000,
          onRetry: (attempt, err) => {
            console.warn(`[${title}] Network retry ${attempt}/3 after:`, err);
          },
        });
      } catch (err) {
        console.error(`Sync failed at "${title}":`, err);

        // Keep first error only (most meaningful one usually)
        if (!firstError) {
          firstError = err;
        }

        dispatch(
          syncActions.setError(
            err instanceof Error ? err.message : 'Unknown sync error'
          )
        );

        // Most steps are critical → stop on first real error
        hasCriticalError = true;
        break;
      }
    }

    if (hasCriticalError) {
      return rejectWithValue(
        firstError instanceof Error ? firstError.message : 'Offline sync failed'
      );
    }
  }
);

export const pullRemoteChanges = createAsyncThunk<
  void,
  { userId: string; isPrincipal: boolean; isCoach: boolean },
  ThunkApiType<RootState>
>(
  'sync/pullRemoteChanges',
  async ({ userId, isPrincipal, isCoach }, { dispatch, rejectWithValue }) => {
    try {
      // 1. Get sync status (critical – retry this one too)
      const userSyncStatus = (await retryWithExponentialBackoff(
        () => dispatch(userThunkActions.getUserSyncStatus({})).unwrap(),
        {
          maxAttempts: 3,
          onRetry: (attempt, err) =>
            console.warn(`[getUserSyncStatus] retry ${attempt}/3`, err),
        }
      )) as UserSyncStatus | undefined;

      if (!userSyncStatus) {
        console.warn('No sync status returned from server');
        return;
      }

      //console.log('userSyncStatus--------------------', userSyncStatus)

      // ──────────────────────────────────────────────────────────────
      // Children block
      // ──────────────────────────────────────────────────────────────
      if (userSyncStatus.syncChildren) {
        dispatch(
          syncActions.setCurrentActionState?.({
            title: 'Refreshing children data',
            step: 1,
            stepTotal: 4,
          })
        );

        if (isPrincipal) {
          await retryWithExponentialBackoff(
            () =>
              dispatch(
                childrenThunkActions.getChildrenForClassroom({ userId })
              ).unwrap(),
            { maxAttempts: 3 }
          );
        } else {
          await retryWithExponentialBackoff(
            () =>
              dispatch(
                childrenThunkActions.getChildren({ overrideCache: true })
              ).unwrap(),
            { maxAttempts: 3 }
          );
        }

        await Promise.all([
          retryWithExponentialBackoff(
            () =>
              dispatch(
                documentThunkActions.getDocuments({ overrideCache: true })
              ).unwrap(),
            { maxAttempts: 2 }
          ),
          retryWithExponentialBackoff(
            () =>
              dispatch(
                classroomsThunkActions.getClassroomGroups({
                  overrideCache: true,
                })
              ).unwrap(),
            { maxAttempts: 2 }
          ),
        ]);
      }

      // ──────────────────────────────────────────────────────────────
      // Classrooms block
      // ──────────────────────────────────────────────────────────────
      if (userSyncStatus.syncClassroom) {
        dispatch(
          syncActions.setCurrentActionState?.({
            title: 'Refreshing classroom data',
            step: 2,
            stepTotal: 5,
          })
        );

        // Core classroom data – sequential
        await retryWithExponentialBackoff(
          () =>
            dispatch(
              classroomsThunkActions.getClassroom({ overrideCache: true })
            ).unwrap(),
          { maxAttempts: 3 }
        );

        await retryWithExponentialBackoff(
          () =>
            dispatch(
              classroomsThunkActions.getClassroomGroups({
                overrideCache: true,
              })
            ).unwrap(),
          { maxAttempts: 3 }
        );

        if (isCoach) {
          dispatch(classroomsForCoachActions.resetClassroomState());

          await Promise.all([
            retryWithExponentialBackoff(
              () =>
                dispatch(
                  classroomsForCoachThunkActions.getClassroomForCoach({})
                ).unwrap(),
              { maxAttempts: 3 }
            ),
            retryWithExponentialBackoff(
              () =>
                dispatch(
                  classroomsForCoachThunkActions.getClassroomGroupsForCoach({})
                ).unwrap(),
              { maxAttempts: 3 }
            ),
          ]);
        }
      }

      // ──────────────────────────────────────────────────────────────
      // Other sections
      // ──────────────────────────────────────────────────────────────
      const otherPromises: Promise<any>[] = [];

      if (userSyncStatus.syncReportingPeriods) {
        otherPromises.push(
          retryWithExponentialBackoff(
            () =>
              dispatch(
                classroomsThunkActions.getClassroom({ overrideCache: true })
              ).unwrap(),
            { maxAttempts: 2 }
          )
        );
      }

      if (userSyncStatus.syncPermissions) {
        otherPromises.push(
          retryWithExponentialBackoff(
            () =>
              dispatch(
                practitionerThunkActions.getPractitionerPermissions({ userId })
              ).unwrap(),
            { maxAttempts: 2 }
          )
        );
      }

      if (userSyncStatus.syncPoints) {
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(now.getMonth() - 12);

        otherPromises.push(
          retryWithExponentialBackoff(
            () =>
              dispatch(pointsThunkActions.pointsTodoItems({ userId })).unwrap(),
            { maxAttempts: 2 }
          ),
          retryWithExponentialBackoff(
            () =>
              dispatch(pointsThunkActions.yearPointsView({ userId })).unwrap(),
            { maxAttempts: 2 }
          ),
          retryWithExponentialBackoff(
            () =>
              dispatch(
                pointsThunkActions.sharedData({ userId, isMonthly: true })
              ).unwrap(),
            { maxAttempts: 2 }
          ),
          retryWithExponentialBackoff(
            () =>
              dispatch(
                pointsThunkActions.getPointsSummaryForUser({
                  userId,
                  startDate: oneYearAgo,
                  endDate: now,
                })
              ).unwrap(),
            { maxAttempts: 2 }
          )
        );
      }

      if (otherPromises.length > 0) {
        await Promise.all(otherPromises);
      }

      // ──────────────────────────────────────────────────────────────
      // Success – mark as completed
      // ──────────────────────────────────────────────────────────────
      dispatch(settingActions.setLastDataSync());
    } catch (err: any) {
      console.error('Pull remote changes failed:', err);
      dispatch(syncActions.setError?.(err?.message ?? 'Sync failed'));

      return rejectWithValue(err?.message ?? 'Failed to pull remote changes');
    }
  }
);

export const triggerBackgroundSync = createAsyncThunk<
  void,
  { includeOfflineSyncData?: boolean },
  ThunkApiType<RootState>
>(
  'sync/triggerBackgroundSync',
  async (
    payload: { includeOfflineSyncData?: boolean } = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    const { includeOfflineSyncData = false } = payload;
    const state = getState();

    const user = state.user?.user;
    if (!user?.id) return;

    const isCoach = user?.roles?.some((r) => r.systemName === 'Coach') ?? false;
    const practitioner = state.practitioner.practitioner;

    try {
      await dispatch(
        pullRemoteChanges({
          userId: user?.id,
          isPrincipal: practitioner?.isPrincipal!,
          isCoach,
        })
      ).unwrap();

      if (includeOfflineSyncData) {
        if (practitioner?.isPrincipal) {
          await dispatch(syncOfflineData()).unwrap();
        } else {
          await dispatch(syncOfflineDataForPractitioner()).unwrap();
        }
      }
    } catch (err: any) {
      dispatch(syncActions.setError?.(err?.message ?? 'Background sync error'));
      return rejectWithValue(err);
    }
  }
);
