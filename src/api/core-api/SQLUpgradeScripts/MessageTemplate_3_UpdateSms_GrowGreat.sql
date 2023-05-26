
-- insert sms templates for GrowGreat

-- whats a uuid? For modern PostgreSQL versions (9.1 and newer) that's easy
-- https://stackoverflow.com/questions/12505158/generating-a-uuid-in-postgres-for-insert-statement
-- enables: uuid_generate_v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into 
"MessageTemplate" ("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject")
values 
	(uuid_generate_v4(), true, now(), now(), null, 'sms', 'auth-code', 
	E'[[OTPCode]] is your CHW Connect code.', 
	(select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat'), null),
	
	(uuid_generate_v4(), true, now(), now(), null, 'sms', 'invitation', 
	E'Welcome to CHW Connect, the Grow Great Champions virtual community of practice. Please tap this link to register and learn more: [[InvitationLink:shorturl]]',
	(select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat'), null),
	
	(uuid_generate_v4(), true, now(), now(), null, 'sms', 'three-week-notification',
	E'You haven\'t gone online on CHW Connect in 3 weeks! Log in and go online to keep using the app: [[LoginLink:shorturl]]',
	(select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat'), null),
	
	(uuid_generate_v4(), true, now(), now(), null, 'sms', 'four-week-notification',
	E'You haven\'t gone online on CHW Connect in 4 weeks! You won\'t be able to use the app until you go online: [[LoginLink:shorturl]]',
	(select "Id" from "Tenant" t where t."ApplicationName" = 'GrowGreat'), null)
	;