import { ChildDto, UserDto } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildLearnerTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
  ChildInput,
  UserModelInput,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChildRegistrationDetails } from '../../pages/child/caregiver-child-registration/caregiver-child-registration.types';
import { ChildService } from '@services/ChildService';
import { UserService } from '@services/UserService';
import { RootState, ThunkApiType } from '../types';

export const getChildren = createAsyncThunk<
  ChildDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getChildren',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { children: childrenCache },
    } = getState();

    if (!childrenCache) {
      try {
        let children: ChildDto[] | undefined;

        if (userAuth?.auth_token) {
          children = await new ChildService(userAuth?.auth_token).getChildren();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!children) {
          return rejectWithValue('Error getting Children');
        }

        return children;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return childrenCache;
    }
  }
);

type CreateChildRequest = {
  child: ChildDto;
};

export const createChild = createAsyncThunk<
  ChildDto,
  CreateChildRequest,
  ThunkApiType<RootState>
>('createChild', async ({ child }, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userAuth },
    } = getState();
    if (userAuth?.auth_token) {
      const input = mapChildInput(child);
      await new ChildService(userAuth?.auth_token).updateChild(
        input.Id || '',
        input
      );
      return child;
    } else return rejectWithValue('no access token, profile check required');
  } catch (err) {
    return rejectWithValue(err);
  }
});

type UpdateChildRequest = {
  child: ChildDto;
  id: string;
};

export const updateChild = createAsyncThunk<
  ChildDto,
  UpdateChildRequest,
  ThunkApiType<RootState>
>('updateChild', async ({ child }, { getState, rejectWithValue }) => {
  try {
    const {
      auth: { userAuth },
    } = getState();
    if (userAuth?.auth_token) {
      const input = mapChildInput(child);
      await new ChildService(userAuth?.auth_token).updateChild(
        input.Id || '',
        input
      );
      return child;
    } else return rejectWithValue('no access token, profile check required');
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const calculateChildrenRegistrationRemoval = createAsyncThunk<
  boolean,
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'calculateChildrenRegistrationRemoval',
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ChildService(
          userAuth?.auth_token
        ).calculateChildrenRegistrationRemoval(userAuth?.id);
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type UpdateChildUserRequest = {
  childUser: UserDto;
  id: string;
};

export const updateChildUser = createAsyncThunk<
  UserDto,
  UpdateChildUserRequest,
  ThunkApiType<RootState>
>(
  'updateChildUser',
  async ({ childUser, id }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const input = mapUserInput(childUser);
        await new UserService(userAuth?.auth_token).updateUser(id, input);
        return childUser;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertChildUsers = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertChildUsers',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { childUser, children },
      staticData: { WorkflowStatuses },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      const workflowStatus = WorkflowStatuses?.find(
        (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
      );
      if (userAuth?.auth_token && childUser) {
        promises = childUser
          .filter((childUser) => {
            const child = children?.find((x) => x.userId === childUser.id);
            return child && child.workflowStatusId !== workflowStatus?.id
              ? true
              : false;
          })
          .map(async (x) => {
            const input: UserModelInput = {
              isSouthAfricanCitizen: x.isSouthAfricanCitizen ?? false,
              idNumber: x.idNumber && x.idNumber.length > 0 ? x.idNumber : null,
              verifiedByHomeAffairs: x.verifiedByHomeAffairs!,
              dateOfBirth: x.dateOfBirth,
              genderId: x.genderId && x.genderId.length > 0 ? x.genderId : null,
              raceId: x.raceId && x.raceId.length > 0 ? x.raceId : null,
              firstName: x.firstName,
              surname: x.surname,
              contactPreference: x.contactPreference,
              phoneNumber: x.phoneNumber,
              email: x.email,
              profileImageUrl: x.profileImageUrl,
            };

            return await new UserService(userAuth?.auth_token).updateUser(
              x.id ?? '',
              input
            );
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const upsertChildren = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'upsertChildren',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { children },
      staticData: { WorkflowStatuses },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      const workflowStatus = WorkflowStatuses?.find(
        (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
      );
      if (userAuth?.auth_token && children) {
        promises = children
          .filter((child) => child.workflowStatusId !== workflowStatus?.id)
          .map(async (x) => {
            const input: ChildInput = {
              Id: x.id,
              UserId: x.userId,
              LanguageId: x.languageId,
              CaregiverId: x.caregiverId || null,
              Allergies: x.allergies,
              Disabilities: x.disabilities,
              OtherHealthConditions: x.otherHealthConditions,
              WorkflowStatusId: x.workflowStatusId,
              IsActive: x.isActive === false ? false : true,
            };

            if (x?.isOnline === false) {
              return await new ChildService(userAuth?.auth_token).updateChild(
                x.id ?? '',
                input
              );
            }
            return true;
          });
      }
      return Promise.all(promises);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type GenerateCaregiverChildTokenRequest = {
  firstName?: string;
  surname?: string;
  classgroupId?: string;
};

export const generateCaregiverChildToken = createAsyncThunk<
  string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  GenerateCaregiverChildTokenRequest,
  ThunkApiType<RootState>
>(
  'generateCaregiverChildToken',
  // eslint-disable-next-line no-empty-pattern
  async (
    { firstName, surname, classgroupId },
    { getState, rejectWithValue }
  ) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const result = await new ChildService(
          userAuth?.auth_token
        ).generateCaregiverChildToken(
          firstName || '',
          surname || '',
          classgroupId || ''
        );
        return result;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type RefreshCaregiverChildTokenRequest = {
  childId?: string;
  classgroupId?: string;
};

export const refreshCaregiverChildToken = createAsyncThunk<
  string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  RefreshCaregiverChildTokenRequest,
  ThunkApiType<RootState>
>(
  'refreshCaregiverChildToken',
  // eslint-disable-next-line no-empty-pattern
  async ({ classgroupId, childId }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const result = await new ChildService(
          userAuth?.auth_token
        ).refreshCaregiverChildToken(childId || '', classgroupId || '');
        return result;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type OpenAccessAddChildDetailRequest = {
  token?: string;
};

export const openAccessAddChildDetail = createAsyncThunk<
  ChildRegistrationDetails,
  // eslint-disable-next-line @typescript-eslint/ban-types
  OpenAccessAddChildDetailRequest,
  ThunkApiType<RootState>
>(
  'openAccessAddChildDetail',
  // eslint-disable-next-line no-empty-pattern
  async ({ token }, { rejectWithValue }) => {
    try {
      const result = await new ChildService('').openAccessAddChildDetail(
        token || ''
      );
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export type TokenAddChildRequest = {
  token: string;
  caregiver: AddChildCaregiverTokenModelInput;
  learner: AddChildLearnerTokenModelInput;
  siteAddress: AddChildSiteAddressTokenModelInput;
  child: AddChildTokenModelInput;
};

export const openAccessAddChild = createAsyncThunk<
  string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  TokenAddChildRequest,
  ThunkApiType<RootState>
>(
  'openAccessAddChild',
  // eslint-disable-next-line no-empty-pattern
  async (
    { token, caregiver, learner, siteAddress, child },
    { rejectWithValue }
  ) => {
    try {
      const result = await new ChildService('').openAccessAddChild(
        token,
        caregiver,
        learner,
        siteAddress,
        child
      );
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const mapChildInput = (child: Partial<ChildDto>): ChildInput => ({
  Id: child.id,
  UserId: child.userId,
  LanguageId: child.languageId,
  CaregiverId: child.caregiverId || null,
  Allergies: child.allergies,
  Disabilities: child.disabilities,
  OtherHealthConditions: child.otherHealthConditions,
  WorkflowStatusId: child.workflowStatusId,
  IsActive: child.isActive === false ? false : true,
  InsertedBy: child?.insertedBy,
});

const mapUserInput = (child: Partial<UserDto>): UserModelInput => ({
  id: child.id,
  isSouthAfricanCitizen: child.isSouthAfricanCitizen ?? false,
  idNumber: child.idNumber && child.idNumber.length > 0 ? child.idNumber : null,
  verifiedByHomeAffairs: child.verifiedByHomeAffairs || false,
  dateOfBirth: child.dateOfBirth,
  genderId: child.genderId && child.genderId.length > 0 ? child.genderId : null,
  raceId: child.raceId && child.raceId.length > 0 ? child.raceId : null,
  firstName: child.firstName,
  surname: child.surname,
  contactPreference: child.contactPreference,
  phoneNumber: child.phoneNumber,
  email: child.email,
  profileImageUrl: child.profileImageUrl,
});
export const getChildrenForCoach = createAsyncThunk<
  ChildDto[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'getChildrenForCoach',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { children: childrenCache },
    } = getState();

    if (!childrenCache) {
      try {
        let children: ChildDto[] | undefined;

        if (userAuth?.auth_token) {
          children = await new ChildService(
            userAuth?.auth_token
          ).getChildrenForCoach(userAuth?.id);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        return children;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return childrenCache;
    }
  }
);
