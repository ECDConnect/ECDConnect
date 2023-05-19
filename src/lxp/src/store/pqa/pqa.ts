import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addSupportVisitFormData,
  addVisitFormData,
  getPractitionerTimeline,
  getVisitDataForVisitId,
} from './pqa.actions';
import { PQAState } from './pqa.types';
import { CmsVisitDataInputModelInput } from '@ecdlink/graphql';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';

const initialState: PQAState = {};

const pqaSlice = createSlice({
  name: 'pqa',
  initialState,
  reducers: {
    addVisitFormData: {
      reducer: (
        state,
        action: PayloadAction<
          CmsVisitDataInputModelInput,
          string,
          { userId: string; formType: 'pre-pqa' | 'pqa' }
        >
      ) => {
        const { userId, formType } = action.meta;
        const visitId = action.payload.visitId;
        switch (formType) {
          case 'pqa':
            break;
          default:
            if (state?.prePqaFormData?.length) {
              if (
                !state.prePqaFormData.some(
                  (item) => item.formData.visitId === visitId
                )
              ) {
                state.prePqaFormData = [
                  ...state.prePqaFormData,
                  { practitionerId: userId, formData: action.payload },
                ];
                return;
              }

              const newState = state.prePqaFormData.map((item) => {
                if (item.formData.visitId === visitId) {
                  return { ...item, formData: action.payload };
                }

                return item;
              });

              state.prePqaFormData = newState;
            } else {
              state.prePqaFormData = [
                { practitionerId: userId, formData: action.payload },
              ];
            }
            break;
        }
      },
      prepare: (
        payload: CmsVisitDataInputModelInput,
        meta: { userId: string; formType: 'pre-pqa' | 'pqa' }
      ) => ({ payload, meta }),
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, getVisitDataForVisitId);
    setThunkActionStatus(builder, addSupportVisitFormData);
    builder.addCase(getPractitionerTimeline.fulfilled, (state, action) => {
      const practitionerId = action.meta.arg.userId;

      if (state.coachPractitionersTimeline?.length) {
        if (
          !state.coachPractitionersTimeline.some(
            (item) => item.practitionerId === practitionerId
          )
        ) {
          state.coachPractitionersTimeline = [
            ...state.coachPractitionersTimeline,
            { practitionerId, timeline: action.payload },
          ];
          return;
        }

        const newState = state.coachPractitionersTimeline.map((item) => {
          if (item.practitionerId === practitionerId) {
            return { ...item, timeline: action.payload };
          }

          return item;
        });

        state.coachPractitionersTimeline = newState;
      } else {
        state.coachPractitionersTimeline = [
          {
            practitionerId,
            timeline: action.payload,
          },
        ];
      }
    });
    builder.addCase(getVisitDataForVisitId.fulfilled, (state, action) => {
      const visitId = action.meta.arg.visitId;

      if (state.prePqaPreviousFormData?.length) {
        if (
          !state.prePqaPreviousFormData.some((item) => item.visitId === visitId)
        ) {
          state.prePqaPreviousFormData = [
            ...state.prePqaPreviousFormData,
            { visitId, formData: action.payload },
          ];
          return;
        }

        const newState = state.prePqaPreviousFormData.map((item) => {
          if (item.visitId === visitId) {
            return { ...item, formData: action.payload };
          }

          return item;
        });

        state.prePqaPreviousFormData = newState;
      } else {
        state.prePqaPreviousFormData = [
          {
            visitId,
            formData: action.payload,
          },
        ];
      }
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addSupportVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: pqaReducer, actions: pqaActions } = pqaSlice;

const pqaPersistConfig = {
  key: 'pqa',
  storage: localForage,
  blacklist: [],
};

export { pqaPersistConfig, pqaReducer, pqaActions };
