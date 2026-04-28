import { createSlice } from '@reduxjs/toolkit';
import { getMoreInformation } from './information.actions';
import { InformationState } from './information.types';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';

const initialState: InformationState = {
  information: undefined,
};

const informationSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    resetInformationState: (state) => {
      state.information = initialState.information;
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getMoreInformation);

    builder.addCase(getMoreInformation.fulfilled, (state, action) => {
      const { section, locale } = action.meta.arg;

      state.information = {
        section,
        locale,
        data: action.payload,
      };
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: informationReducer, actions: informationActions } =
  informationSlice;

export { informationReducer, informationActions };
