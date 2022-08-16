export interface PractitionerProfileRouteState {
  practitionerId: number;
}

export interface PractitionerDashboardModel {
  id?: number | undefined;
  title?: string | undefined;
  subTitle?: string | undefined;
  avatarColor?: string | undefined;
  profileText?: string | undefined;
  alertSeverity?: string | undefined;
}
