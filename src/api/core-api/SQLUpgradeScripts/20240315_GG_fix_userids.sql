
/*
select c.table_name, c.column_name, c.data_type 
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and c.column_name like '%Infant%Id';
*/

-- Infant
create table "EventRecordBak" as select * from "EventRecord";
create table "VisitBak" as select * from "Visit";
create table "InfantBak" as select * from "Infant";

alter table "EventRecord" drop constraint "FK_EventRecord_InfantId";
alter table "Visit" drop constraint "FK_Visit_InfantId";

delete from "Infant" where "UserId" is null;

select * from "Visit" er join "Infant" i on er."InfantId" = i."Id" 

update "Infant" u set "Id" = (select "Id" from "InfantBak" s where s."UserId" = u."UserId" )

update "EventRecord" u set "InfantId" = (select "UserId" from "Infant" s where s."Id" = u."InfantId");  
update "Visit" u set "InfantId" = (select "UserId" from "Infant" s where s."Id" = u."InfantId");
update "Infant" set "Id" = "UserId";

alter table "EventRecord"  add constraint  "FK_EventRecord_Infant_InfantId" foreign key ("InfantId") references "Infant"("Id") on delete cascade;
alter table "Visit"  add constraint  "FK_Visit_Infant_InfantId" foreign key ("InfantId") references "Infant"("Id") on delete cascade;

create index "IX_Visit_InfantId" on "Visit" using btree("InfantId");
create index "IX_EventRecord_InfantId" on "EventRecord" using btree("InfantId");

drop table "InfantBak";
drop table "EventRecordBak";
drop table "VisitBak";



-- Mother
select c.table_name, c.column_name, c.data_type 
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and (c.column_name like '%MotherId' or c.column_name like '%Mother%Id' );

create table "MotherBak" as select * from "Mother";
create table "EventRecordBak" as select * from "EventRecord";
create table "InfantBak" as select * from "Infant";
create table "VisitBak" as select * from "Visit";

alter table "EventRecord" drop constraint "FK_EventRecord_Mother_MotherId";
alter table "Visit" drop constraint "FK_Visit_Mother_MotherId";
alter table "Infant" drop constraint "FK_Infant_Mother_MotherCaregiverId";

update "EventRecord" u set "MotherId" = (select "UserId" from "Mother" s where s."Id" = u."MotherId");  
update "Visit" u set "MotherId" = (select "UserId" from "Mother" s where s."Id" = u."MotherId");
update "Infant" u set "MotherCaregiverId" = (select "UserId" from "Mother" s where s."Id" = u."MotherCaregiverId");
update "Mother" set "Id" = "UserId";

alter table "EventRecord" add constraint "FK_EventRecord_Mother_MotherId" foreign key ("MotherId") references "Mother"("Id") on delete set null;
alter table "Visit" add constraint "FK_Visit_Mother_MotherId" foreign key ("MotherId") references "Mother"("Id") on delete set null;
alter table "Infant" add constraint "FK_Infant_Mother_MotherCaregiverId" foreign key ("MotherCaregiverId") references "Mother"("Id") on delete set null;

create index "IX_EventRecord_MotherId" on "EventRecord" using btree("MotherId");
create index "IX_Visit_MotherId" on "Visit" using btree("MotherId");
create index "IX_Infant_MotherCaregiverId" on "Infant" using btree("MotherCaregiverId");

drop table "EventRecordBak";
drop table "VisitBak";
drop table "InfantBak";
drop table "MotherBak";



-- HealthCareWorker
select c.table_name, c.column_name, c.data_type 
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and c.column_name like '%HealthCareWorker%Id';

create table "CaregiverBak" as select * from "Caregiver";
create table "MotherBak" as select * from "Mother";
create table "BreastFeedingClubBak" as select * from "BreastFeedingClub";
create table "HealthCareWorkerBak" as select * from "HealthCareWorker";

alter table "Caregiver" drop constraint "FK_Caregiver_HealthCareWorkerId";
alter table "Mother" drop constraint "FK_Mother_HealthCareWorker";
alter table "BreastFeedingClub" drop constraint "FK_BreastFeedingClub_HealthCareWorkerId";

update "Caregiver" u set "HealthCareWorkerId" = (select "UserId" from "HealthCareWorker" s where s."Id" = u."HealthCareWorkerId");
update "Mother" u set "HealthCareWorkerId" = (select "UserId" from "HealthCareWorker" s where s."Id" = u."HealthCareWorkerId");
update "BreastFeedingClub" u set "HealthCareWorkerId" = (select "UserId" from "HealthCareWorker" s where s."Id" = u."HealthCareWorkerId");
update "HealthCareWorker" set "Id" = "UserId";

alter table "Caregiver" add constraint "FK_Caregiver_HealthCareWorker_HealthCareWorkerId" foreign key ("HealthCareWorkerId") references "HealthCareWorker"("Id") on delete set null;
alter table "Mother" add constraint "FK_Mother_HealthCareWorker_HealthCareWorkerId" foreign key ("HealthCareWorkerId") references "HealthCareWorker"("Id") on delete set null;
alter table "BreastFeedingClub" add constraint "FK_BreastFeedingClub_HealthCareWorker_HealthCareWorkerId" foreign key ("HealthCareWorkerId") references "HealthCareWorker"("Id") on delete set null;

create index "IX_Caregiver_HealthCareWorkerId" on "Caregiver" using btree("HealthCareWorkerId");
create index "IX_Mother_HealthCareWorkerId" on "Mother" using btree("HealthCareWorkerId");
create index "IX_BreastFeedingClub_HealthCareWorkerId" on "BreastFeedingClub" using btree("HealthCareWorkerId");

drop table "CaregiverBak";
drop table "MotherBak";
drop table "BreastFeedingClubBak";
drop table "HealthCareWorkerBak";



-- TeamLead
select c.table_name, c.column_name, c.data_type 
from information_schema.tables t
join information_schema.columns c on t.table_schema = c.table_schema and t.table_name = c.table_name 
where t.table_schema = 'public' and t.table_type = 'BASE TABLE' and c.column_name like '%TeamLead%Id';

create table "ClinicTeamLeadBak" as select * from "ClinicTeamLead" ctl ;
create table "TeamLeadBak" as select * from "TeamLead" tl ;
create table "HealthCareWorkerBak" as select * from "HealthCareWorker" hcw ;

alter table "ClinicTeamLead" drop constraint "FK_ClinicTeamLead_TeamLeadId";
alter table "HealthCareWorker" drop constraint "FK_HealthCareWorker_TeamLead_TeamLeadId";

update "ClinicTeamLead" u set "TeamLeadId" = (select "UserId" from "TeamLead" s where s."Id" = u."TeamLeadId");
update "HealthCareWorker" u set "TeamLeadId" = (select "UserId" from "TeamLead" s where s."Id" = u."TeamLeadId");

select tl."UserId"  from "TeamLead" tl group by "UserId" having count(*) > 1;
select * from "TeamLead" tl where tl."UserId" = 'f4fe39ed-b36d-499d-9df5-fcdcc25713f7';
select * from "ClinicTeamLead" ctl where "TeamLeadId" in (select "Id" from "TeamLead" tl where tl."UserId" = 'f4fe39ed-b36d-499d-9df5-fcdcc25713f7');
delete from "TeamLead" where "Id" in ('8ce5779d-fce6-4bac-bdf0-3f2ac4c25f12','8dd7bd5d-347b-4d09-9541-170a2ea43029','186901c5-76b7-4fe3-98b4-64e7585a3789');
update "TeamLead" set "Id" = "UserId";

alter table "ClinicTeamLead" add constraint "FK_ClinicTeamLead_TeamLead_TeamLeadId" foreign key ("TeamLeadId") references "TeamLead"("Id") on delete set null;
ALTER TABLE public."HealthCareWorker" ADD CONSTRAINT "FK_HealthCareWorker_TeamLead_TeamLeadId" FOREIGN KEY ("TeamLeadId") REFERENCES "TeamLead"("Id") ON DELETE SET NULL;

create index "IX_ClinicTeamLead_TeamLeadId" on "ClinicTeamLead" using btree("TeamLeadId");
create index "IX_HealthCareWorker_TeamLeadId" on "HealthCareWorker" using btree("TeamLeadId");

drop table "ClinicTeamLeadBak";
drop table "TeamLeadBak";
