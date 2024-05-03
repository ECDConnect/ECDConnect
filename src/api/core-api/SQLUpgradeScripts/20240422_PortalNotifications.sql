INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('cea6088d-4bf4-486a-a570-f8fdc4ac8210', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'duplicate-mother-added', 
	'A new pregnant client with the name [[ClientFullName]] and cellphone number [[ClientPhoneNumber]] was recently added by [[CHWFullName]] from [[CHWClinicName]], [[CHWSubDistrictName]]. There is already a client with the same name and cellphone number, added by [[DuplicateCHWFullName]] from [[DuplicateCHWClinicName]], [[DuplicateCHWSubDistrictName]] on [[DateAdded]]. Contact [[CHWFullName]] to confirm if this is a duplicate client.', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'Duplicate client alert: [[ClientFullName]]', 
	'[[Contact [[CHWFullName]]]]', 'Contact [[CHWFullName]]', null, 'red', 0, '{"url":"/users/health-care-worker", "state":{"healthCareWorkerId":"[[HealthCareWorkerId]]"}}');


INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('5b0f397f-7dd4-448c-a8b8-dfcfbdb09213', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'duplicate-child-added', 
	'A new child client with the name [[ChildFirstName]], caregiver named [[CaregiverFullName]] and cellphone number [[ClientPhoneNumber]] was recently added by [[CHWFullName]] from [[CHWClinicName]], [[CHWSubDistrictName]]. There is already a client with the same name, caregiver and cellphone number, added by [[DuplicateCHWFullName]] from [[DuplicateCHWClinicName]], [[DuplicateCHWSubDistrictName]] on [[DateAdded]]. Contact [[CHWFullName]] to confirm if this is a duplicate client.', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'Duplicate client alert: [[ChildFirstName]] & [[CaregiverFullName]]', 
	'[[Contact [[CHWFullName]]]]', 'Contact [[CHWFullName]]', null, 'red', 0, '{"url":"/users/health-care-worker", "state":{"healthCareWorkerId":"[[HealthCareWorkerId]]"}}');
		

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('c4c01106-782f-4403-b6d3-bb21582f47df', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'next-month-meeting-topic-not-added', 
	'Add a Team Lead meeting topic as soon as possible and before 8 [[NextMonthAndYear]]', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'You haven''t added a topic for [[NextMonthAndYear]]', 
	'[[Add a topic]]', 'Add a topic', null, 'red', 0, '{"url":"/team-meetings"}');
		

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('cba85d1a-cbbc-4c2b-8e45-9cf4c4743687', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'health-care-worker-opted-out', 
	'See the list of CHWs who have opted out of GGC according to the [[MonthAndYear]] TL meeting reports submitted. You can contact or remove CHWs who have opted out.', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'[[NumberOptedOut]] CHWs opted out in [[MonthAndYear]]', 
	'[[See CHWs]]', 'See CHWs', null, 'amber', 0, '{"url":"/team-meetings"}');
	

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('44258daa-7994-497b-9518-0c6bba7988be', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'clinic-missing-team-lead', 
	'Assign a Team Lead to [[ClinicName]] as soon as possible.', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'[[ClinicName]] has no Team Lead assigned', 
	'[[Assign team lead]]', 'Assign Team Lead', null, 'red', 0, '{"url":"/clinics/view-clinics", "state":{"clinicId":"[[ClinicId]]"}}');


INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('2be5e219-ae95-4dc8-81c5-94ede0715f05', true, CURRENT_DATE, CURRENT_DATE, '', 'portal', 
	'no-meeting-report-submitted-for-clinic', 
	'The meeting report was not submitted for [[MonthAndYear]]. Check in with the Team Lead(s) assigned to the clinic. Team Lead(s) assigned to [[ClinicName]] clinic: [[TeamLeadNames]].', 
	'39077d0e-e443-4076-aaf2-978dc6805aa0', 
	'No Team Lead meeting report submitted for [[ClinicName]]', 
	'[[Contact [[TeamLeadName]]]]', 'Contact [[TeamLeadName]]', null, 'amber', 0, '{"url":"/clinics/view-clinics", "state":{"clinicId":"[[ClinicId]]"}}');


ALTER TABLE public."MessageLog" ADD "GroupingId" uuid NULL;


CREATE TABLE public."MessageLogRelatedTo" (
    "MessageLogId" uuid NOT null,    
    "RelatedEntityId" uuid NOT null,   
    "EntityType" text NULL,
    CONSTRAINT "PK_MessageLogRelatedTo" PRIMARY KEY ("MessageLogId", "RelatedEntityId")
);
ALTER TABLE public."MessageLogRelatedTo" ADD CONSTRAINT "FK_MessageLogRelatedTo_MessageLogId" FOREIGN KEY ("MessageLogId") REFERENCES "MessageLog"("Id");





