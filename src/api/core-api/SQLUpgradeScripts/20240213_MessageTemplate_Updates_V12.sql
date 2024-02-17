update "MessageLog" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "MessageTemplateType"  in ('coach-trainee-ready-smartspace-check');
update "MessageTemplate" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "TemplateType"  in ('coach-trainee-ready-smartspace-check') ;

update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "MessageTemplateType"  in ('principal-changed');
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "TemplateType"  in ('principal-changed') ;

update "MessageLog" set "Action" =  replace("Action",'/principal/practitioner-profile', '/principal/remove-practitioner-from-programme') where  "MessageTemplateType"  in ('rejected-invitation');
update "MessageTemplate" set "Action" = '{"url":"/principal/remove-practitioner-from-programme","state":{"practitionerId":"[[PractitionerUserId]]"}}' where  "TemplateType"  in ('rejected-invitation') ;

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','plan-your-programmes','More and more practitioners are planning their programmes on Funda App. Join them!','258a15e6-3736-45ea-875c-48d9377de4c8','Plan your daily routine on Funda App!','[[PlanProgrammes]]','Plan your programmes',NULL,NULL,37,'{"url":"/practitioner/programmes"}');

update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner", "state":{"practitionerId":"[[PractitionerUserId]]"}}' where  "TemplateType"  in ('marked-onleave') ;

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','child-unassigned-to-class','[[ChildsName]] is not assigned to a class.','258a15e6-3736-45ea-875c-48d9377de4c8','Assign [[ChildsName]] to a class','[[AddChildToClass]]','Add to a class',NULL,NULL,21,'{"url":"/child-profile","state":{"childId":[[ChildUserId]]}}');

	UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/child-profile","state":{"childId":[[ChildUserId]]}}'
	WHERE "TemplateType" = 'child-unassigned-to-class';

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','reassigned-to-new-class','You were assigned to [[ClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL,NULL,14,NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','reassigned-to-new-class-from-old','You were assigned to [[ClassName]] and removed from [[OldClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL,NULL,14,NULL);


	 UPDATE public."MessageLog"
	SET "Action"='{"url":"/classroom","state":{"activeTabIndex:":"1"}}'
	WHERE "MessageTemplateType"  in ('reassigned-to-new-class', 'reassigned-to-new-class-from-old');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/classroom","state":{"activeTabIndex:":"1"}}'
	WHERE "TemplateType" in ('reassigned-to-new-class', 'reassigned-to-new-class-from-old');