	INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','unassigned-classes','Assign a practitioner to [[ClassName]] as soon as possible.','258a15e6-3736-45ea-875c-48d9377de4c8','The [[ClassName]] class does not have a practitioner assigned','[[AssignPractitioner]]','Assign practitioner',NULL,NULL,3,'{"url":"/practitioner/profile/playgroups"}');


update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-absent'; 
update "MessageLog" set "Action" = '{"url":"/principal/contact-practitioner"}' where "MessageTemplateType" = 'marked-absent';

update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-onleave'; 
update "MessageLog" set "Action" = '{"url":"/principal/contact-practitioner"}' where "MessageTemplateType"  = 'marked-onleave'; 

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where "TemplateType"  = 'coach-visit-requested'; 
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType"  = 'coach-visit-requested'; 

update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'fillin-self-asessment-form'; 
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType" = 'fillin-self-asessment-form';

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "TemplateType"  = 'practitioner-removed-from-programme';
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "MessageTemplateType" = 'practitioner-removed-from-programme';

update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "TemplateType"  = 'unassigned-classes';
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/playgroups"}' where "MessageTemplateType" = 'unassigned-classes';

update "MessageLog" set "Action" = '{"url":"/coach/practitioners"}' where "MessageTemplateType" = 'coach-visits-overdue';
update "MessageLog" set "Action" = '{"url":"/practitioner/programme-information"}' where "MessageTemplateType" = 'promoted-to-prinicpal-or-faa';

update "MessageTemplate" set "Action" = '{"url":"/community/club"}' where "TemplateType" = 'new-clubleader';
update "MessageLog" set "Action" = '{"url":"/community/club"}' where "MessageTemplateType" = 'new-clubleader';

