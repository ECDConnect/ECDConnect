import { StoryBookDto } from '@ecdlink/core';
import { createSelector } from 'reselect';
import { RootState } from '../../types';

export const getStoryBooks = (state: RootState): StoryBookDto[] =>
  state.storyBookData.storyBooks || [];

export const getStoryBookById = (storyBookId?: number) =>
  createSelector(
    (state: RootState) => state.storyBookData.storyBooks || [],
    (storyBooks: StoryBookDto[]) => {
      if (!storyBookId) return;

      return storyBooks.find((book) => book.id === storyBookId);
    }
  );
