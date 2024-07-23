import { PractitionerDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getChildProgressReportsStatusForUser,
  getPractitionerById,
  getPractitionersForCoach,
  getUserStatementsForCoach,
  updateUserContactStatusForStatement,
} from './practitionerForCoach.actions';
import { PractitionerForCoachState } from './practitionerForCoach.types';
import { getUserPointsSummaryForCoach } from '../points/points.actions';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';

const initialState: PractitionerForCoachState = {
  practitionerForCoach: undefined,
  practitionersForCoach: undefined,
  pointsForPractitionerUser: {},
  statementsForPractitionerUser: {},
  childProgressReportStatusForPractitionerUser: {},
};

const practitionerForCoachSlice = createSlice({
  name: 'practitionerForCoach',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitionerForCoach = initialState.practitionerForCoach;
      state.practitionersForCoach = initialState.practitionersForCoach;
      state.pointsForPractitionerUser = initialState.pointsForPractitionerUser;
    },
    updatePractitioner: (state, action: PayloadAction<PractitionerDto>) => {
      if (state.practitionerForCoach) {
        state.practitionerForCoach = action.payload;
      }
    },
    updateStatementForPractitioner: (
      state,
      action: PayloadAction<{ userId: string; statementId: string }>
    ) => {
      if (!state.statementsForPractitionerUser) {
        return;
      }

      const statement = state.statementsForPractitionerUser[
        action.payload.userId
      ]?.statements?.find(
        (statement) => statement.id === action.payload.statementId
      );

      if (!!statement) {
        const updatedStatements = [
          ...state.statementsForPractitionerUser[
            action.payload.userId
          ]?.statements?.filter(
            (statement) => statement.id !== action.payload.statementId
          ),
          {
            ...statement,
            contactedByCoach: true,
          },
        ];

        state.statementsForPractitionerUser = {
          ...state.statementsForPractitionerUser,
          [action.payload.userId]: {
            ...state.statementsForPractitionerUser[action.payload.userId],
            statements: updatedStatements,
          },
        };
      }
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getChildProgressReportsStatusForUser);
    setThunkActionStatus(builder, getPractitionersForCoach);
    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitionerForCoach = action.payload;
    });

    builder.addCase(getPractitionersForCoach.fulfilled, (state, action) => {
      if (!state.practitionersForCoach) {
        const practitionersForCoach = Object.assign(
          [],
          action.payload
        ) as PractitionerDto[];

        state.practitionersForCoach = practitionersForCoach;
      }
      setFulfilledThunkActionStatus(state, action);
    });

    builder.addCase(getUserPointsSummaryForCoach.fulfilled, (state, action) => {
      state.pointsForPractitionerUser = {
        ...state.pointsForPractitionerUser,
        [action.meta.arg.userId]: {
          dateLoaded: new Date().toISOString(),
          pointsSummaries: action.payload,
        },
      };
    });

    builder.addCase(getUserStatementsForCoach.fulfilled, (state, action) => {
      state.statementsForPractitionerUser = {
        ...state.statementsForPractitionerUser,
        [action.meta.arg.userId]: {
          ...state.statementsForPractitionerUser[action.meta.arg.userId],
          statementsDateLoaded: new Date().toISOString(),
          statements: action.payload,
        },
      };
    });

    builder.addCase(
      updateUserContactStatusForStatement.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
      }
    );

    builder.addCase(
      getChildProgressReportsStatusForUser.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
        state.childProgressReportStatusForPractitionerUser = {
          ...state.childProgressReportStatusForPractitionerUser,
          [action.meta.arg.userId]: action.payload,
        };
      }
    );
  },
});

const {
  reducer: practitionerForCoachReducer,
  actions: practitionerForCoachActions,
} = practitionerForCoachSlice;

const practitionerForCoachPersistConfig = {
  key: 'practitionerForCoach',
  storage: localForage,
  blacklist: [],
};

export {
  practitionerForCoachPersistConfig,
  practitionerForCoachReducer,
  practitionerForCoachActions,
};
