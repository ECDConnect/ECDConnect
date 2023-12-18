export type ActionItem = {
  title: string;
  subTitle: string;
  type: 'AcceptLeaderRole' | 'MeetRegularly' | 'HostFamilyDays';
  details:
    | ActionItemAcceptLeaderRoleDetails
    | HostFamilyDaysDetails
    | MeetRegularlyDetails;
};

export type ActionItemAcceptLeaderRoleDetails = {
  dateAssigned: Date;
};

export type HostFamilyDaysDetails = {
  meetingsAttended: number;
  meetingsTotal: number;
};

export type MeetRegularlyDetails = {
  meetingsAttended: number;
  meetingsTotal: number;
};
