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

export type Absentees = {
  __typename?: 'Absentees';
  absentDate: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  loggedBy?: Maybe<Scalars['String']>;
  program?: Maybe<Programme>;
  reason?: Maybe<Scalars['String']>;
  reassignedClass?: Maybe<Scalars['String']>;
  reassignedToPractitioner?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type AbsenteesFilterInput = {
  absentDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  and?: InputMaybe<Array<AbsenteesFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  loggedBy?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<AbsenteesFilterInput>>;
  program?: InputMaybe<ProgrammeFilterInput>;
  reason?: InputMaybe<StringOperationFilterInput>;
  reassignedClass?: InputMaybe<StringOperationFilterInput>;
  reassignedToPractitioner?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type AbsenteesInput = {
  AbsentDate: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LoggedBy?: InputMaybe<Scalars['String']>;
  Program?: InputMaybe<ProgrammeInput>;
  Reason?: InputMaybe<Scalars['String']>;
  ReassignedClass?: InputMaybe<Scalars['String']>;
  ReassignedToPractitioner?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type AbsenteesSortInput = {
  absentDate?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
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
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  nextReportingPeriodEnd: Scalars['DateTime'];
  notes?: Maybe<Scalars['String']>;
  practitionerUser?: Maybe<ApplicationUser>;
  subject?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
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

export type AgeSpreadDisplay = {
  __typename?: 'AgeSpreadDisplay';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  percentChildrenOutsideAgeGroup: Scalars['Int'];
  subject?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
  userType?: Maybe<Scalars['String']>;
};

export type ApplicationUser = {
  __typename?: 'ApplicationUser';
  childObjectData?: Maybe<Child>;
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
  id?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  insertedDate?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isImported?: Maybe<Scalars['Boolean']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  lastSeen: Scalars['DateTime'];
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
  roles?: Maybe<Array<Maybe<IdentityRole>>>;
  surname?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['UUID']>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: Maybe<Scalars['DateTime']>;
  userName?: Maybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type ApplicationUserFilterInput = {
  and?: InputMaybe<Array<ApplicationUserFilterInput>>;
  childObjectData?: InputMaybe<ChildFilterInput>;
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
  id?: InputMaybe<StringOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isImported?: InputMaybe<BooleanOperationFilterInput>;
  isSouthAfricanCitizen?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  lastSeen?: InputMaybe<ComparableDateTimeOperationFilterInput>;
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
  surname?: InputMaybe<StringOperationFilterInput>;
  tenantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  twoFactorEnabled?: InputMaybe<BooleanOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
  verifiedByHomeAffairs?: InputMaybe<BooleanOperationFilterInput>;
  whatsAppNumber?: InputMaybe<StringOperationFilterInput>;
};

export type ApplicationUserInput = {
  childObjectData?: InputMaybe<ChildInput>;
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
  id?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  insertedDate?: InputMaybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  isImported?: InputMaybe<Scalars['Boolean']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: InputMaybe<LanguageInput>;
  languageId?: InputMaybe<Scalars['UUID']>;
  lastSeen: Scalars['DateTime'];
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
  surname?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['UUID']>;
  twoFactorEnabled: Scalars['Boolean'];
  updatedDate?: InputMaybe<Scalars['DateTime']>;
  userName?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type ApplicationUserSortInput = {
  childObjectData?: InputMaybe<ChildSortInput>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
};

export type BulkInvitationResult = {
  __typename?: 'BulkInvitationResult';
  failed?: Maybe<Array<Maybe<Scalars['String']>>>;
  success?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  participantUserId?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type CalendarEventParticipantFilterInput = {
  and?: InputMaybe<Array<CalendarEventParticipantFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CalendarEventParticipantFilterInput>>;
  participantUser?: InputMaybe<ApplicationUserFilterInput>;
  participantUserId?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type CalendarEventParticipantInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ParticipantUser?: InputMaybe<ApplicationUserInput>;
  ParticipantUserId?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type CalendarEventParticipantModelInput = {
  id?: InputMaybe<Scalars['String']>;
  participantUserId?: InputMaybe<Scalars['String']>;
};

export type CalendarEventParticipantSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  participantUser?: InputMaybe<ApplicationUserSortInput>;
  participantUserId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
  WorkflowStatus?: InputMaybe<WorkflowStatusInput>;
  WorkflowStatusId?: InputMaybe<Scalars['UUID']>;
};

export type ChildProgressDisplay = {
  __typename?: 'ChildProgressDisplay';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  numberOfChildrenNotProgressedForPeriod: Scalars['Int'];
  numberOfPeriods: Scalars['Int'];
  percentageOfChildrenNotProgressedForPeriod: Scalars['Int'];
  subject?: Maybe<Scalars['String']>;
  totalChildren: Scalars['Int'];
  userId: Scalars['UUID'];
  userType?: Maybe<Scalars['String']>;
};

export type ChildProgressReport = {
  __typename?: 'ChildProgressReport';
  child?: Maybe<Child>;
  childId: Scalars['UUID'];
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  reportContent?: Maybe<Scalars['String']>;
  reportDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
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
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<ChildProgressReportFilterInput>>;
  reportContent?: InputMaybe<StringOperationFilterInput>;
  reportDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type ChildProgressReportInput = {
  Child?: InputMaybe<ChildInput>;
  ChildId: Scalars['UUID'];
  ClassroomGroup?: InputMaybe<ClassroomGroupInput>;
  ClassroomGroupId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ReportContent?: InputMaybe<Scalars['String']>;
  ReportDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type ChildProgressReportSortInput = {
  child?: InputMaybe<ChildSortInput>;
  childId?: InputMaybe<SortEnumType>;
  classroomGroup?: InputMaybe<ClassroomGroupSortInput>;
  classroomGroupId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
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
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  reassignedClassroomGroup?: Maybe<ClassroomGroup>;
  reassignedFromUser?: Maybe<ApplicationUser>;
  reassignedToUser?: Maybe<ApplicationUser>;
  subject?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
  userType?: Maybe<Scalars['String']>;
};

export type ClassReassignmentHistory = {
  __typename?: 'ClassReassignmentHistory';
  hierarchyBackToUser?: Maybe<Scalars['String']>;
  hierarchyToUser?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  loggedBy?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  reassignedBackToDate?: Maybe<Scalars['DateTime']>;
  reassignedBackToUserId?: Maybe<Scalars['String']>;
  reassignedChildrenUserIds?: Maybe<Scalars['String']>;
  reassignedClassProgrammes?: Maybe<Scalars['String']>;
  reassignedClassroomGroups?: Maybe<Scalars['String']>;
  reassignedClassrooms?: Maybe<Scalars['String']>;
  reassignedLearners?: Maybe<Scalars['String']>;
  reassignedToDate: Scalars['DateTime'];
  reassignedToUser?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type ClassReassignmentHistoryFilterInput = {
  and?: InputMaybe<Array<ClassReassignmentHistoryFilterInput>>;
  hierarchyBackToUser?: InputMaybe<StringOperationFilterInput>;
  hierarchyToUser?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  loggedBy?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClassReassignmentHistoryFilterInput>>;
  reason?: InputMaybe<StringOperationFilterInput>;
  reassignedBackToDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  reassignedBackToUserId?: InputMaybe<StringOperationFilterInput>;
  reassignedChildrenUserIds?: InputMaybe<StringOperationFilterInput>;
  reassignedClassProgrammes?: InputMaybe<StringOperationFilterInput>;
  reassignedClassroomGroups?: InputMaybe<StringOperationFilterInput>;
  reassignedClassrooms?: InputMaybe<StringOperationFilterInput>;
  reassignedLearners?: InputMaybe<StringOperationFilterInput>;
  reassignedToDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  reassignedToUser?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type ClassReassignmentHistoryInput = {
  HierarchyBackToUser?: InputMaybe<Scalars['String']>;
  HierarchyToUser?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LoggedBy?: InputMaybe<Scalars['String']>;
  Reason?: InputMaybe<Scalars['String']>;
  ReassignedBackToDate?: InputMaybe<Scalars['DateTime']>;
  ReassignedBackToUserId?: InputMaybe<Scalars['String']>;
  ReassignedChildrenUserIds?: InputMaybe<Scalars['String']>;
  ReassignedClassProgrammes?: InputMaybe<Scalars['String']>;
  ReassignedClassroomGroups?: InputMaybe<Scalars['String']>;
  ReassignedClassrooms?: InputMaybe<Scalars['String']>;
  ReassignedLearners?: InputMaybe<Scalars['String']>;
  ReassignedToDate: Scalars['DateTime'];
  ReassignedToUser?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type ClassReassignmentHistorySortInput = {
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
  reassignedToDate?: InputMaybe<SortEnumType>;
  reassignedToUser?: InputMaybe<SortEnumType>;
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
  programmes?: Maybe<Array<Maybe<Programme>>>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
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
  programmes?: InputMaybe<ListFilterInputTypeOfProgrammeFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
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
  attendance?: Maybe<Array<KeyValuePairOfInt32AndInt32>>;
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
  Programmes?: InputMaybe<Array<InputMaybe<ProgrammeInput>>>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
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
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClinicFilterInput = {
  and?: InputMaybe<Array<ClinicFilterInput>>;
  emergencyContactNumber?: InputMaybe<StringOperationFilterInput>;
  emergencyContactPerson?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClinicFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClinicInput = {
  EmergencyContactNumber?: InputMaybe<Scalars['String']>;
  EmergencyContactPerson?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  PhoneNumber?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Club = {
  __typename?: 'Club';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  numberOfMembers: Scalars['Int'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubFilterInput = {
  and?: InputMaybe<Array<ClubFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  numberOfMembers?: InputMaybe<ComparableInt32OperationFilterInput>;
  or?: InputMaybe<Array<ClubFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NumberOfMembers: Scalars['Int'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type ClubMeeting = {
  __typename?: 'ClubMeeting';
  club?: Maybe<Club>;
  clubId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  meetingDate?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ClubMeetingFilterInput = {
  and?: InputMaybe<Array<ClubMeetingFilterInput>>;
  club?: InputMaybe<ClubFilterInput>;
  clubId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  meetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ClubMeetingFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type ClubMeetingInput = {
  Club?: InputMaybe<ClubInput>;
  ClubId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MeetingDate?: InputMaybe<Scalars['DateTime']>;
  Name?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  meetingDate?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type ClubSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  numberOfMembers?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type Coach = {
  __typename?: 'Coach';
  areaOfOperation?: Maybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
};

export type CoachFilterInput = {
  and?: InputMaybe<Array<CoachFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type CoachInput = {
  AreaOfOperation?: InputMaybe<Scalars['String']>;
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
  UserId?: InputMaybe<Scalars['String']>;
};

export type CoachSortInput = {
  areaOfOperation?: InputMaybe<SortEnumType>;
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

export type CommunitySectionGg = {
  __typename?: 'CommunitySectionGG';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type CommunitySectionGgInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type CommunitySectionItemGg = {
  __typename?: 'CommunitySectionItemGG';
  buttonText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  linkedSection?: Maybe<Array<Maybe<CommunitySectionGg>>>;
};

export type CommunitySectionItemGgInput = {
  buttonText?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  linkedSection?: InputMaybe<Scalars['String']>;
};

export type CommunitySectionItemSs = {
  __typename?: 'CommunitySectionItemSS';
  buttonText?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  link?: Maybe<Scalars['String']>;
  linkedSection?: Maybe<Array<Maybe<CommunitySectionSs>>>;
};

export type CommunitySectionItemSsInput = {
  buttonText?: InputMaybe<Scalars['String']>;
  link?: InputMaybe<Scalars['String']>;
  linkedSection?: InputMaybe<Scalars['String']>;
};

export type CommunitySectionSs = {
  __typename?: 'CommunitySectionSS';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type CommunitySectionSsInput = {
  name?: InputMaybe<Scalars['String']>;
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

export type Consent = {
  __typename?: 'Consent';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ConsentGg = {
  __typename?: 'ConsentGG';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type ConsentGgInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type ConsentInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
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
  metaData?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentTypeField = {
  __typename?: 'ContentTypeField';
  contentType?: Maybe<ContentType>;
  contentTypeId: Scalars['Int'];
  dataLinkName?: Maybe<Scalars['String']>;
  fieldName?: Maybe<Scalars['String']>;
  fieldOrder: Scalars['Int'];
  fieldType?: Maybe<FieldType>;
  fieldTypeId: Scalars['Int'];
  id: Scalars['Int'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type ContentValue = {
  __typename?: 'ContentValue';
  content?: Maybe<Content>;
  contentId: Scalars['Int'];
  contentTypeField?: Maybe<ContentTypeField>;
  contentTypeFieldId: Scalars['Int'];
  id: Scalars['Int'];
  localeId: Scalars['UUID'];
  status?: Maybe<ContentStatus>;
  statusId?: Maybe<Scalars['Int']>;
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

export type Document = {
  __typename?: 'Document';
  createdUserId?: Maybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
  workflowStatus?: Maybe<WorkflowStatus>;
  workflowStatusId: Scalars['UUID'];
};

export type DocumentFilterInput = {
  and?: InputMaybe<Array<DocumentFilterInput>>;
  createdUserId?: InputMaybe<StringOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
  workflowStatus?: InputMaybe<WorkflowStatusFilterInput>;
  workflowStatusId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type DocumentInput = {
  CreatedUserId?: InputMaybe<Scalars['String']>;
  DocumentType?: InputMaybe<DocumentTypeInput>;
  DocumentTypeId: Scalars['UUID'];
  Hierarchy?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Reference?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  WorkflowStatusId: Scalars['UUID'];
};

export type DocumentModel = {
  __typename?: 'DocumentModel';
  name?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type DocumentSortInput = {
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

export type FieldDefinitionModel = {
  __typename?: 'FieldDefinitionModel';
  assemblyDataTypeName?: Maybe<Scalars['String']>;
  dataType?: Maybe<Scalars['String']>;
  fieldTypeId: Scalars['Int'];
  graphDataTypeName?: Maybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
};

export type FranchisorFilterInput = {
  and?: InputMaybe<Array<FranchisorFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type FranchisorInput = {
  AreaOfOperation?: InputMaybe<Scalars['String']>;
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
  UserId?: InputMaybe<Scalars['String']>;
};

export type FranchisorSortInput = {
  areaOfOperation?: InputMaybe<SortEnumType>;
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

export type HcwHighlights = {
  __typename?: 'HCWHighlights';
  totalLastWeekFamilyVisits: Scalars['Int'];
  totalLastWeekGrowthMonitored: Scalars['Int'];
  totalLastWeekNewClients: Scalars['Int'];
  totalThisWeekFamilyVisits: Scalars['Int'];
  totalThisWeekGrowthMonitored: Scalars['Int'];
  totalThisWeekNewClients: Scalars['Int'];
};

export type HcwPointsEngine = {
  __typename?: 'HCWPointsEngine';
  ignored: Scalars['Boolean'];
  pointsLibrary?: Maybe<Array<Maybe<PointsLibrary>>>;
  pointsUserSummary?: Maybe<Array<Maybe<PointsUserSummary>>>;
};

export type HcwPointsEngineFilterInput = {
  and?: InputMaybe<Array<HcwPointsEngineFilterInput>>;
  ignored?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<HcwPointsEngineFilterInput>>;
  pointsLibrary?: InputMaybe<ListFilterInputTypeOfPointsLibraryFilterInput>;
  pointsUserSummary?: InputMaybe<ListFilterInputTypeOfPointsUserSummaryFilterInput>;
};

export type HcwPointsEngineInput = {
  ignored: Scalars['Boolean'];
  pointsLibrary?: InputMaybe<Array<InputMaybe<PointsLibraryInput>>>;
  pointsUserSummary?: InputMaybe<Array<InputMaybe<PointsUserSummaryInput>>>;
};

export type HcwPointsEngineSortInput = {
  ignored?: InputMaybe<SortEnumType>;
};

export type HcwSummary = {
  __typename?: 'HCWSummary';
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
  totalCaregiversAndChildrenWithIssues: Scalars['Int'];
  totalCaregiversAndChildrenWithUrgentIssues: Scalars['Int'];
  totalChildren: Scalars['Int'];
  totalClientsVisited: Scalars['Int'];
  totalFoldersOpened: Scalars['Int'];
  totalPregnantMoms: Scalars['Int'];
  totalPregnantMomsWithIssues: Scalars['Int'];
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
  clickedContactTab?: Maybe<Scalars['Boolean']>;
  clickedDashboardClientsTab?: Maybe<Scalars['Boolean']>;
  clickedDashboardHighlightsTab?: Maybe<Scalars['Boolean']>;
  clickedDashboardVisitsTab?: Maybe<Scalars['Boolean']>;
  clickedProgressTab?: Maybe<Scalars['Boolean']>;
  clickedReferralsTab?: Maybe<Scalars['Boolean']>;
  clickedVisitTab?: Maybe<Scalars['Boolean']>;
  consentForPhoto: Scalars['Boolean'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isRegistered: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  pointsEngineData?: Maybe<HcwPointsEngine>;
  teamLead?: Maybe<TeamLead>;
  teamLeadId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type HealthCareWorkerFilterInput = {
  and?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  clickedContactTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardClientsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardHighlightsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedDashboardVisitsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedProgressTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedReferralsTab?: InputMaybe<BooleanOperationFilterInput>;
  clickedVisitTab?: InputMaybe<BooleanOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  pointsEngineData?: InputMaybe<HcwPointsEngineFilterInput>;
  teamLead?: InputMaybe<TeamLeadFilterInput>;
  teamLeadId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type HealthCareWorkerInput = {
  ClickedContactTab?: InputMaybe<Scalars['Boolean']>;
  ClickedDashboardClientsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedDashboardHighlightsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedDashboardVisitsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedProgressTab?: InputMaybe<Scalars['Boolean']>;
  ClickedReferralsTab?: InputMaybe<Scalars['Boolean']>;
  ClickedVisitTab?: InputMaybe<Scalars['Boolean']>;
  ConsentForPhoto: Scalars['Boolean'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsRegistered: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  PointsEngineData?: InputMaybe<HcwPointsEngineInput>;
  TeamLead?: InputMaybe<TeamLeadInput>;
  TeamLeadId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type HealthCareWorkerModelInput = {
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

export type HealthCareWorkerSortInput = {
  clickedContactTab?: InputMaybe<SortEnumType>;
  clickedDashboardClientsTab?: InputMaybe<SortEnumType>;
  clickedDashboardHighlightsTab?: InputMaybe<SortEnumType>;
  clickedDashboardVisitsTab?: InputMaybe<SortEnumType>;
  clickedProgressTab?: InputMaybe<SortEnumType>;
  clickedReferralsTab?: InputMaybe<SortEnumType>;
  clickedVisitTab?: InputMaybe<SortEnumType>;
  consentForPhoto?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  isRegistered?: InputMaybe<SortEnumType>;
  language?: InputMaybe<LanguageSortInput>;
  languageId?: InputMaybe<SortEnumType>;
  pointsEngineData?: InputMaybe<HcwPointsEngineSortInput>;
  teamLead?: InputMaybe<TeamLeadSortInput>;
  teamLeadId?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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

export type IdentityRole = {
  __typename?: 'IdentityRole';
  concurrencyStamp?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type IntegrationLogInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LogNotes?: InputMaybe<Scalars['String']>;
  LogResult?: InputMaybe<Scalars['String']>;
  RelatedId?: InputMaybe<Scalars['String']>;
  RelatedType: LogRelatedType;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type KeyValuePairOfInt32AndInt32 = {
  __typename?: 'KeyValuePairOfInt32AndInt32';
  key: Scalars['Int'];
  value: Scalars['Int'];
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
};

export type LicenseFilterInput = {
  and?: InputMaybe<Array<LicenseFilterInput>>;
  collectedSSHandbook?: InputMaybe<BooleanOperationFilterInput>;
  collectedSSPlaykit?: InputMaybe<BooleanOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type LicenseInput = {
  CollectedSSHandbook?: InputMaybe<Scalars['Boolean']>;
  CollectedSSPlaykit?: InputMaybe<Scalars['Boolean']>;
  DelicensedComment?: InputMaybe<Scalars['String']>;
  DelicensedDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LicenseDate?: InputMaybe<Scalars['DateTime']>;
  LicenseType?: InputMaybe<LicenseTypeInput>;
  LicenseTypeId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type ListFilterInputTypeOfClubMeetingRegisterFilterInput = {
  all?: InputMaybe<ClubMeetingRegisterFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ClubMeetingRegisterFilterInput>;
  some?: InputMaybe<ClubMeetingRegisterFilterInput>;
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

export type ListFilterInputTypeOfPqaRatingChildFilterInput = {
  all?: InputMaybe<PqaRatingChildFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<PqaRatingChildFilterInput>;
  some?: InputMaybe<PqaRatingChildFilterInput>;
};

export type ListFilterInputTypeOfPointsLibraryFilterInput = {
  all?: InputMaybe<PointsLibraryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<PointsLibraryFilterInput>;
  some?: InputMaybe<PointsLibraryFilterInput>;
};

export type ListFilterInputTypeOfPointsUserSummaryFilterInput = {
  all?: InputMaybe<PointsUserSummaryFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<PointsUserSummaryFilterInput>;
  some?: InputMaybe<PointsUserSummaryFilterInput>;
};

export type ListFilterInputTypeOfPractitionerCoachCircleFilterInput = {
  all?: InputMaybe<PractitionerCoachCircleFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<PractitionerCoachCircleFilterInput>;
  some?: InputMaybe<PractitionerCoachCircleFilterInput>;
};

export type ListFilterInputTypeOfProgrammeFilterInput = {
  all?: InputMaybe<ProgrammeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ProgrammeFilterInput>;
  some?: InputMaybe<ProgrammeFilterInput>;
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

export type MessageLog = {
  __typename?: 'MessageLog';
  from?: Maybe<Scalars['String']>;
  fromUserId: Scalars['UUID'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  messageProtocol?: Maybe<Scalars['String']>;
  messageTemplate?: Maybe<MessageTemplate>;
  messageTemplateType?: Maybe<Scalars['String']>;
  sentByUserId: Scalars['UUID'];
  subject?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type MessageLogFilterInput = {
  and?: InputMaybe<Array<MessageLogFilterInput>>;
  from?: InputMaybe<StringOperationFilterInput>;
  fromUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  messageProtocol?: InputMaybe<StringOperationFilterInput>;
  messageTemplate?: InputMaybe<MessageTemplateFilterInput>;
  messageTemplateType?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MessageLogFilterInput>>;
  sentByUserId?: InputMaybe<ComparableGuidOperationFilterInput>;
  subject?: InputMaybe<StringOperationFilterInput>;
  to?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MessageLogInput = {
  From?: InputMaybe<Scalars['String']>;
  FromUserId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  MessageProtocol?: InputMaybe<Scalars['String']>;
  MessageTemplate?: InputMaybe<MessageTemplateInput>;
  MessageTemplateType?: InputMaybe<Scalars['String']>;
  SentByUserId: Scalars['UUID'];
  Subject?: InputMaybe<Scalars['String']>;
  To?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type MessageLogSortInput = {
  from?: InputMaybe<SortEnumType>;
  fromUserId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  messageProtocol?: InputMaybe<SortEnumType>;
  messageTemplate?: InputMaybe<MessageTemplateSortInput>;
  messageTemplateType?: InputMaybe<SortEnumType>;
  sentByUserId?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  to?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
};

export type MessageTemplate = {
  __typename?: 'MessageTemplate';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  templateType?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type MessageTemplateFilterInput = {
  and?: InputMaybe<Array<MessageTemplateFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  message?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<MessageTemplateFilterInput>>;
  protocol?: InputMaybe<StringOperationFilterInput>;
  subject?: InputMaybe<StringOperationFilterInput>;
  templateType?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MessageTemplateInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  Protocol?: InputMaybe<Scalars['String']>;
  Subject?: InputMaybe<Scalars['String']>;
  TemplateType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type MessageTemplateSortInput = {
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  message?: InputMaybe<SortEnumType>;
  protocol?: InputMaybe<SortEnumType>;
  subject?: InputMaybe<SortEnumType>;
  templateType?: InputMaybe<SortEnumType>;
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
  percentageAttendance: Scalars['Int'];
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  addAbsenteeForPractitioner?: Maybe<Absentees>;
  addAdditionalVisitForInfant?: Maybe<Visit>;
  addAdditionalVisitForMother?: Maybe<Visit>;
  addClinic?: Maybe<Clinic>;
  addCoachToFranchisor?: Maybe<Coach>;
  addCoachVisitInviteForPractitioner?: Maybe<Visit>;
  addCoachVisitInviteForTrainee?: Maybe<Visit>;
  addEventRecord?: Maybe<EventRecord>;
  addEventRecordType?: Maybe<EventRecordType>;
  addFollowUpVisitForPractitioner?: Maybe<Visit>;
  addHealthCareWorker?: Maybe<HealthCareWorker>;
  addInfant?: Maybe<Infant>;
  addMother?: Maybe<Mother>;
  addPQARatingVisitForPractitioner?: Maybe<Visit>;
  addPermissionsToNavigation: Scalars['Boolean'];
  addPermissionsToRole: Scalars['Boolean'];
  addPractitionerToCoach?: Maybe<Practitioner>;
  addPractitionerToPrincipal?: Maybe<Practitioner>;
  addReAccreditationFollowUpVisitForPractitioner?: Maybe<Visit>;
  addReAccreditationVisitForPractitioner?: Maybe<Visit>;
  addReassignmentForPractitionerService: Scalars['Boolean'];
  addRole?: Maybe<IdentityRole>;
  addSSChecklistForTrainee?: Maybe<Visit>;
  addSelfAssessmentForPractitioner?: Maybe<Visit>;
  addStartupSupportAgreementForTrainee?: Maybe<Visit>;
  addSupportVisitForPractitioner?: Maybe<Visit>;
  addTeamLead?: Maybe<TeamLead>;
  addUser?: Maybe<ApplicationUser>;
  addUsersToRole: Scalars['Boolean'];
  addVisitBackReferral?: Maybe<VisitBackReferral>;
  addVisitData: Scalars['Boolean'];
  autoSubmitStatement?: Maybe<ResultReturnObject>;
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
  createClub?: Maybe<Club>;
  createClubMeeting?: Maybe<ClubMeeting>;
  createClubMeetingRegister?: Maybe<ClubMeetingRegister>;
  createCoach?: Maybe<Coach>;
  createCommunitySectionGG?: Maybe<Scalars['String']>;
  createCommunitySectionItemGG?: Maybe<Scalars['String']>;
  createCommunitySectionItemSS?: Maybe<Scalars['String']>;
  createCommunitySectionSS?: Maybe<Scalars['String']>;
  createConsent?: Maybe<Scalars['String']>;
  createConsentGG?: Maybe<Scalars['String']>;
  createContentDefinition?: Maybe<ContentDefinitionModel>;
  createDailyProgramme?: Maybe<DailyProgramme>;
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
  createLearner?: Maybe<Learner>;
  createLicense?: Maybe<License>;
  createLicenseType?: Maybe<LicenseType>;
  createMessageLog?: Maybe<MessageLog>;
  createMessageTemplate?: Maybe<MessageTemplate>;
  createMoreInformation?: Maybe<Scalars['String']>;
  createMother?: Maybe<Mother>;
  createNavigation?: Maybe<Navigation>;
  createNote?: Maybe<Note>;
  createNoteType?: Maybe<NoteType>;
  createPQA?: Maybe<Pqa>;
  createPermission?: Maybe<Permission>;
  createPointsLibrary?: Maybe<PointsLibrary>;
  createPointsUser?: Maybe<PointsUser>;
  createPointsUserSummary?: Maybe<PointsUserSummary>;
  createPractitioner?: Maybe<Practitioner>;
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
  createRelation?: Maybe<Relation>;
  createServiceScheduler?: Maybe<ServiceScheduler>;
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
  deleteClub?: Maybe<Scalars['Boolean']>;
  deleteClubMeeting?: Maybe<Scalars['Boolean']>;
  deleteClubMeetingRegister?: Maybe<Scalars['Boolean']>;
  deleteCoach?: Maybe<Scalars['Boolean']>;
  deleteCoachForFranchisor?: Maybe<Coach>;
  deleteCommunitySectionGG?: Maybe<Scalars['Boolean']>;
  deleteCommunitySectionItemGG?: Maybe<Scalars['Boolean']>;
  deleteCommunitySectionItemSS?: Maybe<Scalars['Boolean']>;
  deleteCommunitySectionSS?: Maybe<Scalars['Boolean']>;
  deleteConsent?: Maybe<Scalars['Boolean']>;
  deleteConsentGG?: Maybe<Scalars['Boolean']>;
  deleteContentDefinition: Scalars['Boolean'];
  deleteDailyProgramme?: Maybe<Scalars['Boolean']>;
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
  deleteLearner?: Maybe<Scalars['Boolean']>;
  deleteLicense?: Maybe<Scalars['Boolean']>;
  deleteLicenseType?: Maybe<Scalars['Boolean']>;
  deleteMessageLog?: Maybe<Scalars['Boolean']>;
  deleteMessageTemplate?: Maybe<Scalars['Boolean']>;
  deleteMoreInformation?: Maybe<Scalars['Boolean']>;
  deleteMother?: Maybe<Scalars['Boolean']>;
  deleteNavigation?: Maybe<Scalars['Boolean']>;
  deleteNote?: Maybe<Scalars['Boolean']>;
  deleteNoteType?: Maybe<Scalars['Boolean']>;
  deletePQA?: Maybe<Scalars['Boolean']>;
  deletePermission?: Maybe<Scalars['Boolean']>;
  deletePointsLibrary?: Maybe<Scalars['Boolean']>;
  deletePointsUser?: Maybe<Scalars['Boolean']>;
  deletePointsUserSummary?: Maybe<Scalars['Boolean']>;
  deletePractitioner?: Maybe<Scalars['Boolean']>;
  deletePractitionerForCoach?: Maybe<Practitioner>;
  deletePractitionerFromPrincipal?: Maybe<Practitioner>;
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
  deleteRelation?: Maybe<Scalars['Boolean']>;
  deleteRole: Scalars['Boolean'];
  deleteServiceScheduler?: Maybe<Scalars['Boolean']>;
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
  editVisitData: Scalars['Boolean'];
  expireRelationshipLinksService: Scalars['Boolean'];
  fileUpload?: Maybe<DocumentModel>;
  generateCaregiverChildToken?: Maybe<Scalars['String']>;
  importHealthCareWorkers?: Maybe<UserImportModel>;
  importTeamLeads?: Maybe<UserImportModel>;
  integrationAttendanceData: Scalars['Boolean'];
  integrationByFranchisees: Scalars['Boolean'];
  integrationByMappedCoach: Scalars['Boolean'];
  integrationByTrainees: Scalars['Boolean'];
  integrationClubsData: Scalars['Boolean'];
  integrationPQASmartSpaceVisitsData: Scalars['Boolean'];
  integrationStatementsData: Scalars['Boolean'];
  integrationUpdates: Scalars['Boolean'];
  openAccessAddChild: Scalars['Boolean'];
  promotePractitionerToPrincipal?: Maybe<Principal>;
  reassignAbsenteeFromHistory: Scalars['Boolean'];
  reassignAllClassroomsFromHistoryService: Scalars['Boolean'];
  reassignClassroomsFromHistoryService: Scalars['Boolean'];
  refreshCaregiverChildToken?: Maybe<Scalars['String']>;
  remapPrincipalToPrincipal?: Maybe<Practitioner>;
  removePermissionsFromNavigation: Scalars['Boolean'];
  removePermissionsFromRole: Scalars['Boolean'];
  removePractitioner: Scalars['Boolean'];
  removeUserFromRoles: Scalars['Boolean'];
  resetUserPassword: Scalars['Boolean'];
  saveIncomeStatementPDF?: Maybe<Document>;
  scheduleConsolidationMeetingDate?: Maybe<Trainee>;
  sendBulkInviteToApp?: Maybe<BulkInvitationResult>;
  sendBulkInviteToPortal?: Maybe<BulkInvitationResult>;
  sendCoachInviteToApplication: Scalars['Boolean'];
  sendInviteToApplication: Scalars['Boolean'];
  sendPractitionerInviteToApplication: Scalars['Boolean'];
  submitStatement?: Maybe<ResultReturnObject>;
  switchPrincipal?: Maybe<Practitioner>;
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
  updateClinic?: Maybe<Clinic>;
  updateClub?: Maybe<Club>;
  updateClubMeeting?: Maybe<ClubMeeting>;
  updateClubMeetingRegister?: Maybe<ClubMeetingRegister>;
  updateCoach?: Maybe<Coach>;
  updateCommunitySectionGG?: Maybe<CommunitySectionGg>;
  updateCommunitySectionItemGG?: Maybe<CommunitySectionItemGg>;
  updateCommunitySectionItemSS?: Maybe<CommunitySectionItemSs>;
  updateCommunitySectionSS?: Maybe<CommunitySectionSs>;
  updateCommunitySupport?: Maybe<Trainee>;
  updateConsent?: Maybe<Consent>;
  updateConsentGG?: Maybe<ConsentGg>;
  updateDailyProgramme?: Maybe<DailyProgramme>;
  updateDocument?: Maybe<Document>;
  updateDocumentType?: Maybe<DocumentType>;
  updateEducation?: Maybe<Education>;
  updateEventRecord?: Maybe<EventRecord>;
  updateEventRecordType?: Maybe<EventRecordType>;
  updateExpense?: Maybe<ResultReturnObject>;
  updateFranchisor?: Maybe<Franchisor>;
  updateGender?: Maybe<Gender>;
  updateGrant?: Maybe<Grant>;
  updateHealthCareWorker?: Maybe<HealthCareWorker>;
  updateHealthCareWorkerTabs?: Maybe<HealthCareWorker>;
  updateHealthPromotion?: Maybe<HealthPromotion>;
  updateHierarchyEntity?: Maybe<HierarchyEntity>;
  updateIncome?: Maybe<ResultReturnObject>;
  updateIncomeStatements?: Maybe<IncomeStatements>;
  updateInfant?: Maybe<Infant>;
  updateInfantAdditionalDueDates: Scalars['Boolean'];
  updateInfantCaregiver?: Maybe<Infant>;
  updateInfantCaregiverAddress?: Maybe<Infant>;
  updateInfantCaregiverContactDetails?: Maybe<Infant>;
  updateInfantDueDates: Scalars['Boolean'];
  updateInfographics?: Maybe<Infographics>;
  updateIntegrationAudit?: Maybe<IntegrationAudit>;
  updateIntegrationColumnMapping?: Maybe<IntegrationColumnMapping>;
  updateIntegrationEntityMapping?: Maybe<IntegrationEntityMapping>;
  updateIntegrationLog?: Maybe<IntegrationLog>;
  updateLanguage?: Maybe<Language>;
  updateLearner?: Maybe<Learner>;
  updateLicense?: Maybe<License>;
  updateLicenseType?: Maybe<LicenseType>;
  updateMessageLog?: Maybe<MessageLog>;
  updateMessageTemplate?: Maybe<MessageTemplate>;
  updateMoreInformation?: Maybe<MoreInformation>;
  updateMother?: Maybe<Mother>;
  updateMotherAdditionalDueDates: Scalars['Boolean'];
  updateMotherAddress?: Maybe<Mother>;
  updateMotherContactDetails?: Maybe<Mother>;
  updateMotherDeliveryDate?: Maybe<Mother>;
  updateMotherDueDates: Scalars['Boolean'];
  updateNavigation?: Maybe<Navigation>;
  updateNote?: Maybe<Note>;
  updateNoteType?: Maybe<NoteType>;
  updatePQA?: Maybe<Pqa>;
  updatePermission?: Maybe<Permission>;
  updatePointsLibrary?: Maybe<PointsLibrary>;
  updatePointsUser?: Maybe<PointsUser>;
  updatePointsUserSummary?: Maybe<PointsUserSummary>;
  updatePractitioner?: Maybe<Practitioner>;
  updatePractitionerContactInfo?: Maybe<ApplicationUser>;
  updatePractitionerEmergencyContact: Scalars['Boolean'];
  updatePractitionerIsFundaAppAdmin: Scalars['Boolean'];
  updatePractitionerProgress: Scalars['Decimal'];
  updatePractitionerRegistered: Scalars['Boolean'];
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
  updateProgressTrackingCategory?: Maybe<ProgressTrackingCategory>;
  updateProgressTrackingLevel?: Maybe<ProgressTrackingLevel>;
  updateProgressTrackingSkill?: Maybe<ProgressTrackingSkill>;
  updateProgressTrackingSubCategory?: Maybe<ProgressTrackingSubCategory>;
  updateProvince?: Maybe<Province>;
  updateRace?: Maybe<Race>;
  updateReasonForLeaving?: Maybe<ReasonForLeaving>;
  updateReasonForPractitionerLeaving?: Maybe<ReasonForPractitionerLeaving>;
  updateRelation?: Maybe<Relation>;
  updateRole?: Maybe<IdentityRole>;
  updateServiceScheduler?: Maybe<ServiceScheduler>;
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
  updateStoryBookPartQuestion?: Maybe<StoryBookPartQuestion>;
  updateStoryBookParts?: Maybe<StoryBookParts>;
  updateSystemSetting?: Maybe<SystemSetting>;
  updateTeamLead?: Maybe<TeamLead>;
  updateTenantTheme: Scalars['Boolean'];
  updateTheme?: Maybe<Theme>;
  updateThemeDay?: Maybe<ThemeDay>;
  updateTrainee?: Maybe<Trainee>;
  updateUser?: Maybe<ApplicationUser>;
  updateUserConsent?: Maybe<UserConsent>;
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
  validateDefaultVisitsForPractitioner: Scalars['Boolean'];
};

export type MutationAddAbsenteeForPractitionerArgs = {
  absentDate: Scalars['DateTime'];
  classProgram?: InputMaybe<Scalars['String']>;
  loggedByUser?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  reassignedToPractitioner?: InputMaybe<Scalars['String']>;
};

export type MutationAddAdditionalVisitForInfantArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddAdditionalVisitForMotherArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddClinicArgs = {
  input?: InputMaybe<ClinicModelInput>;
};

export type MutationAddCoachToFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
};

export type MutationAddCoachVisitInviteForPractitionerArgs = {
  input?: InputMaybe<VisitModelInput>;
};

export type MutationAddCoachVisitInviteForTraineeArgs = {
  input?: InputMaybe<SsChecklistVisitModelInput>;
};

export type MutationAddEventRecordArgs = {
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationAddEventRecordTypeArgs = {
  input?: InputMaybe<EventRecordTypeModelInput>;
};

export type MutationAddFollowUpVisitForPractitionerArgs = {
  input?: InputMaybe<FollowUpVisitModelInput>;
};

export type MutationAddHealthCareWorkerArgs = {
  input?: InputMaybe<HealthCareWorkerModelInput>;
};

export type MutationAddInfantArgs = {
  input?: InputMaybe<InfantModelInput>;
};

export type MutationAddMotherArgs = {
  input?: InputMaybe<MotherModelInput>;
};

export type MutationAddPqaRatingVisitForPractitionerArgs = {
  ratingColor?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
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

export type MutationAddStartupSupportAgreementForTraineeArgs = {
  input?: InputMaybe<SupportVisitModelInput>;
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

export type MutationCreateClubArgs = {
  input?: InputMaybe<ClubInput>;
};

export type MutationCreateClubMeetingArgs = {
  input?: InputMaybe<ClubMeetingInput>;
};

export type MutationCreateClubMeetingRegisterArgs = {
  input?: InputMaybe<ClubMeetingRegisterInput>;
};

export type MutationCreateCoachArgs = {
  input?: InputMaybe<CoachInput>;
};

export type MutationCreateCommunitySectionGgArgs = {
  input: CommunitySectionGgInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateCommunitySectionItemGgArgs = {
  input: CommunitySectionItemGgInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateCommunitySectionItemSsArgs = {
  input: CommunitySectionItemSsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateCommunitySectionSsArgs = {
  input: CommunitySectionSsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateConsentArgs = {
  input: ConsentInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationCreateConsentGgArgs = {
  input: ConsentGgInput;
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

export type MutationCreateLearnerArgs = {
  input?: InputMaybe<LearnerInput>;
};

export type MutationCreateLicenseArgs = {
  input?: InputMaybe<LicenseInput>;
};

export type MutationCreateLicenseTypeArgs = {
  input?: InputMaybe<LicenseTypeInput>;
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

export type MutationCreateRelationArgs = {
  input?: InputMaybe<RelationInput>;
};

export type MutationCreateServiceSchedulerArgs = {
  input?: InputMaybe<ServiceSchedulerInput>;
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

export type MutationDeleteClubArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubMeetingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClubMeetingRegisterArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachForFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCommunitySectionGgArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCommunitySectionItemGgArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCommunitySectionItemSsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteCommunitySectionSsArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteConsentArgs = {
  id: Scalars['String'];
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteConsentGgArgs = {
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

export type MutationDeleteLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLicenseArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLicenseTypeArgs = {
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

export type MutationDeleteRelationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteRoleArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteServiceSchedulerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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

export type MutationEditVisitDataArgs = {
  input?: InputMaybe<CmsVisitDataInputModelInput>;
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

export type MutationImportHealthCareWorkersArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationImportTeamLeadsArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationOpenAccessAddChildArgs = {
  caregiver?: InputMaybe<AddChildCaregiverTokenModelInput>;
  child?: InputMaybe<AddChildTokenModelInput>;
  learner?: InputMaybe<AddChildLearnerTokenModelInput>;
  siteAddress?: InputMaybe<AddChildSiteAddressTokenModelInput>;
  token?: InputMaybe<Scalars['String']>;
};

export type MutationPromotePractitionerToPrincipalArgs = {
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
  practitionerId?: InputMaybe<Scalars['String']>;
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

export type MutationSaveIncomeStatementPdfArgs = {
  input?: InputMaybe<PdfDocumentModelInput>;
};

export type MutationScheduleConsolidationMeetingDateArgs = {
  scheduledDate?: InputMaybe<Scalars['DateTime']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendBulkInviteToAppArgs = {
  userIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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

export type MutationSendPractitionerInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSubmitStatementArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<StatementsSubmitInput>;
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

export type MutationUpdateClinicArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClinicInput>;
};

export type MutationUpdateClubArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubInput>;
};

export type MutationUpdateClubMeetingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubMeetingInput>;
};

export type MutationUpdateClubMeetingRegisterArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClubMeetingRegisterInput>;
};

export type MutationUpdateCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<CoachInput>;
};

export type MutationUpdateCommunitySectionGgArgs = {
  id: Scalars['String'];
  input: CommunitySectionGgInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunitySectionItemGgArgs = {
  id: Scalars['String'];
  input: CommunitySectionItemGgInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunitySectionItemSsArgs = {
  id: Scalars['String'];
  input: CommunitySectionItemSsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunitySectionSsArgs = {
  id: Scalars['String'];
  input: CommunitySectionSsInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateCommunitySupportArgs = {
  haveCommunitySupport?: InputMaybe<Scalars['Boolean']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConsentArgs = {
  id: Scalars['String'];
  input: ConsentInput;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateConsentGgArgs = {
  id: Scalars['String'];
  input: ConsentGgInput;
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

export type MutationUpdateEventRecordArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationUpdateEventRecordTypeArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordTypeModelInput>;
};

export type MutationUpdateExpenseArgs = {
  id?: InputMaybe<Scalars['String']>;
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
  input?: InputMaybe<HealthCareWorkerModelInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateHealthCareWorkerTabsArgs = {
  input?: InputMaybe<HealthCareWorkerModelInput>;
  userId?: InputMaybe<Scalars['String']>;
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
  id?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateRelationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<RelationInput>;
};

export type MutationUpdateRoleArgs = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  normalizedName?: InputMaybe<Scalars['String']>;
};

export type MutationUpdateServiceSchedulerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ServiceSchedulerInput>;
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
  id?: InputMaybe<Scalars['String']>;
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

export type MutationUpdateUserArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<UserModelInput>;
};

export type MutationUpdateUserConsentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<UserConsentInput>;
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

export type MutationValidateDefaultVisitsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
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
  createdUserId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  noteType?: Maybe<NoteType>;
  noteTypeId: Scalars['UUID'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type NoteFilterInput = {
  and?: InputMaybe<Array<NoteFilterInput>>;
  bodyText?: InputMaybe<StringOperationFilterInput>;
  createdUserId?: InputMaybe<StringOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type NoteInput = {
  BodyText?: InputMaybe<Scalars['String']>;
  CreatedUserId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NoteType?: InputMaybe<NoteTypeInput>;
  NoteTypeId: Scalars['UUID'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type NotificationDisplay = {
  __typename?: 'NotificationDisplay';
  color?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  userId: Scalars['UUID'];
  userType?: Maybe<Scalars['String']>;
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
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  children?: Maybe<Array<Maybe<PqaRatingChild>>>;
  overallRating?: Maybe<Scalars['String']>;
  overallRatingColor?: Maybe<Scalars['String']>;
  overallRatingStars?: Maybe<Scalars['String']>;
  overallScore: Scalars['Float'];
  plannedDate?: Maybe<Scalars['DateTime']>;
  visitName?: Maybe<Scalars['String']>;
};

export type PqaRatingChild = {
  __typename?: 'PQARatingChild';
  sectionRating?: Maybe<Scalars['String']>;
  sectionRatingColor?: Maybe<Scalars['String']>;
  sectionScore: Scalars['Float'];
  visitSection?: Maybe<Scalars['String']>;
};

export type PqaRatingChildFilterInput = {
  and?: InputMaybe<Array<PqaRatingChildFilterInput>>;
  or?: InputMaybe<Array<PqaRatingChildFilterInput>>;
  sectionRating?: InputMaybe<StringOperationFilterInput>;
  sectionRatingColor?: InputMaybe<StringOperationFilterInput>;
  sectionScore?: InputMaybe<ComparableDoubleOperationFilterInput>;
  visitSection?: InputMaybe<StringOperationFilterInput>;
};

export type PqaRatingChildInput = {
  sectionRating?: InputMaybe<Scalars['String']>;
  sectionRatingColor?: InputMaybe<Scalars['String']>;
  sectionScore: Scalars['Float'];
  visitSection?: InputMaybe<Scalars['String']>;
};

export type PqaRatingFilterInput = {
  actualVisitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  and?: InputMaybe<Array<PqaRatingFilterInput>>;
  children?: InputMaybe<ListFilterInputTypeOfPqaRatingChildFilterInput>;
  or?: InputMaybe<Array<PqaRatingFilterInput>>;
  overallRating?: InputMaybe<StringOperationFilterInput>;
  overallRatingColor?: InputMaybe<StringOperationFilterInput>;
  overallRatingStars?: InputMaybe<StringOperationFilterInput>;
  overallScore?: InputMaybe<ComparableDoubleOperationFilterInput>;
  plannedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  visitName?: InputMaybe<StringOperationFilterInput>;
};

export type PqaRatingInput = {
  actualVisitDate?: InputMaybe<Scalars['DateTime']>;
  children?: InputMaybe<Array<InputMaybe<PqaRatingChildInput>>>;
  overallRating?: InputMaybe<Scalars['String']>;
  overallRatingColor?: InputMaybe<Scalars['String']>;
  overallRatingStars?: InputMaybe<Scalars['String']>;
  overallScore: Scalars['Float'];
  plannedDate?: InputMaybe<Scalars['DateTime']>;
  visitName?: InputMaybe<Scalars['String']>;
};

export type PqaRatingSortInput = {
  actualVisitDate?: InputMaybe<SortEnumType>;
  overallRating?: InputMaybe<SortEnumType>;
  overallRatingColor?: InputMaybe<SortEnumType>;
  overallRatingStars?: InputMaybe<SortEnumType>;
  overallScore?: InputMaybe<SortEnumType>;
  plannedDate?: InputMaybe<SortEnumType>;
  visitName?: InputMaybe<SortEnumType>;
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

export type PdfDocumentModelInput = {
  createdUserId?: InputMaybe<Scalars['String']>;
  fileName?: InputMaybe<Scalars['String']>;
  reference?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
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
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
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
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
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
  stipendType?: Maybe<Scalars['String']>;
  timeline?: Maybe<PractitionerTimeline>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type PractitionerFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PractitionerClassroomName = {
  __typename?: 'PractitionerClassroomName';
  classRoomId: Scalars['UUID'];
  classroomGroupId: Scalars['UUID'];
  classroomName?: Maybe<Scalars['String']>;
  coachName?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
};

export type PractitionerCoachCircle = {
  __typename?: 'PractitionerCoachCircle';
  meetingDate?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
};

export type PractitionerCoachCircleFilterInput = {
  and?: InputMaybe<Array<PractitionerCoachCircleFilterInput>>;
  meetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<PractitionerCoachCircleFilterInput>>;
};

export type PractitionerCoachCircleInput = {
  meetingDate?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
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
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  stipendType?: InputMaybe<StringOperationFilterInput>;
  timeline?: InputMaybe<PractitionerTimelineFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
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
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  StipendType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UsePhotoInReport?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  timeline?: InputMaybe<PractitionerTimelineInput>;
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

export type PractitionerNotes = {
  __typename?: 'PractitionerNotes';
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  answers?: Maybe<Array<Maybe<VisitData>>>;
  plannedVisitDate?: Maybe<Scalars['DateTime']>;
  visitName?: Maybe<Scalars['String']>;
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
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  stipendType?: InputMaybe<SortEnumType>;
  timeline?: InputMaybe<PractitionerTimelineSortInput>;
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
  clubMeetings?: Maybe<Array<Maybe<ClubMeetingRegister>>>;
  coachCircles?: Maybe<Array<Maybe<PractitionerCoachCircle>>>;
  consolidationMeetingColor?: Maybe<Scalars['String']>;
  consolidationMeetingDate?: Maybe<Scalars['DateTime']>;
  consolidationMeetingStatus?: Maybe<Scalars['String']>;
  firstAidCourseColor?: Maybe<Scalars['String']>;
  firstAidCourseStatus?: Maybe<Scalars['String']>;
  firstAidDate?: Maybe<Scalars['DateTime']>;
  pQARating1?: Maybe<PqaRating>;
  pQARating2?: Maybe<PqaRating>;
  pQARating3?: Maybe<PqaRating>;
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
  reAccreditationVisits?: Maybe<Array<Maybe<Visit>>>;
  requestedCoachVisits?: Maybe<Array<Maybe<Visit>>>;
  selfAssessmentColor?: Maybe<Scalars['String']>;
  selfAssessmentDate?: Maybe<Scalars['DateTime']>;
  selfAssessmentStatus?: Maybe<Scalars['String']>;
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

export type PractitionerTimelineFilterInput = {
  and?: InputMaybe<Array<PractitionerTimelineFilterInput>>;
  childProgressTrainingColor?: InputMaybe<StringOperationFilterInput>;
  childProgressTrainingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  childProgressTrainingStatus?: InputMaybe<StringOperationFilterInput>;
  clubMeetings?: InputMaybe<ListFilterInputTypeOfClubMeetingRegisterFilterInput>;
  coachCircles?: InputMaybe<ListFilterInputTypeOfPractitionerCoachCircleFilterInput>;
  consolidationMeetingColor?: InputMaybe<StringOperationFilterInput>;
  consolidationMeetingDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  consolidationMeetingStatus?: InputMaybe<StringOperationFilterInput>;
  firstAidCourseColor?: InputMaybe<StringOperationFilterInput>;
  firstAidCourseStatus?: InputMaybe<StringOperationFilterInput>;
  firstAidDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  or?: InputMaybe<Array<PractitionerTimelineFilterInput>>;
  pQARating1?: InputMaybe<PqaRatingFilterInput>;
  pQARating2?: InputMaybe<PqaRatingFilterInput>;
  pQARating3?: InputMaybe<PqaRatingFilterInput>;
  pQASiteVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  practiceLicenseColor?: InputMaybe<StringOperationFilterInput>;
  practiceLicenseDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  practiceLicenseStatus?: InputMaybe<StringOperationFilterInput>;
  prePQASiteVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  prePQAVisitDate1?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  prePQAVisitDate1Color?: InputMaybe<StringOperationFilterInput>;
  prePQAVisitDate1Status?: InputMaybe<StringOperationFilterInput>;
  prePQAVisitDate2?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  prePQAVisitDate2Color?: InputMaybe<StringOperationFilterInput>;
  prePQAVisitDate2Status?: InputMaybe<StringOperationFilterInput>;
  reAccreditationRating1?: InputMaybe<PqaRatingFilterInput>;
  reAccreditationRating2?: InputMaybe<PqaRatingFilterInput>;
  reAccreditationRating3?: InputMaybe<PqaRatingFilterInput>;
  reAccreditationVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  requestedCoachVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
  selfAssessmentColor?: InputMaybe<StringOperationFilterInput>;
  selfAssessmentDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  selfAssessmentStatus?: InputMaybe<StringOperationFilterInput>;
  smartSpaceLicenseColor?: InputMaybe<StringOperationFilterInput>;
  smartSpaceLicenseDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  smartSpaceLicenseStatus?: InputMaybe<StringOperationFilterInput>;
  smartStarterUniteConferenceColor?: InputMaybe<StringOperationFilterInput>;
  smartStarterUniteConferenceDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  smartStarterUniteConferenceStatus?: InputMaybe<StringOperationFilterInput>;
  starterLicenseColor?: InputMaybe<StringOperationFilterInput>;
  starterLicenseDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  starterLicenseStatus?: InputMaybe<StringOperationFilterInput>;
  supportVisits?: InputMaybe<ListFilterInputTypeOfVisitFilterInput>;
};

export type PractitionerTimelineInput = {
  childProgressTrainingColor?: InputMaybe<Scalars['String']>;
  childProgressTrainingDate?: InputMaybe<Scalars['DateTime']>;
  childProgressTrainingStatus?: InputMaybe<Scalars['String']>;
  clubMeetings?: InputMaybe<Array<InputMaybe<ClubMeetingRegisterInput>>>;
  coachCircles?: InputMaybe<Array<InputMaybe<PractitionerCoachCircleInput>>>;
  consolidationMeetingColor?: InputMaybe<Scalars['String']>;
  consolidationMeetingDate?: InputMaybe<Scalars['DateTime']>;
  consolidationMeetingStatus?: InputMaybe<Scalars['String']>;
  firstAidCourseColor?: InputMaybe<Scalars['String']>;
  firstAidCourseStatus?: InputMaybe<Scalars['String']>;
  firstAidDate?: InputMaybe<Scalars['DateTime']>;
  pQARating1?: InputMaybe<PqaRatingInput>;
  pQARating2?: InputMaybe<PqaRatingInput>;
  pQARating3?: InputMaybe<PqaRatingInput>;
  pQASiteVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  practiceLicenseColor?: InputMaybe<Scalars['String']>;
  practiceLicenseDate?: InputMaybe<Scalars['DateTime']>;
  practiceLicenseStatus?: InputMaybe<Scalars['String']>;
  prePQASiteVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  prePQAVisitDate1?: InputMaybe<Scalars['DateTime']>;
  prePQAVisitDate1Color?: InputMaybe<Scalars['String']>;
  prePQAVisitDate1Status?: InputMaybe<Scalars['String']>;
  prePQAVisitDate2?: InputMaybe<Scalars['DateTime']>;
  prePQAVisitDate2Color?: InputMaybe<Scalars['String']>;
  prePQAVisitDate2Status?: InputMaybe<Scalars['String']>;
  reAccreditationRating1?: InputMaybe<PqaRatingInput>;
  reAccreditationRating2?: InputMaybe<PqaRatingInput>;
  reAccreditationRating3?: InputMaybe<PqaRatingInput>;
  reAccreditationVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  requestedCoachVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
  selfAssessmentColor?: InputMaybe<Scalars['String']>;
  selfAssessmentDate?: InputMaybe<Scalars['DateTime']>;
  selfAssessmentStatus?: InputMaybe<Scalars['String']>;
  smartSpaceLicenseColor?: InputMaybe<Scalars['String']>;
  smartSpaceLicenseDate?: InputMaybe<Scalars['DateTime']>;
  smartSpaceLicenseStatus?: InputMaybe<Scalars['String']>;
  smartStarterUniteConferenceColor?: InputMaybe<Scalars['String']>;
  smartStarterUniteConferenceDate?: InputMaybe<Scalars['DateTime']>;
  smartStarterUniteConferenceStatus?: InputMaybe<Scalars['String']>;
  starterLicenseColor?: InputMaybe<Scalars['String']>;
  starterLicenseDate?: InputMaybe<Scalars['DateTime']>;
  starterLicenseStatus?: InputMaybe<Scalars['String']>;
  supportVisits?: InputMaybe<Array<InputMaybe<VisitInput>>>;
};

export type PractitionerTimelineSortInput = {
  childProgressTrainingColor?: InputMaybe<SortEnumType>;
  childProgressTrainingDate?: InputMaybe<SortEnumType>;
  childProgressTrainingStatus?: InputMaybe<SortEnumType>;
  consolidationMeetingColor?: InputMaybe<SortEnumType>;
  consolidationMeetingDate?: InputMaybe<SortEnumType>;
  consolidationMeetingStatus?: InputMaybe<SortEnumType>;
  firstAidCourseColor?: InputMaybe<SortEnumType>;
  firstAidCourseStatus?: InputMaybe<SortEnumType>;
  firstAidDate?: InputMaybe<SortEnumType>;
  pQARating1?: InputMaybe<PqaRatingSortInput>;
  pQARating2?: InputMaybe<PqaRatingSortInput>;
  pQARating3?: InputMaybe<PqaRatingSortInput>;
  practiceLicenseColor?: InputMaybe<SortEnumType>;
  practiceLicenseDate?: InputMaybe<SortEnumType>;
  practiceLicenseStatus?: InputMaybe<SortEnumType>;
  prePQAVisitDate1?: InputMaybe<SortEnumType>;
  prePQAVisitDate1Color?: InputMaybe<SortEnumType>;
  prePQAVisitDate1Status?: InputMaybe<SortEnumType>;
  prePQAVisitDate2?: InputMaybe<SortEnumType>;
  prePQAVisitDate2Color?: InputMaybe<SortEnumType>;
  prePQAVisitDate2Status?: InputMaybe<SortEnumType>;
  reAccreditationRating1?: InputMaybe<PqaRatingSortInput>;
  reAccreditationRating2?: InputMaybe<PqaRatingSortInput>;
  reAccreditationRating3?: InputMaybe<PqaRatingSortInput>;
  selfAssessmentColor?: InputMaybe<SortEnumType>;
  selfAssessmentDate?: InputMaybe<SortEnumType>;
  selfAssessmentStatus?: InputMaybe<SortEnumType>;
  smartSpaceLicenseColor?: InputMaybe<SortEnumType>;
  smartSpaceLicenseDate?: InputMaybe<SortEnumType>;
  smartSpaceLicenseStatus?: InputMaybe<SortEnumType>;
  smartStarterUniteConferenceColor?: InputMaybe<SortEnumType>;
  smartStarterUniteConferenceDate?: InputMaybe<SortEnumType>;
  smartStarterUniteConferenceStatus?: InputMaybe<SortEnumType>;
  starterLicenseColor?: InputMaybe<SortEnumType>;
  starterLicenseDate?: InputMaybe<SortEnumType>;
  starterLicenseStatus?: InputMaybe<SortEnumType>;
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
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
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
  stipendType?: Maybe<Scalars['String']>;
  timeline?: Maybe<PractitionerTimeline>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  usePhotoInReport?: Maybe<Scalars['String']>;
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type PrincipalFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PrincipalClassroom = {
  __typename?: 'PrincipalClassroom';
  classSiteAddress?: Maybe<Scalars['String']>;
  classroomGroupId?: Maybe<Scalars['String']>;
  classroomGroupName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  name?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
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
  principal?: InputMaybe<PractitionerFilterInput>;
  principalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  stipendType?: InputMaybe<StringOperationFilterInput>;
  timeline?: InputMaybe<PractitionerTimelineFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  usePhotoInReport?: InputMaybe<StringOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
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
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  StipendType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UsePhotoInReport?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  timeline?: InputMaybe<PractitionerTimelineInput>;
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
  shareInfo?: InputMaybe<SortEnumType>;
  signingSignature?: InputMaybe<SortEnumType>;
  siteAddress?: InputMaybe<SiteAddressSortInput>;
  siteAddressId?: InputMaybe<SortEnumType>;
  startDate?: InputMaybe<SortEnumType>;
  stipendType?: InputMaybe<SortEnumType>;
  timeline?: InputMaybe<PractitionerTimelineSortInput>;
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
  classroomGroupId: Scalars['UUID'];
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
  name?: Maybe<Scalars['String']>;
};

export type ProgressTrackingLevelInput = {
  description?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
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
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  skills?: Maybe<Array<Maybe<ProgressTrackingSkill>>>;
};

export type ProgressTrackingSubCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
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
  GetAllClub?: Maybe<Array<Maybe<Club>>>;
  GetAllClubMeeting?: Maybe<Array<Maybe<ClubMeeting>>>;
  GetAllClubMeetingRegister?: Maybe<Array<Maybe<ClubMeetingRegister>>>;
  GetAllCoach?: Maybe<Array<Maybe<Coach>>>;
  GetAllCommunitySectionGG: Array<Maybe<CommunitySectionGg>>;
  GetAllCommunitySectionItemGG: Array<Maybe<CommunitySectionItemGg>>;
  GetAllCommunitySectionItemSS: Array<Maybe<CommunitySectionItemSs>>;
  GetAllCommunitySectionSS: Array<Maybe<CommunitySectionSs>>;
  GetAllConsent: Array<Maybe<Consent>>;
  GetAllConsentGG: Array<Maybe<ConsentGg>>;
  GetAllDailyProgramme?: Maybe<Array<Maybe<DailyProgramme>>>;
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
  GetAllLearner?: Maybe<Array<Maybe<Learner>>>;
  GetAllLicense?: Maybe<Array<Maybe<License>>>;
  GetAllLicenseType?: Maybe<Array<Maybe<LicenseType>>>;
  GetAllMessageLog?: Maybe<Array<Maybe<MessageLog>>>;
  GetAllMessageTemplate?: Maybe<Array<Maybe<MessageTemplate>>>;
  GetAllMoreInformation: Array<Maybe<MoreInformation>>;
  GetAllMother?: Maybe<Array<Maybe<Mother>>>;
  GetAllNavigation?: Maybe<Array<Maybe<Navigation>>>;
  GetAllNote?: Maybe<Array<Maybe<Note>>>;
  GetAllNoteType?: Maybe<Array<Maybe<NoteType>>>;
  GetAllPQA?: Maybe<Array<Maybe<Pqa>>>;
  GetAllPermission?: Maybe<Array<Maybe<Permission>>>;
  GetAllPointsLibrary?: Maybe<Array<Maybe<PointsLibrary>>>;
  GetAllPointsUser?: Maybe<Array<Maybe<PointsUser>>>;
  GetAllPointsUserSummary?: Maybe<Array<Maybe<PointsUserSummary>>>;
  GetAllPractitioner?: Maybe<Array<Maybe<Practitioner>>>;
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
  GetAllRelation?: Maybe<Array<Maybe<Relation>>>;
  GetAllServiceScheduler?: Maybe<Array<Maybe<ServiceScheduler>>>;
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
  GetClubById?: Maybe<Club>;
  GetClubMeetingById?: Maybe<ClubMeeting>;
  GetClubMeetingRegisterById?: Maybe<ClubMeetingRegister>;
  GetCoachById?: Maybe<Coach>;
  GetCommunitySectionGGById: Array<Maybe<CommunitySectionGg>>;
  GetCommunitySectionItemGGById: Array<Maybe<CommunitySectionItemGg>>;
  GetCommunitySectionItemSSById: Array<Maybe<CommunitySectionItemSs>>;
  GetCommunitySectionSSById: Array<Maybe<CommunitySectionSs>>;
  GetConsentById: Array<Maybe<Consent>>;
  GetConsentGGById: Array<Maybe<ConsentGg>>;
  GetDailyProgrammeById?: Maybe<DailyProgramme>;
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
  GetLearnerById?: Maybe<Learner>;
  GetLicenseById?: Maybe<License>;
  GetLicenseTypeById?: Maybe<LicenseType>;
  GetMessageLogById?: Maybe<MessageLog>;
  GetMessageTemplateById?: Maybe<MessageTemplate>;
  GetMoreInformationById: Array<Maybe<MoreInformation>>;
  GetMotherById?: Maybe<Mother>;
  GetNavigationById?: Maybe<Navigation>;
  GetNoteById?: Maybe<Note>;
  GetNoteTypeById?: Maybe<NoteType>;
  GetPQAById?: Maybe<Pqa>;
  GetPermissionById?: Maybe<Permission>;
  GetPointsLibraryById?: Maybe<PointsLibrary>;
  GetPointsUserById?: Maybe<PointsUser>;
  GetPointsUserSummaryById?: Maybe<PointsUserSummary>;
  GetPractitionerById?: Maybe<Practitioner>;
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
  GetRelationById?: Maybe<Relation>;
  GetServiceSchedulerById?: Maybe<ServiceScheduler>;
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
  allClinics?: Maybe<Array<Maybe<Clinic>>>;
  allCoachesForFranchisor?: Maybe<Array<Maybe<Coach>>>;
  allContentLanguages?: Maybe<Array<Maybe<Language>>>;
  allDocument?: Maybe<Array<Maybe<Document>>>;
  allEventRecordTypes?: Maybe<Array<Maybe<EventRecordType>>>;
  allEventRecordTypesForType?: Maybe<Array<Maybe<EventRecordType>>>;
  allHealthCareWorkers?: Maybe<Array<Maybe<HealthCareWorker>>>;
  allInfants?: Maybe<Array<Maybe<Infant>>>;
  allInfantsForHealthCareWorker?: Maybe<Array<Maybe<Infant>>>;
  allMothers?: Maybe<Array<Maybe<Mother>>>;
  allMothersForHealthCareWorker?: Maybe<Array<Maybe<Mother>>>;
  allPractitionerInvites?: Maybe<Array<Scalars['DateTime']>>;
  allPractitionersForCoach?: Maybe<Array<Maybe<Practitioner>>>;
  allPractitionersForPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipals?: Maybe<Array<Maybe<Principal>>>;
  allStatementsBalanceSheet?: Maybe<Array<Maybe<StatementsBalanceSheet>>>;
  allStatementsExpenses?: Maybe<Array<Maybe<StatementsExpenses>>>;
  allStatementsIncome?: Maybe<Array<Maybe<StatementsIncome>>>;
  allStatementsIncomeStatement?: Maybe<Array<Maybe<StatementsIncomeStatement>>>;
  allStatementsStartupSupport?: Maybe<Array<Maybe<StatementsStartupSupport>>>;
  allTeamLeads?: Maybe<Array<Maybe<TeamLead>>>;
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
  classroomAttendanceReportPDFFile?: Maybe<Document>;
  classroomDetailsForPractitioner?: Maybe<PrincipalClassroom>;
  classroomGroupClassroomsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  classroomNamesForPractitioner?: Maybe<
    Array<Maybe<PractitionerClassroomName>>
  >;
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
  countClub?: Maybe<Scalars['Int']>;
  countClubMeeting?: Maybe<Scalars['Int']>;
  countClubMeetingRegister?: Maybe<Scalars['Int']>;
  countCoach?: Maybe<Scalars['Int']>;
  countDailyProgramme?: Maybe<Scalars['Int']>;
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
  countLearner?: Maybe<Scalars['Int']>;
  countLicense?: Maybe<Scalars['Int']>;
  countLicenseType?: Maybe<Scalars['Int']>;
  countMessageLog?: Maybe<Scalars['Int']>;
  countMessageTemplate?: Maybe<Scalars['Int']>;
  countMother?: Maybe<Scalars['Int']>;
  countNavigation?: Maybe<Scalars['Int']>;
  countNote?: Maybe<Scalars['Int']>;
  countNoteType?: Maybe<Scalars['Int']>;
  countPQA?: Maybe<Scalars['Int']>;
  countPermission?: Maybe<Scalars['Int']>;
  countPointsLibrary?: Maybe<Scalars['Int']>;
  countPointsUser?: Maybe<Scalars['Int']>;
  countPointsUserSummary?: Maybe<Scalars['Int']>;
  countPractitioner?: Maybe<Scalars['Int']>;
  countPrincipal?: Maybe<Scalars['Int']>;
  countProgramme?: Maybe<Scalars['Int']>;
  countProgrammeAttendanceReason?: Maybe<Scalars['Int']>;
  countProgrammeType?: Maybe<Scalars['Int']>;
  countProvince?: Maybe<Scalars['Int']>;
  countRace?: Maybe<Scalars['Int']>;
  countReasonForLeaving?: Maybe<Scalars['Int']>;
  countReasonForPractitionerLeaving?: Maybe<Scalars['Int']>;
  countRelation?: Maybe<Scalars['Int']>;
  countServiceScheduler?: Maybe<Scalars['Int']>;
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
  displayMetrics?: Maybe<Array<Maybe<NotificationDisplay>>>;
  documentsForHCW?: Maybe<Array<Maybe<Document>>>;
  entityChangesToSync?: Maybe<Array<Maybe<Scalars['String']>>>;
  franchisorByUserId?: Maybe<Franchisor>;
  franchisorSiteAddressById?: Maybe<SiteAddress>;
  generateChildProgressReport?: Maybe<Scalars['String']>;
  getMoodleSessionForUserId?: Maybe<Scalars['String']>;
  growthDataForInfant?: Maybe<Array<Maybe<VisitData>>>;
  hasContentTypeBeenTranslated: Scalars['Boolean'];
  healthCareWorkerByUserId?: Maybe<HealthCareWorker>;
  healthCareWorkerHighlights?: Maybe<HcwHighlights>;
  healthCareWorkerSummaryForPeriod?: Maybe<HcwSummary>;
  healthCareWorkerTemplateGenerator?: Maybe<FileModel>;
  healthCareWorkerVisitStatus?: Maybe<HcwVisitStatus>;
  healthPromotion: Array<Maybe<HealthPromotion>>;
  holidaysByMonth?: Maybe<Array<Maybe<Holiday>>>;
  holidaysByYear?: Maybe<Array<Maybe<Holiday>>>;
  infantCountForHealthCareWorkerForMonth: Scalars['Int'];
  infantSummaryByGroup?: Maybe<Array<Maybe<ClientSummary>>>;
  infantSummaryByPriority?: Maybe<Array<Maybe<ClientSummaryByPriority>>>;
  infantVisits?: Maybe<Array<Maybe<Visit>>>;
  infographics: Array<Maybe<Infographics>>;
  lastPractitionerInviteDate?: Maybe<Scalars['String']>;
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
  practitionerByIdNumber?: Maybe<PractitionerUserAndNote>;
  practitionerByIdNumberInternal?: Maybe<ApplicationUser>;
  practitionerByUserId?: Maybe<Practitioner>;
  practitionerColleagues?: Maybe<Array<Maybe<PractitionerColleagues>>>;
  practitionerExcelTemplateGenerator?: Maybe<FileModel>;
  practitionerInviteCount: Scalars['Int'];
  practitionerMetrics?: Maybe<PractitionerMetricReport>;
  practitionerNewSignupMetric: Scalars['Int'];
  practitionerPQARating?: Maybe<PqaRating>;
  practitionerReAccreditationRating?: Maybe<PqaRating>;
  practitionerTimeline?: Maybe<PractitionerTimeline>;
  practitionerVisits?: Maybe<Array<Maybe<Visit>>>;
  previousVisitInformationForInfant?: Maybe<Progress_VisitDataStatus>;
  previousVisitInformationForMother?: Maybe<Progress_VisitDataStatus>;
  principalByUserId?: Maybe<Practitioner>;
  referralsForInfant?: Maybe<Array<Maybe<VisitDataStatus>>>;
  referralsForMother?: Maybe<Array<Maybe<VisitDataStatus>>>;
  referralsForVisitId?: Maybe<Array<Maybe<VisitDataStatus>>>;
  removeHolidays?: Maybe<Array<Scalars['DateTime']>>;
  removeWeekendDays?: Maybe<Array<Scalars['DateTime']>>;
  reportDetailsForPractitioner?: Maybe<PractitionerReportDetails>;
  roleForUser?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<IdentityRole>>>;
  settings?: Maybe<SettingsType>;
  statementsIncomeExpensesPDFData?: Maybe<
    Array<Maybe<IncomeExpensePdfTableModel>>
  >;
  statementsIncomeExpensesPDFFile?: Maybe<Document>;
  teamLeadTemplateGenerator?: Maybe<FileModel>;
  tenantContext?: Maybe<TenantModel>;
  totalDaysAbsent: Scalars['Int'];
  traineeByUserId?: Maybe<Trainee>;
  userById?: Maybe<ApplicationUser>;
  userByToken?: Maybe<UserByToken>;
  userCalendarEvents?: Maybe<Array<Maybe<CalendarEvent>>>;
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

export type QueryGetAllClubArgs = {
  order?: InputMaybe<Array<ClubSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ClubFilterInput>;
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

export type QueryGetAllCoachArgs = {
  order?: InputMaybe<Array<CoachSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetAllCommunitySectionGgArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllCommunitySectionItemGgArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllCommunitySectionItemSsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllCommunitySectionSsArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllConsentArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllConsentGgArgs = {
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

export type QueryGetAllRelationArgs = {
  order?: InputMaybe<Array<RelationSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<RelationFilterInput>;
};

export type QueryGetAllServiceSchedulerArgs = {
  order?: InputMaybe<Array<ServiceSchedulerSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ServiceSchedulerFilterInput>;
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

export type QueryGetClubByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubFilterInput>;
};

export type QueryGetClubMeetingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubMeetingFilterInput>;
};

export type QueryGetClubMeetingRegisterByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ClubMeetingRegisterFilterInput>;
};

export type QueryGetCoachByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetCommunitySectionGgByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetCommunitySectionItemGgByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetCommunitySectionItemSsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetCommunitySectionSsByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetConsentByIdArgs = {
  id?: InputMaybe<Scalars['Int']>;
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetConsentGgByIdArgs = {
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

export type QueryGetRelationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<RelationFilterInput>;
};

export type QueryGetServiceSchedulerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<ServiceSchedulerFilterInput>;
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

export type QueryAllCoachesForFranchisorArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllContentLanguagesArgs = {
  contentType?: InputMaybe<Scalars['String']>;
};

export type QueryAllDocumentArgs = {
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

export type QueryAllMothersForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
  visitType?: InputMaybe<Scalars['String']>;
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

export type QueryAllStatementsBalanceSheetArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryAllStatementsExpensesArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryAllStatementsIncomeArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryAllStatementsIncomeStatementArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryAllStatementsStartupSupportArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryAllTeamLeadsArgs = {
  clinicSearch?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<TeamLeadSortInput>>;
  pagingInput?: InputMaybe<PagedQueryInput>;
  provinceSearch?: InputMaybe<Scalars['String']>;
  search?: InputMaybe<Scalars['String']>;
  where?: InputMaybe<TeamLeadFilterInput>;
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

export type QueryClassroomAttendanceReportPdfFileArgs = {
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

export type QueryCountClubArgs = {
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

export type QueryCountCoachArgs = {
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

export type QueryCountRelationArgs = {
  pagingInput?: InputMaybe<PagedQueryInput>;
  where?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type QueryCountServiceSchedulerArgs = {
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

export type QueryPractitionerPqaRatingArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerReAccreditationRatingArgs = {
  userId?: InputMaybe<Scalars['String']>;
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
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryStatementsIncomeExpensesPdfFileArgs = {
  month: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type QueryTotalDaysAbsentArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryTraineeByUserIdArgs = {
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

export type ServiceScheduler = {
  __typename?: 'ServiceScheduler';
  endTime: Scalars['DateTime'];
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  order: Scalars['Int'];
  results?: Maybe<Scalars['String']>;
  serviceToRun?: Maybe<Scalars['String']>;
  settingsPath?: Maybe<Scalars['String']>;
  startTime: Scalars['DateTime'];
  timingDelay?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type ServiceSchedulerFilterInput = {
  and?: InputMaybe<Array<ServiceSchedulerFilterInput>>;
  endTime?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<ServiceSchedulerFilterInput>>;
  order?: InputMaybe<ComparableInt32OperationFilterInput>;
  results?: InputMaybe<StringOperationFilterInput>;
  serviceToRun?: InputMaybe<StringOperationFilterInput>;
  settingsPath?: InputMaybe<StringOperationFilterInput>;
  startTime?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  timingDelay?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type ServiceSchedulerInput = {
  EndTime: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  Order: Scalars['Int'];
  Results?: InputMaybe<Scalars['String']>;
  ServiceToRun?: InputMaybe<Scalars['String']>;
  SettingsPath?: InputMaybe<Scalars['String']>;
  StartTime: Scalars['DateTime'];
  TimingDelay?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type ServiceSchedulerSortInput = {
  endTime?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  order?: InputMaybe<SortEnumType>;
  results?: InputMaybe<SortEnumType>;
  serviceToRun?: InputMaybe<SortEnumType>;
  settingsPath?: InputMaybe<SortEnumType>;
  startTime?: InputMaybe<SortEnumType>;
  timingDelay?: InputMaybe<SortEnumType>;
  updatedBy?: InputMaybe<SortEnumType>;
  updatedDate?: InputMaybe<SortEnumType>;
  user?: InputMaybe<ApplicationUserSortInput>;
  userId?: InputMaybe<SortEnumType>;
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type ShortenUrlEntityInput = {
  Clicked: Scalars['Int'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  MessageType?: InputMaybe<Scalars['String']>;
  URL?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type StatementsBalanceSheet = {
  __typename?: 'StatementsBalanceSheet';
  autoSubmitted: Scalars['Boolean'];
  balance: Scalars['Float'];
  expenseTotal: Scalars['Float'];
  incomeTotal: Scalars['Float'];
  month?: Maybe<Scalars['Int']>;
  submitted: Scalars['Boolean'];
  submittedDate?: Maybe<Scalars['DateTime']>;
  userId?: Maybe<Scalars['String']>;
  year: Scalars['Int'];
};

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
  incomeStatementId?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  submitted: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type StatementsExpensesFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  datePaid?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  expenseTypeId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeStatementId?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type StatementsExpensesInput = {
  Amount: Scalars['Float'];
  DatePaid: Scalars['DateTime'];
  Description?: InputMaybe<Scalars['String']>;
  ExpenseTypeId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeStatementId?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  Submitted: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type StatementsExpensesSortInput = {
  amount?: InputMaybe<SortEnumType>;
  datePaid?: InputMaybe<SortEnumType>;
  description?: InputMaybe<SortEnumType>;
  expenseTypeId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  incomeStatementId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
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
  childUserId?: Maybe<Scalars['String']>;
  contributionTypeId?: Maybe<Scalars['String']>;
  dateReceived: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  feeTypeId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  incomeStatementId?: Maybe<Scalars['String']>;
  incomeTypeId?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  payTypeId?: Maybe<Scalars['String']>;
  photoProof?: Maybe<Scalars['String']>;
  submitted: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type StatementsIncomeFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  amountExpected?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  childCoverAmount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  childUserId?: InputMaybe<StringOperationFilterInput>;
  contributionTypeId?: InputMaybe<StringOperationFilterInput>;
  dateReceived?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  description?: InputMaybe<StringOperationFilterInput>;
  feeTypeId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeStatementId?: InputMaybe<StringOperationFilterInput>;
  incomeTypeId?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  payTypeId?: InputMaybe<StringOperationFilterInput>;
  photoProof?: InputMaybe<StringOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type StatementsIncomeInput = {
  Amount: Scalars['Float'];
  AmountExpected: Scalars['Float'];
  ChildCoverAmount: Scalars['Float'];
  ChildUserId?: InputMaybe<Scalars['String']>;
  ContributionTypeId?: InputMaybe<Scalars['String']>;
  DateReceived: Scalars['DateTime'];
  Description?: InputMaybe<Scalars['String']>;
  FeeTypeId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeStatementId?: InputMaybe<Scalars['String']>;
  IncomeTypeId?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  PayTypeId?: InputMaybe<Scalars['String']>;
  PhotoProof?: InputMaybe<Scalars['String']>;
  Submitted: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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
  incomeStatementId?: InputMaybe<SortEnumType>;
  incomeTypeId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  payTypeId?: InputMaybe<SortEnumType>;
  photoProof?: InputMaybe<SortEnumType>;
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
  expenseTotal: Scalars['Float'];
  id: Scalars['UUID'];
  incomeTotal: Scalars['Float'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  month: Scalars['Int'];
  notes?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  submitted: Scalars['Boolean'];
  submittedDate: Scalars['DateTime'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
  year: Scalars['Int'];
};

export type StatementsIncomeStatementFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  annualSubmittedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  autoSubmitted?: InputMaybe<BooleanOperationFilterInput>;
  balance?: InputMaybe<ComparableDoubleOperationFilterInput>;
  expenseTotal?: InputMaybe<ComparableDoubleOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  incomeTotal?: InputMaybe<ComparableDoubleOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  month?: InputMaybe<ComparableInt32OperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  period?: InputMaybe<StringOperationFilterInput>;
  submitted?: InputMaybe<BooleanOperationFilterInput>;
  submittedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  year?: InputMaybe<ComparableInt32OperationFilterInput>;
};

export type StatementsIncomeStatementInput = {
  AnnualSubmittedDate?: InputMaybe<Scalars['DateTime']>;
  AutoSubmitted: Scalars['Boolean'];
  Balance: Scalars['Float'];
  ExpenseTotal: Scalars['Float'];
  Id?: InputMaybe<Scalars['UUID']>;
  IncomeTotal: Scalars['Float'];
  IsActive: Scalars['Boolean'];
  Month: Scalars['Int'];
  Notes?: InputMaybe<Scalars['String']>;
  Period?: InputMaybe<Scalars['String']>;
  Submitted: Scalars['Boolean'];
  SubmittedDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
  Year: Scalars['Int'];
};

export type StatementsIncomeStatementSortInput = {
  annualSubmittedDate?: InputMaybe<SortEnumType>;
  autoSubmitted?: InputMaybe<SortEnumType>;
  balance?: InputMaybe<SortEnumType>;
  expenseTotal?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  incomeTotal?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  month?: InputMaybe<SortEnumType>;
  notes?: InputMaybe<SortEnumType>;
  period?: InputMaybe<SortEnumType>;
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
  childUserId?: Maybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
};

export type StatementsStartupSupportFilterInput = {
  amount?: InputMaybe<ComparableDoubleOperationFilterInput>;
  and?: InputMaybe<Array<StatementsStartupSupportFilterInput>>;
  childUserId?: InputMaybe<StringOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type StatementsStartupSupportInput = {
  Amount: Scalars['Float'];
  ChildUserId?: InputMaybe<Scalars['String']>;
  Description?: InputMaybe<Scalars['String']>;
  EndDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  ProgrammeId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type StatementsSubmitInput = {
  month: Scalars['Int'];
  period?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  year: Scalars['Int'];
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

export type TeamLead = {
  __typename?: 'TeamLead';
  clinic?: Maybe<Clinic>;
  clinicId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  jobTitle?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type TeamLeadFilterInput = {
  and?: InputMaybe<Array<TeamLeadFilterInput>>;
  clinic?: InputMaybe<ClinicFilterInput>;
  clinicId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  jobTitle?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<TeamLeadFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type TeamLeadInput = {
  Clinic?: InputMaybe<ClinicInput>;
  ClinicId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  JobTitle?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type TeamLeadModelInput = {
  clinic?: InputMaybe<ClinicInput>;
  clinicId?: InputMaybe<Scalars['UUID']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<ApplicationUserInput>;
  userId?: InputMaybe<Scalars['String']>;
};

export type TeamLeadSortInput = {
  clinic?: InputMaybe<ClinicSortInput>;
  clinicId?: InputMaybe<SortEnumType>;
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
  groupName?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type TokenAccessPractitionerDetailModel = {
  __typename?: 'TokenAccessPractitionerDetailModel';
  firstname?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type TotalAttendanceStatsReport = {
  __typename?: 'TotalAttendanceStatsReport';
  totalChildrenAttendedSessions: Scalars['Int'];
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
  userId?: Maybe<Scalars['String']>;
};

export type TraineeFilterInput = {
  adminFileReceived?: InputMaybe<BooleanOperationFilterInput>;
  and?: InputMaybe<Array<TraineeFilterInput>>;
  attendedStartUpTraining?: InputMaybe<BooleanOperationFilterInput>;
  childProgressTraining?: InputMaybe<BooleanOperationFilterInput>;
  childrenAddedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type TraineeInput = {
  AdminFileReceived?: InputMaybe<Scalars['Boolean']>;
  AttendedStartUpTraining?: InputMaybe<Scalars['Boolean']>;
  ChildProgressTraining?: InputMaybe<Scalars['Boolean']>;
  ChildrenAddedDate?: InputMaybe<Scalars['DateTime']>;
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
  UserId?: InputMaybe<Scalars['String']>;
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
  smartSpaceLicenseStatus?: Maybe<Scalars['String']>;
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

export type UserConsent = {
  __typename?: 'UserConsent';
  consentId: Scalars['Int'];
  consentType?: Maybe<Scalars['String']>;
  createdUserId?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type UserConsentFilterInput = {
  and?: InputMaybe<Array<UserConsentFilterInput>>;
  consentId?: InputMaybe<ComparableInt32OperationFilterInput>;
  consentType?: InputMaybe<StringOperationFilterInput>;
  createdUserId?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserConsentFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type UserConsentInput = {
  ConsentId: Scalars['Int'];
  ConsentType?: InputMaybe<Scalars['String']>;
  CreatedUserId?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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
  userId?: Maybe<Scalars['String']>;
};

export type UserGrantInput = {
  grant?: InputMaybe<GrantInput>;
  grantId: Scalars['UUID'];
  tenantId: Scalars['UUID'];
  userId?: InputMaybe<Scalars['String']>;
};

export type UserHierarchyEntity = {
  __typename?: 'UserHierarchyEntity';
  hierarchy?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  key: Scalars['Int'];
  namedTypePath?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
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
  parentId?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  userType?: InputMaybe<StringOperationFilterInput>;
};

export type UserHierarchyEntityInput = {
  Hierarchy?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  NamedTypePath?: InputMaybe<Scalars['String']>;
  ParentId?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
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
  raceId?: InputMaybe<Scalars['UUID']>;
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
  dueDate?: Maybe<Scalars['DateTime']>;
  eventId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  infant?: Maybe<Infant>;
  infantId?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  linkedVisitId?: Maybe<Scalars['UUID']>;
  mother?: Maybe<Mother>;
  motherId?: Maybe<Scalars['UUID']>;
  orderDate?: Maybe<Scalars['DateTime']>;
  overallRatingColor?: Maybe<Scalars['String']>;
  plannedVisitDate: Scalars['DateTime'];
  practitioner?: Maybe<Practitioner>;
  practitionerId?: Maybe<Scalars['UUID']>;
  risk?: Maybe<Scalars['String']>;
  trainee?: Maybe<Trainee>;
  traineeId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
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
  dueDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  eventId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  infant?: InputMaybe<InfantFilterInput>;
  infantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedVisitId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<VisitFilterInput>>;
  orderDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  overallRatingColor?: InputMaybe<StringOperationFilterInput>;
  plannedVisitDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  practitioner?: InputMaybe<PractitionerFilterInput>;
  practitionerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  risk?: InputMaybe<StringOperationFilterInput>;
  trainee?: InputMaybe<TraineeFilterInput>;
  traineeId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
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
  DueDate?: InputMaybe<Scalars['DateTime']>;
  EventId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  Infant?: InputMaybe<InfantInput>;
  InfantId?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LinkedVisitId?: InputMaybe<Scalars['UUID']>;
  Mother?: InputMaybe<MotherInput>;
  MotherId?: InputMaybe<Scalars['UUID']>;
  OrderDate?: InputMaybe<Scalars['DateTime']>;
  OverallRatingColor?: InputMaybe<Scalars['String']>;
  PlannedVisitDate: Scalars['DateTime'];
  Practitioner?: InputMaybe<PractitionerInput>;
  PractitionerId?: InputMaybe<Scalars['UUID']>;
  Risk?: InputMaybe<Scalars['String']>;
  Trainee?: InputMaybe<TraineeInput>;
  TraineeId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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
  dueDate?: InputMaybe<SortEnumType>;
  eventId?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  infant?: InputMaybe<InfantSortInput>;
  infantId?: InputMaybe<SortEnumType>;
  insertedDate?: InputMaybe<SortEnumType>;
  isActive?: InputMaybe<SortEnumType>;
  linkedVisitId?: InputMaybe<SortEnumType>;
  mother?: InputMaybe<MotherSortInput>;
  motherId?: InputMaybe<SortEnumType>;
  orderDate?: InputMaybe<SortEnumType>;
  overallRatingColor?: InputMaybe<SortEnumType>;
  plannedVisitDate?: InputMaybe<SortEnumType>;
  practitioner?: InputMaybe<PractitionerSortInput>;
  practitionerId?: InputMaybe<SortEnumType>;
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
