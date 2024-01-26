import { InputMaybe, VisitData } from '@ecdlink/graphql';
import {
  MergedCmsVisitDataInputModelInput,
  PQAState,
  PQAStateKeys,
} from './pqa.types';
import { PayloadAction } from '@reduxjs/toolkit';

interface AddState {
  state: PQAState;
  payload: MergedCmsVisitDataInputModelInput;
  userId: string;
  visitId?: InputMaybe<string>;
}

export const handleAddRequestedSupportVisit = ({
  payload,
  state,
  userId,
}: AddState) => {
  if (state?.requestedSupportVisitFormData?.length) {
    state.requestedSupportVisitFormData = [
      ...state.requestedSupportVisitFormData,
      { practitionerId: userId, formData: payload },
    ];
  } else {
    state.requestedSupportVisitFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};

export const handleAddSupportVisit = ({ payload, state, userId }: AddState) => {
  if (state?.supportVisitFormData?.length) {
    state.supportVisitFormData = [
      ...state.supportVisitFormData,
      { practitionerId: userId, formData: payload },
    ];
  } else {
    state.supportVisitFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};

export const handleAddFollowUpVisit = ({
  payload,
  state,
  userId,
}: AddState) => {
  if (state?.followUpVisitFormData?.length) {
    state.followUpVisitFormData = [
      ...state.followUpVisitFormData,
      { practitionerId: userId, formData: payload },
    ];
  } else {
    state.followUpVisitFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};

export const handleAddReAccreditationFollowUpVisit = ({
  payload,
  state,
  userId,
}: AddState) => {
  if (state?.reAccreditationFollowUpVisitFormData?.length) {
    state.reAccreditationFollowUpVisitFormData = [
      ...state.reAccreditationFollowUpVisitFormData,
      { practitionerId: userId, formData: payload },
    ];
  } else {
    state.reAccreditationFollowUpVisitFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};

export const handleAddReAccreditationVisit = ({
  payload,
  state,
  visitId,
  userId,
}: AddState) => {
  if (state?.reAccreditationFormData?.length) {
    if (
      !state.reAccreditationFormData.some(
        (item) => item.formData.visitId === visitId
      )
    ) {
      state.reAccreditationFormData = [
        ...state.reAccreditationFormData,
        { practitionerId: userId, formData: payload },
      ];
      return;
    }

    const newState = state.reAccreditationFormData.map((item) => {
      if (item.formData.visitId === visitId) {
        return { ...item, formData: payload };
      }

      return item;
    });

    state.reAccreditationFormData = newState;
  } else {
    state.reAccreditationFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};

export const addPreviousFormData = ({
  state,
  visitId,
  action,
  stateType,
}: {
  state: PQAState;
  visitId: string;
  action: PayloadAction<VisitData[]>;
  stateType: PQAStateKeys;
}) => {
  if (state?.[stateType]?.length) {
    if (!state?.[stateType]?.some((item) => item.visitId === visitId)) {
      state[stateType] = [
        ...state[stateType]!,
        { visitId, formData: action.payload },
      ];
      return;
    }

    const newState = state[stateType]?.map((item) => {
      if (item.visitId === visitId) {
        return { ...item, formData: action.payload };
      }

      return item;
    });

    state[stateType] = newState;
  } else {
    state[stateType] = [
      {
        visitId,
        formData: action.payload,
      },
    ];
  }
};

export const handleAddSelfAssessment = ({
  payload,
  state,
  visitId,
  userId,
}: AddState) => {
  if (state?.selfAssessmentFormData?.length) {
    if (
      !state.selfAssessmentFormData.some(
        (item) => item.formData.visitId === visitId
      )
    ) {
      state.selfAssessmentFormData = [
        ...state.selfAssessmentFormData,
        { practitionerId: userId, formData: payload },
      ];
      return;
    }

    const newState = state.selfAssessmentFormData.map((item) => {
      if (item.formData.visitId === visitId) {
        return { ...item, formData: payload };
      }

      return item;
    });

    state.selfAssessmentFormData = newState;
  } else {
    state.selfAssessmentFormData = [
      { practitionerId: userId, formData: payload },
    ];
  }
};
