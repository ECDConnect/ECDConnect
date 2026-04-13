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

    // Force fresh fetch if overrideCache is explicitly true
    const shouldFetchFresh = overrideCache === true;

    if (shouldFetchFresh || !storyBookCache || storyBookCache.length === 0) {
      try {
        let storyBooks: StoryBookDto[] | undefined;

        if (userAuth?.auth_token) {
          storyBooks = await new ContentStoryBookService(
            userAuth?.auth_token
          ).getStoryBooks(locale);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!storyBooks) {
          return rejectWithValue('Error getting story books');
        }

        return storyBooks;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return storyBookCache;
    }
  }
);
