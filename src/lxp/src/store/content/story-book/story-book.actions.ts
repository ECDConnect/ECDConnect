import { StoryBookDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ContentStoryBookService } from '@services/ContentStoryBookService';
import { RootState, ThunkApiType } from '../../types';

export const StoryBookActions = {
  GET_STORY_BOOKS: 'getStoryBooks',
};

export const getStoryBooks = createAsyncThunk<
  StoryBookDto[],
  { locale: string },
  ThunkApiType<RootState>
>(
  StoryBookActions.GET_STORY_BOOKS,
  async ({ locale }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      storyBookData: { storyBooks: storyBookCache },
    } = getState();

    if (!storyBookCache) {
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
