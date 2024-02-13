delete from "MessageLog" where "MessageTemplateType" = 'fillin-self-asessment-form' and "MessageProtocol" = 'hub';
delete from "MessageTemplate" where "TemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "Protocol"  = 'hub';

update "MessageLog" set "Action" = '{"url":"/practitioner/profile}' where  "MessageTemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "MessageProtocol"  = 'push';
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile}' where  "TemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "Protocol"  = 'push';

update "MessageLog" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "MessageTemplateType"  in ('coach-new-trainees');
update "MessageTemplate" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "TemplateType"  in ('coach-new-trainees') ;

update "MessageTemplate" set "Action" = '{"url":"/principal/practitioner-profile","state":{"practitionerId":"[[PractitionerUserId]]"}}' where  "TemplateType"  in ('rejected-invitation') ;