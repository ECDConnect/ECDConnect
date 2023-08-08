import * as Yup from 'yup';

export interface SwitchPrincipalModel {
  newPrincipalId: string | undefined;
}

export const initialSwitchPrincipalValues: SwitchPrincipalModel = {
  newPrincipalId: undefined,
};

export const switchPrincipalModelSchema = Yup.object().shape({
  newPrincipalId: Yup.string().required().min(1),
});
