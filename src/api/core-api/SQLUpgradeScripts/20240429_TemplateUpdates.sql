
	
UPDATE public."MessageTemplate"
SET "Action" = '{"url":"/team-meetings", "state":{"month":"[[Month]]", "year":"[[Year]]"}}}'
WHERE "Id" = 'cba85d1a-cbbc-4c2b-8e45-9cf4c4743687'

	
UPDATE public."MessageTemplate"
SET "Action" = '{"url":"/clinics/view-clinics", "state":{"teamLeadId":"[[TeamLeadId]]"}}'
WHERE "Id" = '2be5e219-ae95-4dc8-81c5-94ede0715f05'
