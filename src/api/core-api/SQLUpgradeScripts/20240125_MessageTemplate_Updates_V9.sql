INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','record-caregiver-meeting','Meet with caregivers to share progress reports and record your meeting by [[MeetingDate]] to earn club points!','258a15e6-3736-45ea-875c-48d9377de4c8','Record caregiver meeting','[[RecordCaregiverMeeting]]','Record caregiver meeting',NULL,NULL,25,NULL);

update "MessageTemplate" set "Action"='{"url":"/child-profile","state":{"childId":"[[ChildUserId]]"}}' where "TemplateType" = 'child-reg-incomplete';

update "MessageLog" set "Action"='{"url":"/child-profile","state":{"childId":"[[ChildUserId]]"}}' where "MessageTemplateType" = 'child-reg-incomplete' and "Action" is null;

update "MessageTemplate" set "Action"='{"url":"/community/club/[[ClubId]]/points/complete-child-progress-reports"}' where "TemplateType" = 'record-caregiver-meeting';
