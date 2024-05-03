	UPDATE public."MessageTemplate"
	SET "IsActive" = false
	where "TemplateType" = 'gg-refer-home-affairs' and "Protocol" = 'push' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "Ordering" = 12
	where "TemplateType" = 'gg-refer-home-affairs' and "Protocol" = 'hub' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "IsActive" = false
	where "TemplateType" = 'gg-refer-sassa' and "Protocol" = 'push' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "Ordering" = 13
	where "TemplateType" = 'gg-refer-sassa' and "Protocol" = 'hub' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "IsActive" = false
	where "TemplateType" = 'gg-maternal-distress' and "Protocol" = 'push' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "Ordering" = 16
	where "TemplateType" = 'gg-maternal-distress' and "Protocol" = 'hub' and "TenantId"='39077d0e-e443-4076-aaf2-978dc6805aa0';

	UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-refer-sassa', 'gg-refer-home-affairs');

	UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/mom-profile/[[motherId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-maternal-distress');

	UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsHomeAffairs]]'	WHERE "TemplateType" in ('gg-refer-home-affairs');
	UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsSassa]]'	WHERE "TemplateType" in ('gg-refer-sassa');
	UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsMaternalDistress]]'	WHERE "TemplateType" in ('gg-maternal-distress');