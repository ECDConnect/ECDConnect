import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import ClassroomService from '@/services/ClassroomService/ClassroomService';
import { CoachService } from '@/services/CoachService';
import { ClassroomGroupDto as SimpleClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { OverrideCache } from '@/models/sync/override-cache';

export const ClassroomForCoachActions = {
  GET_CLASSROOM_FOR_COACH: 'getClassroomsForCoach',
  GET_CLASSROOM_GROUPS_FOR_COACH: 'getClassroomGroupsForCoach',
};

export const getClassroomForCoach = createAsyncThunk<
  ClassroomDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { id: string },
  ThunkApiType<RootState>
>(
  ClassroomForCoachActions.GET_CLASSROOM_FOR_COACH,
  // eslint-disable-next-line no-empty-pattern
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      classroomForCoachData: { classroomForCoach: classroomsForCoachCache },
    } = getState();

    let classroomsForCoach: ClassroomDto[] | undefined;

    if (userAuth?.auth_token) {
      classroomsForCoach = await new ClassroomService(
        userAuth?.auth_token
      ).getAllClassroomForCoach(id);
    } else {
      return rejectWithValue('no access token, profile check required');
    }
    if (!classroomsForCoach) {
      return rejectWithValue('Error getting Classrooms');
    }
    return classroomsForCoach;
  }
);

export const getClassroomGroupsForCoach = createAsyncThunk<
  SimpleClassroomGroupDto[],
  {} & OverrideCache,
  ThunkApiType<RootState>
>(
  ClassroomForCoachActions.GET_CLASSROOM_GROUPS_FOR_COACH,
  // eslint-disable-next-line no-empty-pattern
  async ({ overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      classroomForCoachData: { classroomGroupData: cache },
    } = getState();

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (
      !!overrideCache ||
      !cache ||
      !cache.dateRefreshed ||
      new Date(cache.dateRefreshed) < oneDayAgo
    ) {
      try {
        let groups: SimpleClassroomGroupDto[] | undefined;

        if (userAuth?.auth_token) {
          groups = await new CoachService(
            userAuth?.auth_token
          ).getClassroomGroupsForCoach(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!groups) {
          return rejectWithValue('Error getting Classroom Groups');
        }

        groups.sort((a, b) => {
          return (a.name || '') > (b.name || '') ? 1 : -1;
        });

        return groups;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return cache.classroomGroups;
    }
  }
);
