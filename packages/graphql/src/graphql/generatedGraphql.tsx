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
  emergencyContactPhoneNumber?: Maybe<Scalars['String']>;
  emergencyContactSurname?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  franchisorObjectData?: Maybe<Franchisor>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  genderId?: Maybe<Scalars['UUID']>;
  id?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
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
  emergencyContactFirstName?: InputMaybe<StringOperationFilterInput>;
  emergencyContactPhoneNumber?: InputMaybe<StringOperationFilterInput>;
  emergencyContactSurname?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  franchisorObjectData?: InputMaybe<FranchisorFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<GenderFilterInput>;
  genderId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<StringOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isSouthAfricanCitizen?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  emergencyContactFirstName?: InputMaybe<Scalars['String']>;
  emergencyContactPhoneNumber?: InputMaybe<Scalars['String']>;
  emergencyContactSurname?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  franchisorObjectData?: InputMaybe<FranchisorInput>;
  fullName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<GenderInput>;
  genderId?: InputMaybe<Scalars['UUID']>;
  id?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  isSouthAfricanCitizen: Scalars['Boolean'];
  language?: InputMaybe<LanguageInput>;
  languageId?: InputMaybe<Scalars['UUID']>;
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
  isMother: Scalars['Boolean'];
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
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  idNumber?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isMother?: InputMaybe<BooleanOperationFilterInput>;
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
  HealthCareWorker?: InputMaybe<HealthCareWorkerInput>;
  HealthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IdNumber?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
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
  insertedBy?: Maybe<Scalars['String']>;
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
  fullName?: Maybe<Scalars['String']>;
  practitionerName?: Maybe<Scalars['String']>;
};

export type ChildFilterInput = {
  allergies?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<ChildFilterInput>>;
  caregiver?: InputMaybe<CaregiverFilterInput>;
  caregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  disabilities?: InputMaybe<StringOperationFilterInput>;
  documents?: InputMaybe<ListFilterInputTypeOfDocumentFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedBy?: InputMaybe<StringOperationFilterInput>;
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
  InsertedBy?: InputMaybe<Scalars['String']>;
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

export type EventRecordChildType = {
  __typename?: 'EventRecordChildType';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  normalizedName?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type EventRecordChildTypeFilterInput = {
  and?: InputMaybe<Array<EventRecordChildTypeFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  normalizedName?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<EventRecordChildTypeFilterInput>>;
  type?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type EventRecordChildTypeInput = {
  Description?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Name?: InputMaybe<Scalars['String']>;
  NormalizedName?: InputMaybe<Scalars['String']>;
  Type?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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

export type EventRecordType = {
  __typename?: 'EventRecordType';
  children?: Maybe<Array<Maybe<EventRecordChildType>>>;
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
  children?: InputMaybe<ListFilterInputTypeOfEventRecordChildTypeFilterInput>;
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
  Children?: InputMaybe<Array<InputMaybe<EventRecordChildTypeInput>>>;
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
  ContentImage = 'CONTENT_IMAGE',
  MaternalCaseRecord = 'MATERNAL_CASE_RECORD',
  Practitioner = 'PRACTITIONER',
  ProfileImage = 'PROFILE_IMAGE',
  ProgressTrackingCategory = 'PROGRESS_TRACKING_CATEGORY',
  ProgressTrackingLevel = 'PROGRESS_TRACKING_LEVEL',
  ProgressTrackingSubCategory = 'PROGRESS_TRACKING_SUB_CATEGORY',
  ReportTemplates = 'REPORT_TEMPLATES',
  RoadToHealthBook = 'ROAD_TO_HEALTH_BOOK',
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
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isRegistered: Scalars['Boolean'];
  language?: Maybe<Language>;
  languageId?: Maybe<Scalars['UUID']>;
  teamLead?: Maybe<TeamLead>;
  teamLeadId?: Maybe<Scalars['UUID']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  user?: Maybe<ApplicationUser>;
  userId?: Maybe<Scalars['String']>;
};

export type HealthCareWorkerFilterInput = {
  and?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  consentForPhoto?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  isRegistered?: InputMaybe<BooleanOperationFilterInput>;
  language?: InputMaybe<LanguageFilterInput>;
  languageId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<HealthCareWorkerFilterInput>>;
  teamLead?: InputMaybe<TeamLeadFilterInput>;
  teamLeadId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  user?: InputMaybe<ApplicationUserFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type HealthCareWorkerInput = {
  ConsentForPhoto: Scalars['Boolean'];
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsRegistered: Scalars['Boolean'];
  Language?: InputMaybe<LanguageInput>;
  LanguageId?: InputMaybe<Scalars['UUID']>;
  TeamLead?: InputMaybe<TeamLeadInput>;
  TeamLeadId?: InputMaybe<Scalars['UUID']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type HealthCareWorkerModelInput = {
  isRegistered: Scalars['Boolean'];
  languageId?: InputMaybe<Scalars['UUID']>;
  teamLead?: InputMaybe<TeamLeadInput>;
  teamLeadId?: InputMaybe<Scalars['UUID']>;
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
  id: Scalars['String'];
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
  motherCaregiverId?: Maybe<Scalars['UUID']>;
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
  motherCaregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  MotherCaregiverId?: InputMaybe<Scalars['UUID']>;
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
  mother?: InputMaybe<MotherModelInput>;
  motherCaregiverId?: InputMaybe<Scalars['UUID']>;
  userId?: InputMaybe<Scalars['String']>;
  weightAtBirth?: InputMaybe<Scalars['Decimal']>;
};

export type IntegrationMapping = {
  __typename?: 'IntegrationMapping';
  afterJSON?: Maybe<Scalars['String']>;
  beforeJSON?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  integrationSystem?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  lastCheckedDate: Scalars['DateTime'];
  lastUpdatedDate: Scalars['DateTime'];
  localEntity?: Maybe<Scalars['String']>;
  localId?: Maybe<Scalars['String']>;
  remoteEntity?: Maybe<Scalars['String']>;
  remoteId?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type IntegrationMappingFilterInput = {
  afterJSON?: InputMaybe<StringOperationFilterInput>;
  and?: InputMaybe<Array<IntegrationMappingFilterInput>>;
  beforeJSON?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  integrationSystem?: InputMaybe<StringOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  lastCheckedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  lastUpdatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  localEntity?: InputMaybe<StringOperationFilterInput>;
  localId?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<IntegrationMappingFilterInput>>;
  remoteEntity?: InputMaybe<StringOperationFilterInput>;
  remoteId?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type IntegrationMappingInput = {
  AfterJSON?: InputMaybe<Scalars['String']>;
  BeforeJSON?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IntegrationSystem?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  LastCheckedDate: Scalars['DateTime'];
  LastUpdatedDate: Scalars['DateTime'];
  LocalEntity?: InputMaybe<Scalars['String']>;
  LocalId?: InputMaybe<Scalars['String']>;
  RemoteEntity?: InputMaybe<Scalars['String']>;
  RemoteId?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type ListFilterInputTypeOfEventRecordChildTypeFilterInput = {
  all?: InputMaybe<EventRecordChildTypeFilterInput>;
  any?: InputMaybe<Scalars['Boolean']>;
  none?: InputMaybe<EventRecordChildTypeFilterInput>;
  some?: InputMaybe<EventRecordChildTypeFilterInput>;
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

export type MappedCoach = {
  __typename?: 'MappedCoach';
  contactNumber?: Maybe<Scalars['String']>;
  createdOn: Scalars['DateTime'];
  firstName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  guid?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  localisedId?: Maybe<Scalars['String']>;
  owner?: Maybe<Owner>;
  status?: Maybe<Scalars['String']>;
  surname?: Maybe<Scalars['String']>;
};

export type MappedCoachInput = {
  contactNumber?: InputMaybe<Scalars['String']>;
  createdOn: Scalars['DateTime'];
  firstName?: InputMaybe<Scalars['String']>;
  fullName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  guid?: InputMaybe<Scalars['String']>;
  idNumber?: InputMaybe<Scalars['String']>;
  localisedId?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<OwnerInput>;
  status?: InputMaybe<Scalars['String']>;
  surname?: InputMaybe<Scalars['String']>;
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
  caregiver?: Maybe<Caregiver>;
  expectedDateOfDelivery?: Maybe<Scalars['DateTime']>;
  healthCareWorker?: Maybe<HealthCareWorker>;
  healthCareWorkerId?: Maybe<Scalars['UUID']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  linkedCaregiverId?: Maybe<Scalars['UUID']>;
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
  expectedDateOfDelivery?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  healthCareWorker?: InputMaybe<HealthCareWorkerFilterInput>;
  healthCareWorkerId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  linkedCaregiverId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
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
  ExpectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  HealthCareWorker?: InputMaybe<HealthCareWorkerInput>;
  HealthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  LinkedCaregiverId?: InputMaybe<Scalars['UUID']>;
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
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  expectedDateOfDelivery?: InputMaybe<Scalars['DateTime']>;
  firstName?: InputMaybe<Scalars['String']>;
  healthCareWorkerId?: InputMaybe<Scalars['UUID']>;
  linkedCaregiverId?: InputMaybe<Scalars['UUID']>;
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
  addAdditionalVisitForMother?: Maybe<Visit>;
  addClinic?: Maybe<Clinic>;
  addCoachToFranchisor?: Maybe<Coach>;
  addEventRecord?: Maybe<EventRecord>;
  addEventRecordType?: Maybe<EventRecordType>;
  addHealthCareWorker?: Maybe<HealthCareWorker>;
  addInfant?: Maybe<Infant>;
  addMother?: Maybe<Mother>;
  addPermissionsToNavigation: Scalars['Boolean'];
  addPermissionsToRole: Scalars['Boolean'];
  addPractitionerToCoach?: Maybe<Practitioner>;
  addPractitionerToPrincipal?: Maybe<Practitioner>;
  addReassignmentForPractitionerService: Scalars['Boolean'];
  addRole?: Maybe<IdentityRole>;
  addTeamLead?: Maybe<TeamLead>;
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
  createClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  createClassroom?: Maybe<Classroom>;
  createClassroomGroup?: Maybe<ClassroomGroup>;
  createClinic?: Maybe<Clinic>;
  createCoach?: Maybe<Coach>;
  createCoachUser?: Maybe<Coach>;
  createConsent?: Maybe<Scalars['String']>;
  createContentDefinition?: Maybe<ContentDefinitionModel>;
  createDailyProgramme?: Maybe<DailyProgramme>;
  createDocument?: Maybe<Document>;
  createDocumentType?: Maybe<DocumentType>;
  createEducation?: Maybe<Education>;
  createEventRecord?: Maybe<EventRecord>;
  createEventRecordChildType?: Maybe<EventRecordChildType>;
  createEventRecordType?: Maybe<EventRecordType>;
  createFranchisor?: Maybe<Franchisor>;
  createGender?: Maybe<Gender>;
  createGrant?: Maybe<Grant>;
  createHealthCareWorker?: Maybe<HealthCareWorker>;
  createHierarchyEntity?: Maybe<HierarchyEntity>;
  createInfant?: Maybe<Infant>;
  createIntegrationMapping?: Maybe<IntegrationMapping>;
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
  createSL_Ingestion_ChildCaregiver?: Maybe<Sl_Ingestion_ChildCaregiver>;
  createSL_Ingestion_User?: Maybe<Sl_Ingestion_User>;
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
  createSystemSetting?: Maybe<SystemSetting>;
  createTeamLead?: Maybe<TeamLead>;
  createTheme?: Maybe<Scalars['String']>;
  createThemeDay?: Maybe<Scalars['String']>;
  createUserConsent?: Maybe<UserConsent>;
  createUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  createVisit?: Maybe<Visit>;
  createVisitType?: Maybe<VisitType>;
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
  deleteClassReassignmentHistory?: Maybe<Scalars['Boolean']>;
  deleteClassroom?: Maybe<Scalars['Boolean']>;
  deleteClassroomGroup?: Maybe<Scalars['Boolean']>;
  deleteClinic?: Maybe<Scalars['Boolean']>;
  deleteCoach?: Maybe<Scalars['Boolean']>;
  deleteCoachForFranchisor?: Maybe<Coach>;
  deleteConsent?: Maybe<Scalars['Boolean']>;
  deleteContentDefinition: Scalars['Boolean'];
  deleteDailyProgramme?: Maybe<Scalars['Boolean']>;
  deleteDocument?: Maybe<Scalars['Boolean']>;
  deleteDocumentType?: Maybe<Scalars['Boolean']>;
  deleteEducation?: Maybe<Scalars['Boolean']>;
  deleteEventRecord?: Maybe<Scalars['Boolean']>;
  deleteEventRecordChildType?: Maybe<Scalars['Boolean']>;
  deleteEventRecordType?: Maybe<Scalars['Boolean']>;
  deleteFranchisor?: Maybe<Scalars['Boolean']>;
  deleteGender?: Maybe<Scalars['Boolean']>;
  deleteGrant?: Maybe<Scalars['Boolean']>;
  deleteHealthCareWorker?: Maybe<Scalars['Boolean']>;
  deleteHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteInfant?: Maybe<Scalars['Boolean']>;
  deleteIntegrationMapping?: Maybe<Scalars['Boolean']>;
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
  deleteSL_Ingestion_ChildCaregiver?: Maybe<Scalars['Boolean']>;
  deleteSL_Ingestion_User?: Maybe<Scalars['Boolean']>;
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
  deleteSystemSetting?: Maybe<Scalars['Boolean']>;
  deleteTeamLead?: Maybe<Scalars['Boolean']>;
  deleteTheme?: Maybe<Scalars['Boolean']>;
  deleteThemeDay?: Maybe<Scalars['Boolean']>;
  deleteUser: Scalars['Boolean'];
  deleteUserConsent?: Maybe<Scalars['Boolean']>;
  deleteUserHierarchyEntity?: Maybe<Scalars['Boolean']>;
  deleteVisit?: Maybe<Scalars['Boolean']>;
  deleteVisitType?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatus?: Maybe<Scalars['Boolean']>;
  deleteWorkflowStatusType?: Maybe<Scalars['Boolean']>;
  demotePractitionerAsPrincipal?: Maybe<Practitioner>;
  expireRelationshipLinksService: Scalars['Boolean'];
  fileUpload?: Maybe<DocumentModel>;
  generateCaregiverChildToken?: Maybe<Scalars['String']>;
  importAll: Scalars['Boolean'];
  importAllChildren: Scalars['Boolean'];
  importAllChildrenIngestDB: Scalars['Boolean'];
  importAllIngestDB: Scalars['Boolean'];
  integrationByFranchisor?: Maybe<Array<Maybe<MappedCoach>>>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  openAccessAddChild: Scalars['Boolean'];
  practitionerImport: Scalars['Boolean'];
  promotePractitionerToPrincipal?: Maybe<Principal>;
  reassignAbsenteeFromHistory: Scalars['Boolean'];
  reassignAllClassroomsFromHistoryService: Scalars['Boolean'];
  reassignClassroomsFromHistoryService: Scalars['Boolean'];
  refreshCaregiverChildToken?: Maybe<Scalars['String']>;
  remapPrincipalToPrincipal?: Maybe<Practitioner>;
  removePermissionsFromNavigation: Scalars['Boolean'];
  removePermissionsFromRole: Scalars['Boolean'];
  removeUserFromRoles: Scalars['Boolean'];
  resetUserPassword: Scalars['Boolean'];
  sendCoachInviteToApplication: Scalars['Boolean'];
  sendInviteToApplication: Scalars['Boolean'];
  sendPractitionerInviteToApplication: Scalars['Boolean'];
  trackAttendance: Scalars['Boolean'];
  updateAbsentees?: Maybe<Absentees>;
  updateActivity?: Maybe<Activity>;
  updateAuditLogType?: Maybe<AuditLogType>;
  updateCareGiverGrants: Scalars['Boolean'];
  updateCaregiver?: Maybe<Caregiver>;
  updateChild?: Maybe<Child>;
  updateChildProgressReport?: Maybe<ChildProgressReport>;
  updateClassProgramme?: Maybe<ClassProgramme>;
  updateClassReassignmentHistory?: Maybe<ClassReassignmentHistory>;
  updateClassroom?: Maybe<Classroom>;
  updateClassroomGroup?: Maybe<ClassroomGroup>;
  updateClinic?: Maybe<Clinic>;
  updateCoach?: Maybe<Coach>;
  updateConsent?: Maybe<Consent>;
  updateDailyProgramme?: Maybe<DailyProgramme>;
  updateDocument?: Maybe<Document>;
  updateDocumentType?: Maybe<DocumentType>;
  updateEducation?: Maybe<Education>;
  updateEventRecord?: Maybe<EventRecord>;
  updateEventRecordChildType?: Maybe<EventRecordChildType>;
  updateEventRecordType?: Maybe<EventRecordType>;
  updateFranchisor?: Maybe<Franchisor>;
  updateGender?: Maybe<Gender>;
  updateGrant?: Maybe<Grant>;
  updateHealthCareWorker?: Maybe<HealthCareWorker>;
  updateHierarchyEntity?: Maybe<HierarchyEntity>;
  updateInfant?: Maybe<Infant>;
  updateIntegrationMapping?: Maybe<IntegrationMapping>;
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
  updatePractitionerEmergencyContact: Scalars['Boolean'];
  updatePractitionerIsFundaAppAdmin: Scalars['Boolean'];
  updatePractitionerProgress: Scalars['Decimal'];
  updatePractitionerRegistered: Scalars['Boolean'];
  updatePractitionerShareInfo: Scalars['Boolean'];
  updatePractitionerToTeachClassroom?: Maybe<ClassroomGroup>;
  updatePrincipal?: Maybe<Principal>;
  updatePrincipalInvitation?: Maybe<PrincipalInvitationStatus>;
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
  updateSL_Ingestion_ChildCaregiver?: Maybe<Sl_Ingestion_ChildCaregiver>;
  updateSL_Ingestion_User?: Maybe<Sl_Ingestion_User>;
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
  updateStoryBookPartQuestion?: Maybe<StoryBookPartQuestion>;
  updateStoryBookParts?: Maybe<StoryBookParts>;
  updateSystemSetting?: Maybe<SystemSetting>;
  updateTeamLead?: Maybe<TeamLead>;
  updateTenantTheme: Scalars['Boolean'];
  updateTheme?: Maybe<Theme>;
  updateThemeDay?: Maybe<ThemeDay>;
  updateUser?: Maybe<ApplicationUser>;
  updateUserConsent?: Maybe<UserConsent>;
  updateUserHierarchyEntity?: Maybe<UserHierarchyEntity>;
  updateVisit?: Maybe<Visit>;
  updateVisitType?: Maybe<VisitType>;
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

export type MutationAddEventRecordArgs = {
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationAddEventRecordTypeArgs = {
  input?: InputMaybe<EventRecordTypeModelInput>;
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

export type MutationCreateCoachArgs = {
  input?: InputMaybe<CoachInput>;
};

export type MutationCreateCoachUserArgs = {
  coach?: InputMaybe<MappedCoachInput>;
  franchisorId?: InputMaybe<Scalars['String']>;
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

export type MutationCreateEventRecordArgs = {
  input?: InputMaybe<EventRecordInput>;
};

export type MutationCreateEventRecordChildTypeArgs = {
  input?: InputMaybe<EventRecordChildTypeInput>;
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

export type MutationCreateHierarchyEntityArgs = {
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationCreateInfantArgs = {
  input?: InputMaybe<InfantInput>;
};

export type MutationCreateIntegrationMappingArgs = {
  input?: InputMaybe<IntegrationMappingInput>;
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

export type MutationCreateSl_Ingestion_ChildCaregiverArgs = {
  input?: InputMaybe<Sl_Ingestion_ChildCaregiverInput>;
};

export type MutationCreateSl_Ingestion_UserArgs = {
  input?: InputMaybe<Sl_Ingestion_UserInput>;
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

export type MutationCreateUserConsentArgs = {
  input?: InputMaybe<UserConsentInput>;
};

export type MutationCreateUserHierarchyEntityArgs = {
  input?: InputMaybe<UserHierarchyEntityInput>;
};

export type MutationCreateVisitArgs = {
  input?: InputMaybe<VisitInput>;
};

export type MutationCreateVisitTypeArgs = {
  input?: InputMaybe<VisitTypeInput>;
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

export type MutationDeleteEventRecordArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteEventRecordChildTypeArgs = {
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

export type MutationDeleteHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteInfantArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteIntegrationMappingArgs = {
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

export type MutationDeleteSl_Ingestion_ChildCaregiverArgs = {
  id?: InputMaybe<Scalars['UUID']>;
};

export type MutationDeleteSl_Ingestion_UserArgs = {
  id?: InputMaybe<Scalars['UUID']>;
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

export type MutationDeleteVisitTypeArgs = {
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

export type MutationImportAllArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationImportAllChildrenArgs = {
  file?: InputMaybe<Scalars['String']>;
};

export type MutationIntegrationByFranchisorArgs = {
  franchisorId?: InputMaybe<Scalars['String']>;
  isNew?: Scalars['Boolean'];
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

export type MutationSendPractitionerInviteToApplicationArgs = {
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

export type MutationUpdateEventRecordArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordModelInput>;
};

export type MutationUpdateEventRecordChildTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<EventRecordChildTypeInput>;
};

export type MutationUpdateEventRecordTypeArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<EventRecordTypeModelInput>;
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

export type MutationUpdateHierarchyEntityArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<HierarchyEntityInput>;
};

export type MutationUpdateInfantArgs = {
  id?: InputMaybe<Scalars['String']>;
  input?: InputMaybe<InfantModelInput>;
};

export type MutationUpdateIntegrationMappingArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<IntegrationMappingInput>;
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

export type MutationUpdateSl_Ingestion_ChildCaregiverArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<Sl_Ingestion_ChildCaregiverInput>;
};

export type MutationUpdateSl_Ingestion_UserArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<Sl_Ingestion_UserInput>;
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

export type MutationUpdateVisitTypeArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  input?: InputMaybe<VisitTypeInput>;
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
};

export type Owner = {
  __typename?: 'Owner';
  guid?: Maybe<Scalars['String']>;
};

export type OwnerInput = {
  guid?: InputMaybe<Scalars['String']>;
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
  dateAccepted?: Maybe<Scalars['DateTime']>;
  dateLinked?: Maybe<Scalars['DateTime']>;
  dateToBeRemoved?: Maybe<Scalars['DateTime']>;
  documents?: Maybe<Array<Maybe<Document>>>;
  filterDocumentsByType?: Maybe<Array<Maybe<Document>>>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  progress: Scalars['Decimal'];
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
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
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
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
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
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  Progress: Scalars['Decimal'];
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
  allChildren: Scalars['Int'];
  allClassroomGroups: Scalars['Int'];
  allClassrooms: Scalars['Int'];
  avgChildren: Scalars['Int'];
  completedProfiles: Scalars['Int'];
  outstandingSyncs: Scalars['Int'];
  programTypesData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  statusData?: Maybe<Array<Maybe<MetricReportStatItem>>>;
};

export type PractitionerUserAndNote = {
  __typename?: 'PractitionerUserAndNote';
  appUser?: Maybe<ApplicationUser>;
  note?: Maybe<Scalars['String']>;
};

export type Principal = {
  __typename?: 'Principal';
  attendanceRegisterLink?: Maybe<Scalars['String']>;
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
  isFundaAppAdmin?: Maybe<Scalars['Boolean']>;
  isLeaving?: Maybe<Scalars['Boolean']>;
  isPrincipal?: Maybe<Scalars['Boolean']>;
  isRegistered?: Maybe<Scalars['Boolean']>;
  isTrainee?: Maybe<Scalars['Boolean']>;
  languageUsedInGroups?: Maybe<Scalars['String']>;
  maxChildren?: Maybe<Scalars['Int']>;
  monthSinceFranchisee?: Maybe<Scalars['Int']>;
  parentFees?: Maybe<Scalars['Decimal']>;
  principal?: Maybe<Practitioner>;
  principalHierarchy?: Maybe<Scalars['UUID']>;
  progress: Scalars['Decimal'];
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
  classroomGroupId?: Maybe<Scalars['String']>;
  classroomGroupName?: Maybe<Scalars['String']>;
  classroomId?: Maybe<Scalars['String']>;
  classroomName?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  principalName?: Maybe<Scalars['String']>;
};

export type PrincipalFilterInput = {
  and?: InputMaybe<Array<PrincipalFilterInput>>;
  attendanceRegisterLink?: InputMaybe<StringOperationFilterInput>;
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
  isFundaAppAdmin?: InputMaybe<BooleanOperationFilterInput>;
  isLeaving?: InputMaybe<BooleanOperationFilterInput>;
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
  progress?: InputMaybe<ComparableDecimalOperationFilterInput>;
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
  DateAccepted?: InputMaybe<Scalars['DateTime']>;
  DateLinked?: InputMaybe<Scalars['DateTime']>;
  DateToBeRemoved?: InputMaybe<Scalars['DateTime']>;
  Documents?: InputMaybe<Array<InputMaybe<DocumentInput>>>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  IsFundaAppAdmin?: InputMaybe<Scalars['Boolean']>;
  IsLeaving?: InputMaybe<Scalars['Boolean']>;
  IsPrincipal?: InputMaybe<Scalars['Boolean']>;
  IsRegistered?: InputMaybe<Scalars['Boolean']>;
  IsTrainee?: InputMaybe<Scalars['Boolean']>;
  LanguageUsedInGroups?: InputMaybe<Scalars['String']>;
  MaxChildren?: InputMaybe<Scalars['Int']>;
  MonthSinceFranchisee?: InputMaybe<Scalars['Int']>;
  ParentFees?: InputMaybe<Scalars['Decimal']>;
  Principal?: InputMaybe<PractitionerInput>;
  PrincipalHierarchy?: InputMaybe<Scalars['UUID']>;
  Progress: Scalars['Decimal'];
  ShareInfo?: InputMaybe<Scalars['Boolean']>;
  SigningSignature?: InputMaybe<Scalars['String']>;
  SiteAddress?: InputMaybe<SiteAddressInput>;
  SiteAddressId?: InputMaybe<Scalars['UUID']>;
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  User?: InputMaybe<ApplicationUserInput>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type PrincipalInvitationStatus = {
  __typename?: 'PrincipalInvitationStatus';
  acceptedDate?: Maybe<Scalars['DateTime']>;
  leaving: Scalars['Boolean'];
  leavingDate?: Maybe<Scalars['DateTime']>;
  linkedDate?: Maybe<Scalars['DateTime']>;
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
  GetAllClassReassignmentHistory?: Maybe<
    Array<Maybe<ClassReassignmentHistory>>
  >;
  GetAllClassroom?: Maybe<Array<Maybe<Classroom>>>;
  GetAllClassroomGroup?: Maybe<Array<Maybe<ClassroomGroup>>>;
  GetAllClinic?: Maybe<Array<Maybe<Clinic>>>;
  GetAllCoach?: Maybe<Array<Maybe<Coach>>>;
  GetAllConsent: Array<Maybe<Consent>>;
  GetAllDailyProgramme?: Maybe<Array<Maybe<DailyProgramme>>>;
  GetAllDocument?: Maybe<Array<Maybe<Document>>>;
  GetAllDocumentType?: Maybe<Array<Maybe<DocumentType>>>;
  GetAllEducation?: Maybe<Array<Maybe<Education>>>;
  GetAllEventRecord?: Maybe<Array<Maybe<EventRecord>>>;
  GetAllEventRecordChildType?: Maybe<Array<Maybe<EventRecordChildType>>>;
  GetAllEventRecordType?: Maybe<Array<Maybe<EventRecordType>>>;
  GetAllFranchisor?: Maybe<Array<Maybe<Franchisor>>>;
  GetAllGender?: Maybe<Array<Maybe<Gender>>>;
  GetAllGrant?: Maybe<Array<Maybe<Grant>>>;
  GetAllHealthCareWorker?: Maybe<Array<Maybe<HealthCareWorker>>>;
  GetAllHierarchyEntity?: Maybe<Array<Maybe<HierarchyEntity>>>;
  GetAllInfant?: Maybe<Array<Maybe<Infant>>>;
  GetAllIntegrationMapping?: Maybe<Array<Maybe<IntegrationMapping>>>;
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
  GetAllSL_Ingestion_ChildCaregiver?: Maybe<
    Array<Maybe<Sl_Ingestion_ChildCaregiver>>
  >;
  GetAllSL_Ingestion_User?: Maybe<Array<Maybe<Sl_Ingestion_User>>>;
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
  GetAllSystemSetting?: Maybe<Array<Maybe<SystemSetting>>>;
  GetAllTeamLead?: Maybe<Array<Maybe<TeamLead>>>;
  GetAllTheme: Array<Maybe<Theme>>;
  GetAllThemeDay: Array<Maybe<ThemeDay>>;
  GetAllUserConsent?: Maybe<Array<Maybe<UserConsent>>>;
  GetAllUserHierarchyEntity?: Maybe<Array<Maybe<UserHierarchyEntity>>>;
  GetAllVisit?: Maybe<Array<Maybe<Visit>>>;
  GetAllVisitType?: Maybe<Array<Maybe<VisitType>>>;
  GetAllWorkflowStatus?: Maybe<Array<Maybe<WorkflowStatus>>>;
  GetAllWorkflowStatusType?: Maybe<Array<Maybe<WorkflowStatusType>>>;
  GetAuditLogTypeById?: Maybe<AuditLogType>;
  GetCaregiverById?: Maybe<Caregiver>;
  GetChildById?: Maybe<Child>;
  GetChildProgressReportById?: Maybe<ChildProgressReport>;
  GetClassProgrammeById?: Maybe<ClassProgramme>;
  GetClassReassignmentHistoryById?: Maybe<ClassReassignmentHistory>;
  GetClassroomById?: Maybe<Classroom>;
  GetClassroomGroupById?: Maybe<ClassroomGroup>;
  GetClinicById?: Maybe<Clinic>;
  GetCoachById?: Maybe<Coach>;
  GetConsentById: Array<Maybe<Consent>>;
  GetDailyProgrammeById?: Maybe<DailyProgramme>;
  GetDocumentById?: Maybe<Document>;
  GetDocumentTypeById?: Maybe<DocumentType>;
  GetEducationById?: Maybe<Education>;
  GetEventRecordById?: Maybe<EventRecord>;
  GetEventRecordChildTypeById?: Maybe<EventRecordChildType>;
  GetEventRecordTypeById?: Maybe<EventRecordType>;
  GetFranchisorById?: Maybe<Franchisor>;
  GetGenderById?: Maybe<Gender>;
  GetGrantById?: Maybe<Grant>;
  GetHealthCareWorkerById?: Maybe<HealthCareWorker>;
  GetHierarchyEntityById?: Maybe<HierarchyEntity>;
  GetInfantById?: Maybe<Infant>;
  GetIntegrationMappingById?: Maybe<IntegrationMapping>;
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
  GetSL_Ingestion_ChildCaregiverById?: Maybe<Sl_Ingestion_ChildCaregiver>;
  GetSL_Ingestion_UserById?: Maybe<Sl_Ingestion_User>;
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
  GetSystemSettingById?: Maybe<SystemSetting>;
  GetTeamLeadById?: Maybe<TeamLead>;
  GetThemeById: Array<Maybe<Theme>>;
  GetThemeDayById: Array<Maybe<ThemeDay>>;
  GetUserConsentById?: Maybe<UserConsent>;
  GetUserHierarchyEntityById?: Maybe<UserHierarchyEntity>;
  GetVisitById?: Maybe<Visit>;
  GetVisitTypeById?: Maybe<VisitType>;
  GetWorkflowStatusById?: Maybe<WorkflowStatus>;
  GetWorkflowStatusTypeById?: Maybe<WorkflowStatusType>;
  absenteeByUserId?: Maybe<Array<Maybe<Absentees>>>;
  absentees?: Maybe<Array<Maybe<Absentees>>>;
  allCaregiver?: Maybe<Array<Maybe<Caregiver>>>;
  allCaregiverByPractitioner?: Maybe<Array<Maybe<Caregiver>>>;
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
  allTeamLeads?: Maybe<Array<Maybe<TeamLead>>>;
  attendance?: Maybe<Array<Maybe<Attendance>>>;
  caregiverGrants?: Maybe<Array<Maybe<UserGrant>>>;
  childAttendanceReport?: Maybe<ChildAttendanceReportModel>;
  childByUserId?: Maybe<Child>;
  childCreatedByDetail?: Maybe<ChildCreatedByDetail>;
  childProgressReport?: Maybe<ChildProgressReportDetailedModel>;
  childProgressReportSummary?: Maybe<
    Array<Maybe<ChildProgressReportSummaryModel>>
  >;
  childrenAttendedVsAbsentMetrics?: Maybe<Array<Maybe<MetricReportStatItem>>>;
  childrenByClassroomId?: Maybe<Array<Maybe<Child>>>;
  childrenMetrics?: Maybe<ChildrenMetricReport>;
  classAttendanceMetrics?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classAttendanceMetricsByUser?: Maybe<Array<Maybe<ClassroomMetricReport>>>;
  classroomDetailsForPractitioner?: Maybe<PrincipalClassroom>;
  classroomGroupClassroomsForPractitioner?: Maybe<Array<Maybe<ClassroomGroup>>>;
  classroomNamesForPractitioner?: Maybe<
    Array<Maybe<PractitionerClassroomName>>
  >;
  coachByCoachUserId?: Maybe<Coach>;
  coachByPractitionerId?: Maybe<Coach>;
  coachByUserId?: Maybe<Coach>;
  coachNameByUserId?: Maybe<Scalars['String']>;
  contentDefinitions?: Maybe<Array<Maybe<ContentDefinitionModel>>>;
  contentDefinitionsExcelTemplateGenerator?: Maybe<FileModel>;
  contentTypes?: Maybe<Array<Maybe<ContentType>>>;
  displayMetrics?: Maybe<Array<Maybe<NotificationDisplay>>>;
  franchisorByUserId?: Maybe<Franchisor>;
  franchisorSiteAddressById?: Maybe<SiteAddress>;
  generateChildProgressReport?: Maybe<Scalars['String']>;
  getMoodleSessionForUserId?: Maybe<Scalars['String']>;
  hasContentTypeBeenTranslated: Scalars['Boolean'];
  healthCareWorkerByUserId?: Maybe<HealthCareWorker>;
  holidaysByMonth?: Maybe<Array<Maybe<Holiday>>>;
  holidaysByYear?: Maybe<Array<Maybe<Holiday>>>;
  infantCountForHealthCareWorkerForMonth: Scalars['Int'];
  lastPractitionerInviteDate?: Maybe<Scalars['String']>;
  mapPractitionerToPrincipal?: Maybe<Principal>;
  monthlyAttendanceRecordCSV?: Maybe<FileModel>;
  monthlyAttendanceReport?: Maybe<Array<Maybe<MonthlyAttendanceReportModel>>>;
  motherById?: Maybe<Mother>;
  motherCountForHealthCareWorkerForMonth: Scalars['Int'];
  motherVisits?: Maybe<Array<Maybe<Visit>>>;
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
  principalByUserId?: Maybe<Practitioner>;
  roleForUser?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Maybe<IdentityRole>>>;
  settings?: Maybe<SettingsType>;
  tenantContext?: Maybe<TenantModel>;
  totalDaysAbsent: Scalars['Int'];
  userById?: Maybe<ApplicationUser>;
  userByToken?: Maybe<UserByToken>;
  users?: Maybe<Array<Maybe<ApplicationUser>>>;
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

export type QueryGetAllClassReassignmentHistoryArgs = {
  where?: InputMaybe<ClassReassignmentHistoryFilterInput>;
};

export type QueryGetAllClassroomArgs = {
  where?: InputMaybe<ClassroomFilterInput>;
};

export type QueryGetAllClassroomGroupArgs = {
  where?: InputMaybe<ClassroomGroupFilterInput>;
};

export type QueryGetAllClinicArgs = {
  where?: InputMaybe<ClinicFilterInput>;
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

export type QueryGetAllEventRecordArgs = {
  where?: InputMaybe<EventRecordFilterInput>;
};

export type QueryGetAllEventRecordChildTypeArgs = {
  where?: InputMaybe<EventRecordChildTypeFilterInput>;
};

export type QueryGetAllEventRecordTypeArgs = {
  where?: InputMaybe<EventRecordTypeFilterInput>;
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

export type QueryGetAllIntegrationMappingArgs = {
  where?: InputMaybe<IntegrationMappingFilterInput>;
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

export type QueryGetAllSl_Ingestion_ChildCaregiverArgs = {
  where?: InputMaybe<Sl_Ingestion_ChildCaregiverFilterInput>;
};

export type QueryGetAllSl_Ingestion_UserArgs = {
  where?: InputMaybe<Sl_Ingestion_UserFilterInput>;
};

export type QueryGetAllShortenUrlEntityArgs = {
  where?: InputMaybe<ShortenUrlEntityFilterInput>;
};

export type QueryGetAllSiteAddressArgs = {
  where?: InputMaybe<SiteAddressFilterInput>;
};

export type QueryGetAllStatementsContributionTypeArgs = {
  where?: InputMaybe<StatementsContributionTypeFilterInput>;
};

export type QueryGetAllStatementsExpenseTypeArgs = {
  where?: InputMaybe<StatementsExpenseTypeFilterInput>;
};

export type QueryGetAllStatementsExpensesArgs = {
  where?: InputMaybe<StatementsExpensesFilterInput>;
};

export type QueryGetAllStatementsFeeTypeArgs = {
  where?: InputMaybe<StatementsFeeTypeFilterInput>;
};

export type QueryGetAllStatementsIncomeArgs = {
  where?: InputMaybe<StatementsIncomeFilterInput>;
};

export type QueryGetAllStatementsIncomeStatementArgs = {
  where?: InputMaybe<StatementsIncomeStatementFilterInput>;
};

export type QueryGetAllStatementsIncomeTypeArgs = {
  where?: InputMaybe<StatementsIncomeTypeFilterInput>;
};

export type QueryGetAllStatementsPayTypeArgs = {
  where?: InputMaybe<StatementsPayTypeFilterInput>;
};

export type QueryGetAllStatementsStartupSupportArgs = {
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
  where?: InputMaybe<SystemSettingFilterInput>;
};

export type QueryGetAllTeamLeadArgs = {
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

export type QueryGetAllUserConsentArgs = {
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetAllUserHierarchyEntityArgs = {
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetAllVisitArgs = {
  where?: InputMaybe<VisitFilterInput>;
};

export type QueryGetAllVisitTypeArgs = {
  where?: InputMaybe<VisitTypeFilterInput>;
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

export type QueryGetEventRecordByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<EventRecordFilterInput>;
};

export type QueryGetEventRecordChildTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<EventRecordChildTypeFilterInput>;
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

export type QueryGetHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<HierarchyEntityFilterInput>;
};

export type QueryGetInfantByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<InfantFilterInput>;
};

export type QueryGetIntegrationMappingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<IntegrationMappingFilterInput>;
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

export type QueryGetSl_Ingestion_ChildCaregiverByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<Sl_Ingestion_ChildCaregiverFilterInput>;
};

export type QueryGetSl_Ingestion_UserByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<Sl_Ingestion_UserFilterInput>;
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

export type QueryGetUserConsentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserConsentFilterInput>;
};

export type QueryGetUserHierarchyEntityByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<UserHierarchyEntityFilterInput>;
};

export type QueryGetVisitByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitFilterInput>;
};

export type QueryGetVisitTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']>;
  where?: InputMaybe<VisitTypeFilterInput>;
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

export type QueryAllCaregiverByPractitionerArgs = {
  practitionerId?: InputMaybe<Scalars['String']>;
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

export type QueryAllDocumentArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryAllEventRecordTypesForTypeArgs = {
  type?: InputMaybe<Scalars['String']>;
};

export type QueryAllInfantsForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryAllMothersForHealthCareWorkerArgs = {
  id?: InputMaybe<Scalars['String']>;
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

export type QueryAttendanceArgs = {
  monthOfYear?: InputMaybe<Scalars['Int']>;
  weekOfYear?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<AttendanceFilterInput>;
  year: Scalars['Int'];
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

export type QueryContentDefinitionsExcelTemplateGeneratorArgs = {
  contentTypeId: Scalars['Int'];
};

export type QueryDisplayMetricsArgs = {
  type?: InputMaybe<Scalars['String']>;
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

export type QueryInfantCountForHealthCareWorkerForMonthArgs = {
  userId?: InputMaybe<Scalars['String']>;
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

export type QueryMotherByIdArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryMotherCountForHealthCareWorkerForMonthArgs = {
  id?: InputMaybe<Scalars['String']>;
};

export type QueryMotherVisitsArgs = {
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

export type QueryPrincipalByUserIdArgs = {
  userId?: InputMaybe<Scalars['String']>;
};

export type QueryRoleForUserArgs = {
  userId?: InputMaybe<Scalars['String']>;
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

export type Sl_Ingestion_ChildCaregiver = {
  __typename?: 'SL_Ingestion_ChildCaregiver';
  caregiverContactNumber?: Maybe<Scalars['String']>;
  caregiverIdNumber?: Maybe<Scalars['String']>;
  caregiverLanguage?: Maybe<Scalars['String']>;
  caregiverName?: Maybe<Scalars['String']>;
  caregiverRelationship?: Maybe<Scalars['String']>;
  childFullName?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['String']>;
  eCDType?: Maybe<Scalars['String']>;
  education?: Maybe<Scalars['String']>;
  emergencyContactName?: Maybe<Scalars['String']>;
  emergencyContactNumber?: Maybe<Scalars['String']>;
  ethnicGroup?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  franchiseeId?: Maybe<Scalars['String']>;
  franchiseeName?: Maybe<Scalars['String']>;
  franchiseeType?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  grant?: Maybe<Scalars['String']>;
  hasAllergies?: Maybe<Scalars['String']>;
  hasDisabilities?: Maybe<Scalars['String']>;
  healthConditions?: Maybe<Scalars['String']>;
  homeLanguage?: Maybe<Scalars['String']>;
  iDNumber?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  pOPIConsent?: Maybe<Scalars['String']>;
  parentFees?: Maybe<Scalars['String']>;
  photoConsent?: Maybe<Scalars['String']>;
  playgroup?: Maybe<Scalars['String']>;
  processedDate?: Maybe<Scalars['DateTime']>;
  surname?: Maybe<Scalars['String']>;
  typesOfAllergies?: Maybe<Scalars['String']>;
  typesOfDisabilities?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type Sl_Ingestion_ChildCaregiverFilterInput = {
  and?: InputMaybe<Array<Sl_Ingestion_ChildCaregiverFilterInput>>;
  caregiverContactNumber?: InputMaybe<StringOperationFilterInput>;
  caregiverIdNumber?: InputMaybe<StringOperationFilterInput>;
  caregiverLanguage?: InputMaybe<StringOperationFilterInput>;
  caregiverName?: InputMaybe<StringOperationFilterInput>;
  caregiverRelationship?: InputMaybe<StringOperationFilterInput>;
  childFullName?: InputMaybe<StringOperationFilterInput>;
  dateOfBirth?: InputMaybe<StringOperationFilterInput>;
  eCDType?: InputMaybe<StringOperationFilterInput>;
  education?: InputMaybe<StringOperationFilterInput>;
  emergencyContactName?: InputMaybe<StringOperationFilterInput>;
  emergencyContactNumber?: InputMaybe<StringOperationFilterInput>;
  ethnicGroup?: InputMaybe<StringOperationFilterInput>;
  firstName?: InputMaybe<StringOperationFilterInput>;
  franchiseeId?: InputMaybe<StringOperationFilterInput>;
  franchiseeName?: InputMaybe<StringOperationFilterInput>;
  franchiseeType?: InputMaybe<StringOperationFilterInput>;
  gender?: InputMaybe<StringOperationFilterInput>;
  grant?: InputMaybe<StringOperationFilterInput>;
  hasAllergies?: InputMaybe<StringOperationFilterInput>;
  hasDisabilities?: InputMaybe<StringOperationFilterInput>;
  healthConditions?: InputMaybe<StringOperationFilterInput>;
  homeLanguage?: InputMaybe<StringOperationFilterInput>;
  iDNumber?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<Sl_Ingestion_ChildCaregiverFilterInput>>;
  pOPIConsent?: InputMaybe<StringOperationFilterInput>;
  parentFees?: InputMaybe<StringOperationFilterInput>;
  photoConsent?: InputMaybe<StringOperationFilterInput>;
  playgroup?: InputMaybe<StringOperationFilterInput>;
  processedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  surname?: InputMaybe<StringOperationFilterInput>;
  typesOfAllergies?: InputMaybe<StringOperationFilterInput>;
  typesOfDisabilities?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type Sl_Ingestion_ChildCaregiverInput = {
  CaregiverContactNumber?: InputMaybe<Scalars['String']>;
  CaregiverIdNumber?: InputMaybe<Scalars['String']>;
  CaregiverLanguage?: InputMaybe<Scalars['String']>;
  CaregiverName?: InputMaybe<Scalars['String']>;
  CaregiverRelationship?: InputMaybe<Scalars['String']>;
  ChildFullName?: InputMaybe<Scalars['String']>;
  DateOfBirth?: InputMaybe<Scalars['String']>;
  ECDType?: InputMaybe<Scalars['String']>;
  Education?: InputMaybe<Scalars['String']>;
  EmergencyContactName?: InputMaybe<Scalars['String']>;
  EmergencyContactNumber?: InputMaybe<Scalars['String']>;
  EthnicGroup?: InputMaybe<Scalars['String']>;
  FirstName?: InputMaybe<Scalars['String']>;
  FranchiseeId?: InputMaybe<Scalars['String']>;
  FranchiseeName?: InputMaybe<Scalars['String']>;
  FranchiseeType?: InputMaybe<Scalars['String']>;
  Gender?: InputMaybe<Scalars['String']>;
  Grant?: InputMaybe<Scalars['String']>;
  HasAllergies?: InputMaybe<Scalars['String']>;
  HasDisabilities?: InputMaybe<Scalars['String']>;
  HealthConditions?: InputMaybe<Scalars['String']>;
  HomeLanguage?: InputMaybe<Scalars['String']>;
  IDNumber?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  POPIConsent?: InputMaybe<Scalars['String']>;
  ParentFees?: InputMaybe<Scalars['String']>;
  PhotoConsent?: InputMaybe<Scalars['String']>;
  Playgroup?: InputMaybe<Scalars['String']>;
  ProcessedDate?: InputMaybe<Scalars['DateTime']>;
  Surname?: InputMaybe<Scalars['String']>;
  TypesOfAllergies?: InputMaybe<Scalars['String']>;
  TypesOfDisabilities?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
};

export type Sl_Ingestion_User = {
  __typename?: 'SL_Ingestion_User';
  className?: Maybe<Scalars['String']>;
  coachContactNumber?: Maybe<Scalars['String']>;
  coachId?: Maybe<Scalars['String']>;
  coachName?: Maybe<Scalars['String']>;
  eCDType?: Maybe<Scalars['String']>;
  franchiseTypeOfProgramme?: Maybe<Scalars['String']>;
  franchisorName?: Maybe<Scalars['String']>;
  fullName?: Maybe<Scalars['String']>;
  iDNumber?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  indicator?: Maybe<Scalars['String']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  parentId?: Maybe<Scalars['String']>;
  personalNumber?: Maybe<Scalars['String']>;
  processedDate?: Maybe<Scalars['DateTime']>;
  programmeIndicator?: Maybe<Scalars['String']>;
  sameSite?: Maybe<Scalars['String']>;
  siteArea?: Maybe<Scalars['String']>;
  siteName?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  userId?: Maybe<Scalars['String']>;
};

export type Sl_Ingestion_UserFilterInput = {
  and?: InputMaybe<Array<Sl_Ingestion_UserFilterInput>>;
  className?: InputMaybe<StringOperationFilterInput>;
  coachContactNumber?: InputMaybe<StringOperationFilterInput>;
  coachId?: InputMaybe<StringOperationFilterInput>;
  coachName?: InputMaybe<StringOperationFilterInput>;
  eCDType?: InputMaybe<StringOperationFilterInput>;
  franchiseTypeOfProgramme?: InputMaybe<StringOperationFilterInput>;
  franchisorName?: InputMaybe<StringOperationFilterInput>;
  fullName?: InputMaybe<StringOperationFilterInput>;
  iDNumber?: InputMaybe<StringOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  indicator?: InputMaybe<StringOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<Sl_Ingestion_UserFilterInput>>;
  parentId?: InputMaybe<StringOperationFilterInput>;
  personalNumber?: InputMaybe<StringOperationFilterInput>;
  processedDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  programmeIndicator?: InputMaybe<StringOperationFilterInput>;
  sameSite?: InputMaybe<StringOperationFilterInput>;
  siteArea?: InputMaybe<StringOperationFilterInput>;
  siteName?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  userId?: InputMaybe<StringOperationFilterInput>;
};

export type Sl_Ingestion_UserInput = {
  ClassName?: InputMaybe<Scalars['String']>;
  CoachContactNumber?: InputMaybe<Scalars['String']>;
  CoachId?: InputMaybe<Scalars['String']>;
  CoachName?: InputMaybe<Scalars['String']>;
  ECDType?: InputMaybe<Scalars['String']>;
  FranchiseTypeOfProgramme?: InputMaybe<Scalars['String']>;
  FranchisorName?: InputMaybe<Scalars['String']>;
  FullName?: InputMaybe<Scalars['String']>;
  IDNumber?: InputMaybe<Scalars['String']>;
  Id?: InputMaybe<Scalars['UUID']>;
  Indicator?: InputMaybe<Scalars['String']>;
  IsActive: Scalars['Boolean'];
  ParentId?: InputMaybe<Scalars['String']>;
  PersonalNumber?: InputMaybe<Scalars['String']>;
  ProcessedDate?: InputMaybe<Scalars['DateTime']>;
  ProgrammeIndicator?: InputMaybe<Scalars['String']>;
  SameSite?: InputMaybe<Scalars['String']>;
  SiteArea?: InputMaybe<Scalars['String']>;
  SiteName?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  UserId?: InputMaybe<Scalars['String']>;
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

export type Setting_SmartLinkApi = {
  __typename?: 'Setting_SmartLinkApi';
  BaseUrl: Scalars['String'];
  Key: Scalars['String'];
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

export type SettingsType = {
  __typename?: 'SettingsType';
  AbsenteeCutoffDelay: Setting_AbsenteeCutoffDelay;
  Azure: Setting_Azure;
  BulkSms: Setting_BulkSms;
  Children: Setting_Children;
  Google: Setting_Google;
  IntegrationDelay: Setting_IntegrationDelay;
  InvitationCutoffDelay: Setting_InvitationCutoffDelay;
  Invitations: Setting_Invitations;
  Jwts: Setting_Jwts;
  RapidApi: Setting_RapidApi;
  Reporting: Setting_Reporting;
  Security: Setting_Security;
  SendGrid: Setting_SendGrid;
  SmartLinkApi: Setting_SmartLinkApi;
  SyncDelay: Setting_SyncDelay;
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

export type StatementsExpenses = {
  __typename?: 'StatementsExpenses';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsExpensesFilterInput = {
  and?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsExpensesFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsExpensesInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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

export type StatementsIncome = {
  __typename?: 'StatementsIncome';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsIncomeFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsIncomeInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
};

export type StatementsIncomeStatement = {
  __typename?: 'StatementsIncomeStatement';
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsIncomeStatementFilterInput = {
  and?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsIncomeStatementFilterInput>>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsIncomeStatementInput = {
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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

export type StatementsStartupSupport = {
  __typename?: 'StatementsStartupSupport';
  amount: Scalars['Decimal'];
  description?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['UUID'];
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  notes?: Maybe<Scalars['String']>;
  programmeId: Scalars['UUID'];
  startDate?: Maybe<Scalars['DateTime']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
};

export type StatementsStartupSupportFilterInput = {
  amount?: InputMaybe<ComparableDecimalOperationFilterInput>;
  and?: InputMaybe<Array<StatementsStartupSupportFilterInput>>;
  description?: InputMaybe<StringOperationFilterInput>;
  endDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  notes?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<StatementsStartupSupportFilterInput>>;
  programmeId?: InputMaybe<ComparableGuidOperationFilterInput>;
  startDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
};

export type StatementsStartupSupportInput = {
  Amount: Scalars['Decimal'];
  Description?: InputMaybe<Scalars['String']>;
  EndDate?: InputMaybe<Scalars['DateTime']>;
  Id?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Notes?: InputMaybe<Scalars['String']>;
  ProgrammeId: Scalars['UUID'];
  StartDate?: InputMaybe<Scalars['DateTime']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
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

export type TenantModel = {
  __typename?: 'TenantModel';
  adminSiteAddress?: Maybe<Scalars['String']>;
  adminTestSiteAddress?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
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

export type UserGrant = {
  __typename?: 'UserGrant';
  grant?: Maybe<Grant>;
  grantId: Scalars['UUID'];
  tenantId: Scalars['UUID'];
  userId?: Maybe<Scalars['String']>;
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
  languageId?: InputMaybe<Scalars['UUID']>;
  password?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  profileImageUrl?: InputMaybe<Scalars['String']>;
  raceId?: InputMaybe<Scalars['UUID']>;
  surname?: InputMaybe<Scalars['String']>;
  verifiedByHomeAffairs: Scalars['Boolean'];
};

export type Visit = {
  __typename?: 'Visit';
  actualVisitDate?: Maybe<Scalars['DateTime']>;
  attended: Scalars['Boolean'];
  id: Scalars['UUID'];
  infant?: Maybe<Infant>;
  infantId?: Maybe<Scalars['UUID']>;
  insertedDate: Scalars['DateTime'];
  isActive: Scalars['Boolean'];
  mother?: Maybe<Mother>;
  motherId?: Maybe<Scalars['UUID']>;
  plannedVisitDate: Scalars['DateTime'];
  risk?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['String']>;
  updatedDate: Scalars['DateTime'];
  visitType?: Maybe<VisitType>;
  visitTypeId: Scalars['UUID'];
};

export type VisitFilterInput = {
  actualVisitDate?: InputMaybe<ComparableNullableOfDateTimeOperationFilterInput>;
  and?: InputMaybe<Array<VisitFilterInput>>;
  attended?: InputMaybe<BooleanOperationFilterInput>;
  id?: InputMaybe<ComparableGuidOperationFilterInput>;
  infant?: InputMaybe<InfantFilterInput>;
  infantId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  insertedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  isActive?: InputMaybe<BooleanOperationFilterInput>;
  mother?: InputMaybe<MotherFilterInput>;
  motherId?: InputMaybe<ComparableNullableOfGuidOperationFilterInput>;
  or?: InputMaybe<Array<VisitFilterInput>>;
  plannedVisitDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  risk?: InputMaybe<StringOperationFilterInput>;
  updatedBy?: InputMaybe<StringOperationFilterInput>;
  updatedDate?: InputMaybe<ComparableDateTimeOperationFilterInput>;
  visitType?: InputMaybe<VisitTypeFilterInput>;
  visitTypeId?: InputMaybe<ComparableGuidOperationFilterInput>;
};

export type VisitInput = {
  ActualVisitDate?: InputMaybe<Scalars['DateTime']>;
  Attended: Scalars['Boolean'];
  Id?: InputMaybe<Scalars['UUID']>;
  Infant?: InputMaybe<InfantInput>;
  InfantId?: InputMaybe<Scalars['UUID']>;
  IsActive: Scalars['Boolean'];
  Mother?: InputMaybe<MotherInput>;
  MotherId?: InputMaybe<Scalars['UUID']>;
  PlannedVisitDate: Scalars['DateTime'];
  Risk?: InputMaybe<Scalars['String']>;
  UpdatedBy?: InputMaybe<Scalars['String']>;
  VisitType?: InputMaybe<VisitTypeInput>;
  VisitTypeId: Scalars['UUID'];
};

export type VisitModelInput = {
  actualVisitDate: Scalars['DateTime'];
  attended: Scalars['Boolean'];
  infant?: InputMaybe<InfantModelInput>;
  infantId?: InputMaybe<Scalars['UUID']>;
  mother?: InputMaybe<MotherModelInput>;
  motherId?: InputMaybe<Scalars['UUID']>;
  plannedVisitDate: Scalars['DateTime'];
  risk?: InputMaybe<Scalars['String']>;
  visitType?: InputMaybe<VisitTypeInput>;
  visitTypeId?: InputMaybe<Scalars['UUID']>;
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
