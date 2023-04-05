import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getStoryBooks } from './story-book.actions';
import { StoryBookState } from './story-book.types';

const initialState: StoryBookState = {
  storyBooks: undefined,
};

const storyBookSlice = createSlice({
  name: 'storyBook',
  initialState,
  reducers: {
    resetStoryBookState: (state) => {
      state.storyBooks = initialState.storyBooks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStoryBooks.fulfilled, (state, action) => {
      state.storyBooks = action.payload;
    });
  },
});

const { reducer: storyBookReducer, actions: storyBookActions } = storyBookSlice;

const storyBookPersistConfig = {
  key: 'storyBook',
  storage: localForage,
  blacklist: [],
};

export { storyBookPersistConfig, storyBookReducer, storyBookActions };
