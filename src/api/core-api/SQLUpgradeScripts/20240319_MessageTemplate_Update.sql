INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor") 
VALUES
 	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','gg-referral-danger-signs-mother','[[FirstName]] is experiencing these danger signs: [[DangerSignsList]]','39077d0e-e443-4076-aaf2-978dc6805aa0','Refer [[FirstName]] urgently: danger signs','[[SeeReferralsDangerSigns]]','See referrals',NULL,'red');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor")
VALUES
	  (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'push','gg-referral-danger-signs-mother','[[FirstName]] is experiencing these danger signs: [[DangerSignsList]]','39077d0e-e443-4076-aaf2-978dc6805aa0','Refer [[FirstName]] urgently: danger signs','[[SeeReferralsDangerSigns]]','See referrals',NULL,'red');

UPDATE public."MessageTemplate" SET "TemplateType"='gg-referral-danger-signs-infant' WHERE "TemplateType" = 'gg-referral-danger-signs';
UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsDangerSigns]]'	WHERE "TemplateType" in ('gg-referral-danger-signs-infant');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/mom-profile/[[motherId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-referral-danger-signs-mother');

UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-referral-danger-signs-infant');

