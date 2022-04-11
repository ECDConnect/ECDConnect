import { ProgrammeDto } from '@ecdlink/core';
import { DailyProgrammeInput, ProgrammeInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProgrammeService } from '@services/ProgrammeService';
import { RootState, ThunkApiType } from '../types';

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
          ).getProgrammes(userAuth.id);
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
      classroomData: { classroom },
    } = getState();

    try {
      if (userAuth?.auth_token && programmes) {
        const _programmeService = new ProgrammeService(userAuth?.auth_token);
        for (let i = 0; i < programmes.length; i++) {
          let programme = programmes[i];

          const input: ProgrammeInput = {
            Id: programme.id,
            ClassroomId: programme.classroomId || classroom?.id,
            Name: programme.name,
            StartDate: programme.startDate,
            EndDate: programme.endDate,
            PreferredLanguage: programme.preferredLanguage,
            IsActive: true,
          };

          await _programmeService.updateProgramme(programme.id ?? '', input);

          for (let ix = 0; ix < programme.dailyProgrammes.length; ix++) {
            let daily = programme.dailyProgrammes[ix];
            const dailyInput: DailyProgrammeInput = {
              Id: daily.id,
              ProgrammeId: daily.programmeId,
              Day: +daily.day,
              DayDate: daily.dayDate,
              MessageBoardText: daily.messageBoardText,
              SmallGroupActivityId: daily.smallGroupActivityId ?? 0,
              LargeGroupActivityId: daily.largeGroupActivityId ?? 0,
              StoryBookId: daily.storyActivityId ?? 0,
              StoryActivityId: daily.storyActivityId ?? 0,
              IsActive: true,
            };

            await _programmeService.updateDailyProgramme(
              daily.id ?? '',
              dailyInput
            );
          }
        }
      }

      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
