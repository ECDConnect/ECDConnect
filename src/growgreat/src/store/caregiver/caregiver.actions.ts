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
import { CaregiverContactHistory, MergedCaregiver } from './caregiver.types';

export const CaregiverActions = {
  GET_CAREGIVERS: 'getCaregivers',
  GET_CAREGIVERS_HEALTH_CARE_WORKER: 'getCaregiversHealthCareWorker',
  UPDATE_CONTACT_HISTORY: 'updateContactCaregiverHistory',
  ADD_CONTACT_HISTORY: 'addContactCaregiverHistory',
  GET_CAREGIVER_CLIENTS: 'getCaregiverClients',
  GET_ALL_CAREGIVER_CLIENTS: 'getAllCaregiverClients',
};

export const getCaregivers = createAsyncThunk<
  CaregiverDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(CaregiverActions.GET_CAREGIVERS, async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    caregivers: { caregivers: caregiversCache },
  } = getState();

  if (!caregiversCache) {
    try {
      let caregivers: CaregiverDto[] | undefined;

      if (userAuth?.auth_token) {
        caregivers = await new CaregiverService(
          userAuth?.auth_token
        ).getCaregivers();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!caregivers) {
        return rejectWithValue('Error getting caregivers');
      }

      return caregivers;
    } catch (err) {
      return rejectWithValue(err);
    }
  } else {
    return caregiversCache;
  }
});

export const getCaregiversForHealthCareWorker = createAsyncThunk<
  CaregiverDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  { id: string },
  ThunkApiType<RootState>
>(
  CaregiverActions.GET_CAREGIVERS_HEALTH_CARE_WORKER,
  async ({ id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      caregivers: { caregivers: caregiversCache },
    } = getState();

    if (!caregiversCache) {
      try {
        let caregivers: CaregiverDto[] | undefined;
        if (id === null || id.trim() === '') {
          return rejectWithValue('no caregiver id supplied');
        }
        if (userAuth?.auth_token) {
          caregivers = await new CaregiverService(
            userAuth?.auth_token
          ).getCaregiversForHealthCareWorker(id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!caregivers) {
          return rejectWithValue('Error getting caregivers');
        }

        return caregivers;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return caregiversCache;
    }
  }
);

export const updateCaregiverContactHistory = createAction<
  PayloadAction<CaregiverContactHistory[]>
>(CaregiverActions.UPDATE_CONTACT_HISTORY);

export const addCaregiverContactHistory = createAction<
  PayloadAction<CaregiverContactHistory>
>(CaregiverActions.ADD_CONTACT_HISTORY);

export const upsertCareGivers = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('upsertCareGivers', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    caregivers: { caregivers },
  } = getState();

  try {
    if (userAuth?.auth_token && caregivers) {
      for (const caregiver of caregivers) {
        const input = mapCaregiver(caregiver);

        if (caregiver.siteAddress) {
          const addressInput = mapSiteAddress(caregiver.siteAddress);
          await new SiteAddressService(userAuth?.auth_token).updateSiteAddress(
            caregiver.siteAddress.id ?? '',
            addressInput
          );

          input.SiteAddressId = addressInput.Id;
        }

        await new CaregiverService(userAuth?.auth_token).updateCareGiver(
          caregiver.id ?? '',
          input
        );
      }
    }
    return [true];
  } catch (err) {
    return rejectWithValue(err);
  }
});

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

export const getCaregiverClients = createAsyncThunk<
  MergedCaregiver,
  { caregiverId: string },
  ThunkApiType<RootState>
>(
  CaregiverActions.GET_CAREGIVER_CLIENTS,
  async ({ caregiverId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let caregiverClients = {} as MergedCaregiver;

      if (userAuth?.auth_token) {
        const response = await new CaregiverService(
          userAuth.auth_token
        ).getCaregiverClients(caregiverId);

        // @ts-ignore
        caregiverClients = {
          id: caregiverId,
          ...response,
        };
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return caregiverClients;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllCaregiverClients = createAsyncThunk<
  MergedCaregiver[],
  { userId: string; recordsPerPage?: number; pageNumber?: number },
  ThunkApiType<RootState>
>(
  CaregiverActions.GET_ALL_CAREGIVER_CLIENTS,
  async (
    { userId, pageNumber, recordsPerPage },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let caregivers = [] as MergedCaregiver[];

      if (userAuth?.auth_token) {
        caregivers = await new CaregiverService(
          userAuth.auth_token
        ).getAllCaregiverClients(userId, recordsPerPage, pageNumber);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return caregivers;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdateCaregiverRequest = {
  id: string;
  caregiver: CaregiverDto;
};

export const updateCaregiver = createAsyncThunk<
  CaregiverDto,
  UpdateCaregiverRequest,
  ThunkApiType<RootState>
>(
  'updateCaregiver',
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
  FirstName: x.firstName,
  Surname: x.surname,
  Age: x.age,
  PhoneNumber: x.phoneNumber,
  WhatsAppNumber: x.whatsAppNumber,
  RelationId: x.relationId,
  IsActive: true,
  Contribution: true,
  JoinReferencePanel: true,
  isMother: x.isMother === false ? false : true,
  // SiteAddress: x.siteAddress,
  IsAllowedCustody: false,
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
