import { createSlice } from '@reduxjs/toolkit';
import {
  setFulfilledThunkActionStatus,
  setThunkActionStatus,
} from '@/store/utils';
import localforage from 'localforage';
import { ResourcesState } from './resources.types';
import {
  getAllResourceLikesForUser,
  getResourceByLanguage,
  getResourceLikedStatusForUser,
  getResources,
  updateResourceLikes,
} from './resources.actions';
import { ResourceDto, ResourcesLikedDto } from '@ecdlink/core';

const initialState: ResourcesState = {
  businessResources: undefined,
  classroomResources: undefined,
  resourceLikes: [],
};

const resourcesSlice = createSlice({
  name: 'resource',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    setThunkActionStatus(builder, getResources);
    setThunkActionStatus(builder, getAllResourceLikesForUser);
    setThunkActionStatus(builder, getResourceByLanguage);
    setThunkActionStatus(builder, getResourceLikedStatusForUser);
    builder.addCase(getResources.fulfilled, (state, action) => {
      if (action.meta.arg.sectionType === 'business') {
        state.businessResources = action.payload;
      } else {
        state.classroomResources = action.payload;
      }
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getAllResourceLikesForUser.fulfilled, (state, action) => {
      state.resourceLikes = action.payload;
      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(getResourceByLanguage.fulfilled, (state, action) => {
      const contentId = action.meta.arg.contentId;

      const resource: ResourceDto = {
        id: contentId,
        resourceType: action.payload.resourceType,
        title: action.payload.title,
        shortDescription: action.payload.shortDescription,
        link: action.payload.link,
        longDescription: action.payload.longDescription,
        dataFree: action.payload.dataFree,
        sectionType: action.payload.sectionType,
        numberLikes: action.payload.numberLikes,
        availableLanguages: action.payload.availableLanguages,
        updatedDate: action.payload.updatedDate,
        insertedDate: action.payload.insertedDate,
      };

      if (action.meta.arg.sectionType === 'business') {
        if (!state.businessResources) {
          state.businessResources = [];
        }
        const resourceIndex = state.businessResources.findIndex(
          (x) => x.id === contentId
        );

        if (resourceIndex === -1) {
          // Add new entry
          state.businessResources.push(resource);
        } else {
          // Update existing entry
          state.businessResources[resourceIndex] = resource;
        }
      } else {
        if (!state.classroomResources) {
          state.classroomResources = [];
        }

        const resourceIndex = state.classroomResources.findIndex(
          (x) => x.id === contentId
        );

        if (resourceIndex === -1) {
          // Add new entry
          state.classroomResources.push(resource);
        } else {
          // Update existing entry
          state.classroomResources[resourceIndex] = resource;
        }
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(updateResourceLikes.fulfilled, (state, action) => {
      const contentId = action.meta.arg.contentId;
      const isActive = action.meta.arg.liked;

      // Ensure the array exists
      if (!state.resourceLikes) {
        state.resourceLikes = [];
      }

      const resourceIndex = state.resourceLikes.findIndex(
        (x) => x.contentId === contentId
      );

      const newLike: ResourcesLikedDto = {
        contentId,
        isActive,
      };

      if (resourceIndex === -1) {
        // Add new entry
        state.resourceLikes.push(newLike);
      } else {
        // Update existing entry
        state.resourceLikes[resourceIndex] = newLike;
      }

      setFulfilledThunkActionStatus(state, action);
    });
    builder.addCase(
      getResourceLikedStatusForUser.fulfilled,
      (state, action) => {
        const contentId = action.meta.arg.contentId;
        const isActive = action.payload;

        // Ensure the array exists
        if (!state.resourceLikes) {
          state.resourceLikes = [];
        }

        const resourceIndex = state.resourceLikes.findIndex(
          (x) => x.contentId === contentId
        );

        const newLike: ResourcesLikedDto = {
          contentId,
          isActive,
        };

        if (resourceIndex === -1) {
          // Add new entry
          state.resourceLikes.push(newLike);
        } else {
          // Update existing entry
          state.resourceLikes[resourceIndex] = newLike;
        }

        setFulfilledThunkActionStatus(state, action);
      }
    );
  },
});

const { reducer: resourceReducer, actions: resourceActions } = resourcesSlice;

const resourcesPersistConfig = {
  key: 'resources',
  storage: localforage,
  blacklist: [],
};

export { resourcesPersistConfig, resourceReducer, resourceActions };
