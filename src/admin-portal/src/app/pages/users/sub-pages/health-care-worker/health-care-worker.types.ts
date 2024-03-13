export enum ConnectUsage {
  InvitationActive = 'Invitation active',
  InvitationExpired = 'Invitation expired',
  LastOnlineWithinPast6Months = 'Last online within past 6 months',
  LastOnlineOver6Months = 'Last online over 6 months ago',
  Removed = 'Removed (users who have been removed from CHW Connect)',
}

export enum AppVisitActivity {
  High = 'High activity (at least 20 visits in past month)',
  Medium = 'Medium activity (at least 10 visits in past month)',
  Low = 'Low activity (no home visits in the past month)',
}
