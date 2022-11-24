import { HealthCareWorkerService } from '@/services/healthCareWorkerService';
import { HealthCareWorkerDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';

export const getHealthCareWorkerByUserId = createAsyncThunk<
  HealthCareWorkerDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getHealthCareWorkerByUserId',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let healthCareWorker: HealthCareWorkerDto | undefined;

      if (userAuth?.auth_token) {
        healthCareWorker = await new HealthCareWorkerService(
          userAuth?.auth_token
        ).getHealthCareWorkerByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!healthCareWorker) {
        return rejectWithValue('Error getting healthCareWorker');
      }

      return healthCareWorker;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// export const getAllPractitioners = createAsyncThunk<
//   PractitionerDto[],
//   {},
//   ThunkApiType<RootState>
// >(
//   'getAllPractitioners',
//   // eslint-disable-next-line no-empty-pattern
//   async ({}, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//     } = getState();

//     try {
//       let practitioners: PractitionerDto[] | undefined;

//       if (userAuth?.auth_token) {
//         practitioners = await new PractitionerService(
//           userAuth?.auth_token
//         ).getAllPractitioners();
//       } else {
//         return rejectWithValue('no access token, profile check required');
//       }

//       if (!practitioners) {
//         return rejectWithValue('Error getting practitioner');
//       }

//       return practitioners;
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

// export type UpdatePractitionerRequest = {
//   id: string;
//   input: any;
// };

// export const updatePractitionerById = createAsyncThunk<
//   any,
//   UpdatePractitionerRequest,
//   ThunkApiType<RootState>
// >(
//   'updatePractitionerById',
//   // eslint-disable-next-line no-empty-pattern
//   async ({ input, id }, { getState, rejectWithValue }) => {
//     const {
//       auth: { userAuth },
//     } = getState();

//     try {
//       // let mappedCaregiverInput = mapPractitioner(input);

//       if (userAuth?.auth_token) {
//         await new PractitionerService(
//           userAuth?.auth_token
//         ).UpdatePractitionerByid(userAuth.id, input);
//       } else {
//         return rejectWithValue('no access token, profile check required');
//       }
//     } catch (err) {
//       return rejectWithValue(err);
//     }
//   }
// );

// const mapPractitioner = (x: Partial<any>): any => ({
//   User: {
//     firstName: x.firstName,
//     surname: x.surname,
//   },
// });
