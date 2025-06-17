/* 
 * GrowGreat
 */

ALTER TABLE "VisitDataStatus"
	DROP COLUMN IF EXISTS "ReferralDateCompleted",
	DROP COLUMN IF EXISTS "BackReferralCompleted",
	DROP COLUMN IF EXISTS "BackReferralDateCompleted",
	DROP COLUMN IF EXISTS "BackReferralAdminComment"
;
ALTER TABLE "Caregiver" 
	DROP COLUMN IF EXISTS "isMother",
	DROP COLUMN IF EXISTS "HealthCareWorkerId"
;
ALTER TABLE "Visit" 
	DROP COLUMN IF EXISTS "InfantId",
	DROP COLUMN IF EXISTS "MotherId"
;

DROP TABLE IF EXISTS "BreastFeedingClubClient";
DROP TABLE IF EXISTS "BreastFeedingClub";
DROP TABLE IF EXISTS "BreastFeedingClubBak";
DROP TABLE IF EXISTS "CareGiverGrant";
DROP TABLE IF EXISTS "EventRecord";
DROP TABLE IF EXISTS "EventRecordBak";
DROP TABLE IF EXISTS "EventRecordType";
DROP TABLE IF EXISTS "Infant";
DROP TABLE IF EXISTS "InfantBak";
DROP TABLE IF EXISTS "Mother";
DROP TABLE IF EXISTS "MotherBak";
DROP TABLE IF EXISTS "HealthCareWorker";
DROP TABLE IF EXISTS "HealthCareWorkerBak";
DROP TABLE IF EXISTS "ClinicLeague";
DROP TABLE IF EXISTS "ClinicMeetingParticipantInField";
DROP TABLE IF EXISTS "ClinicMeetingParticipantOptedOut";
DROP TABLE IF EXISTS "ClinicMeeting";
DROP TABLE IF EXISTS "ClinicTeamLead";
DROP TABLE IF EXISTS "ClinicTeamLeadBak";
DROP TABLE IF EXISTS "PointsClinicSummary";
DROP TABLE IF EXISTS "Clinic";
DROP TABLE IF EXISTS "ClubActivityUpload";
DROP TABLE IF EXISTS "ClubActivityUploadType";
DROP TABLE IF EXISTS "ClubLeader";
DROP TABLE IF EXISTS "ClubMeetingRegister";
DROP TABLE IF EXISTS "ClubMeeting";
DROP TABLE IF EXISTS "ClubMember";
DROP TABLE IF EXISTS "ClubPoints";
DROP TABLE IF EXISTS "ClubPointsLibrary";
DROP TABLE IF EXISTS "ClubSupport";
DROP TABLE IF EXISTS "Club";
DROP TABLE IF EXISTS "League";
DROP TABLE IF EXISTS "LeagueType";
DROP TABLE IF EXISTS "SubDistrict";
DROP TABLE IF EXISTS "District";
DROP TABLE IF EXISTS "TeamLead";
DROP TABLE IF EXISTS "TeamLeadBak";
DROP TABLE IF EXISTS "VisitBackReferral";
DROP TABLE IF EXISTS "VisitDataStatusReferralType";
DROP TABLE IF EXISTS "ReferralType";
DROP TABLE IF EXISTS "VisitGrowthData";
DROP TABLE IF EXISTS "VisitGrowthDataDay";
DROP TABLE IF EXISTS "VisitGrowthDataHeight";



/*
 * FundaApp / SmartStart
 */

ALTER TABLE "Coach" 
	DROP COLUMN IF EXISTS "FranchisorHierarchy",
	DROP COLUMN IF EXISTS "FranchisorId",
	DROP COLUMN IF EXISTS "ClickedClubTab"
;
ALTER TABLE "Practitioner" 
	DROP COLUMN IF EXISTS "MaxChildren",
	DROP COLUMN IF EXISTS "MonthSinceFranchisee",
	DROP COLUMN IF EXISTS "IsFundaAppAdmin",
	DROP COLUMN IF EXISTS "IsTrainee",
	DROP COLUMN IF EXISTS "IsClubOwner",
	DROP COLUMN IF EXISTS "AttendedChildProgress",
	DROP COLUMN IF EXISTS "AttendedBusinessSkills",
	DROP COLUMN IF EXISTS "StipendType",
	DROP COLUMN IF EXISTS "AttendedFirstAidCourse",
	DROP COLUMN IF EXISTS "IsOnStipend",
	DROP COLUMN IF EXISTS "SetupTraineeInitiated"
;


ALTER TABLE "Visit" 
	DROP COLUMN IF EXISTS "TraineeId",
	DROP COLUMN IF EXISTS "IntegrationSubmitDate"
;

DROP TABLE IF EXISTS "Franchisor";
DROP TABLE IF EXISTS "IntegrationAudit";
DROP TABLE IF EXISTS "IntegrationColumnMapping";
DROP TABLE IF EXISTS "IntegrationEntityMapping";
DROP TABLE IF EXISTS "IntegrationLog";
DROP TABLE IF EXISTS "License";
DROP TABLE IF EXISTS "LicenseType";
DROP TABLE IF EXISTS "SL_Ingestion_ChildCaregiver";
DROP TABLE IF EXISTS "SL_Ingestion_User";
DROP TABLE IF EXISTS "SL_Ingestion_User_Delete";
DROP TABLE IF EXISTS "SL_Ingestion_User_Update";
DROP TABLE IF EXISTS "Trainee";
DROP TABLE IF EXISTS "SmartSpaceVisit";

/*
 * OTHER
 */
DELETE FROM "__EFMigrationsHistory";

DROP TABLE IF EXISTS "club_id";
DROP TABLE IF EXISTS "content_id";
DROP TABLE IF EXISTS "CaregiverBak";
DROP TABLE IF EXISTS "DataProtectionKeys";
DROP TABLE IF EXISTS "ReasonForLeavingBackup";
DROP TABLE IF EXISTS "VisitBak";


-- SELECT * FROM information_schema.COLUMNS c WHERE c.column_name ilike '%License%';