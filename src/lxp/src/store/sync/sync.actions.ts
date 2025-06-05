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

import { SyncOfflineDataProps, SyncOfflineDataReturnType } from './sync.types';
import { pqaThunkActions } from '../pqa';
import { calendarThunkActions } from '../calendar';
import { progressTrackingThunkActions } from '../progress-tracking';

type SyncStep = {
  title: string;
  action: AsyncThunk<boolean[] | any, any, any>;
};
export const syncOfflineData = createAsyncThunk<
  SyncOfflineDataProps,
  SyncOfflineDataReturnType,
  ThunkApiType<RootState>
>('sync/offlineData', async (any, { rejectWithValue, dispatch }) => {
  const syncSteps: SyncStep[] = [
    {
      title: 'User',
      action: userThunkActions.updateUser,
    },
    {
      title: 'Calendar',
      action: calendarThunkActions.upsertCalendarEvents,
    },
    {
      title: 'Care givers',
      action: caregiverThunkActions.upsertCareGivers,
    },
    {
      title: 'Children',
      action: childrenThunkActions.upsertChildren,
    },
    {
      title: 'Classrooms',
      action: classroomsThunkActions.upsertClassroom,
    },
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
    {
      title: 'Notes',
      action: notesThunkActions.upsertNotes,
    },
    {
      title: 'Programmes',
      action: programmeThunkActions.updateProgrammes,
    },
    {
      title: 'Documents',
      action: documentThunkActions.createDocument,
    },
    {
      title: 'User Consent',
      action: userThunkActions.upsertUserConsents,
    },
    {
      title: 'Analytics',
      action: analyticsThunkActions.pushAnalytics,
    },
    {
      title: 'Calendar events',
      action: calendarThunkActions.cancelCalendarEvent,
    },
  ];

  let error: Error | null = null;

  for (let i = 0; i < syncSteps.length; i++) {
    const step = syncSteps[i];

    dispatch(
      syncActions.setCurrentActionState({
        title: step.title,
        step: i + 1,
        stepTotal: syncSteps.length,
      })
    );

    try {
      await dispatch(step.action({})).unwrap();
    } catch (err) {
      console.error(err);
      dispatch(syncActions.setError((err as Error).message));
      error = err as Error;
      break;
    }
  }

  if (error) {
    return rejectWithValue(error.message);
  }

  return;
});

export const syncOfflineDataForPractitioner = createAsyncThunk<
  SyncOfflineDataProps,
  SyncOfflineDataReturnType,
  ThunkApiType<RootState>
>(
  'sync/offlineDataForPractitioner',
  async (any, { rejectWithValue, dispatch }) => {
    const syncSteps: SyncStep[] = [
      {
        title: 'User',
        action: userThunkActions.updateUser,
      },
      {
        title: 'Calendar',
        action: calendarThunkActions.upsertCalendarEvents,
      },
      {
        title: 'Care givers',
        action: caregiverThunkActions.upsertCareGivers,
      },
      {
        title: 'Children',
        action: childrenThunkActions.upsertChildren,
      },
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
      {
        title: 'Notes',
        action: notesThunkActions.upsertNotes,
      },
      {
        title: 'Programmes',
        action: programmeThunkActions.updateProgrammes,
      },
      {
        title: 'Documents',
        action: documentThunkActions.createDocument,
      },
      {
        title: 'User Consent',
        action: userThunkActions.upsertUserConsents,
      },
      {
        title: 'Analytics',
        action: analyticsThunkActions.pushAnalytics,
      },
      {
        title: 'PQAs',
        action: pqaThunkActions.addVisitFormData,
      },
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

    let error: Error | null = null;

    for (let i = 0; i < syncSteps.length; i++) {
      const step = syncSteps[i];

      dispatch(
        syncActions.setCurrentActionState({
          title: step.title,
          step: i + 1,
          stepTotal: syncSteps.length,
        })
      );

      try {
        await dispatch(step.action({})).unwrap();
      } catch (err) {
        console.error(err);
        dispatch(syncActions.setError((err as Error).message));
        error = err as Error;
        break;
      }
    }

    if (error) {
      return rejectWithValue(error.message);
    }

    return;
  }
);
