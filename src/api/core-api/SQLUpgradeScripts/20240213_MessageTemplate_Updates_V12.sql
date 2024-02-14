update "MessageLog" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "MessageTemplateType"  in ('coach-trainee-ready-smartspace-check');
update "MessageTemplate" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "TemplateType"  in ('coach-trainee-ready-smartspace-check') ;

update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "MessageTemplateType"  in ('principal-changed');
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "TemplateType"  in ('principal-changed') ;