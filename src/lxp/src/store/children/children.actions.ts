import { CaregiverDto, ChildDto, SiteAddressDto, UserDto } from '@ecdlink/core';
import {
  AddChildCaregiverTokenModelInput,
  AddChildLearnerTokenModelInput,
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
import { RetrieveFromCache } from '@/models/sync/retrieve-from-cache';
import { ChildRegistrationDto } from '@/models/child/child-registration.dto';

export const ChildrenActions = {
  GET_CHILDREN: 'getChildren',
  UPDATE_CHILD: 'updateChild',
  UPSERT_CHILDREN: 'upsertChildren',
  FIND_CREATED_CHILD: 'findCreatedChild',
  GENERATE_CAREGIVER_CHILD_TOKEN: 'generateCaregiverChildToken',
  REFRESH_CAREGIVER_CHILD_TOKEN: 'refreshCaregiverChildToken',
  OPEN_ACCESS_ADD_CHILD_DETAIL: 'openAccessAddChildDetail',
  OPEN_ACCESS_ADD_CHILD: 'openAccessAddChild',
};

export const getChildren = createAsyncThunk<
  { children: ChildDto[]; retrievedFromCache: boolean },
  {} & RetrieveFromCache,
  ThunkApiType<RootState>
>(
  ChildrenActions.GET_CHILDREN,
  async ({ overrideCache }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      children: { childData: childDataCache },
    } = getState();

    let oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (
      !!overrideCache ||
      !childDataCache.dateRefreshed ||
      new Date(childDataCache.dateRefreshed) < oneDayAgo
    ) {
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

// Removing this for now, its part of resitration, but we should also sync the child and user in one go. Neither makes sense without the other
// export const upsertChildUsers = createAsyncThunk<
//   boolean[],
//   // eslint-disable-next-line @typescript-eslint/ban-types
//   {},
//   ThunkApiType<RootState>
// >(
//   'upsertChildUsers',
//   // eslint-disable-next-line no-empty-pattern
//   async ({}, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//       children: { childUser, children },
//       staticData: { WorkflowStatuses },
//     } = getState();

//     try {
//       let promises: Promise<boolean>[] = [];
//       const workflowStatus = WorkflowStatuses?.find(
//         (x) => x.enumId === WorkflowStatusEnum.ChildExternalLink
//       );
//       if (userAuth?.auth_token && childUser) {
//         promises = childUser
//           .filter((childUser) => {
//             const child = children?.find((x) => x.userId === childUser.id);
//             return child && child.workflowStatusId !== workflowStatus?.id
//               ? true
//               : false;
//           })
//           .map(async (x) => {
//             const input: UserModelInput = {
//               isSouthAfricanCitizen: x.isSouthAfricanCitizen ?? false,
//               idNumber: x.idNumber && x.idNumber.length > 0 ? x.idNumber : null,
//               verifiedByHomeAffairs: x.verifiedByHomeAffairs!,
//               dateOfBirth: x.dateOfBirth,
//               genderId: x.genderId && x.genderId.length > 0 ? x.genderId : null,
//               raceId: x.raceId && x.raceId.length > 0 ? x.raceId : null,
//               firstName: x.firstName,
//               surname: x.surname,
//               contactPreference: x.contactPreference,
//               phoneNumber: x.phoneNumber,
//               email: x.email,
//               profileImageUrl: x.profileImageUrl,
//             };

//             return await new UserService(userAuth?.auth_token).updateUser(
//               x.id ?? '',
//               input
//             );
//           });
//       }
//       return Promise.all(promises);
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

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
  learner: AddChildLearnerTokenModelInput;
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
  TokenAddChildRequest,
  ThunkApiType<RootState>
>(
  ChildrenActions.OPEN_ACCESS_ADD_CHILD,
  async (
    {
      token,
      caregiver,
      learner,
      siteAddress,
      child,
      registration,
      userConsent,
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await new ChildService('').openAccessAddChild(
        token,
        caregiver,
        learner,
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
  ...child,
  id: child.id,
  languageId: child.languageId,
  allergies: child.allergies,
  disabilities: child.disabilities,
  otherHealthConditions: child.otherHealthConditions,
  workflowStatusId: child.workflowStatusId,
  isActive: child.isActive === false ? false : true,
  user: mapUserInput(child.user!),
  caregiver: !!child.caregiver ? mapCaregiver(child.caregiver) : null,
});

const mapUserInput = (childUser: Partial<UserDto>): ChildUserUpdateInput => ({
  ...childUser,
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
  raceId:
    childUser.raceId && childUser.raceId.length > 0 ? childUser.raceId : null,
  firstName: childUser.firstName,
  surname: childUser.surname,
  contactPreference: childUser.contactPreference,
  profileImageUrl: childUser.profileImageUrl,
});

const mapCaregiver = (x: Partial<CaregiverDto>): ChildCaregiverInput => ({
  ...x,
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
