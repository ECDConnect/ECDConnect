--
-- PostgreSQL database dump
--

\restrict 8m0Jo70VixXDMfS3f0SUQfLkXOnb6ZrJnsccdNKHQ4Pfgcza3VqrWr7sTE85VG2

-- Dumped from database version 17.11
-- Dumped by pg_dump version 18.1

-- Started on 2026-11-13 14:08:32

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 2 (class 3079 OID 25350)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 364 (class 1255 OID 25351)
-- Name: delete_then_insert(text, text, text); Type: PROCEDURE; Schema: public; Owner: -
--

CREATE PROCEDURE public.delete_then_insert(IN text, IN text, IN text)
    LANGUAGE plpgsql
    AS $_$
DECLARE 
 templateType ALIAS FOR $1;
 subject ALIAS FOR $2;
 message ALIAS FOR $3;
BEGIN
    delete from "MessageTemplate" where "TemplateType" = templateType;
	
	insert into "MessageTemplate" ("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "Subject", "TenantId")
	values
	(uuid_generate_v4(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'email', templateType, message, subject, null),
	(uuid_generate_v4(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'sms', templateType, message, subject, null);
end $_$;


--
-- TOC entry 403 (class 1255 OID 268637)
-- Name: notify_important_error(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_important_error() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    payload JSON;
    severity_level TEXT;
    endpoint_id TEXT;
BEGIN
    
        -- Determine severity based on message content
        IF NEW."Message" = 'Not Authorised' THEN
            severity_level := 'NORMAL';
        ELSE
            severity_level := 'HIGH';
        END IF;

        -- Safely extract the GraphQL operation id from RequestPayload
        BEGIN
            endpoint_id := NEW."RequestPayload"::jsonb ->> 'id';
        EXCEPTION WHEN OTHERS THEN
            endpoint_id := NULL;
        END;
        
        payload := json_build_object(
            'id', NEW."Id",
            'event_date', NEW."EventDate",
            'type', NEW."Type",
            'message', LEFT(NEW."Message", 500),
            'user_id', NEW."UserId",
            'app_version', NEW."AppVersion",
            'client_url', NEW."ClientUrl",
            'is_online', NEW."IsOnline",
            'endpoint', endpoint_id,
            'severity', severity_level
        );
        
        PERFORM pg_notify('errors_ecdconnect', payload::text);
    
    
    RETURN NEW;
END;
$$;


--
-- TOC entry 390 (class 1255 OID 360894)
-- Name: notify_slack_user_resource_problem_report(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.notify_slack_user_resource_problem_report() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM pg_notify(
        'user_resource_problem_report',
        jsonb_build_object(
            'id',                NEW."Id",
            'problemType',       NEW."ProblemType",
            'contentId',         NEW."ContentId",
            'userId',            NEW."UserId",
            'tenantId',          NEW."TenantId",
            'additionalDetails', NEW."AdditionalDetails",
            'dataFreeAtReport',  NEW."DataFreeAtReport",
            'linkAtReport',      NEW."LinkAtReport",
            'insertedDate',      NEW."InsertedDate"
        )::text
    );
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 106990)
-- Name: AbsenceReason; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AbsenceReason" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 223 (class 1259 OID 106996)
-- Name: Absentees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Absentees" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "PractitionerId" uuid,
    "Reason" text,
    "AbsentDate" timestamp without time zone NOT NULL,
    "LoggedBy" text,
    "ReassignedClass" text,
    "ReassignedToPractitioner" text,
    "TenantId" uuid,
    "UserId" uuid,
    "ProgramId" uuid,
    "AbsentDateEnd" timestamp without time zone,
    "PractitionerRemovalHistoryId" uuid,
    "CompletedDate" timestamp without time zone,
    "IsRoleAssign" boolean DEFAULT false,
    "AssignedDate" timestamp without time zone
);


--
-- TOC entry 344 (class 1259 OID 199000)
-- Name: AppLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AppLog" (
    "Id" uuid NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UserId" uuid,
    "Details" text,
    "EventDate" timestamp without time zone NOT NULL,
    "AppVersion" text,
    "Type" text,
    "Message" text,
    "Payload" text,
    "ClientUrl" text,
    "IsOnline" boolean DEFAULT false,
    "RequestPayload" text,
    "UserAgent" text
);


--
-- TOC entry 224 (class 1259 OID 107003)
-- Name: AspNetJWTSession; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetJWTSession" (
    "Token" text NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "TenantId" uuid NOT NULL,
    "Id" uuid NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 107009)
-- Name: AspNetRoleClaims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetRoleClaims" (
    "Id" integer NOT NULL,
    "RoleId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    "TenantId" uuid
);


--
-- TOC entry 226 (class 1259 OID 107015)
-- Name: AspNetRoleClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."AspNetRoleClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetRoleClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 227 (class 1259 OID 107017)
-- Name: AspNetRoles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetRoles" (
    "Id" uuid NOT NULL,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text,
    "TenantId" uuid,
    "SystemName" character varying(256) DEFAULT ''::character varying NOT NULL,
    "TenantName" character varying(256) DEFAULT ''::character varying NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 107025)
-- Name: AspNetUserClaims; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserClaims" (
    "Id" integer NOT NULL,
    "UserId" uuid NOT NULL,
    "ClaimType" text,
    "ClaimValue" text,
    "TenantId" uuid
);


--
-- TOC entry 229 (class 1259 OID 107031)
-- Name: AspNetUserClaims_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."AspNetUserClaims_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 107033)
-- Name: AspNetUserLogins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserLogins" (
    "LoginProvider" text NOT NULL,
    "ProviderKey" text NOT NULL,
    "ProviderDisplayName" text,
    "UserId" uuid NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 231 (class 1259 OID 107039)
-- Name: AspNetUserRoles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserRoles" (
    "UserId" uuid NOT NULL,
    "RoleId" uuid NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 232 (class 1259 OID 107042)
-- Name: AspNetUserTokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUserTokens" (
    "UserId" uuid NOT NULL,
    "LoginProvider" text NOT NULL,
    "Name" text NOT NULL,
    "Value" text,
    "TenantId" uuid,
    "InsertedDate" timestamp without time zone NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 107048)
-- Name: AspNetUsers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AspNetUsers" (
    "Id" uuid NOT NULL,
    "RaceId" uuid,
    "GenderId" uuid,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "IsSouthAfricanCitizen" boolean NOT NULL,
    "IdNumber" text,
    "VerifiedByHomeAffairs" boolean NOT NULL,
    "DateOfBirth" timestamp without time zone NOT NULL,
    "FirstName" text,
    "Surname" text,
    "FullName" text,
    "ContactPreference" text,
    "ProfileImageUrl" text,
    "IsActive" boolean NOT NULL,
    "LastSeen" timestamp without time zone DEFAULT '0001-01-01 00:00:00'::timestamp without time zone NOT NULL,
    "NickFirstName" text,
    "NickSurname" text,
    "NickFullName" text,
    "TenantId" uuid,
    "EmergencyContactPhoneNumber" text,
    "EmergencyContactFirstName" text,
    "EmergencyContactSurname" text,
    "LanguageId" uuid DEFAULT '9688cd08-adef-408c-9d34-5d75ae5c44df'::uuid,
    "PendingEmail" text,
    "PendingPhoneNumber" text,
    "WhatsAppNumber" text,
    "PreferredCommunicationLanguage" text,
    "NextOfKinFirstName" text,
    "NextOfKinSurname" text,
    "NextOfKinContactNumber" text,
    "IsImported" boolean DEFAULT false,
    "ReasonForLeaving" text,
    "ReasonForLeavingComments" text,
    "EmergencyContactFullName" text,
    "InsertedDate" timestamp without time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp without time zone,
    "ResetData" boolean DEFAULT false,
    "RegisterType" character varying DEFAULT 'UserName'::character varying,
    "ShareInfoPartners" boolean,
    "WhatsAppConsent" boolean,
    "AcquisitionUrl" text,
    "UtmSource" character varying DEFAULT 'Unknown'::character varying,
    "UtmMedium" character varying DEFAULT 'Unknown'::character varying,
    "UtmCampaign" character varying DEFAULT 'Unknown'::character varying
);


--
-- TOC entry 234 (class 1259 OID 107060)
-- Name: Attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendance" (
    "WeekOfYear" integer NOT NULL,
    "ClassroomProgrammeId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "ParentRecordId" text,
    "MonthOfYear" integer NOT NULL,
    "Year" integer NOT NULL,
    "Attended" boolean NOT NULL,
    "AttendanceDate" timestamp without time zone NOT NULL,
    "TenantId" uuid,
    "InsertedDate" timestamp without time zone,
    "UpdatedDate" timestamp without time zone
);


--
-- TOC entry 235 (class 1259 OID 107066)
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLog" (
    "AuditLogTypeId" uuid NOT NULL,
    "Description" text,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UserId" uuid,
    "TenantId" uuid
);


--
-- TOC entry 236 (class 1259 OID 107072)
-- Name: AuditLogType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AuditLogType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "EnumId" integer NOT NULL,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 237 (class 1259 OID 107078)
-- Name: CMSImportLanguages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CMSImportLanguages" (
    rownr integer,
    englishname character varying(256),
    englishvalue character varying(256),
    sepediname character varying(256),
    sepedivalue character varying(256),
    zuluname character varying(256),
    zuluvalue character varying(256),
    afrikaansname character varying(256),
    afrikaansvalue character varying(256),
    tshivendaname character varying(256),
    tshivendavalue character varying(256),
    sesothoname character varying(256),
    sesothovalue character varying(256),
    siswatiname character varying(256),
    siswativalue character varying(256),
    xitsonganame character varying(256),
    xitsongavalue character varying(256),
    xhosaname character varying(256),
    xhosavalue character varying(256),
    ndebelename character varying(256),
    ndebelevalue character varying(256),
    setswananame character varying(256),
    setswanavalue character varying(256)
);


--
-- TOC entry 238 (class 1259 OID 107084)
-- Name: CalendarEvent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CalendarEvent" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "TenantId" uuid,
    "Name" text,
    "EventType" text,
    "AllDay" boolean,
    "Start" timestamp without time zone,
    "End" timestamp without time zone,
    "Description" text,
    "Action" text
);


--
-- TOC entry 239 (class 1259 OID 107090)
-- Name: CalendarEventParticipant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CalendarEventParticipant" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "TenantId" uuid,
    "CalendarEventId" uuid NOT NULL,
    "ParticipantUserId" uuid NOT NULL
);


--
-- TOC entry 240 (class 1259 OID 107096)
-- Name: Caregiver; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Caregiver" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "IdNumber" text,
    "FirstName" text,
    "Surname" text,
    "FullName" text,
    "PhoneNumber" text,
    "EmergencyContactFirstName" text,
    "EmergencyContactSurname" text,
    "EmergencyContactPhoneNumber" text,
    "AdditionalFirstName" text,
    "AdditionalSurname" text,
    "AdditionalPhoneNumber" text,
    "JoinReferencePanel" boolean NOT NULL,
    "Contribution" boolean NOT NULL,
    "SiteAddressId" uuid,
    "RelationId" uuid,
    "EducationId" uuid,
    "TenantId" uuid,
    "Age" text,
    "WhatsAppNumber" text,
    "LanguageId" uuid,
    "IsAllowedCustody" boolean DEFAULT false
);


--
-- TOC entry 241 (class 1259 OID 107103)
-- Name: Child; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Child" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "LanguageId" uuid,
    "CaregiverId" uuid,
    "Allergies" text,
    "Disabilities" text,
    "OtherHealthConditions" text,
    "ReasonForLeavingId" uuid,
    "WorkflowStatusId" uuid,
    "Hierarchy" text,
    "TenantId" uuid,
    "InsertedBy" text,
    "StartDate" timestamp without time zone,
    "PlaygroupGroup" character varying,
    "InactiveDate" timestamp without time zone,
    "InactiveReason" text,
    "InactivityComments" text,
    "IsAddedByCaregiver" boolean DEFAULT false,
    "OtherLanguages" text
);


--
-- TOC entry 242 (class 1259 OID 107110)
-- Name: ChildProgressReport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChildProgressReport" (
    "Id" uuid NOT NULL,
    "ChildId" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "ReportContent" text,
    "UserId" uuid,
    "TenantId" uuid,
    "DateCompleted" timestamp without time zone,
    "ChildProgressReportPeriodId" uuid NOT NULL,
    "ObservationsCompleteDate" timestamp without time zone
);


--
-- TOC entry 243 (class 1259 OID 107116)
-- Name: ChildProgressReportPeriod; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ChildProgressReportPeriod" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "ClassroomId" uuid NOT NULL,
    "StartDate" timestamp without time zone NOT NULL,
    "EndDate" timestamp without time zone NOT NULL
);


--
-- TOC entry 244 (class 1259 OID 107122)
-- Name: ClassProgramme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClassProgramme" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "ProgrammeStartDate" timestamp without time zone NOT NULL,
    "MeetingDay" integer NOT NULL,
    "IsFullDay" boolean NOT NULL,
    "ClassroomGroupId" uuid,
    "Hierarchy" text,
    "TenantId" uuid
);


--
-- TOC entry 245 (class 1259 OID 107128)
-- Name: ClassReassignmentHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClassReassignmentHistory" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "Reason" text,
    "LoggedBy" uuid,
    "ReassignedClassrooms" text,
    "ReassignedToUser" uuid,
    "ReassignedToDate" timestamp without time zone NOT NULL,
    "ReassignedBackToDate" timestamp without time zone,
    "ReassignedBackToUserId" uuid,
    "TenantId" uuid,
    "HierarchyToUser" character varying,
    "HierarchyBackToUser" character varying,
    "ReassignedClassroomGroups" text,
    "ReassignedChildrenUserIds" text,
    "ReassignedClassProgrammes" text,
    "ReassignedLearners" text,
    "ReassignedRoleBackDate" timestamp without time zone,
    "AssignedRole" text,
    "ReassignedRoleBack" text,
    "RoleAssignedToUser" text,
    "AbsenteeId" uuid,
    "AssignedToDate" timestamp without time zone NOT NULL,
    "AssignedRoleDate" timestamp without time zone
);


--
-- TOC entry 246 (class 1259 OID 107134)
-- Name: Classroom; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Classroom" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "SiteAddressId" uuid,
    "Name" text,
    "ClassroomImageUrl" text,
    "DoesOwnerTeach" boolean,
    "Hierarchy" text,
    "TenantId" uuid,
    "PreschoolCode" character varying,
    "IsDummySchool" boolean DEFAULT false
);


--
-- TOC entry 247 (class 1259 OID 107141)
-- Name: ClassroomGroup; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClassroomGroup" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "ClassroomId" uuid NOT NULL,
    "ProgrammeTypeId" uuid,
    "Name" text,
    "Hierarchy" text,
    "UserId" uuid,
    "TenantId" uuid
);


--
-- TOC entry 248 (class 1259 OID 107147)
-- Name: Coach; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Coach" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "AreaOfOperation" text,
    "SecondaryAreaOfOperation" text,
    "StartDate" timestamp without time zone,
    "Hierarchy" text,
    "Signature" text,
    "SiteAddressId" uuid,
    "SigningSignature" text,
    "TenantId" uuid,
    "AboutInfo" text,
    "IsRegistered" boolean DEFAULT false,
    "ShareInfo" boolean DEFAULT false,
    "ClickedCommunityTab" boolean DEFAULT false
);


--
-- TOC entry 249 (class 1259 OID 107156)
-- Name: CoachContact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CoachContact" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid NOT NULL,
    "TenantId" uuid,
    "PractitionerId" uuid NOT NULL,
    "CoachId" uuid NOT NULL,
    "ActionItemType" integer NOT NULL,
    "Period" timestamp without time zone NOT NULL,
    "ContactedDate" timestamp without time zone NOT NULL
);


--
-- TOC entry 250 (class 1259 OID 107162)
-- Name: CoachFeedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CoachFeedback" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "FromUserId" uuid NOT NULL,
    "ToUserId" uuid NOT NULL,
    "FeedbackTypeId" uuid,
    "FeedbackDetails" text,
    "SupportRatingId" uuid
);


--
-- TOC entry 251 (class 1259 OID 107168)
-- Name: CoachFeedbackType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CoachFeedbackType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "FeedbackTypeId" uuid,
    "CoachFeedbackId" uuid
);


--
-- TOC entry 252 (class 1259 OID 107174)
-- Name: CommunityProfile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunityProfile" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "AboutShort" text,
    "AboutLong" text,
    "ShareEmail" boolean DEFAULT false,
    "SharePhoneNumber" boolean DEFAULT false,
    "ShareProfilePhoto" boolean DEFAULT false,
    "ShareProvince" boolean DEFAULT false,
    "ShareRole" boolean DEFAULT false,
    "ProvinceId" uuid,
    "ClickedECDHeros" boolean DEFAULT false NOT NULL,
    "ShareContactInfo" boolean DEFAULT false,
    "UserId" uuid NOT NULL
);


--
-- TOC entry 253 (class 1259 OID 107187)
-- Name: CommunityProfileConnection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunityProfileConnection" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "FromCommunityProfileId" uuid NOT NULL,
    "ToCommunityProfileId" uuid NOT NULL,
    "InviteAccepted" boolean
);


--
-- TOC entry 254 (class 1259 OID 107193)
-- Name: CommunityProfileSkill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunityProfileSkill" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "CommunitySkillId" uuid NOT NULL,
    "CommunityProfileId" uuid NOT NULL
);


--
-- TOC entry 255 (class 1259 OID 107199)
-- Name: CommunitySkill; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."CommunitySkill" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Name" text,
    "Description" text,
    "ImageName" text,
    "Ordering" integer
);


--
-- TOC entry 256 (class 1259 OID 107205)
-- Name: Content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Content" (
    "Id" integer NOT NULL,
    "ContentTypeId" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "IsReadOnly" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 257 (class 1259 OID 107212)
-- Name: ContentFieldType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentFieldType" (
    "Id" integer NOT NULL,
    "Name" text,
    "Description" text,
    "DataType" text,
    "AssemblyDataType" text,
    "GraphQLDataType" text,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 258 (class 1259 OID 107218)
-- Name: ContentFieldType_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ContentFieldType_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


--
-- TOC entry 259 (class 1259 OID 107220)
-- Name: ContentStatus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentStatus" (
    "Id" integer NOT NULL,
    "Name" text,
    "Description" text,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 260 (class 1259 OID 107226)
-- Name: ContentStatus_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ContentStatus_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


--
-- TOC entry 261 (class 1259 OID 107228)
-- Name: ContentType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentType" (
    "Id" integer NOT NULL,
    "Name" text,
    "Description" text,
    "MetaData" text,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "IsVisiblePortal" boolean DEFAULT false NOT NULL,
    "PortalDisplayOrder" integer DEFAULT '-1'::integer NOT NULL
);


--
-- TOC entry 262 (class 1259 OID 107236)
-- Name: ContentTypeField; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentTypeField" (
    "Id" integer NOT NULL,
    "FieldOrder" integer NOT NULL,
    "FieldName" text,
    "FieldTypeId" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "DataLinkName" text,
    "ContentTypeId" integer,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "DisplayName" text,
    "DisplayMainTable" boolean,
    "DisplayPage" boolean,
    "IsRequired" boolean DEFAULT false
);


--
-- TOC entry 263 (class 1259 OID 107243)
-- Name: ContentTypeField_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ContentTypeField_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


--
-- TOC entry 264 (class 1259 OID 107245)
-- Name: ContentType_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."ContentType" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."ContentType_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 265 (class 1259 OID 107247)
-- Name: ContentValue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContentValue" (
    "ContentId" integer NOT NULL,
    "LocaleId" uuid NOT NULL,
    "ContentTypeFieldId" integer NOT NULL,
    "Value" text,
    "StatusId" integer,
    "TenantId" uuid,
    "Id" integer NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT now(),
    "UpdatedDate" timestamp without time zone
);


--
-- TOC entry 266 (class 1259 OID 107254)
-- Name: ContentValue_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."ContentValue" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."ContentValue_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 267 (class 1259 OID 107256)
-- Name: Content_Id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."Content" ALTER COLUMN "Id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."Content_Id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 268 (class 1259 OID 107258)
-- Name: Document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Document" (
    "Id" uuid NOT NULL,
    "ChildId" uuid,
    "PractitionerId" uuid,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "CreatedUserId" uuid,
    "Name" text,
    "Reference" text,
    "UserId" uuid,
    "DocumentTypeId" uuid NOT NULL,
    "WorkflowStatusId" uuid NOT NULL,
    "TenantId" uuid,
    "Hierarchy" text
);


--
-- TOC entry 269 (class 1259 OID 107264)
-- Name: DocumentType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DocumentType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text,
    "Description" text,
    "EnumId" integer NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 345 (class 1259 OID 199007)
-- Name: EcdRegistration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EcdRegistration" (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "UpdatedBy" text NOT NULL,
    "TenantId" uuid,
    "UserId" uuid,
    "PractitionerId" uuid NOT NULL,
    "Subsidy" text NOT NULL,
    "RegistrationType" text,
    "Challenges" text NOT NULL,
    "ChallengesOtherReason" text,
    "ProblemDescription" text NOT NULL,
    "HasBronzeCertificate" boolean DEFAULT false NOT NULL,
    "HasSilverCertificate" boolean DEFAULT false NOT NULL,
    "HasGoldCertificate" boolean DEFAULT false NOT NULL,
    "InitialCertificates" text,
    "ECaresStatus" text,
    CONSTRAINT "CK_EcdRegistration_ChallengesOther" CHECK (((("Challenges" = 'Other'::text) AND ("ChallengesOtherReason" IS NOT NULL)) OR (("Challenges" <> 'Other'::text) AND ("ChallengesOtherReason" IS NULL))))
);


--
-- TOC entry 346 (class 1259 OID 199035)
-- Name: EcdRegistrationHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."EcdRegistrationHistory" (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "UpdatedBy" text NOT NULL,
    "TenantId" uuid,
    "EcdRegistrationId" uuid NOT NULL,
    "UserId" uuid,
    "PropertyName" text NOT NULL,
    "OldValue" jsonb,
    "NewValue" jsonb,
    "ChangeReason" text
);


--
-- TOC entry 270 (class 1259 OID 107270)
-- Name: Education; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Education" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 271 (class 1259 OID 107276)
-- Name: FeedbackType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FeedbackType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Name" text NOT NULL,
    "NormalizedName" text NOT NULL,
    "Ordering" integer
);


--
-- TOC entry 272 (class 1259 OID 107282)
-- Name: Gender; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Gender" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 273 (class 1259 OID 107288)
-- Name: Grant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Grant" (
    "Id" uuid NOT NULL,
    "CaregiverId" uuid,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 274 (class 1259 OID 107294)
-- Name: Hierarchy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Hierarchy" (
    "Id" uuid NOT NULL,
    "Type" text,
    "SystemType" text,
    "ParentId" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 361 (class 1259 OID 361050)
-- Name: Holidays; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Holidays" (
    "Id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "Day" date NOT NULL,
    "Locale" character varying(10) NOT NULL,
    "CheckedDate" date NOT NULL
);


--
-- TOC entry 275 (class 1259 OID 107303)
-- Name: Invite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Invite" (
    "Id" uuid NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "IsActive" boolean DEFAULT true,
    "IsAccepted" boolean,
    "Status" text NOT NULL,
    "AcceptedDate" timestamp without time zone,
    "RejectedDate" timestamp without time zone,
    "PractitionerId" uuid,
    "PrincipalId" uuid NOT NULL,
    "UserId" uuid
);


--
-- TOC entry 276 (class 1259 OID 107312)
-- Name: JWTUserTokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JWTUserTokens" (
    "UserId" uuid NOT NULL,
    "TokenKey" text NOT NULL,
    "Token" text,
    "TenantId" uuid,
    "InsertedDate" timestamp without time zone NOT NULL,
    "JWTToken" text,
    "ExpiresIn" text,
    "Role" text,
    "DeviceInfo" character varying(500),
    "LastSeenAt" timestamp without time zone,
    "RevokedAt" timestamp without time zone
);


--
-- TOC entry 277 (class 1259 OID 107318)
-- Name: JobNotification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."JobNotification" (
    "Id" uuid NOT NULL,
    "UserId" uuid,
    "UserLastSeen" timestamp without time zone NOT NULL,
    "TemplateType" integer NOT NULL,
    "Protocol" text,
    "TenantId" uuid,
    "InsertedDate" timestamp without time zone
);


--
-- TOC entry 278 (class 1259 OID 107324)
-- Name: Language; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Language" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Locale" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 279 (class 1259 OID 107330)
-- Name: Learner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Learner" (
    "UserId" uuid NOT NULL,
    "ClassroomGroupId" uuid NOT NULL,
    "ProgrammeAttendanceReasonId" uuid,
    "OtherAttendanceReason" text,
    "StartedAttendance" timestamp without time zone NOT NULL,
    "StoppedAttendance" timestamp without time zone,
    "Hierarchy" text,
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 280 (class 1259 OID 107336)
-- Name: MeetingType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MeetingType" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "NormalizedName" text,
    "Description" text,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid NOT NULL
);


--
-- TOC entry 281 (class 1259 OID 107343)
-- Name: MessageLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MessageLog" (
    "Id" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "MessageTemplateType" text NOT NULL,
    "MessageProtocol" text NOT NULL,
    "From" text NOT NULL,
    "To" text NOT NULL,
    "Subject" text,
    "Message" text NOT NULL,
    "FromUserId" uuid,
    "SentByUserId" uuid NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp without time zone,
    "IsActive" boolean NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid NOT NULL,
    "MessageDate" timestamp without time zone,
    "MessageEndDate" timestamp without time zone,
    "Status" text,
    "CTA" text,
    "CTAText" text,
    "ReadDate" timestamp without time zone,
    "ToGroups" text,
    "Action" text,
    "RelatedToUserId" text,
    "GroupingId" uuid,
    "NotificationResult" integer,
    "NotificationResultProviderCode" text,
    "NotificationResultProviderMessage" text
);


--
-- TOC entry 282 (class 1259 OID 107351)
-- Name: MessageLogRelatedTo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MessageLogRelatedTo" (
    "MessageLogId" uuid NOT NULL,
    "RelatedEntityId" uuid NOT NULL,
    "EntityType" text
);


--
-- TOC entry 283 (class 1259 OID 107357)
-- Name: MessageTemplate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MessageTemplate" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Protocol" text,
    "TemplateType" text,
    "Message" text,
    "TenantId" uuid,
    "Subject" text,
    "CTAText" text,
    "CTA" text,
    "TypeCode" numeric,
    "NotificationColor" text,
    "Ordering" numeric DEFAULT 0,
    "Action" text
);


--
-- TOC entry 284 (class 1259 OID 107364)
-- Name: Module; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Module" (
    "Id" uuid NOT NULL,
    "Name" character varying(100) NOT NULL,
    "NormalizedName" character varying(100) NOT NULL,
    "Description" text
);


--
-- TOC entry 285 (class 1259 OID 107370)
-- Name: Navigation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Navigation" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Sequence" integer NOT NULL,
    "Name" text,
    "Icon" text,
    "Route" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 286 (class 1259 OID 107376)
-- Name: NavigationPermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NavigationPermission" (
    "NavigationId" uuid NOT NULL,
    "PermissionId" uuid NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 287 (class 1259 OID 107379)
-- Name: Note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Note" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text,
    "BodyText" text,
    "NoteTypeId" uuid NOT NULL,
    "UserId" uuid,
    "CreatedUserId" uuid,
    "TenantId" uuid
);


--
-- TOC entry 288 (class 1259 OID 107385)
-- Name: NoteType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NoteType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text,
    "NormalizedName" text,
    "Description" text,
    "EnumId" integer NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 289 (class 1259 OID 107391)
-- Name: NotificationResult; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."NotificationResult" (
    "Id" integer NOT NULL,
    "Name" character varying(100) NOT NULL,
    "NormilizedName" character varying(100) NOT NULL
);


--
-- TOC entry 290 (class 1259 OID 107394)
-- Name: PQARating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PQARating" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "VisitName" text,
    "OverallScore" numeric,
    "OverallRating" text,
    "OverallRatingStars" text,
    "OverallRatingColor" text,
    "VisitTypeName" text,
    "LinkedVisitId" uuid,
    "VisitId" uuid
);


--
-- TOC entry 291 (class 1259 OID 107400)
-- Name: PQASectionRating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PQASectionRating" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "PQARatingId" uuid,
    "VisitSection" text,
    "SectionScore" numeric,
    "SectionRating" text,
    "SectionRatingColor" text
);


--
-- TOC entry 292 (class 1259 OID 107406)
-- Name: Permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Permission" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text NOT NULL,
    "NormalizedName" text,
    "Grouping" text,
    "TenantId" uuid
);


--
-- TOC entry 293 (class 1259 OID 107413)
-- Name: PointsActivity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PointsActivity" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "PointsCategoryId" uuid,
    "Name" text NOT NULL,
    "Points" numeric NOT NULL,
    "MaxPointsIndividualMonthly" numeric,
    "MaxPointsIndividualYearly" numeric
);


--
-- TOC entry 294 (class 1259 OID 107422)
-- Name: PointsCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PointsCategory" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Name" text NOT NULL
);


--
-- TOC entry 295 (class 1259 OID 107431)
-- Name: PointsLibrary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PointsLibrary" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Activity" text NOT NULL,
    "SubActivity" text NOT NULL,
    "Points" numeric,
    "MaxPointsIndividualMonthly" numeric,
    "MaxPointsNonPrincipalMonthly" numeric DEFAULT 0,
    "MaxPointsNonPrincipalYearly" numeric DEFAULT 0,
    "MaxPointsPrincipalMonthly" numeric DEFAULT 0,
    "MaxPointsPrincipalYearly" numeric DEFAULT 0,
    "CalculatedAtMonthEnd" boolean DEFAULT false NOT NULL,
    "CalculatedAtYearEnd" boolean DEFAULT false NOT NULL,
    "Description" text,
    "TodoDescription" text
);


--
-- TOC entry 296 (class 1259 OID 107446)
-- Name: PointsUserSummary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PointsUserSummary" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "PointsLibraryId" uuid,
    "Month" numeric NOT NULL,
    "Year" numeric NOT NULL,
    "PointsTotal" numeric DEFAULT 0,
    "PointsYTD" numeric DEFAULT 0,
    "TimesScored" integer DEFAULT 0,
    "DateScored" timestamp without time zone,
    "PointsActivityId" uuid NOT NULL
);


--
-- TOC entry 297 (class 1259 OID 107455)
-- Name: Practitioner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Practitioner" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Hierarchy" text,
    "AttendanceRegisterLink" text,
    "ConsentForPhoto" boolean,
    "ParentFees" numeric,
    "LanguageUsedInGroups" text,
    "StartDate" timestamp without time zone,
    "UserId" uuid,
    "SiteAddressId" uuid,
    "IsPrincipal" boolean DEFAULT false,
    "CoachHierarchy" uuid,
    "PrincipalHierarchy" uuid,
    "Signature" text,
    "IsRegistered" boolean DEFAULT false,
    "SigningSignature" text,
    "ShareInfo" boolean DEFAULT false,
    "TenantId" uuid,
    "IsLeaving" boolean,
    "DateLinked" timestamp without time zone,
    "DateAccepted" timestamp without time zone,
    "DateToBeRemoved" timestamp without time zone,
    "Progress" numeric DEFAULT 0 NOT NULL,
    "ProgrammeType" text,
    "LeavingComment" text,
    "UsePhotoInReport" text,
    "ReasonForLeavingDetails" text,
    "ReasonForPractitionerLeavingId" uuid,
    "IsCompletedBusinessWalkThrough" boolean DEFAULT false,
    "ClickedCommunityTab" boolean DEFAULT false,
    "CommunitySectionViewDate" timestamp without time zone,
    "ProgressWalkthroughComplete" boolean DEFAULT false NOT NULL,
    "CoachLinkDate" timestamp without time zone
);


--
-- TOC entry 298 (class 1259 OID 107468)
-- Name: PractitionerRemovalHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PractitionerRemovalHistory" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "ClassroomId" uuid NOT NULL,
    "RemovedByUserId" uuid NOT NULL,
    "ReasonForPractitionerLeavingProgrammeId" uuid NOT NULL,
    "ReasonDetails" text NOT NULL,
    "DateOfRemoval" timestamp without time zone NOT NULL
);


--
-- TOC entry 299 (class 1259 OID 107474)
-- Name: Programme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Programme" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text,
    "StartDate" timestamp without time zone NOT NULL,
    "EndDate" timestamp without time zone NOT NULL,
    "PreferredLanguage" text,
    "ClassroomId" uuid NOT NULL,
    "TenantId" uuid,
    "ClassroomGroupId" uuid
);


--
-- TOC entry 300 (class 1259 OID 107480)
-- Name: ProgrammeAttendanceReason; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProgrammeAttendanceReason" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Reason" text,
    "TenantId" uuid
);


--
-- TOC entry 301 (class 1259 OID 107486)
-- Name: ProgrammeDay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProgrammeDay" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "ProgrammeId" uuid NOT NULL,
    "Day" integer NOT NULL,
    "DayDate" timestamp without time zone NOT NULL,
    "MessageBoardText" text,
    "SmallGroupActivityId" integer NOT NULL,
    "LargeGroupActivityId" integer NOT NULL,
    "StoryBookId" integer NOT NULL,
    "StoryActivityId" integer NOT NULL,
    "TenantId" uuid,
    "DateCompleted" timestamp without time zone
);


--
-- TOC entry 302 (class 1259 OID 107492)
-- Name: ProgrammeType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ProgrammeType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "EnumId" integer NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 303 (class 1259 OID 107498)
-- Name: Province; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Province" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 304 (class 1259 OID 107504)
-- Name: Race; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Race" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 305 (class 1259 OID 107510)
-- Name: ReasonForLeaving; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReasonForLeaving" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 306 (class 1259 OID 107516)
-- Name: ReasonForPractitionerLeaving; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReasonForPractitionerLeaving" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Description" text NOT NULL
);


--
-- TOC entry 307 (class 1259 OID 107522)
-- Name: ReasonForPractitionerLeavingProgramme; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ReasonForPractitionerLeavingProgramme" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Description" text NOT NULL
);


--
-- TOC entry 308 (class 1259 OID 107528)
-- Name: Relation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Relation" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 358 (class 1259 OID 360873)
-- Name: ResourceLinkHealthCheck; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ResourceLinkHealthCheck" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "ContentType" text NOT NULL,
    "ContentId" integer NOT NULL,
    "LocaleId" uuid NOT NULL,
    "SectionType" text,
    "Title" text,
    "Url" text,
    "Status" text NOT NULL,
    "LastCheckStatus" text,
    "LastStatusCode" integer,
    "LastError" text,
    "ConsecutiveFailureCount" integer DEFAULT 0 NOT NULL,
    "LastCheckedDate" timestamp without time zone NOT NULL,
    "LastNotifiedDate" timestamp without time zone
);


--
-- TOC entry 309 (class 1259 OID 107534)
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RolePermission" (
    "RoleId" uuid NOT NULL,
    "PermissionId" uuid NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 310 (class 1259 OID 107537)
-- Name: ShortUrl; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ShortUrl" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "MessageType" text,
    "URL" text,
    "Clicked" integer NOT NULL,
    "Hierarchy" text,
    "TenantId" uuid,
    "NotificationResult" integer,
    "MessageLogId" uuid
);


--
-- TOC entry 311 (class 1259 OID 107543)
-- Name: SiteAddress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SiteAddress" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Name" text,
    "AddressLine1" text,
    "AddressLine2" text,
    "AddressLine3" text,
    "PostalCode" text,
    "Ward" text,
    "ProvinceId" uuid,
    "TenantId" uuid,
    "Longitude" text,
    "Latitude" text,
    "Municipality" text,
    "Area" text
);


--
-- TOC entry 312 (class 1259 OID 107549)
-- Name: StatementsContributionType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsContributionType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid,
    "Notes" character varying
);


--
-- TOC entry 313 (class 1259 OID 107555)
-- Name: StatementsExpenseType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsExpenseType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid,
    "Notes" text
);


--
-- TOC entry 314 (class 1259 OID 107561)
-- Name: StatementsExpenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsExpenses" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "DatePaid" timestamp without time zone NOT NULL,
    "Notes" text,
    "Amount" double precision NOT NULL,
    "PhotoProof" text,
    "TenantId" uuid,
    "ExpenseTypeId" text,
    "StatementsIncomeStatementId" uuid
);


--
-- TOC entry 315 (class 1259 OID 107567)
-- Name: StatementsFeeType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsFeeType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid,
    "Notes" character varying
);


--
-- TOC entry 316 (class 1259 OID 107573)
-- Name: StatementsIncome; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsIncome" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "ChildUserId" uuid,
    "DateReceived" timestamp without time zone NOT NULL,
    "Notes" text,
    "Description" text,
    "Amount" double precision NOT NULL,
    "PhotoProof" text,
    "TenantId" uuid,
    "PayTypeId" text,
    "IncomeTypeId" text,
    "StatementsIncomeStatementId" uuid,
    "NumberOfChildrenCovered" numeric
);


--
-- TOC entry 317 (class 1259 OID 107579)
-- Name: StatementsIncomeStatement; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsIncomeStatement" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "TenantId" uuid,
    "Submitted" boolean DEFAULT false NOT NULL,
    "Month" integer,
    "Year" integer,
    "Notes" text,
    "ContactedByCoach" boolean DEFAULT false NOT NULL,
    "Downloaded" boolean DEFAULT false NOT NULL
);


--
-- TOC entry 318 (class 1259 OID 107588)
-- Name: StatementsIncomeType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsIncomeType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid,
    "Notes" character varying
);


--
-- TOC entry 319 (class 1259 OID 107594)
-- Name: StatementsPayType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsPayType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid,
    "Notes" character varying
);


--
-- TOC entry 320 (class 1259 OID 107600)
-- Name: StatementsStartupSupport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."StatementsStartupSupport" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "UserId" uuid,
    "Notes" text,
    "Description" text,
    "StartDate" timestamp without time zone NOT NULL,
    "EndDate" timestamp without time zone NOT NULL,
    "TenantId" uuid,
    "Amount" double precision NOT NULL,
    "ProgrammeId" uuid,
    "ChildUserId" uuid
);


--
-- TOC entry 321 (class 1259 OID 107606)
-- Name: SupportRating; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SupportRating" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "Name" text NOT NULL,
    "NormalizedName" text NOT NULL,
    "ImageName" text,
    "Ordering" integer
);


--
-- TOC entry 322 (class 1259 OID 107612)
-- Name: SystemLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemLog" (
    "Id" character varying NOT NULL,
    "ErrorLog" character varying,
    "ErrorFunction" character varying,
    "ErrorType" character varying,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UserId" uuid,
    "TenantId" uuid
);


--
-- TOC entry 323 (class 1259 OID 107618)
-- Name: SystemSetting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SystemSetting" (
    "Id" uuid NOT NULL,
    "Grouping" text,
    "FullPath" text,
    "Name" text,
    "Value" text,
    "IsSystemValue" boolean,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 324 (class 1259 OID 107624)
-- Name: Tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tenant" (
    "ApplicationName" text,
    "SiteAddress" text NOT NULL,
    "OrganisationName" text,
    "TenantTypeId" integer NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Id" uuid NOT NULL,
    "ThemePath" character varying,
    "AdminSiteAddress" text,
    "TestSiteAddress" text,
    "AdminTestSiteAddress" text,
    "MoodleUrl" text,
    "MoodleConfig" character varying,
    "GoogleAnalyticsTag" character varying(50),
    "GoogleTagManager" character varying(50),
    "OrganisationEmail" text,
    "DefaultSystemSettings" text,
    "BlobStorageAddress" text DEFAULT 'https://ecdconnectstoragedev.blob.core.windows.net'::text,
    "SiteAddress2" text,
    "OrganisationHelpPhoneNumber" text,
    "OrganisationHelpWhatsAppNumber" text,
    "IsActive" boolean DEFAULT true NOT NULL
);


--
-- TOC entry 325 (class 1259 OID 107631)
-- Name: TenantHasModule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TenantHasModule" (
    "TenantId" uuid NOT NULL,
    "ModuleId" uuid NOT NULL
);


--
-- TOC entry 326 (class 1259 OID 107634)
-- Name: TenantSetupInfo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TenantSetupInfo" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "OrganisationName" text NOT NULL,
    "SetupJsonData" text NOT NULL
);


--
-- TOC entry 327 (class 1259 OID 107640)
-- Name: TenantType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TenantType" (
    "Id" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "NormalizedName" character varying(50) NOT NULL
);


--
-- TOC entry 362 (class 1259 OID 361097)
-- Name: UserCertificate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserCertificate" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true,
    "InsertedDate" timestamp without time zone,
    "UpdatedDate" timestamp without time zone,
    "UpdatedBy" text,
    "UserId" uuid NOT NULL,
    "VisitId" uuid,
    "UserTrainingCourseId" uuid,
    "TenantId" uuid NOT NULL,
    "CertificateName" text NOT NULL,
    "CertificateRegNr" text NOT NULL
);


--
-- TOC entry 328 (class 1259 OID 107643)
-- Name: UserConsent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserConsent" (
    "ConsentId" integer NOT NULL,
    "UserId" uuid NOT NULL,
    "ConsentType" text,
    "CreatedUserId" uuid,
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 360 (class 1259 OID 360904)
-- Name: UserFlag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserFlag" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "FlagKey" text NOT NULL,
    "FlagValue" text
);


--
-- TOC entry 329 (class 1259 OID 107649)
-- Name: UserGrants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserGrants" (
    "UserId" uuid NOT NULL,
    "GrantId" uuid NOT NULL,
    "TenantId" uuid,
    "InsertedDate" timestamp without time zone DEFAULT now() NOT NULL,
    "UpdatedDate" timestamp without time zone,
    "UpdatedBy" text,
    "IsActive" boolean DEFAULT true,
    "Id" uuid
);


--
-- TOC entry 330 (class 1259 OID 107657)
-- Name: UserHelp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserHelp" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid,
    "Subject" text,
    "Description" text,
    "ContactPreference" text,
    "CellNumber" text,
    "Email" text,
    "IsLoggedIn" boolean DEFAULT true
);


--
-- TOC entry 331 (class 1259 OID 107664)
-- Name: UserHierarchy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserHierarchy" (
    "Id" uuid NOT NULL,
    "ParentId" uuid,
    "UserId" uuid,
    "UserType" text,
    "NamedTypePath" text,
    "Hierarchy" text,
    "Key" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid
);


--
-- TOC entry 332 (class 1259 OID 107670)
-- Name: UserHierarchy_Key_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."UserHierarchy" ALTER COLUMN "Key" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."UserHierarchy_Key_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 333 (class 1259 OID 107672)
-- Name: UserLanguages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserLanguages" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "LanguageId" uuid NOT NULL
);


--
-- TOC entry 334 (class 1259 OID 107678)
-- Name: UserPermission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserPermission" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "PermissionId" uuid NOT NULL
);


--
-- TOC entry 335 (class 1259 OID 107684)
-- Name: UserResourceLikes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserResourceLikes" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid,
    "ContentId" integer NOT NULL
);


--
-- TOC entry 357 (class 1259 OID 268639)
-- Name: UserResourceProblemReport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserResourceProblemReport" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "TenantId" uuid,
    "UserId" uuid NOT NULL,
    "ContentId" integer NOT NULL,
    "ProblemType" text NOT NULL,
    "AdditionalDetails" text,
    "DataFreeAtReport" text,
    "LinkAtReport" text
);


--
-- TOC entry 336 (class 1259 OID 107690)
-- Name: UserTrainingCourse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserTrainingCourse" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CourseName" character varying(100) NOT NULL,
    "CompletedDate" timestamp without time zone,
    "TenantId" uuid NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" character varying(36),
    "IsActive" boolean NOT NULL,
    "StartedDate" timestamp without time zone,
    "ProgressPercentage" numeric(5,2) DEFAULT 0 NOT NULL,
    "LastActivityDate" timestamp without time zone,
    "ExternalCourseId" character varying(50),
    "Status" character varying(20) DEFAULT 'Completed'::character varying NOT NULL
);


--
-- TOC entry 337 (class 1259 OID 107693)
-- Name: Visit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visit" (
    "Id" uuid NOT NULL,
    "PlannedVisitDate" timestamp without time zone,
    "ActualVisitDate" timestamp without time zone,
    "IsActive" boolean DEFAULT true,
    "Attended" boolean DEFAULT false NOT NULL,
    "InsertedDate" timestamp without time zone,
    "UpdatedDate" timestamp without time zone,
    "UpdatedBy" text,
    "VisitTypeId" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "Risk" text DEFAULT 'normal'::text NOT NULL,
    "Comment" text,
    "LinkedVisitId" uuid,
    "PractitionerId" uuid,
    "CoachId" uuid,
    "DueDate" timestamp without time zone,
    "EventId" uuid,
    "Rating" text,
    "IsCancelled" boolean DEFAULT false NOT NULL,
    "FormContentId" integer,
    "CertificateCreated" timestamp without time zone,
    "CertificateName" text,
    "CertificateRegNr" text
);


--
-- TOC entry 338 (class 1259 OID 107703)
-- Name: VisitData; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VisitData" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "VisitId" uuid NOT NULL,
    "QuestionAnswer" text,
    "TenantId" uuid NOT NULL,
    "VisitName" text,
    "Question" text,
    "VisitSection" text,
    "QuestionContentId" integer,
    "AnswerContentId" text
);
ALTER TABLE ONLY public."VisitData" ALTER COLUMN "AnswerContentId" SET STORAGE PLAIN;


--
-- TOC entry 339 (class 1259 OID 107710)
-- Name: VisitDataStatus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VisitDataStatus" (
    "Id" uuid NOT NULL,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "VisitDataId" uuid NOT NULL,
    "Comment" text NOT NULL,
    "Color" text,
    "TenantId" uuid NOT NULL,
    "Type" text,
    "IsCompleted" boolean DEFAULT false NOT NULL,
    "Section" text
);


--
-- TOC entry 340 (class 1259 OID 107718)
-- Name: VisitType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."VisitType" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "NormalizedName" text,
    "Description" text,
    "IsActive" boolean DEFAULT true NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Order" integer NOT NULL,
    "Type" text NOT NULL,
    "TenantId" uuid NOT NULL
);


--
-- TOC entry 341 (class 1259 OID 107725)
-- Name: WorkflowStatus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WorkflowStatus" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "WorkflowStatusTypeId" uuid NOT NULL,
    "EnumId" integer NOT NULL,
    "TenantId" uuid
);


--
-- TOC entry 342 (class 1259 OID 107731)
-- Name: WorkflowStatusType; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."WorkflowStatusType" (
    "Id" uuid NOT NULL,
    "IsActive" boolean NOT NULL,
    "InsertedDate" timestamp without time zone NOT NULL,
    "UpdatedDate" timestamp without time zone NOT NULL,
    "UpdatedBy" text,
    "Description" text,
    "TenantId" uuid
);


--
-- TOC entry 343 (class 1259 OID 107737)
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


--
-- TOC entry 347 (class 1259 OID 199058)
-- Name: vwContentActivity; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentActivity" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Image",
    COALESCE(cv3."Value", ''::text) AS "Type",
    COALESCE(cv4."Value", ''::text) AS "Materials",
    COALESCE(cv5."Value", ''::text) AS "Description",
    COALESCE(cv6."Value", ''::text) AS "SubCategoryIds",
    COALESCE(cv7."Value", ''::text) AS "Notes",
    COALESCE(cv8."Value", ''::text) AS "SubType",
    COALESCE(cv9."Value", ''::text) AS "AvailableLanguageIds",
    cv1."LocaleId"
   FROM (((((((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 66))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 67) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 64) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 62) AND (cv1."LocaleId" = cv4."LocaleId"))))
     LEFT JOIN public."ContentValue" cv5 ON (((c."Id" = cv5."ContentId") AND (cv5."ContentTypeFieldId" = 65) AND (cv1."LocaleId" = cv5."LocaleId"))))
     LEFT JOIN public."ContentValue" cv6 ON (((c."Id" = cv6."ContentId") AND (cv6."ContentTypeFieldId" = 60) AND (cv1."LocaleId" = cv6."LocaleId"))))
     LEFT JOIN public."ContentValue" cv7 ON (((c."Id" = cv7."ContentId") AND (cv7."ContentTypeFieldId" = 61) AND (cv1."LocaleId" = cv7."LocaleId"))))
     LEFT JOIN public."ContentValue" cv8 ON (((c."Id" = cv8."ContentId") AND (cv8."ContentTypeFieldId" = 63) AND (cv1."LocaleId" = cv8."LocaleId"))))
     LEFT JOIN public."ContentValue" cv9 ON (((c."Id" = cv9."ContentId") AND (cv9."ContentTypeFieldId" = 59) AND (cv1."LocaleId" = cv9."LocaleId"))))
  WHERE (c."ContentTypeId" = 13);


--
-- TOC entry 348 (class 1259 OID 199063)
-- Name: vwContentActivityHasProgressSubCategory; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentActivityHasProgressSubCategory" AS
 SELECT p."Id" AS "ActivityId",
    u."ChildId" AS "ProgressSubCategoryId"
   FROM ((public."Content" p
     JOIN public."ContentValue" pcv ON (((pcv."ContentId" = p."Id") AND (pcv."ContentTypeFieldId" = 60) AND (pcv."Value" <> ''::text) AND (pcv."Value" IS NOT NULL))))
     CROSS JOIN LATERAL ( SELECT (val.val)::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE (btrim(val.val) <> ''::text)) u)
  WHERE (p."ContentTypeId" = 13);


--
-- TOC entry 349 (class 1259 OID 199068)
-- Name: vwContentConsent; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentConsent" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Section",
    COALESCE(cv3."Value", ''::text) AS "Description",
    COALESCE(cv4."Value", ''::text) AS "Type",
    COALESCE(cv5."Value", ''::text) AS "Image",
    cv1."LocaleId"
   FROM (((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 70))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 383) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 68) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 69) AND (cv1."LocaleId" = cv4."LocaleId"))))
     LEFT JOIN public."ContentValue" cv5 ON (((c."Id" = cv5."ContentId") AND (cv5."ContentTypeFieldId" = 374) AND (cv1."LocaleId" = cv5."LocaleId"))))
  WHERE ((c."ContentTypeId" = 14) AND (c."TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid));


--
-- TOC entry 350 (class 1259 OID 199073)
-- Name: vwContentStoryBook; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentStoryBook" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Type",
    COALESCE(cv3."Value", ''::text) AS "Author",
    COALESCE(cv4."Value", ''::text) AS "Illustrator",
    COALESCE(cv5."Value", ''::text) AS "BookLocation",
    COALESCE(cv6."Value", ''::text) AS "Keywords",
    COALESCE(cv7."Value", ''::text) AS "StoryBookPartIds",
    COALESCE(cv8."Value", ''::text) AS "AvailableLanguageIds",
    cv1."LocaleId"
   FROM ((((((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 52))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 51) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 50) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 49) AND (cv1."LocaleId" = cv4."LocaleId"))))
     LEFT JOIN public."ContentValue" cv5 ON (((c."Id" = cv5."ContentId") AND (cv5."ContentTypeFieldId" = 48) AND (cv1."LocaleId" = cv5."LocaleId"))))
     LEFT JOIN public."ContentValue" cv6 ON (((c."Id" = cv6."ContentId") AND (cv6."ContentTypeFieldId" = 46) AND (cv1."LocaleId" = cv6."LocaleId"))))
     LEFT JOIN public."ContentValue" cv7 ON (((c."Id" = cv7."ContentId") AND (cv7."ContentTypeFieldId" = 47) AND (cv1."LocaleId" = cv7."LocaleId"))))
     LEFT JOIN public."ContentValue" cv8 ON (((c."Id" = cv8."ContentId") AND (cv8."ContentTypeFieldId" = 45) AND (cv1."LocaleId" = cv8."LocaleId"))))
  WHERE (c."ContentTypeId" = 10);


--
-- TOC entry 351 (class 1259 OID 199078)
-- Name: vwContentStoryBookHasPart; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentStoryBookHasPart" AS
 SELECT p."Id" AS "StoryBookId",
    u."ChildId" AS "StoryBookPartId"
   FROM ((public."Content" p
     JOIN public."ContentValue" pcv ON (((pcv."ContentId" = p."Id") AND (pcv."ContentTypeFieldId" = 47) AND (pcv."Value" <> ''::text) AND (pcv."Value" IS NOT NULL))))
     CROSS JOIN LATERAL ( SELECT (val.val)::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE (btrim(val.val) <> ''::text)) u)
  WHERE (p."ContentTypeId" = 10);


--
-- TOC entry 352 (class 1259 OID 199083)
-- Name: vwContentStoryBookPart; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentStoryBookPart" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Part",
    COALESCE(cv3."Value", ''::text) AS "PartText",
    COALESCE(cv4."Value", ''::text) AS "StoryBookPartQuestionIds",
    cv1."LocaleId"
   FROM ((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 56))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 55) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 54) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 53) AND (cv1."LocaleId" = cv4."LocaleId"))))
  WHERE (c."ContentTypeId" = 11);


--
-- TOC entry 353 (class 1259 OID 199088)
-- Name: vwContentStoryBookPartHasQuestion; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentStoryBookPartHasQuestion" AS
 SELECT p."Id" AS "StoryBookPartId",
    u."ChildId" AS "StoryBookPartQuestionId"
   FROM ((public."Content" p
     JOIN public."ContentValue" pcv ON (((pcv."ContentId" = p."Id") AND (pcv."ContentTypeFieldId" = 53) AND (pcv."Value" <> ''::text) AND (pcv."Value" IS NOT NULL))))
     CROSS JOIN LATERAL ( SELECT (val.val)::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE (btrim(val.val) <> ''::text)) u)
  WHERE (p."ContentTypeId" = 11);


--
-- TOC entry 354 (class 1259 OID 199093)
-- Name: vwContentStoryBookPartQuestion; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentStoryBookPartQuestion" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Question",
    cv1."LocaleId"
   FROM ((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 58))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 57) AND (cv1."LocaleId" = cv2."LocaleId"))))
  WHERE (c."ContentTypeId" = 12);


--
-- TOC entry 363 (class 1259 OID 361145)
-- Name: vwContentTheme; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentTheme" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Color",
    COALESCE(cv3."Value", ''::text) AS "ImageUrl",
    NULLIF(btrim(cv4."Value"), ''::text) AS "ThemeDays",
    cv1."LocaleId"
   FROM ((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 38))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 37) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 36) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 35) AND (cv1."LocaleId" = cv4."LocaleId"))))
  WHERE (c."ContentTypeId" = 8);


--
-- TOC entry 355 (class 1259 OID 199103)
-- Name: vwContentThemeDay; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwContentThemeDay" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    cv1."Value" AS "Name",
    cv2."Value" AS "Day",
    (NULLIF(cv3."Value", ''::text))::integer AS "SmallGroupActivityId",
    (NULLIF(cv4."Value", ''::text))::integer AS "LargeGroupActivityId",
    (NULLIF(cv5."Value", ''::text))::integer AS "StoryBookId",
    (NULLIF(cv6."Value", ''::text))::integer AS "StoryActivityId",
    cv1."LocaleId",
    p."Id" AS "ThemeId"
   FROM (((((((((public."Content" p
     JOIN public."ContentValue" pcv ON (((pcv."ContentId" = p."Id") AND (pcv."ContentTypeFieldId" = 35) AND (pcv."Value" <> ''::text) AND (pcv."Value" IS NOT NULL))))
     CROSS JOIN LATERAL ( SELECT (val.val)::integer AS "ChildId"
           FROM unnest(string_to_array(pcv."Value", ','::text)) val(val)
          WHERE (btrim(val.val) <> ''::text)) u)
     JOIN public."Content" c ON ((u."ChildId" = c."Id")))
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 44) AND (cv1."LocaleId" = pcv."LocaleId"))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 43) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 42) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 41) AND (cv1."LocaleId" = cv4."LocaleId"))))
     LEFT JOIN public."ContentValue" cv5 ON (((c."Id" = cv5."ContentId") AND (cv5."ContentTypeFieldId" = 40) AND (cv1."LocaleId" = cv5."LocaleId"))))
     LEFT JOIN public."ContentValue" cv6 ON (((c."Id" = cv6."ContentId") AND (cv6."ContentTypeFieldId" = 39) AND (cv1."LocaleId" = cv6."LocaleId"))))
  WHERE ((c."ContentTypeId" = 9) AND (p."ContentTypeId" = 8));


--
-- TOC entry 356 (class 1259 OID 199108)
-- Name: vwProgressTrackingSubCategory; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public."vwProgressTrackingSubCategory" AS
 SELECT c."Id",
    c."IsActive",
    c."InsertedDate",
    c."UpdatedDate",
    c."UpdatedBy",
    c."IsReadOnly",
    cv1."TenantId",
    COALESCE(cv1."Value", ''::text) AS "Name",
    COALESCE(cv2."Value", ''::text) AS "Description",
    COALESCE(cv3."Value", ''::text) AS "ImageUrl",
    COALESCE(cv4."Value", ''::text) AS "Skills",
    COALESCE(cv5."Value", ''::text) AS "ImageHexColor",
    cv1."LocaleId"
   FROM (((((public."Content" c
     JOIN public."ContentValue" cv1 ON (((c."Id" = cv1."ContentId") AND (cv1."ContentTypeFieldId" = 29))))
     LEFT JOIN public."ContentValue" cv2 ON (((c."Id" = cv2."ContentId") AND (cv2."ContentTypeFieldId" = 28) AND (cv1."LocaleId" = cv2."LocaleId"))))
     LEFT JOIN public."ContentValue" cv3 ON (((c."Id" = cv3."ContentId") AND (cv3."ContentTypeFieldId" = 27) AND (cv1."LocaleId" = cv3."LocaleId"))))
     LEFT JOIN public."ContentValue" cv4 ON (((c."Id" = cv4."ContentId") AND (cv4."ContentTypeFieldId" = 26) AND (cv1."LocaleId" = cv4."LocaleId"))))
     LEFT JOIN public."ContentValue" cv5 ON (((c."Id" = cv5."ContentId") AND (cv5."ContentTypeFieldId" = 399) AND (cv1."LocaleId" = cv5."LocaleId"))))
  WHERE ((c."ContentTypeId" = 5) AND (c."TenantId" = '258a15e6-3736-45ea-875c-48d9377de4c8'::uuid));


--
-- TOC entry 4956 (class 2606 OID 199006)
-- Name: AppLog AppLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AppLog"
    ADD CONSTRAINT "AppLog_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4964 (class 2606 OID 199045)
-- Name: EcdRegistrationHistory EcdRegistrationHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistrationHistory"
    ADD CONSTRAINT "EcdRegistrationHistory_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4959 (class 2606 OID 199021)
-- Name: EcdRegistration EcdRegistration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistration"
    ADD CONSTRAINT "EcdRegistration_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4976 (class 2606 OID 361055)
-- Name: Holidays Holidays_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Holidays"
    ADD CONSTRAINT "Holidays_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4593 (class 2606 OID 25437)
-- Name: AbsenceReason PK_AbsenceReason; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AbsenceReason"
    ADD CONSTRAINT "PK_AbsenceReason" PRIMARY KEY ("Id");


--
-- TOC entry 4599 (class 2606 OID 25438)
-- Name: Absentees PK_Absentees; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "PK_Absentees" PRIMARY KEY ("Id");


--
-- TOC entry 4602 (class 2606 OID 25439)
-- Name: AspNetRoleClaims PK_AspNetRoleClaims; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "PK_AspNetRoleClaims" PRIMARY KEY ("Id");


--
-- TOC entry 4606 (class 2606 OID 25440)
-- Name: AspNetRoles PK_AspNetRoles; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoles"
    ADD CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id");


--
-- TOC entry 4609 (class 2606 OID 25441)
-- Name: AspNetUserClaims PK_AspNetUserClaims; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "PK_AspNetUserClaims" PRIMARY KEY ("Id");


--
-- TOC entry 4612 (class 2606 OID 25442)
-- Name: AspNetUserLogins PK_AspNetUserLogins; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "PK_AspNetUserLogins" PRIMARY KEY ("LoginProvider", "ProviderKey");


--
-- TOC entry 4615 (class 2606 OID 25443)
-- Name: AspNetUserRoles PK_AspNetUserRoles; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "PK_AspNetUserRoles" PRIMARY KEY ("UserId", "RoleId");


--
-- TOC entry 4617 (class 2606 OID 25444)
-- Name: AspNetUserTokens PK_AspNetUserTokens; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "PK_AspNetUserTokens" PRIMARY KEY ("UserId", "LoginProvider", "Name");


--
-- TOC entry 4623 (class 2606 OID 25445)
-- Name: AspNetUsers PK_AspNetUsers; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("Id");


--
-- TOC entry 4628 (class 2606 OID 268652)
-- Name: Attendance PK_Attendance; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "PK_Attendance" PRIMARY KEY ("ClassroomProgrammeId", "UserId", "WeekOfYear", "Year");


--
-- TOC entry 4632 (class 2606 OID 25447)
-- Name: AuditLogType PK_AuditLogType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLogType"
    ADD CONSTRAINT "PK_AuditLogType" PRIMARY KEY ("Id");


--
-- TOC entry 4635 (class 2606 OID 25448)
-- Name: CalendarEvent PK_CalendarEvent; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEvent"
    ADD CONSTRAINT "PK_CalendarEvent" PRIMARY KEY ("Id");


--
-- TOC entry 4640 (class 2606 OID 25449)
-- Name: CalendarEventParticipant PK_CalendarEventParticipant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEventParticipant"
    ADD CONSTRAINT "PK_CalendarEventParticipant" PRIMARY KEY ("Id");


--
-- TOC entry 4646 (class 2606 OID 25450)
-- Name: Caregiver PK_Caregiver; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "PK_Caregiver" PRIMARY KEY ("Id");


--
-- TOC entry 4654 (class 2606 OID 25451)
-- Name: Child PK_Child; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "PK_Child" PRIMARY KEY ("Id");


--
-- TOC entry 4659 (class 2606 OID 25452)
-- Name: ChildProgressReport PK_ChildProgressReport; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReport"
    ADD CONSTRAINT "PK_ChildProgressReport" PRIMARY KEY ("Id");


--
-- TOC entry 4663 (class 2606 OID 25453)
-- Name: ChildProgressReportPeriod PK_ChildProgressReportPeriod; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReportPeriod"
    ADD CONSTRAINT "PK_ChildProgressReportPeriod" PRIMARY KEY ("Id");


--
-- TOC entry 4667 (class 2606 OID 25454)
-- Name: ClassProgramme PK_ClassProgramme; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassProgramme"
    ADD CONSTRAINT "PK_ClassProgramme" PRIMARY KEY ("Id");


--
-- TOC entry 4674 (class 2606 OID 25455)
-- Name: ClassReassignmentHistory PK_ClassReassignmentHistory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "PK_ClassReassignmentHistory" PRIMARY KEY ("Id");


--
-- TOC entry 4678 (class 2606 OID 25456)
-- Name: Classroom PK_Classroom; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classroom"
    ADD CONSTRAINT "PK_Classroom" PRIMARY KEY ("Id");


--
-- TOC entry 4683 (class 2606 OID 25457)
-- Name: ClassroomGroup PK_ClassroomGroup; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassroomGroup"
    ADD CONSTRAINT "PK_ClassroomGroup" PRIMARY KEY ("Id");


--
-- TOC entry 4687 (class 2606 OID 25458)
-- Name: Coach PK_Coach; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coach"
    ADD CONSTRAINT "PK_Coach" PRIMARY KEY ("Id");


--
-- TOC entry 4690 (class 2606 OID 25459)
-- Name: CoachContact PK_CoachContact; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachContact"
    ADD CONSTRAINT "PK_CoachContact" PRIMARY KEY ("Id");


--
-- TOC entry 4697 (class 2606 OID 25460)
-- Name: CoachFeedback PK_CoachFeedback; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedback"
    ADD CONSTRAINT "PK_CoachFeedback" PRIMARY KEY ("Id");


--
-- TOC entry 4701 (class 2606 OID 25461)
-- Name: CoachFeedbackType PK_CoachFeedbackType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedbackType"
    ADD CONSTRAINT "PK_CoachFeedbackType" PRIMARY KEY ("Id");


--
-- TOC entry 4704 (class 2606 OID 25462)
-- Name: CommunityProfile PK_CommunityProfile; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfile"
    ADD CONSTRAINT "PK_CommunityProfile" PRIMARY KEY ("Id");


--
-- TOC entry 4708 (class 2606 OID 25463)
-- Name: CommunityProfileConnection PK_CommunityProfileConnection; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileConnection"
    ADD CONSTRAINT "PK_CommunityProfileConnection" PRIMARY KEY ("Id");


--
-- TOC entry 4712 (class 2606 OID 25464)
-- Name: CommunityProfileSkill PK_CommunityProfileSkill; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileSkill"
    ADD CONSTRAINT "PK_CommunityProfileSkill" PRIMARY KEY ("Id");


--
-- TOC entry 4714 (class 2606 OID 25465)
-- Name: CommunitySkill PK_CommunitySkill; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunitySkill"
    ADD CONSTRAINT "PK_CommunitySkill" PRIMARY KEY ("Id");


--
-- TOC entry 4717 (class 2606 OID 25466)
-- Name: Content PK_Content; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Content"
    ADD CONSTRAINT "PK_Content" PRIMARY KEY ("Id");


--
-- TOC entry 4719 (class 2606 OID 25467)
-- Name: ContentFieldType PK_ContentFieldType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentFieldType"
    ADD CONSTRAINT "PK_ContentFieldType" PRIMARY KEY ("Id");


--
-- TOC entry 4721 (class 2606 OID 25468)
-- Name: ContentStatus PK_ContentStatus; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentStatus"
    ADD CONSTRAINT "PK_ContentStatus" PRIMARY KEY ("Id");


--
-- TOC entry 4723 (class 2606 OID 25469)
-- Name: ContentType PK_ContentType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentType"
    ADD CONSTRAINT "PK_ContentType" PRIMARY KEY ("Id");


--
-- TOC entry 4727 (class 2606 OID 25470)
-- Name: ContentTypeField PK_ContentTypeField; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentTypeField"
    ADD CONSTRAINT "PK_ContentTypeField" PRIMARY KEY ("Id");


--
-- TOC entry 4732 (class 2606 OID 25471)
-- Name: ContentValue PK_ContentValue; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentValue"
    ADD CONSTRAINT "PK_ContentValue" PRIMARY KEY ("Id");


--
-- TOC entry 4740 (class 2606 OID 25472)
-- Name: Document PK_Document; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "PK_Document" PRIMARY KEY ("Id");


--
-- TOC entry 4742 (class 2606 OID 25473)
-- Name: DocumentType PK_DocumentType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DocumentType"
    ADD CONSTRAINT "PK_DocumentType" PRIMARY KEY ("Id");


--
-- TOC entry 4744 (class 2606 OID 25474)
-- Name: Education PK_Education; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Education"
    ADD CONSTRAINT "PK_Education" PRIMARY KEY ("Id");


--
-- TOC entry 4746 (class 2606 OID 25475)
-- Name: FeedbackType PK_FeedbackType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FeedbackType"
    ADD CONSTRAINT "PK_FeedbackType" PRIMARY KEY ("Id");


--
-- TOC entry 4748 (class 2606 OID 25476)
-- Name: Gender PK_Gender; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Gender"
    ADD CONSTRAINT "PK_Gender" PRIMARY KEY ("Id");


--
-- TOC entry 4751 (class 2606 OID 25477)
-- Name: Grant PK_Grant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grant"
    ADD CONSTRAINT "PK_Grant" PRIMARY KEY ("Id");


--
-- TOC entry 4753 (class 2606 OID 25478)
-- Name: Hierarchy PK_Hierarchy; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Hierarchy"
    ADD CONSTRAINT "PK_Hierarchy" PRIMARY KEY ("Id");


--
-- TOC entry 4759 (class 2606 OID 25479)
-- Name: Invite PK_Invite; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "PK_Invite" PRIMARY KEY ("Id");


--
-- TOC entry 4762 (class 2606 OID 361059)
-- Name: JWTUserTokens PK_JWTUserTokens; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JWTUserTokens"
    ADD CONSTRAINT "PK_JWTUserTokens" PRIMARY KEY ("TokenKey");


--
-- TOC entry 4765 (class 2606 OID 25481)
-- Name: JobNotification PK_JobNotification; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobNotification"
    ADD CONSTRAINT "PK_JobNotification" PRIMARY KEY ("Id");


--
-- TOC entry 4767 (class 2606 OID 25482)
-- Name: Language PK_Language; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "PK_Language" PRIMARY KEY ("Id");


--
-- TOC entry 4772 (class 2606 OID 25483)
-- Name: Learner PK_Learner; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Learner"
    ADD CONSTRAINT "PK_Learner" PRIMARY KEY ("ClassroomGroupId", "UserId", "Id");


--
-- TOC entry 4775 (class 2606 OID 25484)
-- Name: MeetingType PK_MeetingType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MeetingType"
    ADD CONSTRAINT "PK_MeetingType" PRIMARY KEY ("Id");


--
-- TOC entry 4779 (class 2606 OID 25485)
-- Name: MessageLog PK_MessageLog; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MessageLog"
    ADD CONSTRAINT "PK_MessageLog" PRIMARY KEY ("Id");


--
-- TOC entry 4781 (class 2606 OID 25486)
-- Name: MessageLogRelatedTo PK_MessageLogRelatedTo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MessageLogRelatedTo"
    ADD CONSTRAINT "PK_MessageLogRelatedTo" PRIMARY KEY ("MessageLogId", "RelatedEntityId");


--
-- TOC entry 4783 (class 2606 OID 25487)
-- Name: MessageTemplate PK_MessageTemplate; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MessageTemplate"
    ADD CONSTRAINT "PK_MessageTemplate" PRIMARY KEY ("Id");


--
-- TOC entry 4785 (class 2606 OID 25488)
-- Name: Module PK_Module; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Module"
    ADD CONSTRAINT "PK_Module" PRIMARY KEY ("Id");


--
-- TOC entry 4787 (class 2606 OID 25489)
-- Name: Navigation PK_Navigation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Navigation"
    ADD CONSTRAINT "PK_Navigation" PRIMARY KEY ("Id");


--
-- TOC entry 4790 (class 2606 OID 25490)
-- Name: NavigationPermission PK_NavigationPermission; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NavigationPermission"
    ADD CONSTRAINT "PK_NavigationPermission" PRIMARY KEY ("PermissionId", "NavigationId");


--
-- TOC entry 4795 (class 2606 OID 25491)
-- Name: Note PK_Note; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "PK_Note" PRIMARY KEY ("Id");


--
-- TOC entry 4797 (class 2606 OID 25492)
-- Name: NoteType PK_NoteType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NoteType"
    ADD CONSTRAINT "PK_NoteType" PRIMARY KEY ("Id");


--
-- TOC entry 4799 (class 2606 OID 25493)
-- Name: NotificationResult PK_NotificationResult; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NotificationResult"
    ADD CONSTRAINT "PK_NotificationResult" PRIMARY KEY ("Id");


--
-- TOC entry 4803 (class 2606 OID 25494)
-- Name: PQARating PK_PQARating; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PQARating"
    ADD CONSTRAINT "PK_PQARating" PRIMARY KEY ("Id");


--
-- TOC entry 4806 (class 2606 OID 25495)
-- Name: PQASectionRating PK_PQASectionRating; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PQASectionRating"
    ADD CONSTRAINT "PK_PQASectionRating" PRIMARY KEY ("Id");


--
-- TOC entry 4808 (class 2606 OID 25496)
-- Name: Permission PK_Permission; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "PK_Permission" PRIMARY KEY ("Id");


--
-- TOC entry 4811 (class 2606 OID 25497)
-- Name: PointsActivity PK_PointsActivity; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsActivity"
    ADD CONSTRAINT "PK_PointsActivity" PRIMARY KEY ("Id");


--
-- TOC entry 4813 (class 2606 OID 25498)
-- Name: PointsCategory PK_PointsCategory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsCategory"
    ADD CONSTRAINT "PK_PointsCategory" PRIMARY KEY ("Id");


--
-- TOC entry 4815 (class 2606 OID 25499)
-- Name: PointsLibrary PK_PointsLibrary; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsLibrary"
    ADD CONSTRAINT "PK_PointsLibrary" PRIMARY KEY ("Id");


--
-- TOC entry 4820 (class 2606 OID 25500)
-- Name: PointsUserSummary PK_PointsUserSummary; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "PK_PointsUserSummary" PRIMARY KEY ("Id");


--
-- TOC entry 4825 (class 2606 OID 25501)
-- Name: Practitioner PK_Practitioner; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Practitioner"
    ADD CONSTRAINT "PK_Practitioner" PRIMARY KEY ("Id");


--
-- TOC entry 4831 (class 2606 OID 25502)
-- Name: PractitionerRemovalHistory PK_PractitionerRemovalHistory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "PK_PractitionerRemovalHistory" PRIMARY KEY ("Id");


--
-- TOC entry 4835 (class 2606 OID 25503)
-- Name: Programme PK_Programme; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Programme"
    ADD CONSTRAINT "PK_Programme" PRIMARY KEY ("Id");


--
-- TOC entry 4837 (class 2606 OID 25504)
-- Name: ProgrammeAttendanceReason PK_ProgrammeAttendanceReason; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProgrammeAttendanceReason"
    ADD CONSTRAINT "PK_ProgrammeAttendanceReason" PRIMARY KEY ("Id");


--
-- TOC entry 4840 (class 2606 OID 25505)
-- Name: ProgrammeDay PK_ProgrammeDay; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProgrammeDay"
    ADD CONSTRAINT "PK_ProgrammeDay" PRIMARY KEY ("Id");


--
-- TOC entry 4842 (class 2606 OID 25506)
-- Name: ProgrammeType PK_ProgrammeType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProgrammeType"
    ADD CONSTRAINT "PK_ProgrammeType" PRIMARY KEY ("Id");


--
-- TOC entry 4844 (class 2606 OID 25507)
-- Name: Province PK_Province; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Province"
    ADD CONSTRAINT "PK_Province" PRIMARY KEY ("Id");


--
-- TOC entry 4846 (class 2606 OID 25508)
-- Name: Race PK_Race; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Race"
    ADD CONSTRAINT "PK_Race" PRIMARY KEY ("Id");


--
-- TOC entry 4848 (class 2606 OID 25509)
-- Name: ReasonForLeaving PK_ReasonForLeaving; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReasonForLeaving"
    ADD CONSTRAINT "PK_ReasonForLeaving" PRIMARY KEY ("Id");


--
-- TOC entry 4850 (class 2606 OID 25510)
-- Name: ReasonForPractitionerLeaving PK_ReasonForLeavingPractitioner; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReasonForPractitionerLeaving"
    ADD CONSTRAINT "PK_ReasonForLeavingPractitioner" PRIMARY KEY ("Id");


--
-- TOC entry 4852 (class 2606 OID 25511)
-- Name: ReasonForPractitionerLeavingProgramme PK_ReasonForLeavingPractitionerPrograme; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ReasonForPractitionerLeavingProgramme"
    ADD CONSTRAINT "PK_ReasonForLeavingPractitionerPrograme" PRIMARY KEY ("Id");


--
-- TOC entry 4854 (class 2606 OID 25512)
-- Name: Relation PK_Relation; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Relation"
    ADD CONSTRAINT "PK_Relation" PRIMARY KEY ("Id");


--
-- TOC entry 4970 (class 2606 OID 360880)
-- Name: ResourceLinkHealthCheck PK_ResourceLinkHealthCheck; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ResourceLinkHealthCheck"
    ADD CONSTRAINT "PK_ResourceLinkHealthCheck" PRIMARY KEY ("Id");


--
-- TOC entry 4857 (class 2606 OID 25513)
-- Name: RolePermission PK_RolePermission; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "PK_RolePermission" PRIMARY KEY ("PermissionId", "RoleId");


--
-- TOC entry 4861 (class 2606 OID 25514)
-- Name: ShortUrl PK_ShortUrl; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShortUrl"
    ADD CONSTRAINT "PK_ShortUrl" PRIMARY KEY ("Id");


--
-- TOC entry 4864 (class 2606 OID 25515)
-- Name: SiteAddress PK_SiteAddress; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SiteAddress"
    ADD CONSTRAINT "PK_SiteAddress" PRIMARY KEY ("Id");


--
-- TOC entry 4866 (class 2606 OID 25516)
-- Name: StatementsContributionType PK_StatementsContributionType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsContributionType"
    ADD CONSTRAINT "PK_StatementsContributionType" PRIMARY KEY ("Id");


--
-- TOC entry 4868 (class 2606 OID 25517)
-- Name: StatementsExpenseType PK_StatementsExpenseType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsExpenseType"
    ADD CONSTRAINT "PK_StatementsExpenseType" PRIMARY KEY ("Id");


--
-- TOC entry 4871 (class 2606 OID 25518)
-- Name: StatementsExpenses PK_StatementsExpenses; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsExpenses"
    ADD CONSTRAINT "PK_StatementsExpenses" PRIMARY KEY ("Id");


--
-- TOC entry 4873 (class 2606 OID 25519)
-- Name: StatementsFeeType PK_StatementsFeeType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsFeeType"
    ADD CONSTRAINT "PK_StatementsFeeType" PRIMARY KEY ("Id");


--
-- TOC entry 4877 (class 2606 OID 25520)
-- Name: StatementsIncome PK_StatementsIncome; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncome"
    ADD CONSTRAINT "PK_StatementsIncome" PRIMARY KEY ("Id");


--
-- TOC entry 4880 (class 2606 OID 25521)
-- Name: StatementsIncomeStatement PK_StatementsIncomeStatement; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncomeStatement"
    ADD CONSTRAINT "PK_StatementsIncomeStatement" PRIMARY KEY ("Id");


--
-- TOC entry 4882 (class 2606 OID 25522)
-- Name: StatementsIncomeType PK_StatementsIncomeType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncomeType"
    ADD CONSTRAINT "PK_StatementsIncomeType" PRIMARY KEY ("Id");


--
-- TOC entry 4884 (class 2606 OID 25523)
-- Name: StatementsPayType PK_StatementsPayType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsPayType"
    ADD CONSTRAINT "PK_StatementsPayType" PRIMARY KEY ("Id");


--
-- TOC entry 4888 (class 2606 OID 25524)
-- Name: StatementsStartupSupport PK_StatementsStartupSupport; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsStartupSupport"
    ADD CONSTRAINT "PK_StatementsStartupSupport" PRIMARY KEY ("Id");


--
-- TOC entry 4890 (class 2606 OID 25525)
-- Name: SupportRating PK_SupportRating; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SupportRating"
    ADD CONSTRAINT "PK_SupportRating" PRIMARY KEY ("Id");


--
-- TOC entry 4892 (class 2606 OID 25526)
-- Name: SystemSetting PK_SystemSetting; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SystemSetting"
    ADD CONSTRAINT "PK_SystemSetting" PRIMARY KEY ("Id");


--
-- TOC entry 4894 (class 2606 OID 361090)
-- Name: Tenant PK_Tenant; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tenant"
    ADD CONSTRAINT "PK_Tenant" PRIMARY KEY ("Id", "SiteAddress");


--
-- TOC entry 4897 (class 2606 OID 25527)
-- Name: TenantHasModule PK_TenantHasModule; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantHasModule"
    ADD CONSTRAINT "PK_TenantHasModule" PRIMARY KEY ("TenantId", "ModuleId");


--
-- TOC entry 4899 (class 2606 OID 25528)
-- Name: TenantSetupInfo PK_TenantSetupInfo; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantSetupInfo"
    ADD CONSTRAINT "PK_TenantSetupInfo" PRIMARY KEY ("Id");


--
-- TOC entry 4901 (class 2606 OID 25529)
-- Name: TenantType PK_TenantType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantType"
    ADD CONSTRAINT "PK_TenantType" PRIMARY KEY ("Id");


--
-- TOC entry 4978 (class 2606 OID 361104)
-- Name: UserCertificate PK_UserCertificate; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCertificate"
    ADD CONSTRAINT "PK_UserCertificate" PRIMARY KEY ("Id");


--
-- TOC entry 4905 (class 2606 OID 25530)
-- Name: UserConsent PK_UserConsent; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserConsent"
    ADD CONSTRAINT "PK_UserConsent" PRIMARY KEY ("ConsentId", "UserId");


--
-- TOC entry 4973 (class 2606 OID 360910)
-- Name: UserFlag PK_UserFlag; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlag"
    ADD CONSTRAINT "PK_UserFlag" PRIMARY KEY ("Id");


--
-- TOC entry 4908 (class 2606 OID 25531)
-- Name: UserGrants PK_UserGrants; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGrants"
    ADD CONSTRAINT "PK_UserGrants" PRIMARY KEY ("GrantId", "UserId");


--
-- TOC entry 4911 (class 2606 OID 25532)
-- Name: UserHelp PK_UserHelp; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserHelp"
    ADD CONSTRAINT "PK_UserHelp" PRIMARY KEY ("Id");


--
-- TOC entry 4915 (class 2606 OID 25533)
-- Name: UserHierarchy PK_UserHierarchy; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserHierarchy"
    ADD CONSTRAINT "PK_UserHierarchy" PRIMARY KEY ("Id");


--
-- TOC entry 4919 (class 2606 OID 25534)
-- Name: UserLanguages PK_UserLanguages; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLanguages"
    ADD CONSTRAINT "PK_UserLanguages" PRIMARY KEY ("Id");


--
-- TOC entry 4923 (class 2606 OID 25535)
-- Name: UserPermission PK_UserPermission; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "PK_UserPermission" PRIMARY KEY ("Id");


--
-- TOC entry 4926 (class 2606 OID 25536)
-- Name: UserResourceLikes PK_UserResourceLikes; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserResourceLikes"
    ADD CONSTRAINT "PK_UserResourceLikes" PRIMARY KEY ("Id");


--
-- TOC entry 4967 (class 2606 OID 268645)
-- Name: UserResourceProblemReport PK_UserResourceProblemReport; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserResourceProblemReport"
    ADD CONSTRAINT "PK_UserResourceProblemReport" PRIMARY KEY ("Id");


--
-- TOC entry 4939 (class 2606 OID 25537)
-- Name: Visit PK_Visit; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "PK_Visit" PRIMARY KEY ("Id");


--
-- TOC entry 4942 (class 2606 OID 25538)
-- Name: VisitData PK_VisitData; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitData"
    ADD CONSTRAINT "PK_VisitData" PRIMARY KEY ("Id");


--
-- TOC entry 4945 (class 2606 OID 25539)
-- Name: VisitDataStatus PK_VisitReferral; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitDataStatus"
    ADD CONSTRAINT "PK_VisitReferral" PRIMARY KEY ("Id");


--
-- TOC entry 4947 (class 2606 OID 25540)
-- Name: VisitType PK_VisitType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitType"
    ADD CONSTRAINT "PK_VisitType" PRIMARY KEY ("Id");


--
-- TOC entry 4950 (class 2606 OID 25541)
-- Name: WorkflowStatus PK_WorkflowStatus; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkflowStatus"
    ADD CONSTRAINT "PK_WorkflowStatus" PRIMARY KEY ("Id");


--
-- TOC entry 4952 (class 2606 OID 25542)
-- Name: WorkflowStatusType PK_WorkflowStatusType; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkflowStatusType"
    ADD CONSTRAINT "PK_WorkflowStatusType" PRIMARY KEY ("Id");


--
-- TOC entry 4954 (class 2606 OID 25543)
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- TOC entry 4933 (class 2606 OID 25544)
-- Name: UserTrainingCourse UserTrainingCourse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserTrainingCourse"
    ADD CONSTRAINT "UserTrainingCourse_pkey" PRIMARY KEY ("Id");


--
-- TOC entry 4618 (class 1259 OID 109047)
-- Name: EmailIndex; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "EmailIndex" ON public."AspNetUsers" USING btree ("NormalizedEmail");


--
-- TOC entry 4594 (class 1259 OID 360979)
-- Name: IX_Absentees_PractitionerId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Absentees_PractitionerId" ON public."Absentees" USING btree ("PractitionerId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4595 (class 1259 OID 360981)
-- Name: IX_Absentees_PractitionerRemovalHistoryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Absentees_PractitionerRemovalHistoryId" ON public."Absentees" USING btree ("PractitionerRemovalHistoryId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4596 (class 1259 OID 360980)
-- Name: IX_Absentees_ProgramId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Absentees_ProgramId" ON public."Absentees" USING btree ("ProgramId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4597 (class 1259 OID 109048)
-- Name: IX_Absentees_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Absentees_UserId" ON public."Absentees" USING btree ("UserId");


--
-- TOC entry 4957 (class 1259 OID 360987)
-- Name: IX_AppLog_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AppLog_UserId" ON public."AppLog" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4600 (class 1259 OID 109049)
-- Name: IX_AspNetRoleClaims_RoleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON public."AspNetRoleClaims" USING btree ("RoleId");


--
-- TOC entry 4603 (class 1259 OID 109050)
-- Name: IX_AspNetRoles_TenantId_Name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_AspNetRoles_TenantId_Name" ON public."AspNetRoles" USING btree ("TenantId", "Name");


--
-- TOC entry 4604 (class 1259 OID 109051)
-- Name: IX_AspNetRoles_TenantId_NormalizedName; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IX_AspNetRoles_TenantId_NormalizedName" ON public."AspNetRoles" USING btree ("TenantId", "NormalizedName");


--
-- TOC entry 4607 (class 1259 OID 109052)
-- Name: IX_AspNetUserClaims_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserClaims_UserId" ON public."AspNetUserClaims" USING btree ("UserId");


--
-- TOC entry 4610 (class 1259 OID 109053)
-- Name: IX_AspNetUserLogins_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserLogins_UserId" ON public."AspNetUserLogins" USING btree ("UserId");


--
-- TOC entry 4613 (class 1259 OID 109054)
-- Name: IX_AspNetUserRoles_RoleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUserRoles_RoleId" ON public."AspNetUserRoles" USING btree ("RoleId");


--
-- TOC entry 4619 (class 1259 OID 109055)
-- Name: IX_AspNetUsers_GenderId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUsers_GenderId" ON public."AspNetUsers" USING btree ("GenderId");


--
-- TOC entry 4620 (class 1259 OID 109056)
-- Name: IX_AspNetUsers_LanguageId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUsers_LanguageId" ON public."AspNetUsers" USING btree ("LanguageId");


--
-- TOC entry 4621 (class 1259 OID 109057)
-- Name: IX_AspNetUsers_RaceId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AspNetUsers_RaceId" ON public."AspNetUsers" USING btree ("RaceId");


--
-- TOC entry 4626 (class 1259 OID 109058)
-- Name: IX_Attendance_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Attendance_UserId" ON public."Attendance" USING btree ("UserId");


--
-- TOC entry 4629 (class 1259 OID 109059)
-- Name: IX_AuditLog_AuditLogTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AuditLog_AuditLogTypeId" ON public."AuditLog" USING btree ("AuditLogTypeId");


--
-- TOC entry 4630 (class 1259 OID 109060)
-- Name: IX_AuditLog_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_AuditLog_UserId" ON public."AuditLog" USING btree ("UserId");


--
-- TOC entry 4636 (class 1259 OID 361023)
-- Name: IX_CalendarEventParticipant_CalendarEventId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CalendarEventParticipant_CalendarEventId" ON public."CalendarEventParticipant" USING btree ("CalendarEventId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4637 (class 1259 OID 361024)
-- Name: IX_CalendarEventParticipant_ParticipantUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CalendarEventParticipant_ParticipantUserId" ON public."CalendarEventParticipant" USING btree ("ParticipantUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4638 (class 1259 OID 109061)
-- Name: IX_CalendarEventParticipant_TenantId_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CalendarEventParticipant_TenantId_UserId" ON public."CalendarEventParticipant" USING btree ("TenantId", "UserId");


--
-- TOC entry 4633 (class 1259 OID 109062)
-- Name: IX_CalendarEvent_TenantId_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CalendarEvent_TenantId_UserId" ON public."CalendarEvent" USING btree ("TenantId", "UserId");


--
-- TOC entry 4641 (class 1259 OID 109063)
-- Name: IX_Caregiver_EducationId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Caregiver_EducationId" ON public."Caregiver" USING btree ("EducationId");


--
-- TOC entry 4642 (class 1259 OID 109064)
-- Name: IX_Caregiver_LanguageId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Caregiver_LanguageId" ON public."Caregiver" USING btree ("LanguageId");


--
-- TOC entry 4643 (class 1259 OID 109065)
-- Name: IX_Caregiver_RelationId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Caregiver_RelationId" ON public."Caregiver" USING btree ("RelationId");


--
-- TOC entry 4644 (class 1259 OID 109066)
-- Name: IX_Caregiver_SiteAddressId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Caregiver_SiteAddressId" ON public."Caregiver" USING btree ("SiteAddressId");


--
-- TOC entry 4661 (class 1259 OID 361027)
-- Name: IX_ChildProgressReportPeriod_ClassroomId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ChildProgressReportPeriod_ClassroomId" ON public."ChildProgressReportPeriod" USING btree ("ClassroomId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4655 (class 1259 OID 109067)
-- Name: IX_ChildProgressReport_ChildId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ChildProgressReport_ChildId" ON public."ChildProgressReport" USING btree ("ChildId");


--
-- TOC entry 4656 (class 1259 OID 361025)
-- Name: IX_ChildProgressReport_ChildProgressReportPeriodId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ChildProgressReport_ChildProgressReportPeriodId" ON public."ChildProgressReport" USING btree ("ChildProgressReportPeriodId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4657 (class 1259 OID 109068)
-- Name: IX_ChildProgressReport_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ChildProgressReport_UserId" ON public."ChildProgressReport" USING btree ("UserId");


--
-- TOC entry 4647 (class 1259 OID 109069)
-- Name: IX_Child_CaregiverId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_CaregiverId" ON public."Child" USING btree ("CaregiverId");


--
-- TOC entry 4648 (class 1259 OID 109070)
-- Name: IX_Child_Hierarchy_IsActive; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_Hierarchy_IsActive" ON public."Child" USING btree ("Hierarchy", "IsActive");


--
-- TOC entry 4649 (class 1259 OID 109071)
-- Name: IX_Child_LanguageId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_LanguageId" ON public."Child" USING btree ("LanguageId");


--
-- TOC entry 4650 (class 1259 OID 109072)
-- Name: IX_Child_ReasonForLeavingId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_ReasonForLeavingId" ON public."Child" USING btree ("ReasonForLeavingId");


--
-- TOC entry 4651 (class 1259 OID 109073)
-- Name: IX_Child_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_UserId" ON public."Child" USING btree ("UserId");


--
-- TOC entry 4652 (class 1259 OID 109074)
-- Name: IX_Child_WorkflowStatusId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Child_WorkflowStatusId" ON public."Child" USING btree ("WorkflowStatusId");


--
-- TOC entry 4665 (class 1259 OID 109075)
-- Name: IX_ClassProgramme_ClassroomGroupId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassProgramme_ClassroomGroupId" ON public."ClassProgramme" USING btree ("ClassroomGroupId");


--
-- TOC entry 4668 (class 1259 OID 361030)
-- Name: IX_ClassReassignmentHistory_AbsenteeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassReassignmentHistory_AbsenteeId" ON public."ClassReassignmentHistory" USING btree ("AbsenteeId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4669 (class 1259 OID 361031)
-- Name: IX_ClassReassignmentHistory_LoggedBy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassReassignmentHistory_LoggedBy" ON public."ClassReassignmentHistory" USING btree ("LoggedBy") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4670 (class 1259 OID 361028)
-- Name: IX_ClassReassignmentHistory_ReassignedBackToUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassReassignmentHistory_ReassignedBackToUserId" ON public."ClassReassignmentHistory" USING btree ("ReassignedBackToUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4671 (class 1259 OID 361029)
-- Name: IX_ClassReassignmentHistory_ReassignedToUser; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassReassignmentHistory_ReassignedToUser" ON public."ClassReassignmentHistory" USING btree ("ReassignedToUser") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4672 (class 1259 OID 109076)
-- Name: IX_ClassReassignmentHistory_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassReassignmentHistory_UserId" ON public."ClassReassignmentHistory" USING btree ("UserId");


--
-- TOC entry 4679 (class 1259 OID 109077)
-- Name: IX_ClassroomGroup_ClassroomId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassroomGroup_ClassroomId" ON public."ClassroomGroup" USING btree ("ClassroomId");


--
-- TOC entry 4680 (class 1259 OID 109078)
-- Name: IX_ClassroomGroup_ProgrammeTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassroomGroup_ProgrammeTypeId" ON public."ClassroomGroup" USING btree ("ProgrammeTypeId");


--
-- TOC entry 4681 (class 1259 OID 109079)
-- Name: IX_ClassroomGroup_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ClassroomGroup_UserId" ON public."ClassroomGroup" USING btree ("UserId");


--
-- TOC entry 4675 (class 1259 OID 109080)
-- Name: IX_Classroom_SiteAddressId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Classroom_SiteAddressId" ON public."Classroom" USING btree ("SiteAddressId");


--
-- TOC entry 4676 (class 1259 OID 109081)
-- Name: IX_Classroom_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Classroom_UserId" ON public."Classroom" USING btree ("UserId");


--
-- TOC entry 4688 (class 1259 OID 361033)
-- Name: IX_CoachContact_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachContact_UserId" ON public."CoachContact" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4698 (class 1259 OID 361039)
-- Name: IX_CoachFeedbackType_CoachFeedbackId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedbackType_CoachFeedbackId" ON public."CoachFeedbackType" USING btree ("CoachFeedbackId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4699 (class 1259 OID 361038)
-- Name: IX_CoachFeedbackType_FeedbackTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedbackType_FeedbackTypeId" ON public."CoachFeedbackType" USING btree ("FeedbackTypeId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4692 (class 1259 OID 361035)
-- Name: IX_CoachFeedback_FeedbackTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedback_FeedbackTypeId" ON public."CoachFeedback" USING btree ("FeedbackTypeId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4693 (class 1259 OID 361034)
-- Name: IX_CoachFeedback_FromUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedback_FromUserId" ON public."CoachFeedback" USING btree ("FromUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4694 (class 1259 OID 361037)
-- Name: IX_CoachFeedback_SupportRatingId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedback_SupportRatingId" ON public."CoachFeedback" USING btree ("SupportRatingId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4695 (class 1259 OID 361036)
-- Name: IX_CoachFeedback_ToUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CoachFeedback_ToUserId" ON public."CoachFeedback" USING btree ("ToUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4684 (class 1259 OID 361032)
-- Name: IX_Coach_SiteAddressId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Coach_SiteAddressId" ON public."Coach" USING btree ("SiteAddressId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4685 (class 1259 OID 109082)
-- Name: IX_Coach_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Coach_UserId" ON public."Coach" USING btree ("UserId");


--
-- TOC entry 4705 (class 1259 OID 361042)
-- Name: IX_CommunityProfileConnection_FromCommunityProfileId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CommunityProfileConnection_FromCommunityProfileId" ON public."CommunityProfileConnection" USING btree ("FromCommunityProfileId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4706 (class 1259 OID 361041)
-- Name: IX_CommunityProfileConnection_ToCommunityProfileId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CommunityProfileConnection_ToCommunityProfileId" ON public."CommunityProfileConnection" USING btree ("ToCommunityProfileId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4709 (class 1259 OID 361043)
-- Name: IX_CommunityProfileSkill_CommunityProfileId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CommunityProfileSkill_CommunityProfileId" ON public."CommunityProfileSkill" USING btree ("CommunityProfileId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4710 (class 1259 OID 361046)
-- Name: IX_CommunityProfileSkill_CommunitySkillId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CommunityProfileSkill_CommunitySkillId" ON public."CommunityProfileSkill" USING btree ("CommunitySkillId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4702 (class 1259 OID 361040)
-- Name: IX_CommunityProfile_ProvinceId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_CommunityProfile_ProvinceId" ON public."CommunityProfile" USING btree ("ProvinceId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4724 (class 1259 OID 109083)
-- Name: IX_ContentTypeField_ContentTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ContentTypeField_ContentTypeId" ON public."ContentTypeField" USING btree ("ContentTypeId");


--
-- TOC entry 4725 (class 1259 OID 109084)
-- Name: IX_ContentTypeField_FieldTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ContentTypeField_FieldTypeId" ON public."ContentTypeField" USING btree ("FieldTypeId");


--
-- TOC entry 4728 (class 1259 OID 361048)
-- Name: IX_ContentValue_ContentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ContentValue_ContentId" ON public."ContentValue" USING btree ("ContentId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4729 (class 1259 OID 109085)
-- Name: IX_ContentValue_ContentTypeFieldId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ContentValue_ContentTypeFieldId" ON public."ContentValue" USING btree ("ContentTypeFieldId");


--
-- TOC entry 4730 (class 1259 OID 109086)
-- Name: IX_ContentValue_StatusId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ContentValue_StatusId" ON public."ContentValue" USING btree ("StatusId");


--
-- TOC entry 4715 (class 1259 OID 109087)
-- Name: IX_Content_ContentTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Content_ContentTypeId" ON public."Content" USING btree ("ContentTypeId");


--
-- TOC entry 4733 (class 1259 OID 109088)
-- Name: IX_Document_ChildId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_ChildId" ON public."Document" USING btree ("ChildId");


--
-- TOC entry 4734 (class 1259 OID 361049)
-- Name: IX_Document_CreatedUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_CreatedUserId" ON public."Document" USING btree ("CreatedUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4735 (class 1259 OID 109089)
-- Name: IX_Document_DocumentTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_DocumentTypeId" ON public."Document" USING btree ("DocumentTypeId");


--
-- TOC entry 4736 (class 1259 OID 109090)
-- Name: IX_Document_PractitionerId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_PractitionerId" ON public."Document" USING btree ("PractitionerId");


--
-- TOC entry 4737 (class 1259 OID 109091)
-- Name: IX_Document_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_UserId" ON public."Document" USING btree ("UserId");


--
-- TOC entry 4738 (class 1259 OID 109092)
-- Name: IX_Document_WorkflowStatusId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Document_WorkflowStatusId" ON public."Document" USING btree ("WorkflowStatusId");


--
-- TOC entry 4965 (class 1259 OID 199057)
-- Name: IX_EcdRegistrationHistory_EcdRegistrationId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_EcdRegistrationHistory_EcdRegistrationId" ON public."EcdRegistrationHistory" USING btree ("EcdRegistrationId");


--
-- TOC entry 4960 (class 1259 OID 199033)
-- Name: IX_EcdRegistration_PractitionerId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_EcdRegistration_PractitionerId" ON public."EcdRegistration" USING btree ("PractitionerId");


--
-- TOC entry 4961 (class 1259 OID 199034)
-- Name: IX_EcdRegistration_Subsidy; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_EcdRegistration_Subsidy" ON public."EcdRegistration" USING btree ("Subsidy");


--
-- TOC entry 4962 (class 1259 OID 199056)
-- Name: IX_EcdRegistration_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_EcdRegistration_UserId" ON public."EcdRegistration" USING btree ("UserId");


--
-- TOC entry 4749 (class 1259 OID 109093)
-- Name: IX_Grant_CaregiverId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Grant_CaregiverId" ON public."Grant" USING btree ("CaregiverId");


--
-- TOC entry 4754 (class 1259 OID 361057)
-- Name: IX_Invite_PractitionerId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Invite_PractitionerId" ON public."Invite" USING btree ("PractitionerId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4755 (class 1259 OID 109094)
-- Name: IX_Invite_PrincipalId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Invite_PrincipalId" ON public."Invite" USING btree ("PrincipalId");


--
-- TOC entry 4756 (class 1259 OID 109095)
-- Name: IX_Invite_Status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Invite_Status" ON public."Invite" USING btree ("Status") WHERE ("IsActive" = true);


--
-- TOC entry 4757 (class 1259 OID 109096)
-- Name: IX_Invite_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Invite_UserId" ON public."Invite" USING btree ("UserId");


--
-- TOC entry 4760 (class 1259 OID 109097)
-- Name: IX_JWTUserTokens_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_JWTUserTokens_UserId" ON public."JWTUserTokens" USING btree ("UserId");


--
-- TOC entry 4763 (class 1259 OID 109098)
-- Name: IX_JobNotification_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_JobNotification_UserId" ON public."JobNotification" USING btree ("UserId");


--
-- TOC entry 4768 (class 1259 OID 109099)
-- Name: IX_Learner_Hierarchy_IsActive; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Learner_Hierarchy_IsActive" ON public."Learner" USING btree ("Hierarchy", "IsActive");


--
-- TOC entry 4769 (class 1259 OID 109100)
-- Name: IX_Learner_ProgrammeAttendanceReasonId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Learner_ProgrammeAttendanceReasonId" ON public."Learner" USING btree ("ProgrammeAttendanceReasonId");


--
-- TOC entry 4770 (class 1259 OID 109101)
-- Name: IX_Learner_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Learner_UserId" ON public."Learner" USING btree ("UserId");


--
-- TOC entry 4776 (class 1259 OID 109102)
-- Name: IX_MessageLog_FromUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_MessageLog_FromUserId" ON public."MessageLog" USING btree ("FromUserId");


--
-- TOC entry 4777 (class 1259 OID 109103)
-- Name: IX_MessageLog_SentByUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_MessageLog_SentByUserId" ON public."MessageLog" USING btree ("SentByUserId");


--
-- TOC entry 4788 (class 1259 OID 109104)
-- Name: IX_NavigationPermission_NavigationId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_NavigationPermission_NavigationId" ON public."NavigationPermission" USING btree ("NavigationId");


--
-- TOC entry 4791 (class 1259 OID 361061)
-- Name: IX_Note_CreatedUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Note_CreatedUserId" ON public."Note" USING btree ("CreatedUserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4792 (class 1259 OID 109105)
-- Name: IX_Note_NoteTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Note_NoteTypeId" ON public."Note" USING btree ("NoteTypeId");


--
-- TOC entry 4793 (class 1259 OID 109106)
-- Name: IX_Note_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Note_UserId" ON public."Note" USING btree ("UserId");


--
-- TOC entry 4800 (class 1259 OID 361063)
-- Name: IX_PQARating_LinkedVisitId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PQARating_LinkedVisitId" ON public."PQARating" USING btree ("LinkedVisitId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4801 (class 1259 OID 361062)
-- Name: IX_PQARating_VisitId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PQARating_VisitId" ON public."PQARating" USING btree ("VisitId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4804 (class 1259 OID 361064)
-- Name: IX_PQASectionRating_PQARatingId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PQASectionRating_PQARatingId" ON public."PQASectionRating" USING btree ("PQARatingId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4809 (class 1259 OID 361065)
-- Name: IX_PointsActivity_PointsCategoryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PointsActivity_PointsCategoryId" ON public."PointsActivity" USING btree ("PointsCategoryId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4816 (class 1259 OID 361067)
-- Name: IX_PointsUserSummary_PointsActivityId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PointsUserSummary_PointsActivityId" ON public."PointsUserSummary" USING btree ("PointsActivityId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4817 (class 1259 OID 361066)
-- Name: IX_PointsUserSummary_PointsLibraryId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PointsUserSummary_PointsLibraryId" ON public."PointsUserSummary" USING btree ("PointsLibraryId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4818 (class 1259 OID 109107)
-- Name: IX_PointsUserSummary_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PointsUserSummary_UserId" ON public."PointsUserSummary" USING btree ("UserId");


--
-- TOC entry 4826 (class 1259 OID 361070)
-- Name: IX_PractitionerRemovalHistory_ClassroomId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PractitionerRemovalHistory_ClassroomId" ON public."PractitionerRemovalHistory" USING btree ("ClassroomId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4827 (class 1259 OID 361069)
-- Name: IX_PractitionerRemovalHistory_ReasonForPractitionerLeavingProgr; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PractitionerRemovalHistory_ReasonForPractitionerLeavingProgr" ON public."PractitionerRemovalHistory" USING btree ("ReasonForPractitionerLeavingProgrammeId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4828 (class 1259 OID 109108)
-- Name: IX_PractitionerRemovalHistory_RemovedByUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PractitionerRemovalHistory_RemovedByUserId" ON public."PractitionerRemovalHistory" USING btree ("RemovedByUserId");


--
-- TOC entry 4829 (class 1259 OID 109109)
-- Name: IX_PractitionerRemovalHistory_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_PractitionerRemovalHistory_UserId" ON public."PractitionerRemovalHistory" USING btree ("UserId");


--
-- TOC entry 4821 (class 1259 OID 361068)
-- Name: IX_Practitioner_ReasonForPractitionerLeavingId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Practitioner_ReasonForPractitionerLeavingId" ON public."Practitioner" USING btree ("ReasonForPractitionerLeavingId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4822 (class 1259 OID 109110)
-- Name: IX_Practitioner_SiteAddressId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Practitioner_SiteAddressId" ON public."Practitioner" USING btree ("SiteAddressId");


--
-- TOC entry 4823 (class 1259 OID 109111)
-- Name: IX_Practitioner_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Practitioner_UserId" ON public."Practitioner" USING btree ("UserId");


--
-- TOC entry 4838 (class 1259 OID 109112)
-- Name: IX_ProgrammeDay_ProgrammeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ProgrammeDay_ProgrammeId" ON public."ProgrammeDay" USING btree ("ProgrammeId");


--
-- TOC entry 4832 (class 1259 OID 361071)
-- Name: IX_Programme_ClassroomGroupId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Programme_ClassroomGroupId" ON public."Programme" USING btree ("ClassroomGroupId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4833 (class 1259 OID 109113)
-- Name: IX_Programme_ClassroomId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Programme_ClassroomId" ON public."Programme" USING btree ("ClassroomId");


--
-- TOC entry 4968 (class 1259 OID 360882)
-- Name: IX_ResourceLinkHealthCheck_SectionType; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ResourceLinkHealthCheck_SectionType" ON public."ResourceLinkHealthCheck" USING btree ("TenantId", "SectionType", "Status");


--
-- TOC entry 4855 (class 1259 OID 109114)
-- Name: IX_RolePermission_RoleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_RolePermission_RoleId" ON public."RolePermission" USING btree ("RoleId");


--
-- TOC entry 4858 (class 1259 OID 109115)
-- Name: IX_ShortUrl_MessageLogId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ShortUrl_MessageLogId" ON public."ShortUrl" USING btree ("MessageLogId");


--
-- TOC entry 4859 (class 1259 OID 109116)
-- Name: IX_ShortUrl_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_ShortUrl_UserId" ON public."ShortUrl" USING btree ("UserId");


--
-- TOC entry 4862 (class 1259 OID 109117)
-- Name: IX_SiteAddress_ProvinceId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_SiteAddress_ProvinceId" ON public."SiteAddress" USING btree ("ProvinceId");


--
-- TOC entry 4869 (class 1259 OID 361082)
-- Name: IX_StatementsExpenses_StatementsIncomeStatementId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsExpenses_StatementsIncomeStatementId" ON public."StatementsExpenses" USING btree ("StatementsIncomeStatementId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4878 (class 1259 OID 109118)
-- Name: IX_StatementsIncomeStatement_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsIncomeStatement_UserId" ON public."StatementsIncomeStatement" USING btree ("UserId");


--
-- TOC entry 4874 (class 1259 OID 109119)
-- Name: IX_StatementsIncome_ChildUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsIncome_ChildUserId" ON public."StatementsIncome" USING btree ("ChildUserId");


--
-- TOC entry 4875 (class 1259 OID 361088)
-- Name: IX_StatementsIncome_StatementsIncomeStatementId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsIncome_StatementsIncomeStatementId" ON public."StatementsIncome" USING btree ("StatementsIncomeStatementId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4885 (class 1259 OID 109120)
-- Name: IX_StatementsStartupSupport_ChildUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsStartupSupport_ChildUserId" ON public."StatementsStartupSupport" USING btree ("ChildUserId");


--
-- TOC entry 4886 (class 1259 OID 109121)
-- Name: IX_StatementsStartupSupport_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_StatementsStartupSupport_UserId" ON public."StatementsStartupSupport" USING btree ("UserId");


--
-- TOC entry 4895 (class 1259 OID 361091)
-- Name: IX_TenantHasModule_ModuleId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_TenantHasModule_ModuleId" ON public."TenantHasModule" USING btree ("ModuleId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4902 (class 1259 OID 109122)
-- Name: IX_UserConsent_CreatedUserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserConsent_CreatedUserId" ON public."UserConsent" USING btree ("CreatedUserId");


--
-- TOC entry 4903 (class 1259 OID 109123)
-- Name: IX_UserConsent_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserConsent_UserId" ON public."UserConsent" USING btree ("UserId");


--
-- TOC entry 4906 (class 1259 OID 109124)
-- Name: IX_UserGrants_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserGrants_UserId" ON public."UserGrants" USING btree ("UserId");


--
-- TOC entry 4909 (class 1259 OID 361120)
-- Name: IX_UserHelp_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserHelp_UserId" ON public."UserHelp" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4912 (class 1259 OID 361121)
-- Name: IX_UserHierarchy_ParentId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserHierarchy_ParentId" ON public."UserHierarchy" USING btree ("ParentId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4913 (class 1259 OID 109125)
-- Name: IX_UserHierarchy_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserHierarchy_UserId" ON public."UserHierarchy" USING btree ("UserId");


--
-- TOC entry 4916 (class 1259 OID 361123)
-- Name: IX_UserLanguages_LanguageId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserLanguages_LanguageId" ON public."UserLanguages" USING btree ("LanguageId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4917 (class 1259 OID 361122)
-- Name: IX_UserLanguages_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserLanguages_UserId" ON public."UserLanguages" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4920 (class 1259 OID 361124)
-- Name: IX_UserPermission_PermissionId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserPermission_PermissionId" ON public."UserPermission" USING btree ("PermissionId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4921 (class 1259 OID 361125)
-- Name: IX_UserPermission_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserPermission_UserId" ON public."UserPermission" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4924 (class 1259 OID 361126)
-- Name: IX_UserResourceLikes_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserResourceLikes_UserId" ON public."UserResourceLikes" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4927 (class 1259 OID 360903)
-- Name: IX_UserTrainingCourse_ExternalCourseId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserTrainingCourse_ExternalCourseId" ON public."UserTrainingCourse" USING btree ("ExternalCourseId");


--
-- TOC entry 4928 (class 1259 OID 109126)
-- Name: IX_UserTrainingCourse_TenantId_CompletedDate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserTrainingCourse_TenantId_CompletedDate" ON public."UserTrainingCourse" USING btree ("TenantId", "CompletedDate");


--
-- TOC entry 4929 (class 1259 OID 360901)
-- Name: IX_UserTrainingCourse_TenantId_StartedDate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserTrainingCourse_TenantId_StartedDate" ON public."UserTrainingCourse" USING btree ("TenantId", "StartedDate");


--
-- TOC entry 4930 (class 1259 OID 109127)
-- Name: IX_UserTrainingCourse_UserId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserTrainingCourse_UserId" ON public."UserTrainingCourse" USING btree ("UserId");


--
-- TOC entry 4931 (class 1259 OID 360902)
-- Name: IX_UserTrainingCourse_UserId_Status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_UserTrainingCourse_UserId_Status" ON public."UserTrainingCourse" USING btree ("UserId", "Status");


--
-- TOC entry 4943 (class 1259 OID 361140)
-- Name: IX_VisitDataStatus_VisitDataId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_VisitDataStatus_VisitDataId" ON public."VisitDataStatus" USING btree ("VisitDataId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4940 (class 1259 OID 361134)
-- Name: IX_VisitData_VisitId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_VisitData_VisitId" ON public."VisitData" USING btree ("VisitId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4934 (class 1259 OID 361133)
-- Name: IX_Visit_CoachId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Visit_CoachId" ON public."Visit" USING btree ("CoachId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4935 (class 1259 OID 109128)
-- Name: IX_Visit_EventId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Visit_EventId" ON public."Visit" USING btree ("EventId");


--
-- TOC entry 4936 (class 1259 OID 361132)
-- Name: IX_Visit_PractitionerId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Visit_PractitionerId" ON public."Visit" USING btree ("PractitionerId") WITH (fillfactor='100', deduplicate_items='true');


--
-- TOC entry 4937 (class 1259 OID 109129)
-- Name: IX_Visit_VisitTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_Visit_VisitTypeId" ON public."Visit" USING btree ("VisitTypeId");


--
-- TOC entry 4948 (class 1259 OID 109130)
-- Name: IX_WorkflowStatus_WorkflowStatusTypeId; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IX_WorkflowStatus_WorkflowStatusTypeId" ON public."WorkflowStatus" USING btree ("WorkflowStatusTypeId");


--
-- TOC entry 4664 (class 1259 OID 268636)
-- Name: UX_ChildProgressReportPeriod_Classroom_StartDate_Active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UX_ChildProgressReportPeriod_Classroom_StartDate_Active" ON public."ChildProgressReportPeriod" USING btree ("ClassroomId", "StartDate") WHERE ("IsActive" = true);


--
-- TOC entry 4660 (class 1259 OID 361026)
-- Name: UX_ChildProgressReport_ChildId_Period_Active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UX_ChildProgressReport_ChildId_Period_Active" ON public."ChildProgressReport" USING btree ("ChildId", "ChildProgressReportPeriodId") WITH (fillfactor='100', deduplicate_items='true') WHERE ("IsActive" = true);


--
-- TOC entry 4773 (class 1259 OID 361060)
-- Name: UX_Learner_OneActiveLearnerPerChild; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UX_Learner_OneActiveLearnerPerChild" ON public."Learner" USING btree ("UserId") WITH (fillfactor='100', deduplicate_items='true') WHERE (("IsActive" = true) AND ("StoppedAttendance" IS NULL));


--
-- TOC entry 4971 (class 1259 OID 360881)
-- Name: UX_ResourceLinkHealthCheck_Content; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UX_ResourceLinkHealthCheck_Content" ON public."ResourceLinkHealthCheck" USING btree ("TenantId", "ContentType", "ContentId", "LocaleId");


--
-- TOC entry 4974 (class 1259 OID 360916)
-- Name: UX_UserFlag_UserId_FlagKey; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UX_UserFlag_UserId_FlagKey" ON public."UserFlag" USING btree ("UserId", "FlagKey");


--
-- TOC entry 4624 (class 1259 OID 109131)
-- Name: UserNameIndex; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "UserNameIndex" ON public."AspNetUsers" USING btree ("NormalizedUserName");


--
-- TOC entry 4625 (class 1259 OID 109132)
-- Name: aspnetusers_fullname_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX aspnetusers_fullname_idx ON public."AspNetUsers" USING btree ("FullName", "IdNumber", "PhoneNumber", "Email");


--
-- TOC entry 4691 (class 1259 OID 109133)
-- Name: idx_coach_contacts_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_coach_contacts_unique ON public."CoachContact" USING btree ("CoachId", "PractitionerId", "ActionItemType", "Period");


--
-- TOC entry 5125 (class 2620 OID 360895)
-- Name: UserResourceProblemReport trg_notify_slack_user_resource_problem_report; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_notify_slack_user_resource_problem_report AFTER INSERT ON public."UserResourceProblemReport" FOR EACH ROW EXECUTE FUNCTION public.notify_slack_user_resource_problem_report();


--
-- TOC entry 5124 (class 2620 OID 268638)
-- Name: AppLog trigger_notify_important_error; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_notify_important_error AFTER INSERT ON public."AppLog" FOR EACH ROW EXECUTE FUNCTION public.notify_important_error();


--
-- TOC entry 4979 (class 2606 OID 25545)
-- Name: Absentees FK_Absentees_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "FK_Absentees_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4980 (class 2606 OID 25550)
-- Name: Absentees FK_Absentees_PractitionerRemovalHistory_PractitionerRemovalHist; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "FK_Absentees_PractitionerRemovalHistory_PractitionerRemovalHist" FOREIGN KEY ("PractitionerRemovalHistoryId") REFERENCES public."PractitionerRemovalHistory"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4981 (class 2606 OID 25555)
-- Name: Absentees FK_Absentees_Practitioner_PractitionerId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "FK_Absentees_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");


--
-- TOC entry 4982 (class 2606 OID 360974)
-- Name: Absentees FK_Absentees_Programme_ProgramId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "FK_Absentees_Programme_ProgramId" FOREIGN KEY ("ProgramId") REFERENCES public."Programme"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5114 (class 2606 OID 360982)
-- Name: AppLog FK_AppLog_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AppLog"
    ADD CONSTRAINT "FK_AppLog_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE SET NULL;


--
-- TOC entry 4983 (class 2606 OID 25560)
-- Name: AspNetRoleClaims FK_AspNetRoleClaims_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetRoleClaims"
    ADD CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4984 (class 2606 OID 25565)
-- Name: AspNetUserClaims FK_AspNetUserClaims_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4985 (class 2606 OID 25570)
-- Name: AspNetUserLogins FK_AspNetUserLogins_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4986 (class 2606 OID 25575)
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 4987 (class 2606 OID 25580)
-- Name: AspNetUserRoles FK_AspNetUserRoles_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4988 (class 2606 OID 25585)
-- Name: AspNetUserTokens FK_AspNetUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4989 (class 2606 OID 25590)
-- Name: AspNetUsers FK_AspNetUsers_Gender_GenderId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "FK_AspNetUsers_Gender_GenderId" FOREIGN KEY ("GenderId") REFERENCES public."Gender"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4999 (class 2606 OID 25595)
-- Name: Caregiver FK_AspNetUsers_Language_LanguageId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "FK_AspNetUsers_Language_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4990 (class 2606 OID 25600)
-- Name: AspNetUsers FK_AspNetUsers_Race_RaceId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AspNetUsers"
    ADD CONSTRAINT "FK_AspNetUsers_Race_RaceId" FOREIGN KEY ("RaceId") REFERENCES public."Race"("Id") ON DELETE RESTRICT;


--
-- TOC entry 4991 (class 2606 OID 25605)
-- Name: Attendance FK_Attendance_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "FK_Attendance_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4992 (class 2606 OID 25610)
-- Name: Attendance FK_Attendance_ClassProgramme_ClassroomProgrammeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "FK_Attendance_ClassProgramme_ClassroomProgrammeId" FOREIGN KEY ("ClassroomProgrammeId") REFERENCES public."ClassProgramme"("Id") ON DELETE CASCADE;


--
-- TOC entry 4993 (class 2606 OID 25615)
-- Name: AuditLog FK_AuditLog_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "FK_AuditLog_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4994 (class 2606 OID 25620)
-- Name: AuditLog FK_AuditLog_AuditLogType_AuditLogTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "FK_AuditLog_AuditLogType_AuditLogTypeId" FOREIGN KEY ("AuditLogTypeId") REFERENCES public."AuditLogType"("Id") ON DELETE CASCADE;


--
-- TOC entry 4996 (class 2606 OID 25625)
-- Name: CalendarEventParticipant FK_CalendarEventParticipant_AspNetUsers_ParticipantUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEventParticipant"
    ADD CONSTRAINT "FK_CalendarEventParticipant_AspNetUsers_ParticipantUserId" FOREIGN KEY ("ParticipantUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4997 (class 2606 OID 25630)
-- Name: CalendarEventParticipant FK_CalendarEventParticipant_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEventParticipant"
    ADD CONSTRAINT "FK_CalendarEventParticipant_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 4998 (class 2606 OID 25635)
-- Name: CalendarEventParticipant FK_CalendarEventParticipant_CalendarEvent_Id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEventParticipant"
    ADD CONSTRAINT "FK_CalendarEventParticipant_CalendarEvent_Id" FOREIGN KEY ("CalendarEventId") REFERENCES public."CalendarEvent"("Id") ON DELETE CASCADE;


--
-- TOC entry 4995 (class 2606 OID 25640)
-- Name: CalendarEvent FK_CalendarEvent_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CalendarEvent"
    ADD CONSTRAINT "FK_CalendarEvent_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5000 (class 2606 OID 25645)
-- Name: Caregiver FK_Caregiver_Education_EducationId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "FK_Caregiver_Education_EducationId" FOREIGN KEY ("EducationId") REFERENCES public."Education"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5001 (class 2606 OID 25650)
-- Name: Caregiver FK_Caregiver_Language_LanguageId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "FK_Caregiver_Language_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5002 (class 2606 OID 25655)
-- Name: Caregiver FK_Caregiver_Relation_RelationId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "FK_Caregiver_Relation_RelationId" FOREIGN KEY ("RelationId") REFERENCES public."Relation"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5003 (class 2606 OID 25660)
-- Name: Caregiver FK_Caregiver_SiteAddress_SiteAddressId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Caregiver"
    ADD CONSTRAINT "FK_Caregiver_SiteAddress_SiteAddressId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5012 (class 2606 OID 25665)
-- Name: ChildProgressReportPeriod FK_ChildProgressReportPeriod_ClassroomId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReportPeriod"
    ADD CONSTRAINT "FK_ChildProgressReportPeriod_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES public."Classroom"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5009 (class 2606 OID 25670)
-- Name: ChildProgressReport FK_ChildProgressReport_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReport"
    ADD CONSTRAINT "FK_ChildProgressReport_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5010 (class 2606 OID 25675)
-- Name: ChildProgressReport FK_ChildProgressReport_ChildProgressReportPeriod; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReport"
    ADD CONSTRAINT "FK_ChildProgressReport_ChildProgressReportPeriod" FOREIGN KEY ("ChildProgressReportPeriodId") REFERENCES public."ChildProgressReportPeriod"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5011 (class 2606 OID 25680)
-- Name: ChildProgressReport FK_ChildProgressReport_Child_ChildId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ChildProgressReport"
    ADD CONSTRAINT "FK_ChildProgressReport_Child_ChildId" FOREIGN KEY ("ChildId") REFERENCES public."Child"("Id") ON DELETE CASCADE;


--
-- TOC entry 5004 (class 2606 OID 25690)
-- Name: Child FK_Child_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5005 (class 2606 OID 25695)
-- Name: Child FK_Child_Caregiver_CaregiverId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_Caregiver_CaregiverId" FOREIGN KEY ("CaregiverId") REFERENCES public."Caregiver"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5006 (class 2606 OID 25700)
-- Name: Child FK_Child_Language_LanguageId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_Language_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5007 (class 2606 OID 25705)
-- Name: Child FK_Child_ReasonForLeaving_ReasonForLeavingId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_ReasonForLeaving_ReasonForLeavingId" FOREIGN KEY ("ReasonForLeavingId") REFERENCES public."ReasonForLeaving"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5008 (class 2606 OID 25710)
-- Name: Child FK_Child_WorkflowStatus_WorkflowStatusId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_WorkflowStatus_WorkflowStatusId" FOREIGN KEY ("WorkflowStatusId") REFERENCES public."WorkflowStatus"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5013 (class 2606 OID 25715)
-- Name: ClassProgramme FK_ClassProgramme_ClassroomGroup_ClassroomGroupId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassProgramme"
    ADD CONSTRAINT "FK_ClassProgramme_ClassroomGroup_ClassroomGroupId" FOREIGN KEY ("ClassroomGroupId") REFERENCES public."ClassroomGroup"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5014 (class 2606 OID 25720)
-- Name: ClassReassignmentHistory FK_ClassReassignmentHistory_Absentees_AbsenteeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_Absentees_AbsenteeId" FOREIGN KEY ("AbsenteeId") REFERENCES public."Absentees"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5015 (class 2606 OID 25725)
-- Name: ClassReassignmentHistory FK_ClassReassignmentHistory_AspNetUsers_LoggedBy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_AspNetUsers_LoggedBy" FOREIGN KEY ("LoggedBy") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5016 (class 2606 OID 25730)
-- Name: ClassReassignmentHistory FK_ClassReassignmentHistory_AspNetUsers_ReassignedBackToUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_AspNetUsers_ReassignedBackToUserId" FOREIGN KEY ("ReassignedBackToUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5017 (class 2606 OID 25735)
-- Name: ClassReassignmentHistory FK_ClassReassignmentHistory_AspNetUsers_ReassignedToUser; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_AspNetUsers_ReassignedToUser" FOREIGN KEY ("ReassignedToUser") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5018 (class 2606 OID 25740)
-- Name: ClassReassignmentHistory FK_ClassReassignmentHistory_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 25745)
-- Name: ClassroomGroup FK_ClassroomGroup_Classroom_ClassroomId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassroomGroup"
    ADD CONSTRAINT "FK_ClassroomGroup_Classroom_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES public."Classroom"("Id") ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 25750)
-- Name: ClassroomGroup FK_ClassroomGroup_ProgrammeType_ProgrammeTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClassroomGroup"
    ADD CONSTRAINT "FK_ClassroomGroup_ProgrammeType_ProgrammeTypeId" FOREIGN KEY ("ProgrammeTypeId") REFERENCES public."ProgrammeType"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5019 (class 2606 OID 25755)
-- Name: Classroom FK_Classroom_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classroom"
    ADD CONSTRAINT "FK_Classroom_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 25760)
-- Name: Classroom FK_Classroom_SiteAddress_SiteAddressId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Classroom"
    ADD CONSTRAINT "FK_Classroom_SiteAddress_SiteAddressId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5025 (class 2606 OID 25765)
-- Name: CoachContact FK_CoachContact_CoachId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachContact"
    ADD CONSTRAINT "FK_CoachContact_CoachId" FOREIGN KEY ("CoachId") REFERENCES public."Coach"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5026 (class 2606 OID 25770)
-- Name: CoachContact FK_CoachContact_PractitionerId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachContact"
    ADD CONSTRAINT "FK_CoachContact_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5027 (class 2606 OID 25775)
-- Name: CoachContact FK_CoachContact_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachContact"
    ADD CONSTRAINT "FK_CoachContact_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5032 (class 2606 OID 25780)
-- Name: CoachFeedbackType FK_CoachFeedbackType_CoachFeedbackId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedbackType"
    ADD CONSTRAINT "FK_CoachFeedbackType_CoachFeedbackId" FOREIGN KEY ("CoachFeedbackId") REFERENCES public."CoachFeedback"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5033 (class 2606 OID 25785)
-- Name: CoachFeedbackType FK_CoachFeedbackType_FeedbackTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedbackType"
    ADD CONSTRAINT "FK_CoachFeedbackType_FeedbackTypeId" FOREIGN KEY ("FeedbackTypeId") REFERENCES public."FeedbackType"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5028 (class 2606 OID 25790)
-- Name: CoachFeedback FK_CoachFeedback_FeedbackTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedback"
    ADD CONSTRAINT "FK_CoachFeedback_FeedbackTypeId" FOREIGN KEY ("FeedbackTypeId") REFERENCES public."FeedbackType"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5029 (class 2606 OID 25795)
-- Name: CoachFeedback FK_CoachFeedback_FromUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedback"
    ADD CONSTRAINT "FK_CoachFeedback_FromUserId" FOREIGN KEY ("FromUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5030 (class 2606 OID 25800)
-- Name: CoachFeedback FK_CoachFeedback_SupportRatingId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedback"
    ADD CONSTRAINT "FK_CoachFeedback_SupportRatingId" FOREIGN KEY ("SupportRatingId") REFERENCES public."SupportRating"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5031 (class 2606 OID 25805)
-- Name: CoachFeedback FK_CoachFeedback_ToUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CoachFeedback"
    ADD CONSTRAINT "FK_CoachFeedback_ToUserId" FOREIGN KEY ("ToUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5023 (class 2606 OID 25810)
-- Name: Coach FK_Coach_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coach"
    ADD CONSTRAINT "FK_Coach_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 25815)
-- Name: Coach FK_Coach_SiteAddress_SiteAddressId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Coach"
    ADD CONSTRAINT "FK_Coach_SiteAddress_SiteAddressId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5035 (class 2606 OID 25820)
-- Name: CommunityProfileConnection FK_CommunityProfileConnection_FromCommunityProfileId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileConnection"
    ADD CONSTRAINT "FK_CommunityProfileConnection_FromCommunityProfileId" FOREIGN KEY ("FromCommunityProfileId") REFERENCES public."CommunityProfile"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5036 (class 2606 OID 25825)
-- Name: CommunityProfileConnection FK_CommunityProfileConnection_ToCommunityProfileId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileConnection"
    ADD CONSTRAINT "FK_CommunityProfileConnection_ToCommunityProfileId" FOREIGN KEY ("ToCommunityProfileId") REFERENCES public."CommunityProfile"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5037 (class 2606 OID 25830)
-- Name: CommunityProfileSkill FK_CommunityProfileSkill_CommunityProfileId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileSkill"
    ADD CONSTRAINT "FK_CommunityProfileSkill_CommunityProfileId" FOREIGN KEY ("CommunityProfileId") REFERENCES public."CommunityProfile"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5038 (class 2606 OID 25835)
-- Name: CommunityProfileSkill FK_CommunityProfileSkill_CommunitySkillId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfileSkill"
    ADD CONSTRAINT "FK_CommunityProfileSkill_CommunitySkillId" FOREIGN KEY ("CommunitySkillId") REFERENCES public."CommunitySkill"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5034 (class 2606 OID 25840)
-- Name: CommunityProfile FK_CommunityProfile_ProvinceId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."CommunityProfile"
    ADD CONSTRAINT "FK_CommunityProfile_ProvinceId" FOREIGN KEY ("ProvinceId") REFERENCES public."Province"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5040 (class 2606 OID 25845)
-- Name: ContentTypeField FK_ContentTypeField_ContentFieldType_FieldTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentTypeField"
    ADD CONSTRAINT "FK_ContentTypeField_ContentFieldType_FieldTypeId" FOREIGN KEY ("FieldTypeId") REFERENCES public."ContentFieldType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5041 (class 2606 OID 25850)
-- Name: ContentTypeField FK_ContentTypeField_ContentType_ContentTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentTypeField"
    ADD CONSTRAINT "FK_ContentTypeField_ContentType_ContentTypeId" FOREIGN KEY ("ContentTypeId") REFERENCES public."ContentType"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5042 (class 2606 OID 25855)
-- Name: ContentValue FK_ContentValue_ContentStatus_StatusId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentValue"
    ADD CONSTRAINT "FK_ContentValue_ContentStatus_StatusId" FOREIGN KEY ("StatusId") REFERENCES public."ContentStatus"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5043 (class 2606 OID 25860)
-- Name: ContentValue FK_ContentValue_ContentTypeField_ContentTypeFieldId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentValue"
    ADD CONSTRAINT "FK_ContentValue_ContentTypeField_ContentTypeFieldId" FOREIGN KEY ("ContentTypeFieldId") REFERENCES public."ContentTypeField"("Id") ON DELETE CASCADE;


--
-- TOC entry 5044 (class 2606 OID 25865)
-- Name: ContentValue FK_ContentValue_Content_ContentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContentValue"
    ADD CONSTRAINT "FK_ContentValue_Content_ContentId" FOREIGN KEY ("ContentId") REFERENCES public."Content"("Id") ON DELETE CASCADE;


--
-- TOC entry 5039 (class 2606 OID 25870)
-- Name: Content FK_Content_ContentType_ContentTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Content"
    ADD CONSTRAINT "FK_Content_ContentType_ContentTypeId" FOREIGN KEY ("ContentTypeId") REFERENCES public."ContentType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5045 (class 2606 OID 25875)
-- Name: Document FK_Document_AspNetUsers_CreatedUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_AspNetUsers_CreatedUserId" FOREIGN KEY ("CreatedUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5046 (class 2606 OID 25880)
-- Name: Document FK_Document_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 25885)
-- Name: Document FK_Document_Child_ChildId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_Child_ChildId" FOREIGN KEY ("ChildId") REFERENCES public."Child"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5048 (class 2606 OID 25890)
-- Name: Document FK_Document_DocumentType_DocumentTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_DocumentType_DocumentTypeId" FOREIGN KEY ("DocumentTypeId") REFERENCES public."DocumentType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 25895)
-- Name: Document FK_Document_Practitioner_PractitionerId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5050 (class 2606 OID 25900)
-- Name: Document FK_Document_WorkflowStatus_WorkflowStatusId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_WorkflowStatus_WorkflowStatusId" FOREIGN KEY ("WorkflowStatusId") REFERENCES public."WorkflowStatus"("Id") ON DELETE CASCADE;


--
-- TOC entry 5117 (class 2606 OID 199051)
-- Name: EcdRegistrationHistory FK_EcdRegistrationHistory_AspNetUsers; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistrationHistory"
    ADD CONSTRAINT "FK_EcdRegistrationHistory_AspNetUsers" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE SET NULL;


--
-- TOC entry 5118 (class 2606 OID 199046)
-- Name: EcdRegistrationHistory FK_EcdRegistrationHistory_EcdRegistration; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistrationHistory"
    ADD CONSTRAINT "FK_EcdRegistrationHistory_EcdRegistration" FOREIGN KEY ("EcdRegistrationId") REFERENCES public."EcdRegistration"("Id") ON DELETE CASCADE;


--
-- TOC entry 5115 (class 2606 OID 199023)
-- Name: EcdRegistration FK_EcdRegistration_AspNetUsers; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistration"
    ADD CONSTRAINT "FK_EcdRegistration_AspNetUsers" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE SET NULL;


--
-- TOC entry 5116 (class 2606 OID 199028)
-- Name: EcdRegistration FK_EcdRegistration_Practitioner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."EcdRegistration"
    ADD CONSTRAINT "FK_EcdRegistration_Practitioner" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 25905)
-- Name: Grant FK_Grant_Caregiver_CaregiverId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Grant"
    ADD CONSTRAINT "FK_Grant_Caregiver_CaregiverId" FOREIGN KEY ("CaregiverId") REFERENCES public."Caregiver"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5052 (class 2606 OID 25910)
-- Name: Invite FK_Invite_Practitioner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "FK_Invite_Practitioner" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5053 (class 2606 OID 25915)
-- Name: Invite FK_Invite_PrincipalPractitioner; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "FK_Invite_PrincipalPractitioner" FOREIGN KEY ("PrincipalId") REFERENCES public."Practitioner"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5054 (class 2606 OID 25920)
-- Name: Invite FK_Invite_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Invite"
    ADD CONSTRAINT "FK_Invite_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5055 (class 2606 OID 25925)
-- Name: JWTUserTokens FK_JWTUserTokens_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JWTUserTokens"
    ADD CONSTRAINT "FK_JWTUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5056 (class 2606 OID 25930)
-- Name: JobNotification FK_JobNotification_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."JobNotification"
    ADD CONSTRAINT "FK_JobNotification_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 25935)
-- Name: Learner FK_Learner_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Learner"
    ADD CONSTRAINT "FK_Learner_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5058 (class 2606 OID 25940)
-- Name: Learner FK_Learner_ClassroomGroup_ClassroomGroupId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Learner"
    ADD CONSTRAINT "FK_Learner_ClassroomGroup_ClassroomGroupId" FOREIGN KEY ("ClassroomGroupId") REFERENCES public."ClassroomGroup"("Id") ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 25945)
-- Name: Learner FK_Learner_ProgrammeAttendanceReason_ProgrammeAttendanceReason~; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Learner"
    ADD CONSTRAINT "FK_Learner_ProgrammeAttendanceReason_ProgrammeAttendanceReason~" FOREIGN KEY ("ProgrammeAttendanceReasonId") REFERENCES public."ProgrammeAttendanceReason"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5060 (class 2606 OID 25955)
-- Name: NavigationPermission FK_NavigationPermission_Navigation_NavigationId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NavigationPermission"
    ADD CONSTRAINT "FK_NavigationPermission_Navigation_NavigationId" FOREIGN KEY ("NavigationId") REFERENCES public."Navigation"("Id") ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 25960)
-- Name: NavigationPermission FK_NavigationPermission_Permission_PermissionId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."NavigationPermission"
    ADD CONSTRAINT "FK_NavigationPermission_Permission_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES public."Permission"("Id") ON DELETE CASCADE;


--
-- TOC entry 5062 (class 2606 OID 25965)
-- Name: Note FK_Note_AspNetUsers_CreatedUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "FK_Note_AspNetUsers_CreatedUserId" FOREIGN KEY ("CreatedUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5063 (class 2606 OID 25970)
-- Name: Note FK_Note_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "FK_Note_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 25975)
-- Name: Note FK_Note_NoteType_NoteTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "FK_Note_NoteType_NoteTypeId" FOREIGN KEY ("NoteTypeId") REFERENCES public."NoteType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5065 (class 2606 OID 25980)
-- Name: PQARating FK_PQARating_LinkedVisitId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PQARating"
    ADD CONSTRAINT "FK_PQARating_LinkedVisitId" FOREIGN KEY ("LinkedVisitId") REFERENCES public."Visit"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5066 (class 2606 OID 25985)
-- Name: PQARating FK_PQARating_VisitId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PQARating"
    ADD CONSTRAINT "FK_PQARating_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5067 (class 2606 OID 25990)
-- Name: PQASectionRating FK_PQASectionRating_PQARatingId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PQASectionRating"
    ADD CONSTRAINT "FK_PQASectionRating_PQARatingId" FOREIGN KEY ("PQARatingId") REFERENCES public."PQARating"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5068 (class 2606 OID 25995)
-- Name: PointsActivity FK_PointsActivity_PointsCategoryId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsActivity"
    ADD CONSTRAINT "FK_PointsActivity_PointsCategoryId" FOREIGN KEY ("PointsCategoryId") REFERENCES public."PointsCategory"("Id");


--
-- TOC entry 5069 (class 2606 OID 26000)
-- Name: PointsUserSummary FK_PointsUserSummary_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "FK_PointsUserSummary_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 26005)
-- Name: PointsUserSummary FK_PointsUserSummary_PointsActivityId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "FK_PointsUserSummary_PointsActivityId" FOREIGN KEY ("PointsActivityId") REFERENCES public."PointsActivity"("Id");


--
-- TOC entry 5075 (class 2606 OID 26010)
-- Name: PractitionerRemovalHistory FK_PractitionerRemovalHistory_AspNetUsers_RemovedByUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "FK_PractitionerRemovalHistory_AspNetUsers_RemovedByUserId" FOREIGN KEY ("RemovedByUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5076 (class 2606 OID 26015)
-- Name: PractitionerRemovalHistory FK_PractitionerRemovalHistory_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "FK_PractitionerRemovalHistory_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5077 (class 2606 OID 26020)
-- Name: PractitionerRemovalHistory FK_PractitionerRemovalHistory_ClassroomId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "FK_PractitionerRemovalHistory_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES public."Classroom"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5078 (class 2606 OID 26025)
-- Name: PractitionerRemovalHistory FK_PractitionerRemovalHistory_ReasonForPractitionerLeavingProgr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "FK_PractitionerRemovalHistory_ReasonForPractitionerLeavingProgr" FOREIGN KEY ("ReasonForPractitionerLeavingProgrammeId") REFERENCES public."ReasonForPractitionerLeavingProgramme"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5072 (class 2606 OID 26030)
-- Name: Practitioner FK_Practitioner_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Practitioner"
    ADD CONSTRAINT "FK_Practitioner_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 26035)
-- Name: Practitioner FK_Practitioner_ReasonForPractitionerLeaving_ReasonForPractitio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Practitioner"
    ADD CONSTRAINT "FK_Practitioner_ReasonForPractitionerLeaving_ReasonForPractitio" FOREIGN KEY ("ReasonForPractitionerLeavingId") REFERENCES public."ReasonForPractitionerLeaving"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5074 (class 2606 OID 26040)
-- Name: Practitioner FK_Practitioner_SiteAddress_SiteAddressId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Practitioner"
    ADD CONSTRAINT "FK_Practitioner_SiteAddress_SiteAddressId" FOREIGN KEY ("SiteAddressId") REFERENCES public."SiteAddress"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5081 (class 2606 OID 26045)
-- Name: ProgrammeDay FK_ProgrammeDay_Programme_ProgrammeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ProgrammeDay"
    ADD CONSTRAINT "FK_ProgrammeDay_Programme_ProgrammeId" FOREIGN KEY ("ProgrammeId") REFERENCES public."Programme"("Id") ON DELETE CASCADE;


--
-- TOC entry 5079 (class 2606 OID 26050)
-- Name: Programme FK_Programme_ClassroomGroup_ClassroomGroupId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Programme"
    ADD CONSTRAINT "FK_Programme_ClassroomGroup_ClassroomGroupId" FOREIGN KEY ("ClassroomGroupId") REFERENCES public."ClassroomGroup"("Id");


--
-- TOC entry 5080 (class 2606 OID 26055)
-- Name: Programme FK_Programme_Classroom_ClassroomId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Programme"
    ADD CONSTRAINT "FK_Programme_Classroom_ClassroomId" FOREIGN KEY ("ClassroomId") REFERENCES public."Classroom"("Id") ON DELETE CASCADE;


--
-- TOC entry 5082 (class 2606 OID 26060)
-- Name: RolePermission FK_RolePermission_AspNetRoles_RoleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "FK_RolePermission_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES public."AspNetRoles"("Id") ON DELETE CASCADE;


--
-- TOC entry 5083 (class 2606 OID 26065)
-- Name: RolePermission FK_RolePermission_Permission_PermissionId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "FK_RolePermission_Permission_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES public."Permission"("Id") ON DELETE CASCADE;


--
-- TOC entry 5084 (class 2606 OID 26070)
-- Name: ShortUrl FK_ShortUrl_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ShortUrl"
    ADD CONSTRAINT "FK_ShortUrl_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5085 (class 2606 OID 26075)
-- Name: SiteAddress FK_SiteAddress_Province_ProvinceId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SiteAddress"
    ADD CONSTRAINT "FK_SiteAddress_Province_ProvinceId" FOREIGN KEY ("ProvinceId") REFERENCES public."Province"("Id") ON DELETE CASCADE;


--
-- TOC entry 5086 (class 2606 OID 361077)
-- Name: StatementsExpenses FK_StatementsExpenses_StatementsIncomeStatementId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsExpenses"
    ADD CONSTRAINT "FK_StatementsExpenses_StatementsIncomeStatementId" FOREIGN KEY ("StatementsIncomeStatementId") REFERENCES public."StatementsIncomeStatement"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5089 (class 2606 OID 26080)
-- Name: StatementsIncomeStatement FK_StatementsIncomeStatement_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncomeStatement"
    ADD CONSTRAINT "FK_StatementsIncomeStatement_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5087 (class 2606 OID 26085)
-- Name: StatementsIncome FK_StatementsIncome_AspNetUsers_ChildUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncome"
    ADD CONSTRAINT "FK_StatementsIncome_AspNetUsers_ChildUserId" FOREIGN KEY ("ChildUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5088 (class 2606 OID 361083)
-- Name: StatementsIncome FK_StatementsIncome_StatementsIncomeStatementId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsIncome"
    ADD CONSTRAINT "FK_StatementsIncome_StatementsIncomeStatementId" FOREIGN KEY ("StatementsIncomeStatementId") REFERENCES public."StatementsIncomeStatement"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5090 (class 2606 OID 26090)
-- Name: StatementsStartupSupport FK_StatementsStartupSupport_AspNetUsers_ChildUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsStartupSupport"
    ADD CONSTRAINT "FK_StatementsStartupSupport_AspNetUsers_ChildUserId" FOREIGN KEY ("ChildUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5091 (class 2606 OID 26095)
-- Name: StatementsStartupSupport FK_StatementsStartupSupport_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."StatementsStartupSupport"
    ADD CONSTRAINT "FK_StatementsStartupSupport_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5092 (class 2606 OID 26100)
-- Name: TenantHasModule FK_TenantHasModule_Module_ModuleId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TenantHasModule"
    ADD CONSTRAINT "FK_TenantHasModule_Module_ModuleId" FOREIGN KEY ("ModuleId") REFERENCES public."Module"("Id") ON DELETE CASCADE;


--
-- TOC entry 5121 (class 2606 OID 361105)
-- Name: UserCertificate FK_UserCertificate_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCertificate"
    ADD CONSTRAINT "FK_UserCertificate_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5122 (class 2606 OID 361110)
-- Name: UserCertificate FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCertificate"
    ADD CONSTRAINT "FK_UserCertificate_UserTrainingCourse_UserTrainingCourseId" FOREIGN KEY ("UserTrainingCourseId") REFERENCES public."UserTrainingCourse"("Id") ON DELETE SET NULL;


--
-- TOC entry 5123 (class 2606 OID 361115)
-- Name: UserCertificate FK_UserCertificate_Visit_VisitId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserCertificate"
    ADD CONSTRAINT "FK_UserCertificate_Visit_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id") ON DELETE SET NULL;


--
-- TOC entry 5093 (class 2606 OID 26105)
-- Name: UserConsent FK_UserConsent_AspNetUsers_CreatedUserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserConsent"
    ADD CONSTRAINT "FK_UserConsent_AspNetUsers_CreatedUserId" FOREIGN KEY ("CreatedUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5094 (class 2606 OID 26110)
-- Name: UserConsent FK_UserConsent_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserConsent"
    ADD CONSTRAINT "FK_UserConsent_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5120 (class 2606 OID 360911)
-- Name: UserFlag FK_UserFlag_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserFlag"
    ADD CONSTRAINT "FK_UserFlag_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5095 (class 2606 OID 26115)
-- Name: UserGrants FK_UserGrants_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGrants"
    ADD CONSTRAINT "FK_UserGrants_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5096 (class 2606 OID 26120)
-- Name: UserGrants FK_UserGrants_Grant_GrantId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserGrants"
    ADD CONSTRAINT "FK_UserGrants_Grant_GrantId" FOREIGN KEY ("GrantId") REFERENCES public."Grant"("Id") ON DELETE CASCADE;


--
-- TOC entry 5097 (class 2606 OID 26125)
-- Name: UserHelp FK_UserHelp_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserHelp"
    ADD CONSTRAINT "FK_UserHelp_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5098 (class 2606 OID 26130)
-- Name: UserHierarchy FK_UserHierarchy_AspNetUsers_ParentId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserHierarchy"
    ADD CONSTRAINT "FK_UserHierarchy_AspNetUsers_ParentId" FOREIGN KEY ("ParentId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5099 (class 2606 OID 26135)
-- Name: UserHierarchy FK_UserHierarchy_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserHierarchy"
    ADD CONSTRAINT "FK_UserHierarchy_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5100 (class 2606 OID 26140)
-- Name: UserLanguages FK_UserLanguages_LanguageId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLanguages"
    ADD CONSTRAINT "FK_UserLanguages_LanguageId" FOREIGN KEY ("LanguageId") REFERENCES public."Language"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5101 (class 2606 OID 26145)
-- Name: UserLanguages FK_UserLanguages_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserLanguages"
    ADD CONSTRAINT "FK_UserLanguages_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5102 (class 2606 OID 26150)
-- Name: UserPermission FK_UserPermission_PermissionId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "FK_UserPermission_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES public."Permission"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5103 (class 2606 OID 26155)
-- Name: UserPermission FK_UserPermission_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "FK_UserPermission_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5104 (class 2606 OID 26160)
-- Name: UserResourceLikes FK_UserResourceLikes_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserResourceLikes"
    ADD CONSTRAINT "FK_UserResourceLikes_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5119 (class 2606 OID 268646)
-- Name: UserResourceProblemReport FK_UserResourceProblemReport_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserResourceProblemReport"
    ADD CONSTRAINT "FK_UserResourceProblemReport_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;


--
-- TOC entry 5105 (class 2606 OID 26165)
-- Name: UserTrainingCourse FK_UserTrainingCourse_AspNetUsers_UserId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserTrainingCourse"
    ADD CONSTRAINT "FK_UserTrainingCourse_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;


--
-- TOC entry 5111 (class 2606 OID 361135)
-- Name: VisitDataStatus FK_VisitDataStatus_VisitData_VisitDataId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitDataStatus"
    ADD CONSTRAINT "FK_VisitDataStatus_VisitData_VisitDataId" FOREIGN KEY ("VisitDataId") REFERENCES public."VisitData"("Id") ON DELETE CASCADE;


--
-- TOC entry 5110 (class 2606 OID 26170)
-- Name: VisitData FK_VisitData_VisitId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitData"
    ADD CONSTRAINT "FK_VisitData_VisitId" FOREIGN KEY ("VisitId") REFERENCES public."Visit"("Id");


--
-- TOC entry 5112 (class 2606 OID 26175)
-- Name: VisitDataStatus FK_VisitReferral_VisitDataId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."VisitDataStatus"
    ADD CONSTRAINT "FK_VisitReferral_VisitDataId" FOREIGN KEY ("VisitDataId") REFERENCES public."VisitData"("Id");


--
-- TOC entry 5106 (class 2606 OID 361127)
-- Name: Visit FK_Visit_CalendarEvent_EventId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "FK_Visit_CalendarEvent_EventId" FOREIGN KEY ("EventId") REFERENCES public."CalendarEvent"("Id") ON DELETE SET NULL;


--
-- TOC entry 5107 (class 2606 OID 26180)
-- Name: Visit FK_Visit_CoachId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "FK_Visit_CoachId" FOREIGN KEY ("CoachId") REFERENCES public."Coach"("Id");


--
-- TOC entry 5108 (class 2606 OID 26185)
-- Name: Visit FK_Visit_Practitioner_PractitionerId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "FK_Visit_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");


--
-- TOC entry 5109 (class 2606 OID 26190)
-- Name: Visit FK_Visit_VisitType_VisitTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visit"
    ADD CONSTRAINT "FK_Visit_VisitType_VisitTypeId" FOREIGN KEY ("VisitTypeId") REFERENCES public."VisitType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5113 (class 2606 OID 26195)
-- Name: WorkflowStatus FK_WorkflowStatus_WorkflowStatusType_WorkflowStatusTypeId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."WorkflowStatus"
    ADD CONSTRAINT "FK_WorkflowStatus_WorkflowStatusType_WorkflowStatusTypeId" FOREIGN KEY ("WorkflowStatusTypeId") REFERENCES public."WorkflowStatusType"("Id") ON DELETE CASCADE;


--
-- TOC entry 5071 (class 2606 OID 26200)
-- Name: PointsUserSummary PK_PointsUserSummary_PointsLibraryId; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "PK_PointsUserSummary_PointsLibraryId" FOREIGN KEY ("PointsLibraryId") REFERENCES public."PointsLibrary"("Id") ON DELETE RESTRICT;


-- Completed on 2026-11-13 14:08:34

--
-- PostgreSQL database dump complete
--

\unrestrict 8m0Jo70VixXDMfS3f0SUQfLkXOnb6ZrJnsccdNKHQ4Pfgcza3VqrWr7sTE85VG2

