import * as Yup from 'yup';

export interface InfantAddressModel {
  address: string;
}

export const initialInfantAddressValues: InfantAddressModel = {
  address: '',
};

export const infantAddressModelSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
});
