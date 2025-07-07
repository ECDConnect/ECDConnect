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
>('getNotes', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    notesData: { notes: notesCache },
  } = getState();

  if (!notesCache) {
    try {
      let notes: NoteDto[] | undefined;

      if (userAuth?.auth_token) {
        const response = await new NoteService(userAuth?.auth_token).getNotes(
          userAuth.id
        );

        notes = response.filter((note) => !!note.isActive);
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
});

export const upsertNotes = createAsyncThunk<
  any,
  NoteDto,
  ThunkApiType<RootState>
>('upsertNotes', async (input, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    notesData: { notes },
  } = getState();

  try {
    if (userAuth?.auth_token && input.id) {
      return await new NoteService(userAuth?.auth_token).updateNote(
        input.id,
        mapNote(input)
      );
    }

    let promises: Promise<boolean>[] = [];

    if (userAuth?.auth_token && notes) {
      promises = notes.map(async (x) => {
        return await new NoteService(userAuth?.auth_token).updateNote(
          x.id ?? '',
          mapNote(x)
        );
      });
    }
    return Promise.all(promises);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const deleteNote = createAsyncThunk<
  any,
  NoteDto['id'],
  ThunkApiType<RootState>
>('deleteNote', async (id, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token && id) {
      return await new NoteService(userAuth?.auth_token).deleteNote(id);
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

const mapNote = (note: NoteDto): NoteInput => ({
  Id: note.id,
  Name: note.name,
  BodyText: note.bodyText,
  NoteTypeId: note.noteTypeId,
  UserId: note.userId,
  CreatedUserId: note.createdUserId,
  IsActive: note.isActive === false ? false : true,
});
