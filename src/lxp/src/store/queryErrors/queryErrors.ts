import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppError, ErrorState } from './queryErrors.types';
import localforage from 'localforage';
import { upsertQueryErrors } from './queryErrors.actions';

const initialState: ErrorState = { queryErrors: [], status: 'idle' };

export const queryErrorsSlice = createSlice({
  name: 'queryErrors',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<AppError>) => {
      if (
        state?.queryErrors?.filter(
          (e) =>
            e.message === action.payload.message &&
            e?.payload?.location?.[0]?.line ===
              action.payload?.payload?.location?.[0]?.line
        ).length > 0
      ) {
        return;
      }

      state.queryErrors.push(action.payload);
    },
    clearErrors: (state) => {
      state.queryErrors = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(upsertQueryErrors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(upsertQueryErrors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.queryErrors = [];
      })
      .addCase(upsertQueryErrors.rejected, (state, action) => {
        state.status = 'failed';
        console.error('Send errors failed:', action.payload);
      });
  },
});

const { reducer: queryErrorReducer, actions: queryErrorsActions } =
  queryErrorsSlice;

const queryErrorsPersistConfig = {
  key: 'queryErrors',
  storage: localforage,
  blacklist: [],
};

export { queryErrorsPersistConfig, queryErrorReducer, queryErrorsActions };
