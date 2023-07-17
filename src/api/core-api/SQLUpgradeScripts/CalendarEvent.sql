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

insert into "ContentType" 
select 25, 'CalendarEventType', 'Calendar event types', null, true, '0001-01-01', '0001-01-01', null, '258a15e6-3736-45ea-875c-48d9377de4c8';

select last_value from "ContentType_Id_seq"

select max("Id") from "ContentTypeField"
insert into "ContentTypeField"

select * from "ContentTypeField" ctf where "ContentTypeId" = 6
 
