delete from "MessageLog" where "MessageTemplateType" = 'fillin-self-asessment-form' and "MessageProtocol" = 'hub';
delete from "MessageTemplate" where "TemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "Protocol"  = 'hub';

update "MessageLog" set "Action" = '{"url":"/practitioner/profile}' where  "MessageTemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "MessageProtocol"  = 'push';
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile}' where  "TemplateType"  in ('fillin-self-asessment-form', 'coach-fillin-self-asessment-form') and "Protocol"  = 'push';