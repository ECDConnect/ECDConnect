--SQL in order to change for DB optimisation
--1
ALTER TABLE public."AspNetUsers" ADD "UserId" uuid GENERATED ALWAYS AS ("Id"::UUID) STORED;

-- Drop FKs
ALTER TABLE public."FK_AspNetRoleClaims_AspNetRoles_RoleId" DROP CONSTRAINT "FK_AspNetRoleClaims_AspNetRoles_RoleId";
ALTER TABLE public."AspNetUserLogins" DROP CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId";
ALTER TABLE public."AspNetUserRoles" DROP CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId";
ALTER TABLE public."AspNetUserTokens" DROP CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId";
ALTER TABLE public."Attendance" DROP CONSTRAINT "FK_Attendance_AspNetUsers_UserId";
ALTER TABLE public."AuditLog" DROP CONSTRAINT "FK_AuditLog_AspNetUsers_UserId";
ALTER TABLE public."CalendarEvent" DROP CONSTRAINT "FK_CalendarEvent_AspNetUsers_UserId";
ALTER TABLE public."Child" DROP CONSTRAINT "FK_Child_AspNetUsers_UserId";
ALTER TABLE public."Classroom" DROP CONSTRAINT "FK_Classroom_AspNetUsers_UserId";
ALTER TABLE public."Club" DROP CONSTRAINT "FK_Club_AspNetUsers_UserId";
ALTER TABLE public."Coach" DROP CONSTRAINT "FK_Coach_AspNetUsers_UserId";
ALTER TABLE public."Document" DROP CONSTRAINT "FK_Document_AspNetUsers_UserId";
ALTER TABLE public."Franchisor" DROP CONSTRAINT "FK_Franchisor_AspNetUsers_UserId";
ALTER TABLE public."JobNotification" DROP CONSTRAINT "FK_JobNotification_AspNetUsers_UserId";
ALTER TABLE public."CalendarEventParticipant" DROP CONSTRAINT "FK_CalendarEventParticipant_Participant_AspNetUsers_UserId";
ALTER TABLE public."Learner" DROP CONSTRAINT "FK_Learner_AspNetUsers_UserId";
ALTER TABLE public."License" DROP CONSTRAINT "FK_License_AspNetUsers_UserId";
ALTER TABLE public."Note" DROP CONSTRAINT "FK_Note_AspNetUsers_UserId";
ALTER TABLE public."PractitionerRemovalHistory" DROP CONSTRAINT "FK_PractitionerRemovalHistory_RemovedByUserId";
ALTER TABLE public."PractitionerRemovalHistory" DROP CONSTRAINT "FK_PractitionerRemovalHistory_UserId";
ALTER TABLE public."Trainee" DROP CONSTRAINT "FK_Trainee_AspNetUsers_UserId";
ALTER TABLE public."UserHierarchy" DROP CONSTRAINT "FK_UserHierarchy_AspNetUsers_UserId";
ALTER TABLE public."ClubPoints" DROP CONSTRAINT "PK_ClubPoints_UserId";
ALTER TABLE public."PointsUserSummary" DROP CONSTRAINT "PK_PointsUserSummary_UserId";
ALTER TABLE public."PointsUser" DROP CONSTRAINT "PK_PointsUser_UserId";
ALTER TABLE public."TeamLead" DROP CONSTRAINT "TeamLead_User_FK";

ALTER TABLE public."AspNetUserClaims" DROP CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId";

-- drop PK
ALTER TABLE public."AspNetUsers" DROP CONSTRAINT "PK_AspNetUsers";

--Rebuild PK
ALTER TABLE public."AspNetUsers" ADD CONSTRAINT "PK_AspNetUsers" PRIMARY KEY ("UserId");

-- Rebuild FKs
ALTER TABLE public."AspNetUserClaims" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."AspNetUserClaims"
    ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;

ALTER TABLE public."AspNetUserLogins" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."AspNetUserLogins"
    ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;

ALTER TABLE public."AspNetUserRoles" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."AspNetUserRoles"
    ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;

ALTER TABLE public."AspNetUserTokens" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."AspNetUserTokens"
    ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;
	
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
    ADD CONSTRAINT "PK_ClubPoints_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

ALTER TABLE public."PointsUserSummary" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."PointsUserSummary"
    ADD CONSTRAINT "PK_PointsUserSummary_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."PointsUser" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."PointsUser"
    ADD CONSTRAINT "PK_PointsUser_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
	
ALTER TABLE public."TeamLead" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."TeamLead"
    ADD CONSTRAINT "TeamLead_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId")  ON DELETE RESTRICT;
   
--New changes GUIDs remember to setup FKs
ALTER TABLE public."ClassReassignmentHistory" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;

ALTER TABLE public."Absentees" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;

ALTER TABLE public."Infant" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;

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
    ADD CONSTRAINT "HealthCareWorker_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId");
   

ALTER TABLE public."Club" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
ALTER TABLE ONLY public."Club"
    ADD CONSTRAINT "FK_Club_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE CASCADE;
   
ALTER TABLE public."UserGrants" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
  select * from "UserGrants" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
 --delete usergrants that do not exist in userstable anymore - OLD DATA
delete from "UserGrants" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
ALTER TABLE ONLY public."UserGrants"
ADD CONSTRAINT "FK_UserGrants_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."License" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
  select * from "License" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
 --delete usergrants that do not exist in userstable anymore - OLD DATA
delete from "License" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
ALTER TABLE ONLY public."License"
ADD CONSTRAINT "FK_License_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;

  select * from "ClassReassignmentHistory" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
 --delete "ClassReassignmentHistory" that do not exist in userstable anymore - OLD DATA
 --delete from public."ClassReassignmentHistory" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."ClassReassignmentHistory"
    ADD CONSTRAINT "PK_ClassReassignmentHistory_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
     select * from "Absentees" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
    delete from public."Absentees" where "UserId" not in (select "UserId" from "AspNetUsers");
   ALTER TABLE ONLY public."Absentees"
    ADD CONSTRAINT "PK_Absentees_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
        select * from "Infant" ug where "UserId" not in (select "Id"::UUID from "AspNetUsers" anu);
    delete from public."Infant" where "UserId" not in (select "UserId" from "AspNetUsers");
   ALTER TABLE ONLY public."Infant"
    ADD CONSTRAINT "PK_Infant_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
   
   
select * from public."IntegrationAudit" where "UserId" not in (select "UserId" from "AspNetUsers");
--delete from public."IntegrationAudit" where "UserId" not in (select "UserId" from "AspNetUsers");
--depending on whether its old or new data update or delete
--  update "IntegrationAudit" set "UserId" = null where "UserId" not in (select "UserId" from "AspNetUsers");
   ALTER TABLE public."IntegrationAudit" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."IntegrationAudit"
ADD CONSTRAINT "IntegrationAudit_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
select * from public."IntegrationEntityMapping" where "UserId" not in (select "UserId" from "AspNetUsers");
--delete from public."IntegrationEntityMapping" where "UserId" not in (select "UserId" from "AspNetUsers");
--depending on whether its old or new data update or delete
--  update "IntegrationEntityMapping" set "UserId" = null where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE public."IntegrationEntityMapping" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;   
ALTER TABLE ONLY public."IntegrationEntityMapping"
ADD CONSTRAINT "IntegrationEntityMapping_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
   
ALTER TABLE public."SystemLog" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid;
 
 
 ALTER TABLE public."Attendance" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
ALTER TABLE ONLY public."Attendance"
ADD CONSTRAINT "Attendance_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
ALTER TABLE public."Learner" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
ALTER TABLE ONLY public."Learner"
ADD CONSTRAINT "Learner_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId") ON DELETE RESTRICT;
   
   
ALTER TABLE public."StatementsStartupSupport" ALTER COLUMN "UserId" TYPE uuid USING "UserId"::uuid::uuid; 
 select * from public."StatementsStartupSupport" where "UserId" not in (select "UserId" from "AspNetUsers");
--delete from public."StatementsStartupSupport" where "UserId" not in (select "UserId" from "AspNetUsers");
ALTER TABLE ONLY public."StatementsStartupSupport"
ADD CONSTRAINT "StatementsStartupSupport_User_FK" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("UserId");   
-- Get rid of some tables and columns

   
   
--Columns  
ALTER TABLE ONLY public."Trainee" drop column "PractitionerId";
   
   

-- make Ids the same as UserIds

--on a case by case basis, need to find and fix the duplicate UserIds that will cause duplication issue
select "UserId", count("UserId")  from "Practitioner" p group by "UserId"  having count("UserId") > 1; 
select "UserId", count("UserId")  from "Trainee" p group by "UserId"  having count("UserId") > 1; 

--update visits PractitionerId to practitioners UsersId
update "Practitioner" set "Id" = "UserId";

--problem table st hat have table ids linked rather than userids
--Visits,
 
--TeamLead

update "Visit" v set "PractitionerId" = (select 'UserId' from "Practitioner" p where p."Id" = v."PractitionerId");

















SELECT version();


update "Practitioner" set "Id" = "UserId";
UPDATE "Visit" v set "TraineeId" = (select t."UserId"::UUID from "Trainee" t where t."Id" = v."TraineeId");
update "Trainee" set "Id" = "UserId"::UUID;


--get all constraints in schema
SELECT con.*
    FROM pg_catalog.pg_constraint con
        INNER JOIN pg_catalog.pg_class rel ON rel.oid = con.conrelid
        INNER JOIN pg_catalog.pg_namespace nsp ON nsp.oid = connamespace
        WHERE nsp.nspname = 'public';



--ALTER TABLE public."AspNetUsers" 
--  DROP CONSTRAINT "PK_AspNetUsers";

