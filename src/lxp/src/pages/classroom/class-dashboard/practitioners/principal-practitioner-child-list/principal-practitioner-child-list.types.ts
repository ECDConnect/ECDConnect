import { LearnerDto } from '@ecdlink/core';

export interface ChildListLearner extends LearnerDto {
  avatarColor: string;
}

export interface PractitionerProfileRouteState {
  practitionerId: string;
  classroomItem: any;
}

export interface PractitionerDashboardModel {
  id?: string | undefined;
  title?: string | undefined;
  subTitle?: string | undefined;
  avatarColor?: string | undefined;
  profileText?: string | undefined;
  alertSeverity?: string | undefined;
}
