import { ClinicDto } from '@ecdlink/core';
import { SA_CELL_REGEX } from '@ecdlink/ui';
import * as Yup from 'yup';

export interface ClinicsRouteState {
  clinic?: ClinicDto;
}

export interface ClinicPanelCreateProps {
  closeDialog: (value: boolean) => void;
  setFormIsDirty?: (value: boolean) => void;
  isEdit?: boolean;
  clinic?: any;
  district?: any;
  subDistrict?: any;
}

export interface ClinicModel {
  name: string;
  subDistrict: string;
  phoneNumber: string;
  address: string;
  teamLeadOne: string;
  teamLeadTwo: string;
}

export const clinicInitialValues = {
  name: '',
  subDistrict: '',
  phoneNumber: '',
  address: '',
  teamLeadOne: '',
  teamLeadTwo: '',
};

export const clinicSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(50, 'Message title too long'),
  subDistrict: Yup.string()
    .required('Distric is required')
    .max(160, 'Distric name too long'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  teamLeadOne: Yup.string().required('Team lead is required'),
  teamLeadTwo: Yup.string(),
});

export interface DistrictModel {
  districtName: string;
  province: string;
}

export const districtInitialValues = {
  districtName: '',
  province: '',
};

export const districtSchema = Yup.object().shape({
  districtName: Yup.string()
    .required('District name is required')
    .max(50, 'Message title too long'),
  province: Yup.string().required('Province is required'),
});

export interface subDistrictModel {
  subDistrictName: string;
  district: string;
}

export const subDistrictInitialValues = {
  subDistrictName: '',
  district: '',
};

export const subDistrictSchema = Yup.object().shape({
  subDistrictName: Yup.string()
    .required('District name is required')
    .max(50, 'Message title too long'),
  district: Yup.string().required('Province is required'),
});
