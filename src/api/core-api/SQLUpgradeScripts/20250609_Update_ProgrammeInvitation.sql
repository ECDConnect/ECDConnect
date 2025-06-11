update "MessageTemplate" 
set "Action" =  '{"url":"/practitioner/profile/edit"}'
where "TemplateType"='ProgrammeInvitation';

update "MessageTemplate" 
set "Action" = '{"url":"/classroom"}'
where "TemplateType"='multiple-programme-invitation';

update "MessageTemplate" 
set "Action" = '{"url":"/classroom"}'
where "TemplateType"='progressreports-not-created';

update "MessageTemplate" 
set "Action" ='{"url":"/practitioner/profile/edit"}'
where "TemplateType"='not-linked-to-programme';