import { NoteDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getNotes } from './notes.actions';
import { NotesState } from './notes.types';

const initialState: NotesState = {};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    resetNotesState: (state) => {
      state.notes = initialState.notes;
    },
    createNote: (state, action: PayloadAction<NoteDto>) => {
      if (!state.notes) state.notes = [];
      state.notes?.push(action.payload);
    },
    updateNote: (state, action: PayloadAction<NoteDto>) => {
      if (state.notes) {
        for (let i = 0; i < state.notes.length; i++) {
          if (state.notes[i].id === action.payload.id)
            state.notes[i] = action.payload;
        }
      }
    },
    deleteNote: (state, action: PayloadAction<NoteDto>) => {
      if (state.notes) {
        const noteIndex = state.notes.findIndex(
          (x) => x.id === action.payload.id
        );

        if (noteIndex < 0) return;

        state.notes.splice(noteIndex, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotes.fulfilled, (state, action) => {
      state.notes = action.payload;
    });
  },
});

const { reducer: notesReducer, actions: notesActions } = notesSlice;

const notesPersistConfig = {
  key: 'notes',
  storage: localForage,
  blacklist: [],
};

export { notesPersistConfig, notesReducer, notesActions };
