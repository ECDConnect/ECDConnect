import * as Yup from 'yup';

export interface PregnantAddressModel {
  address: string;
}

export const initialPregnantAddressValues: PregnantAddressModel = {
  address: '',
};

export const pregnantAddressModelSchema = Yup.object().shape({
  address: Yup.string().required('Address is required'),
});
