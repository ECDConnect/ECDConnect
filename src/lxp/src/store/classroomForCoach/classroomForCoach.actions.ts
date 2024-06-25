import { createAsyncThunk } from '@reduxjs/toolkit';
import { ClassroomGroupService } from '@services/ClassroomGroupService';
import { RootState, ThunkApiType } from '../types';
import { ClassroomDto } from '@/models/classroom/classroom.dto';
import ClassroomService from '@/services/ClassroomService/ClassroomService';

export const getClassroomForCoach = createAsyncThunk<
  ClassroomDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { id: string },
  ThunkApiType<RootState>
>(
  'getClassroomsForCoach',
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

// export const getClassroomGroups = createAsyncThunk<
//   ClassroomGroupDto[],
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   {},
//   ThunkApiType<RootState>
// >(
//   'getClassroomGroups',
//   // eslint-disable-next-line no-empty-pattern
//   async ({}, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//       classroomData: { classroomGroups: cache },
//     } = getState();

//     if (!cache) {
//       try {
//         let groups: ClassroomGroupDto[] | undefined;

//         if (userAuth?.auth_token) {
//           groups = await new ClassroomGroupService(
//             userAuth?.auth_token
//           ).getClassroomGroupsForUser();
//         } else {
//           return rejectWithValue('no access token, profile check required');
//         }

//         if (!groups) {
//           return rejectWithValue('Error getting Classroom Groups');
//         }

//         return groups;
//       } catch (err) {
//         return rejectWithValue(err);
//       }
//     } else {
//       return cache;
//     }
//   }
// );
