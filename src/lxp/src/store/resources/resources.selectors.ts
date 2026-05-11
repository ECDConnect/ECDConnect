import { ResourceDto, ResourcesLikedDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getBusinessResources = (state: RootState): ResourceDto[] =>
  state.resourcesData.businessResources || [];

export const getClassroomResources = (state: RootState): ResourceDto[] =>
  state.resourcesData.classroomResources || [];

// export const getResourceLikedStatus = (
//   state: RootState,
//   contentId: number | undefined
// ): boolean => {
//   if (contentId == null) return false;

//   return state.resourcesData.resourceLikes?.find((x) => x.contentId === contentId)?.isActive ?? false;
// };

// export const getAllResourceLikesForUserSelector = (state: RootState): ResourcesLikedDto[] =>
//   state.resourcesData.resourceLikes || [];
