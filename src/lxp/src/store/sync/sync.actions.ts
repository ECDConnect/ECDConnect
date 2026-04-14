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
import { queryErrorsActions, queryErrorsThunkActions } from '../queryErrors';
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

// --- Types ---
type SyncStep = {
  title: string;
  action: AsyncThunk<any, any, any>;
};

// --- Step Definitions (The "Outside" Lists) ---

/** Steps shared by all offline sync processes */
const SHARED_SYNC_STEPS: SyncStep[] = [
  { title: 'User', action: userThunkActions.syncUser },
  { title: 'Calendar', action: calendarThunkActions.upsertCalendarEvents },
  {
    title: 'Calendar events',
    action: calendarThunkActions.cancelCalendarEvent,
  },
  { title: 'API errors', action: queryErrorsThunkActions.upsertQueryErrors },
  { title: 'Analytics', action: analyticsThunkActions.pushAnalytics },
  {
    title: 'Walkthrough status: progress',
    action: practitionerThunkActions.updatePractitionerProgressWalkthrough,
  },
  {
    title: 'Walkthrough status: business',
    action: practitionerThunkActions.updatePractitionerBusinessWalkThrough,
  },
];

/** Steps specifically for Principals */
const PRINCIPAL_SYNC_STEPS: SyncStep[] = [
  ...SHARED_SYNC_STEPS,
  { title: 'Classrooms', action: classroomsThunkActions.upsertClassroom },
  {
    title: 'Classroom groups',
    action: classroomsThunkActions.upsertClassroomGroups,
  },
  { title: 'Care givers', action: caregiverThunkActions.upsertCareGivers },
  { title: 'Children', action: childrenThunkActions.upsertChildren },
  {
    title: 'Classroom group programmes',
    action: classroomsThunkActions.upsertClassroomGroupProgrammes,
  },
  {
    title: 'Classroom group learners',
    action: classroomsThunkActions.upsertClassroomGroupLearners,
  },
  { title: 'Attendance', action: attendanceThunkActions.trackAttendanceSync },
  { title: 'Programmes', action: programmeThunkActions.updateProgrammes },
  { title: 'Documents', action: documentThunkActions.createDocument },
  { title: 'Notes', action: notesThunkActions.upsertNotes },
  { title: 'User Consent', action: userThunkActions.upsertUserConsents },
  {
    title: 'Child progress report periods',
    action: classroomsThunkActions.upsertChildProgressReportPeriods,
  },
  {
    title: 'Child progress reports',
    action: progressTrackingThunkActions.syncChildProgressReports,
  },
  {
    title: 'Statements',
    action: statementsThunkActions.upsertIncomeStatements,
  },
];

/** Steps specifically for Practitioners */
const PRACTITIONER_SYNC_STEPS: SyncStep[] = [
  ...SHARED_SYNC_STEPS,

  { title: 'Care givers', action: caregiverThunkActions.upsertCareGivers },
  { title: 'Children', action: childrenThunkActions.upsertChildren },
  {
    title: 'Classroom group learners',
    action: classroomsThunkActions.upsertClassroomGroupLearners,
  },
  {
    title: 'Child progress reports',
    action: progressTrackingThunkActions.syncChildProgressReports,
  },
  { title: 'Attendance', action: attendanceThunkActions.trackAttendanceSync },
  { title: 'Programmes', action: programmeThunkActions.updateProgrammes },
  { title: 'Documents', action: documentThunkActions.createDocument },
  { title: 'Notes', action: notesThunkActions.upsertNotes },
  { title: 'User Consent', action: userThunkActions.upsertUserConsents },
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
];

// --- Helpers ---

const isNetworkError = (error: unknown): boolean => {
  if (!(error instanceof Error)) return false;
  return (
    !('response' in error) &&
    (error.message.includes('Network') ||
      error.message.includes('Failed to fetch') ||
      error.name === 'TimeoutError')
  );
};

const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelayMs?: number;
    onRetry?: (a: number, e: unknown) => void;
  } = {}
): Promise<T> => {
  const { maxAttempts = 3, baseDelayMs = 1000, onRetry } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (!isNetworkError(err) || attempt === maxAttempts) throw err;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      onRetry?.(attempt, err);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError!;
};

/** Reusable Sync Runner Logic */
async function runSyncSequence(
  steps: SyncStep[],
  { dispatch, rejectWithValue }: any
) {
  let firstError: unknown = null;

  for (let i = 0; i < steps.length; i++) {
    const { title, action } = steps[i];

    dispatch(
      syncActions.setCurrentActionState({
        title,
        step: i + 1,
        stepTotal: steps.length,
      })
    );

    try {
      await retryWithExponentialBackoff(() => dispatch(action({})).unwrap(), {
        maxAttempts: 3,
        onRetry: (a, e) => console.warn(`[${title}] Retry ${a}/3:`, e),
      });
      // console.log(`[Sync] ✅ Completed: ${title}`);
    } catch (err) {
      console.error(`[Sync] ❌ Failed at step "${title}":`, err);
      if (!firstError) firstError = err;
      dispatch(
        syncActions.setError(
          err instanceof Error ? err.message : 'Unknown sync error'
        )
      );
      continue;
    }
  }
}

// --- Thunks ---

export const syncOfflineData = createAsyncThunk<
  void,
  void,
  ThunkApiType<RootState>
>('sync/offlineData', async (_, api) =>
  runSyncSequence(PRINCIPAL_SYNC_STEPS, api)
);

export const syncOfflineDataForPractitioner = createAsyncThunk<
  void,
  void,
  ThunkApiType<RootState>
>('sync/offlineDataForPractitioner', async (_, api) =>
  runSyncSequence(PRACTITIONER_SYNC_STEPS, api)
);

export const pullRemoteChanges = createAsyncThunk<
  void,
  { userId: string; isPrincipal: boolean; isCoach: boolean },
  ThunkApiType<RootState>
>(
  'sync/pullRemoteChanges',
  async ({ userId, isPrincipal, isCoach }, { dispatch, rejectWithValue }) => {
    try {
      const userSyncStatus = (await retryWithExponentialBackoff(
        () => dispatch(userThunkActions.getUserSyncStatus({})).unwrap(),
        { maxAttempts: 3 }
      )) as UserSyncStatus | undefined;

      if (!userSyncStatus) return;

      // Children block
      if (userSyncStatus.syncChildren) {
        dispatch(
          syncActions.setCurrentActionState({
            title: 'Refreshing children data',
            step: 1,
            stepTotal: 4,
          })
        );

        const fetchChildrenAction = isPrincipal
          ? childrenThunkActions.getChildrenForClassroom({ userId })
          : childrenThunkActions.getChildren({ overrideCache: true });

        await retryWithExponentialBackoff(() =>
          dispatch(fetchChildrenAction).unwrap()
        );

        await Promise.all([
          retryWithExponentialBackoff(() =>
            dispatch(
              documentThunkActions.getDocuments({ overrideCache: true })
            ).unwrap()
          ),
          retryWithExponentialBackoff(() =>
            dispatch(
              classroomsThunkActions.getClassroomGroups({ overrideCache: true })
            ).unwrap()
          ),
        ]);
      }

      // Classrooms block
      if (userSyncStatus.syncClassroom) {
        dispatch(
          syncActions.setCurrentActionState({
            title: 'Refreshing classroom data',
            step: 2,
            stepTotal: 5,
          })
        );
        await retryWithExponentialBackoff(() =>
          dispatch(
            classroomsThunkActions.getClassroomForUser({ overrideCache: true })
          ).unwrap()
        );
        await retryWithExponentialBackoff(() =>
          dispatch(
            classroomsThunkActions.getClassroomGroups({ overrideCache: true })
          ).unwrap()
        );

        if (isCoach) {
          dispatch(classroomsForCoachActions.resetClassroomState());
          await Promise.all([
            retryWithExponentialBackoff(() =>
              dispatch(
                classroomsForCoachThunkActions.getClassroomForCoach({})
              ).unwrap()
            ),
            retryWithExponentialBackoff(() =>
              dispatch(
                classroomsForCoachThunkActions.getClassroomGroupsForCoach({})
              ).unwrap()
            ),
          ]);
        }
      }

      // Other Dynamic Sections
      const otherPromises: Promise<any>[] = [];
      if (userSyncStatus.syncReportingPeriods) {
        otherPromises.push(
          retryWithExponentialBackoff(() =>
            dispatch(
              classroomsThunkActions.getClassroomForUser({
                overrideCache: true,
              })
            ).unwrap()
          )
        );
      }
      if (userSyncStatus.syncPermissions) {
        otherPromises.push(
          retryWithExponentialBackoff(() =>
            dispatch(
              practitionerThunkActions.getPractitionerPermissions({
                userId,
                overrideCache: true,
              })
            ).unwrap()
          )
        );
      }
      if (userSyncStatus.syncPoints) {
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(now.getMonth() - 12);

        otherPromises.push(
          dispatch(
            pointsThunkActions.pointsTodoItems({ userId, overrideCache: true })
          ).unwrap(),
          dispatch(
            pointsThunkActions.yearPointsView({ userId, overrideCache: true })
          ).unwrap(),
          dispatch(
            pointsThunkActions.sharedData({
              userId,
              isMonthly: true,
              overrideCache: true,
            })
          ).unwrap(),
          dispatch(
            pointsThunkActions.getPointsSummaryForUser({
              userId,
              startDate: oneYearAgo,
              endDate: now,
              overrideCache: true,
            })
          ).unwrap()
        );
      }

      await Promise.all(otherPromises);
      dispatch(settingActions.setLastDataSync());
    } catch (err: any) {
      dispatch(syncActions.setError(err?.message ?? 'Sync failed'));
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
  async (payload = {}, { getState, dispatch, rejectWithValue }) => {
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
          isPrincipal: !!practitioner?.isPrincipal,
          isCoach,
        })
      ).unwrap();

      if (includeOfflineSyncData) {
        const syncAction = practitioner?.isPrincipal
          ? syncOfflineData
          : syncOfflineDataForPractitioner;
        await dispatch(syncAction()).unwrap();
      }
    } catch (err: any) {
      dispatch(syncActions.setError(err?.message ?? 'Background sync error'));
      return rejectWithValue(err);
    }
  }
);
