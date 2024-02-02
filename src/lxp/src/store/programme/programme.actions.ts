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
import { isBefore } from 'date-fns';

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
      classroomData: { classroom, classroomGroups },
    } = getState();

    try {
      if (userAuth?.auth_token && programmes) {
        for (let i = 0; i < programmes.length; i++) {
          let programme = programmes[i];

          const input: ProgrammeInput = {
            Id: programme.id,
            ClassroomId: programme.classroomId || classroom?.id,
            ClassroomGroupId:
              programme?.classroomGroupId ?? classroomGroups?.at(0)?.id,
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

export const updateProgrammes = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'updateProgrammes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      programmeData: { programmes },
      classroomData: { classroom, classroomGroups },
    } = getState();

    try {
      if (userAuth?.auth_token && programmes) {
        for (let i = 0; i < programmes.length; i++) {
          let programme = programmes[i];

          const input: ProgrammeModelInput = {
            id: programme.id,
            classroomId: programme.classroomId || classroom?.id,
            classroomGroupId:
              programme?.classroomGroupId ?? classroomGroups?.at(0)?.id ?? null,
            name: programme.name,
            startDate: programme.startDate,
            endDate: programme.endDate,
            preferredLanguage: programme.preferredLanguage,
            isActive: isBefore(new Date(), new Date(programme.endDate)),
            dailyProgrammes: programme.dailyProgrammes
              ? formatDailyProgrammes(programme)
              : undefined,
          };
          await new ProgrammeService(userAuth?.auth_token).updateProgrammes(
            input
          );
        }
      }
      return [true];
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
      storyBookId: daily.storyActivityId ?? 0,
      storyActivityId: daily.storyActivityId ?? 0,
      isActive: isBefore(new Date(), new Date(programme.endDate)),
    };
  });
};
