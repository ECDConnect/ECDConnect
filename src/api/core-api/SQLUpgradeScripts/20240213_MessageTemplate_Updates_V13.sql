UPDATE public."MessageLog"
	SET "Action"='{"url":"/coach/practioner-remove","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "MessageTemplateType"  in ('coach-remove-trainee');

	ALTER TABLE public."MessageLog" ADD "RelatedToUserId" text NULL;

	UPDATE public."MessageTemplate"
	SET "Action"='{"url":"coach/practitioner-profile-info","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "TemplateType" in ('trainee-two-week-onboarding-warning');