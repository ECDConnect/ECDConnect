import * as Yup from 'yup';

export interface CareGiverReferencePanelFormModel {
  interestedInJoiningPanel: boolean;
}

export const careGiverReferencePanelFormSchema = Yup.object().shape({
  interestedInJoiningPanel: Yup.boolean().required(),
});
