/*ALTER TABLE public."ClubMeeting" ADD "ContentValueId" int4 NULL;
ALTER TABLE public."ClubMeeting" ADD "MeetingTypeId" uuid NULL;
ALTER TABLE public."ClubMeeting" ADD "MeetingNotes" text NULL;
ALTER TABLE public."ClubMeeting" ADD CONSTRAINT "FK_ClubMeeting_ContentValueId" FOREIGN KEY ("ContentValueId") REFERENCES "ContentValue"("Id");
ALTER TABLE public."ClubMeeting" ADD CONSTRAINT "FK_ClubMeeting_MeetingTypeId" FOREIGN KEY ("MeetingTypeId") REFERENCES "MeetingType"("Id") ON DELETE CASCADE;*/
