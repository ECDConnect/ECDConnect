import { CaregiverDto, SiteAddressDto } from '@ecdlink/core';
import { CaregiverInput, SiteAddressInput } from '@ecdlink/graphql';
import {
  createAction,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import { CaregiverService } from '@services/CaregiverService';
import { SiteAddressService } from '@services/SiteAddressService';
import { RootState, ThunkApiType } from '../types';
import { CaregiverContactHistory } from './caregiver.types';

export const CaregiverActions = {
  UPDATE_CONTACT_HISTORY: 'updateContactCaregiverHistory',
  ADD_CONTACT_HISTORY: 'addContactCaregiverHistory',
  UPDATE_CAREGIVER: 'updateCaregiver',
};

// Does this do anything?
export const updateCaregiverContactHistory = createAction<
  PayloadAction<CaregiverContactHistory[]>
>(CaregiverActions.UPDATE_CONTACT_HISTORY);

// Does this do anything?
export const addCaregiverContactHistory = createAction<
  PayloadAction<CaregiverContactHistory>
>(CaregiverActions.ADD_CONTACT_HISTORY);

// TODO - should upsert with children now
export const upsertCareGivers = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertCareGivers',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      caregivers: { caregivers },
    } = getState();

    try {
      if (userAuth?.auth_token && caregivers) {
        for (const caregiver of caregivers) {
          const input = mapCaregiver(caregiver);

          if (caregiver?.isOnline === false) {
            if (caregiver.siteAddress) {
              const addressInput = mapSiteAddress(caregiver.siteAddress);
              await new SiteAddressService(
                userAuth?.auth_token
              ).updateSiteAddress(caregiver.siteAddress.id ?? '', addressInput);

              input.SiteAddressId = addressInput.Id;
            }

            await new CaregiverService(userAuth?.auth_token).updateCareGiver(
              caregiver.id ?? '',
              input
            );
          }
        }
      }
      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type CreateCaregiverRequest = {
  caregiver: CaregiverDto;
};

export const createCaregiver = createAsyncThunk<
  CaregiverDto,
  CreateCaregiverRequest,
  ThunkApiType<RootState>
>('createCaregiver', async ({ caregiver }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();
  try {
    let mappedCaregiverInput = mapCaregiver(caregiver);

    if (userAuth?.auth_token) {
      return await new CaregiverService(userAuth?.auth_token).createCaregiver(
        mappedCaregiverInput
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

export type UpdateCaregiverRequest = {
  id: string;
  caregiver: CaregiverDto;
};

export const updateCaregiver = createAsyncThunk<
  CaregiverDto,
  UpdateCaregiverRequest,
  ThunkApiType<RootState>
>(
  CaregiverActions.UPDATE_CAREGIVER,
  async ({ caregiver, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let mappedCaregiverInput = mapCaregiver(caregiver);

      if (userAuth?.auth_token) {
        return await new CaregiverService(userAuth?.auth_token).updateCareGiver(
          id,
          mappedCaregiverInput
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const mapCaregiver = (x: Partial<CaregiverDto>): CaregiverInput => ({
  Id: x.id,
  IdNumber: x.idNumber,
  FirstName: x.firstName,
  Surname: x.surname,
  FullName: `${x.firstName} ${x.surname}`,
  PhoneNumber: x.phoneNumber,
  SiteAddressId: x.siteAddressId,
  SiteAddress: x.siteAddress ? mapSiteAddress(x.siteAddress!) : null,
  RelationId: x.relationId,
  EducationId: x.educationId,
  EmergencyContactFirstName: x.emergencyContactFirstName,
  EmergencyContactSurname: x.emergencyContactSurname,
  EmergencyContactPhoneNumber: x.emergencyContactPhoneNumber,
  AdditionalFirstName: x.additionalFirstName,
  AdditionalSurname: x.additionalSurname,
  AdditionalPhoneNumber: x.additionalPhoneNumber,
  JoinReferencePanel: x.joinReferencePanel || false,
  Contribution: x.contribution || false,
  IsActive: x.isActive === false ? false : true,
  IsAllowedCustody: x.isAllowedCustody ?? false,
});

const mapSiteAddress = (x: Partial<SiteAddressDto>): SiteAddressInput => ({
  Id: x.id,
  AddressLine1: x.addressLine1,
  AddressLine2: x.addressLine2,
  AddressLine3: x.addressLine3,
  Name: x.name,
  PostalCode: x.postalCode,
  ProvinceId: x.provinceId,
  Ward: x.ward,
  IsActive: x.isActive === false ? false : true,
});
