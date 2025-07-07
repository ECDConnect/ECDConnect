import { createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { getStoryBooks } from './story-book.actions';
import { StoryBookState } from './story-book.types';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';

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
    setThunkActionStatus(builder, getStoryBooks);
    builder.addCase(getStoryBooks.fulfilled, (state, action) => {
      state.storyBooks = action.payload;

      setFulfilledThunkActionStatus(state, action);
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
