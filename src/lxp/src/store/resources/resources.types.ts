import { ResourceDto, ResourcesLikedDto } from '@ecdlink/core';

export interface ResourcesState {
  businessResources?: ResourceDto[];
  classroomResources?: ResourceDto[];
  resourceLikes?: ResourcesLikedDto[];
}
