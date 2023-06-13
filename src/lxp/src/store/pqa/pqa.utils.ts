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
