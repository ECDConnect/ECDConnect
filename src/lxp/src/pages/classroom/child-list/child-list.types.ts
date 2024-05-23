import { ChildDto, LearnerDto } from '@ecdlink/core';

export interface ChildListLearner extends LearnerDto {
  avatarColor: string;
}

export interface ChildListRouteState {
  classroomGroupId: string;
}

export type ChildData = {
  alertSeverity: number;
  attendancePercentage: number;
} & ChildDto;
