import { TraineeDto } from '@ecdlink/core';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { TraineeService } from '@/services/TraineeService';
import {
  CmsVisitDataInputModelInput,
  TraineeOnBoardTimeline,
  UpdateVisitPlannedVisitDateModelInput,
  VisitData,
} from '@ecdlink/graphql';
import { mapVisitDataToVisitSections } from '@/utils/visitData/visitData-utils';

export const TraineeActions = {
  UPDATE_COACH_SMART_SPACE_VISIT_DATA: 'updateCoachSmartSpaceVisitData',
  SYNC_COACH_SMART_SPACE_VISIT_DATA: 'syncCoachSmartSpaceVisitData',
  UPDATE_TRAINEE_FRANCHISOR_AGREEMENT_VISIT_DATA:
    'submitTraineeFranchisorAgreementData',
  SYNC_TRAINEE_FRANCHISOR_AGREEMENT_DATA: 'syncTraineeFranchisorAgreementData',
};

export const getTraineeById = createAsyncThunk<
  TraineeDto,
  { userId: string },
  ThunkApiType<RootState>
>(
  'getTraineeById',
  // eslint-disable-next-line no-empty-pattern
  async ({ userId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let practitioner: TraineeDto | undefined;

      if (userId === null || userId.trim() === '') {
        return rejectWithValue('no trainee practitioner id supplied');
      }

      if (userAuth?.auth_token) {
        practitioner = await new TraineeService(
          userAuth?.auth_token
        ).getTraineeByUserId(userId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      return practitioner;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTraineeTimeline = createAsyncThunk<
  TraineeOnBoardTimeline,
  { userId: string },
  ThunkApiType<RootState>
>('getTraineeTimeline', async ({ userId }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    if (userAuth?.auth_token) {
      return await new TraineeService(userAuth?.auth_token).getTraineeTimeline(
        userId
      );
    } else {
      return rejectWithValue('no access token, profile check required');
    }
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const getTraineeVisitData = createAsyncThunk<
  VisitData[],
  { visitId: string },
  ThunkApiType<RootState>
>('getTraineeVisitData', async ({ visitId }, { getState, rejectWithValue }) => {
  const {
    auth: { userAuth },
  } = getState();

  try {
    let content: VisitData[] | undefined = undefined;

    if (userAuth?.auth_token) {
      content = await new TraineeService(
        userAuth?.auth_token ?? ''
      ).getVisitDataForVisitId(visitId);
    } else {
      return rejectWithValue('no access token, profile check required');
    }

    if (!content) {
      return rejectWithValue('Error getting visit answers for trainee');
    }
    return content;
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const updateTraineeOnboardTimelineSSVisitEvent = createAsyncThunk<
  any,
  UpdateVisitPlannedVisitDateModelInput,
  ThunkApiType<RootState>
>(
  'updateTraineeOnboardTimelineSSVisitEvent',
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input && !!Object.keys(input).length) {
          const response = await new TraineeService(
            userAuth?.auth_token
          ).updateTraineeOnboardTimelineSSVisitEvent(input);

          return response;
        }
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getCoachSmartSpaceVisitData = createAsyncThunk<
  VisitData[],
  { visitId: string },
  ThunkApiType<RootState>
>(
  'getCoachSmartSpaceVisitData',
  async ({ visitId }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
    } = getState();

    try {
      let content: VisitData[] | undefined = undefined;

      if (userAuth?.auth_token) {
        content = await new TraineeService(
          userAuth?.auth_token ?? ''
        ).getVisitDataForVisitId(visitId);
      } else {
        return rejectWithValue('no access token, profile check required');
      }

      if (!content) {
        return rejectWithValue(
          'Error getting visit answers for coach smartspace visit'
        );
      }
      return content;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitCoachSmartSpaceVisitData = createAsyncThunk<
  boolean,
  string,
  ThunkApiType<RootState>
>(
  TraineeActions.UPDATE_COACH_SMART_SPACE_VISIT_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      trainee: { coachSmartSpaceVisitData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input) {
          const visit = coachSmartSpaceVisitData[input];

          if (!visit) {
            return rejectWithValue('Invalid input, visit not found');
          }

          const sections = mapVisitDataToVisitSections(visit.visitData);

          const payload: CmsVisitDataInputModelInput = {
            traineeId: visit.traineeId,
            visitId: visit.visitId,
            coachId: visit.coachId,
            visitData: {
              visitName: 'Coach smartspace check',
              sections,
            },
          };

          const response = new TraineeService(
            userAuth?.auth_token
          ).addCoachVisitData(payload);

          return response;
        }
        return rejectWithValue('Invalid input');
      } else {
        return rejectWithValue('No auth');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const syncCoachSmartSpaceVisitData = createAsyncThunk<
  boolean,
  undefined,
  ThunkApiType<RootState>
>(
  TraineeActions.SYNC_COACH_SMART_SPACE_VISIT_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      trainee: { coachSmartSpaceVisitData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const visitDataToSync = Object.values(coachSmartSpaceVisitData).filter(
          (visit) =>
            !!visit.syncId &&
            !!visit.traineeId &&
            !!visit.coachId &&
            !!visit.visitId
        );

        if (!!visitDataToSync.length) {
          const promises = visitDataToSync.map(async (item) => {
            const sections = mapVisitDataToVisitSections(item.visitData);

            const payload: CmsVisitDataInputModelInput = {
              traineeId: item.traineeId,
              visitId: item.visitId,
              coachId: item.coachId,
              visitData: {
                visitName: 'Coach smartspace check',
                sections,
              },
            };

            return await new TraineeService(
              userAuth?.auth_token
            ).addCoachVisitData(payload);
          });

          const result = await Promise.all(promises);
          return result.every((item) => item);
        } else {
          return true;
        }
      } else {
        return rejectWithValue('No auth');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitTraineeFranchisorAgreementData = createAsyncThunk<
  boolean,
  string,
  ThunkApiType<RootState>
>(
  TraineeActions.UPDATE_TRAINEE_FRANCHISOR_AGREEMENT_VISIT_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      trainee: { franchiseeAgreementData: coachFranchisorAgreementData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        if (!!input) {
          const visit = coachFranchisorAgreementData[input];

          if (!visit) {
            return rejectWithValue('Invalid input, visit not found');
          }

          const sections = mapVisitDataToVisitSections(visit.visitData);

          const payload: CmsVisitDataInputModelInput = {
            traineeId: visit.traineeId,
            visitId: visit.visitId,
            coachId: visit.coachId,
            visitData: {
              visitName: 'Coach smartspace check',
              sections,
            },
          };

          const response = new TraineeService(
            userAuth?.auth_token
          ).addCoachVisitData(payload);

          return response;
        }
        return rejectWithValue('Invalid input');
      } else {
        return rejectWithValue('No auth');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const syncTraineeFranchisorAgreementData = createAsyncThunk<
  boolean,
  undefined,
  ThunkApiType<RootState>
>(
  TraineeActions.SYNC_TRAINEE_FRANCHISOR_AGREEMENT_DATA,
  async (input, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      trainee: { franchiseeAgreementData: coachFranchisorAgreementData },
    } = getState();

    try {
      if (userAuth?.auth_token) {
        const visitDataToSync = Object.values(
          coachFranchisorAgreementData
        ).filter(
          (visit) =>
            !!visit.syncId &&
            !!visit.traineeId &&
            !!visit.coachId &&
            !!visit.visitId
        );

        if (!!visitDataToSync.length) {
          const promises = visitDataToSync.map(async (item) => {
            const sections = mapVisitDataToVisitSections(item.visitData);

            const payload: CmsVisitDataInputModelInput = {
              traineeId: item.traineeId,
              visitId: item.visitId,
              coachId: item.coachId,
              visitData: {
                visitName: 'Coach smartspace check',
                sections,
              },
            };
            console.log('syncCoachSmartSpaceVisitData', payload);

            return await new TraineeService(
              userAuth?.auth_token
            ).addCoachVisitData(payload);
          });

          const result = await Promise.all(promises);
          return result.every((item) => item);
        } else {
          return true;
        }
      } else {
        return rejectWithValue('No auth');
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
