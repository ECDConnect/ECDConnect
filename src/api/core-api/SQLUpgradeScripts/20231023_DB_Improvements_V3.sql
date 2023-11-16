--SQL in order to change for DB optimisation

--this table is no longer used
drop table public."ServiceScheduler";

--general cleanup
alter table "TeamLead" drop constraint "TeamLead_Clinic_FK";
alter table "Clinic" drop constraint "Clinic_PK";
alter table "Clinic" add constraint "PK_Clinic" primary key ("Id");
alter table "TeamLead" add constraint "FK_TeamLead_Clinic_ClinicId" foreign key ("ClinicId") references "Clinic"("Id") on delete restrict;


-- Drop FKs
ALTER TABLE public."AspNetRoleClaims" DROP CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId";
ALTER TABLE public."AspNetUserClaims" DROP CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId";
ALTER TABLE public."AspNetUserLogins" DROP CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId";
ALTER TABLE public."AspNetUserRoles" DROP CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId";
ALTER TABLE public."AspNetUserRoles" DROP CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId";
ALTER TABLE public."AspNetUserTokens" DROP CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId";
ALTER TABLE public."RolePermission" DROP CONSTRAINT "FK_RolePermission_AspNetRoles_RoleId";

-- Run this query to get the drop constraints for the next section
select concat('alter table "',tc.table_name,'" drop constraint "',tc.constraint_name,'";') 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public' and ccu.table_name = 'AspNetUsers';

-- results from previous query - START
alter table "PointsUserSummary" drop constraint "FK_PointsUserSummary_AspNetUsers2_UserId";
alter table "ClubPoints" drop constraint "FK_ClubPoints_AspNetUsers_UserId";
alter table "PointsUser" drop constraint "FK_PointsUser_AspNetUsers_UserId";
alter table "TeamLead" drop constraint "FK_TeamLead_AspNetUsers_UserId";
alter table "ClassReassignmentHistory" drop constraint "FK_ClassReassignmentHistory_AspNetUsers_UserId";
alter table "Absentees" drop constraint "FK_Absentees_AspNetUsers_UserId";
alter table "Infant" drop constraint "FK_Infant_AspNetUsers_UserId";
alter table "ClassroomGroup" drop constraint "FK_ClassroomGroup_AspNetUsers_UserId";
alter table "HealthCareWorker" drop constraint "FK_HealthCareWorker_AspNetUsers_UserId";
alter table "UserGrants" drop constraint "FK_UserGrants_AspNetUsers_UserId";
alter table "UserConsent" drop constraint "FK_UserConsent_AspNetUsers_UserId";
alter table "IntegrationAudit" drop constraint "FK_IntegrationAudit_AspNetUsers_UserId";
alter table "IntegrationEntityMapping" drop constraint "FK_IntegrationEntityMapping_AspNetUsers_UserId";
alter table "StatementsStartupSupport" drop constraint "FK_StatementsStartupSupport_AspNetUsers_UserId";
alter table "StatementsExpenses" drop constraint "FK_StatementsExpenses_AspNetUsers_UserId";
alter table "StatementsIncome" drop constraint "FK_StatementsIncome_AspNetUsers_UserId";
alter table "StatementsIncome" drop constraint "FK_StatementsIncome_AspNetUsers_ChildUserId";
alter table "StatementsIncomeStatement" drop constraint "FK_StatementsIncomeStatement_AspNetUsers_UserId";
alter table "IntegrationLog" drop constraint "FK_IntegrationLog_AspNetUsers_UserId";
alter table "ChildProgressReport" drop constraint "FK_ChildProgressReport_AspNetUsers_UserId";
-- results from previous query - END

ALTER TABLE "AspNetRoles" drop constraint "PK_AspNetRoles";
ALTER TABLE "AspNetUsers" drop constraint "PK_AspNetUsers";

alter table "AspNetRoleClaims" alter column "RoleId" type uuid using "RoleId"::uuid::uuid;
alter table "AspNetRoles" alter column "Id" type uuid using "Id"::uuid::uuid;
alter table "AspNetUserClaims" alter column "UserId" type uuid using "UserId"::uuid::uuid;
alter table "AspNetUserLogins" alter column "UserId" type uuid using "UserId"::uuid::uuid;
alter table "AspNetUserRoles" alter column "UserId" type uuid using "UserId"::uuid::uuid;
alter table "AspNetUserRoles" alter column "RoleId" type uuid using "RoleId"::uuid::uuid;
alter table "AspNetUserTokens" alter column "UserId" type uuid using "UserId"::uuid::uuid;
alter table "AspNetUsers" alter column "Id" type uuid using "Id"::uuid::uuid;
alter table "RolePermission" alter column "RoleId" type uuid using "RoleId"::uuid::uuid;

--Rebuild AspNet keys and constraints
alter table "AspNetUsers" add constraint "PK_AspNetUsers" primary key ("Id");
alter table "AspNetRoles" add constraint "PK_AspNetRoles" primary key ("Id");


--Rebuild AspNet constraints
alter table "AspNetRoleClaims" add constraint "FK_AspNetRoleClaims_AspNetRoles_RoleId" foreign key ("RoleId") references "AspNetRoles"("Id") on delete cascade;
alter table "AspNetUserClaims" add constraint "FK_AspNetUserClaims_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade;
alter table "AspNetUserLogins" add constraint "FK_AspNetUserLogins_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade;
alter table "AspNetUserRoles"  add constraint "FK_AspNetUserRoles_AspNetUsers_UserId"  foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade;
alter table "AspNetUserRoles"  add constraint "FK_AspNetUserRoles_AspNetRoles_RoleId"  foreign key ("RoleId") references "AspNetRoles"("Id") on delete cascade;
alter table "AspNetUserTokens" add constraint "FK_AspNetUserTokens_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade;
alter table "RolePermission"   add constraint "FK_RolePermission_AspNetRoles_RoleId"   foreign key ("RoleId") references "AspNetRoles"("Id") on delete cascade;


-- change to uuid and rebuild FK
update "ClassroomGroup" set "UserId" = null where "UserId" not in (select "Id" from "AspNetUsers");
alter table "Trainee" drop column "PractitionerId";

-- run script for next section
select --c.table_name, c.column_name, c.data_type, 
	concat('alter table "',c.table_name,'" alter column "',c.column_name,'" type uuid using "',c.column_name,'"::uuid::uuid; ', chr(10),
	'delete from "',c.table_name,'" where "',c.column_name,'" is not null and "',c.column_name,'" not in (select "Id" from "AspNetUsers"); ', chr(10),
	'alter table "',c.table_name,'" add constraint "FK_',c.table_name,'_AspNetUsers_',c.column_name,'" foreign key ("',c.column_name,'") references "AspNetUsers"("Id") on delete cascade; ', chr(10))
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and c.data_type = 'text' and c.column_name like '%UserId' and c.table_name not like 'AspNet%'
order by c.table_name, c.column_name;

-- START
alter table "Absentees" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Absentees" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Absentees" add constraint "FK_Absentees_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Attendance" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Attendance" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Attendance" add constraint "FK_Attendance_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "AuditLog" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "AuditLog" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "AuditLog" add constraint "FK_AuditLog_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "CalendarEvent" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "CalendarEvent" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "CalendarEvent" add constraint "FK_CalendarEvent_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "CalendarEventParticipant" alter column "ParticipantUserId" type uuid using "ParticipantUserId"::uuid::uuid; 
delete from "CalendarEventParticipant" where "ParticipantUserId" is not null and "ParticipantUserId" not in (select "Id" from "AspNetUsers"); 
alter table "CalendarEventParticipant" add constraint "FK_CalendarEventParticipant_AspNetUsers_ParticipantUserId" foreign key ("ParticipantUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "CalendarEventParticipant" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "CalendarEventParticipant" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "CalendarEventParticipant" add constraint "FK_CalendarEventParticipant_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Child" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Child" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Child" add constraint "FK_Child_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ChildProgressReport" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "ChildProgressReport" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "ChildProgressReport" add constraint "FK_ChildProgressReport_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ClassReassignmentHistory" alter column "ReassignedBackToUserId" type uuid using "ReassignedBackToUserId"::uuid::uuid; 
delete from "ClassReassignmentHistory" where "ReassignedBackToUserId" is not null and "ReassignedBackToUserId" not in (select "Id" from "AspNetUsers"); 
alter table "ClassReassignmentHistory" add constraint "FK_ClassReassignmentHistory_AspNetUsers_ReassignedBackToUserId" foreign key ("ReassignedBackToUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ClassReassignmentHistory" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "ClassReassignmentHistory" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "ClassReassignmentHistory" add constraint "FK_ClassReassignmentHistory_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Classroom" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Classroom" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Classroom" add constraint "FK_Classroom_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ClassroomGroup" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "ClassroomGroup" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "ClassroomGroup" add constraint "FK_ClassroomGroup_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Club" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Club" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Club" add constraint "FK_Club_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ClubPoints" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "ClubPoints" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "ClubPoints" add constraint "FK_ClubPoints_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Coach" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Coach" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Coach" add constraint "FK_Coach_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Document" alter column "CreatedUserId" type uuid using "CreatedUserId"::uuid::uuid; 
delete from "Document" where "CreatedUserId" is not null and "CreatedUserId" not in (select "Id" from "AspNetUsers"); 
alter table "Document" add constraint "FK_Document_AspNetUsers_CreatedUserId" foreign key ("CreatedUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Document" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Document" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Document" add constraint "FK_Document_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Franchisor" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Franchisor" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Franchisor" add constraint "FK_Franchisor_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "HealthCareWorker" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "HealthCareWorker" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "HealthCareWorker" add constraint "FK_HealthCareWorker_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Infant" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Infant" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Infant" add constraint "FK_Infant_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "IntegrationAudit" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "IntegrationAudit" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "IntegrationAudit" add constraint "FK_IntegrationAudit_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "IntegrationEntityMapping" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "IntegrationEntityMapping" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "IntegrationEntityMapping" add constraint "FK_IntegrationEntityMapping_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "IntegrationLog" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "IntegrationLog" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "IntegrationLog" add constraint "FK_IntegrationLog_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "JobNotification" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "JobNotification" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "JobNotification" add constraint "FK_JobNotification_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "JWTUserTokens" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "JWTUserTokens" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "JWTUserTokens" add constraint "FK_JWTUserTokens_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Learner" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Learner" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Learner" add constraint "FK_Learner_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "License" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "License" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "License" add constraint "FK_License_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "MessageLog" alter column "FromUserId" type uuid using "FromUserId"::uuid::uuid; 
delete from "MessageLog" where "FromUserId" is not null and "FromUserId" not in (select "Id" from "AspNetUsers"); 
alter table "MessageLog" add constraint "FK_MessageLog_AspNetUsers_FromUserId" foreign key ("FromUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "MessageLog" alter column "SentByUserId" type uuid using "SentByUserId"::uuid::uuid; 
delete from "MessageLog" where "SentByUserId" is not null and "SentByUserId" not in (select "Id" from "AspNetUsers"); 
alter table "MessageLog" add constraint "FK_MessageLog_AspNetUsers_SentByUserId" foreign key ("SentByUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Mother" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Mother" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Mother" add constraint "FK_Mother_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Note" alter column "CreatedUserId" type uuid using "CreatedUserId"::uuid::uuid; 
delete from "Note" where "CreatedUserId" is not null and "CreatedUserId" not in (select "Id" from "AspNetUsers"); 
alter table "Note" add constraint "FK_Note_AspNetUsers_CreatedUserId" foreign key ("CreatedUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Note" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Note" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Note" add constraint "FK_Note_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "PointsUser" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "PointsUser" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "PointsUser" add constraint "FK_PointsUser_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "PointsUserSummary" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "PointsUserSummary" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "PointsUserSummary" add constraint "FK_PointsUserSummary_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Practitioner" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Practitioner" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Practitioner" add constraint "FK_Practitioner_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "PractitionerRemovalHistory" alter column "RemovedByUserId" type uuid using "RemovedByUserId"::uuid::uuid; 
delete from "PractitionerRemovalHistory" where "RemovedByUserId" is not null and "RemovedByUserId" not in (select "Id" from "AspNetUsers"); 
alter table "PractitionerRemovalHistory" add constraint "FK_PractitionerRemovalHistory_AspNetUsers_RemovedByUserId" foreign key ("RemovedByUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "PractitionerRemovalHistory" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "PractitionerRemovalHistory" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "PractitionerRemovalHistory" add constraint "FK_PractitionerRemovalHistory_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "ShortUrl" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "ShortUrl" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "ShortUrl" add constraint "FK_ShortUrl_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsExpenses" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "StatementsExpenses" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsExpenses" add constraint "FK_StatementsExpenses_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsIncome" alter column "ChildUserId" type uuid using "ChildUserId"::uuid::uuid; 
delete from "StatementsIncome" where "ChildUserId" is not null and "ChildUserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsIncome" add constraint "FK_StatementsIncome_AspNetUsers_ChildUserId" foreign key ("ChildUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsIncome" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "StatementsIncome" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsIncome" add constraint "FK_StatementsIncome_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsIncomeStatement" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "StatementsIncomeStatement" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsIncomeStatement" add constraint "FK_StatementsIncomeStatement_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsStartupSupport" alter column "ChildUserId" type uuid using "ChildUserId"::uuid::uuid; 
delete from "StatementsStartupSupport" where "ChildUserId" is not null and "ChildUserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsStartupSupport" add constraint "FK_StatementsStartupSupport_AspNetUsers_ChildUserId" foreign key ("ChildUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "StatementsStartupSupport" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "StatementsStartupSupport" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "StatementsStartupSupport" add constraint "FK_StatementsStartupSupport_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "TeamLead" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "TeamLead" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "TeamLead" add constraint "FK_TeamLead_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Trainee" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "Trainee" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "Trainee" add constraint "FK_Trainee_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "UserConsent" alter column "CreatedUserId" type uuid using "CreatedUserId"::uuid::uuid; 
delete from "UserConsent" where "CreatedUserId" is not null and "CreatedUserId" not in (select "Id" from "AspNetUsers"); 
alter table "UserConsent" add constraint "FK_UserConsent_AspNetUsers_CreatedUserId" foreign key ("CreatedUserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "UserConsent" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "UserConsent" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "UserConsent" add constraint "FK_UserConsent_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "UserGrants" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "UserGrants" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "UserGrants" add constraint "FK_UserGrants_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 

alter table "UserHierarchy" alter column "UserId" type uuid using "UserId"::uuid::uuid; 
delete from "UserHierarchy" where "UserId" is not null and "UserId" not in (select "Id" from "AspNetUsers"); 
alter table "UserHierarchy" add constraint "FK_UserHierarchy_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("Id") on delete cascade; 
-- END


-- manual fixups
alter table "ClassReassignmentHistory" alter column "LoggedBy" type uuid using "LoggedBy"::uuid::uuid; 
delete from "ClassReassignmentHistory" where "LoggedBy" is not null and "LoggedBy" not in (select "Id" from "AspNetUsers"); 
alter table "ClassReassignmentHistory" add constraint "FK_ClassReassignmentHistory_AspNetUsers_LoggedBy" foreign key ("LoggedBy") references "AspNetUsers"("Id") on delete cascade; 

alter table "ClassReassignmentHistory" alter column "ReassignedToUser" type uuid using "ReassignedToUser"::uuid::uuid; 
delete from "ClassReassignmentHistory" where "ReassignedToUser" is not null and "ReassignedToUser" not in (select "Id" from "AspNetUsers"); 
alter table "ClassReassignmentHistory" add constraint "FK_ClassReassignmentHistory_AspNetUsers_ReassignedToUser" foreign key ("ReassignedToUser") references "AspNetUsers"("Id") on delete cascade; 

alter table "UserHierarchy" alter column "ParentId" type uuid using "ParentId"::uuid::uuid; 
delete from "UserHierarchy" where "ParentId" is not null and "ParentId" not in (select "Id" from "AspNetUsers"); 
alter table "UserHierarchy" add constraint "FK_UserHierarchy_AspNetUsers_ParentId" foreign key ("ParentId") references "AspNetUsers"("Id") on delete cascade; 

alter table "Absentees" alter column "PractitionerId" type uuid using "PractitionerId"::uuid::uuid; 
delete from "Absentees" where "PractitionerId" is not null and "PractitionerId" not in (select "Id" from "Practitioner"); 
alter table "Absentees" add constraint "FK_Absentees_Practitioner_PractitionerId" foreign key ("PractitionerId") references "Practitioner"("Id") on delete cascade; 

alter table "SystemLog" alter column "UserId" type uuid using "UserId"::uuid::uuid;
 
--on a case by case basis, need to find and fix the duplicate UserIds that will cause duplication issue
select "UserId", count("UserId")  from "Practitioner" p group by "UserId"  having count("UserId") > 1; 
select * from "Practitioner" p2 where "UserId" in (select "UserId"  from "Practitioner" p group by "UserId"  having count("UserId") > 1);
delete from "Practitioner" where "Id" = 'd56414b6-75aa-400f-b6a9-8d2c272a1a23';
select "UserId", count("UserId")  from "Trainee" p group by "UserId"  having count("UserId") > 1; 


alter table "Visit" drop constraint "FK_Visit_PractitionerId";
alter table "ClubMember" drop constraint "FK_ClubMember_PractitionerId";
alter table "ClubMeetingRegister" drop constraint "FK_ClubMeetingRegister_PractitionerId";
alter table "ClubLeader" drop constraint "FK_ClubLeader_PractitionerId";
update "Visit" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubMember" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubMeetingRegister" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubLeader" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "Practitioner" set "Id" = "UserId";
alter table "Visit" ADD CONSTRAINT "FK_Visit_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
alter table "ClubMember" ADD CONSTRAINT "FK_ClubMember_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
alter table "ClubMeetingRegister" ADD CONSTRAINT "FK_ClubMeetingRegister_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
alter table "ClubLeader" ADD CONSTRAINT "FK_ClubLeader_Practitioner_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   


ALTER TABLE "Visit" DROP CONSTRAINT "FK_Visit_TraineeId";
UPDATE "Visit" v set "TraineeId" = (select t."UserId" from "Trainee" t where t."Id" = v."TraineeId");
update "Trainee" set "Id" = "UserId";
ALTER TABLE public."Visit" ADD CONSTRAINT "FK_Visit_Trainee_TraineeId" FOREIGN KEY ("TraineeId") REFERENCES public."Trainee"("Id");   






SELECT key_column_usage.constraint_schema, key_column_usage.constraint_name 
FROM information_schema.table_constraints 
JOIN information_schema.key_column_usage ON table_constraints.constraint_schema = key_column_usage.constraint_schema 
     AND table_constraints.constraint_name = key_column_usage.constraint_name 
JOIN information_schema.referential_constraints ON table_constraints.constraint_schema = referential_constraints.constraint_schema
     AND table_constraints.constraint_name = referential_constraints.constraint_name 
JOIN information_schema.table_constraints AS table_constraints1 ON referential_constraints.unique_constraint_schema = table_constraints1.constraint_schema 
     AND referential_constraints.unique_constraint_name = table_constraints1.constraint_name 
WHERE table_constraints.constraint_type = 'FOREIGN KEY' ORDER BY key_column_usage.constraint_name;

/*
SELECT
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema='public';
*/


select c.table_name, c.column_name, c.data_type 
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and c.data_type = 'text' and c.column_name like '%Id';

select *
from pg_catalog.pg_indexes i
where i.schemaname = 'public' and i.indexname not like 'PK%' and 
order by i.tablename 