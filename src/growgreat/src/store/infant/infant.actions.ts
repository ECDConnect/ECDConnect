import {
  CaregiverDto,
  InfantDto,
  SiteAddressDto,
} from '@/../../../packages/core/lib';
import {
  CaregiverModelInput,
  InfantModelInput,
  SiteAddressInput,
} from '@ecdlink/graphql';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { InfantService } from '@/services/InfantService';
import { RootState, ThunkApiType } from '../types';

export const InfantActions = {
  GET_INFANTS: 'getInfants',
};

export const getInfants = createAsyncThunk<
  InfantDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  InfantActions.GET_INFANTS,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      infants: { infants: infantsCache },
    } = getState();

    if (!infantsCache) {
      try {
        let infants: InfantDto[] | undefined;

        if (userAuth?.auth_token) {
          infants = await new InfantService(
            userAuth?.auth_token
          ).GetAllInfantsForMother();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!infants) {
          return rejectWithValue('Error getting mothers');
        }

        return infants;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return infantsCache;
    }
  }
);

type CreateInfantRequest = {
  infant: InfantDto;
};

export const addInfant = createAsyncThunk<
  InfantDto,
  CreateInfantRequest,
  ThunkApiType<RootState>
>('addInfant', async ({ infant }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();
  try {
    let mappedInfantInput = mapInfant(infant);

    if (userAuth?.auth_token) {
      return await new InfantService(userAuth?.auth_token).addInfant(
        mappedInfantInput
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

export type UpdateMotherRequest = {
  id: string;
  infant: InfantDto;
};

const mapInfant = (x: Partial<InfantDto>): InfantModelInput => ({
  dateOfBirth: x.dateOfBirth,
  firstName: x.firstName,
  caregiverId: x.caregiverId,
  caregiver: mapCaregiver(x.caregiver!),
  userId: x.userId,
  genderId: x.genderId,
  weightAtBirth: x.weightAtBirth,
  lengthAtBirth: x.lengthAtBirth,
});

const mapCaregiver = (x: Partial<CaregiverDto>): CaregiverModelInput => ({
  firstName: x.firstName,
  surname: x.surname,
  phoneNumber: x.phoneNumber,
  whatsAppNumber: x.whatsAppNumber,
  age: x.age,
  relationId: x.relationId,
  siteAddress: mapSiteAddress(x.siteAddress!),
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
