update "MessageTemplate" set "IsActive"=false where "TemplateType" = 'removed-from-programme' and "Protocol" = 'sms';

update "MessageTemplate" set "IsActive"=false where "TemplateType" = 'promoted-to-prinicpal-or-faa' and "Protocol" = 'sms';
update "MessageTemplate" set "Subject" = 'You have been given the principal role for [[ProgrammeName]]', "CTAText"= 'See preschool' where "TemplateType" = 'promoted-to-prinicpal-or-faa' and "Protocol" = 'hub';
update "MessageTemplate" set "Subject" = 'You have been given the principal role for [[ProgrammeName]]', "CTAText"= 'See preschool' where "TemplateType" = 'promoted-to-prinicpal-or-faa' and "Protocol" = 'push';

update "MessageTemplate" set "Message" = 'A practitioner you added to your preschool on [[ApplicationName]] says they do not work at your preschool. Log in to see your practitioners: [[LoginLink:shorturl]]', "Action"='{"url":"/business"}' where "TemplateType" = 'rejected-invitation' and "Protocol" = 'sms';
update "MessageTemplate" set "Subject"='[[PractitionerName]] removed from [[ProgrammeName]]', "Message" = '[[PractitionerName]] confirmed they don''t work at [[ProgrammeName]]. They''ve been removed. If you think this is wrong, talk to [[PractitionerName]] or re-invite.', "CTAText"='See practitioners', "Action"='{"url":"/business"}' where "TemplateType" = 'rejected-invitation' and "Protocol" in ('hub','push') ;

update "MessageTemplate" set "Message" = 'You haven''t gone online on [[ApplicationName]] in 4 weeks! Log in and go online to keep using the app: [[LoginLink:shorturl]]' where "TemplateType" = 'four-week-notification' and "Protocol" = 'sms';
update "MessageTemplate" set "Message" = 'You haven''t gone online on [[ApplicationName]] in 3 weeks! Log in and go online to keep using the app: [[LoginLink:shorturl]]' where "TemplateType" = 'three-week-notification' and "Protocol" = 'sms';


INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", 
"Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('d7fffd4d-24cb-47c9-8f67-e5be19ecd7ae'::uuid, true, current_date, current_date, NULL, 'hub', 'practitioner-joined-with-preschool-code', 
'[[PractitionerFirstName]] used the preschool code to join [[PreschoolName]]. Update what [[PractitionerFirstName]] can do on the app.', NULL, '[[PractitionerFirstName]] joined [[PreschoolName]]!', '[[SeePractitioners]]', 'See practitioners', NULL, 'green', 0, '{"url":"/business"}');
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", 
"Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('128a63cf-5e7a-425d-a678-7d22d26b9274'::uuid, true, current_date, current_date, NULL, 'push', 'practitioner-joined-with-preschool-code', 
'[[PractitionerFirstName]] used the preschool code to join [[PreschoolName]]. Update what [[PractitionerFirstName]] can do on the app.', NULL, '[[PractitionerFirstName]] joined [[PreschoolName]]!', '[[SeePractitioners]]', 'See practitioners', NULL, 'green', 0, '{"url":"/business"}');


update "MessageTemplate" set "Message"= 'Assign a practitioner to [[ClassName]] as soon as possible to make sure that attendance is tracked for the class.', "NotificationColor"='red' where "TemplateType" = 'unassigned-classes';

update "MessageTemplate" set "IsActive" = false where "TemplateType" = 'marked-onleave' and "Protocol" = 'hub';

update "MessageTemplate" set "Subject" = '[[ChildsName]]''s registration incomplete', "Message" = 'If you do not complete [[ChildsName]]''s registration form, [[ChildsName]]''s profile will be removed on [[RemovalDate]].' where "TemplateType" = 'child-reg-incomplete';

update "MessageTemplate" set "Message" = 'More and more practitioners are saving their attendance registers on [[ApplicationName]] – join them and save yours!', "Subject" = 'Save your attendance registers!', "CTAText"='See registers', "Action"= '{"url":"/classroom","state":{"activeTabIndex":"1"}}', "NotificationColor"='amber' where "TemplateType" = 'submit-weekly-attendance';

INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", 
"Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('51d994cb-c5c7-462d-a1f8-b44bd8bf5c5a'::uuid, true, current_date, current_date, NULL, 'push', 'statements-60-days-notification', 
'Did you know you can track your income and expenses in the app?', NULL, 'Track your income & expenses', '[[StartNow]]', 'Start now', NULL, 'blue', 0, '{"url":"/business","state":{"activeTabIndex":"1"}}');
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", 
"Message", "TenantId", "Subject", "CTA", "CTAText", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('4546269c-8e67-4756-b59f-e5e0ddb92d30'::uuid, true, current_date, current_date, NULL, 'hub', 'statements-60-days-notification', 
'Did you know you can track your income and expenses in the app?', NULL, 'Track your income & expenses', '[[StartNow]]', 'Start now', NULL, 'blue', 0, '{"url":"/business","state":{"activeTabIndex":"1"}}');
