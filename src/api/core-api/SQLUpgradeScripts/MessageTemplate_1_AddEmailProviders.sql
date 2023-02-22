-- 1. Add subject column
-- 2. Delete existing templates
-- 3. Add new message templates for email and sms 

-- 1. Add subject column
alter table "MessageTemplate"
add column "Subject" text;

-- 2. and 3.
create or replace procedure delete_then_insert(text, text, text) AS $proc$
DECLARE 
 templateType ALIAS FOR $1;
 subject ALIAS FOR $2;
 message ALIAS FOR $3;
BEGIN
    delete from "MessageTemplate" where "TemplateType" = templateType;
	
	insert into "MessageTemplate" ("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "Subject", "TenantId")
	values
	(gen_random_uuid(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'email', templateType, message, subject, null),
	(gen_random_uuid(), true, CURRENT_DATE, TIMESTAMP '0001-01-01 00:00:00.000', null, 'sms', templateType, message, subject, null);
end $proc$ language plpgsql;


---- Invitations
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := 'Welcome to [[ApplicationName]]';   
message "MessageTemplate"."Message"%TYPE := E'Hello [[FirstName]]!\r\n\r\nYou have been added to the [[ApplicationName]] admin portal.\r\n\r\nPlease tap the link below to register:\r\n[[InvitationLink:shorturl]]\r\n\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%TYPE := 'invitation';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

---- Forgot Password
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := '[[ApplicationName]]: Password changed';   
message "MessageTemplate"."Message"%TYPE := E'Hi [[FirstName]],\r\n\r\nWe received a request to reset your password. Go to this link to reset your password: [[PasswordResetLink:shorturl]]\r\n\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%TYPE := 'forgot-password';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

---- OTP Authentication Code
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := '[[ApplicationName]]: One-time Pin (OTP)';   
message "MessageTemplate"."Message"%TYPE := E'[[OTPCode]] is your [[ApplicationName]] one-time pin code.\r\nFor security reasons, please do not share your OTP Code with anyone.';
templateType "MessageTemplate"."TemplateType"%TYPE := 'auth-code';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

---- Verify new email address
do $$
DECLARE
subject "MessageTemplate"."Subject"%TYPE := '[[ApplicationName]]: Verify new email address';   
message "MessageTemplate"."Message"%TYPE := E'Hi [[FirstName]],\r\n\r\nPlease verify this new email address by clicking this link: [[VerifyEmailAddressLink:shorturl]]\r\n\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%TYPE := 'verify-email-address';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

---- Password Changed by another admin
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: Verify new email address';   
message "MessageTemplate"."Message"%type := E'Hi [[FirstName]],\r\nYour email address on [[ApplicationName]] was changed by [[AdminUserFullName]].\r\nPlease reach out to them if you have any qustions.\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%type := 'email-changed-by-admin';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

------ Admin Password Changed by another admin
--do $$
--DECLARE
--subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: An Administrator''s password has changed.';   
--message "MessageTemplate"."Message"%type := E'Hi [[FirstName]],\r\n[[AffectedUser]]\'s password on [[ApplicationName]] has changed. It was changed by [[ChangingAdminUserName]].\r\nPlease reach out to them if you have any qustions.\r\nThank you!\r\n[[OrganisationName]]';
--templateType "MessageTemplate"."TemplateType"%type := 'superadmin-notify-password-changed';
--
--BEGIN
--	call delete_then_insert(templateType, subject, message);
--END$$ language plpgsql;

---- Admin Password Changed by another admin
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: An Administrator''s email has changed.';   
message "MessageTemplate"."Message"%type := E'Hi [[FirstName]],\r\n[[AffectedUser]]\'s email address on [[ApplicationName]] changed from [[OldUserEmail]] to [[NewUserEmail]]. It was changed by [[ChangingAdminUserName]].\r\nPlease reach out to them if you have any qustions.\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%type := 'superadmin-notify-email-changed';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

---- Attendance Weekly
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: Submit attendance registers and get points.';   
message "MessageTemplate"."Message"%type := E'You have 2 days left to submit attendance registers and get [[ApplicationName]] points!\r\nIf you\'ve already submitted them, go online to see an update. [[LoginLink:shorturl]]';
templateType "MessageTemplate"."TemplateType"%type := 'attendance-weekly';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

-- Three Week Notification
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: Three week Reminder';   
message "MessageTemplate"."Message"%type := E'You haven\'t gone online on [[ApplicationName]] in 3 weeks!\r\nLog in and go online to keep using [[ApplicationName]]: [[LoginLink:shorturl]]';
templateType "MessageTemplate"."TemplateType"%type := 'three-week-notification';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

-- Four Week Notification
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: Four week Reminder';   
message "MessageTemplate"."Message"%type := E'You haven\'t gone online on [[ApplicationName]] in 4 weeks!\r\nYou won''t be able to use the app until you go online: [[LoginLink:shorturl]]';
templateType "MessageTemplate"."TemplateType"%type := 'four-week-notification';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

-- Password changed by admin
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: Password changed by administrator.';   
message "MessageTemplate"."Message"%type := E'Hi [[FirstName]],\r\n\r\nYour password on [[ApplicationName]] was changed by [[AdminUserFullName]]. Please reach out to them if you have any qustions.\r\n\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%type := 'password-changed-by-admin';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

-- Password changed by self
do $$
DECLARE
subject "MessageTemplate"."Subject"%type := '[[ApplicationName]]: You have changed your password.';   
message "MessageTemplate"."Message"%type := E'Hi [[FirstName]],\r\n\r\nYour password on [[ApplicationName]] was changed. Please reach out to the administrator if you have any qustions.\r\n\r\nThank you!\r\n[[OrganisationName]]';
templateType "MessageTemplate"."TemplateType"%type := 'password-changed-by-self';

BEGIN
	call delete_then_insert(templateType, subject, message);
END$$ language plpgsql;

