export enum LeagueType {
  Purple = 'Purple',
  NewStars = 'New Stars',
  RisingStars = 'Rising Stars',
  Other = 'Other',
}

export const daysToAcceptBeingLeader = 14;

export const maxCharactersInClubName = 35;

export const MIN_RISING_STARS_POINTS = 1600;
export const MAX_RISING_STARS_POINTS = 2000;
export const MIN_PURPLE_CLUB_POINTS = 1760;
export const MAX_PURPLE_CLUB_POINTS = 2200;

export const MAX_MEMBERS_IN_CLUB = 17;
export const MIN_MEMBERS_IN_CLUB = 4;

export const enum ClubActivities {
  BeCreative = 'Be creative',
  CaptureChildAttendance = 'Capture child attendance',
  CompleteChildProgressReports = 'Complete child progress reports',
  HostFamilyDays = 'Host family days',
  LeaveNoOneBehind = 'Leave no one behind',
  MeetRegularly = 'Meet regularly',
}

export const ClubActivitiesMaxPointsPerLeague = {
  MeetRegularly: {
    NewStars: 800,
    RisingStars: 800,
  },
  // TODO: add other activities
};

export const enum IssuesTasks {
  noClubLeader = 'No club leader',
  contactClubLeader = 'Contact club leader',
  contactClubLeaderName = 'Contact ',
  chooseClubLeader = 'Choose a new club leader',
  assignClubLeader = 'Assign club leader',
  notAcceptedClubLeader = 'Club leader has not accepted agreement',
  notEnoughClubMembers = 'Not enough club members',
  contact_club_members = 'Contact club members',
  addMembers = 'Add members',
  tooManyClubMembers = 'Too many club members',
  createClub = 'Create an additional club',
  clubLeaderMonths = ' has been a club leader for 6 or more months',
  missingRegister = 'Missing club meeting register',
  missingRegisterForMonth = ' club meeting register',
  clubAttendance = '% club attendance in ',
}
