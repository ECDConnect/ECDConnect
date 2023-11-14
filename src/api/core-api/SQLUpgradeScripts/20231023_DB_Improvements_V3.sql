--SQL in order to change for DB optimisation
--1
-- ALTER TABLE public."AspNetUsers" ADD "UserId" uuid GENERATED ALWAYS AS ("Id"::UUID) STORED;

ALTER TABLE public."AspNetUsers" ADD "UserId" uuid;
update "AspNetUsers" set "UserId" = uuid("Id");
ALTER TABLE public."AspNetUsers" alter column "UserId" set not null;





-- Drop FKs
--ALTER TABLE public."AspNetRoleClaims" DROP CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId";
--ALTER TABLE public."AspNetUserClaims" DROP CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId";
--ALTER TABLE public."AspNetUserLogins" DROP CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId";
--ALTER TABLE public."AspNetUserRoles" DROP CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId";
--ALTER TABLE public."AspNetUserTokens" DROP CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId";
ALTER TABLE public."Attendance" DROP CONSTRAINT "FK_Attendance_AspNetUsers_UserId";
ALTER TABLE public."AuditLog" DROP CONSTRAINT "FK_AuditLog_AspNetUsers_UserId";
ALTER TABLE public."CalendarEvent" DROP CONSTRAINT "FK_CalendarEvent_AspNetUsers_UserId";
ALTER TABLE public."CalendarEventParticipant" DROP CONSTRAINT "FK_CalendarEventParticipant_AspNetUsers_UserId";
ALTER TABLE public."Child" DROP CONSTRAINT "FK_Child_AspNetUsers_UserId";
ALTER TABLE public."ChildProgressReport" DROP CONSTRAINT "FK_Child_AspNetUsers_UserId";
ALTER TABLE public."Classroom" DROP CONSTRAINT "FK_Classroom_AspNetUsers_UserId";
ALTER TABLE public."Club" DROP CONSTRAINT "FK_Club_AspNetUsers_UserId";
ALTER TABLE public."ClubPoints" DROP CONSTRAINT "PK_ClubPoints_UserId";
ALTER TABLE public."Coach" DROP CONSTRAINT "FK_Coach_AspNetUsers_UserId";
ALTER TABLE public."Document" DROP CONSTRAINT "FK_Document_AspNetUsers_UserId";
ALTER TABLE public."Franchisor" DROP CONSTRAINT "FK_Franchisor_AspNetUsers_UserId";
ALTER TABLE public."JobNotification" DROP CONSTRAINT "FK_JobNotification_AspNetUsers_UserId";
ALTER TABLE public."Learner" DROP CONSTRAINT "FK_Learner_AspNetUsers_UserId";
ALTER TABLE public."License" DROP CONSTRAINT "FK_License_AspNetUsers_UserId";
ALTER TABLE public."Note" DROP CONSTRAINT "FK_Note_AspNetUsers_UserId";
ALTER TABLE public."PointsUserSummary" DROP CONSTRAINT "PK_PointsUserSummary_UserId";
ALTER TABLE public."PointsUser" DROP CONSTRAINT "PK_PointsUser_UserId";
ALTER TABLE public."Practitioner" DROP CONSTRAINT "FK_Practitioner_AspNetUsers_UserId";
ALTER TABLE public."PractitionerRemovalHistory" DROP CONSTRAINT "FK_PractitionerRemovalHistory_RemovedByUserId";
ALTER TABLE public."PractitionerRemovalHistory" DROP CONSTRAINT "FK_PractitionerRemovalHistory_UserId";
ALTER TABLE public."TeamLead" DROP CONSTRAINT "TeamLead_User_FK";
ALTER TABLE public."Trainee" DROP CONSTRAINT "FK_Trainee_AspNetUsers_UserId";
ALTER TABLE public."UserHierarchy" DROP CONSTRAINT "FK_UserHierarchy_AspNetUsers_UserId";

-- drop PK
ALTER TABLE public."AspNetUsers" DROP CONSTRAINT "PK_AspNetUsers";

--Rebuild PK
ALTER TABLE public."AspNetUsers" ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("UserId");
alter table public."AspNetUsers" add constraint "UC_AspNetUsers_Id" unique ("Id");

-- Rebuild FKs
--ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "UserId" TYPE text USING "UserId"::text::text;
--ALTER TABLE ONLY public."AspNetUserClaims"
--    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;

--ALTER TABLE public."AspNetUserLogins" ALTER COLUMN "UserId" TYPE text USING "UserId"::text::text;
--ALTER TABLE ONLY public."AspNetUserLogins"
--    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;

--ALTER TABLE public."AspNetUserRoles" ALTER COLUMN "UserId" TYPE text USING "UserId"::text::text;
--ALTER TABLE ONLY public."AspNetUserRoles"
--    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;

--ALTER TABLE public."AspNetUserTokens" ALTER COLUMN "UserId" TYPE text USING "UserId"::text::text;
--ALTER TABLE ONLY public."AspNetUserTokens"
--    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE CASCADE;
	
ALTER TABLE public."Attendance" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "FK_Attendance_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;
	
ALTER TABLE public."AuditLog" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "FK_AuditLog_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	   
ALTER TABLE public."CalendarEventParticipant" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."CalendarEventParticipant"
    ADD CONSTRAINT "FK_CalendarEventParticipant_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."CalendarEvent" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."CalendarEvent"
    ADD CONSTRAINT "FK_CalendarEvent_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Child" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "FK_Child_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."ChildProgressReport" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."ChildProgressReport"
    ADD CONSTRAINT "FK_ChildProgressReport_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Classroom" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."Classroom"
    ADD CONSTRAINT "FK_Classroom_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."Coach" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Coach"
    ADD CONSTRAINT "FK_Coach_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Document" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "FK_Document_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."Franchisor" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Franchisor"
    ADD CONSTRAINT "FK_Franchisor_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."JobNotification" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."JobNotification"
    ADD CONSTRAINT "FK_JobNotification_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."License" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."License"
    ADD CONSTRAINT "FK_License_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;

ALTER TABLE public."Note" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "FK_Note_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."PractitionerRemovalHistory" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE public."PractitionerRemovalHistory" ALTER COLUMN "RemovedByUserId" TYPE uuid USING "RemovedByUserId"::uuid::uuid; 
ALTER TABLE ONLY public."PractitionerRemovalHistory"
    ADD CONSTRAINT "FK_PractitionerRemovalHistory_RemovedByUserId" FOREIGN KEY ("RemovedByUserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Practitioner" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Practitioner"
    ADD CONSTRAINT "FK_Practitioner_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Trainee" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."Trainee"
    ADD CONSTRAINT "FK_Trainee_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."UserHierarchy" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."UserHierarchy"
    ADD CONSTRAINT "FK_UserHierarchy_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."ClubPoints" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."ClubPoints"
    ADD CONSTRAINT "FK_ClubPoints_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."PointsUserSummary" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "FK_PointsUserSummary_AspNetUsers2_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."PointsUser" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."PointsUser"
    ADD CONSTRAINT "FK_PointsUser_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."TeamLead" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."TeamLead"
    ADD CONSTRAINT "FK_TeamLead_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId")  ON DELETE RESTRICT;
   
   
  
   
--New changes GUIDs remember to setup FKs
ALTER TABLE public."ClassReassignmentHistory" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
delete from public."ClassReassignmentHistory" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "FK_ClassReassignmentHistory_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId")  ON DELETE RESTRICT;

ALTER TABLE public."Absentees" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
delete from public."Absentees" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "FK_Absentees_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId")  ON DELETE RESTRICT;

ALTER TABLE public."Infant" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."Infant"
    ADD CONSTRAINT "FK_Infant_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId")  ON DELETE RESTRICT;

--this table is no longer used
drop table public."ServiceScheduler";



   
-- Build New FKs taht never existed before
   
-- some of these ids are problematic and has to be removed  - old data - so check if there are records, and set them to null userid rather which is valid
select * from public."ClassroomGroup" where "UserId" not in (select "UserId" from "AspNetUsers");
update "ClassroomGroup" set "UserId" = null where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."ClassroomGroup"
ADD CONSTRAINT "FK_ClassroomGroup_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."HealthCareWorker" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."HealthCareWorker"
    ADD CONSTRAINT "FK_HealthCareWorker_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId");
   

ALTER TABLE public."Club" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT "FK_Club_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;
   
ALTER TABLE public."UserGrants" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
  select * from "UserGrants" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
 --delete usergrants that do not exist in userstable anymore - OLD DATA
delete from "UserGrants" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
ALTER TABLE ONLY public."UserGrants"
ADD CONSTRAINT "FK_UserGrants_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."UserConsent" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
  select * from "UserConsent" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
 --delete usergrants that do not exist in userstable anymore - OLD DATA
delete from "UserConsent" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
ALTER TABLE ONLY public."UserConsent"
ADD CONSTRAINT "FK_UserConsent_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."License" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
  select * from "License" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
 --delete usergrants that do not exist in userstable anymore - OLD DATA
delete from "License" ug where "UserId" not in (select "UserId" from "AspNetUsers" anu);
ALTER TABLE ONLY public."License"
ADD CONSTRAINT "FK_License_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

 
 
ALTER TABLE public."IntegrationAudit" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
select * from public."IntegrationAudit" where "UserId" not in (select "UserId" from "AspNetUsers");
delete from public."IntegrationAudit" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."IntegrationAudit"
ADD CONSTRAINT "FK_IntegrationAudit_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."IntegrationEntityMapping" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
select * from public."IntegrationEntityMapping" where "UserId" not in (select "UserId" from "AspNetUsers");
delete from public."IntegrationEntityMapping" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."IntegrationEntityMapping"
ADD CONSTRAINT "FK_IntegrationEntityMapping_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
   
ALTER TABLE public."SystemLog" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
 
 
ALTER TABLE public."Learner" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
ALTER TABLE ONLY public."Learner"
ADD CONSTRAINT "FK_Learner_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

alter table "IntegrationLog" alter column "UserId" type uuid using "UserId"::uuid::uuid;
delete from "IntegrationLog" where "UserId" not in (select "UserId" from "AspNetUsers");
alter table only "IntegrationLog"
	add constraint "FK_IntegrationLog_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("UserId");   

alter table "StatementsExpenses" alter column "UserId" type uuid using "UserId"::uuid::uuid;
delete from "StatementsExpenses" where "UserId" not in (select "UserId" from "AspNetUsers");
alter table only "StatementsExpenses"
	add constraint "FK_StatementsExpenses_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("UserId");   

alter table "StatementsIncome" alter column "UserId" type uuid using "UserId"::uuid::uuid;
delete from "StatementsIncome" where "UserId" not in (select "UserId" from "AspNetUsers");
alter table only "StatementsIncome"
	add constraint "FK_StatementsIncome_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("UserId");   

alter table "StatementsIncome" alter column "ChildUserId" type uuid using "ChildUserId"::uuid::uuid;
delete from "StatementsIncome" where "ChildUserId" not in (select "UserId" from "AspNetUsers");
alter table only "StatementsIncome"
	add constraint "FK_StatementsIncome_AspNetUsers_ChildUserId" foreign key ("ChildUserId") references "AspNetUsers"("UserId");   

alter table "StatementsIncomeStatement" alter column "UserId" type uuid using "UserId"::uuid::uuid;
delete from "StatementsIncomeStatement" where "UserId" not in (select "UserId" from "AspNetUsers");
alter table only "StatementsIncomeStatement"
	add constraint "FK_StatementsIncomeStatement_AspNetUsers_UserId" foreign key ("UserId") references "AspNetUsers"("UserId");   

ALTER TABLE public."StatementsStartupSupport" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
delete from public."StatementsStartupSupport" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."StatementsStartupSupport"
	ADD CONSTRAINT "FK_StatementsStartupSupport_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId");   


-- Get rid of some tables and columns
--Columns  
ALTER TABLE ONLY public."Trainee" drop column "PractitionerId";
   
--on a case by case basis, need to find and fix the duplicate UserIds that will cause duplication issue
select "UserId", count("UserId")  from "Practitioner" p group by "UserId"  having count("UserId") > 1; 
select * from "Practitioner" p2 where "UserId" in (select "UserId"  from "Practitioner" p group by "UserId"  having count("UserId") > 1);
delete from "Practitioner" where "Id" = 'd56414b6-75aa-400f-b6a9-8d2c272a1a23';
select "UserId", count("UserId")  from "Trainee" p group by "UserId"  having count("UserId") > 1; 


ALTER TABLE public."Visit" DROP CONSTRAINT "FK_Visit_PractitionerId";
alter table public."ClubMember" drop constraint "FK_ClubMember_PractitionerId";
alter table public."ClubMeetingRegister" drop constraint "FK_ClubMeetingRegister_PractitionerId";
alter table public."ClubLeader" drop constraint "FK_ClubLeader_PractitionerId";
update "Visit" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubMember" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubMeetingRegister" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "ClubLeader" v set "PractitionerId" = (select "UserId" from "Practitioner" p where p."Id" = v."PractitionerId");
update "Practitioner" set "Id" = "UserId";
ALTER TABLE ONLY public."Visit"
ADD CONSTRAINT "FK_Visit_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
ALTER TABLE ONLY public."ClubMember"
ADD CONSTRAINT "FK_ClubMember_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
ALTER TABLE ONLY public."ClubMeetingRegister"
ADD CONSTRAINT "FK_ClubMeetingRegister_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   
ALTER TABLE ONLY public."ClubLeader"
ADD CONSTRAINT "FK_ClubLeader_PractitionerId" FOREIGN KEY ("PractitionerId") REFERENCES public."Practitioner"("Id");   


ALTER TABLE public."Visit" DROP CONSTRAINT "FK_Visit_TraineeId";
UPDATE "Visit" v set "TraineeId" = (select t."UserId" from "Trainee" t where t."Id" = v."TraineeId");
update "Trainee" set "Id" = "UserId";
ALTER TABLE ONLY public."Visit"
ADD CONSTRAINT "FK_Visit_TraineeId" FOREIGN KEY ("TraineeId") REFERENCES public."Trainee"("Id");   
