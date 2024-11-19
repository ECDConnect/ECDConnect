// the fieldname to retrieve consent is 'name'
export enum ContentConsentTypeEnum {
  PersonalInformationAgreement = 'Personal Information Agreement',
  IndividualTermsAndConditions = 'Individual Ts & Cs',
  OrganisationalTermsAndConditions = 'Organisational Ts & Cs',
  AdminTermsAndConditions = 'Admin terms and conditions',
  DataPermissionsAgreement = 'Data Permissions Agreement',
  TermsAndConditions = 'Terms & Conditions',
  PermissionToShare = 'Permission to Share Information',
  PhotoPermissions = 'Photo Permissions',
}

export enum MoreInformationTypeEnum {
  Points = 'Points',
  IncomeStatements = 'Income statements',
  TakingChildAttendance = 'Taking Child Attendance',
  IdeasForMakingAProfit = 'Ideas for making a profit',
  LearningThroughPlay = 'Learning through play',
  TheDailyRoutine = 'The daily routine',
  DevelopingChildrenHolistically = 'Developing children holistically',
  TrackingProgress = 'Tracking Progress',
}

export enum ContentTypeEnum {
  ProgrammeRoutine = 1,
  ProgrammeRoutineItem = 2,
  ProgrammeRoutineSubItem = 3,
  ProgressTrackingCategory = 4,
  ProgressTrackingSubCategory = 5,
  ProgressTrackingLevel = 6,
  ProgressTrackingSkill = 7,
  Theme = 8,
  ThemeDay = 9,
  StoryBook = 10,
  StoryBookParts = 11,
  StoryBookPartQuestion = 12,
  Activity = 13,
  Consent = 14,
  Connect = 27,
  ConnectItem = 28,
  MoreInformation = 15,
  ClassroomBusinessResource = 39,
}
