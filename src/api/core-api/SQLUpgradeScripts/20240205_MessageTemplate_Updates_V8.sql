	INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','unassigned-classes','Assign a practitioner to [[ClassName]] as soon as possible.','258a15e6-3736-45ea-875c-48d9377de4c8','The [[ClassName]] class does not have a practitioner assigned','[[AssignPractitioner]]','Assign practitioner',NULL,NULL,3,'{"url":"/practitioner/profile/playgroups"}');


update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-absent'; 
update "MessageLog" set "Action" = '{"url":"/principal/contact-practitioner"}' where "MessageTemplateType" = 'marked-absent';

update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-onleave'; 
update "MessageLog" set "Action" = '{"url":"/principal/contact-practitioner"}' where "MessageTemplateType"  = 'marked-onleave'; 

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where "TemplateType"  = 'coach-visit-requested'; 
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType"  = 'coach-visit-requested'; 

update "MessageTemplate" set "Action" = '{"url":"/principal/setup-profile"}' where "TemplateType"  = 'fillin-self-asessment-form'; 
update "MessageLog" set "Action" = '{"url":"/principal/setup-profile"}' where "MessageTemplateType" = 'fillin-self-asessment-form';

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "TemplateType"  = 'practitioner-removed-from-programme';
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "MessageTemplateType" = 'practitioner-removed-from-programme';

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "TemplateType"  = 'unassigned-classes';
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "MessageTemplateType" = 'unassigned-classes';

update "MessageLog" set "Action" = '{"url":"/coach/practitioners"}' where "MessageTemplateType" = 'coach-visits-overdue';
update "MessageLog" set "Action" = '{"url":"/practitioner/programme-information"}' where "MessageTemplateType" = 'promoted-to-prinicpal-or-faa';

update "MessageTemplate" set "Action" = '{"url":"/community/club"}' where "TemplateType" = 'new-clubleader';
update "MessageLog" set "Action" = '{"url":"/community/club"}' where "MessageTemplateType" = 'new-clubleader';

update "MessageLog" set "Action" = 'coach-visit-requested' where "MessageTemplateType" = 'coach-visit-requested';

update "MessageTemplate" set "Action" = '{"url":"/trainee/trainee-onboarding"}' where "TemplateType"  = 'trainee-overdue-tasks'; 
update "MessageLog" set "Action" = '{"url":"/trainee/trainee-onboarding"}' where "MessageTemplateType" = 'trainee-overdue-tasks';

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','coach-new-trainees','Help new trainees to complete the onboarding journey.','258a15e6-3736-45ea-875c-48d9377de4c8','You have new trainees!','[[SeeTrainees]]','See trainees',NULL,'blue',8,'{"url":"/coach/coach-trainee-onboarding"}');
	
update "MessageTemplate" set "Action" = '{"url":"/coach/coach-trainee-onboarding"}' where "TemplateType"  = 'coach-new-trainees'; 
update "MessageLog" set "Action" = '{"url":"/coach/coach-trainee-onboarding"}' where "MessageTemplateType" = 'coach-new-trainees';	

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where "TemplateType"  = 'coach-fillin-self-asessment-form'; 
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType" = 'coach-fillin-self-asessment-form';


INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','principal-changed',' Accept the consent agreement to continue.','258a15e6-3736-45ea-875c-48d9377de4c8','[[ProgrammeName]] has a new [[PrincipalOrFAA]]','[[AcceptAgreement]]','Accept agreement',NULL,NULL,12,NULL);
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','principal-changed',' Accept the consent agreement to continue.','258a15e6-3736-45ea-875c-48d9377de4c8','[[ProgrammeName]] has a new [[PrincipalOrFAA]]','[[AcceptAgreement]]','Accept agreement',NULL,NULL,12,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','submit-daily-attendance','You have not submitted your attendance register for today. Submit attendance registers daily to [[IsStipendReceiverText]] get SmartStart points.','258a15e6-3736-45ea-875c-48d9377de4c8','Attendance register incomplete for today','[[SeeRegister]]','See register',NULL,NULL,26,NULL);

	 	update "MessageTemplate" set "Action" = '{"url":"/practitioner/capture-child-attendance"}' where "TemplateType"  = 'submit-daily-attendance'; 
	update "MessageLog" set "Action" = '{"url":"/practitioner/capture-child-attendance"}' where "MessageTemplateType" = 'submit-daily-attendance';	

		update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where "TemplateType"  = 'coach-visit-requested'; 
	update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType" = 'coach-visit-requested';	


UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/child-profile","state":{"childId":"{{ChildUserId}}"}}'
	WHERE "TemplateType"  = 'child-reg-incomplete';
update "MessageLog" set "Action"='{"url":"/child-profile","state":{"childId":"{{ChildUserId}}"}}' where "MessageTemplateType" = 'child-reg-incomplete';	