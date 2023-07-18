import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  addFollowUpVisitForPractitioner,
  addReAccreditationFollowUpVisitForPractitioner,
  addReAccreditationVisitData,
  addSelfAssessmentForPractitioner,
  addSupportVisitFormData,
  addVisitFormData,
  getPractitionerTimeline,
  getVisitDataForVisitId,
  updateVisitPlannedVisitDate,
} from './pqa.actions';
import { PQAFormType, PQAState } from './pqa.types';
import {
  CmsVisitDataInputModelInput,
  UpdateVisitPlannedVisitDateModelInput,
} from '@ecdlink/graphql';
import { setThunkActionStatus } from '../utils';
import { setFulfilledThunkActionStatus } from '../utils';
import { getPractitionersForCoach } from '../practitionerForCoach/practitionerForCoach.actions';
import {
  addPreviousFormData,
  handleAddFollowUpVisit,
  handleAddReAccreditationFollowUpVisit,
  handleAddReAccreditationVisit,
  handleAddSelfAssessment,
  handleAddSupportVisit,
} from './pqa.utils';

const initialState: PQAState = {};

const pqaSlice = createSlice({
  name: 'pqa',
  initialState,
  reducers: {
    updateVisitPlannedVisitDate: (
      state,
      action: PayloadAction<UpdateVisitPlannedVisitDateModelInput>
    ) => {
      const input = action.payload;

      state.coachPractitionersTimeline?.forEach((p) => {
        var visit = p.timeline.pQASiteVisits?.find(
          (v) => v?.id === input.visitId
        );
        if (!visit)
          visit = p.timeline.supportVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.prePQASiteVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.requestedCoachVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.reAccreditationVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!!visit) {
          visit.plannedVisitDate = input.plannedVisitDate;
        }
      });
    },
    addVisitFormData: {
      reducer: (
        state,
        action: PayloadAction<
          CmsVisitDataInputModelInput,
          string,
          {
            userId: string;
            formType: PQAFormType;
          }
        >
      ) => {
        const { userId, formType } = action.meta;
        const visitId = action.payload.visitId;
        switch (formType) {
          case 'follow-up-visit':
            handleAddFollowUpVisit({ payload: action.payload, state, userId });
            break;
          case 're-accreditation-follow-up-visit':
            handleAddReAccreditationFollowUpVisit({
              payload: action.payload,
              state,
              userId,
            });
            break;
          case 'pqa':
            if (state?.pqaFormData?.length) {
              if (
                !state.pqaFormData.some(
                  (item) => item.formData.visitId === visitId
                )
              ) {
                state.pqaFormData = [
                  ...state.pqaFormData,
                  { practitionerId: userId, formData: action.payload },
                ];
                return;
              }

              const newState = state.pqaFormData.map((item) => {
                if (item.formData.visitId === visitId) {
                  return { ...item, formData: action.payload };
                }

                return item;
              });

              state.pqaFormData = newState;
            } else {
              state.pqaFormData = [
                { practitionerId: userId, formData: action.payload },
              ];
            }
            break;
          case 'support-visit':
            handleAddSupportVisit({
              payload: action.payload,
              state,
              userId,
            });
            break;
          case 're-accreditation':
            handleAddReAccreditationVisit({
              payload: action.payload,
              state,
              visitId,
              userId,
            });
            break;
          case 'self-assessment':
            handleAddSelfAssessment({
              payload: action.payload,
              state,
              visitId,
              userId,
            });
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
        meta: {
          userId: string;
          formType: PQAFormType;
        }
      ) => ({ payload, meta }),
    },
  },
  extraReducers: (builder) => {
    setThunkActionStatus(builder, addVisitFormData);
    setThunkActionStatus(builder, addReAccreditationVisitData);
    setThunkActionStatus(builder, getVisitDataForVisitId);
    setThunkActionStatus(builder, addSupportVisitFormData);
    setThunkActionStatus(builder, addFollowUpVisitForPractitioner);
    setThunkActionStatus(builder, getPractitionerTimeline);
    setThunkActionStatus(
      builder,
      addReAccreditationFollowUpVisitForPractitioner
    );
    setThunkActionStatus(builder, addSelfAssessmentForPractitioner);
    builder.addCase(getPractitionerTimeline.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
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
    builder.addCase(getPractitionersForCoach.fulfilled, (state, action) => {
      // @ts-ignore
      state.coachPractitionersTimeline = action.payload.map((item) => ({
        practitionerId: item.userId,
        // @ts-ignore
        timeline: item.timeline,
      }));
    });
    builder.addCase(getVisitDataForVisitId.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
      const visitId = action.meta.arg.visitId;
      const visitType = action.meta.arg.visitType;

      if (visitType === 'support-visit') {
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'supportVisitPreviousFormData',
        });
      } else if (visitType === 'follow-up-visit') {
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'pqaFollowUpPreviousFormData',
        });
      } else if (visitType === 're-accreditation-follow-up-visit') {
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'reAccreditationFollowUpVisitPreviousFormData',
        });
      } else if (visitType === 'pqa') {
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'pqaPreviousFormData',
        });
      } else if (visitType === 're-accreditation') {
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'reAccreditationPreviousFormData',
        });
      } else
        addPreviousFormData({
          state,
          visitId,
          action,
          stateType: 'prePqaPreviousFormData',
        });
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addReAccreditationVisitData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(addSupportVisitFormData.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      addFollowUpVisitForPractitioner.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(
      addReAccreditationFollowUpVisitForPractitioner.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(
      addSelfAssessmentForPractitioner.fulfilled,
      (state, action) => {
        setFulfilledThunkActionStatus(state, action);
      }
    );
    builder.addCase(updateVisitPlannedVisitDate.fulfilled, (state, action) => {
      setFulfilledThunkActionStatus(state, action);

      const input = action.meta.arg;
      state.coachPractitionersTimeline?.forEach((p) => {
        var visit = p.timeline.pQASiteVisits?.find(
          (v) => v?.id === input.visitId
        );
        if (!visit)
          visit = p.timeline.supportVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.prePQASiteVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.requestedCoachVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!visit)
          visit = p.timeline.reAccreditationVisits?.find(
            (v) => v?.id === input.visitId
          );
        if (!!visit) {
          visit.plannedVisitDate = input.plannedVisitDate;
        }
      });
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
