import { ClassroomGroupDto, LearnerDto } from '@ecdlink/core';

export interface ChildListLearner extends LearnerDto {
  avatarColor: string;
}

export interface PractitionerProfileRouteState {
  practitionerUserId: string;
  classroomGroup: ClassroomGroupDto;
}

export interface PractitionerDashboardModel {
  id?: string;
  title?: string;
  subTitle?: string;
  avatarColor?: string;
  profileText?: string;
  alertSeverity?: string;
}
