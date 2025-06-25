
-- insert sms templates for GrowGreat

-- whats a uuid? For modern PostgreSQL versions (9.1 and newer) that's easy
-- https://stackoverflow.com/questions/12505158/generating-a-uuid-in-postgres-for-insert-statement
-- enables: uuid_generate_v4
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into 
"MessageTemplate" ("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject")
values 
	(uuid_generate_v4(), true, now(), now(), null, 'sms', 'two-week-notification', 
	'You haven''t gone online on [[ApplicationName]] in 2 weeks! Log in and go online to keep using the app: [[LoginLink:shorturl]]', 
	null, '[[ApplicationName]]: Three week Reminder');