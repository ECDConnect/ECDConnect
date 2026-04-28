import { StoryBookDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentStoryBookService } from '@services/ContentStoryBookService';
import { RootState, ThunkApiType } from '../../types';

export const StoryBookActions = {
  GET_STORY_BOOKS: 'getStoryBooks',
};

export const getStoryBooks = createAsyncThunk<
  StoryBookDto[],
  { locale: string; overrideCache?: boolean },
  ThunkApiType<RootState>
>(
  StoryBookActions.GET_STORY_BOOKS,
  async ({ locale, overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      storyBookData: { storyBooks: storyBookCache },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && storyBookCache && storyBookCache.length > 0) {
      return storyBookCache;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      return await new ContentStoryBookService(
        userAuth?.auth_token
      ).getStoryBooks(locale);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
