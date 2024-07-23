export enum UserTypes {
  Practitioners = 'Practitioners',
  Coaches = 'Coaches',
  Administrators = 'Administrators',
  Children = 'Children',
}

export enum ConnectUsage {
  InvitationActive = 'Invitation active',
  InvitationExpired = 'Invitation expired',
  LastOnlineWithinPast6Months = 'Last online within past 6 months',
  LastOnlineOver6Months = 'Last online over 6 months ago',
  Removed = 'Removed (users who have been removed from the app)',
  SmsFailedAuthentication = 'SMS failed - authentication',
  SmsFailedConnection = 'SMS failed - connection',
  SmsFailedInsufficientCredits = 'SMS failed - insufficient credits',
  SmsFailedOptedOut = 'SMS failed - blocked/opted out',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PractionerType {
  PRACTITIONER = 'Practitioner',
  PRINCIPAL = 'Principal',
}
