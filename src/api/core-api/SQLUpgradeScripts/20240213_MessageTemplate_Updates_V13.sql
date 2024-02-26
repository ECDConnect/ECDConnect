UPDATE public."MessageLog"
	SET "Action"='{"url":"/coach/practioner-remove","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "MessageTemplateType"  in ('coach-remove-trainee');

	ALTER TABLE public."MessageLog" ADD "RelatedToUserId" text NULL;

	UPDATE public."MessageTemplate"
	SET "Action"='{"url":"coach/practitioner-profile-info","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "TemplateType" in ('trainee-two-week-onboarding-warning');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','monthly-points-reminder-a','More and more SmartStarters are earning points. See how you can improve this month!','258a15e6-3736-45ea-875c-48d9377de4c8','Less than 2 weeks to earn points!','[[LearnMore]]','Learn more',NULL,NULL,33,'{"url":"/community/points"}'),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','monthly-points-reminder-b','Most SmartStarters in your club have more than [[AveragePoints]] points so far this month. Join them & get more points!','258a15e6-3736-45ea-875c-48d9377de4c8','Less than 2 weeks to earn points!','[[LearnMore]]','Learn more',NULL,NULL,33,'{"url":"/community/points"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','coach-fillin-self-asessment-form','Encourage [[PractitionerFirstName]] to complete the self-assessment form before your {{VisitType]] visit.','258a15e6-3736-45ea-875c-48d9377de4c8','Contact [[PractitionerFirstName]] about the self-assessment form','[[ContactSmartStarter]]','Contact SmartStarter',NULL,'red',0,'{"url":"coach/practitioner-profile-info","state":{"practitionerId":"[[PractitionerUserId]]"}}');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"coach/practitioner-profile-info","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "TemplateType" = 'coach-fillin-self-asessment-form';

	
	UPDATE public."MessageTemplate"
	SET "TypeCode"=4
	where "TemplateType" = 'four-week-notification' and "Protocol" = 'sms';

	UPDATE public."MessageTemplate"
	SET "TypeCode"=3
	where "TemplateType" = 'three-week-notification' and "Protocol" = 'sms';

UPDATE public."MessageTemplate"
	SET "CTA" ='[[PrincipalAgreement]]', "CTAText" = 'Accept Agreement'
	WHERE "TemplateType"  in ('principal-changed');

UPDATE public."MessageLog"
		SET "CTA" ='[[PrincipalAgreement]]', "CTAText" = 'Accept Agreement'
	WHERE "MessageTemplateType"  in ('principal-changed');

		delete from "MessageLog" where "MessageTemplateType" = 'coach-fillin-self-asessment-form' and "MessageProtocol" = 'hub';
	delete from "MessageTemplate" mt where "TemplateType" = 'coach-fillin-self-asessment-form' and "Protocol" = 'hub';