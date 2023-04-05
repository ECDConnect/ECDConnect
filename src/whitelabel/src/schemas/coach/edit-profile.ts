import { SiteAddressDto, ProvinceDto } from '@ecdlink/core';
import * as Yup from 'yup';

export interface EditSiteAddressModel {
  name: string;
  ward: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  provinceId: string;
  postalCode: string;
  province?: ProvinceDto;
}

export const editSiteAddressSchema = Yup.object().shape({
  name: Yup.string().nullable().optional(),
  ward: Yup.string().nullable().optional(),
  addressLine1: Yup.string().required('Street address is required'),
  addressLine2: Yup.string().required('Suburb is required'),
  addressLine3: Yup.string().required('City is required'),
  provinceId: Yup.string().required('Please select a province'),
  postalCode: Yup.string().required('Postal code is required'),
});

export interface EditProfileInformationModel {
  email: string;
  siteAddress?: SiteAddressDto;
  siteAddressId?: string;
  franchisorAddress?: SiteAddressDto;
  franchisorAddressId?: string;
}

export interface EditCoachProfileModel extends EditSiteAddressModel {
  email: string;
}

export const editCoachProfileSchema = editSiteAddressSchema.shape({
  email: Yup.string().required('Email address is required'),
});
