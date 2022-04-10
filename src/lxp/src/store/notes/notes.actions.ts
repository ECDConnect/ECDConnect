import { NoteDto } from '@ecdlink/core';
import { NoteInput } from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { NoteService } from '@services/NoteService';
import { RootState, ThunkApiType } from '../types';

export const getNotes = createAsyncThunk<
  NoteDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getNotes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      notesData: { notes: notesCache },
    } = getState();

    if (!notesCache) {
      try {
        let notes: NoteDto[] | undefined;

        if (userAuth?.auth_token) {
          notes = await new NoteService(userAuth?.auth_token).getNotes(userAuth.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!notes) {
          return rejectWithValue('Error getting notes');
        }

        return notes;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return notesCache;
    }
  }
);

export const upsertNotes = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertNotes',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      notesData: { notes },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];

      if (userAuth?.auth_token && notes) {
        promises = notes.map(async (x) => {
          const input: NoteInput = {
            Id: x.id,
            Name: x.name,
            BodyText: x.bodyText,
            NoteTypeId: x.noteTypeId,
            UserId: x.userId,
            CreatedUserId: x.createdUserId,
            IsActive: x.isActive === false ? false : true,
          };

          return await new NoteService(userAuth?.auth_token).updateNote(x.id ?? '', input);
        });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
