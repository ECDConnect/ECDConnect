
UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-child-growth-issue');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-child-muac');

UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsGrowthIssues]]' WHERE "TemplateType" in ('gg-child-growth-issue');
UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsChildMuac]]' WHERE "TemplateType" in ('gg-child-muac');

--new
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor") 
VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','gg-redalert-maternal-distress-infant','[[ClientFirstName]] has had thoughts and plans to harm themselves or commit suicide. Refer [[ClientFirstName]] immediately and contact your team lead.','39077d0e-e443-4076-aaf2-978dc6805aa0','Refer [[ClientFirstName]] urgently: signs of self-harm','[[SeeReferrals]]','See referrals',NULL,'red')

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor")
VALUES
	  (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','gg-redalert-maternal-distress-infant','[[ClientFirstName]] has had thoughts and plans to harm themselves or commit suicide. Refer [[ClientFirstName]] immediately and contact your team lead.','39077d0e-e443-4076-aaf2-978dc6805aa0','Refer [[ClientFirstName]] urgently: signs of self-harm','[[SeeReferrals]]','See referrals',NULL,'red')

UPDATE public."MessageTemplate" SET "TemplateType"='gg-redalert-maternal-distress-mother' WHERE "TemplateType" = 'gg-redalert-maternal-distress';

UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsRedAlertMother]]' WHERE "TemplateType" in ('gg-redalert-maternal-distress-mother');
UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsRedAlertInfant]]' WHERE "TemplateType" in ('gg-redalert-maternal-distress-infant');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-redalert-maternal-distress-infant');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/community/breastfeeding-clubs/add"}'
	WHERE "TemplateType" in ('gg-breastfeeding-club');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/community/team/points"}'
	WHERE "TemplateType" in ('gg-points-bronze-tier-team');
