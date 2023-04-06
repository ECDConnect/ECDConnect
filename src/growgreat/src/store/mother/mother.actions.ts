import { MotherDto, SiteAddressDto, VisitDto } from '@ecdlink/core';
import {
  EventRecordType,
  MotherModelInput,
  SiteAddressInput,
} from '@ecdlink/graphql';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { MotherService } from '@services/MotherService';
import { SiteAddressService } from '@services/SiteAddressService';
import { RootState, ThunkApiType } from '../types';

export const MotherActions = {
  GET_MOTHERS: 'getMothers',
  GET_MOTHER_VISITS: 'getMotherVisits',
  GET_MOTHER_EVENT_RECORD_TYPES: 'getMotherEventRecordTypes',
  ADD_MOTHER: 'addMother',
  ADD_ADDITIONAL_MOTHER_VISIT: 'addAdditionalMotherVisit',
  GET_MOTHER_COUNT_FOR_MONTH: 'getMotherCountForMonth',
  GET_MOTHERS_WEEKLY_VISITS: 'getMothersWeeklyVisits',
};

export const getMothers = createAsyncThunk<
  MotherDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(MotherActions.GET_MOTHERS, async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    let mothers: MotherDto[] | undefined;

    if (userAuth?.auth_token) {
      mothers = await new MotherService(userAuth?.auth_token).getMothers(
        userAuth.id
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }

    if (!mothers) {
      return rejectWithValue('Error getting mothers');
    }

    return mothers;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getMothersWeeklyVisits = createAsyncThunk<
  MotherDto[],
  undefined,
  ThunkApiType<RootState>
>(
  MotherActions.GET_MOTHERS_WEEKLY_VISITS,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let mothers: MotherDto[] | undefined;

      if (userAuth?.auth_token) {
        const dueVisits = await new MotherService(
          userAuth?.auth_token
        ).getMothers(userAuth.id, 'due');

        const overdueVisits = await new MotherService(
          userAuth?.auth_token
        ).getMothers(userAuth.id, 'overdue');

        mothers = [...dueVisits, ...overdueVisits];
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return mothers;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertMothers = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('upsertMothers', async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
    mothers: { mothers },
  } = getState();

  try {
    if (userAuth?.auth_token && mothers) {
      for (const mother of mothers) {
        const input = mapMother(mother);

        if (mother.siteAddress) {
          const addressInput = mapSiteAddress(mother.siteAddress);
          await new SiteAddressService(userAuth?.auth_token).updateSiteAddress(
            mother.siteAddress.id ?? '',
            addressInput
          );

          input.siteAddressId = addressInput.Id;
        }

        await new MotherService(userAuth?.auth_token).updateMother(
          mother.id ?? '',
          input
        );
      }
    }
    return [true];
  } catch (err) {
    return rejectWithValue(err);
  }
});

type CreateMotherRequest = {
  mother: MotherDto;
};

export const addMother = createAsyncThunk<
  MotherDto,
  CreateMotherRequest,
  ThunkApiType<RootState>
>(
  MotherActions.ADD_MOTHER,
  async ({ mother }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let mappedMotherInput = mapMother(mother);

      if (userAuth?.auth_token) {
        return await new MotherService(userAuth?.auth_token).addMother(
          mappedMotherInput
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type UpdateMotherRequest = {
  id: string;
  mother: MotherDto;
};

export const updateMother = createAsyncThunk<
  MotherDto,
  UpdateMotherRequest,
  ThunkApiType<RootState>
>('updateMother', async ({ mother, id }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();
  try {
    let mappedMotherInput = mapMother(mother);

    if (userAuth?.auth_token) {
      return await new MotherService(userAuth?.auth_token).updateMother(
        id,
        mappedMotherInput
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getMotherCountForMonth = createAsyncThunk<
  number,
  undefined,
  ThunkApiType<RootState>
>(
  MotherActions.GET_MOTHER_COUNT_FOR_MONTH,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let count: number;
      const id = userAuth?.id;

      if (userAuth?.auth_token && id) {
        count = await new MotherService(
          userAuth?.auth_token
        ).getMotherCountForHealthCareWorkerForMonth(id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return count;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addAdditionalVisitForMother = createAsyncThunk<
  any, // TODO: add type
  any, // TODO: add type
  ThunkApiType<RootState>
>(
  MotherActions.ADD_ADDITIONAL_MOTHER_VISIT,
  async ({ motherId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        await new MotherService(
          userAuth?.auth_token
        ).addAdditionalVisitForMother(motherId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getMotherVisits = createAsyncThunk<
  VisitDto[],
  { motherId: string },
  ThunkApiType<RootState>
>(
  MotherActions.GET_MOTHER_VISITS,
  async ({ motherId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let visits: VisitDto[];

      if (userAuth?.auth_token) {
        visits = await new MotherService(userAuth?.auth_token).getMotherVisits(
          motherId
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return visits;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllMotherEventRecordTypes = createAsyncThunk<
  EventRecordType[],
  undefined,
  ThunkApiType<RootState>
>(
  MotherActions.GET_MOTHER_EVENT_RECORD_TYPES,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let eventRecordTypes: EventRecordType[];

      if (userAuth?.auth_token) {
        eventRecordTypes = await new MotherService(
          userAuth?.auth_token
        ).getAllMotherEventRecordTypes();
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return eventRecordTypes;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const mapMother = (x: Partial<MotherDto>): MotherModelInput => ({
  userId: x.userId,
  age: x.age,
  expectedDateOfDelivery: x.expectedDateOfDelivery,
  firstName: x.firstName,
  surname: x.surname,
  healthCareWorkerId: x.healthCareWorkerId,
  phoneNumber: x.phoneNumber,
  whatsAppNumber: x.whatsAppNumber,
  siteAddress: x.siteAddress && mapSiteAddress(x.siteAddress),
  ...(x.linkedInfantId ? { linkedCaregiverId: x.linkedInfantId } : {}),
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
