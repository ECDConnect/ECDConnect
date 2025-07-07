export interface PractitionerProfileRouteState {
  practitionerId: string;
  isFromProgrammeView: boolean;
  isFromReassignView?: boolean;
}

export interface PractitionerDashboardModel {
  id?: string;
  title?: string;
  subTitle?: string;
  avatarColor?: string;
  profileText?: string;
  alertSeverity?: string;
}
