-- 1. Delete existing templates
-- 3. Add new message templates for email and sms 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. and 2.
create or replace procedure delete_then_insert(text, text, text) AS $proc$
DECLARE 
 templateType ALIAS FOR $1;
 subject ALIAS FOR $2;
 message ALIAS FOR $3;
BEGIN
    delete from "MessageTemplate" where "TemplateType" = templateType;
	
	insert into "MessageTemplate" ("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "Subject", "TenantId")
	values
	(uuid_generate_v4(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'email', templateType, message, subject, null),
	(uuid_generate_v4(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'sms', templateType, message, subject, null);
end $proc$ language plpgsql;


---- Invitations
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := 'Welcome to [[ApplicationName]]';   
message "MessageTemplate"."Message"%TYPE := E'Hello [[FirstName]]!\r\n\r\nYou have been added to the [[ApplicationName]] admin portal.\r\n\r\nPlease tap the link below to register:\r\n[[InvitationLink:shorturl]]\r\n\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%TYPE := 'admin-portal-invitation';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

