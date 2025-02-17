import { ProgrammeDto } from '@ecdlink/core';
import {
  DailyProgrammeInput,
  ProgrammeInput,
  DailyProgrammeModelInput,
  ProgrammeModelInput,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProgrammeService } from '@services/ProgrammeService';
import { RootState, ThunkApiType } from '../types';
import { isBefore, isSameDay } from 'date-fns';

export const ProgrammeActions = {
  UPDATE_PROGRAMMES: 'updateProgrammes',
};
export const getProgrammes = createAsyncThunk<
  ProgrammeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes: programmeCache },
    } = getState();

    if (!programmeCache) {
      try {
        let programmes: ProgrammeDto[] | undefined;

        if (userAuth?.auth_token) {
          programmes = await new ProgrammeService(
            userAuth?.auth_token
          ).getUserProgrammes();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmes) {
          return rejectWithValue('Error getting programmes');
        }

        return programmes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeCache;
    }
  }
);

export const getUserProgrammes = createAsyncThunk<
  ProgrammeDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getUserProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes: programmeCache },
    } = getState();

    if (!programmeCache || programmeCache.length === 0) {
      try {
        let programmes: ProgrammeDto[] | undefined;

        if (userAuth?.auth_token) {
          programmes = await new ProgrammeService(
            userAuth?.auth_token
          ).getUserProgrammes();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!programmes) {
          return rejectWithValue('Error getting programmes');
        }

        return programmes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return programmeCache;
    }
  }
);

export const upsertProgrammes = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes },
      classroomData: { classroom, classroomGroupData },
    } = getState();

    try {
      if (userAuth?.auth_token && programmes) {
        for (let i = 0; i < programmes.length; i++) {
          let programme = programmes[i];

          const input: ProgrammeInput = {
            Id: programme.id,
            ClassroomId: programme.classroomId || classroom?.id,
            ClassroomGroupId:
              programme?.classroomGroupId ??
              classroomGroupData.classroomGroups.at(0)?.id, // Why does this use the first?
            Name: programme.name,
            StartDate: programme.startDate,
            EndDate: programme.endDate,
            PreferredLanguage: programme.preferredLanguage,
            IsActive: isBefore(new Date(), new Date(programme.endDate)),
          };

          await new ProgrammeService(userAuth?.auth_token).updateProgramme(
            programme.id ?? '',
            input
          );

          for (let ix = 0; ix < programme.dailyProgrammes.length; ix++) {
            let daily = programme.dailyProgrammes[ix];
            const dailyInput: DailyProgrammeInput = {
              Id: daily.id,
              ProgrammeId: programme.id,
              Day: +daily.day,
              DayDate: daily.dayDate,
              MessageBoardText: daily.messageBoardText,
              SmallGroupActivityId: daily.smallGroupActivityId ?? 0,
              LargeGroupActivityId: daily.largeGroupActivityId ?? 0,
              StoryBookId: daily.storyActivityId ?? 0,
              StoryActivityId: daily.storyActivityId ?? 0,
              IsActive: isBefore(new Date(), new Date(programme.endDate)),
            };

            await new ProgrammeService(
              userAuth?.auth_token
            ).updateDailyProgramme(daily.id ?? '', dailyInput);
          }
        }
      }

      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProgramme = createAsyncThunk<
  ProgrammeModelInput[] | undefined,
  { programmeId: string },
  ThunkApiType<RootState>
>(
  ProgrammeActions.UPDATE_PROGRAMMES,
  // eslint-disable-next-line no-empty-pattern
  async ({ programmeId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes },
      classroomData: { classroom },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!programmes?.length) return undefined;
        if (!programmeId) return undefined;

        const inputs: ProgrammeModelInput[] = [];
        const programme = programmes.find((p) => p.id === programmeId);

        if (programme) {
          const input: ProgrammeModelInput = {
            id: programme.id,
            classroomId: programme.classroomId || classroom?.id,
            classroomGroupId: programme?.classroomGroupId,
            name: programme.name,
            startDate: programme.startDate,
            endDate: programme.endDate,
            preferredLanguage: programme.preferredLanguage,
            isActive:
              isBefore(new Date(), new Date(programme.endDate)) ||
              isSameDay(new Date(), new Date(programme.endDate)),
            dailyProgrammes: programme.dailyProgrammes
              ? formatDailyProgrammes(programme)
              : undefined,
          };

          await new ProgrammeService(userAuth?.auth_token).updateProgrammes(
            input
          );

          inputs.push(input);
        }

        return inputs;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProgrammes = createAsyncThunk<
  ProgrammeModelInput[] | undefined,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ProgrammeActions.UPDATE_PROGRAMMES,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes },
      classroomData: { classroom },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!programmes?.length) return undefined;

        const inputs: ProgrammeModelInput[] = [];

        for (let i = 0; i < programmes.length; i++) {
          let programme = programmes[i];

          // Skip if already synced;
          if (programme?.synced) continue;

          const input: ProgrammeModelInput = {
            id: programme.id,
            classroomId: programme.classroomId || classroom?.id,
            classroomGroupId: programme?.classroomGroupId,
            name: programme.name,
            startDate: programme.startDate,
            endDate: programme.endDate,
            preferredLanguage: programme.preferredLanguage,
            isActive:
              isBefore(new Date(), new Date(programme.endDate)) ||
              isSameDay(new Date(), new Date(programme.endDate)),
            dailyProgrammes: programme.dailyProgrammes
              ? formatDailyProgrammes(programme)
              : undefined,
          };
          await new ProgrammeService(userAuth?.auth_token).updateProgrammes(
            input
          );

          inputs.push(input);
        }

        return inputs;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const formatDailyProgrammes = (
  programme: ProgrammeDto
): DailyProgrammeModelInput[] => {
  return programme.dailyProgrammes.map((daily) => {
    return {
      id: daily.id,
      programmeId: programme.id,
      day: +daily.day,
      dayDate: daily.dayDate,
      messageBoardText: daily.messageBoardText,
      smallGroupActivityId: daily.smallGroupActivityId ?? 0,
      largeGroupActivityId: daily.largeGroupActivityId ?? 0,
      storyBookId: daily.storyBookId ?? 0,
      storyActivityId: daily.storyActivityId ?? 0,
      isActive:
        daily.isActive === false
          ? false
          : isSameDay(new Date(), new Date(programme.endDate)) ||
            isBefore(new Date(), new Date(programme.endDate)),
    };
  });
};
