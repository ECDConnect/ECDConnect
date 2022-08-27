export interface PractitionerProfileRouteState {
  practitionerId: string;
  isFromProgrammeView: boolean;
}

export interface PractitionerDashboardModel {
  id?: string | undefined;
  title?: string | undefined;
  subTitle?: string | undefined;
  avatarColor?: string | undefined;
  profileText?: string | undefined;
  alertSeverity?: string | undefined;
}
