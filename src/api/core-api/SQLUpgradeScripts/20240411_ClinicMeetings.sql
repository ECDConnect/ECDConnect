CREATE TABLE public."ClinicMeeting" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"ClinicId" uuid NULL,
	"MeetingDate" timestamp NULL,
	"TenantId" uuid NULL,
	"PositiveStory" text NULL,
	"ReportingIssue" text NULL,
	"TotalSupportVisits" int4 NOT NULL default 0,
	"MeetingTypeId" uuid NULL,
	"TeamLeadId" uuid NOT NULL,
	CONSTRAINT "PK_ClinicMeeting" PRIMARY KEY ("Id")
);

ALTER TABLE public."ClinicMeeting" ADD CONSTRAINT "FK_ClinicMeeting_ClinicId" FOREIGN KEY ("ClinicId") REFERENCES public."Clinic"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClinicMeeting" ADD CONSTRAINT "FK_ClinicMeeting_MeetingTypeId" FOREIGN KEY ("MeetingTypeId") REFERENCES public."MeetingType"("Id") ON DELETE CASCADE;
ALTER TABLE public."ClinicMeeting" ADD CONSTRAINT "FK_ClinicMeeting_TeamLeadId" FOREIGN KEY ("TeamLeadId") REFERENCES public."TeamLead"("Id") ON DELETE CASCADE;

CREATE TABLE public."ClinicMeetingParticipantOptedOut" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"ClinicMeetingId" uuid NULL,
	"TenantId" uuid NULL,
	"HealthCareWorkerId" uuid NOT NULL,
	CONSTRAINT "PK_ClinicMeetingParticipantOptedOut" PRIMARY KEY ("Id")
);

ALTER TABLE public."ClinicMeetingParticipantOptedOut" ADD CONSTRAINT "FK_ClinicMeetingParticipantOptedOut_ClinicMeetingId" FOREIGN KEY ("ClinicMeetingId") REFERENCES public."ClinicMeeting"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClinicMeetingParticipantOptedOut" ADD CONSTRAINT "FK_ClinicMeetingParticipantOptedOut_HealthCareWorkerId" FOREIGN KEY ("HealthCareWorkerId") REFERENCES public."HealthCareWorker"("Id") ON DELETE RESTRICT;

CREATE TABLE public."ClinicMeetingParticipantInField" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"ClinicMeetingId" uuid NULL,
	"TenantId" uuid NULL,
	"HealthCareWorkerId" uuid NOT NULL,
	CONSTRAINT "PK_ClinicMeetingParticipantInField" PRIMARY KEY ("Id")
);
ALTER TABLE public."ClinicMeetingParticipantInField" ADD CONSTRAINT "FK_ClinicMeetingParticipantInField_ClinicMeetingId" FOREIGN KEY ("ClinicMeetingId") REFERENCES public."ClinicMeeting"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClinicMeetingParticipantInField" ADD CONSTRAINT "FK_ClinicMeetingParticipantInField_HealthCareWorkerId" FOREIGN KEY ("HealthCareWorkerId") REFERENCES public."HealthCareWorker"("Id") ON DELETE RESTRICT;


INSERT INTO public."MeetingType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId")
VALUES('2497b684-2d62-46ea-af56-34b1746891be', 'team_lead_monthly_meeting', 'Team Lead Monthly Meeting', '', true, current_date, current_date, null, '39077d0e-e443-4076-aaf2-978dc6805aa0');
