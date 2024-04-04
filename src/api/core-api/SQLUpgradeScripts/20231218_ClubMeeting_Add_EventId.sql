ALTER TABLE public."ClubMeeting" ADD "EventId" uuid NULL;
ALTER TABLE public."ClubMeeting" ADD CONSTRAINT "FK_ClubMeeting_EventId" FOREIGN KEY ("EventId") REFERENCES "CalendarEvent"("Id") ON DELETE CASCADE;
