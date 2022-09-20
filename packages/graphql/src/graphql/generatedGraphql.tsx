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

export type ApplicationUser = {
  __typename?: 'ApplicationUser';
  childObjectData?: Maybe<Child>;
  coachObjectData?: Maybe<Coach>;
  contactPreference?: Maybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  documents?: Maybe<Array<Maybe<Document>>>;
  email?: Maybe<Scalars['String']>;
  emailConfirmed: Scalars['Boolean'];
  firstName?: Maybe<Scalars['String']>;
  franchisorObjectData?: Maybe<Franchisor>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isSouthAfricanCitizen: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  nickFirstName?: Maybe<Scalars['String']>;
  nickFullName?: Maybe<Scalars['String']>;
  nickSurname?: Maybe<Scalars['String']>;
  normalizedEmail?: Maybe<Scalars['String']>;
  normalizedUserName?: Maybe<Scalars['String']>;
  notes?: Maybe<Array<Maybe<Note>>>;
  phoneNumber?: Maybe<Scalars['String']>;
  phoneNumberConfirmed: Scalars['Boolean'];
  practitionerObjectData?: Maybe<Practitioner>;
  principalObjectData?: Maybe<Practitioner>;
  profileImageUrl?: Maybe<Scalars['String']>;
  race?: Maybe<Race>;
  raceId?: Maybe<Scalars['UUID']>;
  roles?: Maybe<Array<Maybe<IdentityRole>>>;
  surname?: Maybe<Scalars['String']>;
  tenantId?: Maybe<Scalars['UUID']>;
  twoFactorEnabled: Scalars['Boolean'];
  userName?: Maybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
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
  firstName?: InputMaybe<StringOperationFilterInput>;
  franchisorObjectData?: InputMaybe<FranchisorFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isSouthAfricanCitizen?: InputMaybe<BooleanOperationFilterInput>;
  lastSeen?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  nickFirstName?: InputMaybe<StringOperationFilterInput>;
  nickFullName?: InputMaybe<StringOperationFilterInput>;
  nickSurname?: InputMaybe<StringOperationFilterInput>;
  normalizedEmail?: InputMaybe<StringOperationFilterInput>;
  normalizedUserName?: InputMaybe<StringOperationFilterInput>;
  notes?: InputMaybe<ListFilterInputTypeOfNoteFilterInput>;
  or?: InputMaybe<Array<ApplicationUserFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  phoneNumberConfirmed?: InputMaybe<BooleanOperationFilterInput>;
  practitionerObjectData?: InputMaybe<PractitionerFilterInput>;
  principalObjectData?: InputMaybe<PractitionerFilterInput>;
  profileImageUrl?: InputMaybe<StringOperationFilterInput>;
  race?: InputMaybe<RaceFilterInput>;
  raceId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  tenantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  twoFactorEnabled?: InputMaybe<BooleanOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
  verifiedByHomeAffairs?: InputMaybe<BooleanOperationFilterInput>;
};

export type ApplicationUserInput = {
  childObjectData?: InputMaybe<ChildInput>;
  coachObjectData?: InputMaybe<CoachInput>;
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  email?: InputMaybe<Scalars['String']>;
  emailConfirmed: Scalars['Boolean'];
  firstName?: InputMaybe<Scalars['String']>;
  franchisorObjectData?: InputMaybe<FranchisorInput>;
  fullName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderInput>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isSouthAfricanCitizen: Scalars['Boolean'];
  lastSeen: Scalars['DateTime'];
  nickFirstName?: InputMaybe<Scalars['String']>;
  nickFullName?: InputMaybe<Scalars['String']>;
  nickSurname?: InputMaybe<Scalars['String']>;
  normalizedEmail?: InputMaybe<Scalars['String']>;
  normalizedUserName?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Array<InputMaybe<NoteInput>>>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberConfirmed: Scalars['Boolean'];
  practitionerObjectData?: InputMaybe<PractitionerInput>;
  principalObjectData?: InputMaybe<PractitionerInput>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  race?: InputMaybe<RaceInput>;
  raceId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  tenantId?: InputMaybe<Scalars['UUID']>;
  twoFactorEnabled: Scalars['Boolean'];
  userName?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
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

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']>;
  neq?: InputMaybe<Scalars['Boolean']>;
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
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  joinReferencePanel: Scalars['Boolean'];
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
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  joinReferencePanel?: InputMaybe<BooleanOperationFilterInput>;
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
  IsActive: Scalars['Boolean'];
  JoinReferencePanel: Scalars['Boolean'];
  PhoneNumber?: InputMaybe<Scalars['String']>;
  Relation?: InputMaybe<RelationInput>;
  RelationId?: InputMaybe<Scalars['UUID']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  Surname?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  WhatsAppNumber?: InputMaybe<Scalars['String']>;
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

export type CategoryTask = {
  __typename?: 'CategoryTask';
  description?: Maybe<Scalars['String']>;
  levelId: Scalars['Int'];
  skillId: Scalars['Int'];
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
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  otherHealthConditions?: Maybe<Scalars['String']>;
  reasonForLeaving?: Maybe<ReasonForLeaving>;
  reasonForLeavingId?: Maybe<Scalars['UUID']>;
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

export type ChildFilterInput = {
  allergies?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ChildFilterInput>>;
  caregiver?: InputMaybe<CaregiverFilterInput>;
  caregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  disabilities?: InputMaybe<StringOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<ChildFilterInput>>;
  otherHealthConditions?: InputMaybe<StringOperationFilterInput>;
  reasonForLeaving?: InputMaybe<ReasonForLeavingFilterInput>;
  reasonForLeavingId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  IsActive: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  OtherHealthConditions?: InputMaybe<Scalars['String']>;
  ReasonForLeaving?: InputMaybe<ReasonForLeavingInput>;
  ReasonForLeavingId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  WorkflowStatus?: InputMaybe<WorkflowStatusInput>;
  WorkflowStatusId?: InputMaybe<Scalars['UUID']>;
};

export type ChildProgressReport = {
  __typename?: 'ChildProgressReport';
  child?: Maybe<Child>;
  childId: Scalars['UUID'];
  classroomGroup?: Maybe<ClassroomGroup>;
  classroomGroupId: Scalars['UUID'];
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
  classroomGroupId?: InputMaybe<ComparableGuidOperationFilterInput>;
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
  ClassroomGroupId: Scalars['UUID'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  ReportContent?: InputMaybe<Scalars['String']>;
  ReportDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type ChildProgressReportSummaryModel = {
  __typename?: 'ChildProgressReportSummaryModel';
  categories?: Maybe<Array<Maybe<ObservationCategorySummary>>>;
  childFirstname?: Maybe<Scalars['String']>;
  childId?: Maybe<Scalars['String']>;
  childSurname?: Maybe<Scalars['String']>;
  classroomName?: Maybe<Scalars['String']>;
  reportDate?: Maybe<Scalars['String']>;
  reportId: Scalars['UUID'];
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
  userId?: Maybe<Scalars['String']>;
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
  userId?: InputMaybe<StringOperationFilterInput>;
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
  UserId?: InputMaybe<Scalars['String']>;
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

export type Coach = {
  __typename?: 'Coach';
  areaOfOperation?: Maybe<Scalars['String']>;
  franchisor?: Maybe<Franchisor>;
  franchisorId?: Maybe<Scalars['UUID']>;
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

export type CoachFilterInput = {
  and?: InputMaybe<Array<CoachFilterInput>>;
  areaOfOperation?: InputMaybe<StringOperationFilterInput>;
  franchisor?: InputMaybe<FranchisorFilterInput>;
  franchisorId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<CoachFilterInput>>;
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

export type CoachInput = {
  AreaOfOperation?: InputMaybe<Scalars['String']>;
  Franchisor?: InputMaybe<FranchisorInput>;
  FranchisorId?: InputMaybe<Scalars['UUID']>;
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

export type Document = {
  __typename?: 'Document';
  createdUserId?: Maybe<Scalars['String']>;
  documentType?: Maybe<DocumentType>;
  documentTypeId: Scalars['UUID'];
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
  CareGiver = 'CARE_GIVER',
  Child = 'CHILD',
  ClassroomProfile = 'CLASSROOM_PROFILE',
  Coach = 'COACH',
  Practitioner = 'PRACTITIONER',
  ProfileImage = 'PROFILE_IMAGE',
  ProgressTrackingCategory = 'PROGRESS_TRACKING_CATEGORY',
  ProgressTrackingLevel = 'PROGRESS_TRACKING_LEVEL',
  ProgressTrackingSubCategory = 'PROGRESS_TRACKING_SUB_CATEGORY',
  ReportTemplates = 'REPORT_TEMPLATES',
  Theme = 'THEME',
  Unknown = 'UNKNOWN',
}

export type FileTypeEnumOperationFilterInput = {
  eq?: InputMaybe<FileTypeEnum>;
  in?: InputMaybe<Array<FileTypeEnum>>;
  neq?: InputMaybe<FileTypeEnum>;
  nin?: InputMaybe<Array<FileTypeEnum>>;
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

export enum GraphActionEnum {
  Create = 'CREATE',
  Delete = 'DELETE',
  Update = 'UPDATE',
  View = 'VIEW',
}

export type HealthCareWorker = {
  __typename?: 'HealthCareWorker';
  consentForPhoto: Scalars['Boolean'];
  emergancyContactNumber?: Maybe<Scalars['String']>;
  emergancyContactPerson?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  teamLead?: Maybe<ApplicationUser>;
  teamLeadId?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type HealthCareWorkerFilterInput = {
  and?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  emergancyContactNumber?: InputMaybe<StringOperationFilterInput>;
  emergancyContactPerson?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  teamLead?: InputMaybe<ApplicationUserFilterInput>;
  teamLeadId?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type HealthCareWorkerInput = {
  ConsentForPhoto: Scalars['Boolean'];
  EmergancyContactNumber?: InputMaybe<Scalars['String']>;
  EmergancyContactPerson?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  TeamLead?: InputMaybe<ApplicationUserInput>;
  TeamLeadId?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type HealthCareWorkerModelInput = {
  langaugeId?: InputMaybe<Scalars['UUID']>;
  siteAddress?: InputMaybe<SiteAddressInput>;
  siteAddressId?: InputMaybe<Scalars['UUID']>;
  teamLeadId?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<ApplicationUserInput>;
  userId?: InputMaybe<Scalars['String']>;
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

export type Holiday = {
  __typename?: 'Holiday';
  day: Scalars['DateTime'];
};

export type IdentityRole = {
  __typename?: 'IdentityRole';
  concurrencyStamp?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Permission>>>;
};

export type Infant = {
  __typename?: 'Infant';
  caregiver?: Maybe<Caregiver>;
  caregiverId?: Maybe<Scalars['UUID']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  lengthAtBirth?: Maybe<Scalars['Decimal']>;
  mother?: Maybe<Mother>;
  motherId?: Maybe<Scalars['UUID']>;
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
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lengthAtBirth?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<InfantFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  weightAtBirth?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
};

export type InfantInput = {
  Caregiver?: InputMaybe<CaregiverInput>;
  CaregiverId?: InputMaybe<Scalars['UUID']>;
  Gender?: InputMaybe<GenderInput>;
  GenderId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LengthAtBirth?: InputMaybe<Scalars['Decimal']>;
  Mother?: InputMaybe<MotherInput>;
  MotherId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  WeightAtBirth?: InputMaybe<Scalars['Decimal']>;
};

export type InfantModelInput = {
  caregiver?: InputMaybe<CaregiverModelInput>;
  caregiverId?: InputMaybe<Scalars['UUID']>;
  dateOfBirth: Scalars['DateTime'];
  firstName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  lengthAtBirth?: InputMaybe<Scalars['Decimal']>;
  userId?: InputMaybe<Scalars['String']>;
  weightAtBirth?: InputMaybe<Scalars['Decimal']>;
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

export type ListFilterInputTypeOfNoteFilterInput = {
  all?: InputMaybe<NoteFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<NoteFilterInput>;
  some?: InputMaybe<NoteFilterInput>;
};

export type ListFilterInputTypeOfProgrammeFilterInput = {
  all?: InputMaybe<ProgrammeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<ProgrammeFilterInput>;
  some?: InputMaybe<ProgrammeFilterInput>;
};

export type MessageTemplate = {
  __typename?: 'MessageTemplate';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
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
  templateType?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type MessageTemplateInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Message?: InputMaybe<Scalars['String']>;
  Protocol?: InputMaybe<Scalars['String']>;
  TemplateType?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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

export type Mother = {
  __typename?: 'Mother';
  age?: Maybe<Scalars['String']>;
  expectedDateOfDelivery?: Maybe<Scalars['DateTime']>;
  healthCareWorker?: Maybe<HealthCareWorker>;
  healthCareWorkerId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
  whatsAppNumber?: Maybe<Scalars['String']>;
};

export type MotherFilterInput = {
  age?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<MotherFilterInput>>;
  expectedDateOfDelivery?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<MotherFilterInput>>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
  whatsAppNumber?: InputMaybe<StringOperationFilterInput>;
};

export type MotherInput = {
  Age?: InputMaybe<Scalars['String']>;
  ExpectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  HealthCareWorker?: InputMaybe<HealthCareWorkerInput>;
  HealthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
  WhatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type MotherModelInput = {
  age?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  expectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  firstName?: InputMaybe<Scalars['String']>;
  healthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  relation?: InputMaybe<RelationInput>;
  relationId?: InputMaybe<Scalars['UUID']>;
  siteAddress?: InputMaybe<SiteAddressInput>;
  siteAddressId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
  whatsAppNumber?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addAbsenteeForPractitioner?: Maybe<Absentees>;
  addCoachToFranchisor?: Maybe<Coach>;
  addHealthCareWorker?: Maybe<HealthCareWorker>;
  addInfant?: Maybe<Infant>;
  addMother?: Maybe<Mother>;
  addPermissionsToNavigation: Scalars['Boolean'];
  addPermissionsToRole: Scalars['Boolean'];
  addPractitionerToCoach?: Maybe<Practitioner>;
  addPractitionerToPrincipal?: Maybe<Practitioner>;
  addRole?: Maybe<IdentityRole>;
  addUser?: Maybe<ApplicationUser>;
  addUsersToRole: Scalars['Boolean'];
  contentTypeImport: Scalars['Boolean'];
  createAbsentees?: Maybe<Absentees>;
  createActivity?: Maybe<Scalars['String']>;
  createAuditLogType?: Maybe<AuditLogType>;
  createCaregiver?: Maybe<Caregiver>;
  createChild?: Maybe<Child>;
  createChildProgressReport?: Maybe<ChildProgressReport>;
  createClassProgramme?: Maybe<ClassProgramme>;
  createClassroom?: Maybe<Classroom>;
  createClassroomGroup?: Maybe<ClassroomGroup>;
  createCoach?: Maybe<Coach>;
  createConsent?: Maybe<Scalars['String']>;
  createContentDefinition?: Maybe<ContentDefinitionModel>;
  createDailyProgramme?: Maybe<DailyProgramme>;
  createDocument?: Maybe<Document>;
  createDocumentType?: Maybe<DocumentType>;
  createEducation?: Maybe<Education>;
  createFranchisor?: Maybe<Franchisor>;
  createGender?: Maybe<Gender>;
  createGrant?: Maybe<Grant>;
  createHealthCareWorker?: Maybe<HealthCareWorker>;
  createHierarchyEntity?: Maybe<HierarchyEntity>;
  createInfant?: Maybe<Infant>;
  createLanguage?: Maybe<Language>;
  createLearner?: Maybe<Learner>;
  createMessageTemplate?: Maybe<MessageTemplate>;
  createMother?: Maybe<Mother>;
  createNavigation?: Maybe<Navigation>;
  createNote?: Maybe<Note>;
  createNoteType?: Maybe<NoteType>;
  createPermission?: Maybe<Permission>;
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
  createRelation?: Maybe<Relation>;
  createShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  createSiteAddress?: Maybe<SiteAddress>;
  createStoryBook?: Maybe<Scalars['String']>;
  createStoryBookPartQuestion?: Maybe<Scalars['String']>;
  createStoryBookParts?: Maybe<Scalars['String']>;
  createSystemSetting?: Maybe<SystemSetting>;
  createTheme?: Maybe<Scalars['String']>;
  createThemeDay?: Maybe<Scalars['String']>;
  createUserConsent?: Maybe<UserConsent>;
  createUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  createWorkflowStatus?: Maybe<WorkflowStatus>;
  createWorkflowStatusType?: Maybe<WorkflowStatusType>;
  dataIngestionImport: Scalars['Boolean'];
  deleteAbsentees?: Maybe<Scalars['Boolean']>;
  deleteActivity?: Maybe<Scalars['Boolean']>;
  deleteAuditLogType?: Maybe<Scalars['Boolean']>;
  deleteCaregiver?: Maybe<Scalars['Boolean']>;
  deleteChild?: Maybe<Scalars['Boolean']>;
  deleteChildProgressReport?: Maybe<Scalars['Boolean']>;
  deleteClassProgramme?: Maybe<Scalars['Boolean']>;
  deleteClassroom?: Maybe<Scalars['Boolean']>;
  deleteClassroomGroup?: Maybe<Scalars['Boolean']>;
  deleteCoach?: Maybe<Scalars['Boolean']>;
  deleteCoachForFranchisor?: Maybe<Coach>;
  deleteConsent?: Maybe<Scalars['Boolean']>;
  deleteContentDefinition: Scalars['Boolean'];
  deleteDailyProgramme?: Maybe<Scalars['Boolean']>;
  deleteDocument?: Maybe<Scalars['Boolean']>;
  deleteDocumentType?: Maybe<Scalars['Boolean']>;
  deleteEducation?: Maybe<Scalars['Boolean']>;
  deleteFranchisor?: Maybe<Scalars['Boolean']>;
  deleteGender?: Maybe<Scalars['Boolean']>;
  deleteGrant?: Maybe<Scalars['Boolean']>;
  deleteHealthCareWorker?: Maybe<Scalars['Boolean']>;
  deleteHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteInfant?: Maybe<Scalars['Boolean']>;
  deleteLanguage?: Maybe<Scalars['Boolean']>;
  deleteLearner?: Maybe<Scalars['Boolean']>;
  deleteMessageTemplate?: Maybe<Scalars['Boolean']>;
  deleteMother?: Maybe<Scalars['Boolean']>;
  deleteNavigation?: Maybe<Scalars['Boolean']>;
  deleteNote?: Maybe<Scalars['Boolean']>;
  deleteNoteType?: Maybe<Scalars['Boolean']>;
  deletePermission?: Maybe<Scalars['Boolean']>;
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
  deleteRelation?: Maybe<Scalars['Boolean']>;
  deleteRole: Scalars['Boolean'];
  deleteShortenUrlEntity?: Maybe<Scalars['Boolean']>;
  deleteSiteAddress?: Maybe<Scalars['Boolean']>;
  deleteStoryBook?: Maybe<Scalars['Boolean']>;
  deleteStoryBookPartQuestion?: Maybe<Scalars['Boolean']>;
  deleteStoryBookParts?: Maybe<Scalars['Boolean']>;
  deleteSystemSetting?: Maybe<Scalars['Boolean']>;
  deleteTheme?: Maybe<Scalars['Boolean']>;
  deleteThemeDay?: Maybe<Scalars['Boolean']>;
  deleteUser: Scalars['Boolean'];
  deleteUserConsent?: Maybe<Scalars['Boolean']>;
  deleteUserHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatus?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatusType?: Maybe<Scalars['Boolean']>;
  demotePractitionerAsPrincipal?: Maybe<Practitioner>;
  fileUpload?: Maybe<DocumentModel>;
  generateCaregiverChildToken?: Maybe<Scalars['String']>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  openAccessAddChild: Scalars['Boolean'];
  practitionerImport: Scalars['Boolean'];
  promotePractitionerToPrincipal?: Maybe<Principal>;
  refreshCaregiverChildToken?: Maybe<Scalars['String']>;
  removePermissionsFromNavigation: Scalars['Boolean'];
  removePermissionsFromRole: Scalars['Boolean'];
  removeUserFromRoles: Scalars['Boolean'];
  resetUserPassword: Scalars['Boolean'];
  sendCoachInviteToApplication: Scalars['Boolean'];
  sendInviteToApplication: Scalars['Boolean'];
  trackAttendance: Scalars['Boolean'];
  updateAbsentees?: Maybe<Absentees>;
  updateActivity?: Maybe<Activity>;
  updateAuditLogType?: Maybe<AuditLogType>;
  updateCaregiver?: Maybe<Caregiver>;
  updateChild?: Maybe<Child>;
  updateChildProgressReport?: Maybe<ChildProgressReport>;
  updateClassProgramme?: Maybe<ClassProgramme>;
  updateClassroom?: Maybe<Classroom>;
  updateClassroomGroup?: Maybe<ClassroomGroup>;
  updateCoach?: Maybe<Coach>;
  updateConsent?: Maybe<Consent>;
  updateDailyProgramme?: Maybe<DailyProgramme>;
  updateDocument?: Maybe<Document>;
  updateDocumentType?: Maybe<DocumentType>;
  updateEducation?: Maybe<Education>;
  updateFranchisor?: Maybe<Franchisor>;
  updateGender?: Maybe<Gender>;
  updateGrant?: Maybe<Grant>;
  updateHealthCareWorker?: Maybe<HealthCareWorker>;
  updateHierarchyEntity?: Maybe<HierarchyEntity>;
  updateInfant?: Maybe<Infant>;
  updateLanguage?: Maybe<Language>;
  updateLearner?: Maybe<Learner>;
  updateMessageTemplate?: Maybe<MessageTemplate>;
  updateMother?: Maybe<Mother>;
  updateNavigation?: Maybe<Navigation>;
  updateNote?: Maybe<Note>;
  updateNoteType?: Maybe<NoteType>;
  updatePermission?: Maybe<Permission>;
  updatePractitioner?: Maybe<Practitioner>;
  updatePractitionerContactInfo?: Maybe<ApplicationUser>;
  updatePractitionerIsFundaAppAdmin: Scalars['Boolean'];
  updatePractitionerIsTrainee: Scalars['Boolean'];
  updatePractitionerRegistered: Scalars['Boolean'];
  updatePractitionerShareInfo: Scalars['Boolean'];
  updatePractitionerToTeachClassroom?: Maybe<Classroom>;
  updatePrincipal?: Maybe<Principal>;
  updateProgramme?: Maybe<Programme>;
  updateProgrammeAttendanceReason?: Maybe<ProgrammeAttendanceReason>;
  updateProgrammeRoutine?: Maybe<ProgrammeRoutine>;
  updateProgrammeRoutineItem?: Maybe<ProgrammeRoutineItem>;
  updateProgrammeRoutineSubItem?: Maybe<ProgrammeRoutineSubItem>;
  updateProgrammeType?: Maybe<ProgrammeType>;
  updateProgressTrackingCategory?: Maybe<ProgressTrackingCategory>;
  updateProgressTrackingLevel?: Maybe<ProgressTrackingLevel>;
  updateProgressTrackingSkill?: Maybe<ProgressTrackingSkill>;
  updateProgressTrackingSubCategory?: Maybe<ProgressTrackingSubCategory>;
  updateProvince?: Maybe<Province>;
  updateRace?: Maybe<Race>;
  updateReasonForLeaving?: Maybe<ReasonForLeaving>;
  updateRelation?: Maybe<Relation>;
  updateRole?: Maybe<IdentityRole>;
  updateShortenUrlEntity?: Maybe<ShortenUrlEntity>;
  updateSiteAddress?: Maybe<SiteAddress>;
  updateStoryBook?: Maybe<StoryBook>;
  updateStoryBookPartQuestion?: Maybe<StoryBookPartQuestion>;
  updateStoryBookParts?: Maybe<StoryBookParts>;
  updateSystemSetting?: Maybe<SystemSetting>;
  updateTenantTheme: Scalars['Boolean'];
  updateTheme?: Maybe<Theme>;
  updateThemeDay?: Maybe<ThemeDay>;
  updateUser?: Maybe<ApplicationUser>;
  updateUserConsent?: Maybe<UserConsent>;
  updateUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  updateWorkflowStatus?: Maybe<WorkflowStatus>;
  updateWorkflowStatusType?: Maybe<WorkflowStatusType>;
  uploadChildProgressReport: Scalars['Boolean'];
};

export type MutationAddAbsenteeForPractitionerArgs = {
  absentDate: Scalars['DateTime'];
  classProgram?: InputMaybe<Scalars['String']>;
  loggedByUser?: InputMaybe<Scalars['String']>;
  practitionerId?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
  reassignedToPractitioner?: InputMaybe<Scalars['String']>;
};

export type MutationAddCoachToFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
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

export type MutationAddRoleArgs = {
  name?: InputMaybe<Scalars['String']>;
  normalizedName?: InputMaybe<Scalars['String']>;
};

export type MutationAddUserArgs = {
  input?: InputMaybe<UserModelInput>;
};

export type MutationAddUsersToRoleArgs = {
  roleNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
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

export type MutationCreateClassroomArgs = {
  input?: InputMaybe<ClassroomInput>;
};

export type MutationCreateClassroomGroupArgs = {
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationCreateCoachArgs = {
  input?: InputMaybe<CoachInput>;
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

export type MutationCreateHierarchyEntityArgs = {
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationCreateInfantArgs = {
  input?: InputMaybe<InfantInput>;
};

export type MutationCreateLanguageArgs = {
  input?: InputMaybe<LanguageInput>;
};

export type MutationCreateLearnerArgs = {
  input?: InputMaybe<LearnerInput>;
};

export type MutationCreateMessageTemplateArgs = {
  input?: InputMaybe<MessageTemplateInput>;
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

export type MutationCreatePermissionArgs = {
  input?: InputMaybe<PermissionInput>;
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

export type MutationCreateRelationArgs = {
  input?: InputMaybe<RelationInput>;
};

export type MutationCreateShortenUrlEntityArgs = {
  input?: InputMaybe<ShortenUrlEntityInput>;
};

export type MutationCreateSiteAddressArgs = {
  input?: InputMaybe<SiteAddressInput>;
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

export type MutationCreateUserConsentArgs = {
  input?: InputMaybe<UserConsentInput>;
};

export type MutationCreateUserHierarchyEntityArgs = {
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationCreateWorkflowStatusArgs = {
  input?: InputMaybe<WorkflowStatusInput>;
};

export type MutationCreateWorkflowStatusTypeArgs = {
  input?: InputMaybe<WorkflowStatusTypeInput>;
};

export type MutationDataIngestionImportArgs = {
  file?: InputMaybe<Scalars['String']>;
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

export type MutationDeleteClassroomArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteClassroomGroupArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteCoachForFranchisorArgs = {
  coachId?: InputMaybe<Scalars['String']>;
  franchisorId?: InputMaybe<Scalars['String']>;
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

export type MutationDeleteHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteInfantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteMessageTemplateArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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

export type MutationDeletePermissionArgs = {
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

export type MutationDeleteUserArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type MutationDeleteUserConsentArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteUserHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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

export type MutationMapPractitionerToPrincipalArgs = {
  practitioner?: InputMaybe<PractitionerInput>;
};

export type MutationOpenAccessAddChildArgs = {
  caregiver?: InputMaybe<AddChildCaregiverTokenModelInput>;
  child?: InputMaybe<AddChildTokenModelInput>;
  learner?: InputMaybe<AddChildLearnerTokenModelInput>;
  siteAddress?: InputMaybe<AddChildSiteAddressTokenModelInput>;
  token?: InputMaybe<Scalars['String']>;
};

export type MutationPractitionerImportArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationPromotePractitionerToPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationRefreshCaregiverChildTokenArgs = {
  childId: Scalars['UUID'];
  classgroupId: Scalars['UUID'];
};

export type MutationRemovePermissionsFromNavigationArgs = {
  navigationId: Scalars['UUID'];
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
};

export type MutationRemovePermissionsFromRoleArgs = {
  permissionIds?: InputMaybe<Array<Scalars['UUID']>>;
  roleId?: InputMaybe<Scalars['String']>;
};

export type MutationRemoveUserFromRolesArgs = {
  roleNames?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationResetUserPasswordArgs = {
  id?: InputMaybe<Scalars['String']>;
  newPassword?: InputMaybe<Scalars['String']>;
};

export type MutationSendCoachInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationSendInviteToApplicationArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationTrackAttendanceArgs = {
  attendance?: InputMaybe<TrackAttendanceModelInput>;
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
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClassProgrammeInput>;
};

export type MutationUpdateClassroomArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClassroomInput>;
};

export type MutationUpdateClassroomGroupArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<ClassroomGroupInput>;
};

export type MutationUpdateCoachArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<CoachInput>;
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
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<HealthCareWorkerModelInput>;
};

export type MutationUpdateHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationUpdateInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateLanguageArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LanguageInput>;
};

export type MutationUpdateLearnerArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<LearnerInput>;
};

export type MutationUpdateMessageTemplateArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<MessageTemplateInput>;
};

export type MutationUpdateMotherArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<MotherModelInput>;
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

export type MutationUpdatePermissionArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PermissionInput>;
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

export type MutationUpdatePractitionerIsFundaAppAdminArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerIsTraineeArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerRegisteredArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  status?: Scalars['Boolean'];
};

export type MutationUpdatePractitionerShareInfoArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
  principalId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePractitionerToTeachClassroomArgs = {
  classroomId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type MutationUpdatePrincipalArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<PrincipalInput>;
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

export type MutationUpdateRelationArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<RelationInput>;
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

export type Practitioner = {
  __typename?: 'Practitioner';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type PractitionerFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PractitionerFilterInput = {
  and?: InputMaybe<Array<PractitionerFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  isTrainee?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  maxChildren?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  monthSinceFranchisee?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<PractitionerFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  principal?: InputMaybe<PractitionerFilterInput>;
  principalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type PractitionerInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type PractitionerMetricReport = {
  __typename?: 'PractitionerMetricReport';
  avgChildren: Scalars['Int'];
  completedProfiles: Scalars['Int'];
  outstandingSyncs: Scalars['Int'];
  programTypesData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  statusData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
};

export type Principal = {
  __typename?: 'Principal';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
  coach?: Maybe<Coach>;
  coachHierarchy?: Maybe<Scalars['UUID']>;
  consentForPhoto?: Maybe<Scalars['Boolean']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  shareInfo?: Maybe<Scalars['Boolean']>;
  signingSignature?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<SiteAddress>;
  siteAddressId?: Maybe<Scalars['UUID']>;
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type PrincipalFilterDocumentsByTypeArgs = {
  type: FileTypeEnum;
};

export type PrincipalClassroom = {
  __typename?: 'PrincipalClassroom';
  classroomName?: Maybe<Scalars['String']>;
  principalName?: Maybe<Scalars['String']>;
};

export type PrincipalFilterInput = {
  and?: InputMaybe<Array<PrincipalFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
  coach?: InputMaybe<CoachFilterInput>;
  coachHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isPrincipal?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  isTrainee?: InputMaybe<BooleanOperationFilterInput>;
  languageUsedInGroups?: InputMaybe<StringOperationFilterInput>;
  maxChildren?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  monthSinceFranchisee?: InputMaybe<ComparableNullableOfInt32OperationFilterInput>;
  or?: InputMaybe<Array<PrincipalFilterInput>>;
  parentFees?: InputMaybe<ComparableNullableOfDecimalOperationFilterInput>;
  principal?: InputMaybe<PractitionerFilterInput>;
  principalHierarchy?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  shareInfo?: InputMaybe<BooleanOperationFilterInput>;
  signingSignature?: InputMaybe<StringOperationFilterInput>;
  siteAddress?: InputMaybe<SiteAddressFilterInput>;
  siteAddressId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type PrincipalInput = {
  AttendanceRegisterLink?: InputMaybe<Scalars['String']>;
  Coach?: InputMaybe<CoachInput>;
  CoachHierarchy?: InputMaybe<Scalars['UUID']>;
  ConsentForPhoto?: InputMaybe<Scalars['Boolean']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type Programme = {
  __typename?: 'Programme';
  classroom?: Maybe<Classroom>;
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

export type ProgrammeFilterInput = {
  and?: InputMaybe<Array<ProgrammeFilterInput>>;
  classroom?: InputMaybe<ClassroomFilterInput>;
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
  ClassroomId: Scalars['UUID'];
  EndDate: Scalars['DateTime'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  PreferredLanguage?: InputMaybe<Scalars['String']>;
  StartDate: Scalars['DateTime'];
  UpdatedBy?: InputMaybe<Scalars['String']>;
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
};

export type ProgressTrackingSkillInput = {
  level?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
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

export type Query = {
  __typename?: 'Query';
  GetAbsenteesById?: Maybe<Absentees>;
  GetActivityById: Array<Maybe<Activity>>;
  GetAllAbsentees?: Maybe<Array<Maybe<Absentees>>>;
  GetAllActivity: Array<Maybe<Activity>>;
  GetAllAuditLogType?: Maybe<Array<Maybe<AuditLogType>>>;
  GetAllCaregiver?: Maybe<Array<Maybe<Caregiver>>>;
  GetAllChild?: Maybe<Array<Maybe<Child>>>;
  GetAllChildProgressReport?: Maybe<Array<Maybe<ChildProgressReport>>>;
  GetAllClassProgramme?: Maybe<Array<Maybe<ClassProgramme>>>;
  GetAllClassroom?: Maybe<Array<Maybe<Classroom>>>;
  GetAllClassroomGroup?: Maybe<Array<Maybe<ClassroomGroup>>>;
  GetAllCoach?: Maybe<Array<Maybe<Coach>>>;
  GetAllConsent: Array<Maybe<Consent>>;
  GetAllDailyProgramme?: Maybe<Array<Maybe<DailyProgramme>>>;
  GetAllDocument?: Maybe<Array<Maybe<Document>>>;
  GetAllDocumentType?: Maybe<Array<Maybe<DocumentType>>>;
  GetAllEducation?: Maybe<Array<Maybe<Education>>>;
  GetAllFranchisor?: Maybe<Array<Maybe<Franchisor>>>;
  GetAllGender?: Maybe<Array<Maybe<Gender>>>;
  GetAllGrant?: Maybe<Array<Maybe<Grant>>>;
  GetAllHealthCareWorker?: Maybe<Array<Maybe<HealthCareWorker>>>;
  GetAllHierarchyEntity?: Maybe<Array<Maybe<HierarchyEntity>>>;
  GetAllInfant?: Maybe<Array<Maybe<Infant>>>;
  GetAllLanguage?: Maybe<Array<Maybe<Language>>>;
  GetAllLearner?: Maybe<Array<Maybe<Learner>>>;
  GetAllMessageTemplate?: Maybe<Array<Maybe<MessageTemplate>>>;
  GetAllMother?: Maybe<Array<Maybe<Mother>>>;
  GetAllNavigation?: Maybe<Array<Maybe<Navigation>>>;
  GetAllNote?: Maybe<Array<Maybe<Note>>>;
  GetAllNoteType?: Maybe<Array<Maybe<NoteType>>>;
  GetAllPermission?: Maybe<Array<Maybe<Permission>>>;
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
  GetAllRelation?: Maybe<Array<Maybe<Relation>>>;
  GetAllShortenUrlEntity?: Maybe<Array<Maybe<ShortenUrlEntity>>>;
  GetAllSiteAddress?: Maybe<Array<Maybe<SiteAddress>>>;
  GetAllStoryBook: Array<Maybe<StoryBook>>;
  GetAllStoryBookPartQuestion: Array<Maybe<StoryBookPartQuestion>>;
  GetAllStoryBookParts: Array<Maybe<StoryBookParts>>;
  GetAllSystemSetting?: Maybe<Array<Maybe<SystemSetting>>>;
  GetAllTheme: Array<Maybe<Theme>>;
  GetAllThemeDay: Array<Maybe<ThemeDay>>;
  GetAllUserConsent?: Maybe<Array<Maybe<UserConsent>>>;
  GetAllUserHierarchyEntity?: Maybe<Array<Maybe<UserHierarchyEntity>>>;
  GetAllWorkflowStatus?: Maybe<Array<Maybe<WorkflowStatus>>>;
  GetAllWorkflowStatusType?: Maybe<Array<Maybe<WorkflowStatusType>>>;
  GetAuditLogTypeById?: Maybe<AuditLogType>;
  GetCaregiverById?: Maybe<Caregiver>;
  GetChildById?: Maybe<Child>;
  GetChildProgressReportById?: Maybe<ChildProgressReport>;
  GetClassProgrammeById?: Maybe<ClassProgramme>;
  GetClassroomById?: Maybe<Classroom>;
  GetClassroomGroupById?: Maybe<ClassroomGroup>;
  GetCoachById?: Maybe<Coach>;
  GetConsentById: Array<Maybe<Consent>>;
  GetDailyProgrammeById?: Maybe<DailyProgramme>;
  GetDocumentById?: Maybe<Document>;
  GetDocumentTypeById?: Maybe<DocumentType>;
  GetEducationById?: Maybe<Education>;
  GetFranchisorById?: Maybe<Franchisor>;
  GetGenderById?: Maybe<Gender>;
  GetGrantById?: Maybe<Grant>;
  GetHealthCareWorkerById?: Maybe<HealthCareWorker>;
  GetHierarchyEntityById?: Maybe<HierarchyEntity>;
  GetInfantById?: Maybe<Infant>;
  GetLanguageById?: Maybe<Language>;
  GetLearnerById?: Maybe<Learner>;
  GetMessageTemplateById?: Maybe<MessageTemplate>;
  GetMotherById?: Maybe<Mother>;
  GetNavigationById?: Maybe<Navigation>;
  GetNoteById?: Maybe<Note>;
  GetNoteTypeById?: Maybe<NoteType>;
  GetPermissionById?: Maybe<Permission>;
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
  GetRelationById?: Maybe<Relation>;
  GetShortenUrlEntityById?: Maybe<ShortenUrlEntity>;
  GetSiteAddressById?: Maybe<SiteAddress>;
  GetStoryBookById: Array<Maybe<StoryBook>>;
  GetStoryBookPartQuestionById: Array<Maybe<StoryBookPartQuestion>>;
  GetStoryBookPartsById: Array<Maybe<StoryBookParts>>;
  GetSystemSettingById?: Maybe<SystemSetting>;
  GetThemeById: Array<Maybe<Theme>>;
  GetThemeDayById: Array<Maybe<ThemeDay>>;
  GetUserConsentById?: Maybe<UserConsent>;
  GetUserHierarchyEntityById?: Maybe<UserHierarchyEntity>;
  GetWorkflowStatusById?: Maybe<WorkflowStatus>;
  GetWorkflowStatusTypeById?: Maybe<WorkflowStatusType>;
  absenteeByUserId?: Maybe<Array<Maybe<Absentees>>>;
  allCaregiverByPractitioner?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiversForHealthCareWorker?: Maybe<Array<Maybe<Caregiver>>>;
  allChildrenForCoach?: Maybe<Array<Maybe<Child>>>;
  allChildrenForPractitioner?: Maybe<Array<Maybe<Child>>>;
  allChildrenForPrincipal?: Maybe<Array<Maybe<Child>>>;
  allClassroomGroupsForCoach?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomGroupsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  allClassroomsForCoach?: Maybe<Array<Maybe<Classroom>>>;
  allClassroomsForPractitioner?: Maybe<Array<Maybe<Classroom>>>;
  allClassroomsForPrincipal?: Maybe<Array<Maybe<Classroom>>>;
  allCoachesForFranchisor?: Maybe<Array<Maybe<Coach>>>;
  allDocument?: Maybe<Array<Maybe<Document>>>;
  allHealthCareWorkers?: Maybe<Array<Maybe<HealthCareWorker>>>;
  allInfants?: Maybe<Array<Maybe<Infant>>>;
  allInfantsForHealthCareWorker?: Maybe<Array<Maybe<Infant>>>;
  allMothers?: Maybe<Array<Maybe<Mother>>>;
  allMothersForHealthCareWorker?: Maybe<Array<Maybe<Mother>>>;
  allPractitionersForCoach?: Maybe<Array<Maybe<Practitioner>>>;
  allPractitionersForPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipal?: Maybe<Array<Maybe<Practitioner>>>;
  allPrincipals?: Maybe<Array<Maybe<Principal>>>;
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  childAttendanceReport?: Maybe<ChildAttendanceReportModel>;
  childByUserId?: Maybe<Child>;
  childProgressReport?: Maybe<ChildProgressReportDetailedModel>;
  childProgressReportSummary?: Maybe<
    Array<Maybe<ChildProgressReportSummaryModel>>
  >;
  childrenAttendedVsAbsentMetrics?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  childrenByClassroomId?: Maybe<Array<Maybe<Child>>>;
  childrenMetrics?: Maybe<ChildrenMetricReport>;
  classroomDetailsForPractitioner?: Maybe<PrincipalClassroom>;
  classroomGroupClassroomsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  coachByCoachUserId?: Maybe<Coach>;
  coachByPractitionerId?: Maybe<Coach>;
  coachByUserId?: Maybe<Coach>;
  contentDefinitions?: Maybe<Array<Maybe<ContentDefinitionModel>>>;
  contentDefinitionsExcelTemplateGenerator?: Maybe<FileModel>;
  contentTypes?: Maybe<Array<Maybe<ContentType>>>;
  franchisorByUserId?: Maybe<Franchisor>;
  generateChildProgressReport?: Maybe<Scalars['String']>;
  hasContentTypeBeenTranslated: Scalars['Boolean'];
  healthCareWorkerByUserId?: Maybe<HealthCareWorker>;
  holidaysByMonth?: Maybe<Array<Maybe<Holiday>>>;
  holidaysByYear?: Maybe<Array<Maybe<Holiday>>>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  monthlyAttendanceRecordCSV?: Maybe<FileModel>;
  monthlyAttendanceReport?: Maybe<Array<Maybe<MonthlyAttendanceReportModel>>>;
  motherById?: Maybe<Infant>;
  openAccessAddChildDetail?: Maybe<ChildTokenAccessModel>;
  openConsent: Array<Maybe<Consent>>;
  openLanguage: Array<Maybe<Language>>;
  permissionGroups?: Maybe<Array<Maybe<PermissionGroupModel>>>;
  practitionerByIdNumber?: Maybe<ApplicationUser>;
  practitionerByUserId?: Maybe<Practitioner>;
  practitionerExcelTemplateGenerator?: Maybe<FileModel>;
  practitionerMetrics?: Maybe<PractitionerMetricReport>;
  practitionerNewSignupMetric: Scalars['Int'];
  principalById?: Maybe<Practitioner>;
  principalByUserId?: Maybe<Practitioner>;
  roles?: Maybe<Array<Maybe<IdentityRole>>>;
  settings?: Maybe<SettingsType>;
  tenantContext?: Maybe<TenantModel>;
  totalDaysAbsent: Scalars['Int'];
  userById?: Maybe<ApplicationUser>;
  users?: Maybe<Array<Maybe<ApplicationUser>>>;
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
  where?: InputMaybe<AbsenteesFilterInput>;
};

export type QueryGetAllActivityArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllAuditLogTypeArgs = {
  where?: InputMaybe<AuditLogTypeFilterInput>;
};

export type QueryGetAllCaregiverArgs = {
  where?: InputMaybe<CaregiverFilterInput>;
};

export type QueryGetAllChildArgs = {
  where?: InputMaybe<ChildFilterInput>;
};

export type QueryGetAllChildProgressReportArgs = {
  where?: InputMaybe<ChildProgressReportFilterInput>;
};

export type QueryGetAllClassProgrammeArgs = {
  where?: InputMaybe<ClassProgrammeFilterInput>;
};

export type QueryGetAllClassroomArgs = {
  where?: InputMaybe<ClassroomFilterInput>;
};

export type QueryGetAllClassroomGroupArgs = {
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetAllCoachArgs = {
  where?: InputMaybe<CoachFilterInput>;
};

export type QueryGetAllConsentArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllDailyProgrammeArgs = {
  where?: InputMaybe<DailyProgrammeFilterInput>;
};

export type QueryGetAllDocumentArgs = {
  where?: InputMaybe<DocumentFilterInput>;
};

export type QueryGetAllDocumentTypeArgs = {
  where?: InputMaybe<DocumentTypeFilterInput>;
};

export type QueryGetAllEducationArgs = {
  where?: InputMaybe<EducationFilterInput>;
};

export type QueryGetAllFranchisorArgs = {
  where?: InputMaybe<FranchisorFilterInput>;
};

export type QueryGetAllGenderArgs = {
  where?: InputMaybe<GenderFilterInput>;
};

export type QueryGetAllGrantArgs = {
  where?: InputMaybe<GrantFilterInput>;
};

export type QueryGetAllHealthCareWorkerArgs = {
  where?: InputMaybe<HealthCareWorkerFilterInput>;
};

export type QueryGetAllHierarchyEntityArgs = {
  where?: InputMaybe<HierarchyEntityFilterInput>;
};

export type QueryGetAllInfantArgs = {
  where?: InputMaybe<InfantFilterInput>;
};

export type QueryGetAllLanguageArgs = {
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetAllLearnerArgs = {
  where?: InputMaybe<LearnerFilterInput>;
};

export type QueryGetAllMessageTemplateArgs = {
  where?: InputMaybe<MessageTemplateFilterInput>;
};

export type QueryGetAllMotherArgs = {
  where?: InputMaybe<MotherFilterInput>;
};

export type QueryGetAllNavigationArgs = {
  where?: InputMaybe<NavigationFilterInput>;
};

export type QueryGetAllNoteArgs = {
  where?: InputMaybe<NoteFilterInput>;
};

export type QueryGetAllNoteTypeArgs = {
  where?: InputMaybe<NoteTypeFilterInput>;
};

export type QueryGetAllPermissionArgs = {
  where?: InputMaybe<PermissionFilterInput>;
};

export type QueryGetAllPractitionerArgs = {
  where?: InputMaybe<PractitionerFilterInput>;
};

export type QueryGetAllPrincipalArgs = {
  where?: InputMaybe<PrincipalFilterInput>;
};

export type QueryGetAllProgrammeArgs = {
  where?: InputMaybe<ProgrammeFilterInput>;
};

export type QueryGetAllProgrammeAttendanceReasonArgs = {
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
  where?: InputMaybe<ProvinceFilterInput>;
};

export type QueryGetAllRaceArgs = {
  where?: InputMaybe<RaceFilterInput>;
};

export type QueryGetAllReasonForLeavingArgs = {
  where?: InputMaybe<ReasonForLeavingFilterInput>;
};

export type QueryGetAllRelationArgs = {
  where?: InputMaybe<RelationFilterInput>;
};

export type QueryGetAllShortenUrlEntityArgs = {
  where?: InputMaybe<ShortenUrlEntityFilterInput>;
};

export type QueryGetAllSiteAddressArgs = {
  where?: InputMaybe<SiteAddressFilterInput>;
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
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetAllThemeArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllThemeDayArgs = {
  locale?: InputMaybe<Scalars['String']>;
  localeId?: InputMaybe<Scalars['String']>;
};

export type QueryGetAllUserConsentArgs = {
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetAllUserHierarchyEntityArgs = {
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetAllWorkflowStatusArgs = {
  where?: InputMaybe<WorkflowStatusFilterInput>;
};

export type QueryGetAllWorkflowStatusTypeArgs = {
  where?: InputMaybe<WorkflowStatusTypeFilterInput>;
};

export type QueryGetAuditLogTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<AuditLogTypeFilterInput>;
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

export type QueryGetHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<HierarchyEntityFilterInput>;
};

export type QueryGetInfantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<InfantFilterInput>;
};

export type QueryGetLanguageByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LanguageFilterInput>;
};

export type QueryGetLearnerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<LearnerFilterInput>;
};

export type QueryGetMessageTemplateByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<MessageTemplateFilterInput>;
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

export type QueryGetPermissionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<PermissionFilterInput>;
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

export type QueryGetUserConsentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetUserHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
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

export type QueryAllCaregiverByPractitionerArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
};

export type QueryAllCaregiversForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllChildrenForPrincipalArgs = {
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

export type QueryAllDocumentArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllInfantsForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryAllMothersForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryAllPractitionersForCoachArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllPractitionersForPrincipalArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAttendanceArgs = {
  monthOfYear?: InputMaybe<Scalars['Int']>;
  weekOfYear?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AttendanceFilterInput>;
  year: Scalars['Int'];
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

export type QueryChildProgressReportArgs = {
  reportId: Scalars['UUID'];
};

export type QueryChildProgressReportSummaryArgs = {
  count: Scalars['Int'];
};

export type QueryChildrenAttendedVsAbsentMetricsArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type QueryChildrenByClassroomIdArgs = {
  classroomId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomDetailsForPractitionerArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryClassroomGroupClassroomsForPractitionerArgs = {
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

export type QueryContentDefinitionsExcelTemplateGeneratorArgs = {
  contentTypeId: Scalars['Int'];
};

export type QueryFranchisorByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryGenerateChildProgressReportArgs = {
  childId: Scalars['UUID'];
  classgroupId: Scalars['UUID'];
  reportDate: Scalars['DateTime'];
};

export type QueryHasContentTypeBeenTranslatedArgs = {
  id: Scalars['Int'];
  localeId: Scalars['UUID'];
};

export type QueryHealthCareWorkerByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryHolidaysByMonthArgs = {
  endMonth: Scalars['DateTime'];
  startMonth: Scalars['DateTime'];
};

export type QueryHolidaysByYearArgs = {
  year: Scalars['Int'];
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

export type QueryMotherByIdArgs = {
  id?: InputMaybe<Scalars['String']>;
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

export type QueryPractitionerByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryPractitionerNewSignupMetricArgs = {
  fromDate: Scalars['DateTime'];
  toDate: Scalars['DateTime'];
};

export type QueryPrincipalByIdArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryPrincipalByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryTotalDaysAbsentArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryUserByIdArgs = {
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

export type Setting_Invitations = {
  __typename?: 'Setting_Invitations';
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
  Login: Scalars['String'];
};

export type Setting_SendGrid = {
  __typename?: 'Setting_SendGrid';
  FromEmail: Scalars['String'];
  Key: Scalars['String'];
  User: Scalars['String'];
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

export type SettingsType = {
  __typename?: 'SettingsType';
  Azure: Setting_Azure;
  BulkSms: Setting_BulkSms;
  Children: Setting_Children;
  Google: Setting_Google;
  Holder?: Maybe<Scalars['String']>;
  Invitations: Setting_Invitations;
  Jwts: Setting_Jwts;
  RapidApi: Setting_RapidApi;
  Reporting: Setting_Reporting;
  Security: Setting_Security;
  SendGrid: Setting_SendGrid;
  Tokens: Setting_Tokens;
  UrlShortner: Setting_UrlShortner;
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

export type SiteAddress = {
  __typename?: 'SiteAddress';
  addressLine1?: Maybe<Scalars['String']>;
  addressLine2?: Maybe<Scalars['String']>;
  addressLine3?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
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
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
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
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  PostalCode?: InputMaybe<Scalars['String']>;
  Province?: InputMaybe<ProvinceInput>;
  ProvinceId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  Ward?: InputMaybe<Scalars['String']>;
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

export type TenantModel = {
  __typename?: 'TenantModel';
  adminSiteAddress?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  organisationName?: Maybe<Scalars['String']>;
  siteAddress?: Maybe<Scalars['String']>;
  tenantType: TenantType;
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

export type UserModelInput = {
  contactPreference?: InputMaybe<Scalars['String']>;
  dateOfBirth: Scalars['DateTime'];
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  isSouthAfricanCitizen: Scalars['Boolean'];
  password?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
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
