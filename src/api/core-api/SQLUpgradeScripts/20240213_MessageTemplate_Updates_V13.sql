UPDATE public."MessageLog"
	SET "Action"='{"url":"/coach/practioner-remove","state":{"practitionerId":"[[PractitionerUserId]]"}}'
	WHERE "MessageTemplateType"  in ('coach-remove-trainee');