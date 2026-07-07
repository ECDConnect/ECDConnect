import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState, ThunkApiType } from '../types';
import { ResourceDto, ResourcesLikedDto } from '@ecdlink/core';
import { ResourcesService } from '@/services/ResourcesService';
import { OverrideCache } from '@/models/sync/override-cache';

export const RescourcesActions = {
  GET_RESOURCES: 'getResources',
  GET_ALL_RESOURCE_LIKES_FOR_USER: 'getAllResourceLikesForUser',
  GET_RESOURCE_LIKED_STATUS_FOR_USER: 'getResourceLikedStatusForUser',
  GET_RESOURCE_BY_LANGUAGE: 'getResourceByLanguage',
  UPDATE_RESOURCE_LIKES: 'updateResourceLikes',
  REPORT_RESOURCE_PROBLEM: 'reportResourceProblem',
};

export const getResources = createAsyncThunk<
  ResourceDto[],
  { locale: string; sectionType: string } & OverrideCache,
  ThunkApiType<RootState>
>(
  RescourcesActions.GET_RESOURCES,
  async (
    { locale, sectionType, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      resourcesData: { businessResources: businessCache },
      resourcesData: { classroomResources: classroomCache },
    } = getState();

    const resourcesCache =
      sectionType === 'business' ? businessCache : classroomCache;

    if (!resourcesCache?.length || !!overrideCache) {
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

export const getAllResourceLikesForUser = createAsyncThunk<
  ResourcesLikedDto[],
  {} & OverrideCache,
  ThunkApiType<RootState>
>(
  RescourcesActions.GET_ALL_RESOURCE_LIKES_FOR_USER,
  async ({ overrideCache = false }, { getState, rejectWithValue }) => {
    const {
      auth: { userAuth },
      resourcesData: { resourceLikes },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && resourceLikes?.length) {
      return resourceLikes;
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const resourceLikes = await new ResourcesService(
        userAuth.auth_token
      ).allResourceLikesForUser();

      return resourceLikes;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getResourceLikedStatusForUser = createAsyncThunk<
  boolean,
  { contentId: number } & OverrideCache,
  ThunkApiType<RootState>
>(
  RescourcesActions.GET_RESOURCE_LIKED_STATUS_FOR_USER,
  async (
    { contentId, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const {
      auth: { userAuth },
      resourcesData: { resourceLikes },
    } = getState();

    // === CACHE CHECK ===
    if (!overrideCache && resourceLikes?.length) {
      const resource = resourceLikes.find((x) => x.contentId === contentId);
      if (resource) {
        return resource.isActive;
      }
    }

    // === FETCH FROM API ===
    try {
      if (!userAuth?.auth_token) {
        return rejectWithValue('no access token, profile check required');
      }

      const resourceLikes = await new ResourcesService(
        userAuth.auth_token
      ).getResourceLikedStatusForUser(contentId);

      return resourceLikes;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getResourceByLanguage = createAsyncThunk<
  ResourceDto,
  {
    contentId: number;
    contentTypeId: number;
    localeId: string;
    sectionType: string;
  } & OverrideCache,
  ThunkApiType<RootState>
>(
  RescourcesActions.GET_RESOURCE_BY_LANGUAGE,
  async (
    { contentId, contentTypeId, localeId, sectionType, overrideCache = false },
    { getState, rejectWithValue }
  ) => {
    const state = getState();
    const cachedResources =
      sectionType === 'business'
        ? state.resourcesData.businessResources
        : state.resourcesData.classroomResources;
    const cachedResource = cachedResources?.find((x) => x.id === contentId);

    if (!overrideCache && cachedResource) {
      return cachedResource;
    }

    if (!state.auth.userAuth?.auth_token) {
      return rejectWithValue('No access token');
    }

    try {
      const response = await new ResourcesService(
        state.auth.userAuth.auth_token
      ).resourceByLanguage(contentId, contentTypeId, localeId);

      return response;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch resource');
    }
  }
);

export const updateResourceLikes = createAsyncThunk<
  boolean,
  { contentId: number; contentTypeId: number; liked: boolean },
  ThunkApiType<RootState>
>(
  RescourcesActions.UPDATE_RESOURCE_LIKES,
  async (
    { contentId, contentTypeId, liked },
    { getState, rejectWithValue }
  ) => {
    const state = getState();

    if (!state.auth.userAuth?.auth_token) {
      return rejectWithValue('No access token');
    }

    try {
      const response = await new ResourcesService(
        state.auth.userAuth.auth_token
      ).updateResourceLikes(contentId, contentTypeId, liked);

      return response;
    } catch (err: any) {
      return rejectWithValue(err?.message || 'Failed to fetch resource');
    }
  }
);

export const reportResourceProblem = createAsyncThunk<
  boolean,
  {
    contentId: number;
    problemType: string;
    additionalDetails?: string;
    dataFreeAtReport: string;
    linkAtReport: string;
  },
  ThunkApiType<RootState>
>(
  RescourcesActions.REPORT_RESOURCE_PROBLEM,
  async (input, { getState, rejectWithValue }) => {
    const state = getState();

    if (!state.auth.userAuth?.auth_token) {
      return rejectWithValue('No access token');
    }

    try {
      const response = await new ResourcesService(
        state.auth.userAuth.auth_token
      ).reportResourceProblem(input);

      return response;
    } catch (err: any) {
      return rejectWithValue(
        err?.message || 'Failed to report resource problem'
      );
    }
  }
);
