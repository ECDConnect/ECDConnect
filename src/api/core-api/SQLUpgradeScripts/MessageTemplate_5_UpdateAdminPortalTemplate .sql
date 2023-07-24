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


---- Forgot Password Portal
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := '[[ApplicationName]]: Forgot Password';   
message "MessageTemplate"."Message"%TYPE := E'Hi [[FirstName]],\r\n\r\nWe received a request to reset your password. Go to this link to reset your password: <a href="[[PasswordResetLink:shorturl]]">Reset Password</a>\r\n\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%TYPE := 'forgot-password-portal';


BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;
