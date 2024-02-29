import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Decimal: any;
  UUID: any;
  Upload: any;
};

export type AbsenteeDetail = {
  __typename?: 'AbsenteeDetail';
  absentDate: Scalars['DateTime'];
  absentDateEnd?: Maybe<Scalars['DateTime']>;
  absenteeId?: Maybe<Scalars['String']>;
  className?: Maybe<Scalars['String']>;
  classroomGroupId?: Maybe<Scalars['String']>;
  loggedByPerson?: Maybe<Scalars['String']>;
  loggedByUserId?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  reassignedToPerson?: Maybe<Scalars['String']>;
  reassignedToUserId?: Maybe<Scalars['String']>;
};

export type Absentees = {
  __typename?: 'Absentees';
  absentDate: Scalars['DateTime'];
  absentDateEnd?: Maybe<Scalars['DateTime']>;
  assignedDate?: Maybe<Scalars['DateTime']>;
  completedDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isRoleAssign: Scalars['Boolean'];
  loggedBy?: Maybe<Scalars['String']>;
  program?: Maybe<Programme>;
  reason?: Maybe<Scalars['String']>;
  reassignedClass?: Maybe<Scalars['String']>;
  reassignedToPractitioner?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type AbsenteesFilterInput = {
  absentDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  absentDateEnd?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  and?: InputMaybe<Array<AbsenteesFilterInput>>;
  assignedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  completedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isRoleAssign?: InputMaybe<BooleanOperationFilterInput>;
  loggedBy?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AbsenteesFilterInput>>;
  program?: InputMaybe<ProgrammeFilterInput>;
  reason?: InputMaybe<StringOperationFilterInput>;
  reassignedClass?: InputMaybe<StringOperationFilterInput>;
  reassignedToPractitioner?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type AbsenteesInput = {
  AbsentDate: Scalars['DateTime'];
  AbsentDateEnd?: InputMaybe<Scalars['DateTime']>;
  AssignedDate?: InputMaybe<Scalars['DateTime']>;
  CompletedDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsRoleAssign: Scalars['Boolean'];
  LoggedBy?: InputMaybe<Scalars['String']>;
  Program?: InputMaybe<ProgrammeInput>;
  Reason?: InputMaybe<Scalars['String']>;
  ReassignedClass?: InputMaybe<Scalars['String']>;
  ReassignedToPractitioner?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type AbsenteesSortInput = {
  absentDate?: InputMaybe<SortEnumType>;
  absentDateEnd?: InputMaybe<SortEnumType>;
  assignedDate?: InputMaybe<SortEnumType>;
  completedDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isRoleAssign?: InputMaybe<SortEnumType>;
  loggedBy?: InputMaybe<SortEnumType>;
  program?: InputMaybe<ProgrammeSortInput>;
  reason?: InputMaybe<SortEnumType>;
  reassignedClass?: InputMaybe<SortEnumType>;
  reassignedToPractitioner?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type ActionItemMissedProgressReportsDisplay = {
  __typename?: 'ActionItemMissedProgressReportsDisplay';
  color?: Maybe<Scalars['String']>;
  currentReportingPeriodEnd: Scalars['DateTime'];
  groupingName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  nextReportingPeriodEnd: Scalars['DateTime'];
  notes?: Maybe<Scalars['String']>;
  practitionerUser?: Maybe<ApplicationUser>;
  subject?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type Activity = {
  __typename?: 'Activity';
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  materials?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  subCategories?: Maybe<Array<Maybe<ProgressTrackingSubCategory>>>;
  subType?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ActivityBeCreative = {
  __typename?: 'ActivityBeCreative';
  monthlyRecords?: Maybe<Array<Maybe<ActivityBeCreativeDetail>>>;
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
};

export type ActivityBeCreativeDetail = {
  __typename?: 'ActivityBeCreativeDetail';
  description?: Maybe<Scalars['String']>;
  documentName?: Maybe<Scalars['String']>;
  documentReference?: Maybe<Scalars['String']>;
  documentStatus?: Maybe<Scalars['String']>;
  documentStatusColor?: Maybe<Scalars['String']>;
  imageApproved?: Maybe<Scalars['Boolean']>;
  imageRating: Scalars['Float'];
  monthName?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
};

export type ActivityChildAttendance = {
  __typename?: 'ActivityChildAttendance';
  monthlyRecords?: Maybe<Array<Maybe<ActivityChildAttendanceDetail>>>;
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
};

export type ActivityChildAttendanceDetail = {
  __typename?: 'ActivityChildAttendanceDetail';
  monthName?: Maybe<Scalars['String']>;
  percentageMembersSubmittedAllRegisters: Scalars['Int'];
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
};

export type ActivityChildProgress = {
  __typename?: 'ActivityChildProgress';
  monthlyRecords?: Maybe<Array<Maybe<ActivityChildProgressDetail>>>;
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
};

export type ActivityChildProgressDetail = {
  __typename?: 'ActivityChildProgressDetail';
  caregiverPerc: Scalars['Int'];
  caregiverPoints: Scalars['Int'];
  caregiverPointsColor?: Maybe<Scalars['String']>;
  monthName?: Maybe<Scalars['String']>;
  progressPerc: Scalars['Int'];
  progressPoints: Scalars['Int'];
  progressPointsColor?: Maybe<Scalars['String']>;
};

export type ActivityHostFamilyDays = {
  __typename?: 'ActivityHostFamilyDays';
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
  terms?: Maybe<Array<Maybe<ActivityHostFamilyDaysDetail>>>;
};

export type ActivityHostFamilyDaysDetail = {
  __typename?: 'ActivityHostFamilyDaysDetail';
  description?: Maybe<Scalars['String']>;
  documentStatus?: Maybe<Scalars['String']>;
  documentStatusColor?: Maybe<Scalars['String']>;
  eventName?: Maybe<Scalars['String']>;
  meetingParticipantsPractitionerIds?: Maybe<Array<Scalars['UUID']>>;
  points: Scalars['Int'];
  termName?: Maybe<Scalars['String']>;
  termNr: Scalars['Int'];
};

export type ActivityInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  materials?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  subCategories?: InputMaybe<Scalars['String']>;
  subType?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type ActivityLeaveNoOneBehind = {
  __typename?: 'ActivityLeaveNoOneBehind';
  bluePerc: Scalars['Float'];
  blueText?: Maybe<Scalars['String']>;
  blueUsers?: Maybe<Array<Maybe<ClubUser>>>;
  greenPerc: Scalars['Float'];
  greenText?: Maybe<Scalars['String']>;
  greenUsers?: Maybe<Array<Maybe<ClubUser>>>;
  orangePerc: Scalars['Float'];
  orangeText?: Maybe<Scalars['String']>;
  orangeUsers?: Maybe<Array<Maybe<ClubUser>>>;
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
  redPerc: Scalars['Float'];
  redText?: Maybe<Scalars['String']>;
  redUsers?: Maybe<Array<Maybe<ClubUser>>>;
};

export type ActivityMeetRegular = {
  __typename?: 'ActivityMeetRegular';
  pastMeetings?: Maybe<Array<Maybe<ActivityMeetRegularDetail>>>;
  points: Scalars['Int'];
  pointsColor?: Maybe<Scalars['String']>;
  upcomingMeetings?: Maybe<Array<Maybe<ActivityMeetRegularDetail>>>;
};

export type ActivityMeetRegularDetail = {
  __typename?: 'ActivityMeetRegularDetail';
  clubLeaderContacted: Scalars['Boolean'];
  eventId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  meetingAbsentees?: Maybe<Array<Maybe<ClubUser>>>;
  meetingAttendanceColor?: Maybe<Scalars['String']>;
  meetingAttendancePerc: Scalars['Float'];
  meetingDate: Scalars['DateTime'];
  meetingNotes?: Maybe<Scalars['String']>;
  meetingParticipants?: Maybe<Array<Maybe<ClubUser>>>;
  name?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
};

export type AddChildCaregiverTokenModelInput = {
  additionalFirstName?: InputMaybe<Scalars['String']>;
  additionalPhoneNumber?: InputMaybe<Scalars['String']>;
  additionalSurname?: InputMaybe<Scalars['String']>;
  contribution: Scalars['Boolean'];
  educationId?: InputMaybe<Scalars['UUID']>;
  emergencyContactFirstName?: InputMaybe<Scalars['String']>;
  emergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  emergencyContactSurname?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  joinReferencePanel: Scalars['Boolean'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  relationId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type AddChildLearnerTokenModelInput = {
  attendanceReasonId?: InputMaybe<Scalars['UUID']>;
  otherAttendanceReason?: InputMaybe<Scalars['String']>;
};

export type AddChildRegistrationTokenModelInput = {
  file?: InputMaybe<Scalars['String']>;
  fileName?: InputMaybe<Scalars['String']>;
  fileType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type AddChildSiteAddressTokenModelInput = {
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  provinceId: Scalars['UUID'];
  ward?: InputMaybe<Scalars['String']>;
};

export type AddChildTokenModelInput = {
  allergies?: InputMaybe<Scalars['String']>;
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  disabilities?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  idNumber?: InputMaybe<Scalars['String']>;
  insertedBy?: InputMaybe<Scalars['String']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  languageId?: InputMaybe<Scalars['UUID']>;
  otherHealthConditions?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
  workflowStatusId?: InputMaybe<Scalars['UUID']>;
};

export type AddChildUserConsentTokenModelInput = {
  childPhotoConsentAccepted: Scalars['Boolean'];
  commitmentAgreementAccepted: Scalars['Boolean'];
  consentAgreementAccepted: Scalars['Boolean'];
  indemnityAgreementAccepted: Scalars['Boolean'];
  personalInformationAgreementAccepted: Scalars['Boolean'];
  userId?: InputMaybe<Scalars['String']>;
};

export type AgeSpreadDisplay = {
  __typename?: 'AgeSpreadDisplay';
  color?: Maybe<Scalars['String']>;
  groupingName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  percentChildrenOutsideAgeGroup: Scalars['Int'];
  subject?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type ApplicationIdentityRole = {
  __typename?: 'ApplicationIdentityRole';
  concurrencyStamp?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  tenantId?: Maybe<Scalars['UUID']>;
};

export type ApplicationUser = {
  __typename?: 'ApplicationUser';
  coachObjectData?: Maybe<Coach>;
  contactPreference?: Maybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  documents?: Maybe<Array<Maybe<Document>>>;
  email?: Maybe<Scalars['String']>;
  emailConfirmed: Scalars['Boolean'];
  emergencyContactFirstName?: Maybe<Scalars['String']>;
  emergencyContactFullName?: Maybe<Scalars['String']>;
  emergencyContactPhoneNumber?: Maybe<Scalars['String']>;
  emergencyContactSurname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  franchisorObjectData?: Maybe<Franchisor>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isImported?: Maybe<Scalars['Boolean']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  lastSeen: Scalars['DateTime'];
  lockoutEnd?: Maybe<Scalars['DateTime']>;
  nextOfKinContactNumber?: Maybe<Scalars['String']>;
  nextOfKinFirstName?: Maybe<Scalars['String']>;
  nextOfKinSurname?: Maybe<Scalars['String']>;
  nickFirstName?: Maybe<Scalars['String']>;
  nickFullName?: Maybe<Scalars['String']>;
  nickSurname?: Maybe<Scalars['String']>;
  normalizedEmail?: Maybe<Scalars['String']>;
  normalizedUserName?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Maybe<Note>>>;
  pendingEmail?: Maybe<Scalars['String']>;
  pendingPhoneNumber?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  phoneNumberConfirmed: Scalars['Boolean'];
  practitionerObjectData?: Maybe<Practitioner>;
  preferredCommunicationLanguage?: Maybe<Scalars['String']>;
  principalObjectData?: Maybe<Practitioner>;
  profileImageUrl?: Maybe<Scalars['String']>;
  race?: Maybe<Race>;
  raceId?: Maybe<Scalars['UUID']>;
  reasonForLeaving?: Maybe<Scalars['String']>;
  reasonForLeavingComments?: Maybe<Scalars['String']>;
  resetData?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Array<Maybe<ApplicationIdentityRole>>>;
  surname?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['UUID']>;
  traineeObjectData?: Maybe<Trainee>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: Maybe<Scalars['DateTime']>;
  userName?: Maybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ApplicationUserFilterInput = {
  and?: InputMaybe<Array<ApplicationUserFilterInput>>;
  coachObjectData?: InputMaybe<CoachFilterInput>;
  contactPreference?: InputMaybe<StringOperationFilterInput>;
  dateOfBirth?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  emailConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  emergencyContactFirstName?: InputMaybe<StringOperationFilterInput>;
  emergencyContactFullName?: InputMaybe<StringOperationFilterInput>;
  emergencyContactPhoneNumber?: InputMaybe<StringOperationFilterInput>;
  emergencyContactSurname?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  franchisorObjectData?: InputMaybe<FranchisorFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isImported?: InputMaybe<BooleanOperationFilterInput>;
  isSouthAfricanCitizen?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  lastSeen?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  lockoutEnd?: InputMaybe<ComparableNullableOfDateTimeOffsetOperationFilterInput>;
  nextOfKinContactNumber?: InputMaybe<StringOperationFilterInput>;
  nextOfKinFirstName?: InputMaybe<StringOperationFilterInput>;
  nextOfKinSurname?: InputMaybe<StringOperationFilterInput>;
  nickFirstName?: InputMaybe<StringOperationFilterInput>;
  nickFullName?: InputMaybe<StringOperationFilterInput>;
  nickSurname?: InputMaybe<StringOperationFilterInput>;
  normalizedEmail?: InputMaybe<StringOperationFilterInput>;
  normalizedUserName?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<ListFilterInputTypeOfNoteFilterInput>;
  or?: InputMaybe<Array<ApplicationUserFilterInput>>;
  pendingEmail?: InputMaybe<StringOperationFilterInput>;
  pendingPhoneNumber?: InputMaybe<StringOperationFilterInput>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  phoneNumberConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  practitionerObjectData?: InputMaybe<PractitionerFilterInput>;
  preferredCommunicationLanguage?: InputMaybe<StringOperationFilterInput>;
  principalObjectData?: InputMaybe<PractitionerFilterInput>;
  profileImageUrl?: InputMaybe<StringOperationFilterInput>;
  race?: InputMaybe<RaceFilterInput>;
  raceId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  reasonForLeaving?: InputMaybe<StringOperationFilterInput>;
  reasonForLeavingComments?: InputMaybe<StringOperationFilterInput>;
  resetData?: InputMaybe<BooleanOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  tenantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  traineeObjectData?: InputMaybe<TraineeFilterInput>;
  twoFactorEnabled?: InputMaybe<BooleanOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
  verifiedByHomeAffairs?: InputMaybe<BooleanOperationFilterInput>;
  whatsAppNumber?: InputMaybe<StringOperationFilterInput>;
};

export type ApplicationUserInput = {
  coachObjectData?: InputMaybe<CoachInput>;
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  email?: InputMaybe<Scalars['String']>;
  emailConfirmed: Scalars['Boolean'];
  emergencyContactFirstName?: InputMaybe<Scalars['String']>;
  emergencyContactFullName?: InputMaybe<Scalars['String']>;
  emergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  emergencyContactSurname?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  franchisorObjectData?: InputMaybe<FranchisorInput>;
  fullName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderInput>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: InputMaybe<Scalars['String']>;
  insertedDate?: InputMaybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isImported?: InputMaybe<Scalars['Boolean']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: InputMaybe<LanguageInput>;
  languageId?: InputMaybe<Scalars['UUID']>;
  lastSeen: Scalars['DateTime'];
  lockoutEnd?: InputMaybe<Scalars['DateTime']>;
  nextOfKinContactNumber?: InputMaybe<Scalars['String']>;
  nextOfKinFirstName?: InputMaybe<Scalars['String']>;
  nextOfKinSurname?: InputMaybe<Scalars['String']>;
  nickFirstName?: InputMaybe<Scalars['String']>;
  nickFullName?: InputMaybe<Scalars['String']>;
  nickSurname?: InputMaybe<Scalars['String']>;
  normalizedEmail?: InputMaybe<Scalars['String']>;
  normalizedUserName?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Array<InputMaybe<NoteInput>>>;
  pendingEmail?: InputMaybe<Scalars['String']>;
  pendingPhoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberConfirmed: Scalars['Boolean'];
  practitionerObjectData?: InputMaybe<PractitionerInput>;
  preferredCommunicationLanguage?: InputMaybe<Scalars['String']>;
  principalObjectData?: InputMaybe<PractitionerInput>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  race?: InputMaybe<RaceInput>;
  raceId?: InputMaybe<Scalars['UUID']>;
  reasonForLeaving?: InputMaybe<Scalars['String']>;
  reasonForLeavingComments?: InputMaybe<Scalars['String']>;
  resetData?: InputMaybe<Scalars['Boolean']>;
  surname?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['UUID']>;
  traineeObjectData?: InputMaybe<TraineeInput>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: InputMaybe<Scalars['DateTime']>;
  userName?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type ApplicationUserSortInput = {
  coachObjectData?: InputMaybe<CoachSortInput>;
  contactPreference?: InputMaybe<SortEnumType>;
  dateOfBirth?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  emailConfirmed?: InputMaybe<SortEnumType>;
  emergencyContactFirstName?: InputMaybe<SortEnumType>;
  emergencyContactFullName?: InputMaybe<SortEnumType>;
  emergencyContactPhoneNumber?: InputMaybe<SortEnumType>;
  emergencyContactSurname?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  franchisorObjectData?: InputMaybe<FranchisorSortInput>;
  fullName?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<GenderSortInput>;
  genderId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isImported?: InputMaybe<SortEnumType>;
  isSouthAfricanCitizen?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
  lastSeen?: InputMaybe<SortEnumType>;
  lockoutEnd?: InputMaybe<SortEnumType>;
  nextOfKinContactNumber?: InputMaybe<SortEnumType>;
  nextOfKinFirstName?: InputMaybe<SortEnumType>;
  nextOfKinSurname?: InputMaybe<SortEnumType>;
  nickFirstName?: InputMaybe<SortEnumType>;
  nickFullName?: InputMaybe<SortEnumType>;
  nickSurname?: InputMaybe<SortEnumType>;
  normalizedEmail?: InputMaybe<SortEnumType>;
  normalizedUserName?: InputMaybe<SortEnumType>;
  pendingEmail?: InputMaybe<SortEnumType>;
  pendingPhoneNumber?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  phoneNumberConfirmed?: InputMaybe<SortEnumType>;
  practitionerObjectData?: InputMaybe<PractitionerSortInput>;
  preferredCommunicationLanguage?: InputMaybe<SortEnumType>;
  principalObjectData?: InputMaybe<PractitionerSortInput>;
  profileImageUrl?: InputMaybe<SortEnumType>;
  race?: InputMaybe<RaceSortInput>;
  raceId?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<SortEnumType>;
  reasonForLeavingComments?: InputMaybe<SortEnumType>;
  resetData?: InputMaybe<SortEnumType>;
  surname?: InputMaybe<SortEnumType>;
  tenantId?: InputMaybe<SortEnumType>;
  traineeObjectData?: InputMaybe<TraineeSortInput>;
  twoFactorEnabled?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
  verifiedByHomeAffairs?: InputMaybe<SortEnumType>;
  whatsAppNumber?: InputMaybe<SortEnumType>;
};

export enum ApplyPolicy {
  AfterResolver = 'AFTER_RESOLVER',
  BeforeResolver = 'BEFORE_RESOLVER',
}

export type Attendance = {
  __typename?: 'Attendance';
  attendanceDate: Scalars['DateTime'];
  attended: Scalars['Boolean'];
  classroomProgramme?: Maybe<ClassProgramme>;
  classroomProgrammeId: Scalars['UUID'];
  monthOfYear: Scalars['Int'];
  parentRecordId?: Maybe<Scalars['String']>;
  tenantId: Scalars['UUID'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  weekOfYear: Scalars['Int'];
  year: Scalars['Int'];
};

export type AttendanceFilterInput = {
  and?: InputMaybe<Array<AttendanceFilterInput>>;
  attendanceDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  attended?: InputMaybe<BooleanOperationFilterInput>;
  classroomProgramme?: InputMaybe<ClassProgrammeFilterInput>;
  classroomProgrammeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  monthOfYear?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<AttendanceFilterInput>>;
  parentRecordId?: InputMaybe<StringOperationFilterInput>;
  tenantId?: InputMaybe<ComparableGuidOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  weekOfYear?: InputMaybe<ComparableInt32OperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type AuditLogType = {
  __typename?: 'AuditLogType';
  description?: Maybe<Scalars['String']>;
  enumId: AuditLogTypeEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export enum AuditLogTypeEnum {
  TrackAttendance = 'TRACK_ATTENDANCE',
  Unknown = 'UNKNOWN',
}

export type AuditLogTypeEnumOperationFilterInput = {
  eq?: InputMaybe<AuditLogTypeEnum>;
  in?: InputMaybe<Array<AuditLogTypeEnum>>;
  neq?: InputMaybe<AuditLogTypeEnum>;
  nin?: InputMaybe<Array<AuditLogTypeEnum>>;
};

export type AuditLogTypeFilterInput = {
  and?: InputMaybe<Array<AuditLogTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<AuditLogTypeEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<AuditLogTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type AuditLogTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: AuditLogTypeEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type AuditLogTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type BeCreativeUploadInput = {
  clubId: Scalars['UUID'];
  dateUploaded: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  fileType?: InputMaybe<Scalars['String']>;
  imageBase64?: InputMaybe<Scalars['String']>;
};

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
};

export type BulkDeactivateResult = {
  __typename?: 'BulkDeactivateResult';
  failed?: Maybe<Array<Maybe<Scalars['String']>>>;
  success?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BulkInvitationResult = {
  __typename?: 'BulkInvitationResult';
  failed?: Maybe<Array<Maybe<Scalars['String']>>>;
  success?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CmsConnectItemModelInput = {
  buttonText?: InputMaybe<Scalars['String']>;
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  link?: InputMaybe<Scalars['String']>;
  linkedConnect: Scalars['Int'];
};

export type CmsConnectModelInput = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  hint?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<CmsConnectItemModelInput>>>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type CmsQuestionInput = {
  answer?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
};

export type CmsVisitDataInput = {
  sections?: InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;
  visitName?: InputMaybe<Scalars['String']>;
};

export type CmsVisitDataInputModelInput = {
  coachId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  infantId?: InputMaybe<Scalars['String']>;
  motherId?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  traineeId?: InputMaybe<Scalars['String']>;
  visitData?: InputMaybe<CmsVisitDataInput>;
  visitId?: InputMaybe<Scalars['String']>;
};

export type CmsVisitSectionInput = {
  questions?: InputMaybe<Array<InputMaybe<CmsQuestionInput>>>;
  visitSection?: InputMaybe<Scalars['String']>;
};

export type CalendarEvent = {
  __typename?: 'CalendarEvent';
  action?: Maybe<Scalars['String']>;
  allDay: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  end: Scalars['DateTime'];
  eventType?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  participants?: Maybe<Array<Maybe<CalendarEventParticipant>>>;
  start: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  visit?: Maybe<Visit>;
};

export type CalendarEventFilterInput = {
  action?: InputMaybe<StringOperationFilterInput>;
  allDay?: InputMaybe<BooleanOperationFilterInput>;
  and?: InputMaybe<Array<CalendarEventFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  end?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  eventType?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CalendarEventFilterInput>>;
  participants?: InputMaybe<ListFilterInputTypeOfCalendarEventParticipantFilterInput>;
  start?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  visit?: InputMaybe<VisitFilterInput>;
};

export type CalendarEventInput = {
  Action?: InputMaybe<Scalars['String']>;
  AllDay: Scalars['Boolean'];
  Description?: InputMaybe<Scalars['String']>;
  End: Scalars['DateTime'];
  EventType?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Participants?: InputMaybe<Array<InputMaybe<CalendarEventParticipantInput>>>;
  Start: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Visit?: InputMaybe<VisitInput>;
};

export type CalendarEventModelInput = {
  action?: InputMaybe<Scalars['String']>;
  allDay: Scalars['Boolean'];
  description?: InputMaybe<Scalars['String']>;
  end: Scalars['DateTime'];
  eventType?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  participants?: InputMaybe<
    Array<InputMaybe<CalendarEventParticipantModelInput>>
  >;
  start: Scalars['DateTime'];
};

export type CalendarEventParticipant = {
  __typename?: 'CalendarEventParticipant';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  participantUser?: Maybe<ApplicationUser>;
  participantUserId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CalendarEventParticipantFilterInput = {
  and?: InputMaybe<Array<CalendarEventParticipantFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CalendarEventParticipantFilterInput>>;
  participantUser?: InputMaybe<ApplicationUserFilterInput>;
  participantUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type CalendarEventParticipantInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ParticipantUser?: InputMaybe<ApplicationUserInput>;
  ParticipantUserId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type CalendarEventParticipantModelInput = {
  id?: InputMaybe<Scalars['String']>;
  participantUserId: Scalars['UUID'];
};

export type CalendarEventParticipantSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  participantUser?: InputMaybe<ApplicationUserSortInput>;
  participantUserId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type CalendarEventSortInput = {
  action?: InputMaybe<SortEnumType>;
  allDay?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  end?: InputMaybe<SortEnumType>;
  eventType?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  start?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  visit?: InputMaybe<VisitSortInput>;
};

export type CalendarEventType = {
  __typename?: 'CalendarEventType';
  colour?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type CalendarEventTypeInput = {
  colour?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Caregiver = {
  __typename?: 'Caregiver';
  additionalFirstName?: Maybe<Scalars['String']>;
  additionalPhoneNumber?: Maybe<Scalars['String']>;
  additionalSurname?: Maybe<Scalars['String']>;
  age?: Maybe<Scalars['String']>;
  contribution: Scalars['Boolean'];
  education?: Maybe<Education>;
  educationId?: Maybe<Scalars['UUID']>;
  emergencyContactFirstName?: Maybe<Scalars['String']>;
  emergencyContactPhoneNumber?: Maybe<Scalars['String']>;
  emergencyContactSurname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  grants?: Maybe<Array<Maybe<Grant>>>;
  healthCareWorker?: Maybe<HealthCareWorker>;
  healthCareWorkerId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  infants?: Maybe<Array<Maybe<Infant>>>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isAllowedCustody: Scalars['Boolean'];
  isMother: Scalars['Boolean'];
  joinReferencePanel: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  mother?: Maybe<Mother>;
  phoneNumber?: Maybe<Scalars['String']>;
  relation?: Maybe<Relation>;
  relationId?: Maybe<Scalars['UUID']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  surname?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type CaregiverClients = {
  __typename?: 'CaregiverClients';
  infants?: Maybe<Array<Maybe<Infant>>>;
  mother?: Maybe<Mother>;
};

export type CaregiverFilterInput = {
  additionalFirstName?: InputMaybe<StringOperationFilterInput>;
  additionalPhoneNumber?: InputMaybe<StringOperationFilterInput>;
  additionalSurname?: InputMaybe<StringOperationFilterInput>;
  age?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<CaregiverFilterInput>>;
  contribution?: InputMaybe<BooleanOperationFilterInput>;
  education?: InputMaybe<EducationFilterInput>;
  educationId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  emergencyContactFirstName?: InputMaybe<StringOperationFilterInput>;
  emergencyContactPhoneNumber?: InputMaybe<StringOperationFilterInput>;
  emergencyContactSurname?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  grants?: InputMaybe<ListFilterInputTypeOfGrantFilterInput>;
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  infants?: InputMaybe<ListFilterInputTypeOfInfantFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isAllowedCustody?: InputMaybe<BooleanOperationFilterInput>;
  isMother?: InputMaybe<BooleanOperationFilterInput>;
  joinReferencePanel?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  or?: InputMaybe<Array<CaregiverFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  relation?: InputMaybe<RelationFilterInput>;
  relationId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  whatsAppNumber?: InputMaybe<StringOperationFilterInput>;
};

export type CaregiverInput = {
  AdditionalFirstName?: InputMaybe<Scalars['String']>;
  AdditionalPhoneNumber?: InputMaybe<Scalars['String']>;
  AdditionalSurname?: InputMaybe<Scalars['String']>;
  Age?: InputMaybe<Scalars['String']>;
  Contribution: Scalars['Boolean'];
  Education?: InputMaybe<EducationInput>;
  EducationId?: InputMaybe<Scalars['UUID']>;
  EmergencyContactFirstName?: InputMaybe<Scalars['String']>;
  EmergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  EmergencyContactSurname?: InputMaybe<Scalars['String']>;
  FirstName?: InputMaybe<Scalars['String']>;
  FullName?: InputMaybe<Scalars['String']>;
  Grants?: InputMaybe<Array<InputMaybe<GrantInput>>>;
  HealthCareWorker?: InputMaybe<HealthCareWorkerInput>;
  HealthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IdNumber?: InputMaybe<Scalars['String']>;
  Infants?: InputMaybe<Array<InputMaybe<InfantInput>>>;
  IsActive: Scalars['Boolean'];
  IsAllowedCustody: Scalars['Boolean'];
  JoinReferencePanel: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  Mother?: InputMaybe<MotherInput>;
  PhoneNumber?: InputMaybe<Scalars['String']>;
  Relation?: InputMaybe<RelationInput>;
  RelationId?: InputMaybe<Scalars['UUID']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  Surname?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  WhatsAppNumber?: InputMaybe<Scalars['String']>;
  isMother: Scalars['Boolean'];
};

export type CaregiverModelInput = {
  age?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  healthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  relationId?: InputMaybe<Scalars['UUID']>;
  siteAddress?: InputMaybe<SiteAddressInput>;
  siteAddressId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type CaregiverSortInput = {
  additionalFirstName?: InputMaybe<SortEnumType>;
  additionalPhoneNumber?: InputMaybe<SortEnumType>;
  additionalSurname?: InputMaybe<SortEnumType>;
  age?: InputMaybe<SortEnumType>;
  contribution?: InputMaybe<SortEnumType>;
  education?: InputMaybe<EducationSortInput>;
  educationId?: InputMaybe<SortEnumType>;
  emergencyContactFirstName?: InputMaybe<SortEnumType>;
  emergencyContactPhoneNumber?: InputMaybe<SortEnumType>;
  emergencyContactSurname?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  healthCareWorker?: InputMaybe<HealthCareWorkerSortInput>;
  healthCareWorkerId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isAllowedCustody?: InputMaybe<SortEnumType>;
  isMother?: InputMaybe<SortEnumType>;
  joinReferencePanel?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
  mother?: InputMaybe<MotherSortInput>;
  phoneNumber?: InputMaybe<SortEnumType>;
  relation?: InputMaybe<RelationSortInput>;
  relationId?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  surname?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  whatsAppNumber?: InputMaybe<SortEnumType>;
};

export type CategoryTask = {
  __typename?: 'CategoryTask';
  description?: Maybe<Scalars['String']>;
  levelId: Scalars['Int'];
  skillId: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type Child = {
  __typename?: 'Child';
  allergies?: Maybe<Scalars['String']>;
  caregiver?: Maybe<Caregiver>;
  caregiverId?: Maybe<Scalars['UUID']>;
  disabilities?: Maybe<Scalars['String']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  inactiveDate?: Maybe<Scalars['DateTime']>;
  inactiveReason?: Maybe<Scalars['String']>;
  inactivityComments?: Maybe<Scalars['String']>;
  insertedBy?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  otherHealthConditions?: Maybe<Scalars['String']>;
  playgroupGroup?: Maybe<Scalars['String']>;
  reasonForLeaving?: Maybe<ReasonForLeaving>;
  reasonForLeavingId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  workflowStatus?: Maybe<WorkflowStatus>;
  workflowStatusId?: Maybe<Scalars['UUID']>;
};

export type ChildFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type ChildAttendanceMonthlyReportModel = {
  __typename?: 'ChildAttendanceMonthlyReportModel';
  actualAttendance: Scalars['Int'];
  attendancePercentage: Scalars['Int'];
  expectedAttendance: Scalars['Int'];
  month?: Maybe<Scalars['String']>;
  monthNumber: Scalars['Int'];
  year: Scalars['Int'];
};

export type ChildAttendanceReportModel = {
  __typename?: 'ChildAttendanceReportModel';
  attendancePercentage: Scalars['Int'];
  classGroupAttendance?: Maybe<
    Array<Maybe<ChildGroupingAttendanceReportModel>>
  >;
  totalActualAttendance: Scalars['Int'];
  totalExpectedAttendance: Scalars['Int'];
};

export type ChildCreatedByDetail = {
  __typename?: 'ChildCreatedByDetail';
  childUserId?: Maybe<Scalars['String']>;
  classroomName?: Maybe<Scalars['String']>;
  createdByDate: Scalars['DateTime'];
  createdById?: Maybe<Scalars['String']>;
  createdByName?: Maybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  fullName?: Maybe<Scalars['String']>;
  practitionerName?: Maybe<Scalars['String']>;
  practitionerUserId?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  programmeName?: Maybe<Scalars['String']>;
};

export type ChildFilterInput = {
  allergies?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ChildFilterInput>>;
  caregiver?: InputMaybe<CaregiverFilterInput>;
  caregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  disabilities?: InputMaybe<StringOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  inactiveDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  inactiveReason?: InputMaybe<StringOperationFilterInput>;
  inactivityComments?: InputMaybe<StringOperationFilterInput>;
  insertedBy?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<ChildFilterInput>>;
  otherHealthConditions?: InputMaybe<StringOperationFilterInput>;
  playgroupGroup?: InputMaybe<StringOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForLeavingFilterInput>;
  reasonForLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  workflowStatus?: InputMaybe<WorkflowStatusFilterInput>;
  workflowStatusId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ChildGroupingAttendanceReportModel = {
  __typename?: 'ChildGroupingAttendanceReportModel';
  actualAttendance: Scalars['Int'];
  attendancePercentage: Scalars['Int'];
  classroomGroupId: Scalars['UUID'];
  classroomGroupName?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  expectedAttendance: Scalars['Int'];
  monthlyAttendance?: Maybe<Array<Maybe<ChildAttendanceMonthlyReportModel>>>;
  startDate: Scalars['DateTime'];
};

export type ChildInput = {
  Allergies?: InputMaybe<Scalars['String']>;
  Caregiver?: InputMaybe<CaregiverInput>;
  CaregiverId?: InputMaybe<Scalars['UUID']>;
  Disabilities?: InputMaybe<Scalars['String']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  InactiveDate?: InputMaybe<Scalars['DateTime']>;
  InactiveReason?: InputMaybe<Scalars['String']>;
  InactivityComments?: InputMaybe<Scalars['String']>;
  InsertedBy?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  OtherHealthConditions?: InputMaybe<Scalars['String']>;
  PlaygroupGroup?: InputMaybe<Scalars['String']>;
  ReasonForLeaving?: InputMaybe<ReasonForLeavingInput>;
  ReasonForLeavingId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  WorkflowStatus?: InputMaybe<WorkflowStatusInput>;
  WorkflowStatusId?: InputMaybe<Scalars['UUID']>;
};

export type ChildProgressDisplay = {
  __typename?: 'ChildProgressDisplay';
  color?: Maybe<Scalars['String']>;
  groupingName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  numberOfChildrenNotProgressedForPeriod: Scalars['Int'];
  numberOfPeriods: Scalars['Int'];
  percentageOfChildrenNotProgressedForPeriod: Scalars['Int'];
  subject?: Maybe<Scalars['String']>;
  totalChildren: Scalars['Int'];
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type ChildProgressReport = {
  __typename?: 'ChildProgressReport';
  child?: Maybe<Child>;
  childId: Scalars['UUID'];
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId?: Maybe<Scalars['UUID']>;
  dateCompleted?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  integrationSubmitDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  reportContent?: Maybe<Scalars['String']>;
  reportDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type ChildProgressReportDetailedModel = {
  __typename?: 'ChildProgressReportDetailedModel';
  achievedLevelId: Scalars['Int'];
  categories?: Maybe<Array<Maybe<ObservationCategory>>>;
  childEnjoys?: Maybe<Scalars['String']>;
  childFirstname?: Maybe<Scalars['String']>;
  childId?: Maybe<Scalars['String']>;
  childProgressedWith?: Maybe<Scalars['String']>;
  childSurname?: Maybe<Scalars['String']>;
  classroomName?: Maybe<Scalars['String']>;
  dateCompleted?: Maybe<Scalars['String']>;
  dateCreated?: Maybe<Scalars['String']>;
  howCanCaregiverHelpChild?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  observationNote?: Maybe<Scalars['String']>;
  practitionerFirstname?: Maybe<Scalars['String']>;
  practitionerPhotoUrl?: Maybe<Scalars['String']>;
  practitionerSurname?: Maybe<Scalars['String']>;
  reportingDate?: Maybe<Scalars['String']>;
  reportingPeriod?: Maybe<Scalars['String']>;
};

export type ChildProgressReportFilterInput = {
  and?: InputMaybe<Array<ChildProgressReportFilterInput>>;
  child?: InputMaybe<ChildFilterInput>;
  childId?: InputMaybe<ComparableGuidOperationFilterInput>;
  classroomGroup?: InputMaybe<ClassroomGroupFilterInput>;
  classroomGroupId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  dateCompleted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  integrationSubmitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ChildProgressReportFilterInput>>;
  reportContent?: InputMaybe<StringOperationFilterInput>;
  reportDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ChildProgressReportInput = {
  Child?: InputMaybe<ChildInput>;
  ChildId: Scalars['UUID'];
  ClassroomGroup?: InputMaybe<ClassroomGroupInput>;
  ClassroomGroupId?: InputMaybe<Scalars['UUID']>;
  DateCompleted?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IntegrationSubmitDate?: InputMaybe<Scalars['DateTime']>;
  IsActive: Scalars['Boolean'];
  ReportContent?: InputMaybe<Scalars['String']>;
  ReportDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ChildProgressReportSortInput = {
  child?: InputMaybe<ChildSortInput>;
  childId?: InputMaybe<SortEnumType>;
  classroomGroup?: InputMaybe<ClassroomGroupSortInput>;
  classroomGroupId?: InputMaybe<SortEnumType>;
  dateCompleted?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  integrationSubmitDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  reportContent?: InputMaybe<SortEnumType>;
  reportDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type ChildProgressReportSummaryModel = {
  __typename?: 'ChildProgressReportSummaryModel';
  categories?: Maybe<Array<Maybe<ObservationCategorySummary>>>;
  childFirstname?: Maybe<Scalars['String']>;
  childId?: Maybe<Scalars['String']>;
  childSurname?: Maybe<Scalars['String']>;
  classroomName?: Maybe<Scalars['String']>;
  reportDate?: Maybe<Scalars['String']>;
  reportDateCompleted?: Maybe<Scalars['String']>;
  reportDateCreated?: Maybe<Scalars['String']>;
  reportId: Scalars['UUID'];
  reportPeriod?: Maybe<Scalars['String']>;
};

export type ChildProgressReportsStatus = {
  __typename?: 'ChildProgressReportsStatus';
  completedReports: Scalars['Int'];
  numberOfChildren: Scalars['Int'];
};

export type ChildSortInput = {
  allergies?: InputMaybe<SortEnumType>;
  caregiver?: InputMaybe<CaregiverSortInput>;
  caregiverId?: InputMaybe<SortEnumType>;
  disabilities?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  inactiveDate?: InputMaybe<SortEnumType>;
  inactiveReason?: InputMaybe<SortEnumType>;
  inactivityComments?: InputMaybe<SortEnumType>;
  insertedBy?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
  otherHealthConditions?: InputMaybe<SortEnumType>;
  playgroupGroup?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<ReasonForLeavingSortInput>;
  reasonForLeavingId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  workflowStatus?: InputMaybe<WorkflowStatusSortInput>;
  workflowStatusId?: InputMaybe<SortEnumType>;
};

export type ChildTokenAccessModel = {
  __typename?: 'ChildTokenAccessModel';
  accessToken?: Maybe<Scalars['String']>;
  child?: Maybe<TokenAccessChildDetailModel>;
  practitoner?: Maybe<TokenAccessPractitionerDetailModel>;
};

export type ChildrenMetricReport = {
  __typename?: 'ChildrenMetricReport';
  childAttendacePerMonthData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  statusData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  totalChildProgressReports: Scalars['Int'];
  totalChildren: Scalars['Int'];
  unverifiedDocuments: Scalars['Int'];
};

export type CircleClub = {
  __typename?: 'CircleClub';
  cCMeetingStatus?: Maybe<Scalars['String']>;
  cCMeetingStatusColor?: Maybe<Scalars['String']>;
  clubMeetings?: Maybe<Array<Maybe<ClubMeeting>>>;
  id?: Maybe<Scalars['String']>;
  leagueId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CircleTabClubs = {
  __typename?: 'CircleTabClubs';
  clubsWithLinkedMeetings?: Maybe<Array<Maybe<CircleClub>>>;
  clubsWithNoLinkedMeetings?: Maybe<Array<Maybe<CircleClub>>>;
};

export type ClassProgramme = {
  __typename?: 'ClassProgramme';
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isFullDay: Scalars['Boolean'];
  meetingDay: Scalars['Int'];
  programmeStartDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClassProgrammeAttendanceArgs = {
  where?: InputMaybe<AttendanceFilterInput>;
};

export type ClassProgrammeFilterInput = {
  and?: InputMaybe<Array<ClassProgrammeFilterInput>>;
  classroomGroup?: InputMaybe<ClassroomGroupFilterInput>;
  classroomGroupId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isFullDay?: InputMaybe<BooleanOperationFilterInput>;
  meetingDay?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClassProgrammeFilterInput>>;
  programmeStartDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClassProgrammeInput = {
  ClassroomGroup?: InputMaybe<ClassroomGroupInput>;
  ClassroomGroupId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFullDay: Scalars['Boolean'];
  MeetingDay: Scalars['Int'];
  ProgrammeStartDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClassProgrammeSortInput = {
  classroomGroup?: InputMaybe<ClassroomGroupSortInput>;
  classroomGroupId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isFullDay?: InputMaybe<SortEnumType>;
  meetingDay?: InputMaybe<SortEnumType>;
  programmeStartDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClassReassignmentDisplay = {
  __typename?: 'ClassReassignmentDisplay';
  color?: Maybe<Scalars['String']>;
  groupingName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  reassignedClassroomGroup?: Maybe<ClassroomGroup>;
  reassignedFromUser?: Maybe<ApplicationUser>;
  reassignedToUser?: Maybe<ApplicationUser>;
  subject?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type ClassReassignmentHistory = {
  __typename?: 'ClassReassignmentHistory';
  assignedRole?: Maybe<Scalars['String']>;
  assignedRoleDate?: Maybe<Scalars['DateTime']>;
  assignedToDate: Scalars['DateTime'];
  hierarchyBackToUser?: Maybe<Scalars['String']>;
  hierarchyToUser?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  loggedBy?: Maybe<Scalars['UUID']>;
  reason?: Maybe<Scalars['String']>;
  reassignedBackToDate?: Maybe<Scalars['DateTime']>;
  reassignedBackToUserId?: Maybe<Scalars['UUID']>;
  reassignedChildrenUserIds?: Maybe<Scalars['String']>;
  reassignedClassProgrammes?: Maybe<Scalars['String']>;
  reassignedClassroomGroups?: Maybe<Scalars['String']>;
  reassignedClassrooms?: Maybe<Scalars['String']>;
  reassignedLearners?: Maybe<Scalars['String']>;
  reassignedRoleBack?: Maybe<Scalars['String']>;
  reassignedRoleBackDate?: Maybe<Scalars['DateTime']>;
  reassignedToDate: Scalars['DateTime'];
  reassignedToUser?: Maybe<Scalars['UUID']>;
  roleAssignedToUser?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type ClassReassignmentHistoryFilterInput = {
  and?: InputMaybe<Array<ClassReassignmentHistoryFilterInput>>;
  assignedRole?: InputMaybe<StringOperationFilterInput>;
  assignedRoleDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  assignedToDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  hierarchyBackToUser?: InputMaybe<StringOperationFilterInput>;
  hierarchyToUser?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  loggedBy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<ClassReassignmentHistoryFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  reassignedBackToDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  reassignedBackToUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  reassignedChildrenUserIds?: InputMaybe<StringOperationFilterInput>;
  reassignedClassProgrammes?: InputMaybe<StringOperationFilterInput>;
  reassignedClassroomGroups?: InputMaybe<StringOperationFilterInput>;
  reassignedClassrooms?: InputMaybe<StringOperationFilterInput>;
  reassignedLearners?: InputMaybe<StringOperationFilterInput>;
  reassignedRoleBack?: InputMaybe<StringOperationFilterInput>;
  reassignedRoleBackDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  reassignedToDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  reassignedToUser?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  roleAssignedToUser?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ClassReassignmentHistoryInput = {
  AssignedRole?: InputMaybe<Scalars['String']>;
  AssignedRoleDate?: InputMaybe<Scalars['DateTime']>;
  AssignedToDate: Scalars['DateTime'];
  HierarchyBackToUser?: InputMaybe<Scalars['String']>;
  HierarchyToUser?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LoggedBy?: InputMaybe<Scalars['UUID']>;
  Reason?: InputMaybe<Scalars['String']>;
  ReassignedBackToDate?: InputMaybe<Scalars['DateTime']>;
  ReassignedBackToUserId?: InputMaybe<Scalars['UUID']>;
  ReassignedChildrenUserIds?: InputMaybe<Scalars['String']>;
  ReassignedClassProgrammes?: InputMaybe<Scalars['String']>;
  ReassignedClassroomGroups?: InputMaybe<Scalars['String']>;
  ReassignedClassrooms?: InputMaybe<Scalars['String']>;
  ReassignedLearners?: InputMaybe<Scalars['String']>;
  ReassignedRoleBack?: InputMaybe<Scalars['String']>;
  ReassignedRoleBackDate?: InputMaybe<Scalars['DateTime']>;
  ReassignedToDate: Scalars['DateTime'];
  ReassignedToUser?: InputMaybe<Scalars['UUID']>;
  RoleAssignedToUser?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ClassReassignmentHistorySortInput = {
  assignedRole?: InputMaybe<SortEnumType>;
  assignedRoleDate?: InputMaybe<SortEnumType>;
  assignedToDate?: InputMaybe<SortEnumType>;
  hierarchyBackToUser?: InputMaybe<SortEnumType>;
  hierarchyToUser?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  loggedBy?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  reassignedBackToDate?: InputMaybe<SortEnumType>;
  reassignedBackToUserId?: InputMaybe<SortEnumType>;
  reassignedChildrenUserIds?: InputMaybe<SortEnumType>;
  reassignedClassProgrammes?: InputMaybe<SortEnumType>;
  reassignedClassroomGroups?: InputMaybe<SortEnumType>;
  reassignedClassrooms?: InputMaybe<SortEnumType>;
  reassignedLearners?: InputMaybe<SortEnumType>;
  reassignedRoleBack?: InputMaybe<SortEnumType>;
  reassignedRoleBackDate?: InputMaybe<SortEnumType>;
  reassignedToDate?: InputMaybe<SortEnumType>;
  reassignedToUser?: InputMaybe<SortEnumType>;
  roleAssignedToUser?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Classroom = {
  __typename?: 'Classroom';
  classroomGroups?: Maybe<Array<Maybe<ClassroomGroup>>>;
  classroomImageUrl?: Maybe<Scalars['String']>;
  doesOwnerTeach?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isPrinciple?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  numberOfAssistants?: Maybe<Scalars['Int']>;
  numberOfOtherAssistants?: Maybe<Scalars['Int']>;
  numberPractitioners?: Maybe<Scalars['Int']>;
  preschoolFeeAmount?: Maybe<Scalars['Float']>;
  preschoolFeeAmountLastUpdateDate?: Maybe<Scalars['DateTime']>;
  programmes?: Maybe<Array<Maybe<Programme>>>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type ClassroomFilterInput = {
  and?: InputMaybe<Array<ClassroomFilterInput>>;
  classroomGroups?: InputMaybe<ListFilterInputTypeOfClassroomGroupFilterInput>;
  classroomImageUrl?: InputMaybe<StringOperationFilterInput>;
  doesOwnerTeach?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isPrinciple?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  numberOfAssistants?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  numberOfOtherAssistants?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  numberPractitioners?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClassroomFilterInput>>;
  preschoolFeeAmount?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  preschoolFeeAmountLastUpdateDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  programmes?: InputMaybe<ListFilterInputTypeOfProgrammeFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ClassroomGroup = {
  __typename?: 'ClassroomGroup';
  classProgrammes?: Maybe<Array<Maybe<ClassProgramme>>>;
  classroom?: Maybe<Classroom>;
  classroomId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  learners?: Maybe<Array<Maybe<Learner>>>;
  name?: Maybe<Scalars['String']>;
  programmeType?: Maybe<ProgrammeType>;
  programmeTypeId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type ClassroomGroupChildAttendanceReportModel = {
  __typename?: 'ClassroomGroupChildAttendanceReportModel';
  attendance?: Maybe<Array<KeyValuePairOfInt32AndNullableOfInt32>>;
  attendancePercentage: Scalars['Int'];
  childFullName?: Maybe<Scalars['String']>;
  childIdNumber?: Maybe<Scalars['String']>;
  childUserId?: Maybe<Scalars['String']>;
  classgroupId: Scalars['UUID'];
  month: Scalars['Int'];
  totalActualAttendance: Scalars['Int'];
  totalExpectedAttendance: Scalars['Int'];
  year: Scalars['Int'];
};

export type ClassroomGroupChildAttendanceReportOverviewModel = {
  __typename?: 'ClassroomGroupChildAttendanceReportOverviewModel';
  classroomAttendanceReport?: Maybe<
    Array<Maybe<ClassroomGroupChildAttendanceReportModel>>
  >;
  totalAttendance?: Maybe<Array<KeyValuePairOfInt32AndInt32>>;
  totalAttendanceStatsReport?: Maybe<TotalAttendanceStatsReport>;
};

export type ClassroomGroupFilterInput = {
  and?: InputMaybe<Array<ClassroomGroupFilterInput>>;
  classProgrammes?: InputMaybe<ListFilterInputTypeOfClassProgrammeFilterInput>;
  classroom?: InputMaybe<ClassroomFilterInput>;
  classroomId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  learners?: InputMaybe<ListFilterInputTypeOfLearnerFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClassroomGroupFilterInput>>;
  programmeType?: InputMaybe<ProgrammeTypeFilterInput>;
  programmeTypeId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ClassroomGroupInput = {
  ClassProgrammes?: InputMaybe<Array<InputMaybe<ClassProgrammeInput>>>;
  Classroom?: InputMaybe<ClassroomInput>;
  ClassroomId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Learners?: InputMaybe<Array<InputMaybe<LearnerInput>>>;
  Name?: InputMaybe<Scalars['String']>;
  ProgrammeType?: InputMaybe<ProgrammeTypeInput>;
  ProgrammeTypeId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ClassroomGroupReassignmentsInput = {
  classroomGroupId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type ClassroomGroupSortInput = {
  classroom?: InputMaybe<ClassroomSortInput>;
  classroomId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<ProgrammeTypeSortInput>;
  programmeTypeId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type ClassroomInput = {
  ClassroomGroups?: InputMaybe<Array<InputMaybe<ClassroomGroupInput>>>;
  ClassroomImageUrl?: InputMaybe<Scalars['String']>;
  DoesOwnerTeach?: InputMaybe<Scalars['Boolean']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsPrinciple?: InputMaybe<Scalars['Boolean']>;
  Name?: InputMaybe<Scalars['String']>;
  NumberOfAssistants?: InputMaybe<Scalars['Int']>;
  NumberOfOtherAssistants?: InputMaybe<Scalars['Int']>;
  NumberPractitioners?: InputMaybe<Scalars['Int']>;
  PreschoolFeeAmount?: InputMaybe<Scalars['Float']>;
  PreschoolFeeAmountLastUpdateDate?: InputMaybe<Scalars['DateTime']>;
  Programmes?: InputMaybe<Array<InputMaybe<ProgrammeInput>>>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ClassroomMetricReport = {
  __typename?: 'ClassroomMetricReport';
  attendancePercentage: Scalars['Int'];
  childCount: Scalars['Int'];
  classroomGroupId?: Maybe<Scalars['String']>;
  classroomId?: Maybe<Scalars['String']>;
  month: Scalars['Int'];
  practitionerId?: Maybe<Scalars['String']>;
  weekOfYear: Scalars['Int'];
  year: Scalars['Int'];
};

export type ClassroomSortInput = {
  classroomImageUrl?: InputMaybe<SortEnumType>;
  doesOwnerTeach?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isPrinciple?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  numberOfAssistants?: InputMaybe<SortEnumType>;
  numberOfOtherAssistants?: InputMaybe<SortEnumType>;
  numberPractitioners?: InputMaybe<SortEnumType>;
  preschoolFeeAmount?: InputMaybe<SortEnumType>;
  preschoolFeeAmountLastUpdateDate?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type ClientSummary = {
  __typename?: 'ClientSummary';
  documentData?: Maybe<Array<Maybe<VisitDataStatus>>>;
  order: Scalars['Int'];
  summaryData?: Maybe<Array<Maybe<VisitDataStatus>>>;
  visitName?: Maybe<Scalars['String']>;
};

export type ClientSummaryByPriority = {
  __typename?: 'ClientSummaryByPriority';
  areaName?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  documentData?: Maybe<Array<Maybe<VisitDataStatus>>>;
  order: Scalars['Int'];
  summaryData?: Maybe<Array<Maybe<VisitDataStatus>>>;
};

export type Clinic = {
  __typename?: 'Clinic';
  emergencyContactNumber?: Maybe<Scalars['String']>;
  emergencyContactPerson?: Maybe<Scalars['String']>;
  healthCareWorkers?: Maybe<Array<Maybe<HealthCareWorker>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  leagues?: Maybe<Array<Maybe<ClinicLeague>>>;
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  subDistrict?: Maybe<SubDistrict>;
  subDistrictId?: Maybe<Scalars['UUID']>;
  teamLeads?: Maybe<Array<Maybe<ClinicTeamLead>>>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClinicFilterInput = {
  and?: InputMaybe<Array<ClinicFilterInput>>;
  emergencyContactNumber?: InputMaybe<StringOperationFilterInput>;
  emergencyContactPerson?: InputMaybe<StringOperationFilterInput>;
  healthCareWorkers?: InputMaybe<ListFilterInputTypeOfHealthCareWorkerFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  leagues?: InputMaybe<ListFilterInputTypeOfClinicLeagueFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClinicFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  subDistrict?: InputMaybe<SubDistrictFilterInput>;
  subDistrictId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  teamLeads?: InputMaybe<ListFilterInputTypeOfClinicTeamLeadFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClinicInput = {
  EmergencyContactNumber?: InputMaybe<Scalars['String']>;
  EmergencyContactPerson?: InputMaybe<Scalars['String']>;
  HealthCareWorkers?: InputMaybe<Array<InputMaybe<HealthCareWorkerInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Leagues?: InputMaybe<Array<InputMaybe<ClinicLeagueInput>>>;
  Name?: InputMaybe<Scalars['String']>;
  PhoneNumber?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  SubDistrict?: InputMaybe<SubDistrictInput>;
  SubDistrictId?: InputMaybe<Scalars['UUID']>;
  TeamLeads?: InputMaybe<Array<InputMaybe<ClinicTeamLeadInput>>>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClinicLeague = {
  __typename?: 'ClinicLeague';
  clinic?: Maybe<Clinic>;
  clinicId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  league?: Maybe<League>;
  leagueId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClinicLeagueFilterInput = {
  and?: InputMaybe<Array<ClinicLeagueFilterInput>>;
  clinic?: InputMaybe<ClinicFilterInput>;
  clinicId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  league?: InputMaybe<LeagueFilterInput>;
  leagueId?: InputMaybe<ComparableGuidOperationFilterInput>;
  or?: InputMaybe<Array<ClinicLeagueFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClinicLeagueInput = {
  Clinic?: InputMaybe<ClinicInput>;
  ClinicId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  League?: InputMaybe<LeagueInput>;
  LeagueId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClinicLeagueSortInput = {
  clinic?: InputMaybe<ClinicSortInput>;
  clinicId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  league?: InputMaybe<LeagueSortInput>;
  leagueId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClinicMemberModel = {
  __typename?: 'ClinicMemberModel';
  firstName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  shareContactInfo: Scalars['Boolean'];
  surname?: Maybe<Scalars['String']>;
  welcomeMessage?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ClinicModel = {
  __typename?: 'ClinicModel';
  clinicMembers?: Maybe<Array<Maybe<ClinicMemberModel>>>;
  id: Scalars['UUID'];
  league?: Maybe<GrowGreatLeagueModel>;
  leagueRanking: Scalars['Int'];
  maxPointsTotal: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  points?: Maybe<Array<Maybe<PointsActivityModel>>>;
  pointsTotal: Scalars['Int'];
  siteAddress?: Maybe<SiteAddressModel>;
  teamLeads?: Maybe<Array<Maybe<TeamLeadModel>>>;
};

export type ClinicModelInput = {
  emergencyContactNumber?: InputMaybe<Scalars['String']>;
  emergencyContactPerson?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  siteAddress?: InputMaybe<SiteAddressInput>;
  siteAddressId?: InputMaybe<Scalars['UUID']>;
};

export type ClinicSortInput = {
  emergencyContactNumber?: InputMaybe<SortEnumType>;
  emergencyContactPerson?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  subDistrict?: InputMaybe<SubDistrictSortInput>;
  subDistrictId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClinicTeamLead = {
  __typename?: 'ClinicTeamLead';
  clinic?: Maybe<Clinic>;
  clinicId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  teamLead?: Maybe<TeamLead>;
  teamLeadId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClinicTeamLeadFilterInput = {
  and?: InputMaybe<Array<ClinicTeamLeadFilterInput>>;
  clinic?: InputMaybe<ClinicFilterInput>;
  clinicId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ClinicTeamLeadFilterInput>>;
  teamLead?: InputMaybe<TeamLeadFilterInput>;
  teamLeadId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClinicTeamLeadInput = {
  Clinic?: InputMaybe<ClinicInput>;
  ClinicId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  TeamLead?: InputMaybe<TeamLeadInput>;
  TeamLeadId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClinicTeamLeadSortInput = {
  clinic?: InputMaybe<ClinicSortInput>;
  clinicId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  teamLead?: InputMaybe<TeamLeadSortInput>;
  teamLeadId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Club = {
  __typename?: 'Club';
  clubLeaders?: Maybe<Array<Maybe<ClubLeader>>>;
  clubMembers?: Maybe<Array<Maybe<ClubMember>>>;
  clubPoints?: Maybe<Array<Maybe<ClubPoints>>>;
  clubSupport?: Maybe<Array<Maybe<ClubSupport>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  league?: Maybe<League>;
  leagueId?: Maybe<Scalars['UUID']>;
  name?: Maybe<Scalars['String']>;
  numberOfMembers: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type ClubActivity = {
  __typename?: 'ClubActivity';
  name?: Maybe<Scalars['String']>;
  points: Scalars['Float'];
};

export type ClubActivityUpload = {
  __typename?: 'ClubActivityUpload';
  club?: Maybe<Club>;
  clubActivityUploadType?: Maybe<ClubActivityUploadType>;
  clubActivityUploadTypeId: Scalars['UUID'];
  clubId: Scalars['UUID'];
  description?: Maybe<Scalars['String']>;
  document?: Maybe<Document>;
  documentId: Scalars['UUID'];
  id: Scalars['UUID'];
  imageApproved: Scalars['Boolean'];
  imageRating: Scalars['Float'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  year: Scalars['Int'];
};

export type ClubActivityUploadFilterInput = {
  and?: InputMaybe<Array<ClubActivityUploadFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubActivityUploadType?: InputMaybe<ClubActivityUploadTypeFilterInput>;
  clubActivityUploadTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  document?: InputMaybe<DocumentFilterInput>;
  documentId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  imageApproved?: InputMaybe<BooleanOperationFilterInput>;
  imageRating?: InputMaybe<ComparableDoubleOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClubActivityUploadFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type ClubActivityUploadInput = {
  Club?: InputMaybe<ClubInput>;
  ClubActivityUploadType?: InputMaybe<ClubActivityUploadTypeInput>;
  ClubActivityUploadTypeId: Scalars['UUID'];
  ClubId: Scalars['UUID'];
  Description?: InputMaybe<Scalars['String']>;
  Document?: InputMaybe<DocumentInput>;
  DocumentId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  ImageApproved: Scalars['Boolean'];
  ImageRating: Scalars['Float'];
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Year: Scalars['Int'];
};

export type ClubActivityUploadSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubActivityUploadType?: InputMaybe<ClubActivityUploadTypeSortInput>;
  clubActivityUploadTypeId?: InputMaybe<SortEnumType>;
  clubId?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  document?: InputMaybe<DocumentSortInput>;
  documentId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageApproved?: InputMaybe<SortEnumType>;
  imageRating?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type ClubActivityUploadType = {
  __typename?: 'ClubActivityUploadType';
  description?: Maybe<Scalars['String']>;
  enumId: FileTypeEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubActivityUploadTypeFilterInput = {
  and?: InputMaybe<Array<ClubActivityUploadTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<FileTypeEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClubActivityUploadTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubActivityUploadTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: FileTypeEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubActivityUploadTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubCoachModel = {
  __typename?: 'ClubCoachModel';
  aboutInfo?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ClubFilterInput = {
  and?: InputMaybe<Array<ClubFilterInput>>;
  clubLeaders?: InputMaybe<ListFilterInputTypeOfClubLeaderFilterInput>;
  clubMembers?: InputMaybe<ListFilterInputTypeOfClubMemberFilterInput>;
  clubPoints?: InputMaybe<ListFilterInputTypeOfClubPointsFilterInput>;
  clubSupport?: InputMaybe<ListFilterInputTypeOfClubSupportFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  league?: InputMaybe<LeagueFilterInput>;
  leagueId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  numberOfMembers?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClubFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ClubInput = {
  ClubLeaders?: InputMaybe<Array<InputMaybe<ClubLeaderInput>>>;
  ClubMembers?: InputMaybe<Array<InputMaybe<ClubMemberInput>>>;
  ClubPoints?: InputMaybe<Array<InputMaybe<ClubPointsInput>>>;
  ClubSupport?: InputMaybe<Array<InputMaybe<ClubSupportInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  League?: InputMaybe<LeagueInput>;
  LeagueId?: InputMaybe<Scalars['UUID']>;
  Name?: InputMaybe<Scalars['String']>;
  NumberOfMembers: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ClubLeader = {
  __typename?: 'ClubLeader';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateAssigned?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  practitioner?: Maybe<Practitioner>;
  practitionerId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubLeaderFilterInput = {
  and?: InputMaybe<Array<ClubLeaderFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateAccepted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateAssigned?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ClubLeaderFilterInput>>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubLeaderInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateAssigned?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubLeaderModel = {
  __typename?: 'ClubLeaderModel';
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateAssigned?: Maybe<Scalars['DateTime']>;
  firstName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  practitionerId: Scalars['UUID'];
  profileImageUrl?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ClubLeaderSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubId?: InputMaybe<SortEnumType>;
  dateAccepted?: InputMaybe<SortEnumType>;
  dateAssigned?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubMeeting = {
  __typename?: 'ClubMeeting';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  clubLeaderContacted: Scalars['Boolean'];
  clubMeetingRegister?: Maybe<Array<Maybe<ClubMeetingRegister>>>;
  coachAttended: Scalars['Boolean'];
  contentValueId?: Maybe<Scalars['Int']>;
  eventId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  meetingDate?: Maybe<Scalars['DateTime']>;
  meetingNotes?: Maybe<Scalars['String']>;
  meetingType?: Maybe<MeetingType>;
  meetingTypeId?: Maybe<Scalars['UUID']>;
  name?: Maybe<Scalars['String']>;
  otherDescription?: Maybe<Scalars['String']>;
  totalCaregiversAttended: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubMeetingFilterInput = {
  and?: InputMaybe<Array<ClubMeetingFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  clubLeaderContacted?: InputMaybe<BooleanOperationFilterInput>;
  clubMeetingRegister?: InputMaybe<ListFilterInputTypeOfClubMeetingRegisterFilterInput>;
  coachAttended?: InputMaybe<BooleanOperationFilterInput>;
  contentValueId?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  eventId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  meetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  meetingNotes?: InputMaybe<StringOperationFilterInput>;
  meetingType?: InputMaybe<MeetingTypeFilterInput>;
  meetingTypeId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClubMeetingFilterInput>>;
  otherDescription?: InputMaybe<StringOperationFilterInput>;
  totalCaregiversAttended?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubMeetingInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  ClubLeaderContacted: Scalars['Boolean'];
  ClubMeetingRegister?: InputMaybe<Array<InputMaybe<ClubMeetingRegisterInput>>>;
  CoachAttended: Scalars['Boolean'];
  ContentValueId?: InputMaybe<Scalars['Int']>;
  EventId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MeetingDate?: InputMaybe<Scalars['DateTime']>;
  MeetingNotes?: InputMaybe<Scalars['String']>;
  MeetingType?: InputMaybe<MeetingTypeInput>;
  MeetingTypeId?: InputMaybe<Scalars['UUID']>;
  Name?: InputMaybe<Scalars['String']>;
  OtherDescription?: InputMaybe<Scalars['String']>;
  TotalCaregiversAttended: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubMeetingModelInput = {
  clubId: Scalars['UUID'];
  clubMeetingParticipants?: InputMaybe<
    Array<InputMaybe<ClubMeetingRegisterModelInput>>
  >;
  coachAttend?: InputMaybe<Scalars['Boolean']>;
  contentValueId?: InputMaybe<Scalars['Int']>;
  eventId?: InputMaybe<Scalars['UUID']>;
  fileType?: InputMaybe<Scalars['String']>;
  imageBase64?: InputMaybe<Scalars['String']>;
  meetingDate: Scalars['DateTime'];
  meetingNotes?: InputMaybe<Scalars['String']>;
  meetingType?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  otherDescription?: InputMaybe<Scalars['String']>;
  totalCaregiversAttended?: InputMaybe<Scalars['Int']>;
};

export type ClubMeetingRegister = {
  __typename?: 'ClubMeetingRegister';
  attended: Scalars['Boolean'];
  clubMeeting?: Maybe<ClubMeeting>;
  clubMeetingId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  practitioner?: Maybe<Practitioner>;
  practitionerId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubMeetingRegisterFilterInput = {
  and?: InputMaybe<Array<ClubMeetingRegisterFilterInput>>;
  attended?: InputMaybe<BooleanOperationFilterInput>;
  clubMeeting?: InputMaybe<ClubMeetingFilterInput>;
  clubMeetingId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ClubMeetingRegisterFilterInput>>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubMeetingRegisterInput = {
  Attended: Scalars['Boolean'];
  ClubMeeting?: InputMaybe<ClubMeetingInput>;
  ClubMeetingId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubMeetingRegisterModelInput = {
  attended: Scalars['Boolean'];
  practitionerId?: InputMaybe<Scalars['UUID']>;
};

export type ClubMeetingRegisterSortInput = {
  attended?: InputMaybe<SortEnumType>;
  clubMeeting?: InputMaybe<ClubMeetingSortInput>;
  clubMeetingId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubMeetingSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubId?: InputMaybe<SortEnumType>;
  clubLeaderContacted?: InputMaybe<SortEnumType>;
  coachAttended?: InputMaybe<SortEnumType>;
  contentValueId?: InputMaybe<SortEnumType>;
  eventId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  meetingDate?: InputMaybe<SortEnumType>;
  meetingNotes?: InputMaybe<SortEnumType>;
  meetingType?: InputMaybe<MeetingTypeSortInput>;
  meetingTypeId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  otherDescription?: InputMaybe<SortEnumType>;
  totalCaregiversAttended?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubMember = {
  __typename?: 'ClubMember';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  dateClubJoined?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isNewInClub?: Maybe<Scalars['Boolean']>;
  practitioner?: Maybe<Practitioner>;
  practitionerId: Scalars['UUID'];
  shareContactInfo: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  welcomeMessage?: Maybe<Scalars['String']>;
};

export type ClubMemberFilterInput = {
  and?: InputMaybe<Array<ClubMemberFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateClubJoined?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isNewInClub?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ClubMemberFilterInput>>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableGuidOperationFilterInput>;
  shareContactInfo?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  welcomeMessage?: InputMaybe<StringOperationFilterInput>;
};

export type ClubMemberInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  DateClubJoined?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsNewInClub?: InputMaybe<Scalars['Boolean']>;
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId: Scalars['UUID'];
  ShareContactInfo: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  WelcomeMessage?: InputMaybe<Scalars['String']>;
};

export type ClubMemberModel = {
  __typename?: 'ClubMemberModel';
  firstName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  practitionerId: Scalars['UUID'];
  profileImageUrl?: Maybe<Scalars['String']>;
  shareContactInfo: Scalars['Boolean'];
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  welcomeMessage?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ClubMemberSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubId?: InputMaybe<SortEnumType>;
  dateClubJoined?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isNewInClub?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  shareContactInfo?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  welcomeMessage?: InputMaybe<SortEnumType>;
};

export type ClubPoints = {
  __typename?: 'ClubPoints';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  clubPointsLibrary?: Maybe<ClubPointsLibrary>;
  clubPointsLibraryId: Scalars['UUID'];
  comment?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  points: Scalars['Int'];
  pointsYTD: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  year: Scalars['Int'];
};

export type ClubPointsFilterInput = {
  and?: InputMaybe<Array<ClubPointsFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  clubPointsLibrary?: InputMaybe<ClubPointsLibraryFilterInput>;
  clubPointsLibraryId?: InputMaybe<ComparableGuidOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClubPointsFilterInput>>;
  points?: InputMaybe<ComparableInt32OperationFilterInput>;
  pointsYTD?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type ClubPointsInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  ClubPointsLibrary?: InputMaybe<ClubPointsLibraryInput>;
  ClubPointsLibraryId: Scalars['UUID'];
  Comment?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  Points: Scalars['Int'];
  PointsYTD: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type ClubPointsLibrary = {
  __typename?: 'ClubPointsLibrary';
  activity?: Maybe<Scalars['String']>;
  calculatedAtMonthEnd: Scalars['Boolean'];
  calculatedAtYearEnd: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  maxPointsYearly: Scalars['Int'];
  points: Scalars['Int'];
  subActivity?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubPointsLibraryFilterInput = {
  activity?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ClubPointsLibraryFilterInput>>;
  calculatedAtMonthEnd?: InputMaybe<BooleanOperationFilterInput>;
  calculatedAtYearEnd?: InputMaybe<BooleanOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  maxPointsYearly?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClubPointsLibraryFilterInput>>;
  points?: InputMaybe<ComparableInt32OperationFilterInput>;
  subActivity?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubPointsLibraryInput = {
  Activity?: InputMaybe<Scalars['String']>;
  CalculatedAtMonthEnd: Scalars['Boolean'];
  CalculatedAtYearEnd: Scalars['Boolean'];
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MaxPointsYearly: Scalars['Int'];
  Points: Scalars['Int'];
  SubActivity?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubPointsLibrarySortInput = {
  activity?: InputMaybe<SortEnumType>;
  calculatedAtMonthEnd?: InputMaybe<SortEnumType>;
  calculatedAtYearEnd?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  maxPointsYearly?: InputMaybe<SortEnumType>;
  points?: InputMaybe<SortEnumType>;
  subActivity?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubPointsSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubId?: InputMaybe<SortEnumType>;
  clubPointsLibrary?: InputMaybe<ClubPointsLibrarySortInput>;
  clubPointsLibraryId?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  points?: InputMaybe<SortEnumType>;
  pointsYTD?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type ClubPointsSummaryModel = {
  __typename?: 'ClubPointsSummaryModel';
  clubId: Scalars['UUID'];
  clubName?: Maybe<Scalars['String']>;
  coachName?: Maybe<Scalars['String']>;
  leagueRank: Scalars['Int'];
  pointsTotal: Scalars['Int'];
};

export type ClubSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  league?: InputMaybe<LeagueSortInput>;
  leagueId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  numberOfMembers?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type ClubSupport = {
  __typename?: 'ClubSupport';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  dateAssigned?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isNewInSupportRole: Scalars['Boolean'];
  practitioner?: Maybe<Practitioner>;
  practitionerId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubSupportFilterInput = {
  and?: InputMaybe<Array<ClubSupportFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateAssigned?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isNewInSupportRole?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ClubSupportFilterInput>>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubSupportInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  DateAssigned?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsNewInSupportRole: Scalars['Boolean'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubSupportModel = {
  __typename?: 'ClubSupportModel';
  dateAssigned?: Maybe<Scalars['DateTime']>;
  firstName?: Maybe<Scalars['String']>;
  isNewInSupportRole: Scalars['Boolean'];
  phoneNumber?: Maybe<Scalars['String']>;
  practitionerId: Scalars['UUID'];
  profileImageUrl?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ClubSupportSortInput = {
  club?: InputMaybe<ClubSortInput>;
  clubId?: InputMaybe<SortEnumType>;
  dateAssigned?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isNewInSupportRole?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubUser = {
  __typename?: 'ClubUser';
  firstName?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type Coach = {
  __typename?: 'Coach';
  aboutInfo?: Maybe<Scalars['String']>;
  areaOfOperation?: Maybe<Scalars['String']>;
  clickedClubTab?: Maybe<Scalars['Boolean']>;
  franchisor?: Maybe<Franchisor>;
  franchisorId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  practitionerVisits?: Maybe<Array<Maybe<Visit>>>;
  secondaryAreaOfOperation?: Maybe<Scalars['String']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate: Scalars['DateTime'];
  traineeVisits?: Maybe<Array<Maybe<Visit>>>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CoachFilterInput = {
  aboutInfo?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<CoachFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
  clickedClubTab?: InputMaybe<BooleanOperationFilterInput>;
  franchisor?: InputMaybe<FranchisorFilterInput>;
  franchisorId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CoachFilterInput>>;
  practitionerVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  secondaryAreaOfOperation?: InputMaybe<StringOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  traineeVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type CoachInput = {
  AboutInfo?: InputMaybe<Scalars['String']>;
  AreaOfOperation?: InputMaybe<Scalars['String']>;
  ClickedClubTab?: InputMaybe<Scalars['Boolean']>;
  Franchisor?: InputMaybe<FranchisorInput>;
  FranchisorId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  PractitionerVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  SecondaryAreaOfOperation?: InputMaybe<Scalars['String']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate: Scalars['DateTime'];
  TraineeVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type CoachPractitioner = {
  __typename?: 'CoachPractitioner';
  id: Scalars['UUID'];
  programmeType?: Maybe<Scalars['String']>;
  timeline?: Maybe<PractitionerTimeline>;
  userId: Scalars['UUID'];
};

export type CoachSortInput = {
  aboutInfo?: InputMaybe<SortEnumType>;
  areaOfOperation?: InputMaybe<SortEnumType>;
  clickedClubTab?: InputMaybe<SortEnumType>;
  franchisor?: InputMaybe<FranchisorSortInput>;
  franchisorId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  secondaryAreaOfOperation?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type CoachingCircleTopics = {
  __typename?: 'CoachingCircleTopics';
  endDate?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  resource?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  topicContent?: Maybe<Scalars['String']>;
};

export type CoachingCircleTopicsInput = {
  endDate?: InputMaybe<Scalars['String']>;
  resource?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  topicContent?: InputMaybe<Scalars['String']>;
};

export type CoachingClubBase = {
  __typename?: 'CoachingClubBase';
  id: Scalars['UUID'];
  meetingAttendance: Scalars['Float'];
  meetingAttendanceColor?: Maybe<Scalars['String']>;
  meetingAttendanceText?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  secondaryText?: Maybe<Scalars['String']>;
  secondaryTextColor?: Maybe<Scalars['String']>;
  secondaryTextPriority: Scalars['Int'];
  userId?: Maybe<Scalars['String']>;
};

export type ComparableDateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<Scalars['DateTime']>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  neq?: InputMaybe<Scalars['DateTime']>;
  ngt?: InputMaybe<Scalars['DateTime']>;
  ngte?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<Scalars['DateTime']>>;
  nlt?: InputMaybe<Scalars['DateTime']>;
  nlte?: InputMaybe<Scalars['DateTime']>;
};

export type ComparableDecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']>;
  gt?: InputMaybe<Scalars['Decimal']>;
  gte?: InputMaybe<Scalars['Decimal']>;
  in?: InputMaybe<Array<Scalars['Decimal']>>;
  lt?: InputMaybe<Scalars['Decimal']>;
  lte?: InputMaybe<Scalars['Decimal']>;
  neq?: InputMaybe<Scalars['Decimal']>;
  ngt?: InputMaybe<Scalars['Decimal']>;
  ngte?: InputMaybe<Scalars['Decimal']>;
  nin?: InputMaybe<Array<Scalars['Decimal']>>;
  nlt?: InputMaybe<Scalars['Decimal']>;
  nlte?: InputMaybe<Scalars['Decimal']>;
};

export type ComparableDoubleOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  neq?: InputMaybe<Scalars['Float']>;
  ngt?: InputMaybe<Scalars['Float']>;
  ngte?: InputMaybe<Scalars['Float']>;
  nin?: InputMaybe<Array<Scalars['Float']>>;
  nlt?: InputMaybe<Scalars['Float']>;
  nlte?: InputMaybe<Scalars['Float']>;
};

export type ComparableGuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']>;
  gt?: InputMaybe<Scalars['UUID']>;
  gte?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<Scalars['UUID']>>;
  lt?: InputMaybe<Scalars['UUID']>;
  lte?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
  ngt?: InputMaybe<Scalars['UUID']>;
  ngte?: InputMaybe<Scalars['UUID']>;
  nin?: InputMaybe<Array<Scalars['UUID']>>;
  nlt?: InputMaybe<Scalars['UUID']>;
  nlte?: InputMaybe<Scalars['UUID']>;
};

export type ComparableInt32OperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<Scalars['Int']>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
  ngt?: InputMaybe<Scalars['Int']>;
  ngte?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<Scalars['Int']>>;
  nlt?: InputMaybe<Scalars['Int']>;
  nlte?: InputMaybe<Scalars['Int']>;
};

export type ComparableNullableOfDateTimeOffsetOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  neq?: InputMaybe<Scalars['DateTime']>;
  ngt?: InputMaybe<Scalars['DateTime']>;
  ngte?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  nlt?: InputMaybe<Scalars['DateTime']>;
  nlte?: InputMaybe<Scalars['DateTime']>;
};

export type ComparableNullableOfDateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  neq?: InputMaybe<Scalars['DateTime']>;
  ngt?: InputMaybe<Scalars['DateTime']>;
  ngte?: InputMaybe<Scalars['DateTime']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  nlt?: InputMaybe<Scalars['DateTime']>;
  nlte?: InputMaybe<Scalars['DateTime']>;
};

export type ComparableNullableOfDecimalOperationFilterInput = {
  eq?: InputMaybe<Scalars['Decimal']>;
  gt?: InputMaybe<Scalars['Decimal']>;
  gte?: InputMaybe<Scalars['Decimal']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Decimal']>>>;
  lt?: InputMaybe<Scalars['Decimal']>;
  lte?: InputMaybe<Scalars['Decimal']>;
  neq?: InputMaybe<Scalars['Decimal']>;
  ngt?: InputMaybe<Scalars['Decimal']>;
  ngte?: InputMaybe<Scalars['Decimal']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Decimal']>>>;
  nlt?: InputMaybe<Scalars['Decimal']>;
  nlte?: InputMaybe<Scalars['Decimal']>;
};

export type ComparableNullableOfDoubleOperationFilterInput = {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  neq?: InputMaybe<Scalars['Float']>;
  ngt?: InputMaybe<Scalars['Float']>;
  ngte?: InputMaybe<Scalars['Float']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  nlt?: InputMaybe<Scalars['Float']>;
  nlte?: InputMaybe<Scalars['Float']>;
};

export type ComparableNullableOfGuidOperationFilterInput = {
  eq?: InputMaybe<Scalars['UUID']>;
  gt?: InputMaybe<Scalars['UUID']>;
  gte?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  lt?: InputMaybe<Scalars['UUID']>;
  lte?: InputMaybe<Scalars['UUID']>;
  neq?: InputMaybe<Scalars['UUID']>;
  ngt?: InputMaybe<Scalars['UUID']>;
  ngte?: InputMaybe<Scalars['UUID']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  nlt?: InputMaybe<Scalars['UUID']>;
  nlte?: InputMaybe<Scalars['UUID']>;
};

export type ComparableNullableOfInt32OperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  neq?: InputMaybe<Scalars['Int']>;
  ngt?: InputMaybe<Scalars['Int']>;
  ngte?: InputMaybe<Scalars['Int']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  nlt?: InputMaybe<Scalars['Int']>;
  nlte?: InputMaybe<Scalars['Int']>;
};

export type Connect = {
  __typename?: 'Connect';
  hint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ConnectInput = {
  hint?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type ConnectItem = {
  __typename?: 'ConnectItem';
  buttonText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  linkedConnect?: Maybe<Array<Maybe<Connect>>>;
};

export type ConnectItemInput = {
  buttonText?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  linkedConnect?: InputMaybe<Scalars['String']>;
};

export type Consent = {
  __typename?: 'Consent';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ConsentInput = {
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type Content = {
  __typename?: 'Content';
  contentType?: Maybe<ContentType>;
  contentTypeId: Scalars['Int'];
  contentValues?: Maybe<Array<Maybe<ContentValue>>>;
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentDefinitionModel = {
  __typename?: 'ContentDefinitionModel';
  contentName?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<FieldDefinitionModel>>>;
  identifier?: Maybe<Scalars['String']>;
};

export type ContentStatus = {
  __typename?: 'ContentStatus';
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentType = {
  __typename?: 'ContentType';
  content?: Maybe<Array<Maybe<Content>>>;
  description?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ContentTypeField>>>;
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isVisiblePortal: Scalars['Boolean'];
  metaData?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  portalDisplayOrder: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentTypeField = {
  __typename?: 'ContentTypeField';
  contentType?: Maybe<ContentType>;
  contentTypeId: Scalars['Int'];
  dataLinkName?: Maybe<Scalars['String']>;
  displayMainTable: Scalars['Boolean'];
  displayName?: Maybe<Scalars['String']>;
  displayPage: Scalars['Boolean'];
  fieldName?: Maybe<Scalars['String']>;
  fieldOrder: Scalars['Int'];
  fieldType?: Maybe<FieldType>;
  fieldTypeId: Scalars['Int'];
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isRequired: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isVisiblePortal?: InputMaybe<SortEnumType>;
  metaData?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  portalDisplayOrder?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ContentTypeWithLanguages = {
  __typename?: 'ContentTypeWithLanguages';
  content?: Maybe<Array<Maybe<Content>>>;
  description?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<ContentTypeField>>>;
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isVisiblePortal: Scalars['Boolean'];
  languages?: Maybe<Array<Maybe<Language>>>;
  metaData?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  portalDisplayOrder: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentTypeWithLanguagesSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isVisiblePortal?: InputMaybe<SortEnumType>;
  metaData?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  portalDisplayOrder?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ContentValue = {
  __typename?: 'ContentValue';
  content?: Maybe<Content>;
  contentId: Scalars['Int'];
  contentTypeField?: Maybe<ContentTypeField>;
  contentTypeFieldId: Scalars['Int'];
  id: Scalars['Int'];
  insertedDate?: Maybe<Scalars['DateTime']>;
  localeId: Scalars['UUID'];
  status?: Maybe<ContentStatus>;
  statusId?: Maybe<Scalars['Int']>;
  updatedDate?: Maybe<Scalars['DateTime']>;
  value?: Maybe<Scalars['String']>;
};

export type CreateContentDefinitionFieldModelInput = {
  dataLinkName?: InputMaybe<Scalars['String']>;
  fieldTypeId: Scalars['Int'];
  name?: InputMaybe<Scalars['String']>;
};

export type CreateContentDefinitionModelInput = {
  description?: InputMaybe<Scalars['String']>;
  fields?: InputMaybe<
    Array<InputMaybe<CreateContentDefinitionFieldModelInput>>
  >;
  metaData?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type DailyProgramme = {
  __typename?: 'DailyProgramme';
  day: Scalars['Int'];
  dayDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  largeGroupActivityId: Scalars['Int'];
  messageBoardText?: Maybe<Scalars['String']>;
  programme?: Maybe<Programme>;
  programmeId: Scalars['UUID'];
  smallGroupActivityId: Scalars['Int'];
  storyActivityId: Scalars['Int'];
  storyBookId: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type DailyProgrammeFilterInput = {
  and?: InputMaybe<Array<DailyProgrammeFilterInput>>;
  day?: InputMaybe<ComparableInt32OperationFilterInput>;
  dayDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  largeGroupActivityId?: InputMaybe<ComparableInt32OperationFilterInput>;
  messageBoardText?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DailyProgrammeFilterInput>>;
  programme?: InputMaybe<ProgrammeFilterInput>;
  programmeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  smallGroupActivityId?: InputMaybe<ComparableInt32OperationFilterInput>;
  storyActivityId?: InputMaybe<ComparableInt32OperationFilterInput>;
  storyBookId?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type DailyProgrammeInput = {
  Day: Scalars['Int'];
  DayDate: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LargeGroupActivityId: Scalars['Int'];
  MessageBoardText?: InputMaybe<Scalars['String']>;
  ProgrammeId: Scalars['UUID'];
  SmallGroupActivityId: Scalars['Int'];
  StoryActivityId: Scalars['Int'];
  StoryBookId: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type DailyProgrammeModelInput = {
  day: Scalars['Int'];
  dayDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  largeGroupActivityId: Scalars['Int'];
  messageBoardText?: InputMaybe<Scalars['String']>;
  programmeId: Scalars['UUID'];
  smallGroupActivityId: Scalars['Int'];
  storyActivityId: Scalars['Int'];
  storyBookId: Scalars['Int'];
};

export type DailyProgrammeSortInput = {
  day?: InputMaybe<SortEnumType>;
  dayDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  largeGroupActivityId?: InputMaybe<SortEnumType>;
  messageBoardText?: InputMaybe<SortEnumType>;
  programme?: InputMaybe<ProgrammeSortInput>;
  programmeId?: InputMaybe<SortEnumType>;
  smallGroupActivityId?: InputMaybe<SortEnumType>;
  storyActivityId?: InputMaybe<SortEnumType>;
  storyBookId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type DetailClubModel = {
  __typename?: 'DetailClubModel';
  clubActivities?: Maybe<Array<Maybe<ClubActivity>>>;
  clubCoach?: Maybe<ClubCoachModel>;
  clubLeader?: Maybe<ClubLeaderModel>;
  clubMembers?: Maybe<Array<Maybe<ClubMemberModel>>>;
  clubSupport?: Maybe<ClubSupportModel>;
  id: Scalars['UUID'];
  incomingClubLeader?: Maybe<ClubLeaderModel>;
  issuesTasks?: Maybe<Array<Maybe<IssueTask>>>;
  league?: Maybe<LeagueModel>;
  leagueRanking: Scalars['Int'];
  maxPointsTotal: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  pointsTotal: Scalars['Int'];
};

export type DisplaySet = {
  __typename?: 'DisplaySet';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
};

export type DisplaySetFilterInput = {
  and?: InputMaybe<Array<DisplaySetFilterInput>>;
  color?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DisplaySetFilterInput>>;
  subject?: InputMaybe<StringOperationFilterInput>;
};

export type DisplaySetInput = {
  color?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
};

export type DisplaySetSortInput = {
  color?: InputMaybe<SortEnumType>;
  icon?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
};

export type District = {
  __typename?: 'District';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  provinceId: Scalars['UUID'];
  subDistricts?: Maybe<Array<Maybe<SubDistrict>>>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type DistrictFilterInput = {
  and?: InputMaybe<Array<DistrictFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DistrictFilterInput>>;
  province?: InputMaybe<ProvinceFilterInput>;
  provinceId?: InputMaybe<ComparableGuidOperationFilterInput>;
  subDistricts?: InputMaybe<ListFilterInputTypeOfSubDistrictFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type DistrictInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Province?: InputMaybe<ProvinceInput>;
  ProvinceId: Scalars['UUID'];
  SubDistricts?: InputMaybe<Array<InputMaybe<SubDistrictInput>>>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type DistrictModelInput = {
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
  provinceId: Scalars['UUID'];
};

export type DistrictSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  province?: InputMaybe<ProvinceSortInput>;
  provinceId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type DistrictStatsModel = {
  __typename?: 'DistrictStatsModel';
  id?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  subDistricts?: Maybe<Array<Maybe<SubDistrict>>>;
  totalClinics: Scalars['Int'];
  totalHCWs: Scalars['Int'];
  totalSubDistricts: Scalars['Int'];
  totalTeamLeads: Scalars['Int'];
};

export type Document = {
  __typename?: 'Document';
  clientName?: Maybe<Scalars['String']>;
  clientStatus?: Maybe<Scalars['String']>;
  createdByName?: Maybe<Scalars['String']>;
  createdUser?: Maybe<ApplicationUser>;
  createdUserId?: Maybe<Scalars['UUID']>;
  documentType?: Maybe<DocumentType>;
  documentTypeId: Scalars['UUID'];
  hierarchy?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  workflowStatus?: Maybe<WorkflowStatus>;
  workflowStatusId: Scalars['UUID'];
};

export type DocumentFilterInput = {
  and?: InputMaybe<Array<DocumentFilterInput>>;
  clientName?: InputMaybe<StringOperationFilterInput>;
  clientStatus?: InputMaybe<StringOperationFilterInput>;
  createdByName?: InputMaybe<StringOperationFilterInput>;
  createdUser?: InputMaybe<ApplicationUserFilterInput>;
  createdUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  documentType?: InputMaybe<DocumentTypeFilterInput>;
  documentTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  hierarchy?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DocumentFilterInput>>;
  reference?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  workflowStatus?: InputMaybe<WorkflowStatusFilterInput>;
  workflowStatusId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type DocumentInput = {
  ClientName?: InputMaybe<Scalars['String']>;
  ClientStatus?: InputMaybe<Scalars['String']>;
  CreatedByName?: InputMaybe<Scalars['String']>;
  CreatedUser?: InputMaybe<ApplicationUserInput>;
  CreatedUserId?: InputMaybe<Scalars['UUID']>;
  DocumentType?: InputMaybe<DocumentTypeInput>;
  DocumentTypeId: Scalars['UUID'];
  Hierarchy?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Reference?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  WorkflowStatusId: Scalars['UUID'];
};

export type DocumentModel = {
  __typename?: 'DocumentModel';
  name?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type DocumentSortInput = {
  clientName?: InputMaybe<SortEnumType>;
  clientStatus?: InputMaybe<SortEnumType>;
  createdByName?: InputMaybe<SortEnumType>;
  createdUser?: InputMaybe<ApplicationUserSortInput>;
  createdUserId?: InputMaybe<SortEnumType>;
  documentType?: InputMaybe<DocumentTypeSortInput>;
  documentTypeId?: InputMaybe<SortEnumType>;
  hierarchy?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  reference?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  workflowStatus?: InputMaybe<WorkflowStatusSortInput>;
  workflowStatusId?: InputMaybe<SortEnumType>;
};

export type DocumentType = {
  __typename?: 'DocumentType';
  description?: Maybe<Scalars['String']>;
  enumId: FileTypeEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type DocumentTypeFilterInput = {
  and?: InputMaybe<Array<DocumentTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<FileTypeEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<DocumentTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type DocumentTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: FileTypeEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type DocumentTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Education = {
  __typename?: 'Education';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type EducationFilterInput = {
  and?: InputMaybe<Array<EducationFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<EducationFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type EducationInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type EducationSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type EventRecord = {
  __typename?: 'EventRecord';
  eventRecordType?: Maybe<EventRecordType>;
  eventRecordTypeId: Scalars['UUID'];
  id: Scalars['UUID'];
  infant?: Maybe<Infant>;
  infantId?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  linkedVisitId?: Maybe<Scalars['UUID']>;
  mother?: Maybe<Mother>;
  motherId?: Maybe<Scalars['UUID']>;
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type EventRecordFilterInput = {
  and?: InputMaybe<Array<EventRecordFilterInput>>;
  eventRecordType?: InputMaybe<EventRecordTypeFilterInput>;
  eventRecordTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  infant?: InputMaybe<InfantFilterInput>;
  infantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedVisitId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EventRecordFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type EventRecordInput = {
  EventRecordType?: InputMaybe<EventRecordTypeInput>;
  EventRecordTypeId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  Infant?: InputMaybe<InfantInput>;
  InfantId?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LinkedVisitId?: InputMaybe<Scalars['UUID']>;
  Mother?: InputMaybe<MotherInput>;
  MotherId?: InputMaybe<Scalars['UUID']>;
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type EventRecordModelInput = {
  eventRecordType?: InputMaybe<EventRecordTypeInput>;
  eventRecordTypeId?: InputMaybe<Scalars['UUID']>;
  infant?: InputMaybe<InfantModelInput>;
  infantId?: InputMaybe<Scalars['UUID']>;
  linkedVisitId?: InputMaybe<Scalars['String']>;
  mother?: InputMaybe<MotherModelInput>;
  motherId?: InputMaybe<Scalars['UUID']>;
  notes?: InputMaybe<Scalars['String']>;
};

export type EventRecordSortInput = {
  eventRecordType?: InputMaybe<EventRecordTypeSortInput>;
  eventRecordTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  infant?: InputMaybe<InfantSortInput>;
  infantId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  linkedVisitId?: InputMaybe<SortEnumType>;
  mother?: InputMaybe<MotherSortInput>;
  motherId?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type EventRecordType = {
  __typename?: 'EventRecordType';
  children?: Maybe<Array<Maybe<EventRecordType>>>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['UUID']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type EventRecordTypeFilterInput = {
  and?: InputMaybe<Array<EventRecordTypeFilterInput>>;
  children?: InputMaybe<ListFilterInputTypeOfEventRecordTypeFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EventRecordTypeFilterInput>>;
  parentId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type EventRecordTypeInput = {
  Children?: InputMaybe<Array<InputMaybe<EventRecordTypeInput>>>;
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  ParentId?: InputMaybe<Scalars['UUID']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type EventRecordTypeModelInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  normalizedName?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type EventRecordTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  parentId?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ExpenseItemModel = {
  __typename?: 'ExpenseItemModel';
  amount: Scalars['Float'];
  datePaid: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  expenseTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  notes?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
};

export type FieldDefinitionModel = {
  __typename?: 'FieldDefinitionModel';
  assemblyDataTypeName?: Maybe<Scalars['String']>;
  dataType?: Maybe<Scalars['String']>;
  displayMainTable: Scalars['Boolean'];
  displayName?: Maybe<Scalars['String']>;
  displayPage: Scalars['Boolean'];
  fieldTypeId: Scalars['Int'];
  graphDataTypeName?: Maybe<Scalars['String']>;
  isRequired: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
};

export type FieldType = {
  __typename?: 'FieldType';
  assemblyDataType?: Maybe<Scalars['String']>;
  dataType?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  graphQLDataType?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type FileModel = {
  __typename?: 'FileModel';
  base64File?: Maybe<Scalars['String']>;
  extension?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  fileType?: Maybe<Scalars['String']>;
};

export enum FileTypeEnum {
  AttendancePdf = 'ATTENDANCE_PDF',
  CalendarEventType = 'CALENDAR_EVENT_TYPE',
  CareGiver = 'CARE_GIVER',
  Child = 'CHILD',
  ChildBirthCertificate = 'CHILD_BIRTH_CERTIFICATE',
  ChildClinicCard = 'CHILD_CLINIC_CARD',
  ChildRegistrationForm = 'CHILD_REGISTRATION_FORM',
  ClassroomProfile = 'CLASSROOM_PROFILE',
  ClubActivityUpload = 'CLUB_ACTIVITY_UPLOAD',
  Coach = 'COACH',
  ContentImage = 'CONTENT_IMAGE',
  IdentityDocument = 'IDENTITY_DOCUMENT',
  IncomeStatementPdf = 'INCOME_STATEMENT_PDF',
  MaternalCaseRecord = 'MATERNAL_CASE_RECORD',
  Practitioner = 'PRACTITIONER',
  PractitionerAgreement = 'PRACTITIONER_AGREEMENT',
  ProfileImage = 'PROFILE_IMAGE',
  ProgressTrackingCategory = 'PROGRESS_TRACKING_CATEGORY',
  ProgressTrackingLevel = 'PROGRESS_TRACKING_LEVEL',
  ProgressTrackingSubCategory = 'PROGRESS_TRACKING_SUB_CATEGORY',
  ProofOfAccount = 'PROOF_OF_ACCOUNT',
  ProofOfSiteAddress = 'PROOF_OF_SITE_ADDRESS',
  ReportTemplates = 'REPORT_TEMPLATES',
  RoadToHealthBook = 'ROAD_TO_HEALTH_BOOK',
  StartupSupportAgreement = 'STARTUP_SUPPORT_AGREEMENT',
  Theme = 'THEME',
  Unknown = 'UNKNOWN',
}

export type FileTypeEnumOperationFilterInput = {
  eq?: InputMaybe<FileTypeEnum>;
  in?: InputMaybe<Array<FileTypeEnum>>;
  neq?: InputMaybe<FileTypeEnum>;
  nin?: InputMaybe<Array<FileTypeEnum>>;
};

export type FilterByFieldInput = {
  fieldName?: InputMaybe<Scalars['String']>;
  filterType?: InputMaybe<InputFilterComparer>;
  value?: InputMaybe<Scalars['String']>;
};

export type FollowUpVisitModelInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  attended?: InputMaybe<Scalars['Boolean']>;
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  followUpData?: InputMaybe<CmsVisitDataInputModelInput>;
  infantId?: InputMaybe<Scalars['UUID']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  motherId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
  traineeId?: InputMaybe<Scalars['UUID']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
};

export type Franchisor = {
  __typename?: 'Franchisor';
  areaOfOperation?: Maybe<Scalars['String']>;
  contactPerson?: Maybe<Scalars['String']>;
  contactPersonNumber?: Maybe<Scalars['String']>;
  hierarchy?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  secondaryAreaOfOperation?: Maybe<Scalars['String']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type FranchisorFilterInput = {
  and?: InputMaybe<Array<FranchisorFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
  contactPerson?: InputMaybe<StringOperationFilterInput>;
  contactPersonNumber?: InputMaybe<StringOperationFilterInput>;
  hierarchy?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<FranchisorFilterInput>>;
  secondaryAreaOfOperation?: InputMaybe<StringOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type FranchisorInput = {
  AreaOfOperation?: InputMaybe<Scalars['String']>;
  ContactPerson?: InputMaybe<Scalars['String']>;
  ContactPersonNumber?: InputMaybe<Scalars['String']>;
  Hierarchy?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  SecondaryAreaOfOperation?: InputMaybe<Scalars['String']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type FranchisorSortInput = {
  areaOfOperation?: InputMaybe<SortEnumType>;
  contactPerson?: InputMaybe<SortEnumType>;
  contactPersonNumber?: InputMaybe<SortEnumType>;
  hierarchy?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  secondaryAreaOfOperation?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Gender = {
  __typename?: 'Gender';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type GenderFilterInput = {
  and?: InputMaybe<Array<GenderFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<GenderFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type GenderInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type GenderSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Grant = {
  __typename?: 'Grant';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type GrantFilterInput = {
  and?: InputMaybe<Array<GrantFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<GrantFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type GrantInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type GrantSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export enum GraphActionEnum {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE',
  View = 'VIEW',
}

export type GrowGreatLeagueModel = {
  __typename?: 'GrowGreatLeagueModel';
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  leagueTypeId: Scalars['UUID'];
  leagueTypeName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
};

export type HcwHighlights = {
  __typename?: 'HCWHighlights';
  totalLastWeekFamilyVisits: Scalars['Int'];
  totalLastWeekGrowthMonitored: Scalars['Int'];
  totalLastWeekNewClients: Scalars['Int'];
  totalThisWeekFamilyVisits: Scalars['Int'];
  totalThisWeekGrowthMonitored: Scalars['Int'];
  totalThisWeekNewClients: Scalars['Int'];
};

export type HcwSummary = {
  __typename?: 'HCWSummary';
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  totalCaregiversAndChildrenWithIssues: Scalars['Int'];
  totalCaregiversAndChildrenWithUrgentIssues: Scalars['Int'];
  totalChildren: Scalars['Int'];
  totalChildrenWithNoIssues: Scalars['Int'];
  totalClientsVisited: Scalars['Int'];
  totalFoldersOpened: Scalars['Int'];
  totalPregnantMoms: Scalars['Int'];
  totalPregnantMomsWithIssues: Scalars['Int'];
  totalPregnantMomsWithNoIssues: Scalars['Int'];
  totalPregnantMomsWithUrgentIssues: Scalars['Int'];
  totalVisitsMissed: Scalars['Int'];
  totalVisitsOverdue: Scalars['Int'];
};

export type HcwVisitStatus = {
  __typename?: 'HCWVisitStatus';
  childDueVisits: Scalars['Int'];
  motherDueVisits: Scalars['Int'];
  motherOverDueVisits: Scalars['Int'];
};

export type HealthCareWorker = {
  __typename?: 'HealthCareWorker';
  clickedContactTab: Scalars['Boolean'];
  clickedDashboardClientsTab: Scalars['Boolean'];
  clickedDashboardHighlightsTab: Scalars['Boolean'];
  clickedDashboardVisitsTab: Scalars['Boolean'];
  clickedProgressTab: Scalars['Boolean'];
  clickedReferralsTab: Scalars['Boolean'];
  clickedTeamTab: Scalars['Boolean'];
  clickedVisitTab: Scalars['Boolean'];
  clinic?: Maybe<Clinic>;
  clinicId?: Maybe<Scalars['UUID']>;
  consentForPhoto: Scalars['Boolean'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isNewAtClinic: Scalars['Boolean'];
  isRegistered: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  shareContactInfo: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  welcomeMessage?: Maybe<Scalars['String']>;
};

export type HealthCareWorkerFilterInput = {
  and?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  clickedContactTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardClientsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardHighlightsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardVisitsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedProgressTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedReferralsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedTeamTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedVisitTab?: InputMaybe<BooleanOperationFilterInput>;
  clinic?: InputMaybe<ClinicFilterInput>;
  clinicId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isNewAtClinic?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  shareContactInfo?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  welcomeMessage?: InputMaybe<StringOperationFilterInput>;
};

export type HealthCareWorkerInput = {
  ClickedContactTab: Scalars['Boolean'];
  ClickedDashboardClientsTab: Scalars['Boolean'];
  ClickedDashboardHighlightsTab: Scalars['Boolean'];
  ClickedDashboardVisitsTab: Scalars['Boolean'];
  ClickedProgressTab: Scalars['Boolean'];
  ClickedReferralsTab: Scalars['Boolean'];
  ClickedTeamTab: Scalars['Boolean'];
  ClickedVisitTab: Scalars['Boolean'];
  Clinic?: InputMaybe<ClinicInput>;
  ClinicId?: InputMaybe<Scalars['UUID']>;
  ConsentForPhoto: Scalars['Boolean'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsNewAtClinic: Scalars['Boolean'];
  IsRegistered: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  ShareContactInfo: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  WelcomeMessage?: InputMaybe<Scalars['String']>;
};

export type HealthCareWorkerInputModelInput = {
  clickedContactTab?: InputMaybe<Scalars['Boolean']>;
  clickedDashboardClientsTab?: InputMaybe<Scalars['Boolean']>;
  clickedDashboardHighlightsTab?: InputMaybe<Scalars['Boolean']>;
  clickedDashboardVisitsTab?: InputMaybe<Scalars['Boolean']>;
  clickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  clickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  clickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  isRegistered: Scalars['Boolean'];
  languageId?: InputMaybe<Scalars['UUID']>;
  teamLead?: InputMaybe<TeamLeadInput>;
  teamLeadId?: InputMaybe<Scalars['UUID']>;
  user?: InputMaybe<ApplicationUserInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type HealthCareWorkerModel = {
  __typename?: 'HealthCareWorkerModel';
  clickedContactTab: Scalars['Boolean'];
  clickedDashboardClientsTab: Scalars['Boolean'];
  clickedDashboardHighlightsTab: Scalars['Boolean'];
  clickedDashboardVisitsTab: Scalars['Boolean'];
  clickedProgressTab: Scalars['Boolean'];
  clickedReferralsTab: Scalars['Boolean'];
  clickedTeamTab: Scalars['Boolean'];
  clickedVisitTab: Scalars['Boolean'];
  clinicId?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  isNewAtClinic: Scalars['Boolean'];
  isRegistered?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  languageId: Scalars['UUID'];
  shareContactInfo: Scalars['Boolean'];
  user?: Maybe<UserModel>;
  userId: Scalars['UUID'];
  welcomeMessage?: Maybe<Scalars['String']>;
};

export type HealthCareWorkerSortInput = {
  clickedContactTab?: InputMaybe<SortEnumType>;
  clickedDashboardClientsTab?: InputMaybe<SortEnumType>;
  clickedDashboardHighlightsTab?: InputMaybe<SortEnumType>;
  clickedDashboardVisitsTab?: InputMaybe<SortEnumType>;
  clickedProgressTab?: InputMaybe<SortEnumType>;
  clickedReferralsTab?: InputMaybe<SortEnumType>;
  clickedTeamTab?: InputMaybe<SortEnumType>;
  clickedVisitTab?: InputMaybe<SortEnumType>;
  clinic?: InputMaybe<ClinicSortInput>;
  clinicId?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isNewAtClinic?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
  shareContactInfo?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  welcomeMessage?: InputMaybe<SortEnumType>;
};

export type HealthPromotion = {
  __typename?: 'HealthPromotion';
  description?: Maybe<Scalars['String']>;
  descriptionListIcon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type HealthPromotionInput = {
  description?: InputMaybe<Scalars['String']>;
  descriptionListIcon?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  visit?: InputMaybe<Scalars['String']>;
};

export type HierarchyEntity = {
  __typename?: 'HierarchyEntity';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  parentId: Scalars['UUID'];
  systemType?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type HierarchyEntityFilterInput = {
  and?: InputMaybe<Array<HierarchyEntityFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<HierarchyEntityFilterInput>>;
  parentId?: InputMaybe<ComparableGuidOperationFilterInput>;
  systemType?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type HierarchyEntityInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ParentId: Scalars['UUID'];
  SystemType?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type HierarchyEntitySortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  parentId?: InputMaybe<SortEnumType>;
  systemType?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Holiday = {
  __typename?: 'Holiday';
  day: Scalars['DateTime'];
};

export type HolidayInput = {
  day: Scalars['DateTime'];
};

export type IncomeExpensePdfDataModel = {
  __typename?: 'IncomeExpensePDFDataModel';
  amount: Scalars['Float'];
  child?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  invoiceNr: Scalars['Int'];
  photoProof?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type IncomeExpensePdfHeaderModel = {
  __typename?: 'IncomeExpensePDFHeaderModel';
  dataKey?: Maybe<Scalars['String']>;
  header?: Maybe<Scalars['String']>;
};

export type IncomeExpensePdfTableModel = {
  __typename?: 'IncomeExpensePDFTableModel';
  data?: Maybe<Array<Maybe<IncomeExpensePdfDataModel>>>;
  headers?: Maybe<Array<Maybe<IncomeExpensePdfHeaderModel>>>;
  tableName?: Maybe<Scalars['String']>;
  total: Scalars['Float'];
  type?: Maybe<Scalars['String']>;
};

export type IncomeItemModel = {
  __typename?: 'IncomeItemModel';
  amount: Scalars['Float'];
  amountExpected: Scalars['Float'];
  childCoverAmount: Scalars['Float'];
  childUserId?: Maybe<Scalars['String']>;
  contributionTypeId?: Maybe<Scalars['String']>;
  dateReceived: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  feeTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeTypeId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  payTypeId?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
};

export type IncomeStatementModel = {
  __typename?: 'IncomeStatementModel';
  balance: Scalars['Float'];
  contactedByCoach: Scalars['Boolean'];
  expenseItems?: Maybe<Array<Maybe<ExpenseItemModel>>>;
  expenseTotal: Scalars['Float'];
  id: Scalars['UUID'];
  incomeItems?: Maybe<Array<Maybe<IncomeItemModel>>>;
  incomeTotal: Scalars['Float'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type IncomeStatements = {
  __typename?: 'IncomeStatements';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
};

export type IncomeStatementsInput = {
  description?: InputMaybe<Scalars['String']>;
};

export type Infant = {
  __typename?: 'Infant';
  caregiver?: Maybe<Caregiver>;
  caregiverId?: Maybe<Scalars['UUID']>;
  clickedContactTab?: Maybe<Scalars['Boolean']>;
  clickedProgressTab?: Maybe<Scalars['Boolean']>;
  clickedReferralsTab?: Maybe<Scalars['Boolean']>;
  clickedVisitTab?: Maybe<Scalars['Boolean']>;
  completed24MonthVisits?: Maybe<Scalars['Boolean']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  lengthAtBirth?: Maybe<Scalars['Decimal']>;
  mother?: Maybe<Mother>;
  motherCaregiverId?: Maybe<Scalars['UUID']>;
  nextVisitDate?: Maybe<Scalars['DateTime']>;
  statusInfo?: Maybe<DisplaySet>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  weightAtBirth?: Maybe<Scalars['Decimal']>;
};

export type InfantFilterInput = {
  and?: InputMaybe<Array<InfantFilterInput>>;
  caregiver?: InputMaybe<CaregiverFilterInput>;
  caregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  clickedContactTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedProgressTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedReferralsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedVisitTab?: InputMaybe<BooleanOperationFilterInput>;
  completed24MonthVisits?: InputMaybe<BooleanOperationFilterInput>;
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lengthAtBirth?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherCaregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  nextVisitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<InfantFilterInput>>;
  statusInfo?: InputMaybe<DisplaySetFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  weightAtBirth?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
};

export type InfantInput = {
  Caregiver?: InputMaybe<CaregiverInput>;
  CaregiverId?: InputMaybe<Scalars['UUID']>;
  ClickedContactTab?: InputMaybe<Scalars['Boolean']>;
  ClickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  ClickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  Completed24MonthVisits?: InputMaybe<Scalars['Boolean']>;
  Gender?: InputMaybe<GenderInput>;
  GenderId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LengthAtBirth?: InputMaybe<Scalars['Decimal']>;
  Mother?: InputMaybe<MotherInput>;
  MotherCaregiverId?: InputMaybe<Scalars['UUID']>;
  NextVisitDate?: InputMaybe<Scalars['DateTime']>;
  StatusInfo?: InputMaybe<DisplaySetInput>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  WeightAtBirth?: InputMaybe<Scalars['Decimal']>;
};

export type InfantModelInput = {
  caregiver?: InputMaybe<CaregiverModelInput>;
  caregiverId?: InputMaybe<Scalars['UUID']>;
  clickedContactTab?: InputMaybe<Scalars['Boolean']>;
  clickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  clickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  clickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  completed24MonthVisits?: InputMaybe<Scalars['Boolean']>;
  dateOfBirth: Scalars['DateTime'];
  firstName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  lengthAtBirth?: InputMaybe<Scalars['Decimal']>;
  mother?: InputMaybe<MotherModelInput>;
  motherCaregiverId?: InputMaybe<Scalars['UUID']>;
  userId?: InputMaybe<Scalars['String']>;
  weightAtBirth?: InputMaybe<Scalars['Decimal']>;
};

export type InfantSortInput = {
  caregiver?: InputMaybe<CaregiverSortInput>;
  caregiverId?: InputMaybe<SortEnumType>;
  clickedContactTab?: InputMaybe<SortEnumType>;
  clickedProgressTab?: InputMaybe<SortEnumType>;
  clickedReferralsTab?: InputMaybe<SortEnumType>;
  clickedVisitTab?: InputMaybe<SortEnumType>;
  completed24MonthVisits?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<GenderSortInput>;
  genderId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  lengthAtBirth?: InputMaybe<SortEnumType>;
  mother?: InputMaybe<MotherSortInput>;
  motherCaregiverId?: InputMaybe<SortEnumType>;
  nextVisitDate?: InputMaybe<SortEnumType>;
  statusInfo?: InputMaybe<DisplaySetSortInput>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  weightAtBirth?: InputMaybe<SortEnumType>;
};

export type Infographics = {
  __typename?: 'Infographics';
  headerA?: Maybe<Scalars['String']>;
  headerB?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageA?: Maybe<Scalars['String']>;
  imageB?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  showDividerA?: Maybe<Scalars['String']>;
  showDividerB?: Maybe<Scalars['String']>;
  tipBoxColorA?: Maybe<Scalars['String']>;
  tipBoxDescriptionA?: Maybe<Scalars['String']>;
  tipBoxDescriptionColorA?: Maybe<Scalars['String']>;
  tipBoxIconA?: Maybe<Scalars['String']>;
  tipBoxTitleA?: Maybe<Scalars['String']>;
  tipBoxTitleColorA?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type InfographicsInput = {
  headerA?: InputMaybe<Scalars['String']>;
  headerB?: InputMaybe<Scalars['String']>;
  imageA?: InputMaybe<Scalars['String']>;
  imageB?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  showDividerA?: InputMaybe<Scalars['String']>;
  showDividerB?: InputMaybe<Scalars['String']>;
  tipBoxColorA?: InputMaybe<Scalars['String']>;
  tipBoxDescriptionA?: InputMaybe<Scalars['String']>;
  tipBoxDescriptionColorA?: InputMaybe<Scalars['String']>;
  tipBoxIconA?: InputMaybe<Scalars['String']>;
  tipBoxTitleA?: InputMaybe<Scalars['String']>;
  tipBoxTitleColorA?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  visit?: InputMaybe<Scalars['String']>;
};

export enum InputFilterComparer {
  ContainedBy = 'CONTAINED_BY',
  Contains = 'CONTAINS',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanOrEqual = 'GREATER_THAN_OR_EQUAL',
  ILike = 'I_LIKE',
  LessThan = 'LESS_THAN',
  LessThanOrEqual = 'LESS_THAN_OR_EQUAL',
}

export type InputValidationError = {
  __typename?: 'InputValidationError';
  errorDescription?: Maybe<Scalars['String']>;
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
  row: Scalars['Int'];
};

export type IntegrationAudit = {
  __typename?: 'IntegrationAudit';
  changeType?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  property?: Maybe<Scalars['String']>;
  relatedId?: Maybe<Scalars['String']>;
  submitted?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
  valueAfter?: Maybe<Scalars['String']>;
  valueBefore?: Maybe<Scalars['String']>;
};

export type IntegrationAuditFilterInput = {
  and?: InputMaybe<Array<IntegrationAuditFilterInput>>;
  changeType?: InputMaybe<StringOperationFilterInput>;
  entity?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<IntegrationAuditFilterInput>>;
  property?: InputMaybe<StringOperationFilterInput>;
  relatedId?: InputMaybe<StringOperationFilterInput>;
  submitted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableGuidOperationFilterInput>;
  valueAfter?: InputMaybe<StringOperationFilterInput>;
  valueBefore?: InputMaybe<StringOperationFilterInput>;
};

export type IntegrationAuditInput = {
  ChangeType?: InputMaybe<Scalars['String']>;
  Entity?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Property?: InputMaybe<Scalars['String']>;
  RelatedId?: InputMaybe<Scalars['String']>;
  Submitted?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId: Scalars['UUID'];
  ValueAfter?: InputMaybe<Scalars['String']>;
  ValueBefore?: InputMaybe<Scalars['String']>;
};

export type IntegrationAuditSortInput = {
  changeType?: InputMaybe<SortEnumType>;
  entity?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  property?: InputMaybe<SortEnumType>;
  relatedId?: InputMaybe<SortEnumType>;
  submitted?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  valueAfter?: InputMaybe<SortEnumType>;
  valueBefore?: InputMaybe<SortEnumType>;
};

export type IntegrationColumnMapping = {
  __typename?: 'IntegrationColumnMapping';
  columnValidationLimit: Scalars['Int'];
  entityDataType?: Maybe<Scalars['String']>;
  entityGrouping?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  integrationSystem?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  localColumn?: Maybe<Scalars['String']>;
  localEntity?: Maybe<Scalars['String']>;
  remapEntity?: Maybe<Scalars['String']>;
  remapToString: Scalars['Boolean'];
  remoteColumn?: Maybe<Scalars['String']>;
  remoteEntity?: Maybe<Scalars['String']>;
  updateDirection?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type IntegrationColumnMappingFilterInput = {
  and?: InputMaybe<Array<IntegrationColumnMappingFilterInput>>;
  columnValidationLimit?: InputMaybe<ComparableInt32OperationFilterInput>;
  entityDataType?: InputMaybe<StringOperationFilterInput>;
  entityGrouping?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  integrationSystem?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  localColumn?: InputMaybe<StringOperationFilterInput>;
  localEntity?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IntegrationColumnMappingFilterInput>>;
  remapEntity?: InputMaybe<StringOperationFilterInput>;
  remapToString?: InputMaybe<BooleanOperationFilterInput>;
  remoteColumn?: InputMaybe<StringOperationFilterInput>;
  remoteEntity?: InputMaybe<StringOperationFilterInput>;
  updateDirection?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type IntegrationColumnMappingInput = {
  ColumnValidationLimit: Scalars['Int'];
  EntityDataType?: InputMaybe<Scalars['String']>;
  EntityGrouping?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IntegrationSystem?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  LocalColumn?: InputMaybe<Scalars['String']>;
  LocalEntity?: InputMaybe<Scalars['String']>;
  RemapEntity?: InputMaybe<Scalars['String']>;
  RemapToString: Scalars['Boolean'];
  RemoteColumn?: InputMaybe<Scalars['String']>;
  RemoteEntity?: InputMaybe<Scalars['String']>;
  UpdateDirection?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type IntegrationColumnMappingSortInput = {
  columnValidationLimit?: InputMaybe<SortEnumType>;
  entityDataType?: InputMaybe<SortEnumType>;
  entityGrouping?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  integrationSystem?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  localColumn?: InputMaybe<SortEnumType>;
  localEntity?: InputMaybe<SortEnumType>;
  remapEntity?: InputMaybe<SortEnumType>;
  remapToString?: InputMaybe<SortEnumType>;
  remoteColumn?: InputMaybe<SortEnumType>;
  remoteEntity?: InputMaybe<SortEnumType>;
  updateDirection?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type IntegrationEntityMapping = {
  __typename?: 'IntegrationEntityMapping';
  afterJSON?: Maybe<Scalars['String']>;
  beforeJSON?: Maybe<Scalars['String']>;
  entityGrouping?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  integrationSystem?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isComplete?: Maybe<Scalars['Boolean']>;
  lastAttendanceSubmittedDate?: Maybe<Scalars['DateTime']>;
  lastCheckedDate: Scalars['DateTime'];
  lastIncomeSubmittedDate?: Maybe<Scalars['DateTime']>;
  lastUpdatedDate: Scalars['DateTime'];
  localEntity?: Maybe<Scalars['String']>;
  localId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  remoteEntity?: Maybe<Scalars['String']>;
  remoteId?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type IntegrationEntityMappingFilterInput = {
  afterJSON?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<IntegrationEntityMappingFilterInput>>;
  beforeJSON?: InputMaybe<StringOperationFilterInput>;
  entityGrouping?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  integrationSystem?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isComplete?: InputMaybe<BooleanOperationFilterInput>;
  lastAttendanceSubmittedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  lastCheckedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  lastIncomeSubmittedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  lastUpdatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  localEntity?: InputMaybe<StringOperationFilterInput>;
  localId?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IntegrationEntityMappingFilterInput>>;
  remoteEntity?: InputMaybe<StringOperationFilterInput>;
  remoteId?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type IntegrationEntityMappingInput = {
  AfterJSON?: InputMaybe<Scalars['String']>;
  BeforeJSON?: InputMaybe<Scalars['String']>;
  EntityGrouping?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IntegrationSystem?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  IsComplete?: InputMaybe<Scalars['Boolean']>;
  LastAttendanceSubmittedDate?: InputMaybe<Scalars['DateTime']>;
  LastCheckedDate: Scalars['DateTime'];
  LastIncomeSubmittedDate?: InputMaybe<Scalars['DateTime']>;
  LastUpdatedDate: Scalars['DateTime'];
  LocalEntity?: InputMaybe<Scalars['String']>;
  LocalId?: InputMaybe<Scalars['String']>;
  Notes?: InputMaybe<Scalars['String']>;
  RemoteEntity?: InputMaybe<Scalars['String']>;
  RemoteId?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId: Scalars['UUID'];
};

export type IntegrationEntityMappingSortInput = {
  afterJSON?: InputMaybe<SortEnumType>;
  beforeJSON?: InputMaybe<SortEnumType>;
  entityGrouping?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  integrationSystem?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isComplete?: InputMaybe<SortEnumType>;
  lastAttendanceSubmittedDate?: InputMaybe<SortEnumType>;
  lastCheckedDate?: InputMaybe<SortEnumType>;
  lastIncomeSubmittedDate?: InputMaybe<SortEnumType>;
  lastUpdatedDate?: InputMaybe<SortEnumType>;
  localEntity?: InputMaybe<SortEnumType>;
  localId?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  remoteEntity?: InputMaybe<SortEnumType>;
  remoteId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type IntegrationLog = {
  __typename?: 'IntegrationLog';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  logNotes?: Maybe<Scalars['String']>;
  logResult?: Maybe<Scalars['String']>;
  relatedId?: Maybe<Scalars['String']>;
  relatedType: LogRelatedType;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type IntegrationLogFilterInput = {
  and?: InputMaybe<Array<IntegrationLogFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  logNotes?: InputMaybe<StringOperationFilterInput>;
  logResult?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IntegrationLogFilterInput>>;
  relatedId?: InputMaybe<StringOperationFilterInput>;
  relatedType?: InputMaybe<LogRelatedTypeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type IntegrationLogInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LogNotes?: InputMaybe<Scalars['String']>;
  LogResult?: InputMaybe<Scalars['String']>;
  RelatedId?: InputMaybe<Scalars['String']>;
  RelatedType: LogRelatedType;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type IntegrationLogSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  logNotes?: InputMaybe<SortEnumType>;
  logResult?: InputMaybe<SortEnumType>;
  relatedId?: InputMaybe<SortEnumType>;
  relatedType?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type IssueTask = {
  __typename?: 'IssueTask';
  secondaryDescription?: Maybe<Scalars['String']>;
  secondaryText?: Maybe<Scalars['String']>;
  secondaryTextColor?: Maybe<Scalars['String']>;
};

export type KeyValuePairOfInt32AndInt32 = {
  __typename?: 'KeyValuePairOfInt32AndInt32';
  key: Scalars['Int'];
  value: Scalars['Int'];
};

export type KeyValuePairOfInt32AndNullableOfInt32 = {
  __typename?: 'KeyValuePairOfInt32AndNullableOfInt32';
  key: Scalars['Int'];
  value?: Maybe<Scalars['Int']>;
};

export type Language = {
  __typename?: 'Language';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  locale?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type LanguageFilterInput = {
  and?: InputMaybe<Array<LanguageFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  locale?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LanguageFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type LanguageInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Locale?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type LanguageSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  locale?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type League = {
  __typename?: 'League';
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  leagueType?: Maybe<LeagueType>;
  leagueTypeId: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type LeagueClubsModel = {
  __typename?: 'LeagueClubsModel';
  clubs?: Maybe<Array<Maybe<ClubPointsSummaryModel>>>;
  id: Scalars['UUID'];
  leagueTypeId: Scalars['UUID'];
  leagueTypeName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type LeagueFilterInput = {
  and?: InputMaybe<Array<LeagueFilterInput>>;
  endDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  leagueType?: InputMaybe<LeagueTypeFilterInput>;
  leagueTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LeagueFilterInput>>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type LeagueInput = {
  EndDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LeagueType?: InputMaybe<LeagueTypeInput>;
  LeagueTypeId: Scalars['UUID'];
  Name?: InputMaybe<Scalars['String']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type LeagueModel = {
  __typename?: 'LeagueModel';
  id: Scalars['UUID'];
  leagueTypeId: Scalars['UUID'];
  leagueTypeName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberOfClubsInLeague: Scalars['Int'];
};

export type LeagueSortInput = {
  endDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  leagueType?: InputMaybe<LeagueTypeSortInput>;
  leagueTypeId?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type LeagueType = {
  __typename?: 'LeagueType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type LeagueTypeFilterInput = {
  and?: InputMaybe<Array<LeagueTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LeagueTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type LeagueTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type LeagueTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Learner = {
  __typename?: 'Learner';
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  otherAttendanceReason?: Maybe<Scalars['String']>;
  programmeAttendanceReason?: Maybe<ProgrammeAttendanceReason>;
  programmeAttendanceReasonId?: Maybe<Scalars['UUID']>;
  startedAttendance: Scalars['DateTime'];
  stoppedAttendance?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type LearnerFilterInput = {
  and?: InputMaybe<Array<LearnerFilterInput>>;
  classroomGroup?: InputMaybe<ClassroomGroupFilterInput>;
  classroomGroupId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<LearnerFilterInput>>;
  otherAttendanceReason?: InputMaybe<StringOperationFilterInput>;
  programmeAttendanceReason?: InputMaybe<ProgrammeAttendanceReasonFilterInput>;
  programmeAttendanceReasonId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startedAttendance?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  stoppedAttendance?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type LearnerInput = {
  ClassroomGroup?: InputMaybe<ClassroomGroupInput>;
  ClassroomGroupId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  OtherAttendanceReason?: InputMaybe<Scalars['String']>;
  ProgrammeAttendanceReasonId?: InputMaybe<Scalars['UUID']>;
  StartedAttendance: Scalars['DateTime'];
  StoppedAttendance?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type LearnerSortInput = {
  classroomGroup?: InputMaybe<ClassroomGroupSortInput>;
  classroomGroupId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  otherAttendanceReason?: InputMaybe<SortEnumType>;
  programmeAttendanceReason?: InputMaybe<ProgrammeAttendanceReasonSortInput>;
  programmeAttendanceReasonId?: InputMaybe<SortEnumType>;
  startedAttendance?: InputMaybe<SortEnumType>;
  stoppedAttendance?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type License = {
  __typename?: 'License';
  collectedSSHandbook?: Maybe<Scalars['Boolean']>;
  collectedSSPlaykit?: Maybe<Scalars['Boolean']>;
  declinedCommentsSteps?: Maybe<Scalars['String']>;
  declinedDate?: Maybe<Scalars['DateTime']>;
  delicensedComment?: Maybe<Scalars['String']>;
  delicensedDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  licenseDate?: Maybe<Scalars['DateTime']>;
  licenseType?: Maybe<LicenseType>;
  licenseTypeId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type LicenseFilterInput = {
  and?: InputMaybe<Array<LicenseFilterInput>>;
  collectedSSHandbook?: InputMaybe<BooleanOperationFilterInput>;
  collectedSSPlaykit?: InputMaybe<BooleanOperationFilterInput>;
  declinedCommentsSteps?: InputMaybe<StringOperationFilterInput>;
  declinedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  delicensedComment?: InputMaybe<StringOperationFilterInput>;
  delicensedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  licenseDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  licenseType?: InputMaybe<LicenseTypeFilterInput>;
  licenseTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  or?: InputMaybe<Array<LicenseFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type LicenseInput = {
  CollectedSSHandbook?: InputMaybe<Scalars['Boolean']>;
  CollectedSSPlaykit?: InputMaybe<Scalars['Boolean']>;
  DeclinedCommentsSteps?: InputMaybe<Scalars['String']>;
  DeclinedDate?: InputMaybe<Scalars['DateTime']>;
  DelicensedComment?: InputMaybe<Scalars['String']>;
  DelicensedDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LicenseDate?: InputMaybe<Scalars['DateTime']>;
  LicenseType?: InputMaybe<LicenseTypeInput>;
  LicenseTypeId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type LicenseModelInput = {
  collectedSSHandbook?: InputMaybe<Scalars['Boolean']>;
  collectedSSPlaykit?: InputMaybe<Scalars['Boolean']>;
  delicensedComment?: InputMaybe<Scalars['String']>;
  delicensedDate?: InputMaybe<Scalars['DateTime']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type LicenseSortInput = {
  collectedSSHandbook?: InputMaybe<SortEnumType>;
  collectedSSPlaykit?: InputMaybe<SortEnumType>;
  declinedCommentsSteps?: InputMaybe<SortEnumType>;
  declinedDate?: InputMaybe<SortEnumType>;
  delicensedComment?: InputMaybe<SortEnumType>;
  delicensedDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  licenseDate?: InputMaybe<SortEnumType>;
  licenseType?: InputMaybe<LicenseTypeSortInput>;
  licenseTypeId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type LicenseType = {
  __typename?: 'LicenseType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type LicenseTypeFilterInput = {
  and?: InputMaybe<Array<LicenseTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<LicenseTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type LicenseTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type LicenseTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ListFilterInputTypeOfAbsenteesFilterInput = {
  all?: InputMaybe<AbsenteesFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<AbsenteesFilterInput>;
  some?: InputMaybe<AbsenteesFilterInput>;
};

export type ListFilterInputTypeOfCalendarEventParticipantFilterInput = {
  all?: InputMaybe<CalendarEventParticipantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<CalendarEventParticipantFilterInput>;
  some?: InputMaybe<CalendarEventParticipantFilterInput>;
};

export type ListFilterInputTypeOfClassProgrammeFilterInput = {
  all?: InputMaybe<ClassProgrammeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClassProgrammeFilterInput>;
  some?: InputMaybe<ClassProgrammeFilterInput>;
};

export type ListFilterInputTypeOfClassroomGroupFilterInput = {
  all?: InputMaybe<ClassroomGroupFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClassroomGroupFilterInput>;
  some?: InputMaybe<ClassroomGroupFilterInput>;
};

export type ListFilterInputTypeOfClinicLeagueFilterInput = {
  all?: InputMaybe<ClinicLeagueFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClinicLeagueFilterInput>;
  some?: InputMaybe<ClinicLeagueFilterInput>;
};

export type ListFilterInputTypeOfClinicTeamLeadFilterInput = {
  all?: InputMaybe<ClinicTeamLeadFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClinicTeamLeadFilterInput>;
  some?: InputMaybe<ClinicTeamLeadFilterInput>;
};

export type ListFilterInputTypeOfClubLeaderFilterInput = {
  all?: InputMaybe<ClubLeaderFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubLeaderFilterInput>;
  some?: InputMaybe<ClubLeaderFilterInput>;
};

export type ListFilterInputTypeOfClubMeetingRegisterFilterInput = {
  all?: InputMaybe<ClubMeetingRegisterFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubMeetingRegisterFilterInput>;
  some?: InputMaybe<ClubMeetingRegisterFilterInput>;
};

export type ListFilterInputTypeOfClubMemberFilterInput = {
  all?: InputMaybe<ClubMemberFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubMemberFilterInput>;
  some?: InputMaybe<ClubMemberFilterInput>;
};

export type ListFilterInputTypeOfClubPointsFilterInput = {
  all?: InputMaybe<ClubPointsFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubPointsFilterInput>;
  some?: InputMaybe<ClubPointsFilterInput>;
};

export type ListFilterInputTypeOfClubSupportFilterInput = {
  all?: InputMaybe<ClubSupportFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubSupportFilterInput>;
  some?: InputMaybe<ClubSupportFilterInput>;
};

export type ListFilterInputTypeOfDailyProgrammeFilterInput = {
  all?: InputMaybe<DailyProgrammeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<DailyProgrammeFilterInput>;
  some?: InputMaybe<DailyProgrammeFilterInput>;
};

export type ListFilterInputTypeOfDocumentFilterInput = {
  all?: InputMaybe<DocumentFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<DocumentFilterInput>;
  some?: InputMaybe<DocumentFilterInput>;
};

export type ListFilterInputTypeOfEventRecordTypeFilterInput = {
  all?: InputMaybe<EventRecordTypeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<EventRecordTypeFilterInput>;
  some?: InputMaybe<EventRecordTypeFilterInput>;
};

export type ListFilterInputTypeOfGrantFilterInput = {
  all?: InputMaybe<GrantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<GrantFilterInput>;
  some?: InputMaybe<GrantFilterInput>;
};

export type ListFilterInputTypeOfHealthCareWorkerFilterInput = {
  all?: InputMaybe<HealthCareWorkerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<HealthCareWorkerFilterInput>;
  some?: InputMaybe<HealthCareWorkerFilterInput>;
};

export type ListFilterInputTypeOfInfantFilterInput = {
  all?: InputMaybe<InfantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<InfantFilterInput>;
  some?: InputMaybe<InfantFilterInput>;
};

export type ListFilterInputTypeOfLearnerFilterInput = {
  all?: InputMaybe<LearnerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<LearnerFilterInput>;
  some?: InputMaybe<LearnerFilterInput>;
};

export type ListFilterInputTypeOfNoteFilterInput = {
  all?: InputMaybe<NoteFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<NoteFilterInput>;
  some?: InputMaybe<NoteFilterInput>;
};

export type ListFilterInputTypeOfPqaSectionRatingFilterInput = {
  all?: InputMaybe<PqaSectionRatingFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<PqaSectionRatingFilterInput>;
  some?: InputMaybe<PqaSectionRatingFilterInput>;
};

export type ListFilterInputTypeOfProgrammeFilterInput = {
  all?: InputMaybe<ProgrammeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ProgrammeFilterInput>;
  some?: InputMaybe<ProgrammeFilterInput>;
};

export type ListFilterInputTypeOfStatementsExpensesFilterInput = {
  all?: InputMaybe<StatementsExpensesFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<StatementsExpensesFilterInput>;
  some?: InputMaybe<StatementsExpensesFilterInput>;
};

export type ListFilterInputTypeOfStatementsIncomeFilterInput = {
  all?: InputMaybe<StatementsIncomeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<StatementsIncomeFilterInput>;
  some?: InputMaybe<StatementsIncomeFilterInput>;
};

export type ListFilterInputTypeOfSubDistrictFilterInput = {
  all?: InputMaybe<SubDistrictFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<SubDistrictFilterInput>;
  some?: InputMaybe<SubDistrictFilterInput>;
};

export type ListFilterInputTypeOfVisitDataFilterInput = {
  all?: InputMaybe<VisitDataFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<VisitDataFilterInput>;
  some?: InputMaybe<VisitDataFilterInput>;
};

export type ListFilterInputTypeOfVisitFilterInput = {
  all?: InputMaybe<VisitFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<VisitFilterInput>;
  some?: InputMaybe<VisitFilterInput>;
};

export enum LogRelatedType {
  Error = 'ERROR',
  Log = 'LOG',
  TaskRun = 'TASK_RUN',
}

export type LogRelatedTypeOperationFilterInput = {
  eq?: InputMaybe<LogRelatedType>;
  in?: InputMaybe<Array<LogRelatedType>>;
  neq?: InputMaybe<LogRelatedType>;
  nin?: InputMaybe<Array<LogRelatedType>>;
};

export type MeetingType = {
  __typename?: 'MeetingType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type MeetingTypeFilterInput = {
  and?: InputMaybe<Array<MeetingTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MeetingTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MeetingTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type MeetingTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type MessageLog = {
  __typename?: 'MessageLog';
  action?: Maybe<Scalars['String']>;
  cTA?: Maybe<Scalars['String']>;
  cTAText?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  fromUserId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageDate?: Maybe<Scalars['DateTime']>;
  messageEndDate?: Maybe<Scalars['DateTime']>;
  messageProtocol?: Maybe<Scalars['String']>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateType?: Maybe<Scalars['String']>;
  readDate?: Maybe<Scalars['DateTime']>;
  relatedToUserId?: Maybe<Scalars['String']>;
  sentByUserId: Scalars['UUID'];
  status?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  toGroups?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type MessageLogFilterInput = {
  action?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<MessageLogFilterInput>>;
  cTA?: InputMaybe<StringOperationFilterInput>;
  cTAText?: InputMaybe<StringOperationFilterInput>;
  from?: InputMaybe<StringOperationFilterInput>;
  fromUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  messageDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  messageEndDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  messageProtocol?: InputMaybe<StringOperationFilterInput>;
  messageTemplate?: InputMaybe<MessageTemplateFilterInput>;
  messageTemplateType?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MessageLogFilterInput>>;
  readDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  relatedToUserId?: InputMaybe<StringOperationFilterInput>;
  sentByUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  status?: InputMaybe<StringOperationFilterInput>;
  subject?: InputMaybe<StringOperationFilterInput>;
  to?: InputMaybe<StringOperationFilterInput>;
  toGroups?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MessageLogInput = {
  Action?: InputMaybe<Scalars['String']>;
  CTA?: InputMaybe<Scalars['String']>;
  CTAText?: InputMaybe<Scalars['String']>;
  From?: InputMaybe<Scalars['String']>;
  FromUserId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  MessageDate?: InputMaybe<Scalars['DateTime']>;
  MessageEndDate?: InputMaybe<Scalars['DateTime']>;
  MessageProtocol?: InputMaybe<Scalars['String']>;
  MessageTemplate?: InputMaybe<MessageTemplateInput>;
  MessageTemplateType?: InputMaybe<Scalars['String']>;
  ReadDate?: InputMaybe<Scalars['DateTime']>;
  RelatedToUserId?: InputMaybe<Scalars['String']>;
  SentByUserId: Scalars['UUID'];
  Status?: InputMaybe<Scalars['String']>;
  Subject?: InputMaybe<Scalars['String']>;
  To?: InputMaybe<Scalars['String']>;
  ToGroups?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type MessageLogModel = {
  __typename?: 'MessageLogModel';
  districtId?: Maybe<Scalars['String']>;
  isEdit: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageDate: Scalars['DateTime'];
  messageLogIds?: Maybe<Array<Scalars['UUID']>>;
  messageTime?: Maybe<Scalars['String']>;
  provinceId?: Maybe<Scalars['String']>;
  roleIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  roleNames?: Maybe<Scalars['String']>;
  sendByUserId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  toGroups?: Maybe<Scalars['String']>;
  wardName?: Maybe<Scalars['String']>;
};

export type MessageLogModelInput = {
  districtId?: InputMaybe<Scalars['String']>;
  isEdit: Scalars['Boolean'];
  message?: InputMaybe<Scalars['String']>;
  messageDate: Scalars['DateTime'];
  messageLogIds?: InputMaybe<Array<Scalars['UUID']>>;
  messageTime?: InputMaybe<Scalars['String']>;
  provinceId?: InputMaybe<Scalars['String']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  roleNames?: InputMaybe<Scalars['String']>;
  sendByUserId?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Scalars['String']>;
  toGroups?: InputMaybe<Scalars['String']>;
  wardName?: InputMaybe<Scalars['String']>;
};

export type MessageLogSortInput = {
  action?: InputMaybe<SortEnumType>;
  cTA?: InputMaybe<SortEnumType>;
  cTAText?: InputMaybe<SortEnumType>;
  from?: InputMaybe<SortEnumType>;
  fromUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  messageDate?: InputMaybe<SortEnumType>;
  messageEndDate?: InputMaybe<SortEnumType>;
  messageProtocol?: InputMaybe<SortEnumType>;
  messageTemplate?: InputMaybe<MessageTemplateSortInput>;
  messageTemplateType?: InputMaybe<SortEnumType>;
  readDate?: InputMaybe<SortEnumType>;
  relatedToUserId?: InputMaybe<SortEnumType>;
  sentByUserId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  to?: InputMaybe<SortEnumType>;
  toGroups?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type MessageTemplate = {
  __typename?: 'MessageTemplate';
  action?: Maybe<Scalars['String']>;
  cTA?: Maybe<Scalars['String']>;
  cTAText?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  protocol?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  templateType?: Maybe<Scalars['String']>;
  typeCode?: Maybe<Scalars['Int']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type MessageTemplateFilterInput = {
  action?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<MessageTemplateFilterInput>>;
  cTA?: InputMaybe<StringOperationFilterInput>;
  cTAText?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MessageTemplateFilterInput>>;
  ordering?: InputMaybe<ComparableInt32OperationFilterInput>;
  protocol?: InputMaybe<StringOperationFilterInput>;
  subject?: InputMaybe<StringOperationFilterInput>;
  templateType?: InputMaybe<StringOperationFilterInput>;
  typeCode?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MessageTemplateInput = {
  Action?: InputMaybe<Scalars['String']>;
  CTA?: InputMaybe<Scalars['String']>;
  CTAText?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  Ordering: Scalars['Int'];
  Protocol?: InputMaybe<Scalars['String']>;
  Subject?: InputMaybe<Scalars['String']>;
  TemplateType?: InputMaybe<Scalars['String']>;
  TypeCode?: InputMaybe<Scalars['Int']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type MessageTemplateSortInput = {
  action?: InputMaybe<SortEnumType>;
  cTA?: InputMaybe<SortEnumType>;
  cTAText?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  ordering?: InputMaybe<SortEnumType>;
  protocol?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  templateType?: InputMaybe<SortEnumType>;
  typeCode?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type MetricReportStatItem = {
  __typename?: 'MetricReportStatItem';
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type MonthlyAttendanceReportModel = {
  __typename?: 'MonthlyAttendanceReportModel';
  month?: Maybe<Scalars['String']>;
  monthOfYear: Scalars['Int'];
  numberOfSessions: Scalars['Int'];
  percentageAttendance: Scalars['Int'];
  totalScheduledSessions: Scalars['Int'];
  year: Scalars['Int'];
};

export type MoreInformation = {
  __typename?: 'MoreInformation';
  descriptionA?: Maybe<Scalars['String']>;
  descriptionAColor?: Maybe<Scalars['String']>;
  descriptionB?: Maybe<Scalars['String']>;
  descriptionBColor?: Maybe<Scalars['String']>;
  descriptionBIcon?: Maybe<Scalars['String']>;
  descriptionC?: Maybe<Scalars['String']>;
  descriptionCColor?: Maybe<Scalars['String']>;
  descriptionCIcon?: Maybe<Scalars['String']>;
  descriptionD?: Maybe<Scalars['String']>;
  descriptionDColor?: Maybe<Scalars['String']>;
  descriptionDIcon?: Maybe<Scalars['String']>;
  descriptionE?: Maybe<Scalars['String']>;
  descriptionEColor?: Maybe<Scalars['String']>;
  descriptionEIcon?: Maybe<Scalars['String']>;
  headerA?: Maybe<Scalars['String']>;
  headerB?: Maybe<Scalars['String']>;
  headerC?: Maybe<Scalars['String']>;
  headerD?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  infoBoxDescription?: Maybe<Scalars['String']>;
  infoBoxIcon?: Maybe<Scalars['String']>;
  infoBoxTitle?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  showDividerA?: Maybe<Scalars['String']>;
  showDividerB?: Maybe<Scalars['String']>;
  showDividerC?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type MoreInformationInput = {
  descriptionA?: InputMaybe<Scalars['String']>;
  descriptionAColor?: InputMaybe<Scalars['String']>;
  descriptionB?: InputMaybe<Scalars['String']>;
  descriptionBColor?: InputMaybe<Scalars['String']>;
  descriptionBIcon?: InputMaybe<Scalars['String']>;
  descriptionC?: InputMaybe<Scalars['String']>;
  descriptionCColor?: InputMaybe<Scalars['String']>;
  descriptionCIcon?: InputMaybe<Scalars['String']>;
  descriptionD?: InputMaybe<Scalars['String']>;
  descriptionDColor?: InputMaybe<Scalars['String']>;
  descriptionDIcon?: InputMaybe<Scalars['String']>;
  descriptionE?: InputMaybe<Scalars['String']>;
  descriptionEColor?: InputMaybe<Scalars['String']>;
  descriptionEIcon?: InputMaybe<Scalars['String']>;
  headerA?: InputMaybe<Scalars['String']>;
  headerB?: InputMaybe<Scalars['String']>;
  headerC?: InputMaybe<Scalars['String']>;
  headerD?: InputMaybe<Scalars['String']>;
  infoBoxDescription?: InputMaybe<Scalars['String']>;
  infoBoxIcon?: InputMaybe<Scalars['String']>;
  infoBoxTitle?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  showDividerA?: InputMaybe<Scalars['String']>;
  showDividerB?: InputMaybe<Scalars['String']>;
  showDividerC?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  visit?: InputMaybe<Scalars['String']>;
};

export type Mother = {
  __typename?: 'Mother';
  age?: Maybe<Scalars['String']>;
  caregiver?: Maybe<Caregiver>;
  clickedContactTab?: Maybe<Scalars['Boolean']>;
  clickedProgressTab?: Maybe<Scalars['Boolean']>;
  clickedReferralsTab?: Maybe<Scalars['Boolean']>;
  clickedVisitTab?: Maybe<Scalars['Boolean']>;
  expectedDateOfDelivery?: Maybe<Scalars['DateTime']>;
  healthCareWorker?: Maybe<HealthCareWorker>;
  healthCareWorkerId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  linkedCaregiverId?: Maybe<Scalars['UUID']>;
  nextVisitDate?: Maybe<Scalars['DateTime']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  statusInfo?: Maybe<DisplaySet>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type MotherFilterInput = {
  age?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<MotherFilterInput>>;
  caregiver?: InputMaybe<CaregiverFilterInput>;
  clickedContactTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedProgressTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedReferralsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedVisitTab?: InputMaybe<BooleanOperationFilterInput>;
  expectedDateOfDelivery?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedCaregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  nextVisitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<MotherFilterInput>>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  statusInfo?: InputMaybe<DisplaySetFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  whatsAppNumber?: InputMaybe<StringOperationFilterInput>;
};

export type MotherInput = {
  Age?: InputMaybe<Scalars['String']>;
  Caregiver?: InputMaybe<CaregiverInput>;
  ClickedContactTab?: InputMaybe<Scalars['Boolean']>;
  ClickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  ClickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  ExpectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  HealthCareWorker?: InputMaybe<HealthCareWorkerInput>;
  HealthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LinkedCaregiverId?: InputMaybe<Scalars['UUID']>;
  NextVisitDate?: InputMaybe<Scalars['DateTime']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StatusInfo?: InputMaybe<DisplaySetInput>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  WhatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type MotherModelInput = {
  age?: InputMaybe<Scalars['String']>;
  clickedContactTab?: InputMaybe<Scalars['Boolean']>;
  clickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  clickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  clickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  expectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  firstName?: InputMaybe<Scalars['String']>;
  healthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  linkedCaregiverId?: InputMaybe<Scalars['UUID']>;
  linkedInfantId?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  relation?: InputMaybe<RelationInput>;
  relationId?: InputMaybe<Scalars['UUID']>;
  siteAddress?: InputMaybe<SiteAddressInput>;
  siteAddressId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type MotherSortInput = {
  age?: InputMaybe<SortEnumType>;
  caregiver?: InputMaybe<CaregiverSortInput>;
  clickedContactTab?: InputMaybe<SortEnumType>;
  clickedProgressTab?: InputMaybe<SortEnumType>;
  clickedReferralsTab?: InputMaybe<SortEnumType>;
  clickedVisitTab?: InputMaybe<SortEnumType>;
  expectedDateOfDelivery?: InputMaybe<SortEnumType>;
  healthCareWorker?: InputMaybe<HealthCareWorkerSortInput>;
  healthCareWorkerId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  linkedCaregiverId?: InputMaybe<SortEnumType>;
  nextVisitDate?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  statusInfo?: InputMaybe<DisplaySetSortInput>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  whatsAppNumber?: InputMaybe<SortEnumType>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptNewClubLeaderRole: Scalars['Boolean'];
  addAbsenteeForPractitioner?: Maybe<Absentees>;
  addAdditionalVisitForInfant?: Maybe<Visit>;
  addAdditionalVisitForMother?: Maybe<Visit>;
  addBeCreativeActivity: Scalars['Boolean'];
  addCaregiverReportBackMeeting: Scalars['Boolean'];
  addChildRegistrationPoints: Scalars['Boolean'];
  addClinic?: Maybe<Clinic>;
  addClubMeeting?: Maybe<ClubMeeting>;
  addCoachCircleMeeting?: Maybe<ClubMeeting>;
  addCoachFranchiseeAgreementForTrainee?: Maybe<Visit>;
  addCoachToFranchisor?: Maybe<Coach>;
  addCoachVisitData: Scalars['Boolean'];
  addCoachVisitInviteForPractitioner?: Maybe<Visit>;
  addCoachVisitInviteForTrainee?: Maybe<Visit>;
  addDistrict?: Maybe<District>;
  addEventRecord?: Maybe<EventRecord>;
  addEventRecordType?: Maybe<EventRecordType>;
  addFamilyDayMeeting?: Maybe<ClubMeeting>;
  addFollowUpVisitForPractitioner?: Maybe<Visit>;
  addHealthCareWorker?: Maybe<HealthCareWorkerModel>;
  addInfant?: Maybe<Infant>;
  addMother?: Maybe<Mother>;
  addNewClub?: Maybe<Club>;
  addNewClubLeader?: Maybe<ClubLeader>;
  addNewClubMembers: Scalars['Boolean'];
  addPermissionsToNavigation: Scalars['Boolean'];
  addPermissionsToRole: Scalars['Boolean'];
  addPractitionerToCoach?: Maybe<Practitioner>;
  addPractitionerToPrincipal?: Maybe<Practitioner>;
  addReAccreditationFollowUpVisitForPractitioner?: Maybe<Visit>;
  addReAccreditationVisitForPractitioner?: Maybe<Visit>;
  addReassignmentForPractitionerService: Scalars['Boolean'];
  addRole?: Maybe<ApplicationIdentityRole>;
  addSSChecklistForTrainee?: Maybe<Visit>;
  addSelfAssessmentForPractitioner?: Maybe<Visit>;
  addSmartSpaceLicenseForTrainee?: Maybe<License>;
  addStartupSupportAgreementForTrainee?: Maybe<Visit>;
  addSubDistrict?: Maybe<SubDistrict>;
  addSupportVisitData: Scalars['Boolean'];
  addSupportVisitForPractitioner?: Maybe<Visit>;
  addTeamLead?: Maybe<TeamLead>;
  addUser?: Maybe<ApplicationUser>;
  addUsersToRole: Scalars['Boolean'];
  addVisitBackReferral?: Maybe<VisitBackReferral>;
  addVisitData: Scalars['Boolean'];
  autoSubmitStatement?: Maybe<ResultReturnObject>;
  bulkDeleteCoachingCircleTopics?: Maybe<BulkDeactivateResult>;
  bulkDeleteUser?: Maybe<BulkDeactivateResult>;
  bulkUpdateCoachingCircleTopicDates: Scalars['Boolean'];
  bulkUpdateConsentImages: Scalars['Boolean'];
  bulkUpdateProgressTrackingCategoryImages: Scalars['Boolean'];
  bulkUpdateProgressTrackingSubCategoryImages: Scalars['Boolean'];
  calculateCaregiverReportBack: Scalars['Boolean'];
  calculateChildrenRegistrationRemoval: Scalars['Boolean'];
  calculateClubChildAttendance: Scalars['Boolean'];
  calculateLeaveNoOneBehind: Scalars['Boolean'];
  calculateMeetRegularly: Scalars['Boolean'];
  calculateProgressReports: Scalars['Boolean'];
  cancelCalendarEvent?: Maybe<CalendarEvent>;
  cancelRemovalFromProgramme: Scalars['Boolean'];
  changeClubName?: Maybe<Club>;
  changeClubSupportRole: Scalars['Boolean'];
  contentTypeImport: Scalars['Boolean'];
  correctDuplicateHierarchies: Scalars['Boolean'];
  createAbsentees?: Maybe<Absentees>;
  createActivity?: Maybe<Scalars['String']>;
  createAuditLogType?: Maybe<AuditLogType>;
  createCalendarEvent?: Maybe<CalendarEvent>;
  createCalendarEventParticipant?: Maybe<CalendarEventParticipant>;
  createCalendarEventType?: Maybe<Scalars['String']>;
  createCaregiver?: Maybe<Caregiver>;
  createChild?: Maybe<Child>;
  createChildProgressReport?: Maybe<ChildProgressReport>;
  createClassProgramme?: Maybe<ClassProgramme>;
  createClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  createClassroom?: Maybe<Classroom>;
  createClassroomGroup?: Maybe<ClassroomGroup>;
  createClinic?: Maybe<Clinic>;
  createClinicLeague?: Maybe<ClinicLeague>;
  createClinicTeamLead?: Maybe<ClinicTeamLead>;
  createClub?: Maybe<Club>;
  createClubActivityUpload?: Maybe<ClubActivityUpload>;
  createClubActivityUploadType?: Maybe<ClubActivityUploadType>;
  createClubLeader?: Maybe<ClubLeader>;
  createClubMeeting?: Maybe<ClubMeeting>;
  createClubMeetingRegister?: Maybe<ClubMeetingRegister>;
  createClubMember?: Maybe<ClubMember>;
  createClubPoints?: Maybe<ClubPoints>;
  createClubPointsLibrary?: Maybe<ClubPointsLibrary>;
  createClubSupport?: Maybe<ClubSupport>;
  createCoach?: Maybe<Coach>;
  createCoachingCircleTopics?: Maybe<Scalars['String']>;
  createConnect?: Maybe<Scalars['String']>;
  createConnectItem?: Maybe<Scalars['String']>;
  createConsent?: Maybe<Scalars['String']>;
  createContentDefinition?: Maybe<ContentDefinitionModel>;
  createDailyProgramme?: Maybe<DailyProgramme>;
  createDistrict?: Maybe<District>;
  createDocument?: Maybe<Document>;
  createDocumentType?: Maybe<DocumentType>;
  createEducation?: Maybe<Education>;
  createEventRecord?: Maybe<EventRecord>;
  createEventRecordType?: Maybe<EventRecordType>;
  createFranchisor?: Maybe<Franchisor>;
  createGender?: Maybe<Gender>;
  createGrant?: Maybe<Grant>;
  createHealthCareWorker?: Maybe<HealthCareWorker>;
  createHealthPromotion?: Maybe<Scalars['String']>;
  createHierarchyEntity?: Maybe<HierarchyEntity>;
  createIncomeStatements?: Maybe<Scalars['String']>;
  createInfant?: Maybe<Infant>;
  createInfographics?: Maybe<Scalars['String']>;
  createIntegrationAudit?: Maybe<IntegrationAudit>;
  createIntegrationColumnMapping?: Maybe<IntegrationColumnMapping>;
  createIntegrationEntityMapping?: Maybe<IntegrationEntityMapping>;
  createIntegrationLog?: Maybe<IntegrationLog>;
  createLanguage?: Maybe<Language>;
  createLeague?: Maybe<League>;
  createLeagueType?: Maybe<LeagueType>;
  createLearner?: Maybe<Learner>;
  createLicense?: Maybe<License>;
  createLicenseType?: Maybe<LicenseType>;
  createMeetingType?: Maybe<MeetingType>;
  createMessageLog?: Maybe<MessageLog>;
  createMessageTemplate?: Maybe<MessageTemplate>;
  createMoreInformation?: Maybe<Scalars['String']>;
  createMother?: Maybe<Mother>;
  createNavigation?: Maybe<Navigation>;
  createNote?: Maybe<Note>;
  createNoteType?: Maybe<NoteType>;
  createPQA?: Maybe<Pqa>;
  createPQARating?: Maybe<PqaRating>;
  createPQASectionRating?: Maybe<PqaSectionRating>;
  createPermission?: Maybe<Permission>;
  createPointsLibrary?: Maybe<PointsLibrary>;
  createPointsUser?: Maybe<PointsUser>;
  createPointsUserSummary?: Maybe<PointsUserSummary>;
  createPractitioner?: Maybe<Practitioner>;
  createPractitionerRemovalHistory?: Maybe<PractitionerRemovalHistory>;
  createPrincipal?: Maybe<Principal>;
  createProgramme?: Maybe<Programme>;
  createProgrammeAttendanceReason?: Maybe<ProgrammeAttendanceReason>;
  createProgrammeRoutine?: Maybe<Scalars['String']>;
  createProgrammeRoutineItem?: Maybe<Scalars['String']>;
  createProgrammeRoutineSubItem?: Maybe<Scalars['String']>;
  createProgrammeType?: Maybe<ProgrammeType>;
  createProgressTrackingCategory?: Maybe<Scalars['String']>;
  createProgressTrackingLevel?: Maybe<Scalars['String']>;
  createProgressTrackingSkill?: Maybe<Scalars['String']>;
  createProgressTrackingSubCategory?: Maybe<Scalars['String']>;
  createProvince?: Maybe<Province>;
  createRace?: Maybe<Race>;
  createReasonForLeaving?: Maybe<ReasonForLeaving>;
  createReasonForPractitionerLeaving?: Maybe<ReasonForPractitionerLeaving>;
  createReasonForPractitionerLeavingProgramme?: Maybe<ReasonForPractitionerLeavingProgramme>;
  createRelation?: Maybe<Relation>;
  createShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  createSiteAddress?: Maybe<SiteAddress>;
  createSmartSpaceVisit?: Maybe<SmartSpaceVisit>;
  createStatementsContributionType?: Maybe<StatementsContributionType>;
  createStatementsExpenseType?: Maybe<StatementsExpenseType>;
  createStatementsExpenses?: Maybe<StatementsExpenses>;
  createStatementsFeeType?: Maybe<StatementsFeeType>;
  createStatementsIncome?: Maybe<StatementsIncome>;
  createStatementsIncomeStatement?: Maybe<StatementsIncomeStatement>;
  createStatementsIncomeType?: Maybe<StatementsIncomeType>;
  createStatementsPayType?: Maybe<StatementsPayType>;
  createStatementsStartupSupport?: Maybe<StatementsStartupSupport>;
  createStoryBook?: Maybe<Scalars['String']>;
  createStoryBookPartQuestion?: Maybe<Scalars['String']>;
  createStoryBookParts?: Maybe<Scalars['String']>;
  createSubDistrict?: Maybe<SubDistrict>;
  createSystemSetting?: Maybe<SystemSetting>;
  createTeamLead?: Maybe<TeamLead>;
  createTheme?: Maybe<Scalars['String']>;
  createThemeDay?: Maybe<Scalars['String']>;
  createTrainee?: Maybe<Trainee>;
  createUserConsent?: Maybe<UserConsent>;
  createUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  createVisit?: Maybe<Visit>;
  createVisitBackReferral?: Maybe<VisitBackReferral>;
  createVisitData?: Maybe<VisitData>;
  createVisitDataStatus?: Maybe<VisitDataStatus>;
  createVisitGrowthDataDay?: Maybe<VisitGrowthDataDay>;
  createVisitGrowthDataHeight?: Maybe<VisitGrowthDataHeight>;
  createVisitType?: Maybe<VisitType>;
  createVisitVideos?: Maybe<Scalars['String']>;
  createWorkflowStatus?: Maybe<WorkflowStatus>;
  createWorkflowStatusType?: Maybe<WorkflowStatusType>;
  deActivatePractitioner: Scalars['Boolean'];
  deleteAbsentees?: Maybe<Scalars['Boolean']>;
  deleteActivity?: Maybe<Scalars['Boolean']>;
  deleteAuditLogType?: Maybe<Scalars['Boolean']>;
  deleteCalendarEvent?: Maybe<Scalars['Boolean']>;
  deleteCalendarEventParticipant?: Maybe<Scalars['Boolean']>;
  deleteCalendarEventType?: Maybe<Scalars['Boolean']>;
  deleteCaregiver?: Maybe<Scalars['Boolean']>;
  deleteChild?: Maybe<Scalars['Boolean']>;
  deleteChildProgressReport?: Maybe<Scalars['Boolean']>;
  deleteClassProgramme?: Maybe<Scalars['Boolean']>;
  deleteClassReassignmentHistory?: Maybe<Scalars['Boolean']>;
  deleteClassroom?: Maybe<Scalars['Boolean']>;
  deleteClassroomGroup?: Maybe<Scalars['Boolean']>;
  deleteClinic?: Maybe<Scalars['Boolean']>;
  deleteClinicLeague?: Maybe<Scalars['Boolean']>;
  deleteClinicTeamLead?: Maybe<Scalars['Boolean']>;
  deleteClub?: Maybe<Scalars['Boolean']>;
  deleteClubActivityUpload?: Maybe<Scalars['Boolean']>;
  deleteClubActivityUploadType?: Maybe<Scalars['Boolean']>;
  deleteClubLeader?: Maybe<Scalars['Boolean']>;
  deleteClubMeeting?: Maybe<Scalars['Boolean']>;
  deleteClubMeetingRegister?: Maybe<Scalars['Boolean']>;
  deleteClubMember?: Maybe<Scalars['Boolean']>;
  deleteClubPoints?: Maybe<Scalars['Boolean']>;
  deleteClubPointsLibrary?: Maybe<Scalars['Boolean']>;
  deleteClubSupport?: Maybe<Scalars['Boolean']>;
  deleteCoach?: Maybe<Scalars['Boolean']>;
  deleteCoachForFranchisor?: Maybe<Coach>;
  deleteCoachingCircleTopics?: Maybe<Scalars['Boolean']>;
  deleteConnect?: Maybe<Scalars['Boolean']>;
  deleteConnectItem?: Maybe<Scalars['Boolean']>;
  deleteConsent?: Maybe<Scalars['Boolean']>;
  deleteContentDefinition: Scalars['Boolean'];
  deleteDailyProgramme?: Maybe<Scalars['Boolean']>;
  deleteDistrict?: Maybe<Scalars['Boolean']>;
  deleteDocument?: Maybe<Scalars['Boolean']>;
  deleteDocumentType?: Maybe<Scalars['Boolean']>;
  deleteEducation?: Maybe<Scalars['Boolean']>;
  deleteEventRecord?: Maybe<Scalars['Boolean']>;
  deleteEventRecordType?: Maybe<Scalars['Boolean']>;
  deleteFranchisor?: Maybe<Scalars['Boolean']>;
  deleteGender?: Maybe<Scalars['Boolean']>;
  deleteGrant?: Maybe<Scalars['Boolean']>;
  deleteHealthCareWorker?: Maybe<Scalars['Boolean']>;
  deleteHealthPromotion?: Maybe<Scalars['Boolean']>;
  deleteHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteIncomeStatements?: Maybe<Scalars['Boolean']>;
  deleteInfant?: Maybe<Scalars['Boolean']>;
  deleteInfographics?: Maybe<Scalars['Boolean']>;
  deleteIntegrationAudit?: Maybe<Scalars['Boolean']>;
  deleteIntegrationColumnMapping?: Maybe<Scalars['Boolean']>;
  deleteIntegrationEntityMapping?: Maybe<Scalars['Boolean']>;
  deleteIntegrationLog?: Maybe<Scalars['Boolean']>;
  deleteLanguage?: Maybe<Scalars['Boolean']>;
  deleteLeague?: Maybe<Scalars['Boolean']>;
  deleteLeagueType?: Maybe<Scalars['Boolean']>;
  deleteLearner?: Maybe<Scalars['Boolean']>;
  deleteLicense?: Maybe<Scalars['Boolean']>;
  deleteLicenseType?: Maybe<Scalars['Boolean']>;
  deleteMeetingType?: Maybe<Scalars['Boolean']>;
  deleteMessageLog?: Maybe<Scalars['Boolean']>;
  deleteMessageTemplate?: Maybe<Scalars['Boolean']>;
  deleteMoreInformation?: Maybe<Scalars['Boolean']>;
  deleteMother?: Maybe<Scalars['Boolean']>;
  deleteNavigation?: Maybe<Scalars['Boolean']>;
  deleteNote?: Maybe<Scalars['Boolean']>;
  deleteNoteType?: Maybe<Scalars['Boolean']>;
  deletePQA?: Maybe<Scalars['Boolean']>;
  deletePQARating?: Maybe<Scalars['Boolean']>;
  deletePQASectionRating?: Maybe<Scalars['Boolean']>;
  deletePermission?: Maybe<Scalars['Boolean']>;
  deletePointsLibrary?: Maybe<Scalars['Boolean']>;
  deletePointsUser?: Maybe<Scalars['Boolean']>;
  deletePointsUserSummary?: Maybe<Scalars['Boolean']>;
  deletePractitioner?: Maybe<Scalars['Boolean']>;
  deletePractitionerForCoach?: Maybe<Practitioner>;
  deletePractitionerFromPrincipal?: Maybe<Practitioner>;
  deletePractitionerRemovalHistory?: Maybe<Scalars['Boolean']>;
  deletePrincipal?: Maybe<Scalars['Boolean']>;
  deleteProgramme?: Maybe<Scalars['Boolean']>;
  deleteProgrammeAttendanceReason?: Maybe<Scalars['Boolean']>;
  deleteProgrammeRoutine?: Maybe<Scalars['Boolean']>;
  deleteProgrammeRoutineItem?: Maybe<Scalars['Boolean']>;
  deleteProgrammeRoutineSubItem?: Maybe<Scalars['Boolean']>;
  deleteProgrammeType?: Maybe<Scalars['Boolean']>;
  deleteProgressTrackingCategory?: Maybe<Scalars['Boolean']>;
  deleteProgressTrackingLevel?: Maybe<Scalars['Boolean']>;
  deleteProgressTrackingSkill?: Maybe<Scalars['Boolean']>;
  deleteProgressTrackingSubCategory?: Maybe<Scalars['Boolean']>;
  deleteProvince?: Maybe<Scalars['Boolean']>;
  deleteRace?: Maybe<Scalars['Boolean']>;
  deleteReasonForLeaving?: Maybe<Scalars['Boolean']>;
  deleteReasonForPractitionerLeaving?: Maybe<Scalars['Boolean']>;
  deleteReasonForPractitionerLeavingProgramme?: Maybe<Scalars['Boolean']>;
  deleteRelation?: Maybe<Scalars['Boolean']>;
  deleteRole: Scalars['Boolean'];
  deleteShortenUrlEntity?: Maybe<Scalars['Boolean']>;
  deleteSiteAddress?: Maybe<Scalars['Boolean']>;
  deleteSmartSpaceVisit?: Maybe<Scalars['Boolean']>;
  deleteStatementsContributionType?: Maybe<Scalars['Boolean']>;
  deleteStatementsExpenseType?: Maybe<Scalars['Boolean']>;
  deleteStatementsExpenses?: Maybe<Scalars['Boolean']>;
  deleteStatementsFeeType?: Maybe<Scalars['Boolean']>;
  deleteStatementsIncome?: Maybe<Scalars['Boolean']>;
  deleteStatementsIncomeStatement?: Maybe<Scalars['Boolean']>;
  deleteStatementsIncomeType?: Maybe<Scalars['Boolean']>;
  deleteStatementsPayType?: Maybe<Scalars['Boolean']>;
  deleteStatementsStartupSupport?: Maybe<Scalars['Boolean']>;
  deleteStoryBook?: Maybe<Scalars['Boolean']>;
  deleteStoryBookPartQuestion?: Maybe<Scalars['Boolean']>;
  deleteStoryBookParts?: Maybe<Scalars['Boolean']>;
  deleteSubDistrict?: Maybe<Scalars['Boolean']>;
  deleteSystemSetting?: Maybe<Scalars['Boolean']>;
  deleteTeamLead?: Maybe<Scalars['Boolean']>;
  deleteTheme?: Maybe<Scalars['Boolean']>;
  deleteThemeDay?: Maybe<Scalars['Boolean']>;
  deleteTrainee?: Maybe<Scalars['Boolean']>;
  deleteUser: Scalars['Boolean'];
  deleteUserConsent?: Maybe<Scalars['Boolean']>;
  deleteUserHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteVisit?: Maybe<Scalars['Boolean']>;
  deleteVisitBackReferral?: Maybe<Scalars['Boolean']>;
  deleteVisitData?: Maybe<Scalars['Boolean']>;
  deleteVisitDataStatus?: Maybe<Scalars['Boolean']>;
  deleteVisitGrowthDataDay?: Maybe<Scalars['Boolean']>;
  deleteVisitGrowthDataHeight?: Maybe<Scalars['Boolean']>;
  deleteVisitType?: Maybe<Scalars['Boolean']>;
  deleteVisitVideos?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatus?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatusType?: Maybe<Scalars['Boolean']>;
  delicensePractitioner: Scalars['Boolean'];
  demotePractitionerAsPrincipal?: Maybe<Practitioner>;
  disableNotification: Scalars['Boolean'];
  editAbsentee?: Maybe<Absentees>;
  editDistrict?: Maybe<District>;
  editSubDistrict?: Maybe<SubDistrict>;
  editVisitData: Scalars['Boolean'];
  expireNotification: Scalars['Boolean'];
  expireNotificationsTypesForUser: Scalars['Boolean'];
  expireRelationshipLinksService: Scalars['Boolean'];
  fileUpload?: Maybe<DocumentModel>;
  gGBottom75PercPointsTeam: Scalars['Boolean'];
  generateCaregiverChildToken?: Maybe<Scalars['String']>;
  importHealthCareWorkers?: Maybe<UserImportModel>;
  importTeamLeads?: Maybe<UserImportModel>;
  integrationAttendanceByDueData: Scalars['Boolean'];
  integrationByFranchisees: Scalars['Boolean'];
  integrationByMappedCoach: Scalars['Boolean'];
  integrationByNewCoach: Scalars['Boolean'];
  integrationByTrainees: Scalars['Boolean'];
  integrationClubsData: Scalars['Boolean'];
  integrationLeagueData: Scalars['Boolean'];
  integrationMonthlyAttendancePdf: Scalars['Boolean'];
  integrationPQASmartSpaceVisitsData: Scalars['Boolean'];
  integrationStatementsData: Scalars['Boolean'];
  integrationUpdates: Scalars['Boolean'];
  markAsReadNotification: Scalars['Boolean'];
  moveClubMembers: Scalars['Boolean'];
  openAccessAddChild: Scalars['Boolean'];
  promotePractitionerToPrincipal?: Maybe<Principal>;
  pushChildProgressReports: Scalars['Boolean'];
  pushPQAData: Scalars['Boolean'];
  pushReAccreditationData: Scalars['Boolean'];
  pushSmartSpaceVisitsData: Scalars['Boolean'];
  reassignAbsenteeFromHistory: Scalars['Boolean'];
  reassignAbsentees: Scalars['Boolean'];
  reassignAllClassroomsFromHistoryService: Scalars['Boolean'];
  reassignClassroomsFromHistoryService: Scalars['Boolean'];
  refreshCaregiverChildToken?: Maybe<Scalars['String']>;
  rejectNewClubLeaderRole: Scalars['Boolean'];
  remapPrincipalToPrincipal?: Maybe<Practitioner>;
  removeFromProgramme: Scalars['Boolean'];
  removePermissionsFromNavigation: Scalars['Boolean'];
  removePermissionsFromRole: Scalars['Boolean'];
  removePractitioner: Scalars['Boolean'];
  removeUserFromRoles: Scalars['Boolean'];
  resetUserPassword: Scalars['Boolean'];
  saveBulkMessagesForAdmin: Scalars['Boolean'];
  saveWelcomeMessage: Scalars['Boolean'];
  scheduleConsolidationMeetingDate?: Maybe<Trainee>;
  sendAllProgressReportsCompletedForClassNotification: Scalars['Boolean'];
  sendAnyGGNotification: Scalars['Boolean'];
  sendAnyGGNotificationWithReplacements: Scalars['Boolean'];
  sendAnyNotification: Scalars['Boolean'];
  sendAnyNotificationWithReplacements: Scalars['Boolean'];
  sendBulkInviteToApp?: Maybe<BulkInvitationResult>;
  sendBulkInviteToPortal?: Maybe<BulkInvitationResult>;
  sendClubleaderRoleAssignedNotification: Scalars['Boolean'];
  sendCoachAddresUpdatedScheduleVisitNotification: Scalars['Boolean'];
  sendCoachInviteToApplication: Scalars['Boolean'];
  sendCoachNewTraineesNotification: Scalars['Boolean'];
  sendCoachRemoveTraineeNotification: Scalars['Boolean'];
  sendCoachTraineeReadySmartspaceCheckNotification: Scalars['Boolean'];
  sendCoachVisitRequestedNotification: Scalars['Boolean'];
  sendCoachVisitsOverdueNotification: Scalars['Boolean'];
  sendDemotedAsPrincipalFAAProgrammeNotification: Scalars['Boolean'];
  sendEndofyearPointEarnedNotification: Scalars['Boolean'];
  sendFillInSelfAsessmentFormNotification: Scalars['Boolean'];
  sendGGAddBreastfeedingClubNotification: Scalars['Boolean'];
  sendGGBronzeTierPointsTeamNotification: Scalars['Boolean'];
  sendGGChildGrowthIssueNotification: Scalars['Boolean'];
  sendGGChildMUACMalnutritionNotification: Scalars['Boolean'];
  sendGGChildMUACNotification: Scalars['Boolean'];
  sendGGChildOlderThanFiveNotification: Scalars['Boolean'];
  sendGGClinicVisitsNotUpToDateNotification: Scalars['Boolean'];
  sendGGEarningPointsNotification: Scalars['Boolean'];
  sendGGEarningXPointsNotification: Scalars['Boolean'];
  sendGGExpectedMomDeliveryDateApproachingNotification: Scalars['Boolean'];
  sendGGGGAddedABreastfeedingClubNotification: Scalars['Boolean'];
  sendGGGoldTierPointsTeamNotification: Scalars['Boolean'];
  sendGGLowBirthWeightNotification: Scalars['Boolean'];
  sendGGMaternalDistressNotification: Scalars['Boolean'];
  sendGGMultipleReferralsNotification: Scalars['Boolean'];
  sendGGPointsTeamPlacementNotBottom75PercNotification: Scalars['Boolean'];
  sendGGPointsTeamPlacementNotTop3Notification: Scalars['Boolean'];
  sendGGPointsTeamPlacementNotification: Scalars['Boolean'];
  sendGGPointsYearlySummaryNotification: Scalars['Boolean'];
  sendGGPregnantMomLowMUACNotification: Scalars['Boolean'];
  sendGGRedAlertMaternalDistressNotification: Scalars['Boolean'];
  sendGGReferDOHANotification: Scalars['Boolean'];
  sendGGReferSASSANotification: Scalars['Boolean'];
  sendGGReferralDangerSignsNotification: Scalars['Boolean'];
  sendGGSilverTierPointsTeamNotification: Scalars['Boolean'];
  sendGGSubstanceAbuseNotification: Scalars['Boolean'];
  sendGGTop25PercPointsTeamNotification: Scalars['Boolean'];
  sendGGTopPointsEarnerNotification: Scalars['Boolean'];
  sendGGTopPointsTeamNotification: Scalars['Boolean'];
  sendGGTwoVisitsMissedNotification: Scalars['Boolean'];
  sendGGUploadRTHNotification: Scalars['Boolean'];
  sendGGVisitOverdueNotification: Scalars['Boolean'];
  sendGGVisitsNotCompleted14daysNotification: Scalars['Boolean'];
  sendGGWalkthroughNotificationNotification: Scalars['Boolean'];
  sendGGXVisitsMissedNotification: Scalars['Boolean'];
  sendGGyoungerthan20Notification: Scalars['Boolean'];
  sendGainedCommunitySupportNotification: Scalars['Boolean'];
  sendInviteToApplication: Scalars['Boolean'];
  sendNewClubleaderNotification: Scalars['Boolean'];
  sendNotificationToUser: Scalars['Boolean'];
  sendOnly2MoreTraineeTaskLeftsNotification: Scalars['Boolean'];
  sendOverdueTraineeTasksNotification: Scalars['Boolean'];
  sendPractitionerAddedToProgrammeNotification: Scalars['Boolean'];
  sendPractitionerInviteToApplication: Scalars['Boolean'];
  sendPractitionerNotAssignedToProgrammeNotification: Scalars['Boolean'];
  sendPractitionerRemovedFromProgrammeNotification: Scalars['Boolean'];
  sendPrincipalAllReportsDoneNotification: Scalars['Boolean'];
  sendPrincipalChangedNotification: Scalars['Boolean'];
  sendPrincipalMovedToProgrammeNotification: Scalars['Boolean'];
  sendPrincipalReportDeadlinePassedNotification: Scalars['Boolean'];
  sendProgressreportsNotCreatedNotification: Scalars['Boolean'];
  sendPromotedToPrincipalFAAProgrammeNotification: Scalars['Boolean'];
  sendRecordCaregiverMeetingNotification: Scalars['Boolean'];
  sendRegisterThreeChildrenNotification: Scalars['Boolean'];
  sendRemovedFromProgrammeNotification: Scalars['Boolean'];
  sendReportDeadlinePassedNotification: Scalars['Boolean'];
  sendSetAbsenteeNotification: Scalars['Boolean'];
  sendSetLeaveNotification: Scalars['Boolean'];
  sendTopSmartStarterPointsNotification: Scalars['Boolean'];
  sendTrainee2WeekOnboardingWarningNotification: Scalars['Boolean'];
  sendTraineeJourneyStartSelfNotification: Scalars['Boolean'];
  sendTraineeSetupVenueNotification: Scalars['Boolean'];
  sendTraineeSignAgreementNotification: Scalars['Boolean'];
  sendTraineeSignStartupSupportAgreementNotification: Scalars['Boolean'];
  sendUpdateFeeNotification: Scalars['Boolean'];
  sendUserAddedToClubNotification: Scalars['Boolean'];
  sendUserAssignedToClassFromOldClassNotification: Scalars['Boolean'];
  sendUserAssignedToClassNotification: Scalars['Boolean'];
  setContactClubLeaderStatusForMeeting?: Maybe<ClubMeeting>;
  submitMonthlyStatement?: Maybe<IncomeStatementModel>;
  switchPrincipal: Scalars['Boolean'];
  testPointEngine: Scalars['Boolean'];
  trackAttendance: Scalars['Boolean'];
  updateAbsentees?: Maybe<Absentees>;
  updateActivity?: Maybe<Activity>;
  updateAuditLogType?: Maybe<AuditLogType>;
  updateCalendarEvent?: Maybe<CalendarEvent>;
  updateCalendarEventParticipant?: Maybe<CalendarEventParticipant>;
  updateCalendarEventType?: Maybe<CalendarEventType>;
  updateCareGiverGrants: Scalars['Boolean'];
  updateCaregiver?: Maybe<Caregiver>;
  updateChild?: Maybe<Child>;
  updateChildProgressReport?: Maybe<ChildProgressReport>;
  updateClassProgramme?: Maybe<ClassProgramme>;
  updateClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  updateClassroom?: Maybe<Classroom>;
  updateClassroomGroup?: Maybe<ClassroomGroup>;
  updateClassroomSiteAddress?: Maybe<Classroom>;
  updateClinic?: Maybe<Clinic>;
  updateClinicLeague?: Maybe<ClinicLeague>;
  updateClinicTeamLead?: Maybe<ClinicTeamLead>;
  updateClub?: Maybe<Club>;
  updateClubActivityUpload?: Maybe<ClubActivityUpload>;
  updateClubActivityUploadType?: Maybe<ClubActivityUploadType>;
  updateClubLeader?: Maybe<ClubLeader>;
  updateClubMeeting?: Maybe<ClubMeeting>;
  updateClubMeetingRegister?: Maybe<ClubMeetingRegister>;
  updateClubMember?: Maybe<ClubMember>;
  updateClubPoints?: Maybe<ClubPoints>;
  updateClubPointsLibrary?: Maybe<ClubPointsLibrary>;
  updateClubSupport?: Maybe<ClubSupport>;
  updateClubSupportStatus?: Maybe<ClubSupport>;
  updateCoach?: Maybe<Coach>;
  updateCoachAboutInfo?: Maybe<Coach>;
  updateCoachClubClicked: Scalars['Boolean'];
  updateCoachingCircleTopics?: Maybe<CoachingCircleTopics>;
  updateCommunitySupport?: Maybe<Trainee>;
  updateConnect?: Maybe<Connect>;
  updateConnectItem?: Maybe<ConnectItem>;
  updateConnectSection: Scalars['Boolean'];
  updateConsent?: Maybe<Consent>;
  updateDailyProgramme?: Maybe<DailyProgramme>;
  updateDistrict?: Maybe<District>;
  updateDocument?: Maybe<Document>;
  updateDocumentType?: Maybe<DocumentType>;
  updateEducation?: Maybe<Education>;
  updateEventRecord?: Maybe<EventRecord>;
  updateEventRecordType?: Maybe<EventRecordType>;
  updateExpense?: Maybe<ExpenseItemModel>;
  updateFranchisor?: Maybe<Franchisor>;
  updateGender?: Maybe<Gender>;
  updateGrant?: Maybe<Grant>;
  updateHealthCareWorker?: Maybe<HealthCareWorkerModel>;
  updateHealthCareWorkerTabs?: Maybe<HealthCareWorkerModel>;
  updateHealthCareWorkerWelcomeMessage?: Maybe<HealthCareWorkerModel>;
  updateHealthPromotion?: Maybe<HealthPromotion>;
  updateHierarchyEntity?: Maybe<HierarchyEntity>;
  updateIncome?: Maybe<IncomeItemModel>;
  updateIncomeStatements?: Maybe<IncomeStatements>;
  updateInfant?: Maybe<Infant>;
  updateInfantCaregiver?: Maybe<Infant>;
  updateInfantCaregiverAddress?: Maybe<Infant>;
  updateInfantCaregiverContactDetails?: Maybe<Infant>;
  updateInfographics?: Maybe<Infographics>;
  updateIntegrationAudit?: Maybe<IntegrationAudit>;
  updateIntegrationColumnMapping?: Maybe<IntegrationColumnMapping>;
  updateIntegrationEntityMapping?: Maybe<IntegrationEntityMapping>;
  updateIntegrationLog?: Maybe<IntegrationLog>;
  updateLanguage?: Maybe<Language>;
  updateLeague?: Maybe<League>;
  updateLeagueType?: Maybe<LeagueType>;
  updateLearner?: Maybe<Learner>;
  updateLicense?: Maybe<License>;
  updateLicenseType?: Maybe<LicenseType>;
  updateMeetingType?: Maybe<MeetingType>;
  updateMessageLog?: Maybe<MessageLog>;
  updateMessageTemplate?: Maybe<MessageTemplate>;
  updateMoreInformation?: Maybe<MoreInformation>;
  updateMother?: Maybe<Mother>;
  updateMotherAddress?: Maybe<Mother>;
  updateMotherContactDetails?: Maybe<Mother>;
  updateMotherDeliveryDate?: Maybe<Mother>;
  updateNavigation?: Maybe<Navigation>;
  updateNewMemberStatus: Scalars['Boolean'];
  updateNote?: Maybe<Note>;
  updateNoteType?: Maybe<NoteType>;
  updatePQA?: Maybe<Pqa>;
  updatePQARating?: Maybe<PqaRating>;
  updatePQASectionRating?: Maybe<PqaSectionRating>;
  updatePermission?: Maybe<Permission>;
  updatePointsLibrary?: Maybe<PointsLibrary>;
  updatePointsUser?: Maybe<PointsUser>;
  updatePointsUserSummary?: Maybe<PointsUserSummary>;
  updatePractitioner?: Maybe<Practitioner>;
  updatePractitionerBusinessWalkthrough: Scalars['Boolean'];
  updatePractitionerContactInfo?: Maybe<ApplicationUser>;
  updatePractitionerEmergencyContact: Scalars['Boolean'];
  updatePractitionerIsFundaAppAdmin: Scalars['Boolean'];
  updatePractitionerProgress: Scalars['Decimal'];
  updatePractitionerRegistered: Scalars['Boolean'];
  updatePractitionerRemovalHistory?: Maybe<PractitionerRemovalHistory>;
  updatePractitionerShareInfo: Scalars['Boolean'];
  updatePractitionerToTeachClassroom?: Maybe<ClassroomGroup>;
  updatePractitionerUsePhotoInReport?: Maybe<Scalars['String']>;
  updatePreschoolFeeForClassroom: Scalars['Boolean'];
  updatePrincipal?: Maybe<Principal>;
  updatePrincipalInvitation?: Maybe<PrincipalInvitationStatus>;
  updateProgramme?: Maybe<Programme>;
  updateProgrammeAttendanceReason?: Maybe<ProgrammeAttendanceReason>;
  updateProgrammeRoutine?: Maybe<ProgrammeRoutine>;
  updateProgrammeRoutineItem?: Maybe<ProgrammeRoutineItem>;
  updateProgrammeRoutineSubItem?: Maybe<ProgrammeRoutineSubItem>;
  updateProgrammeType?: Maybe<ProgrammeType>;
  updateProgrammes: Scalars['Boolean'];
  updateProgressTrackingCategory?: Maybe<ProgressTrackingCategory>;
  updateProgressTrackingLevel?: Maybe<ProgressTrackingLevel>;
  updateProgressTrackingSkill?: Maybe<ProgressTrackingSkill>;
  updateProgressTrackingSubCategory?: Maybe<ProgressTrackingSubCategory>;
  updateProvince?: Maybe<Province>;
  updateRace?: Maybe<Race>;
  updateReasonForLeaving?: Maybe<ReasonForLeaving>;
  updateReasonForPractitionerLeaving?: Maybe<ReasonForPractitionerLeaving>;
  updateReasonForPractitionerLeavingProgramme?: Maybe<ReasonForPractitionerLeavingProgramme>;
  updateRelation?: Maybe<Relation>;
  updateRemovalFromProgramme: Scalars['Boolean'];
  updateRole?: Maybe<ApplicationIdentityRole>;
  updateShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  updateSiteAddress?: Maybe<SiteAddress>;
  updateSmartSpaceVisit?: Maybe<SmartSpaceVisit>;
  updateStartupSupport?: Maybe<ResultReturnObject>;
  updateStatementsContributionType?: Maybe<StatementsContributionType>;
  updateStatementsExpenseType?: Maybe<StatementsExpenseType>;
  updateStatementsExpenses?: Maybe<StatementsExpenses>;
  updateStatementsFeeType?: Maybe<StatementsFeeType>;
  updateStatementsIncome?: Maybe<StatementsIncome>;
  updateStatementsIncomeStatement?: Maybe<StatementsIncomeStatement>;
  updateStatementsIncomeType?: Maybe<StatementsIncomeType>;
  updateStatementsPayType?: Maybe<StatementsPayType>;
  updateStatementsStartupSupport?: Maybe<StatementsStartupSupport>;
  updateStoryBook?: Maybe<StoryBook>;
  updateStoryBookAndParts: Scalars['Boolean'];
  updateStoryBookPartQuestion?: Maybe<StoryBookPartQuestion>;
  updateStoryBookParts?: Maybe<StoryBookParts>;
  updateSubCategorySkills: Scalars['Boolean'];
  updateSubDistrict?: Maybe<SubDistrict>;
  updateSystemSetting?: Maybe<SystemSetting>;
  updateTeamLead?: Maybe<TeamLead>;
  updateTenantTheme: Scalars['Boolean'];
  updateTheme?: Maybe<Theme>;
  updateThemeDay?: Maybe<ThemeDay>;
  updateTrainee?: Maybe<Trainee>;
  updateTraineeAddress?: Maybe<Trainee>;
  updateUser?: Maybe<ApplicationUser>;
  updateUserConsent?: Maybe<UserConsent>;
  updateUserContactStatusForStatement?: Maybe<StatementsIncomeStatement>;
  updateUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  updateVisit?: Maybe<Visit>;
  updateVisitBackReferral?: Maybe<VisitBackReferral>;
  updateVisitData?: Maybe<VisitData>;
  updateVisitDataStatus: Scalars['Boolean'];
  updateVisitGrowthDataDay?: Maybe<VisitGrowthDataDay>;
  updateVisitGrowthDataHeight?: Maybe<VisitGrowthDataHeight>;
  updateVisitPlannedVisitDate?: Maybe<Visit>;
  updateVisitType?: Maybe<VisitType>;
  updateVisitVideos?: Maybe<VisitVideos>;
  updateWorkflowStatus?: Maybe<WorkflowStatus>;
  updateWorkflowStatusType?: Maybe<WorkflowStatusType>;
  uploadChildProgressReport: Scalars['Boolean'];
};

export type MutationAcceptNewClubLeaderRoleArgs = {
  clubId: Scalars['UUID'];
  clubSupportPractitionerId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
};

export type MutationAddAbsenteeForPractitionerArgs = {
  absentDate: Scalars['DateTime'];
  absentDateEnd?: InputMaybe<Scalars['DateTime']>;
  classProgram?: InputMaybe<Scalars['String']>;
  fromRole?: InputMaybe<Scalars['String']>;
  isRoleAssign?: Scalars['Boolean'];
  loggedByUser?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  reassignedToPractitioner?: InputMaybe<Scalars['String']>;
  roleAssignedToUser?: InputMaybe<Scalars['String']>;
  toRole?: InputMaybe<Scalars['String']>;
};

export type MutationAddAdditionalVisitForInfantArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddAdditionalVisitForMotherArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddBeCreativeActivityArgs = {
  input?: InputMaybe<BeCreativeUploadInput>;
};

export type MutationAddCaregiverReportBackMeetingArgs = {
  clubId: Scalars['UUID'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddChildRegistrationPointsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddClinicArgs = {
  input?: InputMaybe<ClinicModelInput>;
};

export type MutationAddClubMeetingArgs = {
  input?: InputMaybe<ClubMeetingModelInput>;
};

export type MutationAddCoachCircleMeetingArgs = {
  input?: InputMaybe<ClubMeetingModelInput>;
};

export type MutationAddCoachFranchiseeAgreementForTraineeArgs = {
  input?: InputMaybe<SsChecklistVisitModelInput>;
};

export type MutationAddCoachToFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
};

export type MutationAddCoachVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationAddCoachVisitInviteForPractitionerArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddCoachVisitInviteForTraineeArgs = {
  input?: InputMaybe<SsChecklistVisitModelInput>;
};

export type MutationAddDistrictArgs = {
  input?: InputMaybe<DistrictModelInput>;
};

export type MutationAddEventRecordArgs = {
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationAddEventRecordTypeArgs = {
  input?: InputMaybe<EventRecordTypeModelInput>;
};

export type MutationAddFamilyDayMeetingArgs = {
  input?: InputMaybe<ClubMeetingModelInput>;
};

export type MutationAddFollowUpVisitForPractitionerArgs = {
  input?: InputMaybe<FollowUpVisitModelInput>;
};

export type MutationAddHealthCareWorkerArgs = {
  input?: InputMaybe<HealthCareWorkerInputModelInput>;
};

export type MutationAddInfantArgs = {
  input?: InputMaybe<InfantModelInput>;
};

export type MutationAddMotherArgs = {
  input?: InputMaybe<MotherModelInput>;
};

export type MutationAddNewClubArgs = {
  input?: InputMaybe<NewClubInput>;
};

export type MutationAddNewClubLeaderArgs = {
  clubId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
};

export type MutationAddNewClubMembersArgs = {
  input?: InputMaybe<NewClubMemberInput>;
};

export type MutationAddPermissionsToNavigationArgs = {
  navigationId: Scalars['UUID'];
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type MutationAddPermissionsToRoleArgs = {
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
  roleId?: InputMaybe<Scalars['String']>;
};

export type MutationAddPractitionerToCoachArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationAddPractitionerToPrincipalArgs = {
  firstName?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  programmeTypeId?: InputMaybe<Scalars['UUID']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddReAccreditationFollowUpVisitForPractitionerArgs = {
  input?: InputMaybe<FollowUpVisitModelInput>;
};

export type MutationAddReAccreditationVisitForPractitionerArgs = {
  input?: InputMaybe<ReAccreditationVisitModelInput>;
};

export type MutationAddReassignmentForPractitionerServiceArgs = {
  classroomGroup?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  fromUserId?: InputMaybe<Scalars['String']>;
  loggedByUser?: InputMaybe<Scalars['String']>;
  permanentAssign?: Scalars['Boolean'];
  reason?: InputMaybe<Scalars['String']>;
  startDate: Scalars['DateTime'];
  toUserId?: InputMaybe<Scalars['String']>;
};

export type MutationAddRoleArgs = {
  name?: InputMaybe<Scalars['String']>;
  normalizedName?: InputMaybe<Scalars['String']>;
};

export type MutationAddSsChecklistForTraineeArgs = {
  input?: InputMaybe<SsChecklistVisitModelInput>;
};

export type MutationAddSelfAssessmentForPractitionerArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
};

export type MutationAddSmartSpaceLicenseForTraineeArgs = {
  dateAwarded: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddStartupSupportAgreementForTraineeArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
};

export type MutationAddSubDistrictArgs = {
  input?: InputMaybe<SubDistrictModelInput>;
};

export type MutationAddSupportVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationAddSupportVisitForPractitionerArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
};

export type MutationAddTeamLeadArgs = {
  input?: InputMaybe<TeamLeadModelInput>;
};

export type MutationAddUserArgs = {
  input?: InputMaybe<UserModelInput>;
};

export type MutationAddUsersToRoleArgs = {
  roleNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddVisitBackReferralArgs = {
  input?: InputMaybe<VisitBackReferralModelInput>;
};

export type MutationAddVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationBulkDeleteCoachingCircleTopicsArgs = {
  contentIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type MutationBulkDeleteUserArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationBulkUpdateCoachingCircleTopicDatesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  endDate?: InputMaybe<Scalars['DateTime']>;
  localeId: Scalars['UUID'];
  startDate: Scalars['DateTime'];
};

export type MutationBulkUpdateConsentImagesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  imageUrl?: InputMaybe<Scalars['String']>;
  localeId: Scalars['UUID'];
};

export type MutationBulkUpdateProgressTrackingCategoryImagesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  imageUrl?: InputMaybe<Scalars['String']>;
  localeId: Scalars['UUID'];
};

export type MutationBulkUpdateProgressTrackingSubCategoryImagesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  imageUrl?: InputMaybe<Scalars['String']>;
  localeId: Scalars['UUID'];
};

export type MutationCalculateChildrenRegistrationRemovalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationCalculateMeetRegularlyArgs = {
  clubId: Scalars['UUID'];
  clubMeetingId: Scalars['UUID'];
};

export type MutationCancelCalendarEventArgs = {
  id: Scalars['UUID'];
};

export type MutationCancelRemovalFromProgrammeArgs = {
  removalId?: InputMaybe<Scalars['String']>;
};

export type MutationChangeClubNameArgs = {
  clubId?: InputMaybe<Scalars['String']>;
  clubName?: InputMaybe<Scalars['String']>;
};

export type MutationChangeClubSupportRoleArgs = {
  clubId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
};

export type MutationContentTypeImportArgs = {
  contentTypeId: Scalars['Int'];
  file?: InputMaybe<Scalars['String']>;
};

export type MutationCreateAbsenteesArgs = {
  input?: InputMaybe<AbsenteesInput>;
};

export type MutationCreateActivityArgs = {
  input: ActivityInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateAuditLogTypeArgs = {
  input?: InputMaybe<AuditLogTypeInput>;
};

export type MutationCreateCalendarEventArgs = {
  input?: InputMaybe<CalendarEventInput>;
};

export type MutationCreateCalendarEventParticipantArgs = {
  input?: InputMaybe<CalendarEventParticipantInput>;
};

export type MutationCreateCalendarEventTypeArgs = {
  input: CalendarEventTypeInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateCaregiverArgs = {
  input?: InputMaybe<CaregiverInput>;
};

export type MutationCreateChildArgs = {
  input?: InputMaybe<ChildInput>;
};

export type MutationCreateChildProgressReportArgs = {
  input?: InputMaybe<ChildProgressReportInput>;
};

export type MutationCreateClassProgrammeArgs = {
  input?: InputMaybe<ClassProgrammeInput>;
};

export type MutationCreateClassReassignmentHistoryArgs = {
  input?: InputMaybe<ClassReassignmentHistoryInput>;
};

export type MutationCreateClassroomArgs = {
  input?: InputMaybe<ClassroomInput>;
};

export type MutationCreateClassroomGroupArgs = {
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationCreateClinicArgs = {
  input?: InputMaybe<ClinicInput>;
};

export type MutationCreateClinicLeagueArgs = {
  input?: InputMaybe<ClinicLeagueInput>;
};

export type MutationCreateClinicTeamLeadArgs = {
  input?: InputMaybe<ClinicTeamLeadInput>;
};

export type MutationCreateClubArgs = {
  input?: InputMaybe<ClubInput>;
};

export type MutationCreateClubActivityUploadArgs = {
  input?: InputMaybe<ClubActivityUploadInput>;
};

export type MutationCreateClubActivityUploadTypeArgs = {
  input?: InputMaybe<ClubActivityUploadTypeInput>;
};

export type MutationCreateClubLeaderArgs = {
  input?: InputMaybe<ClubLeaderInput>;
};

export type MutationCreateClubMeetingArgs = {
  input?: InputMaybe<ClubMeetingInput>;
};

export type MutationCreateClubMeetingRegisterArgs = {
  input?: InputMaybe<ClubMeetingRegisterInput>;
};

export type MutationCreateClubMemberArgs = {
  input?: InputMaybe<ClubMemberInput>;
};

export type MutationCreateClubPointsArgs = {
  input?: InputMaybe<ClubPointsInput>;
};

export type MutationCreateClubPointsLibraryArgs = {
  input?: InputMaybe<ClubPointsLibraryInput>;
};

export type MutationCreateClubSupportArgs = {
  input?: InputMaybe<ClubSupportInput>;
};

export type MutationCreateCoachArgs = {
  input?: InputMaybe<CoachInput>;
};

export type MutationCreateCoachingCircleTopicsArgs = {
  input: CoachingCircleTopicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateConnectArgs = {
  input: ConnectInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateConnectItemArgs = {
  input: ConnectItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateConsentArgs = {
  input: ConsentInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateContentDefinitionArgs = {
  model?: InputMaybe<CreateContentDefinitionModelInput>;
};

export type MutationCreateDailyProgrammeArgs = {
  input?: InputMaybe<DailyProgrammeInput>;
};

export type MutationCreateDistrictArgs = {
  input?: InputMaybe<DistrictInput>;
};

export type MutationCreateDocumentArgs = {
  input?: InputMaybe<DocumentInput>;
};

export type MutationCreateDocumentTypeArgs = {
  input?: InputMaybe<DocumentTypeInput>;
};

export type MutationCreateEducationArgs = {
  input?: InputMaybe<EducationInput>;
};

export type MutationCreateEventRecordArgs = {
  input?: InputMaybe<EventRecordInput>;
};

export type MutationCreateEventRecordTypeArgs = {
  input?: InputMaybe<EventRecordTypeInput>;
};

export type MutationCreateFranchisorArgs = {
  input?: InputMaybe<FranchisorInput>;
};

export type MutationCreateGenderArgs = {
  input?: InputMaybe<GenderInput>;
};

export type MutationCreateGrantArgs = {
  input?: InputMaybe<GrantInput>;
};

export type MutationCreateHealthCareWorkerArgs = {
  input?: InputMaybe<HealthCareWorkerInput>;
};

export type MutationCreateHealthPromotionArgs = {
  input: HealthPromotionInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateHierarchyEntityArgs = {
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationCreateIncomeStatementsArgs = {
  input: IncomeStatementsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateInfantArgs = {
  input?: InputMaybe<InfantInput>;
};

export type MutationCreateInfographicsArgs = {
  input: InfographicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateIntegrationAuditArgs = {
  input?: InputMaybe<IntegrationAuditInput>;
};

export type MutationCreateIntegrationColumnMappingArgs = {
  input?: InputMaybe<IntegrationColumnMappingInput>;
};

export type MutationCreateIntegrationEntityMappingArgs = {
  input?: InputMaybe<IntegrationEntityMappingInput>;
};

export type MutationCreateIntegrationLogArgs = {
  input?: InputMaybe<IntegrationLogInput>;
};

export type MutationCreateLanguageArgs = {
  input?: InputMaybe<LanguageInput>;
};

export type MutationCreateLeagueArgs = {
  input?: InputMaybe<LeagueInput>;
};

export type MutationCreateLeagueTypeArgs = {
  input?: InputMaybe<LeagueTypeInput>;
};

export type MutationCreateLearnerArgs = {
  input?: InputMaybe<LearnerInput>;
};

export type MutationCreateLicenseArgs = {
  input?: InputMaybe<LicenseInput>;
};

export type MutationCreateLicenseTypeArgs = {
  input?: InputMaybe<LicenseTypeInput>;
};

export type MutationCreateMeetingTypeArgs = {
  input?: InputMaybe<MeetingTypeInput>;
};

export type MutationCreateMessageLogArgs = {
  input?: InputMaybe<MessageLogInput>;
};

export type MutationCreateMessageTemplateArgs = {
  input?: InputMaybe<MessageTemplateInput>;
};

export type MutationCreateMoreInformationArgs = {
  input: MoreInformationInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateMotherArgs = {
  input?: InputMaybe<MotherInput>;
};

export type MutationCreateNavigationArgs = {
  input?: InputMaybe<NavigationInput>;
};

export type MutationCreateNoteArgs = {
  input?: InputMaybe<NoteInput>;
};

export type MutationCreateNoteTypeArgs = {
  input?: InputMaybe<NoteTypeInput>;
};

export type MutationCreatePqaArgs = {
  input?: InputMaybe<PqaInput>;
};

export type MutationCreatePqaRatingArgs = {
  input?: InputMaybe<PqaRatingInput>;
};

export type MutationCreatePqaSectionRatingArgs = {
  input?: InputMaybe<PqaSectionRatingInput>;
};

export type MutationCreatePermissionArgs = {
  input?: InputMaybe<PermissionInput>;
};

export type MutationCreatePointsLibraryArgs = {
  input?: InputMaybe<PointsLibraryInput>;
};

export type MutationCreatePointsUserArgs = {
  input?: InputMaybe<PointsUserInput>;
};

export type MutationCreatePointsUserSummaryArgs = {
  input?: InputMaybe<PointsUserSummaryInput>;
};

export type MutationCreatePractitionerArgs = {
  input?: InputMaybe<PractitionerInput>;
};

export type MutationCreatePractitionerRemovalHistoryArgs = {
  input?: InputMaybe<PractitionerRemovalHistoryInput>;
};

export type MutationCreatePrincipalArgs = {
  input?: InputMaybe<PrincipalInput>;
};

export type MutationCreateProgrammeArgs = {
  input?: InputMaybe<ProgrammeInput>;
};

export type MutationCreateProgrammeAttendanceReasonArgs = {
  input?: InputMaybe<ProgrammeAttendanceReasonInput>;
};

export type MutationCreateProgrammeRoutineArgs = {
  input: ProgrammeRoutineInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgrammeRoutineItemArgs = {
  input: ProgrammeRoutineItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgrammeRoutineSubItemArgs = {
  input: ProgrammeRoutineSubItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgrammeTypeArgs = {
  input?: InputMaybe<ProgrammeTypeInput>;
};

export type MutationCreateProgressTrackingCategoryArgs = {
  input: ProgressTrackingCategoryInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgressTrackingLevelArgs = {
  input: ProgressTrackingLevelInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgressTrackingSkillArgs = {
  input: ProgressTrackingSkillInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProgressTrackingSubCategoryArgs = {
  input: ProgressTrackingSubCategoryInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateProvinceArgs = {
  input?: InputMaybe<ProvinceInput>;
};

export type MutationCreateRaceArgs = {
  input?: InputMaybe<RaceInput>;
};

export type MutationCreateReasonForLeavingArgs = {
  input?: InputMaybe<ReasonForLeavingInput>;
};

export type MutationCreateReasonForPractitionerLeavingArgs = {
  input?: InputMaybe<ReasonForPractitionerLeavingInput>;
};

export type MutationCreateReasonForPractitionerLeavingProgrammeArgs = {
  input?: InputMaybe<ReasonForPractitionerLeavingProgrammeInput>;
};

export type MutationCreateRelationArgs = {
  input?: InputMaybe<RelationInput>;
};

export type MutationCreateShortenUrlEntityArgs = {
  input?: InputMaybe<ShortenUrlEntityInput>;
};

export type MutationCreateSiteAddressArgs = {
  input?: InputMaybe<SiteAddressInput>;
};

export type MutationCreateSmartSpaceVisitArgs = {
  input?: InputMaybe<SmartSpaceVisitInput>;
};

export type MutationCreateStatementsContributionTypeArgs = {
  input?: InputMaybe<StatementsContributionTypeInput>;
};

export type MutationCreateStatementsExpenseTypeArgs = {
  input?: InputMaybe<StatementsExpenseTypeInput>;
};

export type MutationCreateStatementsExpensesArgs = {
  input?: InputMaybe<StatementsExpensesInput>;
};

export type MutationCreateStatementsFeeTypeArgs = {
  input?: InputMaybe<StatementsFeeTypeInput>;
};

export type MutationCreateStatementsIncomeArgs = {
  input?: InputMaybe<StatementsIncomeInput>;
};

export type MutationCreateStatementsIncomeStatementArgs = {
  input?: InputMaybe<StatementsIncomeStatementInput>;
};

export type MutationCreateStatementsIncomeTypeArgs = {
  input?: InputMaybe<StatementsIncomeTypeInput>;
};

export type MutationCreateStatementsPayTypeArgs = {
  input?: InputMaybe<StatementsPayTypeInput>;
};

export type MutationCreateStatementsStartupSupportArgs = {
  input?: InputMaybe<StatementsStartupSupportInput>;
};

export type MutationCreateStoryBookArgs = {
  input: StoryBookInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateStoryBookPartQuestionArgs = {
  input: StoryBookPartQuestionInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateStoryBookPartsArgs = {
  input: StoryBookPartsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateSubDistrictArgs = {
  input?: InputMaybe<SubDistrictInput>;
};

export type MutationCreateSystemSettingArgs = {
  input?: InputMaybe<SystemSettingInput>;
};

export type MutationCreateTeamLeadArgs = {
  input?: InputMaybe<TeamLeadInput>;
};

export type MutationCreateThemeArgs = {
  input: ThemeInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateThemeDayArgs = {
  input: ThemeDayInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateTraineeArgs = {
  input?: InputMaybe<TraineeInput>;
};

export type MutationCreateUserConsentArgs = {
  input?: InputMaybe<UserConsentInput>;
};

export type MutationCreateUserHierarchyEntityArgs = {
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationCreateVisitArgs = {
  input?: InputMaybe<VisitInput>;
};

export type MutationCreateVisitBackReferralArgs = {
  input?: InputMaybe<VisitBackReferralInput>;
};

export type MutationCreateVisitDataArgs = {
  input?: InputMaybe<VisitDataInput>;
};

export type MutationCreateVisitDataStatusArgs = {
  input?: InputMaybe<VisitDataStatusInput>;
};

export type MutationCreateVisitGrowthDataDayArgs = {
  input?: InputMaybe<VisitGrowthDataDayInput>;
};

export type MutationCreateVisitGrowthDataHeightArgs = {
  input?: InputMaybe<VisitGrowthDataHeightInput>;
};

export type MutationCreateVisitTypeArgs = {
  input?: InputMaybe<VisitTypeInput>;
};

export type MutationCreateVisitVideosArgs = {
  input: VisitVideosInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateWorkflowStatusArgs = {
  input?: InputMaybe<WorkflowStatusInput>;
};

export type MutationCreateWorkflowStatusTypeArgs = {
  input?: InputMaybe<WorkflowStatusTypeInput>;
};

export type MutationDeActivatePractitionerArgs = {
  leavingComment?: InputMaybe<Scalars['String']>;
  reasonDetails?: InputMaybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteAbsenteesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteActivityArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteAuditLogTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCalendarEventArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCalendarEventParticipantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCalendarEventTypeArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCaregiverArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteChildArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteChildProgressReportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClassProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClassReassignmentHistoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClassroomArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClassroomGroupArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClinicArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClinicLeagueArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClinicTeamLeadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubActivityUploadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubActivityUploadTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubLeaderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubMeetingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubMeetingRegisterArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubMemberArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubPointsArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubPointsLibraryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubSupportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachForFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCoachingCircleTopicsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteConnectArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteConnectItemArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteConsentArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteContentDefinitionArgs = {
  id: Scalars['Int'];
};

export type MutationDeleteDailyProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteDistrictArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteDocumentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteDocumentTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteEducationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteEventRecordArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteEventRecordTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteFranchisorArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteGenderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteGrantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteHealthPromotionArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteIncomeStatementsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteInfantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteInfographicsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteIntegrationAuditArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteIntegrationColumnMappingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteIntegrationEntityMappingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteIntegrationLogArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLeagueArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLeagueTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLicenseArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLicenseTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteMeetingTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteMessageLogArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteMessageTemplateArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteMoreInformationArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteMotherArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteNavigationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteNoteArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteNoteTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePqaArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePqaRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePqaSectionRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsLibraryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsUserArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsUserSummaryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePractitionerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePractitionerForCoachArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationDeletePractitionerFromPrincipalArgs = {
  principalId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationDeletePractitionerRemovalHistoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePrincipalArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteProgrammeAttendanceReasonArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteProgrammeRoutineArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgrammeRoutineItemArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgrammeRoutineSubItemArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgrammeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteProgressTrackingCategoryArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgressTrackingLevelArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgressTrackingSkillArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProgressTrackingSubCategoryArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteProvinceArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteRaceArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteReasonForLeavingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteReasonForPractitionerLeavingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteReasonForPractitionerLeavingProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteRelationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteRoleArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteShortenUrlEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteSiteAddressArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteSmartSpaceVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsContributionTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsExpenseTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsExpensesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsFeeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsIncomeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsIncomeStatementArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsIncomeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsPayTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStatementsStartupSupportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteStoryBookArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteStoryBookPartQuestionArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteStoryBookPartsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteSubDistrictArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteSystemSettingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteTeamLeadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteThemeArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteThemeDayArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteTraineeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteUserConsentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitBackReferralArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitDataArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitDataStatusArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitGrowthDataDayArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitGrowthDataHeightArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitVideosArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteWorkflowStatusArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteWorkflowStatusTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDelicensePractitionerArgs = {
  input?: InputMaybe<LicenseModelInput>;
};

export type MutationDemotePractitionerAsPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationDisableNotificationArgs = {
  notificationId?: InputMaybe<Scalars['String']>;
};

export type MutationEditAbsenteeArgs = {
  absentDate?: InputMaybe<Scalars['DateTime']>;
  absentDateEnd?: InputMaybe<Scalars['DateTime']>;
  absenteeId?: InputMaybe<Scalars['String']>;
  deleteAbsentee?: Scalars['Boolean'];
  isRoleAssign?: Scalars['Boolean'];
  reason?: InputMaybe<Scalars['String']>;
  reassignedToPractitioner?: InputMaybe<Scalars['String']>;
  roleAssignedToUser?: InputMaybe<Scalars['String']>;
};

export type MutationEditDistrictArgs = {
  input?: InputMaybe<DistrictModelInput>;
};

export type MutationEditSubDistrictArgs = {
  input?: InputMaybe<SubDistrictModelInput>;
};

export type MutationEditVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationExpireNotificationArgs = {
  notificationId?: InputMaybe<Scalars['String']>;
};

export type MutationExpireNotificationsTypesForUserArgs = {
  searchCriteria?: InputMaybe<Scalars['String']>;
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationFileUploadArgs = {
  file?: InputMaybe<Scalars['String']>;
  fileName?: InputMaybe<Scalars['String']>;
  fileType: FileTypeEnum;
};

export type MutationGgBottom75PercPointsTeamArgs = {
  ranking?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationGenerateCaregiverChildTokenArgs = {
  classgroupId: Scalars['UUID'];
  firstname?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type MutationImportHealthCareWorkersArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationImportTeamLeadsArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationIntegrationByNewCoachArgs = {
  remoteCoachId?: InputMaybe<Scalars['String']>;
};

export type MutationMarkAsReadNotificationArgs = {
  notificationId?: InputMaybe<Scalars['String']>;
};

export type MutationMoveClubMembersArgs = {
  input?: InputMaybe<NewClubMemberInput>;
};

export type MutationOpenAccessAddChildArgs = {
  caregiver?: InputMaybe<AddChildCaregiverTokenModelInput>;
  child?: InputMaybe<AddChildTokenModelInput>;
  consent?: InputMaybe<AddChildUserConsentTokenModelInput>;
  learner?: InputMaybe<AddChildLearnerTokenModelInput>;
  registration?: InputMaybe<AddChildRegistrationTokenModelInput>;
  siteAddress?: InputMaybe<AddChildSiteAddressTokenModelInput>;
  token?: InputMaybe<Scalars['String']>;
};

export type MutationPromotePractitionerToPrincipalArgs = {
  sendComm?: Scalars['Boolean'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationReassignAbsenteeFromHistoryArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationReassignClassroomsFromHistoryServiceArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationRefreshCaregiverChildTokenArgs = {
  childId: Scalars['UUID'];
  classgroupId: Scalars['UUID'];
};

export type MutationRejectNewClubLeaderRoleArgs = {
  clubId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
};

export type MutationRemapPrincipalToPrincipalArgs = {
  newPrincipalId?: InputMaybe<Scalars['String']>;
  oldPrincipalId?: InputMaybe<Scalars['String']>;
};

export type MutationRemoveFromProgrammeArgs = {
  classroomGroupReassignments?: InputMaybe<
    Array<InputMaybe<ClassroomGroupReassignmentsInput>>
  >;
  classroomId?: InputMaybe<Scalars['String']>;
  dateOfRemoval: Scalars['DateTime'];
  practitionerUserId?: InputMaybe<Scalars['String']>;
  reasonDetails?: InputMaybe<Scalars['String']>;
  reasonForPractitionerLeavingProgrammeId?: InputMaybe<Scalars['String']>;
};

export type MutationRemovePermissionsFromNavigationArgs = {
  navigationId: Scalars['UUID'];
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type MutationRemovePermissionsFromRoleArgs = {
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
  roleId?: InputMaybe<Scalars['String']>;
};

export type MutationRemovePractitionerArgs = {
  classroomGroupReassignments?: InputMaybe<
    Array<InputMaybe<ClassroomGroupReassignmentsInput>>
  >;
  newPrincipalId?: InputMaybe<Scalars['String']>;
  practitionerUserId?: InputMaybe<Scalars['String']>;
  reasonDetails?: InputMaybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: InputMaybe<Scalars['String']>;
};

export type MutationRemoveUserFromRolesArgs = {
  roleNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationResetUserPasswordArgs = {
  id?: InputMaybe<Scalars['String']>;
  newPassword?: InputMaybe<Scalars['String']>;
};

export type MutationSaveBulkMessagesForAdminArgs = {
  input?: InputMaybe<MessageLogModelInput>;
};

export type MutationSaveWelcomeMessageArgs = {
  clubId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
  shareContactInfo: Scalars['Boolean'];
  welcomeMessage?: InputMaybe<Scalars['String']>;
};

export type MutationScheduleConsolidationMeetingDateArgs = {
  scheduledDate?: InputMaybe<Scalars['DateTime']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendAllProgressReportsCompletedForClassNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendAnyGgNotificationArgs = {
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendAnyGgNotificationWithReplacementsArgs = {
  replacements?: InputMaybe<Array<InputMaybe<TagsReplacementsInput>>>;
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendAnyNotificationArgs = {
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendAnyNotificationWithReplacementsArgs = {
  replacements?: InputMaybe<Array<InputMaybe<TagsReplacementsInput>>>;
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendBulkInviteToAppArgs = {
  userIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationSendBulkInviteToPortalArgs = {
  userIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationSendClubleaderRoleAssignedNotificationArgs = {
  clubName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachAddresUpdatedScheduleVisitNotificationArgs = {
  principalOrFAAName?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachNewTraineesNotificationArgs = {
  traineeFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachRemoveTraineeNotificationArgs = {
  traineeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachTraineeReadySmartspaceCheckNotificationArgs = {
  traineeFirstName?: InputMaybe<Scalars['String']>;
  traineeUserId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachVisitRequestedNotificationArgs = {
  practitionerFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachVisitsOverdueNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendDemotedAsPrincipalFaaProgrammeNotificationArgs = {
  principalOrFAA?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendEndofyearPointEarnedNotificationArgs = {
  pointsEarned?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendFillInSelfAsessmentFormNotificationArgs = {
  dueDate?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgAddBreastfeedingClubNotificationArgs = {
  currentMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgBronzeTierPointsTeamNotificationArgs = {
  quarter?: InputMaybe<Scalars['String']>;
  totalTeamPoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgChildGrowthIssueNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgChildMuacMalnutritionNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgChildMuacNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgChildOlderThanFiveNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  removalDate?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgClinicVisitsNotUpToDateNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgEarningPointsNotificationArgs = {
  currentMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgEarningXPointsNotificationArgs = {
  averagePoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgExpectedMomDeliveryDateApproachingNotificationArgs = {
  clientFirstName?: InputMaybe<Scalars['String']>;
  expectedDeliveryDate?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgggAddedABreastfeedingClubNotificationArgs = {
  currentClubs?: InputMaybe<Scalars['String']>;
  currentMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgGoldTierPointsTeamNotificationArgs = {
  quarter?: InputMaybe<Scalars['String']>;
  totalTeamPoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgLowBirthWeightNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgMaternalDistressNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgMultipleReferralsNotificationArgs = {
  clientFirstName?: InputMaybe<Scalars['String']>;
  noOfReferrals?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgPointsTeamPlacementNotBottom75PercNotificationArgs = {
  currentYear?: InputMaybe<Scalars['String']>;
  placement?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgPointsTeamPlacementNotTop3NotificationArgs = {
  currentYear?: InputMaybe<Scalars['String']>;
  placement?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgPointsTeamPlacementNotificationArgs = {
  currentYear?: InputMaybe<Scalars['String']>;
  placement?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgPointsYearlySummaryNotificationArgs = {
  currentYear?: InputMaybe<Scalars['String']>;
  pointsEarned?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgPregnantMomLowMuacNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgRedAlertMaternalDistressNotificationArgs = {
  clientFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgReferDohaNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgReferSassaNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  childFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgReferralDangerSignsNotificationArgs = {
  dangerSignsList?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgSilverTierPointsTeamNotificationArgs = {
  quarter?: InputMaybe<Scalars['String']>;
  totalTeamPoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgSubstanceAbuseNotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgTop25PercPointsTeamNotificationArgs = {
  pointsBehindWinningTeam?: InputMaybe<Scalars['String']>;
  totalTeamPoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgTopPointsEarnerNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgTopPointsTeamNotificationArgs = {
  totalTeamPoints?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgTwoVisitsMissedNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  clientFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgUploadRthNotificationArgs = {
  childFirstName?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgVisitOverdueNotificationArgs = {
  clientFirstName?: InputMaybe<Scalars['String']>;
  noOfReferrals?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgVisitsNotCompleted14daysNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgWalkthroughNotificationNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGgxVisitsMissedNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
  visitsOverdue?: InputMaybe<Scalars['String']>;
};

export type MutationSendGGyoungerthan20NotificationArgs = {
  caregiverFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendGainedCommunitySupportNotificationArgs = {
  supportDate?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendInviteToApplicationArgs = {
  inviteToPortal?: Scalars['Boolean'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendNewClubleaderNotificationArgs = {
  clubLeaderName?: InputMaybe<Scalars['String']>;
  clubName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendNotificationToUserArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  userType?: InputMaybe<Scalars['String']>;
};

export type MutationSendOnly2MoreTraineeTaskLeftsNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendOverdueTraineeTasksNotificationArgs = {
  dueDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerAddedToProgrammeNotificationArgs = {
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerNotAssignedToProgrammeNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerRemovedFromProgrammeNotificationArgs = {
  practitionerName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPrincipalAllReportsDoneNotificationArgs = {
  practitionerFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPrincipalChangedNotificationArgs = {
  principalOrFAA?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPrincipalMovedToProgrammeNotificationArgs = {
  noOfChildren?: InputMaybe<Scalars['String']>;
  trackingMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPrincipalReportDeadlinePassedNotificationArgs = {
  practitionerFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendProgressreportsNotCreatedNotificationArgs = {
  dueDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPromotedToPrincipalFaaProgrammeNotificationArgs = {
  principalOrFAA?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendRecordCaregiverMeetingNotificationArgs = {
  clubId?: InputMaybe<Scalars['String']>;
  meetingDate?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendRegisterThreeChildrenNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendRemovedFromProgrammeNotificationArgs = {
  principalName?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendReportDeadlinePassedNotificationArgs = {
  noOfChildren?: InputMaybe<Scalars['String']>;
  trackingMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendSetAbsenteeNotificationArgs = {
  absentStartDate?: InputMaybe<Scalars['String']>;
  parentPrincipalFAACoachName?: InputMaybe<Scalars['String']>;
  parentPrincipalFAACoachUserId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendSetLeaveNotificationArgs = {
  absentEndDate?: InputMaybe<Scalars['String']>;
  absentStartDate?: InputMaybe<Scalars['String']>;
  parentPrincipalFAACoachName?: InputMaybe<Scalars['String']>;
  parentPrincipalUserId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTopSmartStarterPointsNotificationArgs = {
  previousMonth?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTrainee2WeekOnboardingWarningNotificationArgs = {
  traineeFirstName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTraineeJourneyStartSelfNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTraineeSetupVenueNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTraineeSignAgreementNotificationArgs = {
  dueDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendTraineeSignStartupSupportAgreementNotificationArgs = {
  dueDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendUpdateFeeNotificationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendUserAddedToClubNotificationArgs = {
  clubName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendUserAssignedToClassFromOldClassNotificationArgs = {
  className?: InputMaybe<Scalars['String']>;
  oldClassName?: InputMaybe<Scalars['String']>;
  principalName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendUserAssignedToClassNotificationArgs = {
  className?: InputMaybe<Scalars['String']>;
  oldClassName?: InputMaybe<Scalars['String']>;
  principalName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSetContactClubLeaderStatusForMeetingArgs = {
  clubMeetingId: Scalars['UUID'];
};

export type MutationSubmitMonthlyStatementArgs = {
  input?: InputMaybe<SubmitStatementModelInput>;
};

export type MutationSwitchPrincipalArgs = {
  newPrincipalUserId?: InputMaybe<Scalars['String']>;
  oldPrincipalUserId?: InputMaybe<Scalars['String']>;
};

export type MutationTestPointEngineArgs = {
  today: Scalars['DateTime'];
  type?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationTrackAttendanceArgs = {
  attendance?: InputMaybe<Array<InputMaybe<TrackAttendanceModelInput>>>;
};

export type MutationUpdateAbsenteesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<AbsenteesInput>;
};

export type MutationUpdateActivityArgs = {
  id: Scalars['String'];
  input: ActivityInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateAuditLogTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<AuditLogTypeInput>;
};

export type MutationUpdateCalendarEventArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CalendarEventModelInput>;
};

export type MutationUpdateCalendarEventParticipantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CalendarEventParticipantInput>;
};

export type MutationUpdateCalendarEventTypeArgs = {
  id: Scalars['String'];
  input: CalendarEventTypeInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCareGiverGrantsArgs = {
  childUserId: Scalars['UUID'];
  grantIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type MutationUpdateCaregiverArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CaregiverInput>;
};

export type MutationUpdateChildArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ChildInput>;
};

export type MutationUpdateChildProgressReportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ChildProgressReportInput>;
};

export type MutationUpdateClassProgrammeArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<ClassProgrammeInput>;
};

export type MutationUpdateClassReassignmentHistoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClassReassignmentHistoryInput>;
};

export type MutationUpdateClassroomArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClassroomInput>;
};

export type MutationUpdateClassroomGroupArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationUpdateClassroomSiteAddressArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<ClassroomInput>;
};

export type MutationUpdateClinicArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClinicInput>;
};

export type MutationUpdateClinicLeagueArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClinicLeagueInput>;
};

export type MutationUpdateClinicTeamLeadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClinicTeamLeadInput>;
};

export type MutationUpdateClubArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubInput>;
};

export type MutationUpdateClubActivityUploadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubActivityUploadInput>;
};

export type MutationUpdateClubActivityUploadTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubActivityUploadTypeInput>;
};

export type MutationUpdateClubLeaderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubLeaderInput>;
};

export type MutationUpdateClubMeetingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubMeetingInput>;
};

export type MutationUpdateClubMeetingRegisterArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubMeetingRegisterInput>;
};

export type MutationUpdateClubMemberArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubMemberInput>;
};

export type MutationUpdateClubPointsArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubPointsInput>;
};

export type MutationUpdateClubPointsLibraryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubPointsLibraryInput>;
};

export type MutationUpdateClubSupportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubSupportInput>;
};

export type MutationUpdateClubSupportStatusArgs = {
  practitionerId: Scalars['UUID'];
};

export type MutationUpdateCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CoachInput>;
};

export type MutationUpdateCoachAboutInfoArgs = {
  aboutInfo?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCoachClubClickedArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCoachingCircleTopicsArgs = {
  id: Scalars['String'];
  input: CoachingCircleTopicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunitySupportArgs = {
  haveCommunitySupport?: InputMaybe<Scalars['Boolean']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConnectArgs = {
  id: Scalars['String'];
  input: ConnectInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConnectItemArgs = {
  id: Scalars['String'];
  input: ConnectItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConnectSectionArgs = {
  input?: InputMaybe<Array<InputMaybe<CmsConnectModelInput>>>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConsentArgs = {
  id: Scalars['String'];
  input: ConsentInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateDailyProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<DailyProgrammeInput>;
};

export type MutationUpdateDistrictArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<DistrictInput>;
};

export type MutationUpdateDocumentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<DocumentInput>;
};

export type MutationUpdateDocumentTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<DocumentTypeInput>;
};

export type MutationUpdateEducationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<EducationInput>;
};

export type MutationUpdateEventRecordArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationUpdateEventRecordTypeArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordTypeModelInput>;
};

export type MutationUpdateExpenseArgs = {
  input?: InputMaybe<StatementsExpensesInput>;
};

export type MutationUpdateFranchisorArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<FranchisorInput>;
};

export type MutationUpdateGenderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<GenderInput>;
};

export type MutationUpdateGrantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<GrantInput>;
};

export type MutationUpdateHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<HealthCareWorkerInputModelInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateHealthCareWorkerTabsArgs = {
  input?: InputMaybe<HealthCareWorkerInputModelInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateHealthCareWorkerWelcomeMessageArgs = {
  healthcareWorkerId: Scalars['UUID'];
  shareContactInfo: Scalars['Boolean'];
  welcomeMessage?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateHealthPromotionArgs = {
  id: Scalars['String'];
  input: HealthPromotionInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationUpdateIncomeArgs = {
  input?: InputMaybe<StatementsIncomeInput>;
};

export type MutationUpdateIncomeStatementsArgs = {
  id: Scalars['String'];
  input: IncomeStatementsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateInfantCaregiverArgs = {
  infantId?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateInfantCaregiverAddressArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateInfantCaregiverContactDetailsArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateInfographicsArgs = {
  id: Scalars['String'];
  input: InfographicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateIntegrationAuditArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<IntegrationAuditInput>;
};

export type MutationUpdateIntegrationColumnMappingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<IntegrationColumnMappingInput>;
};

export type MutationUpdateIntegrationEntityMappingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<IntegrationEntityMappingInput>;
};

export type MutationUpdateIntegrationLogArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<IntegrationLogInput>;
};

export type MutationUpdateLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LanguageInput>;
};

export type MutationUpdateLeagueArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LeagueInput>;
};

export type MutationUpdateLeagueTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LeagueTypeInput>;
};

export type MutationUpdateLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LearnerInput>;
};

export type MutationUpdateLicenseArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LicenseInput>;
};

export type MutationUpdateLicenseTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LicenseTypeInput>;
};

export type MutationUpdateMeetingTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<MeetingTypeInput>;
};

export type MutationUpdateMessageLogArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<MessageLogInput>;
};

export type MutationUpdateMessageTemplateArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<MessageTemplateInput>;
};

export type MutationUpdateMoreInformationArgs = {
  id: Scalars['String'];
  input: MoreInformationInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<MotherModelInput>;
};

export type MutationUpdateMotherAddressArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<MotherModelInput>;
};

export type MutationUpdateMotherContactDetailsArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<MotherModelInput>;
};

export type MutationUpdateMotherDeliveryDateArgs = {
  expectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  id?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateNavigationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NavigationInput>;
};

export type MutationUpdateNewMemberStatusArgs = {
  clubId: Scalars['UUID'];
  practitionerId: Scalars['UUID'];
};

export type MutationUpdateNoteArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NoteInput>;
};

export type MutationUpdateNoteTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NoteTypeInput>;
};

export type MutationUpdatePqaArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PqaInput>;
};

export type MutationUpdatePqaRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PqaRatingInput>;
};

export type MutationUpdatePqaSectionRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PqaSectionRatingInput>;
};

export type MutationUpdatePermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PermissionInput>;
};

export type MutationUpdatePointsLibraryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsLibraryInput>;
};

export type MutationUpdatePointsUserArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsUserInput>;
};

export type MutationUpdatePointsUserSummaryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsUserSummaryInput>;
};

export type MutationUpdatePractitionerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PractitionerInput>;
};

export type MutationUpdatePractitionerBusinessWalkthroughArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerContactInfoArgs = {
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerEmergencyContactArgs = {
  contactno?: InputMaybe<Scalars['String']>;
  firstname?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerIsFundaAppAdminArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerProgressArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  progress: Scalars['Decimal'];
};

export type MutationUpdatePractitionerRegisteredArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  status?: Scalars['Boolean'];
};

export type MutationUpdatePractitionerRemovalHistoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PractitionerRemovalHistoryInput>;
};

export type MutationUpdatePractitionerShareInfoArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerToTeachClassroomArgs = {
  classroomId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerUsePhotoInReportArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  usePhotoInReport?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePreschoolFeeForClassroomArgs = {
  amount?: InputMaybe<Scalars['Float']>;
  classroomId: Scalars['UUID'];
};

export type MutationUpdatePrincipalArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PrincipalInput>;
};

export type MutationUpdatePrincipalInvitationArgs = {
  accepted: Scalars['Boolean'];
  practitionerId?: InputMaybe<Scalars['String']>;
  principalId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ProgrammeInput>;
};

export type MutationUpdateProgrammeAttendanceReasonArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ProgrammeAttendanceReasonInput>;
};

export type MutationUpdateProgrammeRoutineArgs = {
  id: Scalars['String'];
  input: ProgrammeRoutineInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgrammeRoutineItemArgs = {
  id: Scalars['String'];
  input: ProgrammeRoutineItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgrammeRoutineSubItemArgs = {
  id: Scalars['String'];
  input: ProgrammeRoutineSubItemInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgrammeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ProgrammeTypeInput>;
};

export type MutationUpdateProgrammesArgs = {
  programmeInput?: InputMaybe<ProgrammeModelInput>;
};

export type MutationUpdateProgressTrackingCategoryArgs = {
  id: Scalars['String'];
  input: ProgressTrackingCategoryInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgressTrackingLevelArgs = {
  id: Scalars['String'];
  input: ProgressTrackingLevelInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgressTrackingSkillArgs = {
  id: Scalars['String'];
  input: ProgressTrackingSkillInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProgressTrackingSubCategoryArgs = {
  id: Scalars['String'];
  input: ProgressTrackingSubCategoryInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateProvinceArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ProvinceInput>;
};

export type MutationUpdateRaceArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<RaceInput>;
};

export type MutationUpdateReasonForLeavingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ReasonForLeavingInput>;
};

export type MutationUpdateReasonForPractitionerLeavingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ReasonForPractitionerLeavingInput>;
};

export type MutationUpdateReasonForPractitionerLeavingProgrammeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ReasonForPractitionerLeavingProgrammeInput>;
};

export type MutationUpdateRelationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<RelationInput>;
};

export type MutationUpdateRemovalFromProgrammeArgs = {
  classroomGroupReassignments?: InputMaybe<
    Array<InputMaybe<ClassroomGroupReassignmentsInput>>
  >;
  dateOfRemoval: Scalars['DateTime'];
  reasonDetails?: InputMaybe<Scalars['String']>;
  reasonForPractitionerLeavingProgrammeId?: InputMaybe<Scalars['String']>;
  removalId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateRoleArgs = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  normalizedName?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateShortenUrlEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ShortenUrlEntityInput>;
};

export type MutationUpdateSiteAddressArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SiteAddressInput>;
};

export type MutationUpdateSmartSpaceVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SmartSpaceVisitInput>;
};

export type MutationUpdateStartupSupportArgs = {
  input?: InputMaybe<StatementsStartupSupportInput>;
};

export type MutationUpdateStatementsContributionTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsContributionTypeInput>;
};

export type MutationUpdateStatementsExpenseTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsExpenseTypeInput>;
};

export type MutationUpdateStatementsExpensesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsExpensesInput>;
};

export type MutationUpdateStatementsFeeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsFeeTypeInput>;
};

export type MutationUpdateStatementsIncomeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsIncomeInput>;
};

export type MutationUpdateStatementsIncomeStatementArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsIncomeStatementInput>;
};

export type MutationUpdateStatementsIncomeTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsIncomeTypeInput>;
};

export type MutationUpdateStatementsPayTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsPayTypeInput>;
};

export type MutationUpdateStatementsStartupSupportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<StatementsStartupSupportInput>;
};

export type MutationUpdateStoryBookArgs = {
  id: Scalars['String'];
  input: StoryBookInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateStoryBookAndPartsArgs = {
  currentBookPartsIds?: InputMaybe<Scalars['String']>;
  localeId: Scalars['UUID'];
  storyBookContentId: Scalars['Int'];
  storyBookParts?: InputMaybe<Array<InputMaybe<StoryBookModelInput>>>;
};

export type MutationUpdateStoryBookPartQuestionArgs = {
  id: Scalars['String'];
  input: StoryBookPartQuestionInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateStoryBookPartsArgs = {
  id: Scalars['String'];
  input: StoryBookPartsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateSubCategorySkillsArgs = {
  localeId: Scalars['UUID'];
  subCategories?: InputMaybe<Array<InputMaybe<ProgressSubCategoryModelInput>>>;
};

export type MutationUpdateSubDistrictArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SubDistrictInput>;
};

export type MutationUpdateSystemSettingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SystemSettingInput>;
};

export type MutationUpdateTeamLeadArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<TeamLeadInput>;
};

export type MutationUpdateTenantThemeArgs = {
  theme?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateThemeArgs = {
  id: Scalars['String'];
  input: ThemeInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateThemeDayArgs = {
  id: Scalars['String'];
  input: ThemeDayInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateTraineeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<TraineeInput>;
};

export type MutationUpdateTraineeAddressArgs = {
  input?: InputMaybe<TraineeAddressModelInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<UserModelInput>;
};

export type MutationUpdateUserConsentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserConsentInput>;
};

export type MutationUpdateUserContactStatusForStatementArgs = {
  statementId: Scalars['UUID'];
};

export type MutationUpdateUserHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationUpdateVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitInput>;
};

export type MutationUpdateVisitBackReferralArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitBackReferralInput>;
};

export type MutationUpdateVisitDataArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitDataInput>;
};

export type MutationUpdateVisitDataStatusArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitDataStatusReferralInput>;
};

export type MutationUpdateVisitGrowthDataDayArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitGrowthDataDayInput>;
};

export type MutationUpdateVisitGrowthDataHeightArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitGrowthDataHeightInput>;
};

export type MutationUpdateVisitPlannedVisitDateArgs = {
  input?: InputMaybe<UpdateVisitPlannedVisitDateModelInput>;
};

export type MutationUpdateVisitTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitTypeInput>;
};

export type MutationUpdateVisitVideosArgs = {
  id: Scalars['String'];
  input: VisitVideosInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateWorkflowStatusArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<WorkflowStatusInput>;
};

export type MutationUpdateWorkflowStatusTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<WorkflowStatusTypeInput>;
};

export type MutationUploadChildProgressReportArgs = {
  report?: InputMaybe<Scalars['String']>;
};

export type Navigation = {
  __typename?: 'Navigation';
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
  route?: Maybe<Scalars['String']>;
  sequence: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type NavigationFilterInput = {
  and?: InputMaybe<Array<NavigationFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  icon?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<NavigationFilterInput>>;
  route?: InputMaybe<StringOperationFilterInput>;
  sequence?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type NavigationInput = {
  Description?: InputMaybe<Scalars['String']>;
  Icon?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Route?: InputMaybe<Scalars['String']>;
  Sequence: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type NavigationSortInput = {
  description?: InputMaybe<SortEnumType>;
  icon?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  route?: InputMaybe<SortEnumType>;
  sequence?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type NewClubInput = {
  name?: InputMaybe<Scalars['String']>;
  newClubMembers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  transferredClubMembers?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type NewClubMemberInput = {
  clubId: Scalars['UUID'];
  practitionerIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type Note = {
  __typename?: 'Note';
  bodyText?: Maybe<Scalars['String']>;
  createdUserId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  noteType?: Maybe<NoteType>;
  noteTypeId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type NoteFilterInput = {
  and?: InputMaybe<Array<NoteFilterInput>>;
  bodyText?: InputMaybe<StringOperationFilterInput>;
  createdUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  noteType?: InputMaybe<NoteTypeFilterInput>;
  noteTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  or?: InputMaybe<Array<NoteFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type NoteInput = {
  BodyText?: InputMaybe<Scalars['String']>;
  CreatedUserId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NoteType?: InputMaybe<NoteTypeInput>;
  NoteTypeId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type NoteSortInput = {
  bodyText?: InputMaybe<SortEnumType>;
  createdUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  noteType?: InputMaybe<NoteTypeSortInput>;
  noteTypeId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type NoteType = {
  __typename?: 'NoteType';
  description?: Maybe<Scalars['String']>;
  enumId: NoteTypeEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export enum NoteTypeEnum {
  Child = 'CHILD',
  Report = 'REPORT',
  Unknown = 'UNKNOWN',
}

export type NoteTypeEnumOperationFilterInput = {
  eq?: InputMaybe<NoteTypeEnum>;
  in?: InputMaybe<Array<NoteTypeEnum>>;
  neq?: InputMaybe<NoteTypeEnum>;
  nin?: InputMaybe<Array<NoteTypeEnum>>;
};

export type NoteTypeFilterInput = {
  and?: InputMaybe<Array<NoteTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<NoteTypeEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<NoteTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type NoteTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: NoteTypeEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type NoteTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Notification = {
  __typename?: 'Notification';
  action?: Maybe<Scalars['String']>;
  cTA?: Maybe<Scalars['String']>;
  cTAText?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  fromUserId: Scalars['UUID'];
  id: Scalars['UUID'];
  message?: Maybe<Scalars['String']>;
  messageDate?: Maybe<Scalars['DateTime']>;
  messageEndDate?: Maybe<Scalars['DateTime']>;
  messageProtocol?: Maybe<Scalars['String']>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateType?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  readDate?: Maybe<Scalars['DateTime']>;
  relatedToUserId?: Maybe<Scalars['String']>;
  sentByUserId: Scalars['UUID'];
  status?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  toGroups?: Maybe<Scalars['String']>;
};

export type NotificationDisplay = {
  __typename?: 'NotificationDisplay';
  color?: Maybe<Scalars['String']>;
  groupingName?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type NotificationSortInput = {
  action?: InputMaybe<SortEnumType>;
  cTA?: InputMaybe<SortEnumType>;
  cTAText?: InputMaybe<SortEnumType>;
  from?: InputMaybe<SortEnumType>;
  fromUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  messageDate?: InputMaybe<SortEnumType>;
  messageEndDate?: InputMaybe<SortEnumType>;
  messageProtocol?: InputMaybe<SortEnumType>;
  messageTemplate?: InputMaybe<MessageTemplateSortInput>;
  messageTemplateType?: InputMaybe<SortEnumType>;
  ordering?: InputMaybe<SortEnumType>;
  readDate?: InputMaybe<SortEnumType>;
  relatedToUserId?: InputMaybe<SortEnumType>;
  sentByUserId?: InputMaybe<SortEnumType>;
  status?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  to?: InputMaybe<SortEnumType>;
  toGroups?: InputMaybe<SortEnumType>;
};

export type ObservationCategory = {
  __typename?: 'ObservationCategory';
  achievedLevelId: Scalars['Int'];
  categoryId: Scalars['Int'];
  missingTasks?: Maybe<Array<Maybe<CategoryTask>>>;
  status: Scalars['Int'];
  supportingTask?: Maybe<ProgressObservationCategorySupportingTask>;
  tasks?: Maybe<Array<Maybe<CategoryTask>>>;
};

export type ObservationCategorySummary = {
  __typename?: 'ObservationCategorySummary';
  achievedLevelId: Scalars['Int'];
  categoryId: Scalars['Int'];
  tasks?: Maybe<Array<Maybe<ObservationCategoryTaskSummary>>>;
};

export type ObservationCategoryTaskSummary = {
  __typename?: 'ObservationCategoryTaskSummary';
  levelId: Scalars['Int'];
  skillId: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type Pqa = {
  __typename?: 'PQA';
  dateOfVisit?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isFranchiseeHittingChildren?: Maybe<Scalars['Boolean']>;
  isSmartSpaceStillFine?: Maybe<Scalars['Boolean']>;
  isThereTooManyChildren?: Maybe<Scalars['Boolean']>;
  isVenueSafe?: Maybe<Scalars['Boolean']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
  wasSuccessful?: Maybe<Scalars['Boolean']>;
};

export type PqaFilterInput = {
  and?: InputMaybe<Array<PqaFilterInput>>;
  dateOfVisit?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isFranchiseeHittingChildren?: InputMaybe<BooleanOperationFilterInput>;
  isSmartSpaceStillFine?: InputMaybe<BooleanOperationFilterInput>;
  isThereTooManyChildren?: InputMaybe<BooleanOperationFilterInput>;
  isVenueSafe?: InputMaybe<BooleanOperationFilterInput>;
  latitude?: InputMaybe<StringOperationFilterInput>;
  longitude?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PqaFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  wasSuccessful?: InputMaybe<BooleanOperationFilterInput>;
};

export type PqaInput = {
  DateOfVisit?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFranchiseeHittingChildren?: InputMaybe<Scalars['Boolean']>;
  IsSmartSpaceStillFine?: InputMaybe<Scalars['Boolean']>;
  IsThereTooManyChildren?: InputMaybe<Scalars['Boolean']>;
  IsVenueSafe?: InputMaybe<Scalars['Boolean']>;
  Latitude?: InputMaybe<Scalars['String']>;
  Longitude?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
  WasSuccessful?: InputMaybe<Scalars['Boolean']>;
};

export type PqaRating = {
  __typename?: 'PQARating';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  linkedVisitId?: Maybe<Scalars['UUID']>;
  overallRating?: Maybe<Scalars['String']>;
  overallRatingColor?: Maybe<Scalars['String']>;
  overallRatingStars?: Maybe<Scalars['String']>;
  overallScore: Scalars['Float'];
  sections?: Maybe<Array<Maybe<PqaSectionRating>>>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visit?: Maybe<Visit>;
  visitId: Scalars['UUID'];
  visitName?: Maybe<Scalars['String']>;
  visitTypeName?: Maybe<Scalars['String']>;
};

export type PqaRatingFilterInput = {
  and?: InputMaybe<Array<PqaRatingFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedVisitId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<PqaRatingFilterInput>>;
  overallRating?: InputMaybe<StringOperationFilterInput>;
  overallRatingColor?: InputMaybe<StringOperationFilterInput>;
  overallRatingStars?: InputMaybe<StringOperationFilterInput>;
  overallScore?: InputMaybe<ComparableDoubleOperationFilterInput>;
  sections?: InputMaybe<ListFilterInputTypeOfPqaSectionRatingFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visit?: InputMaybe<VisitFilterInput>;
  visitId?: InputMaybe<ComparableGuidOperationFilterInput>;
  visitName?: InputMaybe<StringOperationFilterInput>;
  visitTypeName?: InputMaybe<StringOperationFilterInput>;
};

export type PqaRatingInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LinkedVisitId?: InputMaybe<Scalars['UUID']>;
  OverallRating?: InputMaybe<Scalars['String']>;
  OverallRatingColor?: InputMaybe<Scalars['String']>;
  OverallRatingStars?: InputMaybe<Scalars['String']>;
  OverallScore: Scalars['Float'];
  Sections?: InputMaybe<Array<InputMaybe<PqaSectionRatingInput>>>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Visit?: InputMaybe<VisitInput>;
  VisitId: Scalars['UUID'];
  VisitName?: InputMaybe<Scalars['String']>;
  VisitTypeName?: InputMaybe<Scalars['String']>;
};

export type PqaRatingSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  linkedVisitId?: InputMaybe<SortEnumType>;
  overallRating?: InputMaybe<SortEnumType>;
  overallRatingColor?: InputMaybe<SortEnumType>;
  overallRatingStars?: InputMaybe<SortEnumType>;
  overallScore?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visit?: InputMaybe<VisitSortInput>;
  visitId?: InputMaybe<SortEnumType>;
  visitName?: InputMaybe<SortEnumType>;
  visitTypeName?: InputMaybe<SortEnumType>;
};

export type PqaSectionRating = {
  __typename?: 'PQASectionRating';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  pQARating?: Maybe<PqaRating>;
  pQARatingId: Scalars['UUID'];
  sectionRating?: Maybe<Scalars['String']>;
  sectionRatingColor?: Maybe<Scalars['String']>;
  sectionScore: Scalars['Float'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitSection?: Maybe<Scalars['String']>;
};

export type PqaSectionRatingFilterInput = {
  and?: InputMaybe<Array<PqaSectionRatingFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PqaSectionRatingFilterInput>>;
  pQARating?: InputMaybe<PqaRatingFilterInput>;
  pQARatingId?: InputMaybe<ComparableGuidOperationFilterInput>;
  sectionRating?: InputMaybe<StringOperationFilterInput>;
  sectionRatingColor?: InputMaybe<StringOperationFilterInput>;
  sectionScore?: InputMaybe<ComparableDoubleOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitSection?: InputMaybe<StringOperationFilterInput>;
};

export type PqaSectionRatingInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  PQARating?: InputMaybe<PqaRatingInput>;
  PQARatingId: Scalars['UUID'];
  SectionRating?: InputMaybe<Scalars['String']>;
  SectionRatingColor?: InputMaybe<Scalars['String']>;
  SectionScore: Scalars['Float'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitSection?: InputMaybe<Scalars['String']>;
};

export type PqaSectionRatingSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  pQARating?: InputMaybe<PqaRatingSortInput>;
  pQARatingId?: InputMaybe<SortEnumType>;
  sectionRating?: InputMaybe<SortEnumType>;
  sectionRatingColor?: InputMaybe<SortEnumType>;
  sectionScore?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visitSection?: InputMaybe<SortEnumType>;
};

export type PqaSortInput = {
  dateOfVisit?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isFranchiseeHittingChildren?: InputMaybe<SortEnumType>;
  isSmartSpaceStillFine?: InputMaybe<SortEnumType>;
  isThereTooManyChildren?: InputMaybe<SortEnumType>;
  isVenueSafe?: InputMaybe<SortEnumType>;
  latitude?: InputMaybe<SortEnumType>;
  longitude?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  wasSuccessful?: InputMaybe<SortEnumType>;
};

export type PagedQueryInput = {
  filterBy?: InputMaybe<Array<InputMaybe<FilterByFieldInput>>>;
  pageNumber?: InputMaybe<Scalars['Int']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};

export type Permission = {
  __typename?: 'Permission';
  grouping?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  normalizedName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type PermissionFilterInput = {
  and?: InputMaybe<Array<PermissionFilterInput>>;
  grouping?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PermissionFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type PermissionGroupModel = {
  __typename?: 'PermissionGroupModel';
  groupName?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
};

export type PermissionInput = {
  Grouping?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type PermissionSortInput = {
  grouping?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type PointsActivityModel = {
  __typename?: 'PointsActivityModel';
  activityName?: Maybe<Scalars['String']>;
  pointsLibraryId: Scalars['UUID'];
  pointsTotal: Scalars['Int'];
  subActivityName?: Maybe<Scalars['String']>;
};

export type PointsLibrary = {
  __typename?: 'PointsLibrary';
  activity?: Maybe<Scalars['String']>;
  calculatedAtMonthEnd?: Maybe<Scalars['Boolean']>;
  calculatedAtYearEnd?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  maxPointsIndividualMonthly?: Maybe<Scalars['Int']>;
  maxPointsNonPrincipalMonthly: Scalars['Int'];
  maxPointsNonPrincipalYearly: Scalars['Int'];
  maxPointsPrincipalMonthly: Scalars['Int'];
  maxPointsPrincipalYearly: Scalars['Int'];
  points: Scalars['Int'];
  subActivity?: Maybe<Scalars['String']>;
  todoDescription?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type PointsLibraryFilterInput = {
  activity?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<PointsLibraryFilterInput>>;
  calculatedAtMonthEnd?: InputMaybe<BooleanOperationFilterInput>;
  calculatedAtYearEnd?: InputMaybe<BooleanOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  maxPointsIndividualMonthly?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  maxPointsNonPrincipalMonthly?: InputMaybe<ComparableInt32OperationFilterInput>;
  maxPointsNonPrincipalYearly?: InputMaybe<ComparableInt32OperationFilterInput>;
  maxPointsPrincipalMonthly?: InputMaybe<ComparableInt32OperationFilterInput>;
  maxPointsPrincipalYearly?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<PointsLibraryFilterInput>>;
  points?: InputMaybe<ComparableInt32OperationFilterInput>;
  subActivity?: InputMaybe<StringOperationFilterInput>;
  todoDescription?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type PointsLibraryInput = {
  Activity?: InputMaybe<Scalars['String']>;
  CalculatedAtMonthEnd?: InputMaybe<Scalars['Boolean']>;
  CalculatedAtYearEnd?: InputMaybe<Scalars['Boolean']>;
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MaxPointsIndividualMonthly?: InputMaybe<Scalars['Int']>;
  MaxPointsNonPrincipalMonthly: Scalars['Int'];
  MaxPointsNonPrincipalYearly: Scalars['Int'];
  MaxPointsPrincipalMonthly: Scalars['Int'];
  MaxPointsPrincipalYearly: Scalars['Int'];
  Points: Scalars['Int'];
  SubActivity?: InputMaybe<Scalars['String']>;
  TodoDescription?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type PointsLibrarySortInput = {
  activity?: InputMaybe<SortEnumType>;
  calculatedAtMonthEnd?: InputMaybe<SortEnumType>;
  calculatedAtYearEnd?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  maxPointsIndividualMonthly?: InputMaybe<SortEnumType>;
  maxPointsNonPrincipalMonthly?: InputMaybe<SortEnumType>;
  maxPointsNonPrincipalYearly?: InputMaybe<SortEnumType>;
  maxPointsPrincipalMonthly?: InputMaybe<SortEnumType>;
  maxPointsPrincipalYearly?: InputMaybe<SortEnumType>;
  points?: InputMaybe<SortEnumType>;
  subActivity?: InputMaybe<SortEnumType>;
  todoDescription?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type PointsUser = {
  __typename?: 'PointsUser';
  comment?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  points: Scalars['Int'];
  pointsLibrary?: Maybe<PointsLibrary>;
  pointsLibraryId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  year: Scalars['Int'];
};

export type PointsUserFilterInput = {
  and?: InputMaybe<Array<PointsUserFilterInput>>;
  comment?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<PointsUserFilterInput>>;
  points?: InputMaybe<ComparableInt32OperationFilterInput>;
  pointsLibrary?: InputMaybe<PointsLibraryFilterInput>;
  pointsLibraryId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type PointsUserInput = {
  Comment?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  Points: Scalars['Int'];
  PointsLibrary?: InputMaybe<PointsLibraryInput>;
  PointsLibraryId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type PointsUserSortInput = {
  comment?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  points?: InputMaybe<SortEnumType>;
  pointsLibrary?: InputMaybe<PointsLibrarySortInput>;
  pointsLibraryId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type PointsUserSummary = {
  __typename?: 'PointsUserSummary';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  pointsLibrary?: Maybe<PointsLibrary>;
  pointsLibraryId: Scalars['UUID'];
  pointsTotal: Scalars['Int'];
  pointsYTD: Scalars['Int'];
  timesScored: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  year: Scalars['Int'];
};

export type PointsUserSummaryFilterInput = {
  and?: InputMaybe<Array<PointsUserSummaryFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<PointsUserSummaryFilterInput>>;
  pointsLibrary?: InputMaybe<PointsLibraryFilterInput>;
  pointsLibraryId?: InputMaybe<ComparableGuidOperationFilterInput>;
  pointsTotal?: InputMaybe<ComparableInt32OperationFilterInput>;
  pointsYTD?: InputMaybe<ComparableInt32OperationFilterInput>;
  timesScored?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type PointsUserSummaryInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  PointsLibrary?: InputMaybe<PointsLibraryInput>;
  PointsLibraryId: Scalars['UUID'];
  PointsTotal: Scalars['Int'];
  PointsYTD: Scalars['Int'];
  TimesScored: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type PointsUserSummarySortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  pointsLibrary?: InputMaybe<PointsLibrarySortInput>;
  pointsLibraryId?: InputMaybe<SortEnumType>;
  pointsTotal?: InputMaybe<SortEnumType>;
  pointsYTD?: InputMaybe<SortEnumType>;
  timesScored?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type Practitioner = {
  __typename?: 'Practitioner';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  attendedBusinessSkills?: Maybe<Scalars['Boolean']>;
  attendedChildProgress?: Maybe<Scalars['Boolean']>;
  attendedFirstAidCourse?: Maybe<Scalars['Boolean']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isClubOwner?: Maybe<Scalars['Boolean']>;
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isOnStipend?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isPrincipalOrAdmin: Scalars['Boolean'];
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  leavingComment?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  reasonForLeaving?: Maybe<ReasonForPractitionerLeaving>;
  reasonForLeavingDetails?: Maybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: Maybe<Scalars['UUID']>;
  setupTraineeInitiated?: Maybe<Scalars['Boolean']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  stipendType?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PractitionerFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PractitionerAttendance = {
  __typename?: 'PractitionerAttendance';
  attendanceColor?: Maybe<Scalars['String']>;
  attendanceText?: Maybe<Scalars['String']>;
  meetingRegister?: Maybe<Array<Maybe<ClubMeetingRegister>>>;
  percAttended: Scalars['Float'];
  totalMeetings: Scalars['Int'];
  totalPresent: Scalars['Int'];
};

export type PractitionerClassProgressReportCategorySummary = {
  __typename?: 'PractitionerClassProgressReportCategorySummary';
  color?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subCategories?: Maybe<
    Array<Maybe<PractitionerClassProgressReportSubCategorySummary>>
  >;
};

export type PractitionerClassProgressReportSkillSummary = {
  __typename?: 'PractitionerClassProgressReportSkillSummary';
  childCount: Scalars['Int'];
  id: Scalars['Int'];
  skill?: Maybe<Scalars['String']>;
};

export type PractitionerClassProgressReportSubCategorySummary = {
  __typename?: 'PractitionerClassProgressReportSubCategorySummary';
  childrenPerSkill?: Maybe<
    Array<Maybe<PractitionerClassProgressReportSkillSummary>>
  >;
  id: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type PractitionerClassProgressReportSummaryModel = {
  __typename?: 'PractitionerClassProgressReportSummaryModel';
  categories?: Maybe<
    Array<Maybe<PractitionerClassProgressReportCategorySummary>>
  >;
  childCount: Scalars['Int'];
  className?: Maybe<Scalars['String']>;
  practitionerFullName?: Maybe<Scalars['String']>;
  practitionerUserId: Scalars['UUID'];
};

export type PractitionerClassroomName = {
  __typename?: 'PractitionerClassroomName';
  classRoomId: Scalars['UUID'];
  classroomGroupId: Scalars['UUID'];
  classroomName?: Maybe<Scalars['String']>;
  coachName?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
};

export type PractitionerColleagues = {
  __typename?: 'PractitionerColleagues';
  classroomNames?: Maybe<Scalars['String']>;
  contactNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nickName?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type PractitionerFilterInput = {
  and?: InputMaybe<Array<PractitionerFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  attendedBusinessSkills?: InputMaybe<BooleanOperationFilterInput>;
  attendedChildProgress?: InputMaybe<BooleanOperationFilterInput>;
  attendedFirstAidCourse?: InputMaybe<BooleanOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  dateAccepted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateLinked?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateToBeRemoved?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isClubOwner?: InputMaybe<BooleanOperationFilterInput>;
  isCompletedBusinessWalkThrough?: InputMaybe<BooleanOperationFilterInput>;
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
  isOnStipend?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  isTrainee?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  leavingComment?: InputMaybe<StringOperationFilterInput>;
  maxChildren?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  monthSinceFranchisee?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<PractitionerFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  principal?: InputMaybe<PractitionerFilterInput>;
  principalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  programmeType?: InputMaybe<StringOperationFilterInput>;
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
  reasonForLeavingDetails?: InputMaybe<StringOperationFilterInput>;
  reasonForPractitionerLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  setupTraineeInitiated?: InputMaybe<BooleanOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  stipendType?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PractitionerInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  AttendedBusinessSkills?: InputMaybe<Scalars['Boolean']>;
  AttendedChildProgress?: InputMaybe<Scalars['Boolean']>;
  AttendedFirstAidCourse?: InputMaybe<Scalars['Boolean']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsClubOwner?: InputMaybe<Scalars['Boolean']>;
  IsCompletedBusinessWalkThrough?: InputMaybe<Scalars['Boolean']>;
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsOnStipend?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  LeavingComment?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  ProgrammeType?: InputMaybe<Scalars['String']>;
  Progress: Scalars['Decimal'];
  ReasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingInput>;
  ReasonForLeavingDetails?: InputMaybe<Scalars['String']>;
  ReasonForPractitionerLeavingId?: InputMaybe<Scalars['UUID']>;
  SetupTraineeInitiated?: InputMaybe<Scalars['Boolean']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  StipendType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UsePhotoInReport?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type PractitionerMetricReport = {
  __typename?: 'PractitionerMetricReport';
  allChildren: Scalars['Int'];
  allClassroomGroups: Scalars['Int'];
  allClassrooms: Scalars['Int'];
  avgChildren: Scalars['Int'];
  completedProfiles: Scalars['Int'];
  outstandingSyncs: Scalars['Int'];
  programTypesData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  statusData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
};

export type PractitionerModel = {
  __typename?: 'PractitionerModel';
  absentees?: Maybe<Array<Maybe<AbsenteeDetail>>>;
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  attendedChildProgress?: Maybe<Scalars['Boolean']>;
  clubId?: Maybe<Scalars['UUID']>;
  clubName?: Maybe<Scalars['String']>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  daysAbsentLastMonth: Scalars['Int'];
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isNewInClub?: Maybe<Scalars['Boolean']>;
  isOnLeave: Scalars['Boolean'];
  isOnStipend?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  setupTraineeInitiated?: Maybe<Scalars['Boolean']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  startDate?: Maybe<Scalars['DateTime']>;
  stipendType?: Maybe<Scalars['String']>;
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId: Scalars['UUID'];
};

export type PractitionerNotes = {
  __typename?: 'PractitionerNotes';
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  answers?: Maybe<Array<Maybe<VisitData>>>;
  plannedVisitDate?: Maybe<Scalars['DateTime']>;
  visitName?: Maybe<Scalars['String']>;
};

export type PractitionerProgressReportSummaryModel = {
  __typename?: 'PractitionerProgressReportSummaryModel';
  classSummaries?: Maybe<
    Array<Maybe<PractitionerClassProgressReportSummaryModel>>
  >;
  reportingPeriod?: Maybe<Scalars['String']>;
};

export type PractitionerRemovalHistory = {
  __typename?: 'PractitionerRemovalHistory';
  classReassignments?: Maybe<Array<Maybe<Absentees>>>;
  classroomId: Scalars['UUID'];
  dateOfRemoval: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  reasonDetails?: Maybe<Scalars['String']>;
  reasonForPractitionerLeavingProgrammeId: Scalars['UUID'];
  removedByUserId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PractitionerRemovalHistoryFilterInput = {
  and?: InputMaybe<Array<PractitionerRemovalHistoryFilterInput>>;
  classReassignments?: InputMaybe<ListFilterInputTypeOfAbsenteesFilterInput>;
  classroomId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateOfRemoval?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PractitionerRemovalHistoryFilterInput>>;
  reasonDetails?: InputMaybe<StringOperationFilterInput>;
  reasonForPractitionerLeavingProgrammeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  removedByUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PractitionerRemovalHistoryInput = {
  ClassReassignments?: InputMaybe<Array<InputMaybe<AbsenteesInput>>>;
  ClassroomId: Scalars['UUID'];
  DateOfRemoval: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ReasonDetails?: InputMaybe<Scalars['String']>;
  ReasonForPractitionerLeavingProgrammeId: Scalars['UUID'];
  RemovedByUserId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type PractitionerRemovalHistorySortInput = {
  classroomId?: InputMaybe<SortEnumType>;
  dateOfRemoval?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  reasonDetails?: InputMaybe<SortEnumType>;
  reasonForPractitionerLeavingProgrammeId?: InputMaybe<SortEnumType>;
  removedByUserId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type PractitionerReportDetails = {
  __typename?: 'PractitionerReportDetails';
  classSiteAddress?: Maybe<Scalars['String']>;
  classroomGroupId?: Maybe<Scalars['String']>;
  classroomGroupName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
  programmeDays?: Maybe<Scalars['String']>;
  programmeTypeName?: Maybe<Scalars['String']>;
};

export type PractitionerSortInput = {
  attendanceRegisterLink?: InputMaybe<SortEnumType>;
  attendedBusinessSkills?: InputMaybe<SortEnumType>;
  attendedChildProgress?: InputMaybe<SortEnumType>;
  attendedFirstAidCourse?: InputMaybe<SortEnumType>;
  coach?: InputMaybe<CoachSortInput>;
  coachHierarchy?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  dateAccepted?: InputMaybe<SortEnumType>;
  dateLinked?: InputMaybe<SortEnumType>;
  dateToBeRemoved?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isClubOwner?: InputMaybe<SortEnumType>;
  isCompletedBusinessWalkThrough?: InputMaybe<SortEnumType>;
  isFundaAppAdmin?: InputMaybe<SortEnumType>;
  isLeaving?: InputMaybe<SortEnumType>;
  isOnStipend?: InputMaybe<SortEnumType>;
  isPrincipal?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  isTrainee?: InputMaybe<SortEnumType>;
  languageUsedInGroups?: InputMaybe<SortEnumType>;
  leavingComment?: InputMaybe<SortEnumType>;
  maxChildren?: InputMaybe<SortEnumType>;
  monthSinceFranchisee?: InputMaybe<SortEnumType>;
  parentFees?: InputMaybe<SortEnumType>;
  principal?: InputMaybe<PractitionerSortInput>;
  principalHierarchy?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<SortEnumType>;
  progress?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingSortInput>;
  reasonForLeavingDetails?: InputMaybe<SortEnumType>;
  reasonForPractitionerLeavingId?: InputMaybe<SortEnumType>;
  setupTraineeInitiated?: InputMaybe<SortEnumType>;
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  stipendType?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  usePhotoInReport?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type PractitionerTimeline = {
  __typename?: 'PractitionerTimeline';
  childProgressTrainingColor?: Maybe<Scalars['String']>;
  childProgressTrainingDate?: Maybe<Scalars['DateTime']>;
  childProgressTrainingStatus?: Maybe<Scalars['String']>;
  clubMeetings?: Maybe<PractitionerAttendance>;
  coachCircles?: Maybe<PractitionerAttendance>;
  consolidationMeetingColor?: Maybe<Scalars['String']>;
  consolidationMeetingDate?: Maybe<Scalars['DateTime']>;
  consolidationMeetingStatus?: Maybe<Scalars['String']>;
  firstAidCourseColor?: Maybe<Scalars['String']>;
  firstAidCourseStatus?: Maybe<Scalars['String']>;
  firstAidDate?: Maybe<Scalars['DateTime']>;
  pQARating1?: Maybe<PqaRating>;
  pQARating2?: Maybe<PqaRating>;
  pQARating3?: Maybe<PqaRating>;
  pQARatings?: Maybe<Array<Maybe<PqaRating>>>;
  pQASiteVisits?: Maybe<Array<Maybe<Visit>>>;
  practiceLicenseColor?: Maybe<Scalars['String']>;
  practiceLicenseDate?: Maybe<Scalars['DateTime']>;
  practiceLicenseStatus?: Maybe<Scalars['String']>;
  prePQASiteVisits?: Maybe<Array<Maybe<Visit>>>;
  prePQAVisitDate1?: Maybe<Scalars['DateTime']>;
  prePQAVisitDate1Color?: Maybe<Scalars['String']>;
  prePQAVisitDate1Status?: Maybe<Scalars['String']>;
  prePQAVisitDate2?: Maybe<Scalars['DateTime']>;
  prePQAVisitDate2Color?: Maybe<Scalars['String']>;
  prePQAVisitDate2Status?: Maybe<Scalars['String']>;
  reAccreditationRating1?: Maybe<PqaRating>;
  reAccreditationRating2?: Maybe<PqaRating>;
  reAccreditationRating3?: Maybe<PqaRating>;
  reAccreditationRatings?: Maybe<Array<Maybe<PqaRating>>>;
  reAccreditationVisits?: Maybe<Array<Maybe<Visit>>>;
  requestedCoachVisits?: Maybe<Array<Maybe<Visit>>>;
  selfAssessmentColor?: Maybe<Scalars['String']>;
  selfAssessmentDate?: Maybe<Scalars['DateTime']>;
  selfAssessmentStatus?: Maybe<Scalars['String']>;
  selfAssessmentVisits?: Maybe<Array<Maybe<Visit>>>;
  smartSpaceLicenseColor?: Maybe<Scalars['String']>;
  smartSpaceLicenseDate?: Maybe<Scalars['DateTime']>;
  smartSpaceLicenseStatus?: Maybe<Scalars['String']>;
  smartStarterUniteConferenceColor?: Maybe<Scalars['String']>;
  smartStarterUniteConferenceDate?: Maybe<Scalars['DateTime']>;
  smartStarterUniteConferenceStatus?: Maybe<Scalars['String']>;
  starterLicenseColor?: Maybe<Scalars['String']>;
  starterLicenseDate?: Maybe<Scalars['DateTime']>;
  starterLicenseStatus?: Maybe<Scalars['String']>;
  supportVisits?: Maybe<Array<Maybe<Visit>>>;
};

export type PractitionerUserAndNote = {
  __typename?: 'PractitionerUserAndNote';
  appUser?: Maybe<ApplicationUser>;
  note?: Maybe<Scalars['String']>;
};

export type Principal = {
  __typename?: 'Principal';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  attendedBusinessSkills?: Maybe<Scalars['Boolean']>;
  attendedChildProgress?: Maybe<Scalars['Boolean']>;
  attendedFirstAidCourse?: Maybe<Scalars['Boolean']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isClubOwner?: Maybe<Scalars['Boolean']>;
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isOnStipend?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  leavingComment?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  reasonForLeaving?: Maybe<ReasonForPractitionerLeaving>;
  reasonForLeavingDetails?: Maybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: Maybe<Scalars['UUID']>;
  setupTraineeInitiated?: Maybe<Scalars['Boolean']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  stipendType?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PrincipalFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PrincipalClassroom = {
  __typename?: 'PrincipalClassroom';
  classSiteAddress?: Maybe<Scalars['String']>;
  classSiteAddressId?: Maybe<Scalars['String']>;
  classroomGroupId?: Maybe<Scalars['String']>;
  classroomGroupName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  preschoolFeeAmount?: Maybe<Scalars['Float']>;
  preschoolFeeAmountLastUpdateDate?: Maybe<Scalars['DateTime']>;
  principalName?: Maybe<Scalars['String']>;
  programmeTypeId?: Maybe<Scalars['String']>;
  programmeTypeName?: Maybe<Scalars['String']>;
};

export type PrincipalFilterInput = {
  and?: InputMaybe<Array<PrincipalFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  attendedBusinessSkills?: InputMaybe<BooleanOperationFilterInput>;
  attendedChildProgress?: InputMaybe<BooleanOperationFilterInput>;
  attendedFirstAidCourse?: InputMaybe<BooleanOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  dateAccepted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateLinked?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateToBeRemoved?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isClubOwner?: InputMaybe<BooleanOperationFilterInput>;
  isCompletedBusinessWalkThrough?: InputMaybe<BooleanOperationFilterInput>;
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
  isOnStipend?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  isTrainee?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  leavingComment?: InputMaybe<StringOperationFilterInput>;
  maxChildren?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  monthSinceFranchisee?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<PrincipalFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  programmeType?: InputMaybe<StringOperationFilterInput>;
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
  reasonForLeavingDetails?: InputMaybe<StringOperationFilterInput>;
  reasonForPractitionerLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  setupTraineeInitiated?: InputMaybe<BooleanOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  stipendType?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PrincipalInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  AttendedBusinessSkills?: InputMaybe<Scalars['Boolean']>;
  AttendedChildProgress?: InputMaybe<Scalars['Boolean']>;
  AttendedFirstAidCourse?: InputMaybe<Scalars['Boolean']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsClubOwner?: InputMaybe<Scalars['Boolean']>;
  IsCompletedBusinessWalkThrough?: InputMaybe<Scalars['Boolean']>;
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsOnStipend?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  LeavingComment?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  ProgrammeType?: InputMaybe<Scalars['String']>;
  Progress: Scalars['Decimal'];
  ReasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingInput>;
  ReasonForLeavingDetails?: InputMaybe<Scalars['String']>;
  ReasonForPractitionerLeavingId?: InputMaybe<Scalars['UUID']>;
  SetupTraineeInitiated?: InputMaybe<Scalars['Boolean']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  StipendType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UsePhotoInReport?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type PrincipalInvitationStatus = {
  __typename?: 'PrincipalInvitationStatus';
  acceptedDate?: Maybe<Scalars['DateTime']>;
  leaving: Scalars['Boolean'];
  leavingDate?: Maybe<Scalars['DateTime']>;
  linkedDate?: Maybe<Scalars['DateTime']>;
};

export type PrincipalSortInput = {
  attendanceRegisterLink?: InputMaybe<SortEnumType>;
  attendedBusinessSkills?: InputMaybe<SortEnumType>;
  attendedChildProgress?: InputMaybe<SortEnumType>;
  attendedFirstAidCourse?: InputMaybe<SortEnumType>;
  coach?: InputMaybe<CoachSortInput>;
  coachHierarchy?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  dateAccepted?: InputMaybe<SortEnumType>;
  dateLinked?: InputMaybe<SortEnumType>;
  dateToBeRemoved?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isClubOwner?: InputMaybe<SortEnumType>;
  isCompletedBusinessWalkThrough?: InputMaybe<SortEnumType>;
  isFundaAppAdmin?: InputMaybe<SortEnumType>;
  isLeaving?: InputMaybe<SortEnumType>;
  isOnStipend?: InputMaybe<SortEnumType>;
  isPrincipal?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  isTrainee?: InputMaybe<SortEnumType>;
  languageUsedInGroups?: InputMaybe<SortEnumType>;
  leavingComment?: InputMaybe<SortEnumType>;
  maxChildren?: InputMaybe<SortEnumType>;
  monthSinceFranchisee?: InputMaybe<SortEnumType>;
  parentFees?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<SortEnumType>;
  progress?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingSortInput>;
  reasonForLeavingDetails?: InputMaybe<SortEnumType>;
  reasonForPractitionerLeavingId?: InputMaybe<SortEnumType>;
  setupTraineeInitiated?: InputMaybe<SortEnumType>;
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  stipendType?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  usePhotoInReport?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Programme = {
  __typename?: 'Programme';
  classroom?: Maybe<Classroom>;
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId?: Maybe<Scalars['UUID']>;
  classroomId: Scalars['UUID'];
  dailyProgrammes?: Maybe<Array<Maybe<DailyProgramme>>>;
  endDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  preferredLanguage?: Maybe<Scalars['String']>;
  startDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ProgrammeAttendanceReason = {
  __typename?: 'ProgrammeAttendanceReason';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ProgrammeAttendanceReasonFilterInput = {
  and?: InputMaybe<Array<ProgrammeAttendanceReasonFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ProgrammeAttendanceReasonFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ProgrammeAttendanceReasonInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Reason?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ProgrammeAttendanceReasonSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  reason?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ProgrammeFilterInput = {
  and?: InputMaybe<Array<ProgrammeFilterInput>>;
  classroom?: InputMaybe<ClassroomFilterInput>;
  classroomGroup?: InputMaybe<ClassroomGroupFilterInput>;
  classroomGroupId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  classroomId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dailyProgrammes?: InputMaybe<ListFilterInputTypeOfDailyProgrammeFilterInput>;
  endDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ProgrammeFilterInput>>;
  preferredLanguage?: InputMaybe<StringOperationFilterInput>;
  startDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ProgrammeInput = {
  ClassroomGroupId?: InputMaybe<Scalars['UUID']>;
  ClassroomId: Scalars['UUID'];
  EndDate: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  PreferredLanguage?: InputMaybe<Scalars['String']>;
  StartDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ProgrammeModelInput = {
  classroomGroupId?: InputMaybe<Scalars['UUID']>;
  classroomId: Scalars['UUID'];
  dailyProgrammes?: InputMaybe<Array<InputMaybe<DailyProgrammeModelInput>>>;
  endDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  name?: InputMaybe<Scalars['String']>;
  preferredLanguage?: InputMaybe<Scalars['String']>;
  startDate: Scalars['DateTime'];
};

export type ProgrammeRoutine = {
  __typename?: 'ProgrammeRoutine';
  description?: Maybe<Scalars['String']>;
  headerBanner?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  routineItems?: Maybe<Array<Maybe<ProgrammeRoutineItem>>>;
};

export type ProgrammeRoutineInput = {
  description?: InputMaybe<Scalars['String']>;
  headerBanner?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  routineItems?: InputMaybe<Scalars['String']>;
};

export type ProgrammeRoutineItem = {
  __typename?: 'ProgrammeRoutineItem';
  alert?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  iconBackgroundColor?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  imageBackgroundColor?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  routineSubItems?: Maybe<Array<Maybe<ProgrammeRoutineSubItem>>>;
  sequence?: Maybe<Scalars['String']>;
  timeSpan?: Maybe<Scalars['String']>;
};

export type ProgrammeRoutineItemInput = {
  alert?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  iconBackgroundColor?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  imageBackgroundColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  routineSubItems?: InputMaybe<Scalars['String']>;
  sequence?: InputMaybe<Scalars['String']>;
  timeSpan?: InputMaybe<Scalars['String']>;
};

export type ProgrammeRoutineSubItem = {
  __typename?: 'ProgrammeRoutineSubItem';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  imageBackgroundColor?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  timeSpan?: Maybe<Scalars['String']>;
};

export type ProgrammeRoutineSubItemInput = {
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  imageBackgroundColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  timeSpan?: InputMaybe<Scalars['String']>;
};

export type ProgrammeSortInput = {
  classroom?: InputMaybe<ClassroomSortInput>;
  classroomGroup?: InputMaybe<ClassroomGroupSortInput>;
  classroomGroupId?: InputMaybe<SortEnumType>;
  classroomId?: InputMaybe<SortEnumType>;
  endDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  preferredLanguage?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ProgrammeType = {
  __typename?: 'ProgrammeType';
  description?: Maybe<Scalars['String']>;
  enumId: ProgrammeTypeEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export enum ProgrammeTypeEnum {
  DayMother = 'DAY_MOTHER',
  Playgroup = 'PLAYGROUP',
  Preschool = 'PRESCHOOL',
  Unknown = 'UNKNOWN',
}

export type ProgrammeTypeEnumOperationFilterInput = {
  eq?: InputMaybe<ProgrammeTypeEnum>;
  in?: InputMaybe<Array<ProgrammeTypeEnum>>;
  neq?: InputMaybe<ProgrammeTypeEnum>;
  nin?: InputMaybe<Array<ProgrammeTypeEnum>>;
};

export type ProgrammeTypeFilterInput = {
  and?: InputMaybe<Array<ProgrammeTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<ProgrammeTypeEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ProgrammeTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ProgrammeTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: ProgrammeTypeEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ProgrammeTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ProgressObservationCategorySupportingTask = {
  __typename?: 'ProgressObservationCategorySupportingTask';
  taskDescription?: Maybe<Scalars['String']>;
  taskId: Scalars['Int'];
  todoText?: Maybe<Scalars['String']>;
};

export type ProgressSubCategoryModelInput = {
  name?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Array<InputMaybe<SubCategorySkillModelInput>>>;
  subCatId: Scalars['Int'];
};

export type ProgressTrackingCategory = {
  __typename?: 'ProgressTrackingCategory';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subCategories?: Maybe<Array<Maybe<ProgressTrackingSubCategory>>>;
  subTitle?: Maybe<Scalars['String']>;
};

export type ProgressTrackingCategoryInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  subCategories?: InputMaybe<Scalars['String']>;
  subTitle?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingLevel = {
  __typename?: 'ProgressTrackingLevel';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  imageUrlDim?: Maybe<Scalars['String']>;
  imageUrlDone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ProgressTrackingLevelInput = {
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  imageUrlDim?: InputMaybe<Scalars['String']>;
  imageUrlDone?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingSkill = {
  __typename?: 'ProgressTrackingSkill';
  id?: Maybe<Scalars['Int']>;
  level?: Maybe<Array<Maybe<ProgressTrackingLevel>>>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type ProgressTrackingSkillInput = {
  level?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingSubCategory = {
  __typename?: 'ProgressTrackingSubCategory';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageHexColor?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  skills?: Maybe<Array<Maybe<ProgressTrackingSkill>>>;
};

export type ProgressTrackingSubCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  imageHexColor?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Scalars['String']>;
};

export type Progress_VisitDataStatus = {
  __typename?: 'Progress_VisitDataStatus';
  growComment?: Maybe<Scalars['String']>;
  growCommentColor?: Maybe<Scalars['String']>;
  length?: Maybe<Scalars['String']>;
  lengthColor?: Maybe<Scalars['String']>;
  lengthComment?: Maybe<Scalars['String']>;
  muac?: Maybe<Scalars['String']>;
  muacColor?: Maybe<Scalars['String']>;
  muacComment?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['String']>;
  scoreColor?: Maybe<Scalars['String']>;
  scoreComment?: Maybe<Scalars['String']>;
  visitDataStatus?: Maybe<Array<Maybe<VisitDataStatus>>>;
  visitId?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['String']>;
  weightColor?: Maybe<Scalars['String']>;
  weightComment?: Maybe<Scalars['String']>;
};

export type Province = {
  __typename?: 'Province';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ProvinceFilterInput = {
  and?: InputMaybe<Array<ProvinceFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ProvinceFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ProvinceInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ProvinceModel = {
  __typename?: 'ProvinceModel';
  description?: Maybe<Scalars['String']>;
};

export type ProvinceSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Query = {
  __typename?: 'Query';
  GetAbsenteesById?: Maybe<Absentees>;
  GetActivityById: Array<Maybe<Activity>>;
  GetAllAbsentees?: Maybe<Array<Maybe<Absentees>>>;
  GetAllActivity: Array<Maybe<Activity>>;
  GetAllAuditLogType?: Maybe<Array<Maybe<AuditLogType>>>;
  GetAllCalendarEvent?: Maybe<Array<Maybe<CalendarEvent>>>;
  GetAllCalendarEventParticipant?: Maybe<
    Array<Maybe<CalendarEventParticipant>>
  >;
  GetAllCalendarEventType: Array<Maybe<CalendarEventType>>;
  GetAllCaregiver?: Maybe<Array<Maybe<Caregiver>>>;
  GetAllChild?: Maybe<Array<Maybe<Child>>>;
  GetAllChildProgressReport?: Maybe<Array<Maybe<ChildProgressReport>>>;
  GetAllClassProgramme?: Maybe<Array<Maybe<ClassProgramme>>>;
  GetAllClassReassignmentHistory?: Maybe<
    Array<Maybe<ClassReassignmentHistory>>
  >;
  GetAllClassroom?: Maybe<Array<Maybe<Classroom>>>;
  GetAllClassroomGroup?: Maybe<Array<Maybe<ClassroomGroup>>>;
  GetAllClinic?: Maybe<Array<Maybe<Clinic>>>;
  GetAllClinicLeague?: Maybe<Array<Maybe<ClinicLeague>>>;
  GetAllClinicTeamLead?: Maybe<Array<Maybe<ClinicTeamLead>>>;
  GetAllClub?: Maybe<Array<Maybe<Club>>>;
  GetAllClubActivityUpload?: Maybe<Array<Maybe<ClubActivityUpload>>>;
  GetAllClubActivityUploadType?: Maybe<Array<Maybe<ClubActivityUploadType>>>;
  GetAllClubLeader?: Maybe<Array<Maybe<ClubLeader>>>;
  GetAllClubMeeting?: Maybe<Array<Maybe<ClubMeeting>>>;
  GetAllClubMeetingRegister?: Maybe<Array<Maybe<ClubMeetingRegister>>>;
  GetAllClubMember?: Maybe<Array<Maybe<ClubMember>>>;
  GetAllClubPoints?: Maybe<Array<Maybe<ClubPoints>>>;
  GetAllClubPointsLibrary?: Maybe<Array<Maybe<ClubPointsLibrary>>>;
  GetAllClubSupport?: Maybe<Array<Maybe<ClubSupport>>>;
  GetAllCoach?: Maybe<Array<Maybe<Coach>>>;
  GetAllCoachingCircleTopics: Array<Maybe<CoachingCircleTopics>>;
  GetAllConnect: Array<Maybe<Connect>>;
  GetAllConnectItem: Array<Maybe<ConnectItem>>;
  GetAllConsent: Array<Maybe<Consent>>;
  GetAllDailyProgramme?: Maybe<Array<Maybe<DailyProgramme>>>;
  GetAllDistrict?: Maybe<Array<Maybe<District>>>;
  GetAllDocument?: Maybe<Array<Maybe<Document>>>;
  GetAllDocumentType?: Maybe<Array<Maybe<DocumentType>>>;
  GetAllEducation?: Maybe<Array<Maybe<Education>>>;
  GetAllEventRecord?: Maybe<Array<Maybe<EventRecord>>>;
  GetAllEventRecordType?: Maybe<Array<Maybe<EventRecordType>>>;
  GetAllFranchisor?: Maybe<Array<Maybe<Franchisor>>>;
  GetAllGender?: Maybe<Array<Maybe<Gender>>>;
  GetAllGrant?: Maybe<Array<Maybe<Grant>>>;
  GetAllHealthCareWorker?: Maybe<Array<Maybe<HealthCareWorker>>>;
  GetAllHealthPromotion: Array<Maybe<HealthPromotion>>;
  GetAllHierarchyEntity?: Maybe<Array<Maybe<HierarchyEntity>>>;
  GetAllIncomeStatements: Array<Maybe<IncomeStatements>>;
  GetAllInfant?: Maybe<Array<Maybe<Infant>>>;
  GetAllInfographics: Array<Maybe<Infographics>>;
  GetAllIntegrationAudit?: Maybe<Array<Maybe<IntegrationAudit>>>;
  GetAllIntegrationColumnMapping?: Maybe<
    Array<Maybe<IntegrationColumnMapping>>
  >;
  GetAllIntegrationEntityMapping?: Maybe<
    Array<Maybe<IntegrationEntityMapping>>
  >;
  GetAllIntegrationLog?: Maybe<Array<Maybe<IntegrationLog>>>;
  GetAllLanguage?: Maybe<Array<Maybe<Language>>>;
  GetAllLeague?: Maybe<Array<Maybe<League>>>;
  GetAllLeagueType?: Maybe<Array<Maybe<LeagueType>>>;
  GetAllLearner?: Maybe<Array<Maybe<Learner>>>;
  GetAllLicense?: Maybe<Array<Maybe<License>>>;
  GetAllLicenseType?: Maybe<Array<Maybe<LicenseType>>>;
  GetAllMeetingType?: Maybe<Array<Maybe<MeetingType>>>;
  GetAllMessageLog?: Maybe<Array<Maybe<MessageLog>>>;
  GetAllMessageTemplate?: Maybe<Array<Maybe<MessageTemplate>>>;
  GetAllMoreInformation: Array<Maybe<MoreInformation>>;
  GetAllMother?: Maybe<Array<Maybe<Mother>>>;
  GetAllNavigation?: Maybe<Array<Maybe<Navigation>>>;
  GetAllNote?: Maybe<Array<Maybe<Note>>>;
  GetAllNoteType?: Maybe<Array<Maybe<NoteType>>>;
  GetAllPQA?: Maybe<Array<Maybe<Pqa>>>;
  GetAllPQARating?: Maybe<Array<Maybe<PqaRating>>>;
  GetAllPQASectionRating?: Maybe<Array<Maybe<PqaSectionRating>>>;
  GetAllPermission?: Maybe<Array<Maybe<Permission>>>;
  GetAllPointsLibrary?: Maybe<Array<Maybe<PointsLibrary>>>;
  GetAllPointsUser?: Maybe<Array<Maybe<PointsUser>>>;
  GetAllPointsUserSummary?: Maybe<Array<Maybe<PointsUserSummary>>>;
  GetAllPractitioner?: Maybe<Array<Maybe<Practitioner>>>;
  GetAllPractitionerRemovalHistory?: Maybe<
    Array<Maybe<PractitionerRemovalHistory>>
  >;
  GetAllPrincipal?: Maybe<Array<Maybe<Principal>>>;
  GetAllProgramme?: Maybe<Array<Maybe<Programme>>>;
  GetAllProgrammeAttendanceReason?: Maybe<
    Array<Maybe<ProgrammeAttendanceReason>>
  >;
  GetAllProgrammeRoutine: Array<Maybe<ProgrammeRoutine>>;
  GetAllProgrammeRoutineItem: Array<Maybe<ProgrammeRoutineItem>>;
  GetAllProgrammeRoutineSubItem: Array<Maybe<ProgrammeRoutineSubItem>>;
  GetAllProgrammeType?: Maybe<Array<Maybe<ProgrammeType>>>;
  GetAllProgressTrackingCategory: Array<Maybe<ProgressTrackingCategory>>;
  GetAllProgressTrackingLevel: Array<Maybe<ProgressTrackingLevel>>;
  GetAllProgressTrackingSkill: Array<Maybe<ProgressTrackingSkill>>;
  GetAllProgressTrackingSubCategory: Array<Maybe<ProgressTrackingSubCategory>>;
  GetAllProvince?: Maybe<Array<Maybe<Province>>>;
  GetAllRace?: Maybe<Array<Maybe<Race>>>;
  GetAllReasonForLeaving?: Maybe<Array<Maybe<ReasonForLeaving>>>;
  GetAllReasonForPractitionerLeaving?: Maybe<
    Array<Maybe<ReasonForPractitionerLeaving>>
  >;
  GetAllReasonForPractitionerLeavingProgramme?: Maybe<
    Array<Maybe<ReasonForPractitionerLeavingProgramme>>
  >;
  GetAllRelation?: Maybe<Array<Maybe<Relation>>>;
  GetAllShortenUrlEntity?: Maybe<Array<Maybe<ShortenUrlEntity>>>;
  GetAllSiteAddress?: Maybe<Array<Maybe<SiteAddress>>>;
  GetAllSmartSpaceVisit?: Maybe<Array<Maybe<SmartSpaceVisit>>>;
  GetAllStatementsContributionType?: Maybe<
    Array<Maybe<StatementsContributionType>>
  >;
  GetAllStatementsExpenseType?: Maybe<Array<Maybe<StatementsExpenseType>>>;
  GetAllStatementsExpenses?: Maybe<Array<Maybe<StatementsExpenses>>>;
  GetAllStatementsFeeType?: Maybe<Array<Maybe<StatementsFeeType>>>;
  GetAllStatementsIncome?: Maybe<Array<Maybe<StatementsIncome>>>;
  GetAllStatementsIncomeStatement?: Maybe<
    Array<Maybe<StatementsIncomeStatement>>
  >;
  GetAllStatementsIncomeType?: Maybe<Array<Maybe<StatementsIncomeType>>>;
  GetAllStatementsPayType?: Maybe<Array<Maybe<StatementsPayType>>>;
  GetAllStatementsStartupSupport?: Maybe<
    Array<Maybe<StatementsStartupSupport>>
  >;
  GetAllStoryBook: Array<Maybe<StoryBook>>;
  GetAllStoryBookPartQuestion: Array<Maybe<StoryBookPartQuestion>>;
  GetAllStoryBookParts: Array<Maybe<StoryBookParts>>;
  GetAllSubDistrict?: Maybe<Array<Maybe<SubDistrict>>>;
  GetAllSystemSetting?: Maybe<Array<Maybe<SystemSetting>>>;
  GetAllTeamLead?: Maybe<Array<Maybe<TeamLead>>>;
  GetAllTheme: Array<Maybe<Theme>>;
  GetAllThemeDay: Array<Maybe<ThemeDay>>;
  GetAllTrainee?: Maybe<Array<Maybe<Trainee>>>;
  GetAllUserConsent?: Maybe<Array<Maybe<UserConsent>>>;
  GetAllUserHierarchyEntity?: Maybe<Array<Maybe<UserHierarchyEntity>>>;
  GetAllVisit?: Maybe<Array<Maybe<Visit>>>;
  GetAllVisitBackReferral?: Maybe<Array<Maybe<VisitBackReferral>>>;
  GetAllVisitData?: Maybe<Array<Maybe<VisitData>>>;
  GetAllVisitDataStatus?: Maybe<Array<Maybe<VisitDataStatus>>>;
  GetAllVisitGrowthDataDay?: Maybe<Array<Maybe<VisitGrowthDataDay>>>;
  GetAllVisitGrowthDataHeight?: Maybe<Array<Maybe<VisitGrowthDataHeight>>>;
  GetAllVisitType?: Maybe<Array<Maybe<VisitType>>>;
  GetAllVisitVideos: Array<Maybe<VisitVideos>>;
  GetAllWorkflowStatus?: Maybe<Array<Maybe<WorkflowStatus>>>;
  GetAllWorkflowStatusType?: Maybe<Array<Maybe<WorkflowStatusType>>>;
  GetAuditLogTypeById?: Maybe<AuditLogType>;
  GetCalendarEventById?: Maybe<CalendarEvent>;
  GetCalendarEventParticipantById?: Maybe<CalendarEventParticipant>;
  GetCalendarEventTypeById: Array<Maybe<CalendarEventType>>;
  GetCaregiverById?: Maybe<Caregiver>;
  GetChildById?: Maybe<Child>;
  GetChildProgressReportById?: Maybe<ChildProgressReport>;
  GetClassProgrammeById?: Maybe<ClassProgramme>;
  GetClassReassignmentHistoryById?: Maybe<ClassReassignmentHistory>;
  GetClassroomById?: Maybe<Classroom>;
  GetClassroomGroupById?: Maybe<ClassroomGroup>;
  GetClinicById?: Maybe<Clinic>;
  GetClinicLeagueById?: Maybe<ClinicLeague>;
  GetClinicTeamLeadById?: Maybe<ClinicTeamLead>;
  GetClubActivityUploadById?: Maybe<ClubActivityUpload>;
  GetClubActivityUploadTypeById?: Maybe<ClubActivityUploadType>;
  GetClubById?: Maybe<Club>;
  GetClubLeaderById?: Maybe<ClubLeader>;
  GetClubMeetingById?: Maybe<ClubMeeting>;
  GetClubMeetingRegisterById?: Maybe<ClubMeetingRegister>;
  GetClubMemberById?: Maybe<ClubMember>;
  GetClubPointsById?: Maybe<ClubPoints>;
  GetClubPointsLibraryById?: Maybe<ClubPointsLibrary>;
  GetClubSupportById?: Maybe<ClubSupport>;
  GetCoachById?: Maybe<Coach>;
  GetCoachingCircleTopicsById: Array<Maybe<CoachingCircleTopics>>;
  GetConnectById: Array<Maybe<Connect>>;
  GetConnectItemById: Array<Maybe<ConnectItem>>;
  GetConsentById: Array<Maybe<Consent>>;
  GetDailyProgrammeById?: Maybe<DailyProgramme>;
  GetDistrictById?: Maybe<District>;
  GetDocumentById?: Maybe<Document>;
  GetDocumentTypeById?: Maybe<DocumentType>;
  GetEducationById?: Maybe<Education>;
  GetEventRecordById?: Maybe<EventRecord>;
  GetEventRecordTypeById?: Maybe<EventRecordType>;
  GetFranchisorById?: Maybe<Franchisor>;
  GetGenderById?: Maybe<Gender>;
  GetGrantById?: Maybe<Grant>;
  GetHealthCareWorkerById?: Maybe<HealthCareWorker>;
  GetHealthPromotionById: Array<Maybe<HealthPromotion>>;
  GetHierarchyEntityById?: Maybe<HierarchyEntity>;
  GetIncomeStatementsById: Array<Maybe<IncomeStatements>>;
  GetInfantById?: Maybe<Infant>;
  GetInfographicsById: Array<Maybe<Infographics>>;
  GetIntegrationAuditById?: Maybe<IntegrationAudit>;
  GetIntegrationColumnMappingById?: Maybe<IntegrationColumnMapping>;
  GetIntegrationEntityMappingById?: Maybe<IntegrationEntityMapping>;
  GetIntegrationLogById?: Maybe<IntegrationLog>;
  GetLanguageById?: Maybe<Language>;
  GetLeagueById?: Maybe<League>;
  GetLeagueTypeById?: Maybe<LeagueType>;
  GetLearnerById?: Maybe<Learner>;
  GetLicenseById?: Maybe<License>;
  GetLicenseTypeById?: Maybe<LicenseType>;
  GetMeetingTypeById?: Maybe<MeetingType>;
  GetMessageLogById?: Maybe<MessageLog>;
  GetMessageTemplateById?: Maybe<MessageTemplate>;
  GetMoreInformationById: Array<Maybe<MoreInformation>>;
  GetMotherById?: Maybe<Mother>;
  GetNavigationById?: Maybe<Navigation>;
  GetNoteById?: Maybe<Note>;
  GetNoteTypeById?: Maybe<NoteType>;
  GetPQAById?: Maybe<Pqa>;
  GetPQARatingById?: Maybe<PqaRating>;
  GetPQASectionRatingById?: Maybe<PqaSectionRating>;
  GetPermissionById?: Maybe<Permission>;
  GetPointsLibraryById?: Maybe<PointsLibrary>;
  GetPointsUserById?: Maybe<PointsUser>;
  GetPointsUserSummaryById?: Maybe<PointsUserSummary>;
  GetPractitionerById?: Maybe<Practitioner>;
  GetPractitionerRemovalHistoryById?: Maybe<PractitionerRemovalHistory>;
  GetPrincipalById?: Maybe<Principal>;
  GetProgrammeAttendanceReasonById?: Maybe<ProgrammeAttendanceReason>;
  GetProgrammeById?: Maybe<Programme>;
  GetProgrammeRoutineById: Array<Maybe<ProgrammeRoutine>>;
  GetProgrammeRoutineItemById: Array<Maybe<ProgrammeRoutineItem>>;
  GetProgrammeRoutineSubItemById: Array<Maybe<ProgrammeRoutineSubItem>>;
  GetProgrammeTypeById?: Maybe<ProgrammeType>;
  GetProgressTrackingCategoryById: Array<Maybe<ProgressTrackingCategory>>;
  GetProgressTrackingLevelById: Array<Maybe<ProgressTrackingLevel>>;
  GetProgressTrackingSkillById: Array<Maybe<ProgressTrackingSkill>>;
  GetProgressTrackingSubCategoryById: Array<Maybe<ProgressTrackingSubCategory>>;
  GetProvinceById?: Maybe<Province>;
  GetRaceById?: Maybe<Race>;
  GetReasonForLeavingById?: Maybe<ReasonForLeaving>;
  GetReasonForPractitionerLeavingById?: Maybe<ReasonForPractitionerLeaving>;
  GetReasonForPractitionerLeavingProgrammeById?: Maybe<ReasonForPractitionerLeavingProgramme>;
  GetRelationById?: Maybe<Relation>;
  GetShortenUrlEntityById?: Maybe<ShortenUrlEntity>;
  GetSiteAddressById?: Maybe<SiteAddress>;
  GetSmartSpaceVisitById?: Maybe<SmartSpaceVisit>;
  GetStatementsContributionTypeById?: Maybe<StatementsContributionType>;
  GetStatementsExpenseTypeById?: Maybe<StatementsExpenseType>;
  GetStatementsExpensesById?: Maybe<StatementsExpenses>;
  GetStatementsFeeTypeById?: Maybe<StatementsFeeType>;
  GetStatementsIncomeById?: Maybe<StatementsIncome>;
  GetStatementsIncomeStatementById?: Maybe<StatementsIncomeStatement>;
  GetStatementsIncomeTypeById?: Maybe<StatementsIncomeType>;
  GetStatementsPayTypeById?: Maybe<StatementsPayType>;
  GetStatementsStartupSupportById?: Maybe<StatementsStartupSupport>;
  GetStoryBookById: Array<Maybe<StoryBook>>;
  GetStoryBookPartQuestionById: Array<Maybe<StoryBookPartQuestion>>;
  GetStoryBookPartsById: Array<Maybe<StoryBookParts>>;
  GetSubDistrictById?: Maybe<SubDistrict>;
  GetSystemSettingById?: Maybe<SystemSetting>;
  GetTeamLeadById?: Maybe<TeamLead>;
  GetThemeById: Array<Maybe<Theme>>;
  GetThemeDayById: Array<Maybe<ThemeDay>>;
  GetTraineeById?: Maybe<Trainee>;
  GetUserConsentById?: Maybe<UserConsent>;
  GetUserHierarchyEntityById?: Maybe<UserHierarchyEntity>;
  GetVisitBackReferralById?: Maybe<VisitBackReferral>;
  GetVisitById?: Maybe<Visit>;
  GetVisitDataById?: Maybe<VisitData>;
  GetVisitDataStatusById?: Maybe<VisitDataStatus>;
  GetVisitGrowthDataDayById?: Maybe<VisitGrowthDataDay>;
  GetVisitGrowthDataHeightById?: Maybe<VisitGrowthDataHeight>;
  GetVisitTypeById?: Maybe<VisitType>;
  GetVisitVideosById: Array<Maybe<VisitVideos>>;
  GetWorkflowStatusById?: Maybe<WorkflowStatus>;
  GetWorkflowStatusTypeById?: Maybe<WorkflowStatusType>;
  absenteeByUserId?: Maybe<Array<Maybe<Absentees>>>;
  absentees?: Maybe<Array<Maybe<Absentees>>>;
  actionItemAgeSpread?: Maybe<AgeSpreadDisplay>;
  actionItemChildProgress?: Maybe<Array<Maybe<ChildProgressDisplay>>>;
  actionItemClassReassignmentHistory?: Maybe<
    Array<Maybe<ClassReassignmentDisplay>>
  >;
  actionItemMissedProgressReports?: Maybe<ActionItemMissedProgressReportsDisplay>;
  activityBeCreativeDetails?: Maybe<ActivityBeCreative>;
  activityChildAttendance?: Maybe<ActivityChildAttendance>;
  activityChildProgress?: Maybe<ActivityChildProgress>;
  activityHostFamilyDetails?: Maybe<ActivityHostFamilyDays>;
  activityLeaveNoOneBehindDetails?: Maybe<ActivityLeaveNoOneBehind>;
  activityMeetRegularDetails?: Maybe<ActivityMeetRegular>;
  allCaregiver?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiverByPractitioner?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiversForHCW?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiversForHealthCareWorker?: Maybe<Array<Maybe<Caregiver>>>;
  allChildrenByRole?: Maybe<Array<Maybe<Child>>>;
  allChildrenForCoach?: Maybe<Array<Maybe<Child>>>;
  allChildrenForFranchisor?: Maybe<Array<Maybe<Child>>>;
  allChildrenForPractitioner?: Maybe<Array<Maybe<Child>>>;
  allChildrenForPrincipal?: Maybe<Array<Maybe<Child>>>;
  allChildrenUnderPrincipal?: Maybe<Array<Maybe<Child>>>;
  allChildrenUnderPrincipalByClassrooms?: Maybe<Array<Maybe<Child>>>;
  allClassroomGroupsByPrincipal?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomGroupsForCoach?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomGroupsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomsForCoach?: Maybe<Array<Maybe<Classroom>>>;
  allClassroomsForPractitioner?: Maybe<Array<Maybe<Classroom>>>;
  allClassroomsForPrincipal?: Maybe<Array<Maybe<Classroom>>>;
  allClientRecords?: Maybe<Array<Maybe<Document>>>;
  allClinics?: Maybe<Array<Maybe<Clinic>>>;
  allClubsForCoachSimple?: Maybe<Array<Maybe<CoachingClubBase>>>;
  allCoachesForFranchisor?: Maybe<Array<Maybe<Coach>>>;
  allCoachingCircleClubsForCoach?: Maybe<CircleTabClubs>;
  allContentLanguages?: Maybe<Array<Maybe<Language>>>;
  allDocument?: Maybe<Array<Maybe<Document>>>;
  allEventRecordTypes?: Maybe<Array<Maybe<EventRecordType>>>;
  allEventRecordTypesForType?: Maybe<Array<Maybe<EventRecordType>>>;
  allHealthCareWorkers?: Maybe<Array<Maybe<HealthCareWorker>>>;
  allInfants?: Maybe<Array<Maybe<Infant>>>;
  allInfantsForHealthCareWorker?: Maybe<Array<Maybe<Infant>>>;
  allMessageLogsForAdmin?: Maybe<Array<Maybe<MessageLogModel>>>;
  allMothers?: Maybe<Array<Maybe<Mother>>>;
  allMothersForHealthCareWorker?: Maybe<Array<Maybe<Mother>>>;
  allNotifications?: Maybe<Array<Maybe<Notification>>>;
  allPractitionerInvites?: Maybe<Array<Scalars['DateTime']>>;
  allPractitioners?: Maybe<Array<Maybe<PractitionerModel>>>;
  allPractitionersForCoach?: Maybe<Array<Maybe<CoachPractitioner>>>;
  allPractitionersForPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipals?: Maybe<Array<Maybe<Principal>>>;
  allTeamLeads?: Maybe<Array<Maybe<TeamLead>>>;
  allTemplates?: Maybe<Array<Maybe<MessageTemplate>>>;
  allWards?: Maybe<Array<Maybe<WardModel>>>;
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  backReferralsForInfant?: Maybe<Array<Maybe<VisitBackReferral>>>;
  backReferralsForMother?: Maybe<Array<Maybe<VisitBackReferral>>>;
  caregiverClients?: Maybe<CaregiverClients>;
  caregiverGrants?: Maybe<Array<Maybe<UserGrant>>>;
  changesToSync: Scalars['Boolean'];
  childAttendanceReport?: Maybe<ChildAttendanceReportModel>;
  childByUserId?: Maybe<Child>;
  childCreatedByDetail?: Maybe<ChildCreatedByDetail>;
  childProgressReport?: Maybe<ChildProgressReportDetailedModel>;
  childProgressReportSummary?: Maybe<
    Array<Maybe<ChildProgressReportSummaryModel>>
  >;
  childProgressReports?: Maybe<Array<Maybe<ChildProgressReportDetailedModel>>>;
  childProgressReportsStatus?: Maybe<ChildProgressReportsStatus>;
  childrenAttendedVsAbsentMetrics?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  childrenByClassroomId?: Maybe<Array<Maybe<Child>>>;
  childrenMetrics?: Maybe<ChildrenMetricReport>;
  classAttendanceMetrics?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classAttendanceMetricsByUser?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classroomActionItems?: Maybe<Array<Maybe<NotificationDisplay>>>;
  classroomAttendanceOverviewReport?: Maybe<ClassroomGroupChildAttendanceReportOverviewModel>;
  classroomAttendanceReport?: Maybe<
    Array<Maybe<ClassroomGroupChildAttendanceReportModel>>
  >;
  classroomDetailsForPractitioner?: Maybe<PrincipalClassroom>;
  classroomGroupClassroomsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  classroomNamesForPractitioner?: Maybe<
    Array<Maybe<PractitionerClassroomName>>
  >;
  clinicById?: Maybe<ClinicModel>;
  clubById?: Maybe<DetailClubModel>;
  clubForUser?: Maybe<DetailClubModel>;
  clubMeetingsWithMissingRegisters?: Maybe<Array<Maybe<ClubMeeting>>>;
  clubsForCoach?: Maybe<Array<Maybe<DetailClubModel>>>;
  clubsMembers?: Maybe<Array<Maybe<ClubMember>>>;
  coachByCoachUserId?: Maybe<Coach>;
  coachByPractitionerId?: Maybe<Coach>;
  coachByUserId?: Maybe<Coach>;
  coachNameByUserId?: Maybe<Scalars['String']>;
  completedReferralsForInfant?: Maybe<Array<Maybe<VisitDataStatus>>>;
  completedReferralsForMother?: Maybe<Array<Maybe<VisitDataStatus>>>;
  completedVisitsForVisitId?: Maybe<Array<Maybe<Scalars['String']>>>;
  contentDefinitions?: Maybe<Array<Maybe<ContentDefinitionModel>>>;
  contentDefinitionsExcelTemplateGenerator?: Maybe<FileModel>;
  contentTypes?: Maybe<Array<Maybe<ContentType>>>;
  contentTypesWithLanguages?: Maybe<Array<Maybe<ContentTypeWithLanguages>>>;
  countAbsentees?: Maybe<Scalars['Int']>;
  countAuditLogType?: Maybe<Scalars['Int']>;
  countCalendarEvent?: Maybe<Scalars['Int']>;
  countCalendarEventParticipant?: Maybe<Scalars['Int']>;
  countCaregiver?: Maybe<Scalars['Int']>;
  countChild?: Maybe<Scalars['Int']>;
  countChildProgressReport?: Maybe<Scalars['Int']>;
  countClassProgramme?: Maybe<Scalars['Int']>;
  countClassReassignmentHistory?: Maybe<Scalars['Int']>;
  countClassroom?: Maybe<Scalars['Int']>;
  countClassroomGroup?: Maybe<Scalars['Int']>;
  countClinic?: Maybe<Scalars['Int']>;
  countClinicLeague?: Maybe<Scalars['Int']>;
  countClinicTeamLead?: Maybe<Scalars['Int']>;
  countClub?: Maybe<Scalars['Int']>;
  countClubActivityUpload?: Maybe<Scalars['Int']>;
  countClubActivityUploadType?: Maybe<Scalars['Int']>;
  countClubLeader?: Maybe<Scalars['Int']>;
  countClubMeeting?: Maybe<Scalars['Int']>;
  countClubMeetingRegister?: Maybe<Scalars['Int']>;
  countClubMember?: Maybe<Scalars['Int']>;
  countClubPoints?: Maybe<Scalars['Int']>;
  countClubPointsLibrary?: Maybe<Scalars['Int']>;
  countClubSupport?: Maybe<Scalars['Int']>;
  countCoach?: Maybe<Scalars['Int']>;
  countDailyProgramme?: Maybe<Scalars['Int']>;
  countDistrict?: Maybe<Scalars['Int']>;
  countDocument?: Maybe<Scalars['Int']>;
  countDocumentType?: Maybe<Scalars['Int']>;
  countEducation?: Maybe<Scalars['Int']>;
  countEventRecord?: Maybe<Scalars['Int']>;
  countEventRecordType?: Maybe<Scalars['Int']>;
  countFranchisor?: Maybe<Scalars['Int']>;
  countGender?: Maybe<Scalars['Int']>;
  countGrant?: Maybe<Scalars['Int']>;
  countHealthCareWorker?: Maybe<Scalars['Int']>;
  countHealthCareWorkers: Scalars['Int'];
  countHierarchyEntity?: Maybe<Scalars['Int']>;
  countInfant?: Maybe<Scalars['Int']>;
  countIntegrationAudit?: Maybe<Scalars['Int']>;
  countIntegrationColumnMapping?: Maybe<Scalars['Int']>;
  countIntegrationEntityMapping?: Maybe<Scalars['Int']>;
  countIntegrationLog?: Maybe<Scalars['Int']>;
  countLanguage?: Maybe<Scalars['Int']>;
  countLeague?: Maybe<Scalars['Int']>;
  countLeagueType?: Maybe<Scalars['Int']>;
  countLearner?: Maybe<Scalars['Int']>;
  countLicense?: Maybe<Scalars['Int']>;
  countLicenseType?: Maybe<Scalars['Int']>;
  countMeetingType?: Maybe<Scalars['Int']>;
  countMessageLog?: Maybe<Scalars['Int']>;
  countMessageTemplate?: Maybe<Scalars['Int']>;
  countMother?: Maybe<Scalars['Int']>;
  countNavigation?: Maybe<Scalars['Int']>;
  countNote?: Maybe<Scalars['Int']>;
  countNoteType?: Maybe<Scalars['Int']>;
  countPQA?: Maybe<Scalars['Int']>;
  countPQARating?: Maybe<Scalars['Int']>;
  countPQASectionRating?: Maybe<Scalars['Int']>;
  countPermission?: Maybe<Scalars['Int']>;
  countPointsLibrary?: Maybe<Scalars['Int']>;
  countPointsUser?: Maybe<Scalars['Int']>;
  countPointsUserSummary?: Maybe<Scalars['Int']>;
  countPractitioner?: Maybe<Scalars['Int']>;
  countPractitionerRemovalHistory?: Maybe<Scalars['Int']>;
  countPrincipal?: Maybe<Scalars['Int']>;
  countProgramme?: Maybe<Scalars['Int']>;
  countProgrammeAttendanceReason?: Maybe<Scalars['Int']>;
  countProgrammeType?: Maybe<Scalars['Int']>;
  countProvince?: Maybe<Scalars['Int']>;
  countRace?: Maybe<Scalars['Int']>;
  countReasonForLeaving?: Maybe<Scalars['Int']>;
  countReasonForPractitionerLeaving?: Maybe<Scalars['Int']>;
  countReasonForPractitionerLeavingProgramme?: Maybe<Scalars['Int']>;
  countRelation?: Maybe<Scalars['Int']>;
  countShortenUrlEntity?: Maybe<Scalars['Int']>;
  countSiteAddress?: Maybe<Scalars['Int']>;
  countSmartSpaceVisit?: Maybe<Scalars['Int']>;
  countStatementsContributionType?: Maybe<Scalars['Int']>;
  countStatementsExpenseType?: Maybe<Scalars['Int']>;
  countStatementsExpenses?: Maybe<Scalars['Int']>;
  countStatementsFeeType?: Maybe<Scalars['Int']>;
  countStatementsIncome?: Maybe<Scalars['Int']>;
  countStatementsIncomeStatement?: Maybe<Scalars['Int']>;
  countStatementsIncomeType?: Maybe<Scalars['Int']>;
  countStatementsPayType?: Maybe<Scalars['Int']>;
  countStatementsStartupSupport?: Maybe<Scalars['Int']>;
  countSubDistrict?: Maybe<Scalars['Int']>;
  countSystemSetting?: Maybe<Scalars['Int']>;
  countTeamLead?: Maybe<Scalars['Int']>;
  countTeamLeads: Scalars['Int'];
  countTrainee?: Maybe<Scalars['Int']>;
  countUserConsent?: Maybe<Scalars['Int']>;
  countUserHierarchyEntity?: Maybe<Scalars['Int']>;
  countUsers: Scalars['Int'];
  countVisit?: Maybe<Scalars['Int']>;
  countVisitBackReferral?: Maybe<Scalars['Int']>;
  countVisitData?: Maybe<Scalars['Int']>;
  countVisitDataStatus?: Maybe<Scalars['Int']>;
  countVisitGrowthDataDay?: Maybe<Scalars['Int']>;
  countVisitGrowthDataHeight?: Maybe<Scalars['Int']>;
  countVisitType?: Maybe<Scalars['Int']>;
  countWorkflowStatus?: Maybe<Scalars['Int']>;
  countWorkflowStatusType?: Maybe<Scalars['Int']>;
  dailyAttendance?: Maybe<Array<Maybe<Attendance>>>;
  displayMetrics?: Maybe<Array<Maybe<NotificationDisplay>>>;
  districtsAndStats?: Maybe<Array<Maybe<DistrictStatsModel>>>;
  documentsForHCW?: Maybe<Array<Maybe<Document>>>;
  entityChangesToSync?: Maybe<Array<Maybe<Scalars['String']>>>;
  franchisorByUserId?: Maybe<Franchisor>;
  franchisorSiteAddressById?: Maybe<SiteAddress>;
  generateChildProgressReport?: Maybe<Scalars['String']>;
  getMoodleSessionForUserId?: Maybe<Scalars['String']>;
  growthDataForInfant?: Maybe<Array<Maybe<VisitData>>>;
  hasContentTypeBeenTranslated: Scalars['Boolean'];
  healthCareWorkerByUserId?: Maybe<HealthCareWorkerModel>;
  healthCareWorkerHighlights?: Maybe<HcwHighlights>;
  healthCareWorkerSummaryForPeriod?: Maybe<HcwSummary>;
  healthCareWorkerTemplateGenerator?: Maybe<FileModel>;
  healthCareWorkerVisitStatus?: Maybe<HcwVisitStatus>;
  healthPromotion: Array<Maybe<HealthPromotion>>;
  holidaysByMonth?: Maybe<Array<Maybe<Holiday>>>;
  holidaysByYear?: Maybe<Array<Maybe<Holiday>>>;
  incomeStatements?: Maybe<Array<Maybe<IncomeStatementModel>>>;
  infantCountForHealthCareWorkerForMonth: Scalars['Int'];
  infantSummaryByGroup?: Maybe<Array<Maybe<ClientSummary>>>;
  infantSummaryByPriority?: Maybe<Array<Maybe<ClientSummaryByPriority>>>;
  infantVisits?: Maybe<Array<Maybe<Visit>>>;
  infographics: Array<Maybe<Infographics>>;
  lastPractitionerInviteDate?: Maybe<Scalars['String']>;
  leagueForUser?: Maybe<LeagueClubsModel>;
  leaguesForCoach?: Maybe<Array<Maybe<LeagueClubsModel>>>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  monthlyAttendanceRecordCSV?: Maybe<FileModel>;
  monthlyAttendanceReport?: Maybe<Array<Maybe<MonthlyAttendanceReportModel>>>;
  moreInformation: Array<Maybe<MoreInformation>>;
  motherById?: Maybe<Mother>;
  motherCountForHealthCareWorkerForMonth: Scalars['Int'];
  motherSummaryByGroup?: Maybe<Array<Maybe<ClientSummary>>>;
  motherSummaryByPriority?: Maybe<Array<Maybe<ClientSummaryByPriority>>>;
  motherVisits?: Maybe<Array<Maybe<Visit>>>;
  onBoardTraineeTimeline?: Maybe<TraineeOnBoardTimeline>;
  openAccessAddChildDetail?: Maybe<ChildTokenAccessModel>;
  openConsent: Array<Maybe<Consent>>;
  openLanguage: Array<Maybe<Language>>;
  ownershipMetrics?: Maybe<PractitionerMetricReport>;
  permissionGroups?: Maybe<Array<Maybe<PermissionGroupModel>>>;
  pointsLibrary?: Maybe<Array<Maybe<PointsLibrary>>>;
  pointsSummaryForUser?: Maybe<Array<Maybe<PointsUserSummary>>>;
  practitionerById?: Maybe<PractitionerModel>;
  practitionerByIdNumber?: Maybe<PractitionerUserAndNote>;
  practitionerByIdNumberInternal?: Maybe<ApplicationUser>;
  practitionerByUserId?: Maybe<PractitionerModel>;
  practitionerColleagues?: Maybe<Array<Maybe<PractitionerColleagues>>>;
  practitionerExcelTemplateGenerator?: Maybe<FileModel>;
  practitionerInviteCount: Scalars['Int'];
  practitionerMetrics?: Maybe<PractitionerMetricReport>;
  practitionerNewSignupMetric: Scalars['Int'];
  practitionerProgressReportSummary?: Maybe<PractitionerProgressReportSummaryModel>;
  practitionerTimeline?: Maybe<PractitionerTimeline>;
  practitionerVisits?: Maybe<Array<Maybe<Visit>>>;
  previousVisitInformationForInfant?: Maybe<Progress_VisitDataStatus>;
  previousVisitInformationForMother?: Maybe<Progress_VisitDataStatus>;
  principalByUserId?: Maybe<Practitioner>;
  principalProgressReportSummary?: Maybe<PractitionerProgressReportSummaryModel>;
  referralsForInfant?: Maybe<Array<Maybe<VisitDataStatus>>>;
  referralsForMother?: Maybe<Array<Maybe<VisitDataStatus>>>;
  referralsForVisitId?: Maybe<Array<Maybe<VisitDataStatus>>>;
  removalDetailsForPractitioner?: Maybe<PractitionerRemovalHistory>;
  removalDetailsForPractitioners?: Maybe<
    Array<Maybe<PractitionerRemovalHistory>>
  >;
  removeHolidays?: Maybe<Array<Scalars['DateTime']>>;
  removeWeekendDays?: Maybe<Array<Scalars['DateTime']>>;
  reportDetailsForPractitioner?: Maybe<PractitionerReportDetails>;
  roleForUser?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<ApplicationIdentityRole>>>;
  settings?: Maybe<SettingsType>;
  statementsIncomeExpensesPDFData?: Maybe<
    Array<Maybe<IncomeExpensePdfTableModel>>
  >;
  subDistrictsAndStats?: Maybe<Array<Maybe<SubDistrictStatsModel>>>;
  teamLeadTemplateGenerator?: Maybe<FileModel>;
  tenantContext?: Maybe<TenantModel>;
  totalDaysAbsent: Scalars['Int'];
  traineeByUserId?: Maybe<Trainee>;
  unsubmittedExpenseItems?: Maybe<Array<Maybe<ExpenseItemModel>>>;
  unsubmittedIncomeItems?: Maybe<Array<Maybe<IncomeItemModel>>>;
  userById?: Maybe<ApplicationUser>;
  userByToken?: Maybe<UserByToken>;
  userCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  userClubStanding?: Maybe<UserClubStandingModel>;
  userCountForMessageCriteria: Scalars['Int'];
  userProgrammes?: Maybe<Array<Maybe<Programme>>>;
  users?: Maybe<Array<Maybe<ApplicationUser>>>;
  visitAnswersForInfant?: Maybe<Array<Maybe<VisitData>>>;
  visitAnswersForMother?: Maybe<Array<Maybe<VisitData>>>;
  visitClientSummaryDataForMother?: Maybe<Progress_VisitDataStatus>;
  visitClientSummaryForMother?: Maybe<Array<Maybe<VisitDataSummary>>>;
  visitDataForVisit?: Maybe<Array<Maybe<VisitData>>>;
  visitDataForVisitId?: Maybe<Array<Maybe<VisitData>>>;
  visitNotesForPractitioner?: Maybe<Array<Maybe<PractitionerNotes>>>;
  visitVideos: Array<Maybe<VisitVideos>>;
  weeklyAttendance?: Maybe<Array<Maybe<Attendance>>>;
  yearlyClassAttendanceMetricsByUser?: Maybe<
    Array<Maybe<ClassroomMetricReport>>
  >;
};

export type QueryGetAbsenteesByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<AbsenteesFilterInput>;
};

export type QueryGetActivityByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllAbsenteesArgs = {
  order?: InputMaybe<Array<AbsenteesSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<AbsenteesFilterInput>;
};

export type QueryGetAllActivityArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllAuditLogTypeArgs = {
  order?: InputMaybe<Array<AuditLogTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<AuditLogTypeFilterInput>;
};

export type QueryGetAllCalendarEventArgs = {
  order?: InputMaybe<Array<CalendarEventSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CalendarEventFilterInput>;
};

export type QueryGetAllCalendarEventParticipantArgs = {
  order?: InputMaybe<Array<CalendarEventParticipantSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CalendarEventParticipantFilterInput>;
};

export type QueryGetAllCalendarEventTypeArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllCaregiverArgs = {
  order?: InputMaybe<Array<CaregiverSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CaregiverFilterInput>;
};

export type QueryGetAllChildArgs = {
  order?: InputMaybe<Array<ChildSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ChildFilterInput>;
};

export type QueryGetAllChildProgressReportArgs = {
  order?: InputMaybe<Array<ChildProgressReportSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ChildProgressReportFilterInput>;
};

export type QueryGetAllClassProgrammeArgs = {
  order?: InputMaybe<Array<ClassProgrammeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClassProgrammeFilterInput>;
};

export type QueryGetAllClassReassignmentHistoryArgs = {
  order?: InputMaybe<Array<ClassReassignmentHistorySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClassReassignmentHistoryFilterInput>;
};

export type QueryGetAllClassroomArgs = {
  order?: InputMaybe<Array<ClassroomSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClassroomFilterInput>;
};

export type QueryGetAllClassroomGroupArgs = {
  order?: InputMaybe<Array<ClassroomGroupSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetAllClinicArgs = {
  order?: InputMaybe<Array<ClinicSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClinicFilterInput>;
};

export type QueryGetAllClinicLeagueArgs = {
  order?: InputMaybe<Array<ClinicLeagueSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClinicLeagueFilterInput>;
};

export type QueryGetAllClinicTeamLeadArgs = {
  order?: InputMaybe<Array<ClinicTeamLeadSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClinicTeamLeadFilterInput>;
};

export type QueryGetAllClubArgs = {
  order?: InputMaybe<Array<ClubSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubFilterInput>;
};

export type QueryGetAllClubActivityUploadArgs = {
  order?: InputMaybe<Array<ClubActivityUploadSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubActivityUploadFilterInput>;
};

export type QueryGetAllClubActivityUploadTypeArgs = {
  order?: InputMaybe<Array<ClubActivityUploadTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubActivityUploadTypeFilterInput>;
};

export type QueryGetAllClubLeaderArgs = {
  order?: InputMaybe<Array<ClubLeaderSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubLeaderFilterInput>;
};

export type QueryGetAllClubMeetingArgs = {
  order?: InputMaybe<Array<ClubMeetingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubMeetingFilterInput>;
};

export type QueryGetAllClubMeetingRegisterArgs = {
  order?: InputMaybe<Array<ClubMeetingRegisterSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubMeetingRegisterFilterInput>;
};

export type QueryGetAllClubMemberArgs = {
  order?: InputMaybe<Array<ClubMemberSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubMemberFilterInput>;
};

export type QueryGetAllClubPointsArgs = {
  order?: InputMaybe<Array<ClubPointsSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubPointsFilterInput>;
};

export type QueryGetAllClubPointsLibraryArgs = {
  order?: InputMaybe<Array<ClubPointsLibrarySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubPointsLibraryFilterInput>;
};

export type QueryGetAllClubSupportArgs = {
  order?: InputMaybe<Array<ClubSupportSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubSupportFilterInput>;
};

export type QueryGetAllCoachArgs = {
  order?: InputMaybe<Array<CoachSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetAllCoachingCircleTopicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllConnectArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllConnectItemArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllConsentArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllDailyProgrammeArgs = {
  order?: InputMaybe<Array<DailyProgrammeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<DailyProgrammeFilterInput>;
};

export type QueryGetAllDistrictArgs = {
  order?: InputMaybe<Array<DistrictSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<DistrictFilterInput>;
};

export type QueryGetAllDocumentArgs = {
  order?: InputMaybe<Array<DocumentSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<DocumentFilterInput>;
};

export type QueryGetAllDocumentTypeArgs = {
  order?: InputMaybe<Array<DocumentTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<DocumentTypeFilterInput>;
};

export type QueryGetAllEducationArgs = {
  order?: InputMaybe<Array<EducationSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<EducationFilterInput>;
};

export type QueryGetAllEventRecordArgs = {
  order?: InputMaybe<Array<EventRecordSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<EventRecordFilterInput>;
};

export type QueryGetAllEventRecordTypeArgs = {
  order?: InputMaybe<Array<EventRecordTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<EventRecordTypeFilterInput>;
};

export type QueryGetAllFranchisorArgs = {
  order?: InputMaybe<Array<FranchisorSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<FranchisorFilterInput>;
};

export type QueryGetAllGenderArgs = {
  order?: InputMaybe<Array<GenderSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<GenderFilterInput>;
};

export type QueryGetAllGrantArgs = {
  order?: InputMaybe<Array<GrantSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<GrantFilterInput>;
};

export type QueryGetAllHealthCareWorkerArgs = {
  order?: InputMaybe<Array<HealthCareWorkerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<HealthCareWorkerFilterInput>;
};

export type QueryGetAllHealthPromotionArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllHierarchyEntityArgs = {
  order?: InputMaybe<Array<HierarchyEntitySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<HierarchyEntityFilterInput>;
};

export type QueryGetAllIncomeStatementsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllInfantArgs = {
  order?: InputMaybe<Array<InfantSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<InfantFilterInput>;
};

export type QueryGetAllInfographicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllIntegrationAuditArgs = {
  order?: InputMaybe<Array<IntegrationAuditSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<IntegrationAuditFilterInput>;
};

export type QueryGetAllIntegrationColumnMappingArgs = {
  order?: InputMaybe<Array<IntegrationColumnMappingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<IntegrationColumnMappingFilterInput>;
};

export type QueryGetAllIntegrationEntityMappingArgs = {
  order?: InputMaybe<Array<IntegrationEntityMappingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<IntegrationEntityMappingFilterInput>;
};

export type QueryGetAllIntegrationLogArgs = {
  order?: InputMaybe<Array<IntegrationLogSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<IntegrationLogFilterInput>;
};

export type QueryGetAllLanguageArgs = {
  order?: InputMaybe<Array<LanguageSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetAllLeagueArgs = {
  order?: InputMaybe<Array<LeagueSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LeagueFilterInput>;
};

export type QueryGetAllLeagueTypeArgs = {
  order?: InputMaybe<Array<LeagueTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LeagueTypeFilterInput>;
};

export type QueryGetAllLearnerArgs = {
  order?: InputMaybe<Array<LearnerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LearnerFilterInput>;
};

export type QueryGetAllLicenseArgs = {
  order?: InputMaybe<Array<LicenseSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LicenseFilterInput>;
};

export type QueryGetAllLicenseTypeArgs = {
  order?: InputMaybe<Array<LicenseTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LicenseTypeFilterInput>;
};

export type QueryGetAllMeetingTypeArgs = {
  order?: InputMaybe<Array<MeetingTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<MeetingTypeFilterInput>;
};

export type QueryGetAllMessageLogArgs = {
  order?: InputMaybe<Array<MessageLogSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<MessageLogFilterInput>;
};

export type QueryGetAllMessageTemplateArgs = {
  order?: InputMaybe<Array<MessageTemplateSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<MessageTemplateFilterInput>;
};

export type QueryGetAllMoreInformationArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllMotherArgs = {
  order?: InputMaybe<Array<MotherSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<MotherFilterInput>;
};

export type QueryGetAllNavigationArgs = {
  order?: InputMaybe<Array<NavigationSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<NavigationFilterInput>;
};

export type QueryGetAllNoteArgs = {
  order?: InputMaybe<Array<NoteSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<NoteFilterInput>;
};

export type QueryGetAllNoteTypeArgs = {
  order?: InputMaybe<Array<NoteTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<NoteTypeFilterInput>;
};

export type QueryGetAllPqaArgs = {
  order?: InputMaybe<Array<PqaSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PqaFilterInput>;
};

export type QueryGetAllPqaRatingArgs = {
  order?: InputMaybe<Array<PqaRatingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PqaRatingFilterInput>;
};

export type QueryGetAllPqaSectionRatingArgs = {
  order?: InputMaybe<Array<PqaSectionRatingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PqaSectionRatingFilterInput>;
};

export type QueryGetAllPermissionArgs = {
  order?: InputMaybe<Array<PermissionSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PermissionFilterInput>;
};

export type QueryGetAllPointsLibraryArgs = {
  order?: InputMaybe<Array<PointsLibrarySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsLibraryFilterInput>;
};

export type QueryGetAllPointsUserArgs = {
  order?: InputMaybe<Array<PointsUserSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsUserFilterInput>;
};

export type QueryGetAllPointsUserSummaryArgs = {
  order?: InputMaybe<Array<PointsUserSummarySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsUserSummaryFilterInput>;
};

export type QueryGetAllPractitionerArgs = {
  order?: InputMaybe<Array<PractitionerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PractitionerFilterInput>;
};

export type QueryGetAllPractitionerRemovalHistoryArgs = {
  order?: InputMaybe<Array<PractitionerRemovalHistorySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PractitionerRemovalHistoryFilterInput>;
};

export type QueryGetAllPrincipalArgs = {
  order?: InputMaybe<Array<PrincipalSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PrincipalFilterInput>;
};

export type QueryGetAllProgrammeArgs = {
  order?: InputMaybe<Array<ProgrammeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ProgrammeFilterInput>;
};

export type QueryGetAllProgrammeAttendanceReasonArgs = {
  order?: InputMaybe<Array<ProgrammeAttendanceReasonSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ProgrammeAttendanceReasonFilterInput>;
};

export type QueryGetAllProgrammeRoutineArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgrammeRoutineItemArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgrammeRoutineSubItemArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgrammeTypeArgs = {
  order?: InputMaybe<Array<ProgrammeTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ProgrammeTypeFilterInput>;
};

export type QueryGetAllProgressTrackingCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgressTrackingLevelArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgressTrackingSkillArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProgressTrackingSubCategoryArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllProvinceArgs = {
  order?: InputMaybe<Array<ProvinceSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ProvinceFilterInput>;
};

export type QueryGetAllRaceArgs = {
  order?: InputMaybe<Array<RaceSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<RaceFilterInput>;
};

export type QueryGetAllReasonForLeavingArgs = {
  order?: InputMaybe<Array<ReasonForLeavingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ReasonForLeavingFilterInput>;
};

export type QueryGetAllReasonForPractitionerLeavingArgs = {
  order?: InputMaybe<Array<ReasonForPractitionerLeavingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
};

export type QueryGetAllReasonForPractitionerLeavingProgrammeArgs = {
  order?: InputMaybe<Array<ReasonForPractitionerLeavingProgrammeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ReasonForPractitionerLeavingProgrammeFilterInput>;
};

export type QueryGetAllRelationArgs = {
  order?: InputMaybe<Array<RelationSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<RelationFilterInput>;
};

export type QueryGetAllShortenUrlEntityArgs = {
  order?: InputMaybe<Array<ShortenUrlEntitySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ShortenUrlEntityFilterInput>;
};

export type QueryGetAllSiteAddressArgs = {
  order?: InputMaybe<Array<SiteAddressSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SiteAddressFilterInput>;
};

export type QueryGetAllSmartSpaceVisitArgs = {
  order?: InputMaybe<Array<SmartSpaceVisitSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SmartSpaceVisitFilterInput>;
};

export type QueryGetAllStatementsContributionTypeArgs = {
  order?: InputMaybe<Array<StatementsContributionTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsContributionTypeFilterInput>;
};

export type QueryGetAllStatementsExpenseTypeArgs = {
  order?: InputMaybe<Array<StatementsExpenseTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsExpenseTypeFilterInput>;
};

export type QueryGetAllStatementsExpensesArgs = {
  order?: InputMaybe<Array<StatementsExpensesSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsExpensesFilterInput>;
};

export type QueryGetAllStatementsFeeTypeArgs = {
  order?: InputMaybe<Array<StatementsFeeTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsFeeTypeFilterInput>;
};

export type QueryGetAllStatementsIncomeArgs = {
  order?: InputMaybe<Array<StatementsIncomeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsIncomeFilterInput>;
};

export type QueryGetAllStatementsIncomeStatementArgs = {
  order?: InputMaybe<Array<StatementsIncomeStatementSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsIncomeStatementFilterInput>;
};

export type QueryGetAllStatementsIncomeTypeArgs = {
  order?: InputMaybe<Array<StatementsIncomeTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsIncomeTypeFilterInput>;
};

export type QueryGetAllStatementsPayTypeArgs = {
  order?: InputMaybe<Array<StatementsPayTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsPayTypeFilterInput>;
};

export type QueryGetAllStatementsStartupSupportArgs = {
  order?: InputMaybe<Array<StatementsStartupSupportSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<StatementsStartupSupportFilterInput>;
};

export type QueryGetAllStoryBookArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllStoryBookPartQuestionArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllStoryBookPartsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllSubDistrictArgs = {
  order?: InputMaybe<Array<SubDistrictSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SubDistrictFilterInput>;
};

export type QueryGetAllSystemSettingArgs = {
  order?: InputMaybe<Array<SystemSettingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetAllTeamLeadArgs = {
  order?: InputMaybe<Array<TeamLeadSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<TeamLeadFilterInput>;
};

export type QueryGetAllThemeArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllThemeDayArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllTraineeArgs = {
  order?: InputMaybe<Array<TraineeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<TraineeFilterInput>;
};

export type QueryGetAllUserConsentArgs = {
  order?: InputMaybe<Array<UserConsentSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetAllUserHierarchyEntityArgs = {
  order?: InputMaybe<Array<UserHierarchyEntitySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetAllVisitArgs = {
  order?: InputMaybe<Array<VisitSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitFilterInput>;
};

export type QueryGetAllVisitBackReferralArgs = {
  order?: InputMaybe<Array<VisitBackReferralSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitBackReferralFilterInput>;
};

export type QueryGetAllVisitDataArgs = {
  order?: InputMaybe<Array<VisitDataSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitDataFilterInput>;
};

export type QueryGetAllVisitDataStatusArgs = {
  order?: InputMaybe<Array<VisitDataStatusSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitDataStatusFilterInput>;
};

export type QueryGetAllVisitGrowthDataDayArgs = {
  order?: InputMaybe<Array<VisitGrowthDataDaySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitGrowthDataDayFilterInput>;
};

export type QueryGetAllVisitGrowthDataHeightArgs = {
  order?: InputMaybe<Array<VisitGrowthDataHeightSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitGrowthDataHeightFilterInput>;
};

export type QueryGetAllVisitTypeArgs = {
  order?: InputMaybe<Array<VisitTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitTypeFilterInput>;
};

export type QueryGetAllVisitVideosArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllWorkflowStatusArgs = {
  order?: InputMaybe<Array<WorkflowStatusSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<WorkflowStatusFilterInput>;
};

export type QueryGetAllWorkflowStatusTypeArgs = {
  order?: InputMaybe<Array<WorkflowStatusTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<WorkflowStatusTypeFilterInput>;
};

export type QueryGetAuditLogTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<AuditLogTypeFilterInput>;
};

export type QueryGetCalendarEventByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CalendarEventFilterInput>;
};

export type QueryGetCalendarEventParticipantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CalendarEventParticipantFilterInput>;
};

export type QueryGetCalendarEventTypeByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetCaregiverByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CaregiverFilterInput>;
};

export type QueryGetChildByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ChildFilterInput>;
};

export type QueryGetChildProgressReportByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ChildProgressReportFilterInput>;
};

export type QueryGetClassProgrammeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassProgrammeFilterInput>;
};

export type QueryGetClassReassignmentHistoryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassReassignmentHistoryFilterInput>;
};

export type QueryGetClassroomByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassroomFilterInput>;
};

export type QueryGetClassroomGroupByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetClinicByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClinicFilterInput>;
};

export type QueryGetClinicLeagueByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClinicLeagueFilterInput>;
};

export type QueryGetClinicTeamLeadByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClinicTeamLeadFilterInput>;
};

export type QueryGetClubActivityUploadByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubActivityUploadFilterInput>;
};

export type QueryGetClubActivityUploadTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubActivityUploadTypeFilterInput>;
};

export type QueryGetClubByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubFilterInput>;
};

export type QueryGetClubLeaderByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubLeaderFilterInput>;
};

export type QueryGetClubMeetingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubMeetingFilterInput>;
};

export type QueryGetClubMeetingRegisterByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubMeetingRegisterFilterInput>;
};

export type QueryGetClubMemberByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubMemberFilterInput>;
};

export type QueryGetClubPointsByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubPointsFilterInput>;
};

export type QueryGetClubPointsLibraryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubPointsLibraryFilterInput>;
};

export type QueryGetClubSupportByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubSupportFilterInput>;
};

export type QueryGetCoachByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetCoachingCircleTopicsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetConnectByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetConnectItemByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetConsentByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetDailyProgrammeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<DailyProgrammeFilterInput>;
};

export type QueryGetDistrictByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<DistrictFilterInput>;
};

export type QueryGetDocumentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<DocumentFilterInput>;
};

export type QueryGetDocumentTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<DocumentTypeFilterInput>;
};

export type QueryGetEducationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<EducationFilterInput>;
};

export type QueryGetEventRecordByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<EventRecordFilterInput>;
};

export type QueryGetEventRecordTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<EventRecordTypeFilterInput>;
};

export type QueryGetFranchisorByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<FranchisorFilterInput>;
};

export type QueryGetGenderByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<GenderFilterInput>;
};

export type QueryGetGrantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<GrantFilterInput>;
};

export type QueryGetHealthCareWorkerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<HealthCareWorkerFilterInput>;
};

export type QueryGetHealthPromotionByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<HierarchyEntityFilterInput>;
};

export type QueryGetIncomeStatementsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetInfantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<InfantFilterInput>;
};

export type QueryGetInfographicsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetIntegrationAuditByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<IntegrationAuditFilterInput>;
};

export type QueryGetIntegrationColumnMappingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<IntegrationColumnMappingFilterInput>;
};

export type QueryGetIntegrationEntityMappingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<IntegrationEntityMappingFilterInput>;
};

export type QueryGetIntegrationLogByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<IntegrationLogFilterInput>;
};

export type QueryGetLanguageByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetLeagueByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LeagueFilterInput>;
};

export type QueryGetLeagueTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LeagueTypeFilterInput>;
};

export type QueryGetLearnerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LearnerFilterInput>;
};

export type QueryGetLicenseByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LicenseFilterInput>;
};

export type QueryGetLicenseTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LicenseTypeFilterInput>;
};

export type QueryGetMeetingTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<MeetingTypeFilterInput>;
};

export type QueryGetMessageLogByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<MessageLogFilterInput>;
};

export type QueryGetMessageTemplateByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<MessageTemplateFilterInput>;
};

export type QueryGetMoreInformationByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetMotherByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<MotherFilterInput>;
};

export type QueryGetNavigationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<NavigationFilterInput>;
};

export type QueryGetNoteByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<NoteFilterInput>;
};

export type QueryGetNoteTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<NoteTypeFilterInput>;
};

export type QueryGetPqaByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PqaFilterInput>;
};

export type QueryGetPqaRatingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PqaRatingFilterInput>;
};

export type QueryGetPqaSectionRatingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PqaSectionRatingFilterInput>;
};

export type QueryGetPermissionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PermissionFilterInput>;
};

export type QueryGetPointsLibraryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsLibraryFilterInput>;
};

export type QueryGetPointsUserByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsUserFilterInput>;
};

export type QueryGetPointsUserSummaryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsUserSummaryFilterInput>;
};

export type QueryGetPractitionerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PractitionerFilterInput>;
};

export type QueryGetPractitionerRemovalHistoryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PractitionerRemovalHistoryFilterInput>;
};

export type QueryGetPrincipalByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PrincipalFilterInput>;
};

export type QueryGetProgrammeAttendanceReasonByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ProgrammeAttendanceReasonFilterInput>;
};

export type QueryGetProgrammeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ProgrammeFilterInput>;
};

export type QueryGetProgrammeRoutineByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgrammeRoutineItemByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgrammeRoutineSubItemByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgrammeTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ProgrammeTypeFilterInput>;
};

export type QueryGetProgressTrackingCategoryByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgressTrackingLevelByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgressTrackingSkillByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProgressTrackingSubCategoryByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetProvinceByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ProvinceFilterInput>;
};

export type QueryGetRaceByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<RaceFilterInput>;
};

export type QueryGetReasonForLeavingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ReasonForLeavingFilterInput>;
};

export type QueryGetReasonForPractitionerLeavingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
};

export type QueryGetReasonForPractitionerLeavingProgrammeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ReasonForPractitionerLeavingProgrammeFilterInput>;
};

export type QueryGetRelationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<RelationFilterInput>;
};

export type QueryGetShortenUrlEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ShortenUrlEntityFilterInput>;
};

export type QueryGetSiteAddressByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SiteAddressFilterInput>;
};

export type QueryGetSmartSpaceVisitByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SmartSpaceVisitFilterInput>;
};

export type QueryGetStatementsContributionTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsContributionTypeFilterInput>;
};

export type QueryGetStatementsExpenseTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsExpenseTypeFilterInput>;
};

export type QueryGetStatementsExpensesByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsExpensesFilterInput>;
};

export type QueryGetStatementsFeeTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsFeeTypeFilterInput>;
};

export type QueryGetStatementsIncomeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsIncomeFilterInput>;
};

export type QueryGetStatementsIncomeStatementByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsIncomeStatementFilterInput>;
};

export type QueryGetStatementsIncomeTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsIncomeTypeFilterInput>;
};

export type QueryGetStatementsPayTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsPayTypeFilterInput>;
};

export type QueryGetStatementsStartupSupportByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<StatementsStartupSupportFilterInput>;
};

export type QueryGetStoryBookByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetStoryBookPartQuestionByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetStoryBookPartsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetSubDistrictByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SubDistrictFilterInput>;
};

export type QueryGetSystemSettingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetTeamLeadByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<TeamLeadFilterInput>;
};

export type QueryGetThemeByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetThemeDayByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetTraineeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<TraineeFilterInput>;
};

export type QueryGetUserConsentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetUserHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetVisitBackReferralByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitBackReferralFilterInput>;
};

export type QueryGetVisitByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitFilterInput>;
};

export type QueryGetVisitDataByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitDataFilterInput>;
};

export type QueryGetVisitDataStatusByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitDataStatusFilterInput>;
};

export type QueryGetVisitGrowthDataDayByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitGrowthDataDayFilterInput>;
};

export type QueryGetVisitGrowthDataHeightByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitGrowthDataHeightFilterInput>;
};

export type QueryGetVisitTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitTypeFilterInput>;
};

export type QueryGetVisitVideosByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetWorkflowStatusByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<WorkflowStatusFilterInput>;
};

export type QueryGetWorkflowStatusTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<WorkflowStatusTypeFilterInput>;
};

export type QueryAbsenteeByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAbsenteesArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryActionItemAgeSpreadArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryActionItemChildProgressArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryActionItemClassReassignmentHistoryArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryActionItemMissedProgressReportsArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryActivityBeCreativeDetailsArgs = {
  clubId: Scalars['UUID'];
};

export type QueryActivityChildAttendanceArgs = {
  clubId: Scalars['UUID'];
};

export type QueryActivityChildProgressArgs = {
  clubId: Scalars['UUID'];
};

export type QueryActivityHostFamilyDetailsArgs = {
  clubId: Scalars['UUID'];
};

export type QueryActivityLeaveNoOneBehindDetailsArgs = {
  clubId: Scalars['UUID'];
};

export type QueryActivityMeetRegularDetailsArgs = {
  clubId: Scalars['UUID'];
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type QueryAllCaregiverByPractitionerArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryAllCaregiversForHcwArgs = {
  pageNumber?: Scalars['Int'];
  recordsPerPage?: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllCaregiversForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenByRoleArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForFranchisorArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenUnderPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenUnderPrincipalByClassroomsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomGroupsByPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomGroupsForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomGroupsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomsForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClassroomsForPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllClientRecordsArgs = {
  order?: InputMaybe<Array<DocumentSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  showOnlyStatus?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  showOnlyTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryAllClubsForCoachSimpleArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllCoachesForFranchisorArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllCoachingCircleClubsForCoachArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllContentLanguagesArgs = {
  contentType?: InputMaybe<Scalars['String']>;
};

export type QueryAllDocumentArgs = {
  order?: InputMaybe<Array<DocumentSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  showOnlyTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllEventRecordTypesForTypeArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type QueryAllHealthCareWorkersArgs = {
  clinicSearch?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<HealthCareWorkerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  provinceSearch?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  teamLeadSearch?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<HealthCareWorkerFilterInput>;
};

export type QueryAllInfantsForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitType?: InputMaybe<Scalars['String']>;
};

export type QueryAllMessageLogsForAdminArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllMothersForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitType?: InputMaybe<Scalars['String']>;
};

export type QueryAllNotificationsArgs = {
  inApp?: Scalars['Boolean'];
  order?: InputMaybe<Array<NotificationSortInput>>;
  protocol?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllPractitionerInvitesArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllPractitionersForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllPractitionersForPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllTeamLeadsArgs = {
  clinicSearch?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<TeamLeadSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  provinceSearch?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<TeamLeadFilterInput>;
};

export type QueryAllTemplatesArgs = {
  templateId?: InputMaybe<Scalars['String']>;
};

export type QueryAttendanceArgs = {
  monthOfYear?: InputMaybe<Scalars['Int']>;
  weekOfYear?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AttendanceFilterInput>;
  year: Scalars['Int'];
};

export type QueryBackReferralsForInfantArgs = {
  backReferralCompleted: Scalars['Boolean'];
  id?: InputMaybe<Scalars['String']>;
  referralCompleted: Scalars['Boolean'];
};

export type QueryBackReferralsForMotherArgs = {
  backReferralCompleted: Scalars['Boolean'];
  id?: InputMaybe<Scalars['String']>;
  referralCompleted: Scalars['Boolean'];
};

export type QueryCaregiverClientsArgs = {
  caregiverId?: InputMaybe<Scalars['String']>;
};

export type QueryCaregiverGrantsArgs = {
  careGiverId: Scalars['UUID'];
};

export type QueryChangesToSyncArgs = {
  lastUpdated: Scalars['DateTime'];
};

export type QueryChildAttendanceReportArgs = {
  classgroupId: Scalars['UUID'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryChildByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryChildCreatedByDetailArgs = {
  firstName?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type QueryChildProgressReportArgs = {
  reportId: Scalars['UUID'];
};

export type QueryChildProgressReportSummaryArgs = {
  count: Scalars['Int'];
};

export type QueryChildProgressReportsArgs = {
  count: Scalars['Int'];
};

export type QueryChildProgressReportsStatusArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryChildrenAttendedVsAbsentMetricsArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type QueryChildrenByClassroomIdArgs = {
  classroomId?: InputMaybe<Scalars['String']>;
};

export type QueryClassAttendanceMetricsArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
};

export type QueryClassAttendanceMetricsByUserArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomActionItemsArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomAttendanceOverviewReportArgs = {
  classgroupId: Scalars['UUID'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomAttendanceReportArgs = {
  classgroupId: Scalars['UUID'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomDetailsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomGroupClassroomsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomNamesForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClinicByIdArgs = {
  clinicId: Scalars['UUID'];
};

export type QueryClubByIdArgs = {
  clubId: Scalars['UUID'];
};

export type QueryClubForUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClubMeetingsWithMissingRegistersArgs = {
  clubId: Scalars['UUID'];
};

export type QueryClubsForCoachArgs = {
  coachUserId?: InputMaybe<Scalars['String']>;
};

export type QueryClubsMembersArgs = {
  clubIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type QueryCoachByCoachUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryCoachByPractitionerIdArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryCoachByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryCoachNameByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryCompletedReferralsForInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryCompletedReferralsForMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryCompletedVisitsForVisitIdArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryContentDefinitionsExcelTemplateGeneratorArgs = {
  contentTypeId: Scalars['Int'];
};

export type QueryContentTypesArgs = {
  includeLanguages?: InputMaybe<Scalars['Boolean']>;
  isVisiblePortal?: InputMaybe<Scalars['Boolean']>;
  order?: InputMaybe<Array<ContentTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  searchInContent?: InputMaybe<Scalars['Boolean']>;
  showOnlyTypesWithIds?: InputMaybe<Array<Scalars['Int']>>;
  showOnlyTypesWithName?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryContentTypesWithLanguagesArgs = {
  isVisiblePortal?: InputMaybe<Scalars['Boolean']>;
  order?: InputMaybe<Array<ContentTypeWithLanguagesSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  searchInContent?: InputMaybe<Scalars['Boolean']>;
  showOnlyTypesWithIds?: InputMaybe<Array<Scalars['Int']>>;
  showOnlyTypesWithName?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryCountAbsenteesArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountAuditLogTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCalendarEventArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCalendarEventParticipantArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCaregiverArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountChildArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountChildProgressReportArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClassProgrammeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClassReassignmentHistoryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClassroomArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClassroomGroupArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClinicArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClinicLeagueArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClinicTeamLeadArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubActivityUploadArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubActivityUploadTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubLeaderArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubMeetingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubMeetingRegisterArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubMemberArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubPointsArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubPointsLibraryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountClubSupportArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCoachArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountDailyProgrammeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountDistrictArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountDocumentArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountDocumentTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountEducationArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountEventRecordArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountEventRecordTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountFranchisorArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountGenderArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountGrantArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountHealthCareWorkerArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountHealthCareWorkersArgs = {
  clinicSearch?: InputMaybe<Scalars['String']>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  provinceSearch?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountHierarchyEntityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountInfantArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountIntegrationAuditArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountIntegrationColumnMappingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountIntegrationEntityMappingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountIntegrationLogArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLanguageArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLeagueArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLeagueTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLearnerArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLicenseArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLicenseTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountMeetingTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountMessageLogArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountMessageTemplateArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountMotherArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountNavigationArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountNoteArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountNoteTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPqaArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPqaRatingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPqaSectionRatingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPermissionArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsLibraryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsUserArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsUserSummaryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPractitionerArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPractitionerRemovalHistoryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPrincipalArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountProgrammeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountProgrammeAttendanceReasonArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountProgrammeTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountProvinceArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountRaceArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountReasonForLeavingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountReasonForPractitionerLeavingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountReasonForPractitionerLeavingProgrammeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountRelationArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountShortenUrlEntityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountSiteAddressArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountSmartSpaceVisitArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsContributionTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsExpenseTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsExpensesArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsFeeTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsIncomeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsIncomeStatementArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsIncomeTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsPayTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountStatementsStartupSupportArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountSubDistrictArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountSystemSettingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountTeamLeadArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountTeamLeadsArgs = {
  clinicSearch?: InputMaybe<Scalars['String']>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  provinceSearch?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountTraineeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserConsentArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserHierarchyEntityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUsersArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
};

export type QueryCountVisitArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitBackReferralArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitDataArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitDataStatusArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitGrowthDataDayArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitGrowthDataHeightArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountWorkflowStatusArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountWorkflowStatusTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryDailyAttendanceArgs = {
  attendanceDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryDisplayMetricsArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type QueryDocumentsForHcwArgs = {
  createdUserId?: InputMaybe<Scalars['String']>;
};

export type QueryEntityChangesToSyncArgs = {
  lastUpdated: Scalars['DateTime'];
};

export type QueryFranchisorByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryFranchisorSiteAddressByIdArgs = {
  franchisorId?: InputMaybe<Scalars['String']>;
};

export type QueryGenerateChildProgressReportArgs = {
  childId: Scalars['UUID'];
  classgroupId: Scalars['UUID'];
  reportDate: Scalars['DateTime'];
};

export type QueryGetMoodleSessionForUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryGrowthDataForInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryHasContentTypeBeenTranslatedArgs = {
  id: Scalars['Int'];
  localeId: Scalars['UUID'];
};

export type QueryHealthCareWorkerByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryHealthCareWorkerHighlightsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryHealthCareWorkerSummaryForPeriodArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  healthCareWorkerId?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryHealthCareWorkerVisitStatusArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryHealthPromotionArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryHolidaysByMonthArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
};

export type QueryHolidaysByYearArgs = {
  year: Scalars['Int'];
};

export type QueryIncomeStatementsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryInfantCountForHealthCareWorkerForMonthArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryInfantSummaryByGroupArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryInfantSummaryByPriorityArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryInfantVisitsArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryInfographicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryLastPractitionerInviteDateArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryLeagueForUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryLeaguesForCoachArgs = {
  coachUserId?: InputMaybe<Scalars['String']>;
};

export type QueryMapPractitionerToPrincipalArgs = {
  practitioner?: InputMaybe<PractitionerInput>;
};

export type QueryMonthlyAttendanceRecordCsvArgs = {
  endMonth: Scalars['DateTime'];
  ownerId?: InputMaybe<Scalars['String']>;
  startMonth: Scalars['DateTime'];
};

export type QueryMonthlyAttendanceReportArgs = {
  classroomId: Scalars['UUID'];
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryMoreInformationArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryMotherByIdArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryMotherCountForHealthCareWorkerForMonthArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryMotherSummaryByGroupArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryMotherSummaryByPriorityArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryMotherVisitsArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryOnBoardTraineeTimelineArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryOpenAccessAddChildDetailArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type QueryOpenConsentArgs = {
  locale?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type QueryPointsSummaryForUserArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerByIdArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerByIdNumberArgs = {
  idNumber?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerByIdNumberInternalArgs = {
  idNumber?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerColleaguesArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerInviteCountArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerNewSignupMetricArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type QueryPractitionerProgressReportSummaryArgs = {
  locale?: InputMaybe<Scalars['String']>;
  reportingPeriod?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerTimelineArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerVisitsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPreviousVisitInformationForInfantArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryPreviousVisitInformationForMotherArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryPrincipalByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPrincipalProgressReportSummaryArgs = {
  locale?: InputMaybe<Scalars['String']>;
  reportingPeriod?: InputMaybe<Scalars['String']>;
};

export type QueryReferralsForInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryReferralsForMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryReferralsForVisitIdArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryRemovalDetailsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryRemovalDetailsForPractitionersArgs = {
  userIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryRemoveHolidaysArgs = {
  days?: InputMaybe<Array<Scalars['DateTime']>>;
  holidays?: InputMaybe<Array<InputMaybe<HolidayInput>>>;
};

export type QueryRemoveWeekendDaysArgs = {
  days?: InputMaybe<Array<Scalars['DateTime']>>;
};

export type QueryReportDetailsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryRoleForUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryStatementsIncomeExpensesPdfDataArgs = {
  statementId: Scalars['UUID'];
};

export type QueryTotalDaysAbsentArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryTraineeByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUnsubmittedExpenseItemsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUnsubmittedIncomeItemsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUserByIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUserByTokenArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type QueryUserCalendarEventsArgs = {
  start?: InputMaybe<Scalars['DateTime']>;
};

export type QueryUserClubStandingArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUserCountForMessageCriteriaArgs = {
  districtId?: InputMaybe<Scalars['String']>;
  provinceId?: InputMaybe<Scalars['String']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  wardName?: InputMaybe<Scalars['String']>;
};

export type QueryUsersArgs = {
  order?: InputMaybe<Array<ApplicationUserSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
};

export type QueryVisitAnswersForInfantArgs = {
  visitId?: InputMaybe<Scalars['String']>;
  visitName?: InputMaybe<Scalars['String']>;
  visitSection?: InputMaybe<Scalars['String']>;
};

export type QueryVisitAnswersForMotherArgs = {
  visitId?: InputMaybe<Scalars['String']>;
  visitName?: InputMaybe<Scalars['String']>;
  visitSection?: InputMaybe<Scalars['String']>;
};

export type QueryVisitClientSummaryDataForMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryVisitClientSummaryForMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryVisitDataForVisitArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryVisitDataForVisitIdArgs = {
  visitId?: InputMaybe<Scalars['String']>;
};

export type QueryVisitNotesForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryVisitVideosArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryWeeklyAttendanceArgs = {
  monthOfYear?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
  weekOfYear?: InputMaybe<Scalars['Int']>;
  year: Scalars['Int'];
};

export type QueryYearlyClassAttendanceMetricsByUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type Race = {
  __typename?: 'Race';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type RaceFilterInput = {
  and?: InputMaybe<Array<RaceFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<RaceFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type RaceInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type RaceSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ReAccreditationVisitModelInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  attended?: InputMaybe<Scalars['Boolean']>;
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  infantId?: InputMaybe<Scalars['UUID']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  motherId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  reAccreditationData?: InputMaybe<CmsVisitDataInputModelInput>;
  risk?: InputMaybe<Scalars['String']>;
  traineeId?: InputMaybe<Scalars['UUID']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
};

export type ReasonForLeaving = {
  __typename?: 'ReasonForLeaving';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ReasonForLeavingFilterInput = {
  and?: InputMaybe<Array<ReasonForLeavingFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReasonForLeavingFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ReasonForLeavingInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ReasonForLeavingSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ReasonForPractitionerLeaving = {
  __typename?: 'ReasonForPractitionerLeaving';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ReasonForPractitionerLeavingFilterInput = {
  and?: InputMaybe<Array<ReasonForPractitionerLeavingFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReasonForPractitionerLeavingFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ReasonForPractitionerLeavingInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ReasonForPractitionerLeavingProgramme = {
  __typename?: 'ReasonForPractitionerLeavingProgramme';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ReasonForPractitionerLeavingProgrammeFilterInput = {
  and?: InputMaybe<Array<ReasonForPractitionerLeavingProgrammeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ReasonForPractitionerLeavingProgrammeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ReasonForPractitionerLeavingProgrammeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ReasonForPractitionerLeavingProgrammeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ReasonForPractitionerLeavingSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Relation = {
  __typename?: 'Relation';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type RelationFilterInput = {
  and?: InputMaybe<Array<RelationFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<RelationFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type RelationInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type RelationSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ResultReturnObject = {
  __typename?: 'ResultReturnObject';
  result: Scalars['Boolean'];
  resultMessage?: Maybe<Scalars['String']>;
  resultObject?: Maybe<Scalars['String']>;
};

export type SsChecklistVisitModelInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  attended?: InputMaybe<Scalars['Boolean']>;
  checklistData?: InputMaybe<CmsVisitDataInputModelInput>;
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  risk?: InputMaybe<Scalars['String']>;
  traineeId?: InputMaybe<Scalars['UUID']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
};

export type Setting_AbsenteeCutoffDelay = {
  __typename?: 'Setting_AbsenteeCutoffDelay';
  AbsenteeCutoffDelay: Scalars['String'];
};

export type Setting_Azure = {
  __typename?: 'Setting_Azure';
  BlobStorageConnection: Scalars['String'];
};

export type Setting_BulkSms = {
  __typename?: 'Setting_BulkSms';
  BaseUrl: Scalars['String'];
  BasicAuthToken: Scalars['String'];
  Name: Scalars['String'];
  TokenId: Scalars['String'];
  TokenSecret: Scalars['String'];
};

export type Setting_Children = {
  __typename?: 'Setting_Children';
  ChildExpiryTime: Scalars['String'];
  ChildInitialObservationPeriod: Scalars['String'];
};

export type Setting_Google = {
  __typename?: 'Setting_Google';
  DashboardGoogleReport: Scalars['String'];
  GoogleAnalyticsTag: Scalars['String'];
  GoogleTagManager: Scalars['String'];
};

export type Setting_IncomeStatementSubmitEnd = {
  __typename?: 'Setting_IncomeStatementSubmitEnd';
  IncomeStatementSubmitEnd: Scalars['String'];
};

export type Setting_IncomeStatementSubmitStart = {
  __typename?: 'Setting_IncomeStatementSubmitStart';
  IncomeStatementSubmitStart: Scalars['String'];
};

export type Setting_IntegrationDelay = {
  __typename?: 'Setting_IntegrationDelay';
  IntegrationDelay: Scalars['String'];
};

export type Setting_InvitationCutoffDelay = {
  __typename?: 'Setting_InvitationCutoffDelay';
  InvitationCutoffDelay: Scalars['String'];
};

export type Setting_Invitations = {
  __typename?: 'Setting_Invitations';
  AdminSignup: Scalars['String'];
  Signup: Scalars['String'];
};

export type Setting_Jwts = {
  __typename?: 'Setting_Jwts';
  LongJwtLifespan: Scalars['String'];
  ShortJwtLifespan: Scalars['String'];
};

export type Setting_RapidApi = {
  __typename?: 'Setting_RapidApi';
  BaseUrl: Scalars['String'];
  Host: Scalars['String'];
  Key: Scalars['String'];
  Name: Scalars['String'];
};

export type Setting_Reporting = {
  __typename?: 'Setting_Reporting';
  ChildProgressReportMonths: Scalars['String'];
};

export type Setting_SmsPortal = {
  __typename?: 'Setting_SMSPortal';
  ApiKey: Scalars['String'];
  ApiSecret: Scalars['String'];
  BaseUrl: Scalars['String'];
};

export type Setting_Security = {
  __typename?: 'Setting_Security';
  ForgotPassword: Scalars['String'];
  ForgotPasswordPortal: Scalars['String'];
  Login: Scalars['String'];
};

export type Setting_SendGrid = {
  __typename?: 'Setting_SendGrid';
  FromEmail: Scalars['String'];
  Key: Scalars['String'];
  User: Scalars['String'];
};

export type Setting_SmartLinkApi = {
  __typename?: 'Setting_SmartLinkApi';
  BaseUrl: Scalars['String'];
  Key: Scalars['String'];
  MaskDataEmail: Scalars['String'];
  MaskDataIdNumber: Scalars['String'];
  MaskDataMode: Scalars['String'];
  MaskDataNumber: Scalars['String'];
  Mode: Scalars['String'];
};

export type Setting_Sms = {
  __typename?: 'Setting_Sms';
  Provider: Scalars['String'];
};

export type Setting_Smtp = {
  __typename?: 'Setting_Smtp';
  FromEmail: Scalars['String'];
  FromEmailDisplayName: Scalars['String'];
  Password: Scalars['String'];
  RetryCount: Scalars['String'];
  RetryWaitMiliseconds: Scalars['String'];
  SmtpServerAddress: Scalars['String'];
  SmtpServerPort: Scalars['String'];
  SmtpServerSecondaryAddress: Scalars['String'];
  SmtpServerSecondaryPort: Scalars['String'];
  SmtpServerUseTLS: Scalars['String'];
  Username: Scalars['String'];
};

export type Setting_SyncDelay = {
  __typename?: 'Setting_SyncDelay';
  SyncDelay: Scalars['String'];
};

export type Setting_Tokens = {
  __typename?: 'Setting_Tokens';
  InvitationLinkExpiry: Scalars['String'];
  OpenAccessInvitationExpiry: Scalars['String'];
};

export type Setting_UrlShortner = {
  __typename?: 'Setting_UrlShortner';
  RedirectUrl: Scalars['String'];
};

export type Setting_ITouch = {
  __typename?: 'Setting_iTouch';
  BaseUrl: Scalars['String'];
  Password: Scalars['String'];
  Username: Scalars['String'];
};

export type SettingsType = {
  __typename?: 'SettingsType';
  AbsenteeCutoffDelay: Setting_AbsenteeCutoffDelay;
  Azure: Setting_Azure;
  BulkSms: Setting_BulkSms;
  Children: Setting_Children;
  Google: Setting_Google;
  IncomeStatementSubmitEnd: Setting_IncomeStatementSubmitEnd;
  IncomeStatementSubmitStart: Setting_IncomeStatementSubmitStart;
  IntegrationDelay: Setting_IntegrationDelay;
  InvitationCutoffDelay: Setting_InvitationCutoffDelay;
  Invitations: Setting_Invitations;
  Jwts: Setting_Jwts;
  RapidApi: Setting_RapidApi;
  Reporting: Setting_Reporting;
  SMSPortal: Setting_SmsPortal;
  Security: Setting_Security;
  SendGrid: Setting_SendGrid;
  SmartLinkApi: Setting_SmartLinkApi;
  Sms: Setting_Sms;
  Smtp: Setting_Smtp;
  SyncDelay: Setting_SyncDelay;
  Tokens: Setting_Tokens;
  UrlShortner: Setting_UrlShortner;
  iTouch: Setting_ITouch;
};

export type ShortenUrlEntity = {
  __typename?: 'ShortenUrlEntity';
  clicked: Scalars['Int'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  messageType?: Maybe<Scalars['String']>;
  uRL?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type ShortenUrlEntityFilterInput = {
  and?: InputMaybe<Array<ShortenUrlEntityFilterInput>>;
  clicked?: InputMaybe<ComparableInt32OperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  messageType?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ShortenUrlEntityFilterInput>>;
  uRL?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ShortenUrlEntityInput = {
  Clicked: Scalars['Int'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MessageType?: InputMaybe<Scalars['String']>;
  URL?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ShortenUrlEntitySortInput = {
  clicked?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  messageType?: InputMaybe<SortEnumType>;
  uRL?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type SiteAddress = {
  __typename?: 'SiteAddress';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<Province>;
  provinceId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  ward?: Maybe<Scalars['String']>;
};

export type SiteAddressFilterInput = {
  addressLine1?: InputMaybe<StringOperationFilterInput>;
  addressLine2?: InputMaybe<StringOperationFilterInput>;
  addressLine3?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<SiteAddressFilterInput>>;
  area?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  latitude?: InputMaybe<StringOperationFilterInput>;
  longitude?: InputMaybe<StringOperationFilterInput>;
  municipality?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SiteAddressFilterInput>>;
  postalCode?: InputMaybe<StringOperationFilterInput>;
  province?: InputMaybe<ProvinceFilterInput>;
  provinceId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  ward?: InputMaybe<StringOperationFilterInput>;
};

export type SiteAddressInput = {
  AddressLine1?: InputMaybe<Scalars['String']>;
  AddressLine2?: InputMaybe<Scalars['String']>;
  AddressLine3?: InputMaybe<Scalars['String']>;
  Area?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Latitude?: InputMaybe<Scalars['String']>;
  Longitude?: InputMaybe<Scalars['String']>;
  Municipality?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  PostalCode?: InputMaybe<Scalars['String']>;
  Province?: InputMaybe<ProvinceInput>;
  ProvinceId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Ward?: InputMaybe<Scalars['String']>;
};

export type SiteAddressModel = {
  __typename?: 'SiteAddressModel';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<ProvinceModel>;
  provinceId?: Maybe<Scalars['UUID']>;
  ward?: Maybe<Scalars['String']>;
};

export type SiteAddressSortInput = {
  addressLine1?: InputMaybe<SortEnumType>;
  addressLine2?: InputMaybe<SortEnumType>;
  addressLine3?: InputMaybe<SortEnumType>;
  area?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  latitude?: InputMaybe<SortEnumType>;
  longitude?: InputMaybe<SortEnumType>;
  municipality?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  postalCode?: InputMaybe<SortEnumType>;
  province?: InputMaybe<ProvinceSortInput>;
  provinceId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  ward?: InputMaybe<SortEnumType>;
};

export type SmartSpaceVisit = {
  __typename?: 'SmartSpaceVisit';
  capacity: Scalars['Int'];
  dateOfVisit?: Maybe<Scalars['DateTime']>;
  hasAcceptedSmartSpaceAgreement?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberOfAssistants: Scalars['Int'];
  ownsProperty?: Maybe<Scalars['Boolean']>;
  q1?: Maybe<Scalars['Boolean']>;
  q2?: Maybe<Scalars['Boolean']>;
  q3?: Maybe<Scalars['Boolean']>;
  q4?: Maybe<Scalars['Boolean']>;
  q5?: Maybe<Scalars['Boolean']>;
  q6?: Maybe<Scalars['Boolean']>;
  q7?: Maybe<Scalars['Boolean']>;
  q8?: Maybe<Scalars['Boolean']>;
  q9?: Maybe<Scalars['Boolean']>;
  q10?: Maybe<Scalars['Boolean']>;
  q11?: Maybe<Scalars['Boolean']>;
  q12?: Maybe<Scalars['Boolean']>;
  q13?: Maybe<Scalars['Boolean']>;
  q14?: Maybe<Scalars['Boolean']>;
  q15?: Maybe<Scalars['Boolean']>;
  q16?: Maybe<Scalars['Boolean']>;
  q17?: Maybe<Scalars['Boolean']>;
  q18?: Maybe<Scalars['Boolean']>;
  q19?: Maybe<Scalars['Boolean']>;
  q20?: Maybe<Scalars['Boolean']>;
  q21?: Maybe<Scalars['Boolean']>;
  requiredItemsScore: Scalars['Int'];
  totalScore: Scalars['Int'];
  unrequiredItemsScore: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type SmartSpaceVisitFilterInput = {
  and?: InputMaybe<Array<SmartSpaceVisitFilterInput>>;
  capacity?: InputMaybe<ComparableInt32OperationFilterInput>;
  dateOfVisit?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  hasAcceptedSmartSpaceAgreement?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  latitude?: InputMaybe<StringOperationFilterInput>;
  longitude?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  numberOfAssistants?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<SmartSpaceVisitFilterInput>>;
  ownsProperty?: InputMaybe<BooleanOperationFilterInput>;
  q1?: InputMaybe<BooleanOperationFilterInput>;
  q2?: InputMaybe<BooleanOperationFilterInput>;
  q3?: InputMaybe<BooleanOperationFilterInput>;
  q4?: InputMaybe<BooleanOperationFilterInput>;
  q5?: InputMaybe<BooleanOperationFilterInput>;
  q6?: InputMaybe<BooleanOperationFilterInput>;
  q7?: InputMaybe<BooleanOperationFilterInput>;
  q8?: InputMaybe<BooleanOperationFilterInput>;
  q9?: InputMaybe<BooleanOperationFilterInput>;
  q10?: InputMaybe<BooleanOperationFilterInput>;
  q11?: InputMaybe<BooleanOperationFilterInput>;
  q12?: InputMaybe<BooleanOperationFilterInput>;
  q13?: InputMaybe<BooleanOperationFilterInput>;
  q14?: InputMaybe<BooleanOperationFilterInput>;
  q15?: InputMaybe<BooleanOperationFilterInput>;
  q16?: InputMaybe<BooleanOperationFilterInput>;
  q17?: InputMaybe<BooleanOperationFilterInput>;
  q18?: InputMaybe<BooleanOperationFilterInput>;
  q19?: InputMaybe<BooleanOperationFilterInput>;
  q20?: InputMaybe<BooleanOperationFilterInput>;
  q21?: InputMaybe<BooleanOperationFilterInput>;
  requiredItemsScore?: InputMaybe<ComparableInt32OperationFilterInput>;
  totalScore?: InputMaybe<ComparableInt32OperationFilterInput>;
  unrequiredItemsScore?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type SmartSpaceVisitInput = {
  Capacity: Scalars['Int'];
  DateOfVisit?: InputMaybe<Scalars['DateTime']>;
  HasAcceptedSmartSpaceAgreement?: InputMaybe<Scalars['Boolean']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Latitude?: InputMaybe<Scalars['String']>;
  Longitude?: InputMaybe<Scalars['String']>;
  Name?: InputMaybe<Scalars['String']>;
  NumberOfAssistants: Scalars['Int'];
  OwnsProperty?: InputMaybe<Scalars['Boolean']>;
  Q1?: InputMaybe<Scalars['Boolean']>;
  Q2?: InputMaybe<Scalars['Boolean']>;
  Q3?: InputMaybe<Scalars['Boolean']>;
  Q4?: InputMaybe<Scalars['Boolean']>;
  Q5?: InputMaybe<Scalars['Boolean']>;
  Q6?: InputMaybe<Scalars['Boolean']>;
  Q7?: InputMaybe<Scalars['Boolean']>;
  Q8?: InputMaybe<Scalars['Boolean']>;
  Q9?: InputMaybe<Scalars['Boolean']>;
  Q10?: InputMaybe<Scalars['Boolean']>;
  Q11?: InputMaybe<Scalars['Boolean']>;
  Q12?: InputMaybe<Scalars['Boolean']>;
  Q13?: InputMaybe<Scalars['Boolean']>;
  Q14?: InputMaybe<Scalars['Boolean']>;
  Q15?: InputMaybe<Scalars['Boolean']>;
  Q16?: InputMaybe<Scalars['Boolean']>;
  Q17?: InputMaybe<Scalars['Boolean']>;
  Q18?: InputMaybe<Scalars['Boolean']>;
  Q19?: InputMaybe<Scalars['Boolean']>;
  Q20?: InputMaybe<Scalars['Boolean']>;
  Q21?: InputMaybe<Scalars['Boolean']>;
  RequiredItemsScore: Scalars['Int'];
  TotalScore: Scalars['Int'];
  UnrequiredItemsScore: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type SmartSpaceVisitSortInput = {
  capacity?: InputMaybe<SortEnumType>;
  dateOfVisit?: InputMaybe<SortEnumType>;
  hasAcceptedSmartSpaceAgreement?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  latitude?: InputMaybe<SortEnumType>;
  longitude?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  numberOfAssistants?: InputMaybe<SortEnumType>;
  ownsProperty?: InputMaybe<SortEnumType>;
  q1?: InputMaybe<SortEnumType>;
  q2?: InputMaybe<SortEnumType>;
  q3?: InputMaybe<SortEnumType>;
  q4?: InputMaybe<SortEnumType>;
  q5?: InputMaybe<SortEnumType>;
  q6?: InputMaybe<SortEnumType>;
  q7?: InputMaybe<SortEnumType>;
  q8?: InputMaybe<SortEnumType>;
  q9?: InputMaybe<SortEnumType>;
  q10?: InputMaybe<SortEnumType>;
  q11?: InputMaybe<SortEnumType>;
  q12?: InputMaybe<SortEnumType>;
  q13?: InputMaybe<SortEnumType>;
  q14?: InputMaybe<SortEnumType>;
  q15?: InputMaybe<SortEnumType>;
  q16?: InputMaybe<SortEnumType>;
  q17?: InputMaybe<SortEnumType>;
  q18?: InputMaybe<SortEnumType>;
  q19?: InputMaybe<SortEnumType>;
  q20?: InputMaybe<SortEnumType>;
  q21?: InputMaybe<SortEnumType>;
  requiredItemsScore?: InputMaybe<SortEnumType>;
  totalScore?: InputMaybe<SortEnumType>;
  unrequiredItemsScore?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export enum SortEnumType {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type StatementsContributionType = {
  __typename?: 'StatementsContributionType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsContributionTypeFilterInput = {
  and?: InputMaybe<Array<StatementsContributionTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsContributionTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsContributionTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsContributionTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsExpenseType = {
  __typename?: 'StatementsExpenseType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsExpenseTypeFilterInput = {
  and?: InputMaybe<Array<StatementsExpenseTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsExpenseTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsExpenseTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsExpenseTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsExpenses = {
  __typename?: 'StatementsExpenses';
  amount: Scalars['Float'];
  datePaid: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  expenseTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  statementsIncomeStatementId?: Maybe<Scalars['UUID']>;
  submitted: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type StatementsExpensesFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  datePaid?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  expenseTypeId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  statementsIncomeStatementId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type StatementsExpensesInput = {
  Amount: Scalars['Float'];
  DatePaid: Scalars['DateTime'];
  Description?: InputMaybe<Scalars['String']>;
  ExpenseTypeId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  StatementsIncomeStatementId?: InputMaybe<Scalars['UUID']>;
  Submitted: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type StatementsExpensesSortInput = {
  amount?: InputMaybe<SortEnumType>;
  datePaid?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  expenseTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
  statementsIncomeStatementId?: InputMaybe<SortEnumType>;
  submitted?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type StatementsFeeType = {
  __typename?: 'StatementsFeeType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsFeeTypeFilterInput = {
  and?: InputMaybe<Array<StatementsFeeTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsFeeTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsFeeTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsFeeTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsIncome = {
  __typename?: 'StatementsIncome';
  amount: Scalars['Float'];
  amountExpected: Scalars['Float'];
  childCoverAmount: Scalars['Float'];
  childUserId?: Maybe<Scalars['UUID']>;
  contributionTypeId?: Maybe<Scalars['String']>;
  dateReceived: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  feeTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeTypeId?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  payTypeId?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  statementsIncomeStatementId?: Maybe<Scalars['UUID']>;
  submitted: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type StatementsIncomeFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  amountExpected?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  childCoverAmount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  childUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  contributionTypeId?: InputMaybe<StringOperationFilterInput>;
  dateReceived?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  feeTypeId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeTypeId?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  payTypeId?: InputMaybe<StringOperationFilterInput>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  statementsIncomeStatementId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type StatementsIncomeInput = {
  Amount: Scalars['Float'];
  AmountExpected: Scalars['Float'];
  ChildCoverAmount: Scalars['Float'];
  ChildUserId?: InputMaybe<Scalars['UUID']>;
  ContributionTypeId?: InputMaybe<Scalars['String']>;
  DateReceived: Scalars['DateTime'];
  Description?: InputMaybe<Scalars['String']>;
  FeeTypeId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeTypeId?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  PayTypeId?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  StatementsIncomeStatementId?: InputMaybe<Scalars['UUID']>;
  Submitted: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type StatementsIncomeSortInput = {
  amount?: InputMaybe<SortEnumType>;
  amountExpected?: InputMaybe<SortEnumType>;
  childCoverAmount?: InputMaybe<SortEnumType>;
  childUserId?: InputMaybe<SortEnumType>;
  contributionTypeId?: InputMaybe<SortEnumType>;
  dateReceived?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  feeTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  incomeTypeId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  payTypeId?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
  statementsIncomeStatementId?: InputMaybe<SortEnumType>;
  submitted?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type StatementsIncomeStatement = {
  __typename?: 'StatementsIncomeStatement';
  annualSubmittedDate?: Maybe<Scalars['DateTime']>;
  autoSubmitted: Scalars['Boolean'];
  balance: Scalars['Float'];
  contactedByCoach: Scalars['Boolean'];
  expenseItems?: Maybe<Array<Maybe<StatementsExpenses>>>;
  expenseTotal: Scalars['Float'];
  id: Scalars['UUID'];
  incomeItems?: Maybe<Array<Maybe<StatementsIncome>>>;
  incomeTotal: Scalars['Float'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  notes?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  relatedDocumentId?: Maybe<Scalars['String']>;
  submitted: Scalars['Boolean'];
  submittedDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
  year: Scalars['Int'];
};

export type StatementsIncomeStatementFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  annualSubmittedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  autoSubmitted?: InputMaybe<BooleanOperationFilterInput>;
  balance?: InputMaybe<ComparableDoubleOperationFilterInput>;
  contactedByCoach?: InputMaybe<BooleanOperationFilterInput>;
  expenseItems?: InputMaybe<ListFilterInputTypeOfStatementsExpensesFilterInput>;
  expenseTotal?: InputMaybe<ComparableDoubleOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeItems?: InputMaybe<ListFilterInputTypeOfStatementsIncomeFilterInput>;
  incomeTotal?: InputMaybe<ComparableDoubleOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  period?: InputMaybe<StringOperationFilterInput>;
  relatedDocumentId?: InputMaybe<StringOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  submittedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type StatementsIncomeStatementInput = {
  AnnualSubmittedDate?: InputMaybe<Scalars['DateTime']>;
  AutoSubmitted: Scalars['Boolean'];
  Balance: Scalars['Float'];
  ContactedByCoach: Scalars['Boolean'];
  ExpenseItems?: InputMaybe<Array<InputMaybe<StatementsExpensesInput>>>;
  ExpenseTotal: Scalars['Float'];
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeItems?: InputMaybe<Array<InputMaybe<StatementsIncomeInput>>>;
  IncomeTotal: Scalars['Float'];
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  Notes?: InputMaybe<Scalars['String']>;
  Period?: InputMaybe<Scalars['String']>;
  RelatedDocumentId?: InputMaybe<Scalars['String']>;
  Submitted: Scalars['Boolean'];
  SubmittedDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type StatementsIncomeStatementSortInput = {
  annualSubmittedDate?: InputMaybe<SortEnumType>;
  autoSubmitted?: InputMaybe<SortEnumType>;
  balance?: InputMaybe<SortEnumType>;
  contactedByCoach?: InputMaybe<SortEnumType>;
  expenseTotal?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  incomeTotal?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  period?: InputMaybe<SortEnumType>;
  relatedDocumentId?: InputMaybe<SortEnumType>;
  submitted?: InputMaybe<SortEnumType>;
  submittedDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
  year?: InputMaybe<SortEnumType>;
};

export type StatementsIncomeType = {
  __typename?: 'StatementsIncomeType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsIncomeTypeFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsIncomeTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsIncomeTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsPayType = {
  __typename?: 'StatementsPayType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsPayTypeFilterInput = {
  and?: InputMaybe<Array<StatementsPayTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsPayTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsPayTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsPayTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsStartupSupport = {
  __typename?: 'StatementsStartupSupport';
  amount: Scalars['Float'];
  childUserId?: Maybe<Scalars['UUID']>;
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  programmeId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
};

export type StatementsStartupSupportFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsStartupSupportFilterInput>>;
  childUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsStartupSupportFilterInput>>;
  programmeId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type StatementsStartupSupportInput = {
  Amount: Scalars['Float'];
  ChildUserId?: InputMaybe<Scalars['UUID']>;
  Description?: InputMaybe<Scalars['String']>;
  EndDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  ProgrammeId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type StatementsStartupSupportSortInput = {
  amount?: InputMaybe<SortEnumType>;
  childUserId?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  endDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  programmeId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type StoryBook = {
  __typename?: 'StoryBook';
  author?: Maybe<Scalars['String']>;
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  bookLocation?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  illustrator?: Maybe<Scalars['String']>;
  keywords?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  storyBookParts?: Maybe<Array<Maybe<StoryBookParts>>>;
  type?: Maybe<Scalars['String']>;
};

export type StoryBookInput = {
  author?: InputMaybe<Scalars['String']>;
  availableLanguages?: InputMaybe<Scalars['String']>;
  bookLocation?: InputMaybe<Scalars['String']>;
  illustrator?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  storyBookParts?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type StoryBookModelInput = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  part?: InputMaybe<Scalars['String']>;
  partContentTypeId: Scalars['Int'];
  partText?: InputMaybe<Scalars['String']>;
  questionChange: Scalars['Boolean'];
  questionContentTypeId: Scalars['Int'];
  questionId?: InputMaybe<Scalars['String']>;
  questionName?: InputMaybe<Scalars['String']>;
  questionText?: InputMaybe<Scalars['String']>;
};

export type StoryBookPartQuestion = {
  __typename?: 'StoryBookPartQuestion';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
};

export type StoryBookPartQuestionInput = {
  name?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
};

export type StoryBookParts = {
  __typename?: 'StoryBookParts';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  part?: Maybe<Scalars['String']>;
  partText?: Maybe<Scalars['String']>;
  storyBookPartQuestions?: Maybe<Array<Maybe<StoryBookPartQuestion>>>;
};

export type StoryBookPartsInput = {
  name?: InputMaybe<Scalars['String']>;
  part?: InputMaybe<Scalars['String']>;
  partText?: InputMaybe<Scalars['String']>;
  storyBookPartQuestions?: InputMaybe<Scalars['String']>;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  ncontains?: InputMaybe<Scalars['String']>;
  nendsWith?: InputMaybe<Scalars['String']>;
  neq?: InputMaybe<Scalars['String']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  nstartsWith?: InputMaybe<Scalars['String']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type SubCategorySkillModelInput = {
  contentTypeId: Scalars['Int'];
  id?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type SubDistrict = {
  __typename?: 'SubDistrict';
  district?: Maybe<District>;
  districtId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type SubDistrictFilterInput = {
  and?: InputMaybe<Array<SubDistrictFilterInput>>;
  district?: InputMaybe<DistrictFilterInput>;
  districtId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SubDistrictFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type SubDistrictInput = {
  District?: InputMaybe<DistrictInput>;
  DistrictId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type SubDistrictModelInput = {
  districtId: Scalars['UUID'];
  id?: InputMaybe<Scalars['UUID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type SubDistrictSortInput = {
  district?: InputMaybe<DistrictSortInput>;
  districtId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type SubDistrictStatsModel = {
  __typename?: 'SubDistrictStatsModel';
  district?: Maybe<District>;
  id?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  totalClinics: Scalars['Int'];
  totalHCWs: Scalars['Int'];
  totalTeamLeads: Scalars['Int'];
};

export type SubmitStatementModelInput = {
  expenseItemIds?: InputMaybe<Array<Scalars['UUID']>>;
  incomeItemIds?: InputMaybe<Array<Scalars['UUID']>>;
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type SupportVisitModelInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  attended?: InputMaybe<Scalars['Boolean']>;
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  infantId?: InputMaybe<Scalars['UUID']>;
  isSupportCall?: InputMaybe<Scalars['Boolean']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  motherId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
  supportData?: InputMaybe<CmsVisitDataInputModelInput>;
  traineeId?: InputMaybe<Scalars['UUID']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
};

export type SystemSetting = {
  __typename?: 'SystemSetting';
  fullPath?: Maybe<Scalars['String']>;
  grouping?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isSystemValue?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  value?: Maybe<Scalars['String']>;
};

export type SystemSettingFilterInput = {
  and?: InputMaybe<Array<SystemSettingFilterInput>>;
  fullPath?: InputMaybe<StringOperationFilterInput>;
  grouping?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isSystemValue?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SystemSettingFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  value?: InputMaybe<StringOperationFilterInput>;
};

export type SystemSettingInput = {
  FullPath?: InputMaybe<Scalars['String']>;
  Grouping?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsSystemValue?: InputMaybe<Scalars['Boolean']>;
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Value?: InputMaybe<Scalars['String']>;
};

export type SystemSettingSortInput = {
  fullPath?: InputMaybe<SortEnumType>;
  grouping?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isSystemValue?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  value?: InputMaybe<SortEnumType>;
};

export type TagsReplacementsInput = {
  findValue?: InputMaybe<Scalars['String']>;
  replacementValue?: InputMaybe<Scalars['String']>;
};

export type TeamLead = {
  __typename?: 'TeamLead';
  clinics?: Maybe<Array<Maybe<ClinicTeamLead>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type TeamLeadFilterInput = {
  and?: InputMaybe<Array<TeamLeadFilterInput>>;
  clinics?: InputMaybe<ListFilterInputTypeOfClinicTeamLeadFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  jobTitle?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TeamLeadFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type TeamLeadInput = {
  Clinics?: InputMaybe<Array<InputMaybe<ClinicTeamLeadInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  JobTitle?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type TeamLeadModel = {
  __typename?: 'TeamLeadModel';
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  jobTitle?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type TeamLeadModelInput = {
  clinic?: InputMaybe<ClinicInput>;
  clinicId?: InputMaybe<Scalars['UUID']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<ApplicationUserInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type TeamLeadSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  jobTitle?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type TenantModel = {
  __typename?: 'TenantModel';
  adminSiteAddress?: Maybe<Scalars['String']>;
  adminTestSiteAddress?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  moodleConfigVar?: Maybe<Scalars['String']>;
  moodleUrlVar?: Maybe<Scalars['String']>;
  organisationName?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<Scalars['String']>;
  tenantType: TenantType;
  testSiteAddress?: Maybe<Scalars['String']>;
  themePathVar?: Maybe<Scalars['String']>;
  var1?: Maybe<Scalars['String']>;
  var2?: Maybe<Scalars['String']>;
};

export enum TenantType {
  Host = 'HOST',
  Tenant = 'TENANT',
}

export type Theme = {
  __typename?: 'Theme';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  themeDays?: Maybe<Array<Maybe<ThemeDay>>>;
};

export type ThemeDay = {
  __typename?: 'ThemeDay';
  day?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  largeGroupActivity?: Maybe<Array<Maybe<Activity>>>;
  name?: Maybe<Scalars['String']>;
  smallGroupActivity?: Maybe<Array<Maybe<Activity>>>;
  storyActivity?: Maybe<Array<Maybe<Activity>>>;
  storyBook?: Maybe<Array<Maybe<StoryBook>>>;
};

export type ThemeDayInput = {
  day?: InputMaybe<Scalars['String']>;
  largeGroupActivity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  smallGroupActivity?: InputMaybe<Scalars['String']>;
  storyActivity?: InputMaybe<Scalars['String']>;
  storyBook?: InputMaybe<Scalars['String']>;
};

export type ThemeInput = {
  color?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  themeDays?: InputMaybe<Scalars['String']>;
};

export type TokenAccessChildDetailModel = {
  __typename?: 'TokenAccessChildDetailModel';
  firstname?: Maybe<Scalars['String']>;
  groupFeeAmount?: Maybe<Scalars['Float']>;
  groupName?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type TokenAccessPractitionerDetailModel = {
  __typename?: 'TokenAccessPractitionerDetailModel';
  firstname?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type TotalAttendanceStatsReport = {
  __typename?: 'TotalAttendanceStatsReport';
  totalChildrenAttendedAllSessions: Scalars['Int'];
  totalMonthlyAttendance: Scalars['Int'];
  totalSessions: Scalars['Int'];
};

export type TrackAttendanceAttendeeModelInput = {
  attended: Scalars['Boolean'];
  userId?: InputMaybe<Scalars['String']>;
};

export type TrackAttendanceModelInput = {
  attendanceDate: Scalars['DateTime'];
  attendees?: InputMaybe<Array<InputMaybe<TrackAttendanceAttendeeModelInput>>>;
  classroomProgrammeId: Scalars['UUID'];
  programmeOwnerId?: InputMaybe<Scalars['String']>;
};

export type Trainee = {
  __typename?: 'Trainee';
  adminFileReceived?: Maybe<Scalars['Boolean']>;
  attendedStartUpTraining?: Maybe<Scalars['Boolean']>;
  childProgressTraining?: Maybe<Scalars['Boolean']>;
  childrenAddedDate?: Maybe<Scalars['DateTime']>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  communitySupportGained?: Maybe<Scalars['DateTime']>;
  consolidationMeetingDate?: Maybe<Scalars['DateTime']>;
  franchiseeAgreementAcceptedDate?: Maybe<Scalars['DateTime']>;
  haveCommunitySupport?: Maybe<Scalars['Boolean']>;
  highestEducationLevel?: Maybe<Scalars['String']>;
  homeAddressLine1?: Maybe<Scalars['String']>;
  homeAddressLine2?: Maybe<Scalars['String']>;
  homeAddressLine3?: Maybe<Scalars['String']>;
  homeAddressPostalCode?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isAdminFileAndPlaykitValidated?: Maybe<Scalars['Boolean']>;
  isOnStipend?: Maybe<Scalars['Boolean']>;
  isSmartSpaceVisitValidated?: Maybe<Scalars['Boolean']>;
  linkedPrincipalHierarchy?: Maybe<Scalars['UUID']>;
  playKitReceived?: Maybe<Scalars['Boolean']>;
  practitioner?: Maybe<Practitioner>;
  practitionerId: Scalars['UUID'];
  preferredCommunicationLanguage?: Maybe<Scalars['String']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  scheduledConsolidationMeetingDate?: Maybe<Scalars['DateTime']>;
  siteArea?: Maybe<Scalars['String']>;
  siteVisitsCompleted?: Maybe<Scalars['Boolean']>;
  smartSpaceLicenceDate?: Maybe<Scalars['DateTime']>;
  smartSpaceVisitPassed?: Maybe<Scalars['Boolean']>;
  startDate?: Maybe<Scalars['DateTime']>;
  starterLicenceDate?: Maybe<Scalars['DateTime']>;
  starterLicenceReceived?: Maybe<Scalars['Boolean']>;
  stipendType?: Maybe<Scalars['String']>;
  traineeConvertedDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type TraineeAddressModelInput = {
  homeAddressLine1?: InputMaybe<Scalars['String']>;
  homeAddressLine2?: InputMaybe<Scalars['String']>;
  homeAddressLine3?: InputMaybe<Scalars['String']>;
  homeAddressPostalCode?: InputMaybe<Scalars['String']>;
};

export type TraineeFilterInput = {
  adminFileReceived?: InputMaybe<BooleanOperationFilterInput>;
  and?: InputMaybe<Array<TraineeFilterInput>>;
  attendedStartUpTraining?: InputMaybe<BooleanOperationFilterInput>;
  childProgressTraining?: InputMaybe<BooleanOperationFilterInput>;
  childrenAddedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  communitySupportGained?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  consolidationMeetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  franchiseeAgreementAcceptedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  haveCommunitySupport?: InputMaybe<BooleanOperationFilterInput>;
  highestEducationLevel?: InputMaybe<StringOperationFilterInput>;
  homeAddressLine1?: InputMaybe<StringOperationFilterInput>;
  homeAddressLine2?: InputMaybe<StringOperationFilterInput>;
  homeAddressLine3?: InputMaybe<StringOperationFilterInput>;
  homeAddressPostalCode?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isAdminFileAndPlaykitValidated?: InputMaybe<BooleanOperationFilterInput>;
  isOnStipend?: InputMaybe<BooleanOperationFilterInput>;
  isSmartSpaceVisitValidated?: InputMaybe<BooleanOperationFilterInput>;
  linkedPrincipalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<TraineeFilterInput>>;
  playKitReceived?: InputMaybe<BooleanOperationFilterInput>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableGuidOperationFilterInput>;
  preferredCommunicationLanguage?: InputMaybe<StringOperationFilterInput>;
  programmeType?: InputMaybe<StringOperationFilterInput>;
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
  scheduledConsolidationMeetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  siteArea?: InputMaybe<StringOperationFilterInput>;
  siteVisitsCompleted?: InputMaybe<BooleanOperationFilterInput>;
  smartSpaceLicenceDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  smartSpaceVisitPassed?: InputMaybe<BooleanOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  starterLicenceDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  starterLicenceReceived?: InputMaybe<BooleanOperationFilterInput>;
  stipendType?: InputMaybe<StringOperationFilterInput>;
  traineeConvertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type TraineeInput = {
  AdminFileReceived?: InputMaybe<Scalars['Boolean']>;
  AttendedStartUpTraining?: InputMaybe<Scalars['Boolean']>;
  ChildProgressTraining?: InputMaybe<Scalars['Boolean']>;
  ChildrenAddedDate?: InputMaybe<Scalars['DateTime']>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  CommunitySupportGained?: InputMaybe<Scalars['DateTime']>;
  ConsolidationMeetingDate?: InputMaybe<Scalars['DateTime']>;
  FranchiseeAgreementAcceptedDate?: InputMaybe<Scalars['DateTime']>;
  HaveCommunitySupport?: InputMaybe<Scalars['Boolean']>;
  HighestEducationLevel?: InputMaybe<Scalars['String']>;
  HomeAddressLine1?: InputMaybe<Scalars['String']>;
  HomeAddressLine2?: InputMaybe<Scalars['String']>;
  HomeAddressLine3?: InputMaybe<Scalars['String']>;
  HomeAddressPostalCode?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsAdminFileAndPlaykitValidated?: InputMaybe<Scalars['Boolean']>;
  IsOnStipend?: InputMaybe<Scalars['Boolean']>;
  IsSmartSpaceVisitValidated?: InputMaybe<Scalars['Boolean']>;
  LinkedPrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  PlayKitReceived?: InputMaybe<Scalars['Boolean']>;
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId: Scalars['UUID'];
  PreferredCommunicationLanguage?: InputMaybe<Scalars['String']>;
  ProgrammeType?: InputMaybe<Scalars['String']>;
  Progress: Scalars['Decimal'];
  ScheduledConsolidationMeetingDate?: InputMaybe<Scalars['DateTime']>;
  SiteArea?: InputMaybe<Scalars['String']>;
  SiteVisitsCompleted?: InputMaybe<Scalars['Boolean']>;
  SmartSpaceLicenceDate?: InputMaybe<Scalars['DateTime']>;
  SmartSpaceVisitPassed?: InputMaybe<Scalars['Boolean']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  StarterLicenceDate?: InputMaybe<Scalars['DateTime']>;
  StarterLicenceReceived?: InputMaybe<Scalars['Boolean']>;
  StipendType?: InputMaybe<Scalars['String']>;
  TraineeConvertedDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type TraineeOnBoardTimeline = {
  __typename?: 'TraineeOnBoardTimeline';
  communitySupportColor?: Maybe<Scalars['String']>;
  communitySupportDate?: Maybe<Scalars['DateTime']>;
  communitySupportDeadlineDate?: Maybe<Scalars['DateTime']>;
  communitySupportStatus?: Maybe<Scalars['String']>;
  consolidationDeadlineDate?: Maybe<Scalars['DateTime']>;
  consolidationMeetingColor?: Maybe<Scalars['String']>;
  consolidationMeetingDate?: Maybe<Scalars['DateTime']>;
  consolidationMeetingDateScheduled?: Maybe<Scalars['DateTime']>;
  consolidationMeetingStatus?: Maybe<Scalars['String']>;
  dayOneStartUpTrainingColor?: Maybe<Scalars['String']>;
  dayOneStartUpTrainingDate?: Maybe<Scalars['DateTime']>;
  dayOneStartUpTrainingStatus?: Maybe<Scalars['String']>;
  sSCoachVisitColor?: Maybe<Scalars['String']>;
  sSCoachVisitDate?: Maybe<Scalars['DateTime']>;
  sSCoachVisitDeadlineDate?: Maybe<Scalars['DateTime']>;
  sSCoachVisitDone: Scalars['Boolean'];
  sSCoachVisitEventId?: Maybe<Scalars['UUID']>;
  sSCoachVisitId?: Maybe<Scalars['UUID']>;
  sSCoachVisitStatus?: Maybe<Scalars['String']>;
  signFranchiseeAgreementColor?: Maybe<Scalars['String']>;
  signFranchiseeAgreementDate?: Maybe<Scalars['DateTime']>;
  signFranchiseeAgreementDeadlineDate?: Maybe<Scalars['DateTime']>;
  signFranchiseeAgreementStatus?: Maybe<Scalars['String']>;
  signStartUpSupportAgreementColor?: Maybe<Scalars['String']>;
  signStartUpSupportAgreementDate?: Maybe<Scalars['DateTime']>;
  signStartUpSupportAgreementDeadlineDate?: Maybe<Scalars['DateTime']>;
  signStartUpSupportAgreementStatus?: Maybe<Scalars['String']>;
  smartSpaceChecklistColor?: Maybe<Scalars['String']>;
  smartSpaceChecklistDate?: Maybe<Scalars['DateTime']>;
  smartSpaceChecklistDeadlineDate?: Maybe<Scalars['DateTime']>;
  smartSpaceChecklistStatus?: Maybe<Scalars['String']>;
  smartSpaceLicenseColor?: Maybe<Scalars['String']>;
  smartSpaceLicenseDate?: Maybe<Scalars['DateTime']>;
  smartSpaceLicenseNotAwardedDate?: Maybe<Scalars['DateTime']>;
  smartSpaceLicenseNotAwardedSteps?: Maybe<Scalars['String']>;
  smartSpaceLicenseStatus?: Maybe<Scalars['String']>;
  startUpSupportAmount?: Maybe<Scalars['Float']>;
  startUpSupportEndDate?: Maybe<Scalars['DateTime']>;
  startUpSupportStartDate?: Maybe<Scalars['DateTime']>;
  starterLicenseColor?: Maybe<Scalars['String']>;
  starterLicenseDate?: Maybe<Scalars['DateTime']>;
  starterLicenseStatus?: Maybe<Scalars['String']>;
  threeChildrenRegisteredColor?: Maybe<Scalars['String']>;
  threeChildrenRegisteredDate?: Maybe<Scalars['DateTime']>;
  threeChildrenRegisteredDeadlineDate?: Maybe<Scalars['DateTime']>;
  threeChildrenRegisteredStatus?: Maybe<Scalars['String']>;
  traineeVisits?: Maybe<Array<Maybe<Visit>>>;
};

export type TraineeSortInput = {
  adminFileReceived?: InputMaybe<SortEnumType>;
  attendedStartUpTraining?: InputMaybe<SortEnumType>;
  childProgressTraining?: InputMaybe<SortEnumType>;
  childrenAddedDate?: InputMaybe<SortEnumType>;
  coachHierarchy?: InputMaybe<SortEnumType>;
  communitySupportGained?: InputMaybe<SortEnumType>;
  consolidationMeetingDate?: InputMaybe<SortEnumType>;
  franchiseeAgreementAcceptedDate?: InputMaybe<SortEnumType>;
  haveCommunitySupport?: InputMaybe<SortEnumType>;
  highestEducationLevel?: InputMaybe<SortEnumType>;
  homeAddressLine1?: InputMaybe<SortEnumType>;
  homeAddressLine2?: InputMaybe<SortEnumType>;
  homeAddressLine3?: InputMaybe<SortEnumType>;
  homeAddressPostalCode?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isAdminFileAndPlaykitValidated?: InputMaybe<SortEnumType>;
  isOnStipend?: InputMaybe<SortEnumType>;
  isSmartSpaceVisitValidated?: InputMaybe<SortEnumType>;
  linkedPrincipalHierarchy?: InputMaybe<SortEnumType>;
  playKitReceived?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  preferredCommunicationLanguage?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<SortEnumType>;
  progress?: InputMaybe<SortEnumType>;
  scheduledConsolidationMeetingDate?: InputMaybe<SortEnumType>;
  siteArea?: InputMaybe<SortEnumType>;
  siteVisitsCompleted?: InputMaybe<SortEnumType>;
  smartSpaceLicenceDate?: InputMaybe<SortEnumType>;
  smartSpaceVisitPassed?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  starterLicenceDate?: InputMaybe<SortEnumType>;
  starterLicenceReceived?: InputMaybe<SortEnumType>;
  stipendType?: InputMaybe<SortEnumType>;
  traineeConvertedDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type UpdateVisitPlannedVisitDateModelInput = {
  eventId: Scalars['UUID'];
  plannedVisitDate: Scalars['DateTime'];
  visitId: Scalars['UUID'];
};

export type UserByToken = {
  __typename?: 'UserByToken';
  fullName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  roleName?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type UserClubStandingModel = {
  __typename?: 'UserClubStandingModel';
  percentageMembersWithFewerPointsForCurrentMonth: Scalars['Int'];
  percentageMembersWithFewerPointsForCurrentYear: Scalars['Int'];
  percentageMembersWithMorePointsForCurrentMonth: Scalars['Int'];
  percentageMembersWithMorePointsForCurrentYear: Scalars['Int'];
};

export type UserConsent = {
  __typename?: 'UserConsent';
  consentId: Scalars['Int'];
  consentType?: Maybe<Scalars['String']>;
  createdUserId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type UserConsentFilterInput = {
  and?: InputMaybe<Array<UserConsentFilterInput>>;
  consentId?: InputMaybe<ComparableInt32OperationFilterInput>;
  consentType?: InputMaybe<StringOperationFilterInput>;
  createdUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserConsentFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type UserConsentInput = {
  ConsentId: Scalars['Int'];
  ConsentType?: InputMaybe<Scalars['String']>;
  CreatedUserId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId: Scalars['UUID'];
};

export type UserConsentSortInput = {
  consentId?: InputMaybe<SortEnumType>;
  consentType?: InputMaybe<SortEnumType>;
  createdUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type UserGrant = {
  __typename?: 'UserGrant';
  grant?: Maybe<Grant>;
  grantId: Scalars['UUID'];
  tenantId: Scalars['UUID'];
  userId?: Maybe<Scalars['UUID']>;
};

export type UserGrantInput = {
  grant?: InputMaybe<GrantInput>;
  grantId: Scalars['UUID'];
  tenantId: Scalars['UUID'];
  userId?: InputMaybe<Scalars['UUID']>;
};

export type UserHierarchyEntity = {
  __typename?: 'UserHierarchyEntity';
  hierarchy?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  key: Scalars['Int'];
  namedTypePath?: Maybe<Scalars['String']>;
  parentId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
  userType?: Maybe<Scalars['String']>;
};

export type UserHierarchyEntityFilterInput = {
  and?: InputMaybe<Array<UserHierarchyEntityFilterInput>>;
  hierarchy?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  key?: InputMaybe<ComparableInt32OperationFilterInput>;
  namedTypePath?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<UserHierarchyEntityFilterInput>>;
  parentId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  userType?: InputMaybe<StringOperationFilterInput>;
};

export type UserHierarchyEntityInput = {
  Hierarchy?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  NamedTypePath?: InputMaybe<Scalars['String']>;
  ParentId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  UserType?: InputMaybe<Scalars['String']>;
};

export type UserHierarchyEntitySortInput = {
  hierarchy?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  key?: InputMaybe<SortEnumType>;
  namedTypePath?: InputMaybe<SortEnumType>;
  parentId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  userType?: InputMaybe<SortEnumType>;
};

export type UserImportModel = {
  __typename?: 'UserImportModel';
  createdUsers?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Rows of errors. */
  validationErrors?: Maybe<Array<Maybe<InputValidationError>>>;
};

export type UserModel = {
  __typename?: 'UserModel';
  contactPreference?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  email?: Maybe<Scalars['String']>;
  emergencyContactFirstName?: Maybe<Scalars['String']>;
  emergencyContactPhoneNumber?: Maybe<Scalars['String']>;
  emergencyContactSurname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  genderId?: Maybe<Scalars['UUID']>;
  id?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  isSouthAfricanCitizen?: Maybe<Scalars['Boolean']>;
  languageId?: Maybe<Scalars['UUID']>;
  nextOfKinContactNumber?: Maybe<Scalars['String']>;
  nextOfKinFirstName?: Maybe<Scalars['String']>;
  nextOfKinSurname?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  raceId?: Maybe<Scalars['UUID']>;
  resetData?: Maybe<Scalars['Boolean']>;
  surname?: Maybe<Scalars['String']>;
  verifiedByHomeAffairs?: Maybe<Scalars['Boolean']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type UserModelInput = {
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  email?: InputMaybe<Scalars['String']>;
  emergencyContactFirstName?: InputMaybe<Scalars['String']>;
  emergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  emergencyContactSurname?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  isSouthAfricanCitizen?: InputMaybe<Scalars['Boolean']>;
  languageId?: InputMaybe<Scalars['UUID']>;
  nextOfKinContactNumber?: InputMaybe<Scalars['String']>;
  nextOfKinFirstName?: InputMaybe<Scalars['String']>;
  nextOfKinSurname?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  resetData?: InputMaybe<Scalars['Boolean']>;
  surname?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs?: InputMaybe<Scalars['Boolean']>;
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type Visit = {
  __typename?: 'Visit';
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  attended: Scalars['Boolean'];
  coach?: Maybe<Coach>;
  coachId?: Maybe<Scalars['UUID']>;
  comment?: Maybe<Scalars['String']>;
  delicenseQuestionAnswered: Scalars['Boolean'];
  dueDate?: Maybe<Scalars['DateTime']>;
  event?: Maybe<CalendarEvent>;
  eventId?: Maybe<Scalars['UUID']>;
  hasAnswerData: Scalars['Boolean'];
  id: Scalars['UUID'];
  infant?: Maybe<Infant>;
  infantId?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  integrationSubmitDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  linkedVisitId?: Maybe<Scalars['UUID']>;
  mother?: Maybe<Mother>;
  motherId?: Maybe<Scalars['UUID']>;
  orderDate?: Maybe<Scalars['DateTime']>;
  overallRatingColor?: Maybe<Scalars['String']>;
  pQARating?: Maybe<PqaRating>;
  plannedVisitDate: Scalars['DateTime'];
  practitioner?: Maybe<Practitioner>;
  practitionerId?: Maybe<Scalars['UUID']>;
  rating?: Maybe<Scalars['String']>;
  risk?: Maybe<Scalars['String']>;
  trainee?: Maybe<Trainee>;
  traineeId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitAnswers?: Maybe<Array<Maybe<VisitData>>>;
  visitInProgress: Scalars['Boolean'];
  visitType?: Maybe<VisitType>;
  visitTypeId: Scalars['UUID'];
};

export type VisitBackReferral = {
  __typename?: 'VisitBackReferral';
  answer?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  question?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitDataStatus?: Maybe<VisitDataStatus>;
  visitDataStatusId: Scalars['UUID'];
};

export type VisitBackReferralFilterInput = {
  and?: InputMaybe<Array<VisitBackReferralFilterInput>>;
  answer?: InputMaybe<StringOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<VisitBackReferralFilterInput>>;
  question?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitDataStatus?: InputMaybe<VisitDataStatusFilterInput>;
  visitDataStatusId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type VisitBackReferralInput = {
  Answer?: InputMaybe<Scalars['String']>;
  Comment?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Question?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitDataStatus?: InputMaybe<VisitDataStatusInput>;
  VisitDataStatusId: Scalars['UUID'];
};

export type VisitBackReferralModelInput = {
  answer?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
  visitDataStatus?: InputMaybe<VisitDataStatusInput>;
  visitDataStatusId?: InputMaybe<Scalars['String']>;
};

export type VisitBackReferralSortInput = {
  answer?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  question?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visitDataStatus?: InputMaybe<VisitDataStatusSortInput>;
  visitDataStatusId?: InputMaybe<SortEnumType>;
};

export type VisitData = {
  __typename?: 'VisitData';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  question?: Maybe<Scalars['String']>;
  questionAnswer?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visit?: Maybe<Visit>;
  visitId: Scalars['UUID'];
  visitName?: Maybe<Scalars['String']>;
  visitSection?: Maybe<Scalars['String']>;
};

export type VisitDataFilterInput = {
  and?: InputMaybe<Array<VisitDataFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<VisitDataFilterInput>>;
  question?: InputMaybe<StringOperationFilterInput>;
  questionAnswer?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visit?: InputMaybe<VisitFilterInput>;
  visitId?: InputMaybe<ComparableGuidOperationFilterInput>;
  visitName?: InputMaybe<StringOperationFilterInput>;
  visitSection?: InputMaybe<StringOperationFilterInput>;
};

export type VisitDataInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Question?: InputMaybe<Scalars['String']>;
  QuestionAnswer?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Visit?: InputMaybe<VisitInput>;
  VisitId: Scalars['UUID'];
  VisitName?: InputMaybe<Scalars['String']>;
  VisitSection?: InputMaybe<Scalars['String']>;
};

export type VisitDataSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  question?: InputMaybe<SortEnumType>;
  questionAnswer?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visit?: InputMaybe<VisitSortInput>;
  visitId?: InputMaybe<SortEnumType>;
  visitName?: InputMaybe<SortEnumType>;
  visitSection?: InputMaybe<SortEnumType>;
};

export type VisitDataStatus = {
  __typename?: 'VisitDataStatus';
  backReferral?: Maybe<VisitBackReferral>;
  backReferralCompleted: Scalars['Boolean'];
  backReferralDateCompleted?: Maybe<Scalars['DateTime']>;
  color?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isCompleted: Scalars['Boolean'];
  referralDateCompleted?: Maybe<Scalars['DateTime']>;
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitData?: Maybe<VisitData>;
  visitDataId: Scalars['UUID'];
};

export type VisitDataStatusFilterInput = {
  and?: InputMaybe<Array<VisitDataStatusFilterInput>>;
  backReferral?: InputMaybe<VisitBackReferralFilterInput>;
  backReferralCompleted?: InputMaybe<BooleanOperationFilterInput>;
  backReferralDateCompleted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  color?: InputMaybe<StringOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isCompleted?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<VisitDataStatusFilterInput>>;
  referralDateCompleted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  section?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitData?: InputMaybe<VisitDataFilterInput>;
  visitDataId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type VisitDataStatusInput = {
  BackReferral?: InputMaybe<VisitBackReferralInput>;
  BackReferralCompleted: Scalars['Boolean'];
  BackReferralDateCompleted?: InputMaybe<Scalars['DateTime']>;
  Color?: InputMaybe<Scalars['String']>;
  Comment?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsCompleted: Scalars['Boolean'];
  ReferralDateCompleted?: InputMaybe<Scalars['DateTime']>;
  Section?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitData?: InputMaybe<VisitDataInput>;
  VisitDataId: Scalars['UUID'];
};

export type VisitDataStatusModelInput = {
  backReferral?: InputMaybe<VisitBackReferralInput>;
  backReferralCompleted?: InputMaybe<Scalars['Boolean']>;
  backReferralDateCompleted?: InputMaybe<Scalars['DateTime']>;
  color?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  isCompleted?: InputMaybe<Scalars['Boolean']>;
  referralDateCompleted?: InputMaybe<Scalars['DateTime']>;
  type?: InputMaybe<Scalars['String']>;
  visitData?: InputMaybe<VisitDataInput>;
  visitDataId?: InputMaybe<Scalars['String']>;
};

export type VisitDataStatusReferralInput = {
  referrals?: InputMaybe<Array<InputMaybe<VisitDataStatusModelInput>>>;
};

export type VisitDataStatusSortInput = {
  backReferral?: InputMaybe<VisitBackReferralSortInput>;
  backReferralCompleted?: InputMaybe<SortEnumType>;
  backReferralDateCompleted?: InputMaybe<SortEnumType>;
  color?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isCompleted?: InputMaybe<SortEnumType>;
  referralDateCompleted?: InputMaybe<SortEnumType>;
  section?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visitData?: InputMaybe<VisitDataSortInput>;
  visitDataId?: InputMaybe<SortEnumType>;
};

export type VisitDataSummary = {
  __typename?: 'VisitDataSummary';
  visitDataStatus?: Maybe<Array<Maybe<VisitDataStatus>>>;
  visitSection?: Maybe<Scalars['String']>;
};

export type VisitFilterInput = {
  actualVisitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  and?: InputMaybe<Array<VisitFilterInput>>;
  attended?: InputMaybe<BooleanOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  delicenseQuestionAnswered?: InputMaybe<BooleanOperationFilterInput>;
  dueDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  event?: InputMaybe<CalendarEventFilterInput>;
  eventId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  hasAnswerData?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  infant?: InputMaybe<InfantFilterInput>;
  infantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  integrationSubmitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedVisitId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<VisitFilterInput>>;
  orderDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  overallRatingColor?: InputMaybe<StringOperationFilterInput>;
  pQARating?: InputMaybe<PqaRatingFilterInput>;
  plannedVisitDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  rating?: InputMaybe<StringOperationFilterInput>;
  risk?: InputMaybe<StringOperationFilterInput>;
  trainee?: InputMaybe<TraineeFilterInput>;
  traineeId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitAnswers?: InputMaybe<ListFilterInputTypeOfVisitDataFilterInput>;
  visitInProgress?: InputMaybe<BooleanOperationFilterInput>;
  visitType?: InputMaybe<VisitTypeFilterInput>;
  visitTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type VisitGrowthDataDay = {
  __typename?: 'VisitGrowthDataDay';
  day: Scalars['Int'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  median?: Maybe<Scalars['Float']>;
  sD2?: Maybe<Scalars['Float']>;
  sD2neg?: Maybe<Scalars['Float']>;
  sD3?: Maybe<Scalars['Float']>;
  sD3neg?: Maybe<Scalars['Float']>;
  section?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type VisitGrowthDataDayFilterInput = {
  and?: InputMaybe<Array<VisitGrowthDataDayFilterInput>>;
  day?: InputMaybe<ComparableInt32OperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  median?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  or?: InputMaybe<Array<VisitGrowthDataDayFilterInput>>;
  sD2?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD2neg?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD3?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD3neg?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  section?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type VisitGrowthDataDayInput = {
  Day: Scalars['Int'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Median?: InputMaybe<Scalars['Float']>;
  SD2?: InputMaybe<Scalars['Float']>;
  SD2neg?: InputMaybe<Scalars['Float']>;
  SD3?: InputMaybe<Scalars['Float']>;
  SD3neg?: InputMaybe<Scalars['Float']>;
  Section?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type VisitGrowthDataDaySortInput = {
  day?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  median?: InputMaybe<SortEnumType>;
  sD2?: InputMaybe<SortEnumType>;
  sD2neg?: InputMaybe<SortEnumType>;
  sD3?: InputMaybe<SortEnumType>;
  sD3neg?: InputMaybe<SortEnumType>;
  section?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type VisitGrowthDataHeight = {
  __typename?: 'VisitGrowthDataHeight';
  height: Scalars['Float'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  median?: Maybe<Scalars['Float']>;
  sD2?: Maybe<Scalars['Float']>;
  sD2neg?: Maybe<Scalars['Float']>;
  sD3?: Maybe<Scalars['Float']>;
  sD3neg?: Maybe<Scalars['Float']>;
  section?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type VisitGrowthDataHeightFilterInput = {
  and?: InputMaybe<Array<VisitGrowthDataHeightFilterInput>>;
  height?: InputMaybe<ComparableDoubleOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  median?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  or?: InputMaybe<Array<VisitGrowthDataHeightFilterInput>>;
  sD2?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD2neg?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD3?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  sD3neg?: InputMaybe<ComparableNullableOfDoubleOperationFilterInput>;
  section?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type VisitGrowthDataHeightInput = {
  Height: Scalars['Float'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Median?: InputMaybe<Scalars['Float']>;
  SD2?: InputMaybe<Scalars['Float']>;
  SD2neg?: InputMaybe<Scalars['Float']>;
  SD3?: InputMaybe<Scalars['Float']>;
  SD3neg?: InputMaybe<Scalars['Float']>;
  Section?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type VisitGrowthDataHeightSortInput = {
  height?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  median?: InputMaybe<SortEnumType>;
  sD2?: InputMaybe<SortEnumType>;
  sD2neg?: InputMaybe<SortEnumType>;
  sD3?: InputMaybe<SortEnumType>;
  sD3neg?: InputMaybe<SortEnumType>;
  section?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type VisitInput = {
  ActualVisitDate?: InputMaybe<Scalars['DateTime']>;
  Attended: Scalars['Boolean'];
  Coach?: InputMaybe<CoachInput>;
  CoachId?: InputMaybe<Scalars['UUID']>;
  Comment?: InputMaybe<Scalars['String']>;
  DelicenseQuestionAnswered: Scalars['Boolean'];
  DueDate?: InputMaybe<Scalars['DateTime']>;
  Event?: InputMaybe<CalendarEventInput>;
  EventId?: InputMaybe<Scalars['UUID']>;
  HasAnswerData: Scalars['Boolean'];
  Id?: InputMaybe<Scalars['UUID']>;
  Infant?: InputMaybe<InfantInput>;
  InfantId?: InputMaybe<Scalars['UUID']>;
  IntegrationSubmitDate?: InputMaybe<Scalars['DateTime']>;
  IsActive: Scalars['Boolean'];
  LinkedVisitId?: InputMaybe<Scalars['UUID']>;
  Mother?: InputMaybe<MotherInput>;
  MotherId?: InputMaybe<Scalars['UUID']>;
  OrderDate?: InputMaybe<Scalars['DateTime']>;
  OverallRatingColor?: InputMaybe<Scalars['String']>;
  PQARating?: InputMaybe<PqaRatingInput>;
  PlannedVisitDate: Scalars['DateTime'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId?: InputMaybe<Scalars['UUID']>;
  Rating?: InputMaybe<Scalars['String']>;
  Risk?: InputMaybe<Scalars['String']>;
  Trainee?: InputMaybe<TraineeInput>;
  TraineeId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitAnswers?: InputMaybe<Array<InputMaybe<VisitDataInput>>>;
  VisitInProgress: Scalars['Boolean'];
  VisitType?: InputMaybe<VisitTypeInput>;
  VisitTypeId: Scalars['UUID'];
};

export type VisitModelInput = {
  actualVisitDate: Scalars['DateTime'];
  attended: Scalars['Boolean'];
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  eventId?: InputMaybe<Scalars['UUID']>;
  infant?: InputMaybe<InfantModelInput>;
  infantId?: InputMaybe<Scalars['UUID']>;
  isSupportCall?: InputMaybe<Scalars['Boolean']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  mother?: InputMaybe<MotherModelInput>;
  motherId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate: Scalars['DateTime'];
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
  traineeId?: InputMaybe<Scalars['UUID']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
};

export type VisitSortInput = {
  actualVisitDate?: InputMaybe<SortEnumType>;
  attended?: InputMaybe<SortEnumType>;
  coach?: InputMaybe<CoachSortInput>;
  coachId?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  delicenseQuestionAnswered?: InputMaybe<SortEnumType>;
  dueDate?: InputMaybe<SortEnumType>;
  event?: InputMaybe<CalendarEventSortInput>;
  eventId?: InputMaybe<SortEnumType>;
  hasAnswerData?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  infant?: InputMaybe<InfantSortInput>;
  infantId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  integrationSubmitDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  linkedVisitId?: InputMaybe<SortEnumType>;
  mother?: InputMaybe<MotherSortInput>;
  motherId?: InputMaybe<SortEnumType>;
  orderDate?: InputMaybe<SortEnumType>;
  overallRatingColor?: InputMaybe<SortEnumType>;
  pQARating?: InputMaybe<PqaRatingSortInput>;
  plannedVisitDate?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  risk?: InputMaybe<SortEnumType>;
  trainee?: InputMaybe<TraineeSortInput>;
  traineeId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visitInProgress?: InputMaybe<SortEnumType>;
  visitType?: InputMaybe<VisitTypeSortInput>;
  visitTypeId?: InputMaybe<SortEnumType>;
};

export type VisitType = {
  __typename?: 'VisitType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type VisitTypeFilterInput = {
  and?: InputMaybe<Array<VisitTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<VisitTypeFilterInput>>;
  order?: InputMaybe<ComparableInt32OperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type VisitTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  Order: Scalars['Int'];
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type VisitTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  order?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type VisitVideos = {
  __typename?: 'VisitVideos';
  id?: Maybe<Scalars['Int']>;
  infoBoxDescriptionA?: Maybe<Scalars['String']>;
  infoBoxDescriptionB?: Maybe<Scalars['String']>;
  infoBoxIconA?: Maybe<Scalars['String']>;
  infoBoxIconB?: Maybe<Scalars['String']>;
  infoBoxTitleA?: Maybe<Scalars['String']>;
  infoBoxTitleB?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  showDividerA?: Maybe<Scalars['String']>;
  tipBoxButtonColorA?: Maybe<Scalars['String']>;
  tipBoxButtonTextA?: Maybe<Scalars['String']>;
  tipBoxColorA?: Maybe<Scalars['String']>;
  tipBoxColorB?: Maybe<Scalars['String']>;
  tipBoxDescriptionB?: Maybe<Scalars['String']>;
  tipBoxDescriptionColorB?: Maybe<Scalars['String']>;
  tipBoxIconA?: Maybe<Scalars['String']>;
  tipBoxIconB?: Maybe<Scalars['String']>;
  tipBoxTitleA?: Maybe<Scalars['String']>;
  tipBoxTitleB?: Maybe<Scalars['String']>;
  tipBoxTitleColorA?: Maybe<Scalars['String']>;
  tipBoxTitleColorB?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  video?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type VisitVideosInput = {
  infoBoxDescriptionA?: InputMaybe<Scalars['String']>;
  infoBoxDescriptionB?: InputMaybe<Scalars['String']>;
  infoBoxIconA?: InputMaybe<Scalars['String']>;
  infoBoxIconB?: InputMaybe<Scalars['String']>;
  infoBoxTitleA?: InputMaybe<Scalars['String']>;
  infoBoxTitleB?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  showDividerA?: InputMaybe<Scalars['String']>;
  tipBoxButtonColorA?: InputMaybe<Scalars['String']>;
  tipBoxButtonTextA?: InputMaybe<Scalars['String']>;
  tipBoxColorA?: InputMaybe<Scalars['String']>;
  tipBoxColorB?: InputMaybe<Scalars['String']>;
  tipBoxDescriptionB?: InputMaybe<Scalars['String']>;
  tipBoxDescriptionColorB?: InputMaybe<Scalars['String']>;
  tipBoxIconA?: InputMaybe<Scalars['String']>;
  tipBoxIconB?: InputMaybe<Scalars['String']>;
  tipBoxTitleA?: InputMaybe<Scalars['String']>;
  tipBoxTitleB?: InputMaybe<Scalars['String']>;
  tipBoxTitleColorA?: InputMaybe<Scalars['String']>;
  tipBoxTitleColorB?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  video?: InputMaybe<Scalars['String']>;
  visit?: InputMaybe<Scalars['String']>;
};

export type WardModel = {
  __typename?: 'WardModel';
  provinceId?: Maybe<Scalars['String']>;
  ward?: Maybe<Scalars['String']>;
};

export type WorkflowStatus = {
  __typename?: 'WorkflowStatus';
  description?: Maybe<Scalars['String']>;
  enumId: WorkflowStatusEnum;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  workflowStatusType?: Maybe<WorkflowStatusType>;
  workflowStatusTypeId: Scalars['UUID'];
};

export enum WorkflowStatusEnum {
  ChildActive = 'CHILD_ACTIVE',
  ChildDeactivated = 'CHILD_DEACTIVATED',
  ChildExternalLink = 'CHILD_EXTERNAL_LINK',
  ChildPending = 'CHILD_PENDING',
  DocumentDeclared = 'DOCUMENT_DECLARED',
  DocumentPendingUpload = 'DOCUMENT_PENDING_UPLOAD',
  DocumentPendingVerification = 'DOCUMENT_PENDING_VERIFICATION',
  DocumentVerified = 'DOCUMENT_VERIFIED',
}

export type WorkflowStatusEnumOperationFilterInput = {
  eq?: InputMaybe<WorkflowStatusEnum>;
  in?: InputMaybe<Array<WorkflowStatusEnum>>;
  neq?: InputMaybe<WorkflowStatusEnum>;
  nin?: InputMaybe<Array<WorkflowStatusEnum>>;
};

export type WorkflowStatusFilterInput = {
  and?: InputMaybe<Array<WorkflowStatusFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  enumId?: InputMaybe<WorkflowStatusEnumOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<WorkflowStatusFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  workflowStatusType?: InputMaybe<WorkflowStatusTypeFilterInput>;
  workflowStatusTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type WorkflowStatusInput = {
  Description?: InputMaybe<Scalars['String']>;
  EnumId: WorkflowStatusEnum;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  WorkflowStatusType?: InputMaybe<WorkflowStatusTypeInput>;
  WorkflowStatusTypeId: Scalars['UUID'];
};

export type WorkflowStatusSortInput = {
  description?: InputMaybe<SortEnumType>;
  enumId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  workflowStatusType?: InputMaybe<WorkflowStatusTypeSortInput>;
  workflowStatusTypeId?: InputMaybe<SortEnumType>;
};

export type WorkflowStatusType = {
  __typename?: 'WorkflowStatusType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type WorkflowStatusTypeFilterInput = {
  and?: InputMaybe<Array<WorkflowStatusTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<WorkflowStatusTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type WorkflowStatusTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type WorkflowStatusTypeSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};
