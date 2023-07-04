-- Drop table

drop table public."CalendarEventParticipant";
DROP TABLE public."CalendarEvent";

CREATE TABLE public."CalendarEvent" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"TenantId" uuid NULL,
	"Name" text NULL,
	"EventType" text null,
	"AllDay" bool null,
	"Start" timestamp null,
	"End" timestamp null,
	"Description" text null,
	CONSTRAINT "PK_CalendarEvent" PRIMARY KEY ("Id")
);
CREATE INDEX "IX_CalendarEvent_TenantId_UserId" ON public."CalendarEvent" USING btree ("TenantId","UserId");
ALTER TABLE public."CalendarEvent" ADD CONSTRAINT "FK_CalendarEvent_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;

create table public."CalendarEventParticipant" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"UserId" text NULL,
	"TenantId" uuid NULL,
	"CalendarEventId" uuid not null,
	"ParticipantUserId" text not null,
	CONSTRAINT "PK_CalendarEventParticipant" PRIMARY KEY ("Id")
);

CREATE INDEX "IX_CalendarEventParticipant_TenantId_UserId" ON public."CalendarEventParticipant" USING btree ("TenantId","UserId");
ALTER TABLE public."CalendarEventParticipant" ADD CONSTRAINT "FK_CalendarEventParticipant_CalendarEvent_Id" FOREIGN KEY ("CalendarEventId") REFERENCES public."CalendarEvent"("Id") ON DELETE CASCADE;
ALTER TABLE public."CalendarEventParticipant" ADD CONSTRAINT "FK_CalendarEventParticipant_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE public."CalendarEventParticipant" ADD CONSTRAINT "FK_CalendarEventParticipant_Participant_AspNetUsers_UserId" FOREIGN KEY ("ParticipantUserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;

select * from "ContentType" ct;
insert into "ContentType" 
select 25, 'CalendarEventType', 'Calendar event types', null, true, '0001-01-01', '0001-01-01', null, '258a15e6-3736-45ea-875c-48d9377de4c8';
alter sequence "ContentType_Id_seq" restart with 25;
select * from "ContentType" ct;

select * from "ContentTypeField" ctf order by "Id" desc;
insert into "ContentTypeField" 
select 371, 1, 'name', 1, true, '', 25, '0001-01-01', '0001-01-01', null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentTypeField" 
select 372, 1, 'colour', 6, true, '', 25, '0001-01-01', '0001-01-01', null, '258a15e6-3736-45ea-875c-48d9377de4c8';
alter sequence "ContentTypeField_Id_seq" restart with 372;
select * from "ContentTypeField" ctf order by "Id" desc;

select max("Id") from "Content" c ; -- 753
select max("Id") from "ContentValue" cv; -- 3634
select last_value from "ContentValue_Id_seq";
select * from "ContentValue" cv where "ContentId" in (select "Id" from "Content" c where "ContentTypeId" = 25) order by "ContentId", "ContentTypeFieldId";
-- SmartSpace
insert into "Content" 
select 754, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 754, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'SmartSpace', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 754, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- PQA
insert into "Content" 
select 755, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 755, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'First PQA', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 755, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- PQA follow-up
insert into "Content" 
select 756, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 756, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'PQA follow-up', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 756, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- First site visit
insert into "Content" 
select 757, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 757, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'First site visit', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 757, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- Second site visit
insert into "Content" 
select 758, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 758, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Second site visit', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 758, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- Reaccreditation
insert into "Content" 
select 759, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 759, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'Reaccreditation', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"	
select 759, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
-- General support visit
insert into "Content" 
select 760, 25, true, transaction_timestamp(), transaction_timestamp(), null, '258a15e6-3736-45ea-875c-48d9377de4c8';
insert into "ContentValue"
select 760, '9688cd08-adef-408c-9d34-5d75ae5c44df', 371, 'General support visit', null, null, nextval('public."ContentValue_Id_seq"');
insert into "ContentValue"
select 760, '9688cd08-adef-408c-9d34-5d75ae5c44df', 372, '#66D0EC', null, null, nextval('public."ContentValue_Id_seq"');
;

select * from "ContentValue" cv where "ContentId" in (select "Id" from "Content" c where "ContentTypeId" = 25) order by "ContentId", "ContentTypeFieldId";

select max("Id") from "Content" c ; -- 760
alter sequence "Content_Id_seq" restart with 760;
select max("Id") from "ContentValue" cv; -- 3634
alter sequence "ContentValue_Id_seq" restart with 3175;

alter table "CalendarEvent" add column "Action" text;

update "ContentValue" set "Value"='First PQA' where "ContentId"=755 and "ContentTypeFieldId"=371;