-- missing monthly points
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('e97b271d-8107-4793-9c09-05c295c7eaef'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-chw-missing-monthly-points', 
'Encourage [[CHWFullName]] to register new clients and complete visits in CHW Connect. Reach out to find out if they need support.', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[CHWFirstName]] didn''t earn any points in [[CurrentMonth]]', '[[ContactCHW]]', 'Contact CHW', NULL, NULL, 0, NULL);

-- maternal distress - infant
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('3717f0eb-0b29-46f9-9480-5807af6dcbbf'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-chw-maternal-distress-infant', 
'[[CHWFirstName]]''s client [[CaregiverFullName]] is experiencing maternal distress. Contact [[CHWFirstName]] as soon as possible to make sure [[CaregiverFullName]] receives support.', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[CHWFullName]]''s client had thoughts and plans to harm themselves or commit suicide', '[[ContactCHW]]', 'Contact CHW', NULL, NULL, 0, NULL);
	
-- maternal distress - mother
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('3ebb76df-bba1-4cb6-9d03-5b144335ffe3'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-chw-maternal-distress-mother', 
'[[CHWFirstName]]''s client [[PregnantMomFullName]] is experiencing maternal distress. Contact [[CHWFirstName]] as soon as possible to make sure [[PregnantMomFullName]] receives support.', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[CHWFullName]]''s client had thoughts and plans to harm themselves or commit suicide', '[[ContactCHW]]', 'Contact CHW', NULL, NULL, 0, NULL);


-- bronze status
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('fedde1e1-2c2f-4c6d-8d1a-d8e0fb728ac1'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-clinic-points-bronze-tier-team', 
'Congratulate CHWs in the [[ClinicName]] team & encourage them to keep going!', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[ClinicName]] reached Bronze status in Quarter [[QuarterNr]]!', '[[SeeClinicSummary]]', 'See clinic summary', NULL, NULL, 0, '{"url":"/clinics/view-clinics"}');

-- silver status
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('02ccbd1a-e4f2-4afb-a5f3-01c9f1c51f8f'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-clinic-points-silver-tier-team', 
'Congratulate CHWs in the [[ClinicName]] team & encourage them to keep going!', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[ClinicName]] reached Silver status in Quarter [[QuarterNr]]!', '[[SeeClinicSummary]]', 'See clinic summary', NULL, NULL, 0, '{"url":"/clinics/view-clinics"}');

--  gold status
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('475917a8-b5ba-42af-8716-50a3f888e019'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-clinic-points-gold-tier-team', 
'Congratulate CHWs in the [[ClinicName]] team & encourage them to keep going!', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[ClinicName]] reached Gold status in Quarter [[QuarterNr]]!', '[[SeeClinicSummary]]', 'See clinic summary', NULL, NULL, 0, '{"url":"/clinics/view-clinics"}');


-- missing monthly report
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('393d088e-feb5-4d74-ac06-32536c75c032'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-tl-missing-monthly-report', 
'You haven''t added the [[PreviousMonthName]] report yet! Make sure you submit the report before 7 [[PreviousMonthName]].', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'Remember to submit the report for [[ClinicName]]!', '[[AddMeetingReport]]', 'Add meeting report', NULL, NULL, 0, '{"url":"/team-meetings"}');

--CHW has not completed a visit on CHW Connect in 2 weeks notification 
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('c7504390-f243-45f0-be58-4fefd1d7eae6'::uuid, true, current_date, current_date, NULL, 'push', 'gg-portal-chw-not-completed-visit-in-2-weeks', 
'Contact [[CHWFirstName]] to find out if they need support logging visits on CHW Connect.', '39077d0e-e443-4076-aaf2-978dc6805aa0', 
'[[CHWFirstName]] has not completed a visit in over 2 weeks', '[[ContactCHW]]', 'Contact CHW', NULL, NULL, 0, '');