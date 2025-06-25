import { PractitionerDto, UserPermissionDto } from '@ecdlink/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getAllPractitioners,
  getPractitionerById,
  updatePractitionerRegistered,
  updatePractitionerProgress,
  deActivatePractitioner,
  updatePractitionerUsePhotoInReport,
  updatePractitionerBusinessWalkThrough,
  getPractitionerByUserId,
  updatePractitionerShareInfo,
  updatePrincipalInvitation,
  getPractitionerDisplayMetrics,
  updatePractitionerPermissions,
  updatePractitionerCommunityTabStatus,
  updatePractitionerProgressWalkthrough,
  getPractitionerPermissions,
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
  practitionersMetrics: undefined,
};

const practitionerSlice = createSlice({
  name: 'practitioner',
  initialState,
  reducers: {
    resetPractitionerState: (state) => {
      state.practitioner = initialState.practitioner;
      state.practitioners = initialState.practitioners;
      state.principalPractitioners = initialState.principalPractitioners;
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
    setThunkActionStatus(builder, getPractitionerDisplayMetrics);
    setThunkActionStatus(builder, getAllPractitioners);
    builder.addCase(
      getPractitionerDisplayMetrics.fulfilled,
      (state, action) => {
        state.practitionersMetrics = action.payload;

        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(getPractitionerById.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    builder.addCase(getPractitionerByUserId.fulfilled, (state, action) => {
      state.practitioner = action.payload;
    });
    builder.addCase(getPractitionerPermissions.fulfilled, (state, action) => {
      state.practitioner = {
        ...state.practitioner,
        permissions: action.payload.permissions,
      };
    });
    builder.addCase(getAllPractitioners.fulfilled, (state, action) => {
      state.practitioners = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updatePractitionerRegistered.fulfilled, (state) => {
      state.practitioner = { ...state.practitioner, isRegistered: true };
    });
    builder.addCase(updatePractitionerShareInfo.fulfilled, (state) => {
      state.practitioner = { ...state.practitioner, shareInfo: true };
    });
    builder.addCase(updatePractitionerProgress.fulfilled, (state, action) => {
      state.practitioner = { ...state.practitioner, progress: action.payload };
    });
    builder.addCase(
      updatePractitionerCommunityTabStatus.fulfilled,
      (state, action) => {
        state.practitioner = {
          ...state.practitioner,
          clickedCommunityTab: action.payload?.clickedCommunityTab,
        };
      }
    );
    builder.addCase(updatePrincipalInvitation.fulfilled, (state, action) => {
      state.practitioner = {
        ...state.practitioner,
        dateAccepted: action.payload?.acceptedDate,
      };
    });
    builder.addCase(deActivatePractitioner.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      state.practitioners = state.practitioners?.filter(
        (x) => x.userId !== action.meta.arg.userId
      );
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
      updatePractitionerProgressWalkthrough.fulfilled,
      (state, action) => {
        state.practitioner = {
          ...state.practitioner,
          progressWalkthroughComplete: action.payload,
        };
      }
    );
    builder.addCase(
      updatePractitionerUsePhotoInReport.fulfilled,
      (state, action) => {
        state.practitioner = {
          ...state.practitioner,
          usePhotoInReport: action.payload,
        };
      }
    );
    builder.addCase(
      updatePractitionerPermissions.fulfilled,
      (state, action) => {
        if (!state.practitioners) {
          return;
        }

        const practitioner = state.practitioners.find(
          (practitioner) => practitioner.userId === action.meta.arg.userId
        );
        const newPermissions = action.payload.map(
          (userPermission) => userPermission as UserPermissionDto
        );

        if (!!practitioner) {
          state.practitioners = [
            ...state.practitioners?.filter(
              (practitioner) => practitioner.userId !== action.meta.arg.userId
            ),
            {
              ...practitioner,
              permissions: newPermissions,
            },
          ];
        }
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
