import { ResourceDto } from '@ecdlink/core';
import { RootState } from '../types';

export const getBusinessResources = (state: RootState): ResourceDto[] =>
  state.resourcesData.businessResources || [];

export const getClassroomResources = (state: RootState): ResourceDto[] =>
  state.resourcesData.classroomResources || [];
