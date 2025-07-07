import * as Yup from 'yup';

export interface RemoveChildModel {
  removeReasonId: string;
  reasonDetail: string;
}

export const initialRemoveChildValues: RemoveChildModel = {
  removeReasonId: '',
  reasonDetail: '',
};

export const removeChildModelSchema = Yup.object().shape({
  removeReasonId: Yup.string().required().min(1),
  reasonDetail: Yup.string().required().min(1),
});
