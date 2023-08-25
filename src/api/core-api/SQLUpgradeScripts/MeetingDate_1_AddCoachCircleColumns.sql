/*ALTER TABLE public."ClubMeeting" ADD "ContentValueId" int4 NULL;
ALTER TABLE public."ClubMeeting" ADD "MeetingType" text NULL;
ALTER TABLE public."ClubMeeting" ADD "MeetingNotes" text NULL;
ALTER TABLE public."ClubMeeting" ADD CONSTRAINT "FK_ClubMeeting_ContentValueId" FOREIGN KEY ("ContentValueId") REFERENCES "ContentValue"("Id");*/
