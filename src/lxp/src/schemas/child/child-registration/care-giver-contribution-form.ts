import * as Yup from 'yup';

export interface CareGiverContributionFormModel {
  commitedToContributing: boolean;
}

export const careGiverContributionFormSchema = Yup.object().shape({
  commitedToContributing: Yup.boolean().required(),
});
