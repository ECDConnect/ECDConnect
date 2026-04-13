import { CaregiverDto, ChildDto, SiteAddressDto, UserDto } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildRegistrationTokenModelInput,
  AddChildSiteAddressTokenModelInput,
  AddChildTokenModelInput,
  AddChildUserConsentTokenModelInput,
  ChildCaregiverInput,
  ChildCreatedByDetail,
  ChildUserUpdateInput,
  UpdateChildAndCaregiverInput,
  UpdateSiteAddressInput,
  WorkflowStatusEnum,
} from '@ecdlink/graphql';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChildRegistrationDetails } from '../../pages/child/caregiver-child-registration/caregiver-child-registration.types';
import { ChildService } from '@services/ChildService';
import { RootState, ThunkApiType } from '../types';
import { OverrideCache } from '@/models/sync/override-cache';
import { ChildRegistrationDto } from '@/models/child/child-registration.dto';
import { RetrieveFromCache } from '@/models/sync/retrieve-from-cache';

export const ChildrenActions = {
  GET_CHILD_BY_ID: 'getChildById',
  GET_CHILDREN: 'getChildren',
  GET_CHILDREN_CLASS_GROUP: 'getChildrenForClassroomGroup',
  GET_CHILDREN_CLASSROOM: 'getChildrenForClassroom',
  UPDATE_CHILD: 'updateChild',
  UPSERT_CHILDREN: 'upsertChildren',
  FIND_CREATED_CHILD: 'findCreatedChild',
  GENERATE_CAREGIVER_CHILD_TOKEN: 'generateCaregiverChildToken',
  REFRESH_CAREGIVER_CHILD_TOKEN: 'refreshCaregiverChildToken',
  OPEN_ACCESS_ADD_CHILD_DETAIL: 'openAccessAddChildDetail',
  OPEN_ACCESS_ADD_CHILD: 'openAccessAddChild',
  REMOVE_CHILD: 'removeChild',
};

export const getChildById = createAsyncThunk<
  { child: ChildDto },
  { childId: string },
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILD_BY_ID,
  async ({ childId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let child: ChildDto;

      if (userAuth?.auth_token) {
        child = await new ChildService(userAuth?.auth_token).getChildById(
          childId
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!child) {
        return rejectWithValue('Error getting GetChildById');
      }
      return { child };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getChildren = createAsyncThunk<
  { children: ChildDto[] } & RetrieveFromCache,
  {} & OverrideCache,
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILDREN,
  async ({ overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { childData: childDataCache },
    } = getState();

    if (childDataCache?.children.length === 0 || !!overrideCache) {
      try {
        let children: ChildDto[];

        if (userAuth?.auth_token) {
          children = await new ChildService(userAuth?.auth_token).getChildren();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!children) {
          return rejectWithValue('Error getting Children');
        }

        return { children, retrievedFromCache: false };
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return { children: childDataCache.children, retrievedFromCache: true };
    }
  }
);

export const getChildrenForCoach = createAsyncThunk<
  { children: ChildDto[] } & RetrieveFromCache,
  {} & OverrideCache,
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILDREN,
  async ({ overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { childData: childDataCache },
    } = getState();

    if (!!overrideCache || !childDataCache) {
      try {
        let children: ChildDto[];

        if (userAuth?.auth_token) {
          children = await new ChildService(
            userAuth?.auth_token
          ).getChildrenForCoach();
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!children) {
          return rejectWithValue('Error getting Children');
        }

        return { children, retrievedFromCache: false };
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return { children: childDataCache.children, retrievedFromCache: true };
    }
  }
);

export const getChildrenForClassroomGroup = createAsyncThunk<
  { childrenTest: ChildDto[] } & RetrieveFromCache,
  { classroomGroupId: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILDREN_CLASS_GROUP,
  async (
    { classroomGroupId, overrideCache },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      // children: { childData: childDataCache },
    } = getState();

    // if (!classroomGroupId) {
    //   return { children: childDataCache.children, retrievedFromCache: true };
    // }

    if (!userAuth?.auth_token) {
      return rejectWithValue('No access token, profile check required');
    }

    try {
      const childrenTest = await new ChildService(
        userAuth.auth_token
      ).getChildrenForClassroomGroup(classroomGroupId);

      return {
        childrenTest,
        retrievedFromCache: false,
        classroomGroupId,
      };
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Error fetching children'
      );
    }
  }
);

export const getChildrenForClassroom = createAsyncThunk<
  { children: ChildDto[] } & RetrieveFromCache,
  { userId: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILDREN_CLASSROOM,
  async ({ userId, overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      // children: { childData: childDataCache },
    } = getState();

    if (!userAuth?.auth_token) {
      return rejectWithValue('No access token, profile check required');
    }

    try {
      const children = await new ChildService(
        userAuth.auth_token
      ).getChildrenForClassroom(userId);

      return {
        children,
        retrievedFromCache: false,
        userId,
      };
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Error fetching children'
      );
    }
  }
);

export const findCreatedChild = createAsyncThunk<
  ChildCreatedByDetail,
  { practitionerId: string; firstName: string; surname: string },
  ThunkApiType<RootState>
>(
  ChildrenActions.FIND_CREATED_CHILD,
  async (
    { firstName, surname, practitionerId },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        return await new ChildService(userAuth?.auth_token).findCreatedChild(
          practitionerId,
          firstName,
          surname
        );
      } else {
        return rejectWithValue('no access token, profile check required');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

type CreateChildRequest = {
  child: ChildDto;
};

// TODO - check on this... This just calls update child, do we need a seperate action for this?
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
      await new ChildService(userAuth?.auth_token).updateChild(input);
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

// Used to update a single child when online
export const updateChild = createAsyncThunk<
  ChildDto,
  UpdateChildRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.UPDATE_CHILD,
  async ({ child }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const input = mapChildInput(child);
        await new ChildService(userAuth?.auth_token).updateChild(input);
        return child;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeChild = createAsyncThunk<
  ChildDto,
  UpdateChildRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.REMOVE_CHILD,
  async ({ child }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userAuth },
      } = getState();
      if (userAuth?.auth_token) {
        const input = mapChildInput(child);
        await new ChildService(userAuth?.auth_token).removeChild(input);
        return child;
      } else return rejectWithValue('no access token, profile check required');
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

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

// Syncs all children from state, calling updateChild
export const upsertChildren = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  ChildrenActions.UPSERT_CHILDREN,
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { childData },
      staticData: { WorkflowStatuses },
    } = getState();

    try {
      let promises: Promise<boolean>[] = [];
      const workflowStatus = WorkflowStatuses?.find(
        (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
      );

      const unsyncedChilren = childData.children.filter(
        (child) =>
          !child.synced && child.workflowStatusId !== workflowStatus?.id // Do not update children, who are waiting on caregiver to complete registration
      );

      if (userAuth?.auth_token && !!unsyncedChilren) {
        promises = unsyncedChilren.map(async (child) => {
          const input = mapChildInput(child);

          return await new ChildService(userAuth?.auth_token).updateChild(
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

type GenerateCaregiverChildTokenRequest = {
  firstName?: string;
  surname?: string;
  classgroupId?: string;
};

export const generateCaregiverChildToken = createAsyncThunk<
  ChildRegistrationDto,
  GenerateCaregiverChildTokenRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.GENERATE_CAREGIVER_CHILD_TOKEN,
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
  ChildRegistrationDto,
  RefreshCaregiverChildTokenRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.REFRESH_CAREGIVER_CHILD_TOKEN,
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
  OpenAccessAddChildDetailRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.OPEN_ACCESS_ADD_CHILD_DETAIL,
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
  siteAddress: Omit<AddChildSiteAddressTokenModelInput, 'provinceId'>;
  child: AddChildTokenModelInput;
  registration?: AddChildRegistrationTokenModelInput;
  userConsent?: Omit<
    AddChildUserConsentTokenModelInput,
    | 'commitmentAgreementAccepted'
    | 'consentAgreementAccepted'
    | 'indemnityAgreementAccepted'
  >;
};

export const openAccessAddChild = createAsyncThunk<
  string,
  Omit<TokenAddChildRequest, 'learner'>,
  ThunkApiType<RootState>
>(
  ChildrenActions.OPEN_ACCESS_ADD_CHILD,
  async (
    { token, caregiver, siteAddress, child, registration, userConsent },
    { getState, rejectWithValue }
  ) => {
    try {
      const {
        auth: { userAuth },
      } = getState();

      const result = await new ChildService(
        userAuth?.auth_token!
      ).openAccessAddChild(
        token,
        caregiver,
        siteAddress,
        child,
        registration,
        userConsent
      );
      return result;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const mapChildInput = (
  child: Partial<ChildDto>
): UpdateChildAndCaregiverInput => ({
  id: child.id,
  allergies: child.allergies,
  disabilities: child.disabilities,
  otherHealthConditions: child.otherHealthConditions,
  otherLanguages: child.otherLanguages,
  workflowStatusId: child.workflowStatusId,
  isActive: child.isActive === false ? false : true,
  user: mapUserInput(child.user!),
  caregiver: !!child.caregiver ? mapCaregiver(child.caregiver) : null,
  reasonForLeavingId: child?.reasonForLeavingId || null,
  inactivityComments: child?.inactivityComments || null,
  inactiveDate: child?.inactiveDate || null,
  homeLanguageIds: child.homeLanguageIds,
});

const mapUserInput = (childUser: Partial<UserDto>): ChildUserUpdateInput => ({
  id: childUser.id,
  isActive: childUser.isActive || false,
  isSouthAfricanCitizen: childUser.isSouthAfricanCitizen ?? false,
  idNumber:
    childUser.idNumber && childUser.idNumber.length > 0
      ? childUser.idNumber
      : null,
  verifiedByHomeAffairs: childUser.verifiedByHomeAffairs || false,
  dateOfBirth: childUser.dateOfBirth,
  genderId:
    childUser.genderId && childUser.genderId.length > 0
      ? childUser.genderId
      : null,
  firstName: childUser.firstName,
  surname: childUser.surname,
  contactPreference: childUser.contactPreference,
  profileImageUrl: childUser.profileImageUrl,
});

const mapCaregiver = (x: Partial<CaregiverDto>): ChildCaregiverInput => ({
  id: x.id,
  idNumber: x.idNumber,
  firstName: x.firstName,
  surname: x.surname,
  phoneNumber: x.phoneNumber,
  siteAddress: x.siteAddress ? mapSiteAddress(x.siteAddress!) : null,
  relationId: x.relationId,
  educationId: x.educationId,
  emergencyContactFirstName: x.emergencyContactFirstName,
  emergencyContactSurname: x.emergencyContactSurname,
  emergencyContactPhoneNumber: x.emergencyContactPhoneNumber,
  additionalFirstName: x.additionalFirstName,
  additionalSurname: x.additionalSurname,
  additionalPhoneNumber: x.additionalPhoneNumber,
  joinReferencePanel: x.joinReferencePanel || false,
  contribution: x.contribution || false,
  isAllowedCustody: x.isAllowedCustody ?? false,
  grantIds: x.grantIds,
});

const mapSiteAddress = (
  x: Partial<SiteAddressDto>
): UpdateSiteAddressInput => ({
  id: x.id,
  addressLine1: x.addressLine1,
  addressLine2: x.addressLine2,
  addressLine3: x.addressLine3,
  name: x.name,
  postalCode: x.postalCode,
  provinceId: x.provinceId,
  ward: x.ward,
});

// Refactor when we get to coach, probably won't be needed as fetch should be covered by GetAllChild
// export const getChildrenForCoach = createAsyncThunk<
//   ChildDto[],
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   {},
//   ThunkApiType<RootState>
// >(
//   'getChildrenForCoach',
//   // eslint-disable-next-line no-empty-pattern
//   async ({}, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//       children: { children: childrenCache },
//     } = getState();

//     if (!childrenCache) {
//       try {
//         let children: ChildDto[] | undefined;

//         if (userAuth?.auth_token) {
//           children = await new ChildService(
//             userAuth?.auth_token
//           ).getChildrenForCoach(userAuth?.id);
//         } else {
//           return rejectWithValue('no access token, profile check required');
//         }

//         return children;
//       } catch (err) {
//         return rejectWithValue(err);
//       }
//     } else {
//       return childrenCache;
//     }
//   }
// );
