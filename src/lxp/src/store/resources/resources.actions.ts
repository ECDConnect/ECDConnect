import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { ResourceDto } from '@ecdlink/core';
import { ResourcesService } from '@/services/ResourcesService';

export const RescourcesActions = {
  GET_RESOURCES: 'getResources',
};

export const getResources = createAsyncThunk<
  ResourceDto[],
  { locale: string; sectionType: string; overrideCache?: boolean },
  ThunkApiType<RootState>
>(
  RescourcesActions.GET_RESOURCES,
  async (
    { locale, sectionType, overrideCache },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      resourcesData: { businessResources: businessCache },
      resourcesData: { classroomResources: classroomCache },
    } = getState();

    const resourcesCache =
      sectionType === 'business' ? businessCache : classroomCache;

    if (!resourcesCache || !!overrideCache) {
      try {
        let resources: ResourceDto[] | undefined;

        if (userAuth?.auth_token) {
          resources = await new ResourcesService(
            userAuth?.auth_token
          ).getResources(locale, sectionType, '', [], [], null, null);
        } else {
          return rejectWithValue('no access token, profile check required');
        }

        if (!resources) {
          return rejectWithValue('Error getting resources');
        }

        return resources;
      } catch (err) {
        return rejectWithValue(err);
      }
    } else {
      return resourcesCache;
    }
  }
);
