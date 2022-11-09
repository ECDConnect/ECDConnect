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

      return (
        notes
          .filter((note) => note.userId === userId)
          // TODO: fix sort callback
          // The callback provided to sort should return 0
          // if the compared values are equal.
          // deepcode ignore NoZeroReturnedInSort: <Will resolve in Phase 2>
          .sort((a, b) => (a.insertedDate > b.insertedDate ? -1 : 1))
      );
    }
  );
