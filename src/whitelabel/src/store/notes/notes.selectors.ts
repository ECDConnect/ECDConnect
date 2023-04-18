import { NoteDto } from '@ecdlink/core';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../types';

export const getNotes = (state: RootState): NoteDto[] | undefined =>
  state.notesData.notes?.filter((note: NoteDto) => note.isActive);
export const getNotesByUserId = (userId?: string) =>
  createSelector(
    (state: RootState) => state.notesData.notes || [],
    (notes: NoteDto[]) => {
      if (!notes || !userId) return [];

      return notes
        .filter((note) => note.userId === userId)
        .sort((a, b) => (a.insertedDate > b.insertedDate ? -1 : 1));
    }
  );
