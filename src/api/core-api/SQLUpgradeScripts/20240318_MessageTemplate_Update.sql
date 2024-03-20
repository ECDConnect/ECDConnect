UPDATE public."MessageTemplate"
	SET "Action"='{"url":"/clients/mom-profile/[[motherId]]","state":{"activeTabIndex":"2"}}'
	WHERE "TemplateType" in ('gg-redalert-maternal-distress');

UPDATE public."MessageTemplate"
	SET "CTA"='[[SeeReferralsRedAlert]]'
	WHERE "TemplateType" in ('gg-redalert-maternal-distress');
