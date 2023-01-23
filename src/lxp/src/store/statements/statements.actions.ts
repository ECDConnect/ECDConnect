import { createAsyncThunk } from '@reduxjs/toolkit';
import { PractitionerService } from '@services/PractitionerService';
import { RootState, ThunkApiType } from '../types';
import { PractitionerInput } from '@ecdlink/graphql';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';

export const getAllExpenses = createAsyncThunk<
  any[],
  {},
  ThunkApiType<RootState>
>(
  'getAllExpenses',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let expenses: any[] | undefined;

      if (userAuth?.auth_token) {
        expenses = await new ExpensesStatementsService(
          userAuth?.auth_token
        ).GetAllStatementsExpenses();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!expenses) {
        return rejectWithValue('Error getting practitioner');
      }

      return expenses;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdatePractitionerRequest = {
  id: string;
  input: any;
};

export const updatePractitionerById = createAsyncThunk<
  any,
  UpdatePractitionerRequest,
  ThunkApiType<RootState>
>(
  'updatePractitionerById',
  // eslint-disable-next-line no-empty-pattern
  async ({ input, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      // let mappedCaregiverInput = mapPractitioner(input);

      if (userAuth?.auth_token) {
        await new PractitionerService(
          userAuth?.auth_token
        ).UpdatePractitionerByid(userAuth.id, input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const updatePractitioner = createAsyncThunk<
  any,
  PractitionerInput,
  ThunkApiType<RootState>
>(
  'updatePractitioner',
  // eslint-disable-next-line no-empty-pattern
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new PractitionerService(userAuth?.auth_token).updatePractitioner(
          input.Id,
          input
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
