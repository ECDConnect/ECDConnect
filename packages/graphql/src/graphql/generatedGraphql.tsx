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

export type AcceptRejectCommunityRequestsInputModelInput = {
  userId: Scalars['UUID'];
  userIdsToAccept?: InputMaybe<Array<Scalars['UUID']>>;
  userIdsToReject?: InputMaybe<Array<Scalars['UUID']>>;
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
  shareContent?: Maybe<Scalars['String']>;
  subCategories?: Maybe<Array<Maybe<ProgressTrackingSubCategory>>>;
  subType?: Maybe<Scalars['String']>;
  themes?: Maybe<Array<Maybe<Theme>>>;
  type?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ActivityDetail = {
  __typename?: 'ActivityDetail';
  activity?: Maybe<Scalars['String']>;
  pointsTotal: Scalars['Int'];
  timesScored: Scalars['Int'];
};

export type ActivityInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  materials?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  subCategories?: InputMaybe<Scalars['String']>;
  subType?: InputMaybe<Scalars['String']>;
  themes?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ActivityViewModel = {
  __typename?: 'ActivityViewModel';
  availableLanguages?: Maybe<Array<Scalars['UUID']>>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  inUseThemeNames?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isInUse: Scalars['Boolean'];
  localeId: Scalars['UUID'];
  materials?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  subCategories?: Maybe<Scalars['String']>;
  subCategoryItems?: Maybe<Array<Maybe<SubCategoryViewModel>>>;
  subType?: Maybe<Scalars['String']>;
  subTypeItems?: Maybe<Array<Maybe<Scalars['String']>>>;
  themeItems?: Maybe<Array<Scalars['Int']>>;
  themes?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['DateTime']>;
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
  provinceId?: InputMaybe<Scalars['UUID']>;
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
  systemName?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['UUID']>;
  tenantName?: Maybe<Scalars['String']>;
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
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isAdminRegistered: Scalars['Boolean'];
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
  registerType?: Maybe<Scalars['String']>;
  resetData?: Maybe<Scalars['Boolean']>;
  roles?: Maybe<Array<Maybe<ApplicationIdentityRole>>>;
  shareInfoPartners?: Maybe<Scalars['Boolean']>;
  surname?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['UUID']>;
  trainingCourses?: Maybe<Array<Maybe<UserTrainingCourse>>>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: Maybe<Scalars['DateTime']>;
  userName?: Maybe<Scalars['String']>;
  userPermissions?: Maybe<Array<Maybe<UserPermission>>>;
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
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isAdminRegistered?: InputMaybe<BooleanOperationFilterInput>;
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
  registerType?: InputMaybe<StringOperationFilterInput>;
  resetData?: InputMaybe<BooleanOperationFilterInput>;
  shareInfoPartners?: InputMaybe<BooleanOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  tenantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  trainingCourses?: InputMaybe<ListFilterInputTypeOfUserTrainingCourseFilterInput>;
  twoFactorEnabled?: InputMaybe<BooleanOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
  userPermissions?: InputMaybe<ListFilterInputTypeOfUserPermissionFilterInput>;
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
  fullName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderInput>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: InputMaybe<Scalars['String']>;
  insertedDate?: InputMaybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isAdminRegistered: Scalars['Boolean'];
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
  registerType?: InputMaybe<Scalars['String']>;
  resetData?: InputMaybe<Scalars['Boolean']>;
  shareInfoPartners?: InputMaybe<Scalars['Boolean']>;
  surname?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['UUID']>;
  trainingCourses?: InputMaybe<Array<InputMaybe<UserTrainingCourseInput>>>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: InputMaybe<Scalars['DateTime']>;
  userName?: InputMaybe<Scalars['String']>;
  userPermissions?: InputMaybe<Array<InputMaybe<UserPermissionInput>>>;
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
  fullName?: InputMaybe<SortEnumType>;
  gender?: InputMaybe<GenderSortInput>;
  genderId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isAdminRegistered?: InputMaybe<SortEnumType>;
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
  registerType?: InputMaybe<SortEnumType>;
  resetData?: InputMaybe<SortEnumType>;
  shareInfoPartners?: InputMaybe<SortEnumType>;
  surname?: InputMaybe<SortEnumType>;
  tenantId?: InputMaybe<SortEnumType>;
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

export type BaseLearnerModel = {
  __typename?: 'BaseLearnerModel';
  childUserId: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  learnerId: Scalars['UUID'];
  startedAttendance: Scalars['DateTime'];
  stoppedAttendance?: Maybe<Scalars['DateTime']>;
};

export type BasePractitionerModel = {
  __typename?: 'BasePractitionerModel';
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  profileImageUrl?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
};

export type BaseProvinceModel = {
  __typename?: 'BaseProvinceModel';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
};

export type BaseSiteAddressModel = {
  __typename?: 'BaseSiteAddressModel';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  area?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  province?: Maybe<BaseProvinceModel>;
  provinceId?: Maybe<Scalars['UUID']>;
  ward?: Maybe<Scalars['String']>;
};

export type BasicVisitModel = {
  __typename?: 'BasicVisitModel';
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  attended: Scalars['Boolean'];
  comment?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  isCancelled: Scalars['Boolean'];
  orderDate?: Maybe<Scalars['DateTime']>;
  plannedVisitDate: Scalars['DateTime'];
  risk?: Maybe<Scalars['String']>;
  startedDate?: Maybe<Scalars['DateTime']>;
  visitType?: Maybe<BasicVisitTypeModel>;
};

export type BasicVisitTypeModel = {
  __typename?: 'BasicVisitTypeModel';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
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

export type CmsQuestionInput = {
  answer?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
};

export type CmsResourceLinkModelInput = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CmsVisitDataInput = {
  sections?: InputMaybe<Array<InputMaybe<CmsVisitSectionInput>>>;
  visitName?: InputMaybe<Scalars['String']>;
};

export type CmsVisitDataInputModelInput = {
  coachId?: InputMaybe<Scalars['String']>;
  eventId?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
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
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isAllowedCustody: Scalars['Boolean'];
  joinReferencePanel: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
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
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isAllowedCustody?: InputMaybe<BooleanOperationFilterInput>;
  joinReferencePanel?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  Id?: InputMaybe<Scalars['UUID']>;
  IdNumber?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  IsAllowedCustody: Scalars['Boolean'];
  JoinReferencePanel: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  PhoneNumber?: InputMaybe<Scalars['String']>;
  Relation?: InputMaybe<RelationInput>;
  RelationId?: InputMaybe<Scalars['UUID']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  Surname?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  WhatsAppNumber?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isAllowedCustody?: InputMaybe<SortEnumType>;
  joinReferencePanel?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
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

export type ChildCaregiverInput = {
  additionalFirstName?: InputMaybe<Scalars['String']>;
  additionalPhoneNumber?: InputMaybe<Scalars['String']>;
  additionalSurname?: InputMaybe<Scalars['String']>;
  contribution: Scalars['Boolean'];
  educationId?: InputMaybe<Scalars['UUID']>;
  emergencyContactFirstName?: InputMaybe<Scalars['String']>;
  emergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  emergencyContactSurname?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  grantIds?: InputMaybe<Array<Scalars['UUID']>>;
  id: Scalars['UUID'];
  idNumber?: InputMaybe<Scalars['String']>;
  isAllowedCustody: Scalars['Boolean'];
  joinReferencePanel: Scalars['Boolean'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  relationId?: InputMaybe<Scalars['UUID']>;
  siteAddress?: InputMaybe<UpdateSiteAddressInput>;
  surname?: InputMaybe<Scalars['String']>;
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
  childProgressReportPeriod?: Maybe<ChildProgressReportPeriod>;
  childProgressReportPeriodId: Scalars['UUID'];
  dateCompleted?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  observationsCompleteDate?: Maybe<Scalars['DateTime']>;
  reportContent?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type ChildProgressReportFilterInput = {
  and?: InputMaybe<Array<ChildProgressReportFilterInput>>;
  child?: InputMaybe<ChildFilterInput>;
  childId?: InputMaybe<ComparableGuidOperationFilterInput>;
  childProgressReportPeriod?: InputMaybe<ChildProgressReportPeriodFilterInput>;
  childProgressReportPeriodId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateCompleted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  observationsCompleteDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<ChildProgressReportFilterInput>>;
  reportContent?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type ChildProgressReportInput = {
  Child?: InputMaybe<ChildInput>;
  ChildId: Scalars['UUID'];
  ChildProgressReportPeriod?: InputMaybe<ChildProgressReportPeriodInput>;
  ChildProgressReportPeriodId: Scalars['UUID'];
  DateCompleted?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ObservationsCompleteDate?: InputMaybe<Scalars['DateTime']>;
  ReportContent?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type ChildProgressReportModel = {
  __typename?: 'ChildProgressReportModel';
  childEnjoys?: Maybe<Scalars['String']>;
  childId: Scalars['UUID'];
  childProgressReportPeriodId: Scalars['UUID'];
  classroomName?: Maybe<Scalars['String']>;
  dateCompleted?: Maybe<Scalars['DateTime']>;
  dateCreated: Scalars['DateTime'];
  goodProgressWith?: Maybe<Scalars['String']>;
  howCanCaregiverSupport?: Maybe<Scalars['String']>;
  howToSupport?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  notes?: Maybe<Scalars['String']>;
  observationsCompleteDate?: Maybe<Scalars['DateTime']>;
  practitionerName?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
  principalPhoneNumber?: Maybe<Scalars['String']>;
  skillObservations?: Maybe<Array<Maybe<SkillObservation>>>;
  skillsToWorkOn?: Maybe<Array<Maybe<SkillToWorkOn>>>;
};

export type ChildProgressReportModelInput = {
  childEnjoys?: InputMaybe<Scalars['String']>;
  childId: Scalars['UUID'];
  childProgressReportPeriodId: Scalars['UUID'];
  classroomName?: InputMaybe<Scalars['String']>;
  dateCompleted?: InputMaybe<Scalars['DateTime']>;
  dateCreated: Scalars['DateTime'];
  goodProgressWith?: InputMaybe<Scalars['String']>;
  howCanCaregiverSupport?: InputMaybe<Scalars['String']>;
  howToSupport?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  notes?: InputMaybe<Scalars['String']>;
  observationsCompleteDate?: InputMaybe<Scalars['DateTime']>;
  practitionerName?: InputMaybe<Scalars['String']>;
  principalName?: InputMaybe<Scalars['String']>;
  principalPhoneNumber?: InputMaybe<Scalars['String']>;
  skillObservations?: InputMaybe<Array<InputMaybe<SkillObservationInput>>>;
  skillsToWorkOn?: InputMaybe<Array<InputMaybe<SkillToWorkOnInput>>>;
};

export type ChildProgressReportPeriod = {
  __typename?: 'ChildProgressReportPeriod';
  classroom?: Maybe<Classroom>;
  classroomId: Scalars['UUID'];
  endDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  startDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ChildProgressReportPeriodFilterInput = {
  and?: InputMaybe<Array<ChildProgressReportPeriodFilterInput>>;
  classroom?: InputMaybe<ClassroomFilterInput>;
  classroomId?: InputMaybe<ComparableGuidOperationFilterInput>;
  endDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ChildProgressReportPeriodFilterInput>>;
  startDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ChildProgressReportPeriodInput = {
  Classroom?: InputMaybe<ClassroomInput>;
  ClassroomId: Scalars['UUID'];
  EndDate: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  StartDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ChildProgressReportPeriodModel = {
  __typename?: 'ChildProgressReportPeriodModel';
  endDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  notifications?: Maybe<Array<Maybe<MessageLog>>>;
  startDate: Scalars['DateTime'];
};

export type ChildProgressReportPeriodModelInput = {
  endDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  notifications?: InputMaybe<Array<InputMaybe<MessageLogInput>>>;
  startDate: Scalars['DateTime'];
};

export type ChildProgressReportPeriodSortInput = {
  classroom?: InputMaybe<ClassroomSortInput>;
  classroomId?: InputMaybe<SortEnumType>;
  endDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ChildProgressReportSortInput = {
  child?: InputMaybe<ChildSortInput>;
  childId?: InputMaybe<SortEnumType>;
  childProgressReportPeriod?: InputMaybe<ChildProgressReportPeriodSortInput>;
  childProgressReportPeriodId?: InputMaybe<SortEnumType>;
  dateCompleted?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  observationsCompleteDate?: InputMaybe<SortEnumType>;
  reportContent?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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

export type ChildUserUpdateInput = {
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  firstName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  idNumber?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isSouthAfricanCitizen: Scalars['Boolean'];
  profileImageUrl?: InputMaybe<Scalars['String']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
};

export type ChildrenMetricReport = {
  __typename?: 'ChildrenMetricReport';
  childAttendacePerMonthData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  statusData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  totalChildProgressReports: Scalars['Int'];
  totalChildren: Scalars['Int'];
  unverifiedDocuments: Scalars['Int'];
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
  childProgressReportPeriods?: Maybe<Array<Maybe<ChildProgressReportPeriod>>>;
  classroomGroups?: Maybe<Array<Maybe<ClassroomGroup>>>;
  classroomImageUrl?: Maybe<Scalars['String']>;
  doesOwnerTeach?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isDummySchool?: Maybe<Scalars['Boolean']>;
  isPrinciple?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  numberOfAssistants?: Maybe<Scalars['Int']>;
  numberOfOtherAssistants?: Maybe<Scalars['Int']>;
  numberPractitioners?: Maybe<Scalars['Int']>;
  preschoolCode?: Maybe<Scalars['String']>;
  programmes?: Maybe<Array<Maybe<Programme>>>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type ClassroomBusinessResource = {
  __typename?: 'ClassroomBusinessResource';
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  dataFree?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  insertedDate?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  longDescription?: Maybe<Scalars['String']>;
  numberLikes?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  sectionType?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ClassroomBusinessResourceInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  dataFree?: InputMaybe<Scalars['String']>;
  insertedDate?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  longDescription?: InputMaybe<Scalars['String']>;
  numberLikes?: InputMaybe<Scalars['String']>;
  resourceType?: InputMaybe<Scalars['String']>;
  sectionType?: InputMaybe<Scalars['String']>;
  shortDescription?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ClassroomFilterInput = {
  and?: InputMaybe<Array<ClassroomFilterInput>>;
  childProgressReportPeriods?: InputMaybe<ListFilterInputTypeOfChildProgressReportPeriodFilterInput>;
  classroomGroups?: InputMaybe<ListFilterInputTypeOfClassroomGroupFilterInput>;
  classroomImageUrl?: InputMaybe<StringOperationFilterInput>;
  doesOwnerTeach?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isDummySchool?: InputMaybe<BooleanOperationFilterInput>;
  isPrinciple?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  numberOfAssistants?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  numberOfOtherAssistants?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  numberPractitioners?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClassroomFilterInput>>;
  preschoolCode?: InputMaybe<StringOperationFilterInput>;
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
  totalAttendance?: Maybe<Array<KeyValuePairOfInt32AndNullableOfInt32>>;
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

export type ClassroomGroupModel = {
  __typename?: 'ClassroomGroupModel';
  classProgrammes?: Maybe<Array<Maybe<ClassProgramme>>>;
  classroomId: Scalars['UUID'];
  id: Scalars['UUID'];
  learners?: Maybe<Array<Maybe<BaseLearnerModel>>>;
  name?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
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
  ChildProgressReportPeriods?: InputMaybe<
    Array<InputMaybe<ChildProgressReportPeriodInput>>
  >;
  ClassroomGroups?: InputMaybe<Array<InputMaybe<ClassroomGroupInput>>>;
  ClassroomImageUrl?: InputMaybe<Scalars['String']>;
  DoesOwnerTeach?: InputMaybe<Scalars['Boolean']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsDummySchool?: InputMaybe<Scalars['Boolean']>;
  IsPrinciple?: InputMaybe<Scalars['Boolean']>;
  Name?: InputMaybe<Scalars['String']>;
  NumberOfAssistants?: InputMaybe<Scalars['Int']>;
  NumberOfOtherAssistants?: InputMaybe<Scalars['Int']>;
  NumberPractitioners?: InputMaybe<Scalars['Int']>;
  PreschoolCode?: InputMaybe<Scalars['String']>;
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

export type ClassroomModel = {
  __typename?: 'ClassroomModel';
  childProgressReportPeriods?: Maybe<
    Array<Maybe<ChildProgressReportPeriodModel>>
  >;
  classroomImageUrl?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isDummySchool?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  numberOfAssistants?: Maybe<Scalars['Int']>;
  numberOfOtherAssistants?: Maybe<Scalars['Int']>;
  numberPractitioners?: Maybe<Scalars['Int']>;
  preschoolCode?: Maybe<Scalars['String']>;
  principal?: Maybe<BasePractitionerModel>;
  siteAddress?: Maybe<BaseSiteAddressModel>;
};

export type ClassroomSortInput = {
  classroomImageUrl?: InputMaybe<SortEnumType>;
  doesOwnerTeach?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isDummySchool?: InputMaybe<SortEnumType>;
  isPrinciple?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  numberOfAssistants?: InputMaybe<SortEnumType>;
  numberOfOtherAssistants?: InputMaybe<SortEnumType>;
  numberPractitioners?: InputMaybe<SortEnumType>;
  preschoolCode?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Coach = {
  __typename?: 'Coach';
  aboutInfo?: Maybe<Scalars['String']>;
  areaOfOperation?: Maybe<Scalars['String']>;
  clickedCommunityTab?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isRegistered?: Maybe<Scalars['Boolean']>;
  practitionerVisits?: Maybe<Array<Maybe<Visit>>>;
  secondaryAreaOfOperation?: Maybe<Scalars['String']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CoachFeedback = {
  __typename?: 'CoachFeedback';
  coachFeedbackTypes?: Maybe<Array<Maybe<CoachFeedbackType>>>;
  feedbackDetails?: Maybe<Scalars['String']>;
  fromUserId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  supportRatingId: Scalars['UUID'];
  toUserId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type CoachFeedbackFilterInput = {
  and?: InputMaybe<Array<CoachFeedbackFilterInput>>;
  coachFeedbackTypes?: InputMaybe<ListFilterInputTypeOfCoachFeedbackTypeFilterInput>;
  feedbackDetails?: InputMaybe<StringOperationFilterInput>;
  fromUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CoachFeedbackFilterInput>>;
  supportRatingId?: InputMaybe<ComparableGuidOperationFilterInput>;
  toUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type CoachFeedbackInput = {
  CoachFeedbackTypes?: InputMaybe<Array<InputMaybe<CoachFeedbackTypeInput>>>;
  FeedbackDetails?: InputMaybe<Scalars['String']>;
  FromUserId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  SupportRatingId: Scalars['UUID'];
  ToUserId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type CoachFeedbackInputModelInput = {
  feedbackDetails?: InputMaybe<Scalars['String']>;
  feedbackTypeIds?: InputMaybe<Array<Scalars['UUID']>>;
  fromUserId: Scalars['UUID'];
  supportRatingId: Scalars['UUID'];
  toUserId: Scalars['UUID'];
};

export type CoachFeedbackSetupModel = {
  __typename?: 'CoachFeedbackSetupModel';
  feedbackTypes?: Maybe<Array<Maybe<FeedbackTypeModel>>>;
  supportRatings?: Maybe<Array<Maybe<SupportRatingModel>>>;
};

export type CoachFeedbackSortInput = {
  feedbackDetails?: InputMaybe<SortEnumType>;
  fromUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  supportRatingId?: InputMaybe<SortEnumType>;
  toUserId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type CoachFeedbackType = {
  __typename?: 'CoachFeedbackType';
  coachFeedbackId: Scalars['UUID'];
  feedbackType?: Maybe<FeedbackType>;
  feedbackTypeId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type CoachFeedbackTypeFilterInput = {
  and?: InputMaybe<Array<CoachFeedbackTypeFilterInput>>;
  coachFeedbackId?: InputMaybe<ComparableGuidOperationFilterInput>;
  feedbackType?: InputMaybe<FeedbackTypeFilterInput>;
  feedbackTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CoachFeedbackTypeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type CoachFeedbackTypeInput = {
  CoachFeedbackId: Scalars['UUID'];
  FeedbackType?: InputMaybe<FeedbackTypeInput>;
  FeedbackTypeId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type CoachFeedbackTypeSortInput = {
  coachFeedbackId?: InputMaybe<SortEnumType>;
  feedbackType?: InputMaybe<FeedbackTypeSortInput>;
  feedbackTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type CoachFilterInput = {
  aboutInfo?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<CoachFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
  clickedCommunityTab?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CoachFilterInput>>;
  practitionerVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  secondaryAreaOfOperation?: InputMaybe<StringOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type CoachInput = {
  AboutInfo?: InputMaybe<Scalars['String']>;
  AreaOfOperation?: InputMaybe<Scalars['String']>;
  ClickedCommunityTab?: InputMaybe<Scalars['Boolean']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  PractitionerVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  SecondaryAreaOfOperation?: InputMaybe<Scalars['String']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate: Scalars['DateTime'];
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
  clickedCommunityTab?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  secondaryAreaOfOperation?: InputMaybe<SortEnumType>;
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type CoachStatsModel = {
  __typename?: 'CoachStatsModel';
  totalLessThan75AttendanceRegisters: Scalars['Int'];
  totalMoreThan75hAttendanceRegisters: Scalars['Int'];
  totalNewPractitioners: Scalars['Int'];
  totalPractitioners: Scalars['Int'];
  totalSiteVisits: Scalars['Int'];
  totalWithIncomeExpense: Scalars['Int'];
  totalWithNoIncomeExpense: Scalars['Int'];
  totalWithNoProgressReports: Scalars['Int'];
  totalWithProgressReports: Scalars['Int'];
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

export type CommunityConnectInputModelInput = {
  fromCommunityProfileId: Scalars['UUID'];
  toCommunityProfileId: Scalars['UUID'];
};

export type CommunityConnectionModel = {
  __typename?: 'CommunityConnectionModel';
  aboutLong?: Maybe<Scalars['String']>;
  aboutShort?: Maybe<Scalars['String']>;
  communityUser?: Maybe<CommunityUserModel>;
  connectionAccepted?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  profileSkills?: Maybe<Array<Maybe<CommunityProfileSkillModel>>>;
  provinceId?: Maybe<Scalars['UUID']>;
  provinceName?: Maybe<Scalars['String']>;
  shareContactInfo?: Maybe<Scalars['Boolean']>;
  shareEmail?: Maybe<Scalars['Boolean']>;
  sharePhoneNumber?: Maybe<Scalars['Boolean']>;
  shareProfilePhoto?: Maybe<Scalars['Boolean']>;
  shareProvince?: Maybe<Scalars['Boolean']>;
  shareRole?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CommunityProfile = {
  __typename?: 'CommunityProfile';
  aboutLong?: Maybe<Scalars['String']>;
  aboutShort?: Maybe<Scalars['String']>;
  clickedECDHeros?: Maybe<Scalars['Boolean']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  profileSkills?: Maybe<Array<Maybe<CommunityProfileSkill>>>;
  province?: Maybe<Province>;
  provinceId?: Maybe<Scalars['UUID']>;
  shareContactInfo?: Maybe<Scalars['Boolean']>;
  shareEmail?: Maybe<Scalars['Boolean']>;
  sharePhoneNumber?: Maybe<Scalars['Boolean']>;
  shareProfilePhoto?: Maybe<Scalars['Boolean']>;
  shareProvince?: Maybe<Scalars['Boolean']>;
  shareRole?: Maybe<Scalars['Boolean']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CommunityProfileConnection = {
  __typename?: 'CommunityProfileConnection';
  fromCommunityProfileId: Scalars['UUID'];
  fromProfile?: Maybe<CommunityProfile>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  inviteAccepted?: Maybe<Scalars['Boolean']>;
  isActive: Scalars['Boolean'];
  toCommunityProfileId: Scalars['UUID'];
  toProfile?: Maybe<CommunityProfile>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type CommunityProfileConnectionFilterInput = {
  and?: InputMaybe<Array<CommunityProfileConnectionFilterInput>>;
  fromCommunityProfileId?: InputMaybe<ComparableGuidOperationFilterInput>;
  fromProfile?: InputMaybe<CommunityProfileFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  inviteAccepted?: InputMaybe<BooleanOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CommunityProfileConnectionFilterInput>>;
  toCommunityProfileId?: InputMaybe<ComparableGuidOperationFilterInput>;
  toProfile?: InputMaybe<CommunityProfileFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type CommunityProfileConnectionInput = {
  FromCommunityProfileId: Scalars['UUID'];
  FromProfile?: InputMaybe<CommunityProfileInput>;
  Id?: InputMaybe<Scalars['UUID']>;
  InviteAccepted?: InputMaybe<Scalars['Boolean']>;
  IsActive: Scalars['Boolean'];
  ToCommunityProfileId: Scalars['UUID'];
  ToProfile?: InputMaybe<CommunityProfileInput>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type CommunityProfileConnectionSortInput = {
  fromCommunityProfileId?: InputMaybe<SortEnumType>;
  fromProfile?: InputMaybe<CommunityProfileSortInput>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  inviteAccepted?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  toCommunityProfileId?: InputMaybe<SortEnumType>;
  toProfile?: InputMaybe<CommunityProfileSortInput>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type CommunityProfileFilterInput = {
  aboutLong?: InputMaybe<StringOperationFilterInput>;
  aboutShort?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<CommunityProfileFilterInput>>;
  clickedECDHeros?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CommunityProfileFilterInput>>;
  profileSkills?: InputMaybe<ListFilterInputTypeOfCommunityProfileSkillFilterInput>;
  province?: InputMaybe<ProvinceFilterInput>;
  provinceId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  shareContactInfo?: InputMaybe<BooleanOperationFilterInput>;
  shareEmail?: InputMaybe<BooleanOperationFilterInput>;
  sharePhoneNumber?: InputMaybe<BooleanOperationFilterInput>;
  shareProfilePhoto?: InputMaybe<BooleanOperationFilterInput>;
  shareProvince?: InputMaybe<BooleanOperationFilterInput>;
  shareRole?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type CommunityProfileInput = {
  AboutLong?: InputMaybe<Scalars['String']>;
  AboutShort?: InputMaybe<Scalars['String']>;
  ClickedECDHeros?: InputMaybe<Scalars['Boolean']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ProfileSkills?: InputMaybe<Array<InputMaybe<CommunityProfileSkillInput>>>;
  Province?: InputMaybe<ProvinceInput>;
  ProvinceId?: InputMaybe<Scalars['UUID']>;
  ShareContactInfo?: InputMaybe<Scalars['Boolean']>;
  ShareEmail?: InputMaybe<Scalars['Boolean']>;
  SharePhoneNumber?: InputMaybe<Scalars['Boolean']>;
  ShareProfilePhoto?: InputMaybe<Scalars['Boolean']>;
  ShareProvince?: InputMaybe<Scalars['Boolean']>;
  ShareRole?: InputMaybe<Scalars['Boolean']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type CommunityProfileInputModelInput = {
  aboutLong?: InputMaybe<Scalars['String']>;
  aboutShort?: InputMaybe<Scalars['String']>;
  communitySkillIds?: InputMaybe<Array<Scalars['UUID']>>;
  provinceId?: InputMaybe<Scalars['UUID']>;
  shareContactInfo?: InputMaybe<Scalars['Boolean']>;
  shareEmail?: InputMaybe<Scalars['Boolean']>;
  sharePhoneNumber?: InputMaybe<Scalars['Boolean']>;
  shareProfilePhoto?: InputMaybe<Scalars['Boolean']>;
  shareProvince?: InputMaybe<Scalars['Boolean']>;
  shareRole?: InputMaybe<Scalars['Boolean']>;
  userId: Scalars['UUID'];
};

export type CommunityProfileModel = {
  __typename?: 'CommunityProfileModel';
  aboutLong?: Maybe<Scalars['String']>;
  aboutShort?: Maybe<Scalars['String']>;
  acceptedConnections?: Maybe<Array<Maybe<CommunityConnectionModel>>>;
  clickedECDHeros?: Maybe<Scalars['Boolean']>;
  coachName?: Maybe<Scalars['String']>;
  coachPhoneNumber?: Maybe<Scalars['String']>;
  coachUserId?: Maybe<Scalars['UUID']>;
  communityUser?: Maybe<CommunityUserModel>;
  completenessPerc?: Maybe<Scalars['Decimal']>;
  completenessPercColor?: Maybe<Scalars['String']>;
  completenessPercImage?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  pendingConnections?: Maybe<Array<Maybe<CommunityConnectionModel>>>;
  profileSkills?: Maybe<Array<Maybe<CommunityProfileSkillModel>>>;
  provinceId?: Maybe<Scalars['UUID']>;
  provinceName?: Maybe<Scalars['String']>;
  shareContactInfo?: Maybe<Scalars['Boolean']>;
  shareEmail?: Maybe<Scalars['Boolean']>;
  sharePhoneNumber?: Maybe<Scalars['Boolean']>;
  shareProfilePhoto?: Maybe<Scalars['Boolean']>;
  shareProvince?: Maybe<Scalars['Boolean']>;
  shareRole?: Maybe<Scalars['Boolean']>;
  userConnectionRequests?: Maybe<Array<Maybe<CommunityConnectionModel>>>;
  userId?: Maybe<Scalars['UUID']>;
};

export type CommunityProfileSkill = {
  __typename?: 'CommunityProfileSkill';
  communityProfileId: Scalars['UUID'];
  communitySkill?: Maybe<CommunitySkill>;
  communitySkillId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  profile?: Maybe<CommunityProfile>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type CommunityProfileSkillFilterInput = {
  and?: InputMaybe<Array<CommunityProfileSkillFilterInput>>;
  communityProfileId?: InputMaybe<ComparableGuidOperationFilterInput>;
  communitySkill?: InputMaybe<CommunitySkillFilterInput>;
  communitySkillId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CommunityProfileSkillFilterInput>>;
  profile?: InputMaybe<CommunityProfileFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type CommunityProfileSkillInput = {
  CommunityProfileId: Scalars['UUID'];
  CommunitySkill?: InputMaybe<CommunitySkillInput>;
  CommunitySkillId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Profile?: InputMaybe<CommunityProfileInput>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type CommunityProfileSkillModel = {
  __typename?: 'CommunityProfileSkillModel';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageName?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
};

export type CommunityProfileSkillSortInput = {
  communityProfileId?: InputMaybe<SortEnumType>;
  communitySkill?: InputMaybe<CommunitySkillSortInput>;
  communitySkillId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  profile?: InputMaybe<CommunityProfileSortInput>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type CommunityProfileSortInput = {
  aboutLong?: InputMaybe<SortEnumType>;
  aboutShort?: InputMaybe<SortEnumType>;
  clickedECDHeros?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  province?: InputMaybe<ProvinceSortInput>;
  provinceId?: InputMaybe<SortEnumType>;
  shareContactInfo?: InputMaybe<SortEnumType>;
  shareEmail?: InputMaybe<SortEnumType>;
  sharePhoneNumber?: InputMaybe<SortEnumType>;
  shareProfilePhoto?: InputMaybe<SortEnumType>;
  shareProvince?: InputMaybe<SortEnumType>;
  shareRole?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type CommunitySkill = {
  __typename?: 'CommunitySkill';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageName?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type CommunitySkillFilterInput = {
  and?: InputMaybe<Array<CommunitySkillFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  imageName?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<CommunitySkillFilterInput>>;
  ordering?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type CommunitySkillInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  ImageName?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Ordering: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type CommunitySkillModel = {
  __typename?: 'CommunitySkillModel';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  imageName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
};

export type CommunitySkillSortInput = {
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  imageName?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  ordering?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type CommunityUserModel = {
  __typename?: 'CommunityUserModel';
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  phoneNumber?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['String']>;
  roleName?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
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
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ConsentInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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
  dateCompleted?: Maybe<Scalars['DateTime']>;
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
  dateCompleted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
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
  DateCompleted?: InputMaybe<Scalars['DateTime']>;
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
  dateCompleted?: InputMaybe<SortEnumType>;
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

export type DangerSignTranslation = {
  __typename?: 'DangerSignTranslation';
  language?: Maybe<Scalars['String']>;
  translation?: Maybe<Scalars['String']>;
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

export type ExpenseItemModel = {
  __typename?: 'ExpenseItemModel';
  amount: Scalars['Float'];
  datePaid: Scalars['DateTime'];
  expenseTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  notes?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
};

export type ExpenseItemModelInput = {
  amount: Scalars['Float'];
  datePaid: Scalars['DateTime'];
  expenseTypeId?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  notes?: InputMaybe<Scalars['String']>;
  photoProof?: InputMaybe<Scalars['String']>;
};

export type FeedbackType = {
  __typename?: 'FeedbackType';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type FeedbackTypeFilterInput = {
  and?: InputMaybe<Array<FeedbackTypeFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<FeedbackTypeFilterInput>>;
  ordering?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type FeedbackTypeInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Ordering: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type FeedbackTypeModel = {
  __typename?: 'FeedbackTypeModel';
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
};

export type FeedbackTypeSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  ordering?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
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
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
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

export type HealthPromotion = {
  __typename?: 'HealthPromotion';
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  description?: Maybe<Scalars['String']>;
  descriptionB?: Maybe<Scalars['String']>;
  descriptionC?: Maybe<Scalars['String']>;
  descriptionD?: Maybe<Scalars['String']>;
  descriptionE?: Maybe<Scalars['String']>;
  descriptionF?: Maybe<Scalars['String']>;
  descriptionG?: Maybe<Scalars['String']>;
  descriptionH?: Maybe<Scalars['String']>;
  descriptionI?: Maybe<Scalars['String']>;
  descriptionJ?: Maybe<Scalars['String']>;
  descriptionListIcon?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type HealthPromotionInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  descriptionB?: InputMaybe<Scalars['String']>;
  descriptionC?: InputMaybe<Scalars['String']>;
  descriptionD?: InputMaybe<Scalars['String']>;
  descriptionE?: InputMaybe<Scalars['String']>;
  descriptionF?: InputMaybe<Scalars['String']>;
  descriptionG?: InputMaybe<Scalars['String']>;
  descriptionH?: InputMaybe<Scalars['String']>;
  descriptionI?: InputMaybe<Scalars['String']>;
  descriptionJ?: InputMaybe<Scalars['String']>;
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
  checkedDate: Scalars['DateTime'];
  day: Scalars['DateTime'];
  id: Scalars['UUID'];
  locale?: Maybe<Scalars['String']>;
};

export type HolidayInput = {
  checkedDate: Scalars['DateTime'];
  day: Scalars['DateTime'];
  id: Scalars['UUID'];
  locale?: InputMaybe<Scalars['String']>;
};

export type IncomeExpensePdfDataModel = {
  __typename?: 'IncomeExpensePDFDataModel';
  amount: Scalars['Float'];
  child?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  invoiceNr?: Maybe<Scalars['String']>;
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
  childUserId?: Maybe<Scalars['UUID']>;
  dateReceived: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeTypeId?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  numberOfChildrenCovered?: Maybe<Scalars['Int']>;
  payTypeId?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
};

export type IncomeItemModelInput = {
  amount: Scalars['Float'];
  childUserId?: InputMaybe<Scalars['UUID']>;
  dateReceived: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeTypeId?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  numberOfChildrenCovered?: InputMaybe<Scalars['Int']>;
  payTypeId?: InputMaybe<Scalars['String']>;
  photoProof?: InputMaybe<Scalars['String']>;
};

export type IncomeStatementModel = {
  __typename?: 'IncomeStatementModel';
  contactedByCoach: Scalars['Boolean'];
  downloaded: Scalars['Boolean'];
  expenseItems?: Maybe<Array<Maybe<ExpenseItemModel>>>;
  id: Scalars['UUID'];
  incomeItems?: Maybe<Array<Maybe<IncomeItemModel>>>;
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type IncomeStatementModelInput = {
  contactedByCoach: Scalars['Boolean'];
  downloaded: Scalars['Boolean'];
  expenseItems?: InputMaybe<Array<InputMaybe<ExpenseItemModelInput>>>;
  id: Scalars['UUID'];
  incomeItems?: InputMaybe<Array<InputMaybe<IncomeItemModelInput>>>;
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

export type Infographics = {
  __typename?: 'Infographics';
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
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
  availableLanguages?: InputMaybe<Scalars['String']>;
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

export type InitialChildRegistrationModel = {
  __typename?: 'InitialChildRegistrationModel';
  addedByUserId: Scalars['UUID'];
  caregiverRegistrationUrl?: Maybe<Scalars['String']>;
  childId: Scalars['UUID'];
  childUserId: Scalars['UUID'];
  classroomGroupId: Scalars['UUID'];
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

export type LearnerInputModelInput = {
  classroomGroupId: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  startedAttendance: Scalars['DateTime'];
  stoppedAttendance: Scalars['DateTime'];
  userId: Scalars['UUID'];
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

export type ListFilterInputTypeOfChildProgressReportPeriodFilterInput = {
  all?: InputMaybe<ChildProgressReportPeriodFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ChildProgressReportPeriodFilterInput>;
  some?: InputMaybe<ChildProgressReportPeriodFilterInput>;
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

export type ListFilterInputTypeOfCoachFeedbackTypeFilterInput = {
  all?: InputMaybe<CoachFeedbackTypeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<CoachFeedbackTypeFilterInput>;
  some?: InputMaybe<CoachFeedbackTypeFilterInput>;
};

export type ListFilterInputTypeOfCommunityProfileSkillFilterInput = {
  all?: InputMaybe<CommunityProfileSkillFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<CommunityProfileSkillFilterInput>;
  some?: InputMaybe<CommunityProfileSkillFilterInput>;
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

export type ListFilterInputTypeOfGrantFilterInput = {
  all?: InputMaybe<GrantFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<GrantFilterInput>;
  some?: InputMaybe<GrantFilterInput>;
};

export type ListFilterInputTypeOfLearnerFilterInput = {
  all?: InputMaybe<LearnerFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<LearnerFilterInput>;
  some?: InputMaybe<LearnerFilterInput>;
};

export type ListFilterInputTypeOfMessageLogRelatedToFilterInput = {
  all?: InputMaybe<MessageLogRelatedToFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<MessageLogRelatedToFilterInput>;
  some?: InputMaybe<MessageLogRelatedToFilterInput>;
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

export type ListFilterInputTypeOfUserPermissionFilterInput = {
  all?: InputMaybe<UserPermissionFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<UserPermissionFilterInput>;
  some?: InputMaybe<UserPermissionFilterInput>;
};

export type ListFilterInputTypeOfUserTrainingCourseFilterInput = {
  all?: InputMaybe<UserTrainingCourseFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<UserTrainingCourseFilterInput>;
  some?: InputMaybe<UserTrainingCourseFilterInput>;
};

export type ListFilterInputTypeOfVisitDataFilterInput = {
  all?: InputMaybe<VisitDataFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<VisitDataFilterInput>;
  some?: InputMaybe<VisitDataFilterInput>;
};

export type ListFilterInputTypeOfVisitDataStatusFilterInput = {
  all?: InputMaybe<VisitDataStatusFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<VisitDataStatusFilterInput>;
  some?: InputMaybe<VisitDataStatusFilterInput>;
};

export type ListFilterInputTypeOfVisitFilterInput = {
  all?: InputMaybe<VisitFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<VisitFilterInput>;
  some?: InputMaybe<VisitFilterInput>;
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
  groupingId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageDate?: Maybe<Scalars['DateTime']>;
  messageEndDate?: Maybe<Scalars['DateTime']>;
  messageLogRelatedTos?: Maybe<Array<Maybe<MessageLogRelatedTo>>>;
  messageProtocol?: Maybe<Scalars['String']>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateType?: Maybe<Scalars['String']>;
  notificationResult?: Maybe<Scalars['Int']>;
  readDate?: Maybe<Scalars['DateTime']>;
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
  groupingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  messageDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  messageEndDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  messageLogRelatedTos?: InputMaybe<ListFilterInputTypeOfMessageLogRelatedToFilterInput>;
  messageProtocol?: InputMaybe<StringOperationFilterInput>;
  messageTemplate?: InputMaybe<MessageTemplateFilterInput>;
  messageTemplateType?: InputMaybe<StringOperationFilterInput>;
  notificationResult?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<MessageLogFilterInput>>;
  readDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
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
  GroupingId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  MessageDate?: InputMaybe<Scalars['DateTime']>;
  MessageEndDate?: InputMaybe<Scalars['DateTime']>;
  MessageLogRelatedTos?: InputMaybe<
    Array<InputMaybe<MessageLogRelatedToInput>>
  >;
  MessageProtocol?: InputMaybe<Scalars['String']>;
  MessageTemplate?: InputMaybe<MessageTemplateInput>;
  MessageTemplateType?: InputMaybe<Scalars['String']>;
  NotificationResult?: InputMaybe<Scalars['Int']>;
  ReadDate?: InputMaybe<Scalars['DateTime']>;
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

export type MessageLogRelatedTo = {
  __typename?: 'MessageLogRelatedTo';
  entityType?: Maybe<Scalars['String']>;
  messageLogId: Scalars['UUID'];
  relatedEntityId: Scalars['UUID'];
};

export type MessageLogRelatedToFilterInput = {
  and?: InputMaybe<Array<MessageLogRelatedToFilterInput>>;
  entityType?: InputMaybe<StringOperationFilterInput>;
  messageLogId?: InputMaybe<ComparableGuidOperationFilterInput>;
  or?: InputMaybe<Array<MessageLogRelatedToFilterInput>>;
  relatedEntityId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type MessageLogRelatedToInput = {
  entityType?: InputMaybe<Scalars['String']>;
  messageLogId: Scalars['UUID'];
  relatedEntityId: Scalars['UUID'];
};

export type MessageLogSortInput = {
  action?: InputMaybe<SortEnumType>;
  cTA?: InputMaybe<SortEnumType>;
  cTAText?: InputMaybe<SortEnumType>;
  from?: InputMaybe<SortEnumType>;
  fromUserId?: InputMaybe<SortEnumType>;
  groupingId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  messageDate?: InputMaybe<SortEnumType>;
  messageEndDate?: InputMaybe<SortEnumType>;
  messageProtocol?: InputMaybe<SortEnumType>;
  messageTemplate?: InputMaybe<MessageTemplateSortInput>;
  messageTemplateType?: InputMaybe<SortEnumType>;
  notificationResult?: InputMaybe<SortEnumType>;
  readDate?: InputMaybe<SortEnumType>;
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

export type MonthSummary = {
  __typename?: 'MonthSummary';
  activityDetail?: Maybe<Array<Maybe<ActivityDetail>>>;
  month?: Maybe<Scalars['String']>;
  total: Scalars['Int'];
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
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
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
  updatedDate?: Maybe<Scalars['String']>;
  visit?: Maybe<Scalars['String']>;
};

export type MoreInformationInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
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
  updatedDate?: InputMaybe<Scalars['String']>;
  visit?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptRejectCommunityRequests?: Maybe<CommunityProfileModel>;
  addAbsenteeForPractitioner?: Maybe<Absentees>;
  addChildProgressReportPeriods: Scalars['Boolean'];
  addCoachVisitData: Scalars['Boolean'];
  addCoachVisitInviteForPractitioner?: Maybe<Visit>;
  addFollowUpVisitForPractitioner?: Maybe<Visit>;
  addPermissionsToNavigation: Scalars['Boolean'];
  addPermissionsToRole: Scalars['Boolean'];
  addPractitionerToCoach?: Maybe<Practitioner>;
  addPractitionerToPrincipal?: Maybe<Practitioner>;
  addReAccreditationFollowUpVisitForPractitioner?: Maybe<Visit>;
  addReAccreditationVisitForPractitioner?: Maybe<Visit>;
  addReassignmentForPractitionerService: Scalars['Boolean'];
  addRole?: Maybe<ApplicationIdentityRole>;
  addSelfAssessmentForPractitioner?: Maybe<Visit>;
  addSupportVisitData: Scalars['Boolean'];
  addSupportVisitForPractitioner?: Maybe<Visit>;
  addUser?: Maybe<ApplicationUser>;
  addUsersToRole: Scalars['Boolean'];
  addVisitData: Scalars['Boolean'];
  bulkDeleteCoachingCircleTopics?: Maybe<BulkDeactivateResult>;
  bulkDeleteContentTypes?: Maybe<BulkDeactivateResult>;
  bulkDeleteUser?: Maybe<BulkDeactivateResult>;
  bulkReactivateUsers: Scalars['Boolean'];
  bulkUpdateActivityShareContent: Scalars['Boolean'];
  bulkUpdateActivitySkills: Scalars['Boolean'];
  bulkUpdateActivityStoryTypes: Scalars['Boolean'];
  bulkUpdateActivityThemes: Scalars['Boolean'];
  bulkUpdateCoachingCircleTopicDates: Scalars['Boolean'];
  bulkUpdateConsentImages: Scalars['Boolean'];
  bulkUpdateProgressTrackingCategoryImages: Scalars['Boolean'];
  bulkUpdateProgressTrackingSubCategoryImages: Scalars['Boolean'];
  bulkUpdateStoryBookThemes: Scalars['Boolean'];
  cancelCalendarEvent?: Maybe<CalendarEvent>;
  cancelCommunityRequest?: Maybe<CommunityProfileConnection>;
  cancelRemovalFromProgramme: Scalars['Boolean'];
  classroomProgressSummaryDownloaded: Scalars['Boolean'];
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
  createChildProgressReportPeriod?: Maybe<ChildProgressReportPeriod>;
  createClassProgramme?: Maybe<ClassProgramme>;
  createClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  createClassroom?: Maybe<Classroom>;
  createClassroomBusinessResource?: Maybe<Scalars['String']>;
  createClassroomGroup?: Maybe<ClassroomGroup>;
  createCoach?: Maybe<Coach>;
  createCoachFeedback?: Maybe<CoachFeedback>;
  createCoachFeedbackType?: Maybe<CoachFeedbackType>;
  createCoachingCircleTopics?: Maybe<Scalars['String']>;
  createCommunityProfile?: Maybe<CommunityProfile>;
  createCommunityProfileConnection?: Maybe<CommunityProfileConnection>;
  createCommunityProfileSkill?: Maybe<CommunityProfileSkill>;
  createCommunitySkill?: Maybe<CommunitySkill>;
  createConnect?: Maybe<Scalars['String']>;
  createConnectItem?: Maybe<Scalars['String']>;
  createConsent?: Maybe<Scalars['String']>;
  createContentDefinition?: Maybe<ContentDefinitionModel>;
  createDailyProgramme?: Maybe<DailyProgramme>;
  createDocument?: Maybe<Document>;
  createDocumentType?: Maybe<DocumentType>;
  createEducation?: Maybe<Education>;
  createFeedbackType?: Maybe<FeedbackType>;
  createGender?: Maybe<Gender>;
  createGrant?: Maybe<Grant>;
  createHealthPromotion?: Maybe<Scalars['String']>;
  createHierarchyEntity?: Maybe<HierarchyEntity>;
  createIncomeStatements?: Maybe<Scalars['String']>;
  createInfographics?: Maybe<Scalars['String']>;
  createLanguage?: Maybe<Language>;
  createLearner?: Maybe<Learner>;
  createMeetingType?: Maybe<MeetingType>;
  createMessageLog?: Maybe<MessageLog>;
  createMessageTemplate?: Maybe<MessageTemplate>;
  createMoreInformation?: Maybe<Scalars['String']>;
  createNavigation?: Maybe<Navigation>;
  createNote?: Maybe<Note>;
  createNoteType?: Maybe<NoteType>;
  createOrUpdateChildProgressReport: Scalars['Boolean'];
  createPQARating?: Maybe<PqaRating>;
  createPQASectionRating?: Maybe<PqaSectionRating>;
  createPermission?: Maybe<Permission>;
  createPointsActivity?: Maybe<PointsActivity>;
  createPointsCategory?: Maybe<PointsCategory>;
  createPointsClinicSummary?: Maybe<PointsClinicSummary>;
  createPointsLibrary?: Maybe<PointsLibrary>;
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
  createProgressTrackingAgeGroup?: Maybe<Scalars['String']>;
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
  createResourceLink?: Maybe<Scalars['String']>;
  createShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  createSiteAddress?: Maybe<SiteAddress>;
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
  createSupportRating?: Maybe<SupportRating>;
  createSystemSetting?: Maybe<SystemSetting>;
  createTenantSetupInfo?: Maybe<TenantSetupInfo>;
  createTheme?: Maybe<Scalars['String']>;
  createThemeDay?: Maybe<Scalars['String']>;
  createTopic?: Maybe<Scalars['String']>;
  createUserConsent?: Maybe<UserConsent>;
  createUserHelp?: Maybe<UserHelp>;
  createUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  createUserPermission?: Maybe<UserPermission>;
  createUserResourceLikes?: Maybe<UserResourceLikes>;
  createUserTrainingCourse?: Maybe<UserTrainingCourse>;
  createVisit?: Maybe<Visit>;
  createVisitData?: Maybe<VisitData>;
  createVisitDataStatus?: Maybe<VisitDataStatus>;
  createVisitType?: Maybe<VisitType>;
  createVisitVideos?: Maybe<Scalars['String']>;
  createWorkflowStatus?: Maybe<WorkflowStatus>;
  createWorkflowStatusType?: Maybe<WorkflowStatusType>;
  deActivatePractitioner: Scalars['Boolean'];
  deleteAbsentees?: Maybe<Scalars['Boolean']>;
  deleteActivity?: Maybe<Scalars['Boolean']>;
  deleteAuditLogType?: Maybe<Scalars['Boolean']>;
  deleteBulkResources?: Maybe<BulkDeactivateResult>;
  deleteCalendarEvent?: Maybe<Scalars['Boolean']>;
  deleteCalendarEventParticipant?: Maybe<Scalars['Boolean']>;
  deleteCalendarEventType?: Maybe<Scalars['Boolean']>;
  deleteCaregiver?: Maybe<Scalars['Boolean']>;
  deleteChild?: Maybe<Scalars['Boolean']>;
  deleteChildProgressReport?: Maybe<Scalars['Boolean']>;
  deleteChildProgressReportPeriod?: Maybe<Scalars['Boolean']>;
  deleteClassProgramme?: Maybe<Scalars['Boolean']>;
  deleteClassReassignmentHistory?: Maybe<Scalars['Boolean']>;
  deleteClassroom?: Maybe<Scalars['Boolean']>;
  deleteClassroomBusinessResource?: Maybe<Scalars['Boolean']>;
  deleteClassroomGroup?: Maybe<Scalars['Boolean']>;
  deleteCoach?: Maybe<Scalars['Boolean']>;
  deleteCoachFeedback?: Maybe<Scalars['Boolean']>;
  deleteCoachFeedbackType?: Maybe<Scalars['Boolean']>;
  deleteCoachingCircleTopics?: Maybe<Scalars['Boolean']>;
  deleteCommunityProfile: Scalars['Boolean'];
  deleteCommunityProfileConnection?: Maybe<Scalars['Boolean']>;
  deleteCommunityProfileSkill?: Maybe<Scalars['Boolean']>;
  deleteCommunitySkill?: Maybe<Scalars['Boolean']>;
  deleteConnect?: Maybe<Scalars['Boolean']>;
  deleteConnectItem?: Maybe<Scalars['Boolean']>;
  deleteConsent?: Maybe<Scalars['Boolean']>;
  deleteContentDefinition: Scalars['Boolean'];
  deleteDailyProgramme?: Maybe<Scalars['Boolean']>;
  deleteDocument?: Maybe<Scalars['Boolean']>;
  deleteDocumentType?: Maybe<Scalars['Boolean']>;
  deleteEducation?: Maybe<Scalars['Boolean']>;
  deleteFeedbackType?: Maybe<Scalars['Boolean']>;
  deleteGender?: Maybe<Scalars['Boolean']>;
  deleteGrant?: Maybe<Scalars['Boolean']>;
  deleteHealthPromotion?: Maybe<Scalars['Boolean']>;
  deleteHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteIncomeStatements?: Maybe<Scalars['Boolean']>;
  deleteInfographics?: Maybe<Scalars['Boolean']>;
  deleteLanguage?: Maybe<Scalars['Boolean']>;
  deleteLearner?: Maybe<Scalars['Boolean']>;
  deleteMeetingType?: Maybe<Scalars['Boolean']>;
  deleteMessageLog?: Maybe<Scalars['Boolean']>;
  deleteMessageTemplate?: Maybe<Scalars['Boolean']>;
  deleteMoreInformation?: Maybe<Scalars['Boolean']>;
  deleteMultipleActivities?: Maybe<BulkDeactivateResult>;
  deleteMultipleStoryBooks?: Maybe<BulkDeactivateResult>;
  deleteMultipleThemes?: Maybe<BulkDeactivateResult>;
  deleteNavigation?: Maybe<Scalars['Boolean']>;
  deleteNote?: Maybe<Scalars['Boolean']>;
  deleteNoteType?: Maybe<Scalars['Boolean']>;
  deletePQARating?: Maybe<Scalars['Boolean']>;
  deletePQASectionRating?: Maybe<Scalars['Boolean']>;
  deletePermission?: Maybe<Scalars['Boolean']>;
  deletePointsActivity?: Maybe<Scalars['Boolean']>;
  deletePointsCategory?: Maybe<Scalars['Boolean']>;
  deletePointsClinicSummary?: Maybe<Scalars['Boolean']>;
  deletePointsLibrary?: Maybe<Scalars['Boolean']>;
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
  deleteProgressTrackingAgeGroup?: Maybe<Scalars['Boolean']>;
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
  deleteResourceLink?: Maybe<Scalars['Boolean']>;
  deleteRole: Scalars['Boolean'];
  deleteShortenUrlEntity?: Maybe<Scalars['Boolean']>;
  deleteSiteAddress?: Maybe<Scalars['Boolean']>;
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
  deleteSupportRating?: Maybe<Scalars['Boolean']>;
  deleteSystemSetting?: Maybe<Scalars['Boolean']>;
  deleteTenantSetupInfo?: Maybe<Scalars['Boolean']>;
  deleteTheme?: Maybe<Scalars['Boolean']>;
  deleteThemeDay?: Maybe<Scalars['Boolean']>;
  deleteTopic?: Maybe<Scalars['Boolean']>;
  deleteUser: Scalars['Boolean'];
  deleteUserConsent?: Maybe<Scalars['Boolean']>;
  deleteUserHelp?: Maybe<Scalars['Boolean']>;
  deleteUserHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteUserPermission?: Maybe<Scalars['Boolean']>;
  deleteUserResourceLikes?: Maybe<Scalars['Boolean']>;
  deleteUserTrainingCourse?: Maybe<Scalars['Boolean']>;
  deleteVisit?: Maybe<Scalars['Boolean']>;
  deleteVisitData?: Maybe<Scalars['Boolean']>;
  deleteVisitDataStatus?: Maybe<Scalars['Boolean']>;
  deleteVisitType?: Maybe<Scalars['Boolean']>;
  deleteVisitVideos?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatus?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatusType?: Maybe<Scalars['Boolean']>;
  demotePractitionerAsPrincipal?: Maybe<Practitioner>;
  disableNotification: Scalars['Boolean'];
  editAbsentee?: Maybe<Absentees>;
  editVisitData: Scalars['Boolean'];
  expireNotification: Scalars['Boolean'];
  expireNotificationsTypesForUser: Scalars['Boolean'];
  expireRelationshipLinksService: Scalars['Boolean'];
  fileUpload?: Maybe<DocumentModel>;
  generateCaregiverChildToken?: Maybe<InitialChildRegistrationModel>;
  importCoaches?: Maybe<UserImportModel>;
  importPractitioners?: Maybe<UserImportModel>;
  markAsReadNotification: Scalars['Boolean'];
  openAccessAddChild: Scalars['Boolean'];
  promotePractitionerToPrincipal?: Maybe<Principal>;
  reassignAbsenteeFromHistory: Scalars['Boolean'];
  reassignAbsentees: Scalars['Boolean'];
  reassignAllClassroomsFromHistoryService: Scalars['Boolean'];
  reassignClassroomsFromHistoryService: Scalars['Boolean'];
  refreshCaregiverChildToken?: Maybe<InitialChildRegistrationModel>;
  remapPrincipalToPrincipal?: Maybe<Practitioner>;
  removeFromProgramme: Scalars['Boolean'];
  removePermissionsFromNavigation: Scalars['Boolean'];
  removePermissionsFromRole: Scalars['Boolean'];
  removePractitioner: Scalars['Boolean'];
  removeUserFromRoles: Scalars['Boolean'];
  resetUserPassword: Scalars['Boolean'];
  restartVisit?: Maybe<BasicVisitModel>;
  revertTenantSettingsToDefault?: Maybe<TenantInternalModel>;
  saveBulkMessagesForAdmin: Scalars['Boolean'];
  saveCoachFeedback?: Maybe<CoachFeedback>;
  saveCommunityProfile?: Maybe<CommunityProfileModel>;
  saveCommunityProfileConnections?: Maybe<
    Array<Maybe<CommunityProfileConnection>>
  >;
  sendAnyNotification: Scalars['Boolean'];
  sendAnyNotificationWithReplacements: Scalars['Boolean'];
  sendBulkInviteToPortal?: Maybe<BulkInvitationResult>;
  sendCoachInviteToApplication: Scalars['Boolean'];
  sendInviteToApplication: Scalars['Boolean'];
  sendNotificationToUser: Scalars['Boolean'];
  sendPractitionerInviteToApplication: Scalars['Boolean'];
  sendPractitionerInviteToPreSchool?: Maybe<Scalars['String']>;
  sendPractitionerRemovedFromProgrammeNotification: Scalars['Boolean'];
  sendPrincipalInviteToApplication?: Maybe<Scalars['String']>;
  sendPromotedToPrincipalFAAProgrammeNotification: Scalars['Boolean'];
  switchPrincipal: Scalars['Boolean'];
  trackAttendance: Scalars['Boolean'];
  updateAbsentees?: Maybe<Absentees>;
  updateActivity?: Maybe<Activity>;
  updateAuditLogType?: Maybe<AuditLogType>;
  updateCalendarEvent?: Maybe<CalendarEvent>;
  updateCalendarEventParticipant?: Maybe<CalendarEventParticipant>;
  updateCalendarEventType?: Maybe<CalendarEventType>;
  updateCaregiver?: Maybe<Caregiver>;
  updateCaregiverResourceLink: Scalars['Boolean'];
  updateChild?: Maybe<Child>;
  updateChildAndCaregiver: Scalars['Boolean'];
  updateChildProgressReport?: Maybe<ChildProgressReport>;
  updateChildProgressReportPeriod?: Maybe<ChildProgressReportPeriod>;
  updateClassProgramme?: Maybe<ClassProgramme>;
  updateClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  updateClassroom?: Maybe<Classroom>;
  updateClassroomBusinessResource?: Maybe<ClassroomBusinessResource>;
  updateClassroomGroup?: Maybe<ClassroomGroup>;
  updateClassroomSiteAddress?: Maybe<Classroom>;
  updateClickedECDHeros: Scalars['Boolean'];
  updateCoach?: Maybe<Coach>;
  updateCoachAboutInfo?: Maybe<Coach>;
  updateCoachCommunityTabStatus?: Maybe<Coach>;
  updateCoachFeedback?: Maybe<CoachFeedback>;
  updateCoachFeedbackType?: Maybe<CoachFeedbackType>;
  updateCoachingCircleTopics?: Maybe<CoachingCircleTopics>;
  updateCommunityProfile?: Maybe<CommunityProfile>;
  updateCommunityProfileConnection?: Maybe<CommunityProfileConnection>;
  updateCommunityProfileSkill?: Maybe<CommunityProfileSkill>;
  updateCommunitySkill?: Maybe<CommunitySkill>;
  updateConnect?: Maybe<Connect>;
  updateConnectItem?: Maybe<ConnectItem>;
  updateConsent?: Maybe<Consent>;
  updateDailyProgramme?: Maybe<DailyProgramme>;
  updateDocument?: Maybe<Document>;
  updateDocumentType?: Maybe<DocumentType>;
  updateEducation?: Maybe<Education>;
  updateFeedbackType?: Maybe<FeedbackType>;
  updateGender?: Maybe<Gender>;
  updateGrant?: Maybe<Grant>;
  updateHealthPromotion?: Maybe<HealthPromotion>;
  updateHierarchyEntity?: Maybe<HierarchyEntity>;
  updateIncomeStatement?: Maybe<IncomeStatementModel>;
  updateIncomeStatements?: Maybe<IncomeStatements>;
  updateInfographics?: Maybe<Infographics>;
  updateLanguage?: Maybe<Language>;
  updateLearner?: Maybe<Learner>;
  updateLearnerHierarchy?: Maybe<Learner>;
  updateLearnerWithUserId?: Maybe<Learner>;
  updateMeetingType?: Maybe<MeetingType>;
  updateMessageLog?: Maybe<MessageLog>;
  updateMessageTemplate?: Maybe<MessageTemplate>;
  updateMoreInformation?: Maybe<MoreInformation>;
  updateNavigation?: Maybe<Navigation>;
  updateNote?: Maybe<Note>;
  updateNoteType?: Maybe<NoteType>;
  updatePQARating?: Maybe<PqaRating>;
  updatePQASectionRating?: Maybe<PqaSectionRating>;
  updatePermission?: Maybe<Permission>;
  updatePointsActivity?: Maybe<PointsActivity>;
  updatePointsCategory?: Maybe<PointsCategory>;
  updatePointsClinicSummary?: Maybe<PointsClinicSummary>;
  updatePointsLibrary?: Maybe<PointsLibrary>;
  updatePointsUserSummary?: Maybe<PointsUserSummary>;
  updatePractitioner?: Maybe<Practitioner>;
  updatePractitionerBusinessWalkthrough: Scalars['Boolean'];
  updatePractitionerCommunityTabStatus?: Maybe<Practitioner>;
  updatePractitionerContactInfo?: Maybe<ApplicationUser>;
  updatePractitionerEmergencyContact: Scalars['Boolean'];
  updatePractitionerProgress: Scalars['Decimal'];
  updatePractitionerProgressWalkthrough: Scalars['Boolean'];
  updatePractitionerRegistered: Scalars['Boolean'];
  updatePractitionerRemovalHistory?: Maybe<PractitionerRemovalHistory>;
  updatePractitionerShareInfo: Scalars['Boolean'];
  updatePractitionerToTeachClassroom?: Maybe<ClassroomGroup>;
  updatePractitionerUsePhotoInReport?: Maybe<Scalars['String']>;
  updatePrincipal?: Maybe<Principal>;
  updatePrincipalInvitation?: Maybe<PrincipalInvitationStatus>;
  updateProgramme?: Maybe<Programme>;
  updateProgrammeAttendanceReason?: Maybe<ProgrammeAttendanceReason>;
  updateProgrammeRoutine?: Maybe<ProgrammeRoutine>;
  updateProgrammeRoutineItem?: Maybe<ProgrammeRoutineItem>;
  updateProgrammeRoutineSubItem?: Maybe<ProgrammeRoutineSubItem>;
  updateProgrammeType?: Maybe<ProgrammeType>;
  updateProgrammes: Scalars['Boolean'];
  updateProgressTrackingAgeGroup?: Maybe<ProgressTrackingAgeGroup>;
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
  updateResourceConnectItem: Scalars['Boolean'];
  updateResourceLikes: Scalars['Boolean'];
  updateResourceLink?: Maybe<ResourceLink>;
  updateResourceTypesAndDataFree: Scalars['Boolean'];
  updateRole?: Maybe<ApplicationIdentityRole>;
  updateShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  updateSiteAddress?: Maybe<SiteAddress>;
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
  updateSupportRating?: Maybe<SupportRating>;
  updateSystemSetting?: Maybe<SystemSetting>;
  updateTenantInfo?: Maybe<TenantInternalModel>;
  updateTenantSetupInfo?: Maybe<TenantSetupInfo>;
  updateTenantTheme?: Maybe<Scalars['String']>;
  updateTheme?: Maybe<Theme>;
  updateThemeDay?: Maybe<ThemeDay>;
  updateTopic?: Maybe<Topic>;
  updateUser?: Maybe<ApplicationUser>;
  updateUserConsent?: Maybe<UserConsent>;
  updateUserContactStatusForStatement?: Maybe<StatementsIncomeStatement>;
  updateUserHelp?: Maybe<UserHelp>;
  updateUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  updateUserPermission?: Maybe<Array<Maybe<UserPermissionModel>>>;
  updateUserResourceLikes?: Maybe<UserResourceLikes>;
  updateUserTrainingCourse?: Maybe<UserTrainingCourse>;
  updateVisit?: Maybe<Visit>;
  updateVisitData?: Maybe<VisitData>;
  updateVisitDataStatus?: Maybe<VisitDataStatus>;
  updateVisitPlannedVisitDate?: Maybe<Visit>;
  updateVisitType?: Maybe<VisitType>;
  updateVisitVideos?: Maybe<VisitVideos>;
  updateWorkflowStatus?: Maybe<WorkflowStatus>;
  updateWorkflowStatusType?: Maybe<WorkflowStatusType>;
};

export type MutationAcceptRejectCommunityRequestsArgs = {
  input?: InputMaybe<AcceptRejectCommunityRequestsInputModelInput>;
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

export type MutationAddChildProgressReportPeriodsArgs = {
  childProgressReportPeriods?: InputMaybe<
    Array<InputMaybe<ChildProgressReportPeriodModelInput>>
  >;
  classroomId: Scalars['UUID'];
};

export type MutationAddCoachVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationAddCoachVisitInviteForPractitionerArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddFollowUpVisitForPractitionerArgs = {
  input?: InputMaybe<FollowUpVisitModelInput>;
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
  preschoolCode?: InputMaybe<Scalars['String']>;
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

export type MutationAddSelfAssessmentForPractitionerArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
};

export type MutationAddSupportVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationAddSupportVisitForPractitionerArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
};

export type MutationAddUserArgs = {
  input?: InputMaybe<UserModelInput>;
};

export type MutationAddUsersToRoleArgs = {
  roleNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationAddVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
};

export type MutationBulkDeleteCoachingCircleTopicsArgs = {
  contentIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type MutationBulkDeleteContentTypesArgs = {
  contentIds?: InputMaybe<Array<Scalars['Int']>>;
};

export type MutationBulkDeleteUserArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationBulkReactivateUsersArgs = {
  userIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type MutationBulkUpdateActivityShareContentArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
  shareContent?: InputMaybe<Scalars['String']>;
};

export type MutationBulkUpdateActivitySkillsArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
  subCategoryIds?: InputMaybe<Scalars['String']>;
};

export type MutationBulkUpdateActivityStoryTypesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
  subType?: InputMaybe<Scalars['String']>;
};

export type MutationBulkUpdateActivityThemesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
  themeIds?: InputMaybe<Scalars['String']>;
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

export type MutationBulkUpdateStoryBookThemesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
  themeIds?: InputMaybe<Scalars['String']>;
};

export type MutationCancelCalendarEventArgs = {
  id: Scalars['UUID'];
};

export type MutationCancelCommunityRequestArgs = {
  input?: InputMaybe<CommunityConnectInputModelInput>;
};

export type MutationCancelRemovalFromProgrammeArgs = {
  removalId?: InputMaybe<Scalars['String']>;
};

export type MutationClassroomProgressSummaryDownloadedArgs = {
  classroomGroupId: Scalars['UUID'];
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

export type MutationCreateChildProgressReportPeriodArgs = {
  input?: InputMaybe<ChildProgressReportPeriodInput>;
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

export type MutationCreateClassroomBusinessResourceArgs = {
  input: ClassroomBusinessResourceInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateClassroomGroupArgs = {
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationCreateCoachArgs = {
  input?: InputMaybe<CoachInput>;
};

export type MutationCreateCoachFeedbackArgs = {
  input?: InputMaybe<CoachFeedbackInput>;
};

export type MutationCreateCoachFeedbackTypeArgs = {
  input?: InputMaybe<CoachFeedbackTypeInput>;
};

export type MutationCreateCoachingCircleTopicsArgs = {
  input: CoachingCircleTopicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateCommunityProfileArgs = {
  input?: InputMaybe<CommunityProfileInput>;
};

export type MutationCreateCommunityProfileConnectionArgs = {
  input?: InputMaybe<CommunityProfileConnectionInput>;
};

export type MutationCreateCommunityProfileSkillArgs = {
  input?: InputMaybe<CommunityProfileSkillInput>;
};

export type MutationCreateCommunitySkillArgs = {
  input?: InputMaybe<CommunitySkillInput>;
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

export type MutationCreateDocumentArgs = {
  input?: InputMaybe<DocumentInput>;
};

export type MutationCreateDocumentTypeArgs = {
  input?: InputMaybe<DocumentTypeInput>;
};

export type MutationCreateEducationArgs = {
  input?: InputMaybe<EducationInput>;
};

export type MutationCreateFeedbackTypeArgs = {
  input?: InputMaybe<FeedbackTypeInput>;
};

export type MutationCreateGenderArgs = {
  input?: InputMaybe<GenderInput>;
};

export type MutationCreateGrantArgs = {
  input?: InputMaybe<GrantInput>;
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

export type MutationCreateInfographicsArgs = {
  input: InfographicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateLanguageArgs = {
  input?: InputMaybe<LanguageInput>;
};

export type MutationCreateLearnerArgs = {
  input?: InputMaybe<LearnerInput>;
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

export type MutationCreateNavigationArgs = {
  input?: InputMaybe<NavigationInput>;
};

export type MutationCreateNoteArgs = {
  input?: InputMaybe<NoteInput>;
};

export type MutationCreateNoteTypeArgs = {
  input?: InputMaybe<NoteTypeInput>;
};

export type MutationCreateOrUpdateChildProgressReportArgs = {
  input?: InputMaybe<ChildProgressReportModelInput>;
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

export type MutationCreatePointsActivityArgs = {
  input?: InputMaybe<PointsActivityInput>;
};

export type MutationCreatePointsCategoryArgs = {
  input?: InputMaybe<PointsCategoryInput>;
};

export type MutationCreatePointsClinicSummaryArgs = {
  input?: InputMaybe<PointsClinicSummaryInput>;
};

export type MutationCreatePointsLibraryArgs = {
  input?: InputMaybe<PointsLibraryInput>;
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

export type MutationCreateProgressTrackingAgeGroupArgs = {
  input: ProgressTrackingAgeGroupInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type MutationCreateResourceLinkArgs = {
  input: ResourceLinkInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateShortenUrlEntityArgs = {
  input?: InputMaybe<ShortenUrlEntityInput>;
};

export type MutationCreateSiteAddressArgs = {
  input?: InputMaybe<SiteAddressInput>;
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

export type MutationCreateSupportRatingArgs = {
  input?: InputMaybe<SupportRatingInput>;
};

export type MutationCreateSystemSettingArgs = {
  input?: InputMaybe<SystemSettingInput>;
};

export type MutationCreateTenantSetupInfoArgs = {
  input?: InputMaybe<TenantSetupInfoInput>;
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

export type MutationCreateTopicArgs = {
  input: TopicInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateUserConsentArgs = {
  input?: InputMaybe<UserConsentInput>;
};

export type MutationCreateUserHelpArgs = {
  input?: InputMaybe<UserHelpInput>;
};

export type MutationCreateUserHierarchyEntityArgs = {
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationCreateUserPermissionArgs = {
  input?: InputMaybe<UserPermissionInput>;
};

export type MutationCreateUserResourceLikesArgs = {
  input?: InputMaybe<UserResourceLikesInput>;
};

export type MutationCreateUserTrainingCourseArgs = {
  input?: InputMaybe<UserTrainingCourseInput>;
};

export type MutationCreateVisitArgs = {
  input?: InputMaybe<VisitInput>;
};

export type MutationCreateVisitDataArgs = {
  input?: InputMaybe<VisitDataInput>;
};

export type MutationCreateVisitDataStatusArgs = {
  input?: InputMaybe<VisitDataStatusInput>;
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

export type MutationDeleteBulkResourcesArgs = {
  contentIds?: InputMaybe<Array<Scalars['Int']>>;
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

export type MutationDeleteChildProgressReportPeriodArgs = {
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

export type MutationDeleteClassroomBusinessResourceArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteClassroomGroupArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachFeedbackArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachFeedbackTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachingCircleTopicsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCommunityProfileArgs = {
  communityProfileId: Scalars['UUID'];
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCommunityProfileConnectionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCommunityProfileSkillArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCommunitySkillArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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

export type MutationDeleteDocumentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteDocumentTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteEducationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteFeedbackTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteGenderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteGrantArgs = {
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

export type MutationDeleteInfographicsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLearnerArgs = {
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

export type MutationDeleteMultipleActivitiesArgs = {
  contentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationDeleteMultipleStoryBooksArgs = {
  contentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationDeleteMultipleThemesArgs = {
  contentIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type MutationDeletePqaRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePqaSectionRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsActivityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsCategoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsClinicSummaryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeletePointsLibraryArgs = {
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

export type MutationDeleteProgressTrackingAgeGroupArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type MutationDeleteResourceLinkArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type MutationDeleteSupportRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteSystemSettingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteTenantSetupInfoArgs = {
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

export type MutationDeleteTopicArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteUserConsentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserHelpArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserPermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserResourceLikesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserTrainingCourseArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitDataArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteVisitDataStatusArgs = {
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

export type MutationGenerateCaregiverChildTokenArgs = {
  classgroupId: Scalars['UUID'];
  firstname?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type MutationImportCoachesArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationImportPractitionersArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationMarkAsReadNotificationArgs = {
  notificationId?: InputMaybe<Scalars['String']>;
};

export type MutationOpenAccessAddChildArgs = {
  caregiver?: InputMaybe<AddChildCaregiverTokenModelInput>;
  child?: InputMaybe<AddChildTokenModelInput>;
  consent?: InputMaybe<AddChildUserConsentTokenModelInput>;
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

export type MutationRestartVisitArgs = {
  existingVisitId: Scalars['UUID'];
};

export type MutationSaveBulkMessagesForAdminArgs = {
  input?: InputMaybe<MessageLogModelInput>;
};

export type MutationSaveCoachFeedbackArgs = {
  input?: InputMaybe<CoachFeedbackInputModelInput>;
};

export type MutationSaveCommunityProfileArgs = {
  input?: InputMaybe<CommunityProfileInputModelInput>;
};

export type MutationSaveCommunityProfileConnectionsArgs = {
  input?: InputMaybe<Array<InputMaybe<CommunityConnectInputModelInput>>>;
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

export type MutationSendBulkInviteToPortalArgs = {
  userIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type MutationSendCoachInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendInviteToApplicationArgs = {
  inviteToPortal?: Scalars['Boolean'];
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendNotificationToUserArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  templateType?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  userType?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPractitionerInviteToPreSchoolArgs = {
  practitionerPhoneNumber?: InputMaybe<Scalars['String']>;
  preSchoolName?: InputMaybe<Scalars['String']>;
  preSchoolNameCode?: InputMaybe<Scalars['String']>;
  principalUserId: Scalars['UUID'];
};

export type MutationSendPractitionerRemovedFromProgrammeNotificationArgs = {
  practitionerName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendPrincipalInviteToApplicationArgs = {
  practitionerUserId: Scalars['UUID'];
  principalPhoneNumber?: InputMaybe<Scalars['String']>;
};

export type MutationSendPromotedToPrincipalFaaProgrammeNotificationArgs = {
  principalOrFAA?: InputMaybe<Scalars['String']>;
  programmeName?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSwitchPrincipalArgs = {
  newPrincipalUserId?: InputMaybe<Scalars['String']>;
  oldPrincipalUserId?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateCaregiverArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CaregiverInput>;
};

export type MutationUpdateCaregiverResourceLinkArgs = {
  input?: InputMaybe<Array<InputMaybe<CmsResourceLinkModelInput>>>;
  localeId: Scalars['UUID'];
};

export type MutationUpdateChildArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ChildInput>;
};

export type MutationUpdateChildAndCaregiverArgs = {
  input?: InputMaybe<UpdateChildAndCaregiverInput>;
};

export type MutationUpdateChildProgressReportArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ChildProgressReportInput>;
};

export type MutationUpdateChildProgressReportPeriodArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ChildProgressReportPeriodInput>;
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

export type MutationUpdateClassroomBusinessResourceArgs = {
  id: Scalars['String'];
  input: ClassroomBusinessResourceInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateClassroomGroupArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationUpdateClassroomSiteAddressArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<ClassroomInput>;
};

export type MutationUpdateClickedEcdHerosArgs = {
  userId: Scalars['UUID'];
};

export type MutationUpdateCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CoachInput>;
};

export type MutationUpdateCoachAboutInfoArgs = {
  aboutInfo?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCoachCommunityTabStatusArgs = {
  coachUserId: Scalars['UUID'];
};

export type MutationUpdateCoachFeedbackArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CoachFeedbackInput>;
};

export type MutationUpdateCoachFeedbackTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CoachFeedbackTypeInput>;
};

export type MutationUpdateCoachingCircleTopicsArgs = {
  id: Scalars['String'];
  input: CoachingCircleTopicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunityProfileArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CommunityProfileInput>;
};

export type MutationUpdateCommunityProfileConnectionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CommunityProfileConnectionInput>;
};

export type MutationUpdateCommunityProfileSkillArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CommunityProfileSkillInput>;
};

export type MutationUpdateCommunitySkillArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CommunitySkillInput>;
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

export type MutationUpdateFeedbackTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<FeedbackTypeInput>;
};

export type MutationUpdateGenderArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<GenderInput>;
};

export type MutationUpdateGrantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<GrantInput>;
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

export type MutationUpdateIncomeStatementArgs = {
  input?: InputMaybe<IncomeStatementModelInput>;
};

export type MutationUpdateIncomeStatementsArgs = {
  id: Scalars['String'];
  input: IncomeStatementsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateInfographicsArgs = {
  id: Scalars['String'];
  input: InfographicsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LanguageInput>;
};

export type MutationUpdateLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LearnerInput>;
};

export type MutationUpdateLearnerHierarchyArgs = {
  classroomGroupId?: InputMaybe<Scalars['String']>;
  learnerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateLearnerWithUserIdArgs = {
  input?: InputMaybe<LearnerInputModelInput>;
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

export type MutationUpdateNavigationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NavigationInput>;
};

export type MutationUpdateNoteArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NoteInput>;
};

export type MutationUpdateNoteTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<NoteTypeInput>;
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

export type MutationUpdatePointsActivityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsActivityInput>;
};

export type MutationUpdatePointsCategoryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsCategoryInput>;
};

export type MutationUpdatePointsClinicSummaryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsClinicSummaryInput>;
};

export type MutationUpdatePointsLibraryArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PointsLibraryInput>;
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

export type MutationUpdatePractitionerCommunityTabStatusArgs = {
  practitionerUserId: Scalars['UUID'];
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

export type MutationUpdatePractitionerProgressArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  progress: Scalars['Decimal'];
};

export type MutationUpdatePractitionerProgressWalkthroughArgs = {
  userId?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateProgressTrackingAgeGroupArgs = {
  id: Scalars['String'];
  input: ProgressTrackingAgeGroupInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateResourceConnectItemArgs = {
  input?: InputMaybe<Array<InputMaybe<CmsConnectItemModelInput>>>;
  localeId: Scalars['UUID'];
};

export type MutationUpdateResourceLikesArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  liked: Scalars['Boolean'];
};

export type MutationUpdateResourceLinkArgs = {
  id: Scalars['String'];
  input: ResourceLinkInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateResourceTypesAndDataFreeArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  dataFree?: InputMaybe<Scalars['String']>;
  localeId: Scalars['UUID'];
  resourceType?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateSupportRatingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SupportRatingInput>;
};

export type MutationUpdateSystemSettingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<SystemSettingInput>;
};

export type MutationUpdateTenantInfoArgs = {
  input?: InputMaybe<TenantInfoInputModelInput>;
};

export type MutationUpdateTenantSetupInfoArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<TenantSetupInfoInput>;
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

export type MutationUpdateTopicArgs = {
  id: Scalars['String'];
  input: TopicInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateUserHelpArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserHelpInput>;
};

export type MutationUpdateUserHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationUpdateUserPermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UpdateUserPermissionInputModelInput>;
};

export type MutationUpdateUserResourceLikesArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserResourceLikesInput>;
};

export type MutationUpdateUserTrainingCourseArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserTrainingCourseInput>;
};

export type MutationUpdateVisitArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitInput>;
};

export type MutationUpdateVisitDataArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitDataInput>;
};

export type MutationUpdateVisitDataStatusArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitDataStatusInput>;
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
  groupingId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  message?: Maybe<Scalars['String']>;
  messageDate?: Maybe<Scalars['DateTime']>;
  messageEndDate?: Maybe<Scalars['DateTime']>;
  messageProtocol?: Maybe<Scalars['String']>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateType?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  readDate?: Maybe<Scalars['DateTime']>;
  relatedEntities?: Maybe<Array<Maybe<RelatedEntity>>>;
  relatedToUserId?: Maybe<Scalars['UUID']>;
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
  groupingId?: InputMaybe<SortEnumType>;
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

export type PointsActivity = {
  __typename?: 'PointsActivity';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  maxPointsIndividualMonthly?: Maybe<Scalars['Int']>;
  maxPointsIndividualYearly?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  points: Scalars['Int'];
  pointsCategory?: Maybe<PointsCategory>;
  pointsCategoryId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type PointsActivityFilterInput = {
  and?: InputMaybe<Array<PointsActivityFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  maxPointsIndividualMonthly?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  maxPointsIndividualYearly?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PointsActivityFilterInput>>;
  points?: InputMaybe<ComparableInt32OperationFilterInput>;
  pointsCategory?: InputMaybe<PointsCategoryFilterInput>;
  pointsCategoryId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type PointsActivityInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MaxPointsIndividualMonthly?: InputMaybe<Scalars['Int']>;
  MaxPointsIndividualYearly?: InputMaybe<Scalars['Int']>;
  Name?: InputMaybe<Scalars['String']>;
  Points: Scalars['Int'];
  PointsCategory?: InputMaybe<PointsCategoryInput>;
  PointsCategoryId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type PointsActivitySortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  maxPointsIndividualMonthly?: InputMaybe<SortEnumType>;
  maxPointsIndividualYearly?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  points?: InputMaybe<SortEnumType>;
  pointsCategory?: InputMaybe<PointsCategorySortInput>;
  pointsCategoryId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type PointsCategory = {
  __typename?: 'PointsCategory';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type PointsCategoryFilterInput = {
  and?: InputMaybe<Array<PointsCategoryFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PointsCategoryFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type PointsCategoryInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type PointsCategorySortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type PointsClinicSummary = {
  __typename?: 'PointsClinicSummary';
  clinicId: Scalars['UUID'];
  dateScored: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  pointsCategory?: Maybe<PointsCategory>;
  pointsCategoryId: Scalars['UUID'];
  pointsTotal: Scalars['Int'];
  timesScored: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type PointsClinicSummaryFilterInput = {
  and?: InputMaybe<Array<PointsClinicSummaryFilterInput>>;
  clinicId?: InputMaybe<ComparableGuidOperationFilterInput>;
  dateScored?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PointsClinicSummaryFilterInput>>;
  pointsCategory?: InputMaybe<PointsCategoryFilterInput>;
  pointsCategoryId?: InputMaybe<ComparableGuidOperationFilterInput>;
  pointsTotal?: InputMaybe<ComparableInt32OperationFilterInput>;
  timesScored?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type PointsClinicSummaryInput = {
  ClinicId: Scalars['UUID'];
  DateScored: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  PointsCategory?: InputMaybe<PointsCategoryInput>;
  PointsCategoryId: Scalars['UUID'];
  PointsTotal: Scalars['Int'];
  TimesScored: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type PointsClinicSummarySortInput = {
  clinicId?: InputMaybe<SortEnumType>;
  dateScored?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  pointsCategory?: InputMaybe<PointsCategorySortInput>;
  pointsCategoryId?: InputMaybe<SortEnumType>;
  pointsTotal?: InputMaybe<SortEnumType>;
  timesScored?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
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

export type PointsToDoItemModel = {
  __typename?: 'PointsToDoItemModel';
  isPartOfPreschool?: Maybe<Scalars['Boolean']>;
  plannedOneDay?: Maybe<Scalars['Boolean']>;
  savedIncomeOrExpense?: Maybe<Scalars['Boolean']>;
  signedUpForApp?: Maybe<Scalars['Boolean']>;
  viewedCommunitySection?: Maybe<Scalars['Boolean']>;
};

export type PointsUserDateSummary = {
  __typename?: 'PointsUserDateSummary';
  activityDetail?: Maybe<Array<Maybe<ActivityDetail>>>;
  total: Scalars['Int'];
  totalChildren: Scalars['Int'];
  userRankingData?: Maybe<UserRankingPointsModel>;
};

export type PointsUserSummary = {
  __typename?: 'PointsUserSummary';
  dateScored: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  pointsActivity?: Maybe<PointsActivity>;
  pointsActivityId: Scalars['UUID'];
  pointsLibrary?: Maybe<PointsLibrary>;
  pointsLibraryId?: Maybe<Scalars['UUID']>;
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
  dateScored?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<PointsUserSummaryFilterInput>>;
  pointsActivity?: InputMaybe<PointsActivityFilterInput>;
  pointsActivityId?: InputMaybe<ComparableGuidOperationFilterInput>;
  pointsLibrary?: InputMaybe<PointsLibraryFilterInput>;
  pointsLibraryId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  DateScored: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  PointsActivity?: InputMaybe<PointsActivityInput>;
  PointsActivityId: Scalars['UUID'];
  PointsLibrary?: InputMaybe<PointsLibraryInput>;
  PointsLibraryId?: InputMaybe<Scalars['UUID']>;
  PointsTotal: Scalars['Int'];
  PointsYTD: Scalars['Int'];
  TimesScored: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type PointsUserSummarySortInput = {
  dateScored?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  pointsActivity?: InputMaybe<PointsActivitySortInput>;
  pointsActivityId?: InputMaybe<SortEnumType>;
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

export type PointsUserYearMonthSummary = {
  __typename?: 'PointsUserYearMonthSummary';
  monthSummary?: Maybe<Array<Maybe<MonthSummary>>>;
  total: Scalars['Int'];
};

export type PortalCoachModel = {
  __typename?: 'PortalCoachModel';
  id: Scalars['UUID'];
  insertedDate?: Maybe<Scalars['DateTime']>;
  isRegistered: Scalars['Boolean'];
  user?: Maybe<PortalCoachUserModel>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PortalCoachModelFilterInput = {
  and?: InputMaybe<Array<PortalCoachModelFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PortalCoachModelFilterInput>>;
  user?: InputMaybe<PortalCoachUserModelFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PortalCoachModelSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  user?: InputMaybe<PortalCoachUserModelSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type PortalCoachUserModel = {
  __typename?: 'PortalCoachUserModel';
  connectUsage?: Maybe<Scalars['String']>;
  connectUsageColor?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  phoneNumber?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type PortalCoachUserModelFilterInput = {
  and?: InputMaybe<Array<PortalCoachUserModelFilterInput>>;
  connectUsage?: InputMaybe<StringOperationFilterInput>;
  connectUsageColor?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lastSeen?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<PortalCoachUserModelFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type PortalCoachUserModelSortInput = {
  connectUsage?: InputMaybe<SortEnumType>;
  connectUsageColor?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  lastSeen?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  surname?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type PortalPractitionerModel = {
  __typename?: 'PortalPractitionerModel';
  id: Scalars['UUID'];
  insertedDate?: Maybe<Scalars['DateTime']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered: Scalars['Boolean'];
  user?: Maybe<PortalPractitionerUserModel>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PortalPractitionerModelFilterInput = {
  and?: InputMaybe<Array<PortalPractitionerModelFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<PortalPractitionerModelFilterInput>>;
  user?: InputMaybe<PortalPractitionerUserModelFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PortalPractitionerModelSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isPrincipal?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  user?: InputMaybe<PortalPractitionerUserModelSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type PortalPractitionerUserModel = {
  __typename?: 'PortalPractitionerUserModel';
  connectUsage?: Maybe<Scalars['String']>;
  connectUsageColor?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  idNumber?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  phoneNumber?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type PortalPractitionerUserModelFilterInput = {
  and?: InputMaybe<Array<PortalPractitionerUserModelFilterInput>>;
  connectUsage?: InputMaybe<StringOperationFilterInput>;
  connectUsageColor?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lastSeen?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<PortalPractitionerUserModelFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type PortalPractitionerUserModelSortInput = {
  connectUsage?: InputMaybe<SortEnumType>;
  connectUsageColor?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  firstName?: InputMaybe<SortEnumType>;
  fullName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  idNumber?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  lastSeen?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  surname?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type Practitioner = {
  __typename?: 'Practitioner';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  clickedCommunityTab?: Maybe<Scalars['Boolean']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  coachLinkDate?: Maybe<Scalars['DateTime']>;
  communitySectionViewDate?: Maybe<Scalars['DateTime']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isPrincipalOrAdmin: Scalars['Boolean'];
  isRegistered?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  leavingComment?: Maybe<Scalars['String']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  progressWalkthroughComplete: Scalars['Boolean'];
  reasonForLeaving?: Maybe<ReasonForPractitionerLeaving>;
  reasonForLeavingDetails?: Maybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: Maybe<Scalars['UUID']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PractitionerFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
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

export type PractitionerColleagues = {
  __typename?: 'PractitionerColleagues';
  classroomNames?: Maybe<Scalars['String']>;
  contactNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nickName?: Maybe<Scalars['String']>;
  profilePhoto?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
};

export type PractitionerFilterInput = {
  and?: InputMaybe<Array<PractitionerFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  clickedCommunityTab?: InputMaybe<BooleanOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  coachLinkDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  communitySectionViewDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  dateAccepted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateLinked?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateToBeRemoved?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isCompletedBusinessWalkThrough?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  leavingComment?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PractitionerFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  principal?: InputMaybe<PractitionerFilterInput>;
  principalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  programmeType?: InputMaybe<StringOperationFilterInput>;
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
  progressWalkthroughComplete?: InputMaybe<BooleanOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
  reasonForLeavingDetails?: InputMaybe<StringOperationFilterInput>;
  reasonForPractitionerLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PractitionerInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  ClickedCommunityTab?: InputMaybe<Scalars['Boolean']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  CoachLinkDate?: InputMaybe<Scalars['DateTime']>;
  CommunitySectionViewDate?: InputMaybe<Scalars['DateTime']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsCompletedBusinessWalkThrough?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  LeavingComment?: InputMaybe<Scalars['String']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  ProgrammeType?: InputMaybe<Scalars['String']>;
  Progress: Scalars['Decimal'];
  ProgressWalkthroughComplete: Scalars['Boolean'];
  ReasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingInput>;
  ReasonForLeavingDetails?: InputMaybe<Scalars['String']>;
  ReasonForPractitionerLeavingId?: InputMaybe<Scalars['UUID']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
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
  clickedCommunityTab?: Maybe<Scalars['Boolean']>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  coachName?: Maybe<Scalars['String']>;
  coachProfilePic?: Maybe<Scalars['String']>;
  communitySectionViewDate?: Maybe<Scalars['DateTime']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  daysAbsentLastMonth: Scalars['Int'];
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isOnLeave: Scalars['Boolean'];
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  permissions?: Maybe<Array<Maybe<UserPermissionModel>>>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  progressWalkthroughComplete: Scalars['Boolean'];
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  startDate?: Maybe<Scalars['DateTime']>;
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

export type PractitionerPermissionModel = {
  __typename?: 'PractitionerPermissionModel';
  grouping?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
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
  clickedCommunityTab?: InputMaybe<SortEnumType>;
  coach?: InputMaybe<CoachSortInput>;
  coachHierarchy?: InputMaybe<SortEnumType>;
  coachLinkDate?: InputMaybe<SortEnumType>;
  communitySectionViewDate?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  dateAccepted?: InputMaybe<SortEnumType>;
  dateLinked?: InputMaybe<SortEnumType>;
  dateToBeRemoved?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isCompletedBusinessWalkThrough?: InputMaybe<SortEnumType>;
  isLeaving?: InputMaybe<SortEnumType>;
  isPrincipal?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  languageUsedInGroups?: InputMaybe<SortEnumType>;
  leavingComment?: InputMaybe<SortEnumType>;
  parentFees?: InputMaybe<SortEnumType>;
  principal?: InputMaybe<PractitionerSortInput>;
  principalHierarchy?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<SortEnumType>;
  progress?: InputMaybe<SortEnumType>;
  progressWalkthroughComplete?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingSortInput>;
  reasonForLeavingDetails?: InputMaybe<SortEnumType>;
  reasonForPractitionerLeavingId?: InputMaybe<SortEnumType>;
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  usePhotoInReport?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type PractitionerStatsModel = {
  __typename?: 'PractitionerStatsModel';
  schoolName?: Maybe<Scalars['String']>;
  totalAttendanceRegistersCompleted: Scalars['Int'];
  totalAttendanceRegistersNotCompleted: Scalars['Int'];
  totalChildrenForSchool: Scalars['Int'];
  totalClassesForSchool: Scalars['Int'];
  totalIncomeStatementsDownloaded: Scalars['Int'];
  totalIncomeStatementsWithNoItems: Scalars['Int'];
  totalPractitionersForSchool: Scalars['Int'];
  totalProgressReportsCompleted: Scalars['Int'];
  totalProgressReportsNotCompleted: Scalars['Int'];
};

export type PractitionerTimeline = {
  __typename?: 'PractitionerTimeline';
  childProgressTrainingColor?: Maybe<Scalars['String']>;
  childProgressTrainingDate?: Maybe<Scalars['DateTime']>;
  childProgressTrainingStatus?: Maybe<Scalars['String']>;
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
  belongsToPreschool?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  note?: Maybe<Scalars['String']>;
};

export type Principal = {
  __typename?: 'Principal';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  clickedCommunityTab?: Maybe<Scalars['Boolean']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  communitySectionViewDate?: Maybe<Scalars['DateTime']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isCompletedBusinessWalkThrough?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  leavingComment?: Maybe<Scalars['String']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  programmeType?: Maybe<Scalars['String']>;
  progress: Scalars['Decimal'];
  reasonForLeaving?: Maybe<ReasonForPractitionerLeaving>;
  reasonForLeavingDetails?: Maybe<Scalars['String']>;
  reasonForPractitionerLeavingId?: Maybe<Scalars['UUID']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type PrincipalFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PrincipalFilterInput = {
  and?: InputMaybe<Array<PrincipalFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  clickedCommunityTab?: InputMaybe<BooleanOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  communitySectionViewDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  dateAccepted?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateLinked?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  dateToBeRemoved?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isCompletedBusinessWalkThrough?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  leavingComment?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PrincipalFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  programmeType?: InputMaybe<StringOperationFilterInput>;
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingFilterInput>;
  reasonForLeavingDetails?: InputMaybe<StringOperationFilterInput>;
  reasonForPractitionerLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type PrincipalInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  ClickedCommunityTab?: InputMaybe<Scalars['Boolean']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  CommunitySectionViewDate?: InputMaybe<Scalars['DateTime']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsCompletedBusinessWalkThrough?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  LeavingComment?: InputMaybe<Scalars['String']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  ProgrammeType?: InputMaybe<Scalars['String']>;
  Progress: Scalars['Decimal'];
  ReasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingInput>;
  ReasonForLeavingDetails?: InputMaybe<Scalars['String']>;
  ReasonForPractitionerLeavingId?: InputMaybe<Scalars['UUID']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
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
  clickedCommunityTab?: InputMaybe<SortEnumType>;
  coach?: InputMaybe<CoachSortInput>;
  coachHierarchy?: InputMaybe<SortEnumType>;
  communitySectionViewDate?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  dateAccepted?: InputMaybe<SortEnumType>;
  dateLinked?: InputMaybe<SortEnumType>;
  dateToBeRemoved?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isCompletedBusinessWalkThrough?: InputMaybe<SortEnumType>;
  isLeaving?: InputMaybe<SortEnumType>;
  isPrincipal?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  languageUsedInGroups?: InputMaybe<SortEnumType>;
  leavingComment?: InputMaybe<SortEnumType>;
  parentFees?: InputMaybe<SortEnumType>;
  programmeType?: InputMaybe<SortEnumType>;
  progress?: InputMaybe<SortEnumType>;
  reasonForLeaving?: InputMaybe<ReasonForPractitionerLeavingSortInput>;
  reasonForLeavingDetails?: InputMaybe<SortEnumType>;
  reasonForPractitionerLeavingId?: InputMaybe<SortEnumType>;
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
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
  shareContent?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ProgrammeRoutineInput = {
  description?: InputMaybe<Scalars['String']>;
  headerBanner?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  routineItems?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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
  shareContent?: Maybe<Scalars['String']>;
  timeSpan?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
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
  shareContent?: InputMaybe<Scalars['String']>;
  timeSpan?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ProgrammeRoutineSubItem = {
  __typename?: 'ProgrammeRoutineSubItem';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  imageBackgroundColor?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  timeSpan?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ProgrammeRoutineSubItemInput = {
  description?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  imageBackgroundColor?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  timeSpan?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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

export type ProgressSubCategoryModelInput = {
  name?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Array<InputMaybe<SubCategorySkillModelInput>>>;
  subCatId: Scalars['Int'];
};

export type ProgressTrackingAgeGroup = {
  __typename?: 'ProgressTrackingAgeGroup';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endAgeInMonths?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  skills?: Maybe<Scalars['String']>;
  startAgeInMonths?: Maybe<Scalars['String']>;
};

export type ProgressTrackingAgeGroupInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  endAgeInMonths?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Scalars['String']>;
  startAgeInMonths?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingCategory = {
  __typename?: 'ProgressTrackingCategory';
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  subCategories?: Maybe<Array<Maybe<ProgressTrackingSubCategory>>>;
  subTitle?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ProgressTrackingCategoryInput = {
  color?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  subCategories?: InputMaybe<Scalars['String']>;
  subTitle?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingLevel = {
  __typename?: 'ProgressTrackingLevel';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  imageUrlDim?: Maybe<Scalars['String']>;
  imageUrlDone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ProgressTrackingLevelInput = {
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  imageUrlDim?: InputMaybe<Scalars['String']>;
  imageUrlDone?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingSkill = {
  __typename?: 'ProgressTrackingSkill';
  ageGroups?: Maybe<Array<Maybe<ProgressTrackingAgeGroup>>>;
  id?: Maybe<Scalars['Int']>;
  isReverseScored?: Maybe<Scalars['String']>;
  level?: Maybe<Array<Maybe<ProgressTrackingLevel>>>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  supportImage?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type ProgressTrackingSkillInput = {
  ageGroups?: InputMaybe<Scalars['String']>;
  isReverseScored?: InputMaybe<Scalars['String']>;
  level?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  supportImage?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type ProgressTrackingSubCategory = {
  __typename?: 'ProgressTrackingSubCategory';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageHexColor?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  skills?: Maybe<Array<Maybe<ProgressTrackingSkill>>>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ProgressTrackingSubCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  imageHexColor?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  skills?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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
  GetAllChildProgressReportPeriod?: Maybe<
    Array<Maybe<ChildProgressReportPeriod>>
  >;
  GetAllClassProgramme?: Maybe<Array<Maybe<ClassProgramme>>>;
  GetAllClassReassignmentHistory?: Maybe<
    Array<Maybe<ClassReassignmentHistory>>
  >;
  GetAllClassroom?: Maybe<Array<Maybe<Classroom>>>;
  GetAllClassroomBusinessResource: Array<Maybe<ClassroomBusinessResource>>;
  GetAllClassroomGroup?: Maybe<Array<Maybe<ClassroomGroup>>>;
  GetAllCoach?: Maybe<Array<Maybe<Coach>>>;
  GetAllCoachFeedback?: Maybe<Array<Maybe<CoachFeedback>>>;
  GetAllCoachFeedbackType?: Maybe<Array<Maybe<CoachFeedbackType>>>;
  GetAllCoachingCircleTopics: Array<Maybe<CoachingCircleTopics>>;
  GetAllCommunityProfile?: Maybe<Array<Maybe<CommunityProfile>>>;
  GetAllCommunityProfileConnection?: Maybe<
    Array<Maybe<CommunityProfileConnection>>
  >;
  GetAllCommunityProfileSkill?: Maybe<Array<Maybe<CommunityProfileSkill>>>;
  GetAllCommunitySkill?: Maybe<Array<Maybe<CommunitySkill>>>;
  GetAllConnect: Array<Maybe<Connect>>;
  GetAllConnectItem: Array<Maybe<ConnectItem>>;
  GetAllConsent: Array<Maybe<Consent>>;
  GetAllDailyProgramme?: Maybe<Array<Maybe<DailyProgramme>>>;
  GetAllDocument?: Maybe<Array<Maybe<Document>>>;
  GetAllDocumentType?: Maybe<Array<Maybe<DocumentType>>>;
  GetAllEducation?: Maybe<Array<Maybe<Education>>>;
  GetAllFeedbackType?: Maybe<Array<Maybe<FeedbackType>>>;
  GetAllGender?: Maybe<Array<Maybe<Gender>>>;
  GetAllGrant?: Maybe<Array<Maybe<Grant>>>;
  GetAllHealthPromotion: Array<Maybe<HealthPromotion>>;
  GetAllHierarchyEntity?: Maybe<Array<Maybe<HierarchyEntity>>>;
  GetAllIncomeStatements: Array<Maybe<IncomeStatements>>;
  GetAllInfographics: Array<Maybe<Infographics>>;
  GetAllLanguage?: Maybe<Array<Maybe<Language>>>;
  GetAllLearner?: Maybe<Array<Maybe<Learner>>>;
  GetAllMeetingType?: Maybe<Array<Maybe<MeetingType>>>;
  GetAllMessageLog?: Maybe<Array<Maybe<MessageLog>>>;
  GetAllMessageTemplate?: Maybe<Array<Maybe<MessageTemplate>>>;
  GetAllMoreInformation: Array<Maybe<MoreInformation>>;
  GetAllNavigation?: Maybe<Array<Maybe<Navigation>>>;
  GetAllNote?: Maybe<Array<Maybe<Note>>>;
  GetAllNoteType?: Maybe<Array<Maybe<NoteType>>>;
  GetAllPQARating?: Maybe<Array<Maybe<PqaRating>>>;
  GetAllPQASectionRating?: Maybe<Array<Maybe<PqaSectionRating>>>;
  GetAllPermission?: Maybe<Array<Maybe<Permission>>>;
  GetAllPointsActivity?: Maybe<Array<Maybe<PointsActivity>>>;
  GetAllPointsCategory?: Maybe<Array<Maybe<PointsCategory>>>;
  GetAllPointsClinicSummary?: Maybe<Array<Maybe<PointsClinicSummary>>>;
  GetAllPointsLibrary?: Maybe<Array<Maybe<PointsLibrary>>>;
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
  GetAllProgressTrackingAgeGroup: Array<Maybe<ProgressTrackingAgeGroup>>;
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
  GetAllResourceLink: Array<Maybe<ResourceLink>>;
  GetAllShortenUrlEntity?: Maybe<Array<Maybe<ShortenUrlEntity>>>;
  GetAllSiteAddress?: Maybe<Array<Maybe<SiteAddress>>>;
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
  GetAllSupportRating?: Maybe<Array<Maybe<SupportRating>>>;
  GetAllSystemSetting?: Maybe<Array<Maybe<SystemSetting>>>;
  GetAllTenantSetupInfo?: Maybe<Array<Maybe<TenantSetupInfo>>>;
  GetAllTheme: Array<Maybe<Theme>>;
  GetAllThemeDay: Array<Maybe<ThemeDay>>;
  GetAllTopic: Array<Maybe<Topic>>;
  GetAllUserConsent?: Maybe<Array<Maybe<UserConsent>>>;
  GetAllUserHelp?: Maybe<Array<Maybe<UserHelp>>>;
  GetAllUserHierarchyEntity?: Maybe<Array<Maybe<UserHierarchyEntity>>>;
  GetAllUserPermission?: Maybe<Array<Maybe<UserPermission>>>;
  GetAllUserResourceLikes?: Maybe<Array<Maybe<UserResourceLikes>>>;
  GetAllUserTrainingCourse?: Maybe<Array<Maybe<UserTrainingCourse>>>;
  GetAllVisit?: Maybe<Array<Maybe<Visit>>>;
  GetAllVisitData?: Maybe<Array<Maybe<VisitData>>>;
  GetAllVisitDataStatus?: Maybe<Array<Maybe<VisitDataStatus>>>;
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
  GetChildProgressReportPeriodById?: Maybe<ChildProgressReportPeriod>;
  GetClassProgrammeById?: Maybe<ClassProgramme>;
  GetClassReassignmentHistoryById?: Maybe<ClassReassignmentHistory>;
  GetClassroomBusinessResourceById: Array<Maybe<ClassroomBusinessResource>>;
  GetClassroomById?: Maybe<Classroom>;
  GetClassroomGroupById?: Maybe<ClassroomGroup>;
  GetCoachById?: Maybe<Coach>;
  GetCoachFeedbackById?: Maybe<CoachFeedback>;
  GetCoachFeedbackTypeById?: Maybe<CoachFeedbackType>;
  GetCoachingCircleTopicsById: Array<Maybe<CoachingCircleTopics>>;
  GetCommunityProfileById?: Maybe<CommunityProfile>;
  GetCommunityProfileConnectionById?: Maybe<CommunityProfileConnection>;
  GetCommunityProfileSkillById?: Maybe<CommunityProfileSkill>;
  GetCommunitySkillById?: Maybe<CommunitySkill>;
  GetConnectById: Array<Maybe<Connect>>;
  GetConnectItemById: Array<Maybe<ConnectItem>>;
  GetConsentById: Array<Maybe<Consent>>;
  GetDailyProgrammeById?: Maybe<DailyProgramme>;
  GetDocumentById?: Maybe<Document>;
  GetDocumentTypeById?: Maybe<DocumentType>;
  GetEducationById?: Maybe<Education>;
  GetFeedbackTypeById?: Maybe<FeedbackType>;
  GetGenderById?: Maybe<Gender>;
  GetGrantById?: Maybe<Grant>;
  GetHealthPromotionById: Array<Maybe<HealthPromotion>>;
  GetHierarchyEntityById?: Maybe<HierarchyEntity>;
  GetIncomeStatementsById: Array<Maybe<IncomeStatements>>;
  GetInfographicsById: Array<Maybe<Infographics>>;
  GetLanguageById?: Maybe<Language>;
  GetLearnerById?: Maybe<Learner>;
  GetMeetingTypeById?: Maybe<MeetingType>;
  GetMessageLogById?: Maybe<MessageLog>;
  GetMessageTemplateById?: Maybe<MessageTemplate>;
  GetMoreInformationById: Array<Maybe<MoreInformation>>;
  GetNavigationById?: Maybe<Navigation>;
  GetNoteById?: Maybe<Note>;
  GetNoteTypeById?: Maybe<NoteType>;
  GetPQARatingById?: Maybe<PqaRating>;
  GetPQASectionRatingById?: Maybe<PqaSectionRating>;
  GetPermissionById?: Maybe<Permission>;
  GetPointsActivityById?: Maybe<PointsActivity>;
  GetPointsCategoryById?: Maybe<PointsCategory>;
  GetPointsClinicSummaryById?: Maybe<PointsClinicSummary>;
  GetPointsLibraryById?: Maybe<PointsLibrary>;
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
  GetProgressTrackingAgeGroupById: Array<Maybe<ProgressTrackingAgeGroup>>;
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
  GetResourceLinkById: Array<Maybe<ResourceLink>>;
  GetShortenUrlEntityById?: Maybe<ShortenUrlEntity>;
  GetSiteAddressById?: Maybe<SiteAddress>;
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
  GetSupportRatingById?: Maybe<SupportRating>;
  GetSystemSettingById?: Maybe<SystemSetting>;
  GetTenantSetupInfoById?: Maybe<TenantSetupInfo>;
  GetThemeById: Array<Maybe<Theme>>;
  GetThemeDayById: Array<Maybe<ThemeDay>>;
  GetTopicById: Array<Maybe<Topic>>;
  GetUserConsentById?: Maybe<UserConsent>;
  GetUserHelpById?: Maybe<UserHelp>;
  GetUserHierarchyEntityById?: Maybe<UserHierarchyEntity>;
  GetUserPermissionById?: Maybe<UserPermission>;
  GetUserResourceLikesById?: Maybe<UserResourceLikes>;
  GetUserTrainingCourseById?: Maybe<UserTrainingCourse>;
  GetVisitById?: Maybe<Visit>;
  GetVisitDataById?: Maybe<VisitData>;
  GetVisitDataStatusById?: Maybe<VisitDataStatus>;
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
  activityRecords?: Maybe<Array<Maybe<ActivityViewModel>>>;
  allCaregiver?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiverByPractitioner?: Maybe<Array<Maybe<Caregiver>>>;
  allChildrenForCoach?: Maybe<Array<Maybe<Child>>>;
  allChildrenUnderPrincipal?: Maybe<Array<Maybe<Child>>>;
  allChildrenUnderPrincipalByClassrooms?: Maybe<Array<Maybe<Child>>>;
  allClassroomGroupsByPrincipal?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomGroupsForCoach?: Maybe<Array<Maybe<ClassroomGroupModel>>>;
  allClassroomsForCoach?: Maybe<Array<Maybe<Classroom>>>;
  allClassroomsForPrincipal?: Maybe<Array<Maybe<Classroom>>>;
  allClientRecords?: Maybe<Array<Maybe<Document>>>;
  allContentLanguages?: Maybe<Array<Maybe<Language>>>;
  allDocument?: Maybe<Array<Maybe<Document>>>;
  allMessageLogsForAdmin?: Maybe<Array<Maybe<MessageLogModel>>>;
  allNotifications?: Maybe<Array<Maybe<Notification>>>;
  allPortalCoaches?: Maybe<Array<Maybe<PortalCoachModel>>>;
  allPortalPractitioners?: Maybe<Array<Maybe<PortalPractitionerModel>>>;
  allPractitionerInvites?: Maybe<Array<Scalars['DateTime']>>;
  allPractitioners?: Maybe<Array<Maybe<PractitionerModel>>>;
  allPractitionersForCoach?: Maybe<Array<Maybe<CoachPractitioner>>>;
  allPractitionersForPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipals?: Maybe<Array<Maybe<Principal>>>;
  allResourceLikesForUser?: Maybe<Array<Maybe<UserResourcesModel>>>;
  allTemplates?: Maybe<Array<Maybe<MessageTemplate>>>;
  allWards?: Maybe<Array<Maybe<WardModel>>>;
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  cMSCategoryData?: Maybe<FileModel>;
  caregiverGrants?: Maybe<Array<Maybe<UserGrant>>>;
  childAttendanceReport?: Maybe<ChildAttendanceReportModel>;
  childCreatedByDetail?: Maybe<ChildCreatedByDetail>;
  childProgressReportsForUser?: Maybe<Array<Maybe<ChildProgressReportModel>>>;
  childProgressReportsStatus?: Maybe<ChildProgressReportsStatus>;
  childrenAttendedVsAbsentMetrics?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  childrenForClassroomGroup?: Maybe<Array<Maybe<Child>>>;
  childrenMetrics?: Maybe<ChildrenMetricReport>;
  classAttendanceByUser?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classAttendanceMetrics?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classAttendanceMetricsByUser?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classroomActionItems?: Maybe<Array<Maybe<NotificationDisplay>>>;
  classroomAttendanceOverviewReport?: Maybe<ClassroomGroupChildAttendanceReportOverviewModel>;
  classroomForUser?: Maybe<ClassroomModel>;
  classroomGroupsForUser?: Maybe<Array<Maybe<ClassroomGroupModel>>>;
  coachByCoachUserId?: Maybe<Coach>;
  coachByPractitionerId?: Maybe<Coach>;
  coachByUserId?: Maybe<Coach>;
  coachNameByUserId?: Maybe<Scalars['String']>;
  coachStats?: Maybe<CoachStatsModel>;
  coachTemplateGenerator?: Maybe<FileModel>;
  communityProfile?: Maybe<CommunityProfileModel>;
  communitySkills?: Maybe<Array<Maybe<CommunitySkillModel>>>;
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
  countChildProgressReportPeriod?: Maybe<Scalars['Int']>;
  countClassProgramme?: Maybe<Scalars['Int']>;
  countClassReassignmentHistory?: Maybe<Scalars['Int']>;
  countClassroom?: Maybe<Scalars['Int']>;
  countClassroomGroup?: Maybe<Scalars['Int']>;
  countCoach?: Maybe<Scalars['Int']>;
  countCoachFeedback?: Maybe<Scalars['Int']>;
  countCoachFeedbackType?: Maybe<Scalars['Int']>;
  countCommunityProfile?: Maybe<Scalars['Int']>;
  countCommunityProfileConnection?: Maybe<Scalars['Int']>;
  countCommunityProfileSkill?: Maybe<Scalars['Int']>;
  countCommunitySkill?: Maybe<Scalars['Int']>;
  countDailyProgramme?: Maybe<Scalars['Int']>;
  countDocument?: Maybe<Scalars['Int']>;
  countDocumentType?: Maybe<Scalars['Int']>;
  countEducation?: Maybe<Scalars['Int']>;
  countFeedbackType?: Maybe<Scalars['Int']>;
  countGender?: Maybe<Scalars['Int']>;
  countGrant?: Maybe<Scalars['Int']>;
  countHierarchyEntity?: Maybe<Scalars['Int']>;
  countLanguage?: Maybe<Scalars['Int']>;
  countLearner?: Maybe<Scalars['Int']>;
  countMeetingType?: Maybe<Scalars['Int']>;
  countMessageLog?: Maybe<Scalars['Int']>;
  countMessageTemplate?: Maybe<Scalars['Int']>;
  countNavigation?: Maybe<Scalars['Int']>;
  countNote?: Maybe<Scalars['Int']>;
  countNoteType?: Maybe<Scalars['Int']>;
  countPQARating?: Maybe<Scalars['Int']>;
  countPQASectionRating?: Maybe<Scalars['Int']>;
  countPermission?: Maybe<Scalars['Int']>;
  countPointsActivity?: Maybe<Scalars['Int']>;
  countPointsCategory?: Maybe<Scalars['Int']>;
  countPointsClinicSummary?: Maybe<Scalars['Int']>;
  countPointsLibrary?: Maybe<Scalars['Int']>;
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
  countStatementsContributionType?: Maybe<Scalars['Int']>;
  countStatementsExpenseType?: Maybe<Scalars['Int']>;
  countStatementsExpenses?: Maybe<Scalars['Int']>;
  countStatementsFeeType?: Maybe<Scalars['Int']>;
  countStatementsIncome?: Maybe<Scalars['Int']>;
  countStatementsIncomeStatement?: Maybe<Scalars['Int']>;
  countStatementsIncomeType?: Maybe<Scalars['Int']>;
  countStatementsPayType?: Maybe<Scalars['Int']>;
  countStatementsStartupSupport?: Maybe<Scalars['Int']>;
  countSupportRating?: Maybe<Scalars['Int']>;
  countSystemSetting?: Maybe<Scalars['Int']>;
  countTenantSetupInfo?: Maybe<Scalars['Int']>;
  countUserConsent?: Maybe<Scalars['Int']>;
  countUserHelp?: Maybe<Scalars['Int']>;
  countUserHierarchyEntity?: Maybe<Scalars['Int']>;
  countUserPermission?: Maybe<Scalars['Int']>;
  countUserResourceLikes?: Maybe<Scalars['Int']>;
  countUserTrainingCourse?: Maybe<Scalars['Int']>;
  countUsers: Scalars['Int'];
  countVisit?: Maybe<Scalars['Int']>;
  countVisitData?: Maybe<Scalars['Int']>;
  countVisitDataStatus?: Maybe<Scalars['Int']>;
  countVisitType?: Maybe<Scalars['Int']>;
  countWorkflowStatus?: Maybe<Scalars['Int']>;
  countWorkflowStatusType?: Maybe<Scalars['Int']>;
  currentUserCompletedTrainingCourses?: Maybe<Array<Maybe<UserTrainingCourse>>>;
  dangerSignTranslations?: Maybe<Array<Maybe<DangerSignTranslation>>>;
  defaultSettingsForTenant?: Maybe<Scalars['String']>;
  displayMetrics?: Maybe<Array<Maybe<NotificationDisplay>>>;
  feedbackTypes?: Maybe<Array<Maybe<FeedbackTypeModel>>>;
  getMoodleSessionForCurrentUser?: Maybe<Scalars['String']>;
  hasContentTypeBeenTranslated: Scalars['Boolean'];
  healthPromotion: Array<Maybe<HealthPromotion>>;
  holidaysByMonth?: Maybe<Array<Maybe<Holiday>>>;
  holidaysByYear?: Maybe<Array<Maybe<Holiday>>>;
  incomeStatementPdf?: Maybe<Scalars['String']>;
  incomeStatements?: Maybe<Array<Maybe<IncomeStatementModel>>>;
  infographics: Array<Maybe<Infographics>>;
  lastPractitionerInviteDate?: Maybe<Scalars['String']>;
  latestUrlInviteForUser?: Maybe<Scalars['String']>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  monthlyAttendanceRecordCSV?: Maybe<FileModel>;
  monthlyAttendanceReport?: Maybe<Array<Maybe<MonthlyAttendanceReportModel>>>;
  moreInformation: Array<Maybe<MoreInformation>>;
  openAccessAddChildDetail?: Maybe<ChildTokenAccessModel>;
  openConsent: Array<Maybe<Consent>>;
  openLanguage: Array<Maybe<Language>>;
  otherConnections?: Maybe<Array<Maybe<CommunityConnectionModel>>>;
  ownershipMetrics?: Maybe<PractitionerMetricReport>;
  permissionGroups?: Maybe<Array<Maybe<PermissionGroupModel>>>;
  pointActivities?: Maybe<Array<Maybe<PointsActivity>>>;
  pointsSummaryForUser?: Maybe<Array<Maybe<PointsUserSummary>>>;
  pointsTodoItems?: Maybe<PointsToDoItemModel>;
  practitionerById?: Maybe<PractitionerModel>;
  practitionerByIdNumber?: Maybe<PractitionerUserAndNote>;
  practitionerByIdNumberInternal?: Maybe<ApplicationUser>;
  practitionerByUserId?: Maybe<PractitionerModel>;
  practitionerColleagues?: Maybe<Array<Maybe<PractitionerColleagues>>>;
  practitionerExcelTemplateGenerator?: Maybe<FileModel>;
  practitionerInviteCount: Scalars['Int'];
  practitionerMetrics?: Maybe<PractitionerMetricReport>;
  practitionerNewSignupMetric: Scalars['Int'];
  practitionerPermissions?: Maybe<PractitionerModel>;
  practitionerProgressReportSummary?: Maybe<PractitionerProgressReportSummaryModel>;
  practitionerRolePermissions?: Maybe<
    Array<Maybe<PractitionerPermissionModel>>
  >;
  practitionerStats?: Maybe<PractitionerStatsModel>;
  practitionerTemplateGenerator?: Maybe<FileModel>;
  practitionerTimeline?: Maybe<PractitionerTimeline>;
  practitionerVisits?: Maybe<Array<Maybe<Visit>>>;
  principalByUserId?: Maybe<Practitioner>;
  ratingsAndFeedbackTypes?: Maybe<CoachFeedbackSetupModel>;
  removalDetailsForPractitioner?: Maybe<PractitionerRemovalHistory>;
  removalDetailsForPractitioners?: Maybe<
    Array<Maybe<PractitionerRemovalHistory>>
  >;
  removeHolidays?: Maybe<Array<Scalars['DateTime']>>;
  removeWeekendDays?: Maybe<Array<Scalars['DateTime']>>;
  reportDetailsForPractitioner?: Maybe<PractitionerReportDetails>;
  resourceByLanguage?: Maybe<ResourceModel>;
  resourceLikedStatusForUser?: Maybe<UserResourceLikes>;
  resources: Array<Maybe<ClassroomBusinessResource>>;
  roleForUser?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<ApplicationIdentityRole>>>;
  settings?: Maybe<SettingsType>;
  sharedData?: Maybe<PointsUserDateSummary>;
  statementsIncomeExpensesPDFData?: Maybe<
    Array<Maybe<IncomeExpensePdfTableModel>>
  >;
  storyBookPartQuestions?: Maybe<Array<Maybe<StoryBookPartModel>>>;
  storyBookRecords?: Maybe<Array<Maybe<StoryBookViewModel>>>;
  supportRatings?: Maybe<Array<Maybe<SupportRatingModel>>>;
  tenantContext?: Maybe<TenantModel>;
  themeRecords?: Maybe<Array<Maybe<ThemeViewModel>>>;
  totalDaysAbsent: Scalars['Int'];
  userById?: Maybe<ApplicationUser>;
  userByToken?: Maybe<UserByToken>;
  userCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
  userCountForMessageCriteria: Scalars['Int'];
  userProgrammes?: Maybe<Array<Maybe<Programme>>>;
  userSyncStatus?: Maybe<UserSyncStatus>;
  users?: Maybe<Array<Maybe<ApplicationUser>>>;
  usersToConnectWith?: Maybe<Array<Maybe<CommunityConnectionModel>>>;
  validateCoachImportSheet?: Maybe<UserImportModel>;
  validatePractitionerImportSheet?: Maybe<UserImportModel>;
  validatePreSchoolCode?: Maybe<Classroom>;
  visitDataForVisit?: Maybe<Array<Maybe<VisitData>>>;
  visitDataForVisitId?: Maybe<Array<Maybe<VisitData>>>;
  visitNotesForPractitioner?: Maybe<Array<Maybe<PractitionerNotes>>>;
  visitVideos: Array<Maybe<VisitVideos>>;
  yearPointsView?: Maybe<PointsUserYearMonthSummary>;
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

export type QueryGetAllChildProgressReportPeriodArgs = {
  order?: InputMaybe<Array<ChildProgressReportPeriodSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ChildProgressReportPeriodFilterInput>;
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

export type QueryGetAllClassroomBusinessResourceArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllClassroomGroupArgs = {
  order?: InputMaybe<Array<ClassroomGroupSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetAllCoachArgs = {
  order?: InputMaybe<Array<CoachSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetAllCoachFeedbackArgs = {
  order?: InputMaybe<Array<CoachFeedbackSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CoachFeedbackFilterInput>;
};

export type QueryGetAllCoachFeedbackTypeArgs = {
  order?: InputMaybe<Array<CoachFeedbackTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CoachFeedbackTypeFilterInput>;
};

export type QueryGetAllCoachingCircleTopicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllCommunityProfileArgs = {
  order?: InputMaybe<Array<CommunityProfileSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CommunityProfileFilterInput>;
};

export type QueryGetAllCommunityProfileConnectionArgs = {
  order?: InputMaybe<Array<CommunityProfileConnectionSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CommunityProfileConnectionFilterInput>;
};

export type QueryGetAllCommunityProfileSkillArgs = {
  order?: InputMaybe<Array<CommunityProfileSkillSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CommunityProfileSkillFilterInput>;
};

export type QueryGetAllCommunitySkillArgs = {
  order?: InputMaybe<Array<CommunitySkillSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CommunitySkillFilterInput>;
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

export type QueryGetAllFeedbackTypeArgs = {
  order?: InputMaybe<Array<FeedbackTypeSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<FeedbackTypeFilterInput>;
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

export type QueryGetAllInfographicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllLanguageArgs = {
  order?: InputMaybe<Array<LanguageSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetAllLearnerArgs = {
  order?: InputMaybe<Array<LearnerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<LearnerFilterInput>;
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

export type QueryGetAllPointsActivityArgs = {
  order?: InputMaybe<Array<PointsActivitySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsActivityFilterInput>;
};

export type QueryGetAllPointsCategoryArgs = {
  order?: InputMaybe<Array<PointsCategorySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsCategoryFilterInput>;
};

export type QueryGetAllPointsClinicSummaryArgs = {
  order?: InputMaybe<Array<PointsClinicSummarySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsClinicSummaryFilterInput>;
};

export type QueryGetAllPointsLibraryArgs = {
  order?: InputMaybe<Array<PointsLibrarySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<PointsLibraryFilterInput>;
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

export type QueryGetAllProgressTrackingAgeGroupArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type QueryGetAllResourceLinkArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type QueryGetAllSupportRatingArgs = {
  order?: InputMaybe<Array<SupportRatingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SupportRatingFilterInput>;
};

export type QueryGetAllSystemSettingArgs = {
  order?: InputMaybe<Array<SystemSettingSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetAllTenantSetupInfoArgs = {
  order?: InputMaybe<Array<TenantSetupInfoSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<TenantSetupInfoFilterInput>;
};

export type QueryGetAllThemeArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllThemeDayArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllTopicArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllUserConsentArgs = {
  order?: InputMaybe<Array<UserConsentSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetAllUserHelpArgs = {
  order?: InputMaybe<Array<UserHelpSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserHelpFilterInput>;
};

export type QueryGetAllUserHierarchyEntityArgs = {
  order?: InputMaybe<Array<UserHierarchyEntitySortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetAllUserPermissionArgs = {
  order?: InputMaybe<Array<UserPermissionSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserPermissionFilterInput>;
};

export type QueryGetAllUserResourceLikesArgs = {
  order?: InputMaybe<Array<UserResourceLikesSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserResourceLikesFilterInput>;
};

export type QueryGetAllUserTrainingCourseArgs = {
  order?: InputMaybe<Array<UserTrainingCourseSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<UserTrainingCourseFilterInput>;
};

export type QueryGetAllVisitArgs = {
  order?: InputMaybe<Array<VisitSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<VisitFilterInput>;
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

export type QueryGetChildProgressReportPeriodByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ChildProgressReportPeriodFilterInput>;
};

export type QueryGetClassProgrammeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassProgrammeFilterInput>;
};

export type QueryGetClassReassignmentHistoryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassReassignmentHistoryFilterInput>;
};

export type QueryGetClassroomBusinessResourceByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetClassroomByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassroomFilterInput>;
};

export type QueryGetClassroomGroupByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetCoachByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetCoachFeedbackByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CoachFeedbackFilterInput>;
};

export type QueryGetCoachFeedbackTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CoachFeedbackTypeFilterInput>;
};

export type QueryGetCoachingCircleTopicsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetCommunityProfileByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CommunityProfileFilterInput>;
};

export type QueryGetCommunityProfileConnectionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CommunityProfileConnectionFilterInput>;
};

export type QueryGetCommunityProfileSkillByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CommunityProfileSkillFilterInput>;
};

export type QueryGetCommunitySkillByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CommunitySkillFilterInput>;
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

export type QueryGetFeedbackTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<FeedbackTypeFilterInput>;
};

export type QueryGetGenderByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<GenderFilterInput>;
};

export type QueryGetGrantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<GrantFilterInput>;
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

export type QueryGetInfographicsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetLanguageByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetLearnerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LearnerFilterInput>;
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

export type QueryGetPointsActivityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsActivityFilterInput>;
};

export type QueryGetPointsCategoryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsCategoryFilterInput>;
};

export type QueryGetPointsClinicSummaryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsClinicSummaryFilterInput>;
};

export type QueryGetPointsLibraryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PointsLibraryFilterInput>;
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

export type QueryGetProgressTrackingAgeGroupByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
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

export type QueryGetResourceLinkByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetShortenUrlEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ShortenUrlEntityFilterInput>;
};

export type QueryGetSiteAddressByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SiteAddressFilterInput>;
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

export type QueryGetSupportRatingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SupportRatingFilterInput>;
};

export type QueryGetSystemSettingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetTenantSetupInfoByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<TenantSetupInfoFilterInput>;
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

export type QueryGetTopicByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetUserConsentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetUserHelpByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserHelpFilterInput>;
};

export type QueryGetUserHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetUserPermissionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserPermissionFilterInput>;
};

export type QueryGetUserResourceLikesByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserResourceLikesFilterInput>;
};

export type QueryGetUserTrainingCourseByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserTrainingCourseFilterInput>;
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

export type QueryActivityRecordsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  isStoryActivity: Scalars['Boolean'];
  languageSearch?: InputMaybe<Array<Scalars['UUID']>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  skillSearch?: InputMaybe<Array<Scalars['Int']>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  subTypesSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  themesSearch?: InputMaybe<Array<Scalars['Int']>>;
  typesSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryAllCaregiverByPractitionerArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForCoachArgs = {
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

export type QueryAllClassroomsForCoachArgs = {
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

export type QueryAllMessageLogsForAdminArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllNotificationsArgs = {
  inApp?: Scalars['Boolean'];
  order?: InputMaybe<Array<NotificationSortInput>>;
  protocol?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllPortalCoachesArgs = {
  connectUsageSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  order?: InputMaybe<Array<PortalCoachModelSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<PortalCoachModelFilterInput>;
};

export type QueryAllPortalPractitionersArgs = {
  connectUsageSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  order?: InputMaybe<Array<PortalPractitionerModelSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  practitionerTypeSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  provinceSearch?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<PortalPractitionerModelFilterInput>;
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

export type QueryAllResourceLikesForUserArgs = {
  userId: Scalars['UUID'];
};

export type QueryAllTemplatesArgs = {
  templateId?: InputMaybe<Scalars['String']>;
};

export type QueryAttendanceArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  where?: InputMaybe<AttendanceFilterInput>;
};

export type QueryCaregiverGrantsArgs = {
  careGiverId: Scalars['UUID'];
};

export type QueryChildAttendanceReportArgs = {
  classgroupId: Scalars['UUID'];
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryChildCreatedByDetailArgs = {
  firstName?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
};

export type QueryChildProgressReportsForUserArgs = {
  userId: Scalars['UUID'];
};

export type QueryChildProgressReportsStatusArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryChildrenAttendedVsAbsentMetricsArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type QueryChildrenForClassroomGroupArgs = {
  classRoomGroupId: Scalars['UUID'];
};

export type QueryClassAttendanceByUserArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
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
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomForUserArgs = {
  userId: Scalars['UUID'];
};

export type QueryClassroomGroupsForUserArgs = {
  userId: Scalars['UUID'];
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

export type QueryCoachStatsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type QueryCommunityProfileArgs = {
  userId: Scalars['UUID'];
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

export type QueryCountChildProgressReportPeriodArgs = {
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

export type QueryCountCoachArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCoachFeedbackArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCoachFeedbackTypeArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCommunityProfileArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCommunityProfileConnectionArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCommunityProfileSkillArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountCommunitySkillArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountDailyProgrammeArgs = {
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

export type QueryCountFeedbackTypeArgs = {
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

export type QueryCountHierarchyEntityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLanguageArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountLearnerArgs = {
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

export type QueryCountPointsActivityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsCategoryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsClinicSummaryArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountPointsLibraryArgs = {
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

export type QueryCountSupportRatingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountSystemSettingArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountTenantSetupInfoArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserConsentArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserHelpArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserHierarchyEntityArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserPermissionArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserResourceLikesArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountUserTrainingCourseArgs = {
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

export type QueryCountVisitDataArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountVisitDataStatusArgs = {
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

export type QueryDangerSignTranslationsArgs = {
  section?: InputMaybe<Scalars['String']>;
  toTranslate?: InputMaybe<Scalars['String']>;
};

export type QueryDisplayMetricsArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type QueryHasContentTypeBeenTranslatedArgs = {
  id: Scalars['Int'];
  localeId: Scalars['UUID'];
};

export type QueryHealthPromotionArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type QueryHolidaysByMonthArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
};

export type QueryHolidaysByYearArgs = {
  year: Scalars['Int'];
};

export type QueryIncomeStatementPdfArgs = {
  statementId: Scalars['UUID'];
};

export type QueryIncomeStatementsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type QueryInfographicsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryLastPractitionerInviteDateArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryLatestUrlInviteForUserArgs = {
  userId: Scalars['UUID'];
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
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryMoreInformationArgs = {
  locale?: InputMaybe<Scalars['String']>;
  section?: InputMaybe<Scalars['String']>;
};

export type QueryOpenAccessAddChildDetailArgs = {
  token?: InputMaybe<Scalars['String']>;
};

export type QueryOpenConsentArgs = {
  locale?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type QueryOtherConnectionsArgs = {
  communitySkillIds?: InputMaybe<Array<Scalars['UUID']>>;
  provinceIds?: InputMaybe<Array<Scalars['UUID']>>;
  userId: Scalars['UUID'];
};

export type QueryPointsSummaryForUserArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPointsTodoItemsArgs = {
  userId: Scalars['UUID'];
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

export type QueryPractitionerPermissionsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerProgressReportSummaryArgs = {
  locale?: InputMaybe<Scalars['String']>;
  reportingPeriod?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerStatsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type QueryPractitionerTimelineArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerVisitsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPrincipalByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
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

export type QueryResourceByLanguageArgs = {
  contentId: Scalars['Int'];
  contentTypeId: Scalars['Int'];
  localeId: Scalars['UUID'];
};

export type QueryResourceLikedStatusForUserArgs = {
  contentId: Scalars['Int'];
};

export type QueryResourcesArgs = {
  dataFreeSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  likesSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  localeId: Scalars['UUID'];
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  sectionType?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type QueryRoleForUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QuerySharedDataArgs = {
  isMonthly: Scalars['Boolean'];
  userId: Scalars['UUID'];
};

export type QueryStatementsIncomeExpensesPdfDataArgs = {
  statementId: Scalars['UUID'];
};

export type QueryStoryBookPartQuestionsArgs = {
  localeId: Scalars['UUID'];
};

export type QueryStoryBookRecordsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  languageSearch?: InputMaybe<Array<Scalars['UUID']>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  themesSearch?: InputMaybe<Array<Scalars['Int']>>;
  typesSearch?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type QueryThemeRecordsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};

export type QueryTotalDaysAbsentArgs = {
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

export type QueryUserCountForMessageCriteriaArgs = {
  districtId?: InputMaybe<Scalars['String']>;
  provinceId?: InputMaybe<Scalars['String']>;
  roleIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  wardName?: InputMaybe<Scalars['String']>;
};

export type QueryUserSyncStatusArgs = {
  classroomId: Scalars['UUID'];
  lastSync: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type QueryUsersArgs = {
  order?: InputMaybe<Array<ApplicationUserSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  search?: InputMaybe<Scalars['String']>;
};

export type QueryUsersToConnectWithArgs = {
  communitySkillIds?: InputMaybe<Array<Scalars['UUID']>>;
  connectionTypes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  provinceIds?: InputMaybe<Array<Scalars['UUID']>>;
  userId: Scalars['UUID'];
};

export type QueryValidateCoachImportSheetArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type QueryValidatePractitionerImportSheetArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type QueryValidatePreSchoolCodeArgs = {
  preSchoolCode?: InputMaybe<Scalars['String']>;
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

export type QueryYearPointsViewArgs = {
  userId: Scalars['UUID'];
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
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  reAccreditationData?: InputMaybe<CmsVisitDataInputModelInput>;
  risk?: InputMaybe<Scalars['String']>;
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

export type RelatedEntity = {
  __typename?: 'RelatedEntity';
  entityType?: Maybe<Scalars['String']>;
  relatedToEntityId: Scalars['UUID'];
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

export type ResourceLink = {
  __typename?: 'ResourceLink';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ResourceLinkInput = {
  description?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type ResourceModel = {
  __typename?: 'ResourceModel';
  availableLanguages?: Maybe<Array<Scalars['UUID']>>;
  dataFree?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
  longDescription?: Maybe<Scalars['String']>;
  numberLikes?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  sectionType?: Maybe<Scalars['String']>;
  shortDescription?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
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

export type Setting_Grafana = {
  __typename?: 'Setting_Grafana';
  GeneralDashboard: Scalars['String'];
};

export type Setting_IncomeStatementSubmitEnd = {
  __typename?: 'Setting_IncomeStatementSubmitEnd';
  IncomeStatementSubmitEnd: Scalars['String'];
};

export type Setting_IncomeStatementSubmitStart = {
  __typename?: 'Setting_IncomeStatementSubmitStart';
  IncomeStatementSubmitStart: Scalars['String'];
};

export type Setting_InvitationCutoffDelay = {
  __typename?: 'Setting_InvitationCutoffDelay';
  InvitationCutoffDelay: Scalars['String'];
};

export type Setting_Invitations = {
  __typename?: 'Setting_Invitations';
  AdminSignup: Scalars['String'];
  PrincipalSignup: Scalars['String'];
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

export type Setting_Security = {
  __typename?: 'Setting_Security';
  ForgotPassword: Scalars['String'];
  ForgotPasswordPortal: Scalars['String'];
  Login: Scalars['String'];
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
  Grafana: Setting_Grafana;
  IncomeStatementSubmitEnd: Setting_IncomeStatementSubmitEnd;
  IncomeStatementSubmitStart: Setting_IncomeStatementSubmitStart;
  InvitationCutoffDelay: Setting_InvitationCutoffDelay;
  Invitations: Setting_Invitations;
  Jwts: Setting_Jwts;
  RapidApi: Setting_RapidApi;
  Reporting: Setting_Reporting;
  Security: Setting_Security;
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
  notificationResult?: Maybe<Scalars['Int']>;
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
  notificationResult?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
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
  NotificationResult?: InputMaybe<Scalars['Int']>;
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
  notificationResult?: InputMaybe<SortEnumType>;
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

export type SkillObservation = {
  __typename?: 'SkillObservation';
  skillId: Scalars['Int'];
  value?: Maybe<Scalars['String']>;
};

export type SkillObservationInput = {
  skillId: Scalars['Int'];
  value?: InputMaybe<Scalars['String']>;
};

export type SkillToWorkOn = {
  __typename?: 'SkillToWorkOn';
  howToSupport?: Maybe<Scalars['String']>;
  skillId: Scalars['Int'];
};

export type SkillToWorkOnInput = {
  howToSupport?: InputMaybe<Scalars['String']>;
  skillId: Scalars['Int'];
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
  expenseTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  statementsIncomeStatementId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsExpensesFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  datePaid?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  expenseTypeId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  statementsIncomeStatementId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsExpensesInput = {
  Amount: Scalars['Float'];
  DatePaid: Scalars['DateTime'];
  ExpenseTypeId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  StatementsIncomeStatementId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsExpensesSortInput = {
  amount?: InputMaybe<SortEnumType>;
  datePaid?: InputMaybe<SortEnumType>;
  expenseTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
  statementsIncomeStatementId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
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
  childUser?: Maybe<ApplicationUser>;
  childUserId?: Maybe<Scalars['UUID']>;
  dateReceived: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeTypeId?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  numberOfChildrenCovered?: Maybe<Scalars['Int']>;
  payTypeId?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  statementsIncomeStatementId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsIncomeFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  childUser?: InputMaybe<ApplicationUserFilterInput>;
  childUserId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  dateReceived?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeTypeId?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  numberOfChildrenCovered?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  payTypeId?: InputMaybe<StringOperationFilterInput>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  statementsIncomeStatementId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsIncomeInput = {
  Amount: Scalars['Float'];
  ChildUser?: InputMaybe<ApplicationUserInput>;
  ChildUserId?: InputMaybe<Scalars['UUID']>;
  DateReceived: Scalars['DateTime'];
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeTypeId?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  NumberOfChildrenCovered?: InputMaybe<Scalars['Int']>;
  PayTypeId?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  StatementsIncomeStatementId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsIncomeSortInput = {
  amount?: InputMaybe<SortEnumType>;
  childUser?: InputMaybe<ApplicationUserSortInput>;
  childUserId?: InputMaybe<SortEnumType>;
  dateReceived?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  incomeTypeId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  numberOfChildrenCovered?: InputMaybe<SortEnumType>;
  payTypeId?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
  statementsIncomeStatementId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type StatementsIncomeStatement = {
  __typename?: 'StatementsIncomeStatement';
  contactedByCoach: Scalars['Boolean'];
  downloaded: Scalars['Boolean'];
  expenseItems?: Maybe<Array<Maybe<StatementsExpenses>>>;
  id: Scalars['UUID'];
  incomeItems?: Maybe<Array<Maybe<StatementsIncome>>>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['UUID']>;
  year: Scalars['Int'];
};

export type StatementsIncomeStatementFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  contactedByCoach?: InputMaybe<BooleanOperationFilterInput>;
  downloaded?: InputMaybe<BooleanOperationFilterInput>;
  expenseItems?: InputMaybe<ListFilterInputTypeOfStatementsExpensesFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeItems?: InputMaybe<ListFilterInputTypeOfStatementsIncomeFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type StatementsIncomeStatementInput = {
  ContactedByCoach: Scalars['Boolean'];
  Downloaded: Scalars['Boolean'];
  ExpenseItems?: InputMaybe<Array<InputMaybe<StatementsExpensesInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeItems?: InputMaybe<Array<InputMaybe<StatementsIncomeInput>>>;
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['UUID']>;
  Year: Scalars['Int'];
};

export type StatementsIncomeStatementSortInput = {
  contactedByCoach?: InputMaybe<SortEnumType>;
  downloaded?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
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
  authorsAuthorization?: Maybe<Scalars['String']>;
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  bookLocation?: Maybe<Scalars['String']>;
  bookLocationLink?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  illustrator?: Maybe<Scalars['String']>;
  keywords?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  storyBookParts?: Maybe<Array<Maybe<StoryBookParts>>>;
  themes?: Maybe<Array<Maybe<Theme>>>;
  translator?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type StoryBookInput = {
  author?: InputMaybe<Scalars['String']>;
  authorsAuthorization?: InputMaybe<Scalars['String']>;
  availableLanguages?: InputMaybe<Scalars['String']>;
  bookLocation?: InputMaybe<Scalars['String']>;
  bookLocationLink?: InputMaybe<Scalars['String']>;
  illustrator?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  storyBookParts?: InputMaybe<Scalars['String']>;
  themes?: InputMaybe<Scalars['String']>;
  translator?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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

export type StoryBookPartModel = {
  __typename?: 'StoryBookPartModel';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
};

export type StoryBookPartQuestion = {
  __typename?: 'StoryBookPartQuestion';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  question?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type StoryBookPartQuestionInput = {
  name?: InputMaybe<Scalars['String']>;
  question?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type StoryBookParts = {
  __typename?: 'StoryBookParts';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  part?: Maybe<Scalars['String']>;
  partText?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  storyBookPartQuestions?: Maybe<Array<Maybe<StoryBookPartQuestion>>>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type StoryBookPartsInput = {
  name?: InputMaybe<Scalars['String']>;
  part?: InputMaybe<Scalars['String']>;
  partText?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  storyBookPartQuestions?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type StoryBookViewModel = {
  __typename?: 'StoryBookViewModel';
  author?: Maybe<Scalars['String']>;
  availableLanguages?: Maybe<Array<Scalars['UUID']>>;
  bookLocation?: Maybe<Scalars['String']>;
  bookLocationLink?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  illustrator?: Maybe<Scalars['String']>;
  inUseThemeNames?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isInUse: Scalars['Boolean'];
  keywords?: Maybe<Scalars['String']>;
  localeId: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  storyBookParts?: Maybe<Scalars['String']>;
  themeItems?: Maybe<Array<Scalars['Int']>>;
  themes?: Maybe<Scalars['String']>;
  translator?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['DateTime']>;
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

export type SubCategoryViewModel = {
  __typename?: 'SubCategoryViewModel';
  id?: Maybe<Scalars['String']>;
  imageHexColor?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type SupportRating = {
  __typename?: 'SupportRating';
  id: Scalars['UUID'];
  imageName?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type SupportRatingFilterInput = {
  and?: InputMaybe<Array<SupportRatingFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  imageName?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SupportRatingFilterInput>>;
  ordering?: InputMaybe<ComparableInt32OperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type SupportRatingInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  ImageName?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  Ordering: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type SupportRatingModel = {
  __typename?: 'SupportRatingModel';
  id: Scalars['UUID'];
  imageName?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ordering: Scalars['Int'];
};

export type SupportRatingSortInput = {
  id?: InputMaybe<SortEnumType>;
  imageName?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  normalizedName?: InputMaybe<SortEnumType>;
  ordering?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type SupportVisitModelInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  attended?: InputMaybe<Scalars['Boolean']>;
  coachId?: InputMaybe<Scalars['UUID']>;
  comment?: InputMaybe<Scalars['String']>;
  dueDate?: InputMaybe<Scalars['DateTime']>;
  isSupportCall?: InputMaybe<Scalars['Boolean']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate?: InputMaybe<Scalars['DateTime']>;
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
  supportData?: InputMaybe<CmsVisitDataInputModelInput>;
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

export type TenantInfoInputModelInput = {
  applicationName?: InputMaybe<Scalars['String']>;
  organisationEmail?: InputMaybe<Scalars['String']>;
  organisationName?: InputMaybe<Scalars['String']>;
};

export type TenantInternalModel = {
  __typename?: 'TenantInternalModel';
  adminSiteAddress?: Maybe<Scalars['String']>;
  adminTestSiteAddress?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  blobStorageAddress?: Maybe<Scalars['String']>;
  claimString?: Maybe<Scalars['String']>;
  defaultSystemSettings?: Maybe<Scalars['String']>;
  googleAnalyticsTag?: Maybe<Scalars['String']>;
  googleTagManager?: Maybe<Scalars['String']>;
  host?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modules?: Maybe<TenantModuleModel>;
  moodleConfig?: Maybe<Scalars['String']>;
  moodleUrl?: Maybe<Scalars['String']>;
  organisationEmail?: Maybe<Scalars['String']>;
  organisationName?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<Scalars['String']>;
  siteAddress2?: Maybe<Scalars['String']>;
  tenantType: TenantType;
  testSiteAddress?: Maybe<Scalars['String']>;
  themePath?: Maybe<Scalars['String']>;
};

export type TenantModel = {
  __typename?: 'TenantModel';
  adminSiteAddress?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  blobStorageAddress?: Maybe<Scalars['String']>;
  googleAnalyticsTag?: Maybe<Scalars['String']>;
  googleTagManager?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  modules?: Maybe<TenantModuleModel>;
  moodleUrl?: Maybe<Scalars['String']>;
  organisationEmail?: Maybe<Scalars['String']>;
  organisationName?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<Scalars['String']>;
  siteAddress2?: Maybe<Scalars['String']>;
  tenantType: TenantType;
  themePath?: Maybe<Scalars['String']>;
};

export type TenantModuleModel = {
  __typename?: 'TenantModuleModel';
  attendanceEnabled: Scalars['Boolean'];
  businessEnabled: Scalars['Boolean'];
  calendarEnabled: Scalars['Boolean'];
  classroomActivitiesEnabled: Scalars['Boolean'];
  coachRoleEnabled: Scalars['Boolean'];
  coachRoleName?: Maybe<Scalars['String']>;
  progressEnabled: Scalars['Boolean'];
  trainingEnabled: Scalars['Boolean'];
};

export type TenantSetupInfo = {
  __typename?: 'TenantSetupInfo';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  organisationName?: Maybe<Scalars['String']>;
  setupJsonData?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type TenantSetupInfoFilterInput = {
  and?: InputMaybe<Array<TenantSetupInfoFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<TenantSetupInfoFilterInput>>;
  organisationName?: InputMaybe<StringOperationFilterInput>;
  setupJsonData?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type TenantSetupInfoInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  OrganisationName?: InputMaybe<Scalars['String']>;
  SetupJsonData?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type TenantSetupInfoSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  organisationName?: InputMaybe<SortEnumType>;
  setupJsonData?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export enum TenantType {
  ChwConnect = 'CHW_CONNECT',
  FundaApp = 'FUNDA_APP',
  Host = 'HOST',
  OpenAccess = 'OPEN_ACCESS',
  WhiteLabel = 'WHITE_LABEL',
  WhiteLabelTemplate = 'WHITE_LABEL_TEMPLATE',
}

export type Theme = {
  __typename?: 'Theme';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  themeDays?: Maybe<Array<Maybe<ThemeDay>>>;
  themeLogo?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ThemeDay = {
  __typename?: 'ThemeDay';
  day?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  largeGroupActivity?: Maybe<Array<Maybe<Activity>>>;
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  smallGroupActivity?: Maybe<Array<Maybe<Activity>>>;
  storyActivity?: Maybe<Array<Maybe<Activity>>>;
  storyBook?: Maybe<Array<Maybe<StoryBook>>>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type ThemeDayInput = {
  day?: InputMaybe<Scalars['String']>;
  largeGroupActivity?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  smallGroupActivity?: InputMaybe<Scalars['String']>;
  storyActivity?: InputMaybe<Scalars['String']>;
  storyBook?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ThemeInput = {
  color?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  shareContent?: InputMaybe<Scalars['String']>;
  themeDays?: InputMaybe<Scalars['String']>;
  themeLogo?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
};

export type ThemeViewModel = {
  __typename?: 'ThemeViewModel';
  availableLanguages?: Maybe<Array<Scalars['UUID']>>;
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  localeId: Scalars['UUID'];
  name?: Maybe<Scalars['String']>;
  shareContent?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['String']>;
  themeDays?: Maybe<Scalars['String']>;
  themeLogo?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['DateTime']>;
};

export type TokenAccessChildDetailModel = {
  __typename?: 'TokenAccessChildDetailModel';
  firstname?: Maybe<Scalars['String']>;
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

export type Topic = {
  __typename?: 'Topic';
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
  id?: Maybe<Scalars['Int']>;
  infoGraphic?: Maybe<Scalars['String']>;
  knowledgeContent?: Maybe<Scalars['String']>;
  selfCareContent?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  topicContent?: Maybe<Scalars['String']>;
  topicTitle?: Maybe<Scalars['String']>;
  updatedDate?: Maybe<Scalars['String']>;
};

export type TopicInput = {
  availableLanguages?: InputMaybe<Scalars['String']>;
  infoGraphic?: InputMaybe<Scalars['String']>;
  knowledgeContent?: InputMaybe<Scalars['String']>;
  selfCareContent?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
  topicContent?: InputMaybe<Scalars['String']>;
  topicTitle?: InputMaybe<Scalars['String']>;
  updatedDate?: InputMaybe<Scalars['String']>;
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

export type UpdateChildAndCaregiverInput = {
  allergies?: InputMaybe<Scalars['String']>;
  caregiver?: InputMaybe<ChildCaregiverInput>;
  disabilities?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  inactiveDate?: InputMaybe<Scalars['DateTime']>;
  inactiveReason?: InputMaybe<Scalars['String']>;
  inactivityComments?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  languageId?: InputMaybe<Scalars['UUID']>;
  otherHealthConditions?: InputMaybe<Scalars['String']>;
  reasonForLeavingId?: InputMaybe<Scalars['UUID']>;
  user?: InputMaybe<ChildUserUpdateInput>;
  workflowStatusId: Scalars['UUID'];
};

export type UpdateSiteAddressInput = {
  addressLine1?: InputMaybe<Scalars['String']>;
  addressLine2?: InputMaybe<Scalars['String']>;
  addressLine3?: InputMaybe<Scalars['String']>;
  id: Scalars['UUID'];
  name?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  provinceId?: InputMaybe<Scalars['UUID']>;
  ward?: InputMaybe<Scalars['String']>;
};

export type UpdateUserPermissionInputModelInput = {
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
  userId: Scalars['UUID'];
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

export type UserHelp = {
  __typename?: 'UserHelp';
  cellNumber?: Maybe<Scalars['String']>;
  contactPreference?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isLoggedIn: Scalars['Boolean'];
  subject?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type UserHelpFilterInput = {
  and?: InputMaybe<Array<UserHelpFilterInput>>;
  cellNumber?: InputMaybe<StringOperationFilterInput>;
  contactPreference?: InputMaybe<StringOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isLoggedIn?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserHelpFilterInput>>;
  subject?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type UserHelpInput = {
  CellNumber?: InputMaybe<Scalars['String']>;
  ContactPreference?: InputMaybe<Scalars['String']>;
  Description?: InputMaybe<Scalars['String']>;
  Email?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsLoggedIn: Scalars['Boolean'];
  Subject?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type UserHelpSortInput = {
  cellNumber?: InputMaybe<SortEnumType>;
  contactPreference?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isLoggedIn?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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
  profilePicIsEmoji?: InputMaybe<Scalars['Boolean']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  resetData?: InputMaybe<Scalars['Boolean']>;
  surname?: InputMaybe<Scalars['String']>;
  userName?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs?: InputMaybe<Scalars['Boolean']>;
  welcomeMessage?: InputMaybe<Scalars['String']>;
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type UserPermission = {
  __typename?: 'UserPermission';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  permission?: Maybe<Permission>;
  permissionId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['UUID']>;
};

export type UserPermissionFilterInput = {
  and?: InputMaybe<Array<UserPermissionFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserPermissionFilterInput>>;
  permission?: InputMaybe<PermissionFilterInput>;
  permissionId?: InputMaybe<ComparableGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
};

export type UserPermissionInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Permission?: InputMaybe<PermissionInput>;
  PermissionId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['UUID']>;
};

export type UserPermissionModel = {
  __typename?: 'UserPermissionModel';
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  permissionGrouping?: Maybe<Scalars['String']>;
  permissionId: Scalars['UUID'];
  permissionName?: Maybe<Scalars['String']>;
  permissionNormalizedName?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
};

export type UserPermissionSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  permission?: InputMaybe<PermissionSortInput>;
  permissionId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type UserRankingPointsModel = {
  __typename?: 'UserRankingPointsModel';
  comparativePrimaryMessage?: Maybe<Scalars['String']>;
  comparativeSecondaryMessage?: Maybe<Scalars['String']>;
  comparativeTargetPercentage: Scalars['Float'];
  comparativeTargetPercentageColor?: Maybe<Scalars['String']>;
  messageNr: Scalars['Int'];
  nonComparativePrimaryMessage?: Maybe<Scalars['String']>;
  nonComparativeSecondaryMessage?: Maybe<Scalars['String']>;
  nonComparativeTargetPercentage: Scalars['Float'];
  nonComparativeTargetPercentageColor?: Maybe<Scalars['String']>;
  pointsTotal: Scalars['Int'];
  rankingNr: Scalars['Int'];
  userId: Scalars['UUID'];
};

export type UserResourceLikes = {
  __typename?: 'UserResourceLikes';
  contentId: Scalars['Int'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId: Scalars['UUID'];
};

export type UserResourceLikesFilterInput = {
  and?: InputMaybe<Array<UserResourceLikesFilterInput>>;
  contentId?: InputMaybe<ComparableInt32OperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserResourceLikesFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type UserResourceLikesInput = {
  ContentId: Scalars['Int'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId: Scalars['UUID'];
};

export type UserResourceLikesSortInput = {
  contentId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  userId?: InputMaybe<SortEnumType>;
};

export type UserResourcesModel = {
  __typename?: 'UserResourcesModel';
  contentId: Scalars['Int'];
  isActive: Scalars['Boolean'];
};

export type UserSyncStatus = {
  __typename?: 'UserSyncStatus';
  syncChildren: Scalars['Boolean'];
  syncClassroom: Scalars['Boolean'];
  syncPermissions: Scalars['Boolean'];
  syncPoints: Scalars['Boolean'];
  syncReportingPeriods: Scalars['Boolean'];
};

export type UserTrainingCourse = {
  __typename?: 'UserTrainingCourse';
  completedDate: Scalars['DateTime'];
  courseName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId: Scalars['UUID'];
};

export type UserTrainingCourseFilterInput = {
  and?: InputMaybe<Array<UserTrainingCourseFilterInput>>;
  completedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  courseName?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserTrainingCourseFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type UserTrainingCourseInput = {
  CompletedDate: Scalars['DateTime'];
  CourseName?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId: Scalars['UUID'];
};

export type UserTrainingCourseSortInput = {
  completedDate?: InputMaybe<SortEnumType>;
  courseName?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isCancelled: Scalars['Boolean'];
  linkedVisitId?: Maybe<Scalars['UUID']>;
  orderDate?: Maybe<Scalars['DateTime']>;
  overallRatingColor?: Maybe<Scalars['String']>;
  pQARating?: Maybe<PqaRating>;
  plannedVisitDate: Scalars['DateTime'];
  practitioner?: Maybe<Practitioner>;
  practitionerId?: Maybe<Scalars['UUID']>;
  rating?: Maybe<Scalars['String']>;
  risk?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitData?: Maybe<Array<Maybe<VisitData>>>;
  visitInProgress: Scalars['Boolean'];
  visitType?: Maybe<VisitType>;
  visitTypeId: Scalars['UUID'];
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
  visitDataStatus?: Maybe<Array<Maybe<VisitDataStatus>>>;
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
  visitDataStatus?: InputMaybe<ListFilterInputTypeOfVisitDataStatusFilterInput>;
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
  VisitDataStatus?: InputMaybe<Array<InputMaybe<VisitDataStatusInput>>>;
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
  color?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isCompleted: Scalars['Boolean'];
  section?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitData?: Maybe<VisitData>;
  visitDataId: Scalars['UUID'];
};

export type VisitDataStatusFilterInput = {
  and?: InputMaybe<Array<VisitDataStatusFilterInput>>;
  color?: InputMaybe<StringOperationFilterInput>;
  comment?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isCompleted?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<VisitDataStatusFilterInput>>;
  section?: InputMaybe<StringOperationFilterInput>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitData?: InputMaybe<VisitDataFilterInput>;
  visitDataId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type VisitDataStatusInput = {
  Color?: InputMaybe<Scalars['String']>;
  Comment?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsCompleted: Scalars['Boolean'];
  Section?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitData?: InputMaybe<VisitDataInput>;
  VisitDataId: Scalars['UUID'];
};

export type VisitDataStatusSortInput = {
  color?: InputMaybe<SortEnumType>;
  comment?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isCompleted?: InputMaybe<SortEnumType>;
  section?: InputMaybe<SortEnumType>;
  type?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  visitData?: InputMaybe<VisitDataSortInput>;
  visitDataId?: InputMaybe<SortEnumType>;
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
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isCancelled?: InputMaybe<BooleanOperationFilterInput>;
  linkedVisitId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<VisitFilterInput>>;
  orderDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  overallRatingColor?: InputMaybe<StringOperationFilterInput>;
  pQARating?: InputMaybe<PqaRatingFilterInput>;
  plannedVisitDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  rating?: InputMaybe<StringOperationFilterInput>;
  risk?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitData?: InputMaybe<ListFilterInputTypeOfVisitDataFilterInput>;
  visitInProgress?: InputMaybe<BooleanOperationFilterInput>;
  visitType?: InputMaybe<VisitTypeFilterInput>;
  visitTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
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
  IsActive: Scalars['Boolean'];
  IsCancelled: Scalars['Boolean'];
  LinkedVisitId?: InputMaybe<Scalars['UUID']>;
  OrderDate?: InputMaybe<Scalars['DateTime']>;
  OverallRatingColor?: InputMaybe<Scalars['String']>;
  PQARating?: InputMaybe<PqaRatingInput>;
  PlannedVisitDate: Scalars['DateTime'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId?: InputMaybe<Scalars['UUID']>;
  Rating?: InputMaybe<Scalars['String']>;
  Risk?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitData?: InputMaybe<Array<InputMaybe<VisitDataInput>>>;
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
  isSupportCall?: InputMaybe<Scalars['Boolean']>;
  linkedVisitId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate: Scalars['DateTime'];
  practitionerId?: InputMaybe<Scalars['UUID']>;
  risk?: InputMaybe<Scalars['String']>;
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
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isCancelled?: InputMaybe<SortEnumType>;
  linkedVisitId?: InputMaybe<SortEnumType>;
  orderDate?: InputMaybe<SortEnumType>;
  overallRatingColor?: InputMaybe<SortEnumType>;
  pQARating?: InputMaybe<PqaRatingSortInput>;
  plannedVisitDate?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
  rating?: InputMaybe<SortEnumType>;
  risk?: InputMaybe<SortEnumType>;
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
  availableLanguages?: Maybe<Array<Maybe<Language>>>;
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
  availableLanguages?: InputMaybe<Scalars['String']>;
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
