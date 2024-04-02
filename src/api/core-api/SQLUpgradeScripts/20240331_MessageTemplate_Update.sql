
UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/infant-profile/[[infantId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-child-muac-malnutrution');

UPDATE public."MessageTemplate"	SET "CTA"='[[SeeReferralsChildMuacM]]' WHERE "TemplateType" in ('gg-child-muac-malnutrution');
