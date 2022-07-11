import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCoachById } from './coach.actions';
import { CoachState } from './coach.types';
import { CoachDto } from '@ecdlink/core';
import localForage from 'localforage';

const initialState: CoachState = {};

const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    resetCoachState: (state) => {
      state.coach = initialState.coach;
    },
    updateCoach: (state, action: PayloadAction<CoachDto>) => {
      if (state.coach) {
        state.coach = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getCoachById.fulfilled, (state, action) => {
      state.coach = action.payload;
    });
  },
});

const { reducer: coachReducer, actions: coachActions } = coachSlice;

const coachPersistConfig = {
  key: 'coach',
  storage: localForage,
  blacklist: [],
};

export { coachPersistConfig, coachReducer, coachActions };

/* export const mapSiteAddresso = (
  childCareGiverChildInformationForm?: CareGiverChildInformationFormModel,
  siteAddress?: SiteAddressDto
): SiteAddressDto => {
  if (siteAddress) {
    return {
      ...siteAddress,
      provinceId: childCareGiverChildInformationForm?.provinceId,
      addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
      addressLine2: childCareGiverChildInformationForm?.suburb ?? '',
      addressLine3: childCareGiverChildInformationForm?.city ?? '',
      postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
      ward: childCareGiverChildInformationForm?.apartmentNumber ?? '',
    };
  }

  return {
    id: newGuid(),
    isActive: true,
    insertedDate: new Date().toISOString(),
    name: '',
    provinceId: childCareGiverChildInformationForm?.provinceId,
    addressLine1: childCareGiverChildInformationForm?.streetAddress ?? '',
    addressLine2: childCareGiverChildInformationForm?.suburb ?? '',
    addressLine3: childCareGiverChildInformationForm?.city ?? '',
    postalCode: childCareGiverChildInformationForm?.postalCode ?? '',
    ward: childCareGiverChildInformationForm?.apartmentNumber ?? '',
  };
}; */
