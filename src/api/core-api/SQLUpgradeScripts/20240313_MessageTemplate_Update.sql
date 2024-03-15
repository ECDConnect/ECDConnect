INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor") 
VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','gg-walkthrough-notification-mother','Lets get started! Ill show you how to use the home visits section.','39077d0e-e443-4076-aaf2-978dc6805aa0','How to complete home visits in CHW connect','[[SeeWalkthrough]]','See walkthrough',NULL,'blue');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor")
VALUES
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','gg-walkthrough-notification-mother','Lets get started! Ill show you how to use the home visits section.','39077d0e-e443-4076-aaf2-978dc6805aa0','How to complete home visits in CHW connect','[[SeeWalkthrough]]','See walkthrough',NULL,'blue');

UPDATE public."MessageTemplate" SET "TemplateType"='gg-walkthrough-notification-infant' WHERE "TemplateType" = 'gg-walkthrough-notification';

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/mom-profile/[[motherId]]","state":{"activeTabIndex":"0","displayHelp":"true"}}'
	WHERE "TemplateType" in ('gg-walkthrough-notification-mother');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"0","displayHelp":"true"}}'
	WHERE "TemplateType" in ('gg-walkthrough-notification-infant');

