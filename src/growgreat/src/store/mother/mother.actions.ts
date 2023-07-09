import { MotherDto, SiteAddressDto, VisitDto } from '@ecdlink/core';
import {
  EventRecordType,
  MotherModelInput,
  SiteAddressInput,
  VisitDataStatus,
  VisitDataStatusFilterInput,
  VisitModelInput,
} from '@ecdlink/graphql';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { MotherService } from '@services/MotherService';
import { SiteAddressService } from '@services/SiteAddressService';
import { RootState, ThunkApiType } from '../types';
import { Referral } from '@/services/ReferralService';
import { UpdateMotherDeliveryDateProps } from './mother.types';

export const MotherActions = {
  GET_MOTHERS: 'getMothers',
  GET_MOTHER_VISITS: 'getMotherVisits',
  GET_MOTHER_EVENT_RECORD_TYPES: 'getMotherEventRecordTypes',
  ADD_MOTHER: 'addMother',
  GET_MOTHER_COUNT_FOR_MONTH: 'getMotherCountForMonth',
  GET_MOTHERS_WEEKLY_VISITS: 'getMothersWeeklyVisits',
  UPDATE_MOTHER_ADDRESS: 'updateMotherAddress',
  ADD_ADDITIONAL_VISIT_FOR_MOTHER: 'addAdditionalVisitForMother',
  GET_REFERRALS_FOR_MOTHER: 'getReferralsForMother',
  GET_COMPLETED_REFERRALS_FOR_MOTHER: 'getCompletedReferralsForMother',
  UPDATE_VISIT_DATA_STATUS: 'updateVisitDataStatus',
  UPDATE_MOTHER_DELIVERY_DATE: 'updateMotherDeliveryDate',
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
    if (userAuth?.auth_token) {
      return await new MotherService(userAuth?.auth_token).updateMother(
        id,
        mother as MotherModelInput
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

export const updateMotherAddress = createAsyncThunk<
  MotherDto,
  UpdateMotherRequest,
  ThunkApiType<RootState>
>(
  'updateMotherAddress',
  async ({ mother, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let mappedMotherInput = mapMother(mother);
      if (userAuth?.auth_token) {
        return await new MotherService(
          userAuth?.auth_token
        ).updateMotherAddress(id, mappedMotherInput);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateMotherContactDetails = createAsyncThunk<
  MotherDto,
  UpdateMotherRequest,
  ThunkApiType<RootState>
>(
  'updateMotherContactDetails',
  async ({ mother, id }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let mappedMotherInput = mapMother(mother);
      if (userAuth?.auth_token) {
        return await new MotherService(
          userAuth?.auth_token
        ).updateMotherContactDetails(id, mappedMotherInput);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addAdditionalVisitForMother = createAsyncThunk<
  VisitDto,
  VisitModelInput,
  ThunkApiType<RootState>
>(
  MotherActions.ADD_ADDITIONAL_VISIT_FOR_MOTHER,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const response = await new MotherService(
          userAuth?.auth_token
        ).addAdditionalVisitForMother(input);

        return response;
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getReferralsForMother = createAsyncThunk<
  VisitDataStatus[],
  { motherId: string; visitId: string },
  ThunkApiType<RootState>
>(
  MotherActions.GET_REFERRALS_FOR_MOTHER,
  async ({ motherId, visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let referrals: VisitDataStatus[];

      if (userAuth?.auth_token) {
        referrals = await new Referral(
          userAuth?.auth_token
        ).getReferralsForMother(motherId, visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!referrals) {
        return rejectWithValue('Error getting more information');
      }
      return referrals;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCompletedReferralsForMother = createAsyncThunk<
  VisitDataStatus[],
  { motherId: string; visitId: string },
  ThunkApiType<RootState>
>(
  MotherActions.GET_COMPLETED_REFERRALS_FOR_MOTHER,
  async ({ motherId, visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let referrals: VisitDataStatus[];

      if (userAuth?.auth_token) {
        referrals = await new Referral(
          userAuth?.auth_token
        ).getCompletedReferralsForMother(motherId, visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!referrals) {
        return rejectWithValue('Error getting more information');
      }
      return referrals;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateVisitDataStatus = createAsyncThunk<
  {},
  { input: VisitDataStatusFilterInput[] },
  ThunkApiType<RootState>
>(
  MotherActions.UPDATE_VISIT_DATA_STATUS,
  async ({ input }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        new Referral(userAuth?.auth_token ?? '').updateVisitDataStatus(input);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateMotherDeliveryDate = createAsyncThunk<
  MotherDto,
  UpdateMotherDeliveryDateProps,
  ThunkApiType<RootState>
>(
  MotherActions.UPDATE_MOTHER_DELIVERY_DATE,
  async ({ id, expectedDateOfDelivery }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new MotherService(
          userAuth?.auth_token ?? ''
        ).updateMotherDeliveryDate(id, expectedDateOfDelivery);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
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
  ...(x.linkedInfantId ? { linkedInfantId: x.linkedInfantId } : {}),
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
