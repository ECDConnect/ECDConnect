import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllPractitioners,
  getPractitionerById,
  updatePractitionerRegistered,
  updatePractitionerProgress,
  deActivatePractitioner,
  updatePractitionerUsePhotoInReport,
  getAllStatementsBalanceSheetForPractitioner,
  getAllExpensesForPractitioner,
  getAllIncomeForPractitioner,
  updatePractitionerBusinessWalkThrough,
  getPractitionerByUserId,
} from './practitioner.actions';
import {
  PractitionerState,
  PrincipalPractitioners,
} from './practitioner.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: PractitionerState = {
  practitioner: undefined,
  practitioners: undefined,
  principalPractitioners: undefined,
  balanceSheet: undefined,
  expenses: undefined,
  income: undefined,
};

const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitioner = initialState.practitioner;
      state.practitioners = initialState.practitioners;
      state.principalPractitioners = initialState.principalPractitioners;
      state.balanceSheet = initialState.balanceSheet;
      state.expenses = initialState.expenses;
      state.income = initialState.income;
    },
    addPrincipalPractitioners: (
      state,
      action: PayloadAction<PrincipalPractitioners[]>
    ) => {
      state.principalPractitioners = action.payload;
    },
    updatePractitioner: (state, action: PayloadAction<PractitionerDto>) => {
      if (state.practitioner) {
        state.practitioner = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, deActivatePractitioner);
    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    builder.addCase(getPractitionerByUserId.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    builder.addCase(getAllPractitioners.fulfilled, (state, action) => {
      state.practitioners = action.payload;
    });
    builder.addCase(updatePractitionerRegistered.fulfilled, (state) => {
      state.practitioner = { ...state.practitioner, isRegistered: true };
    });
    builder.addCase(updatePractitionerProgress.fulfilled, (state, action) => {
      state.practitioner = { ...state.practitioner, progress: action.payload };
    });
    builder.addCase(deActivatePractitioner.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      updatePractitionerBusinessWalkThrough.fulfilled,
      (state, action) => {
        state.practitioner = {
          ...state.practitioner,
          isCompletedBusinessWalkThrough: action.payload,
        };
      }
    );
    builder.addCase(
      getAllStatementsBalanceSheetForPractitioner.fulfilled,
      (state, action) => {
        state.balanceSheet = action.payload;
      }
    );
    builder.addCase(
      getAllExpensesForPractitioner.fulfilled,
      (state, action) => {
        state.expenses = action.payload;
      }
    );
    builder.addCase(getAllIncomeForPractitioner.fulfilled, (state, action) => {
      state.income = action.payload;
    });
    builder.addCase(
      updatePractitionerUsePhotoInReport.fulfilled,
      (state, action) => {
        state.practitioner = {
          ...state.practitioner,
          usePhotoInReport: action.payload,
        };
      }
    );
  },
});

const { reducer: practitionerReducer, actions: practitionerActions } =
  practitionerSlice;

const practitionerPersistConfig = {
  key: 'practitioner',
  storage: localForage,
  blacklist: [],
};

export { practitionerPersistConfig, practitionerReducer, practitionerActions };
