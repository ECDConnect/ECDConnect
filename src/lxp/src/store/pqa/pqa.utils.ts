import { CmsVisitDataInputModelInput, InputMaybe } from '@ecdlink/graphql';
import { PQAState } from './pqa.types';

interface AddState {
  state: PQAState;
  payload: CmsVisitDataInputModelInput;
  userId: string;
  visitId?: InputMaybe<string>;
}

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
