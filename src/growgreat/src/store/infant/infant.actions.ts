import {
  CaregiverDto,
  InfantDto,
  MotherDto,
  SiteAddressDto,
  VisitDto,
} from '@/../../../packages/core/lib';
import {
  CaregiverModelInput,
  EventRecordType,
  InfantModelInput,
  SiteAddressInput,
} from '@ecdlink/graphql';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { InfantService } from '@/services/InfantService';
import { RootState, ThunkApiType } from '../types';
import { EventRecordService } from '@/services/EventRecordService';

export const InfantActions = {
  ADD_INFANTS: 'addInfant',
  GET_INFANTS: 'getInfants',
  GET_INFANT_VISITS: 'getInfantVisits',
  GET_INFANTS_WEEKLY_VISITS: 'getInfantsWeeklyVisits',
  GET_INFANT_COUNT_FOR_MONTH: 'getInfantCountForMonth',
  GET_ALL_INFANT_EVENT_RECORD_TYPES: 'getAllInfantEventRecordTypes',
};

export const getInfants = createAsyncThunk<
  InfantDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(InfantActions.GET_INFANTS, async (_, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    let infants: InfantDto[] | undefined;
    const id = userAuth?.id;

    if (userAuth?.auth_token && id) {
      infants = await new InfantService(
        userAuth?.auth_token
      ).GetAllInfantsForMother(id);
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
});

export const getInfantsWeeklyVisits = createAsyncThunk<
  InfantDto[],
  undefined,
  ThunkApiType<RootState>
>(
  InfantActions.GET_INFANTS_WEEKLY_VISITS,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let infants: InfantDto[] | undefined;
      const id = userAuth?.id;

      if (userAuth?.auth_token && id) {
        infants = await new InfantService(
          userAuth?.auth_token
        ).GetAllInfantsForMother(id, 'due');
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return infants;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type CreateInfantRequest = {
  infant: InfantDto;
  motherId?: MotherDto['id'];
};

export const addInfant = createAsyncThunk<
  { motherId?: MotherDto['id'] },
  CreateInfantRequest,
  ThunkApiType<RootState>
>(
  InfantActions.ADD_INFANTS,
  async ({ infant, motherId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();
    try {
      let mappedInfantInput = mapInfant(infant);

      if (userAuth?.auth_token) {
        await new InfantService(userAuth?.auth_token).addInfant(
          mappedInfantInput
        );

        return { motherId };
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getInfantCountForMonth = createAsyncThunk<
  number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  InfantActions.GET_INFANT_COUNT_FOR_MONTH,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let count: number;
      const id = userAuth?.id;

      if (userAuth?.auth_token && id) {
        count = await new InfantService(
          userAuth?.auth_token
        ).getInfantCountForHealthCareWorkerForMonth(id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return count;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getInfantVisits = createAsyncThunk<
  VisitDto[],
  { infantId: string },
  ThunkApiType<RootState>
>(
  InfantActions.GET_INFANT_VISITS,
  async ({ infantId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let visits: VisitDto[];

      if (userAuth?.auth_token) {
        visits = await new InfantService(userAuth?.auth_token).GetInfantVisits(
          infantId
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

export const getAllInfantEventRecordTypes = createAsyncThunk<
  EventRecordType[],
  undefined,
  ThunkApiType<RootState>
>(
  InfantActions.GET_ALL_INFANT_EVENT_RECORD_TYPES,
  async (_, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let eventRecordTypes: EventRecordType[];

      if (userAuth?.auth_token) {
        eventRecordTypes = await new EventRecordService(
          userAuth?.auth_token
        ).getAllEventRecordTypes('child');
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return eventRecordTypes;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

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
  completed24MonthVisits: x.completed24MonthVisits,
});

const mapCaregiver = (x: Partial<CaregiverDto>): CaregiverModelInput => ({
  firstName: x.firstName,
  surname: x.surname,
  phoneNumber: x.phoneNumber,
  whatsAppNumber: x.whatsAppNumber,
  healthCareWorkerId: x.healthCareWorkerId,
  age: x.age,
  relationId: x.relationId,
  siteAddress: x.siteAddress ? mapSiteAddress(x.siteAddress!) : null,
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
