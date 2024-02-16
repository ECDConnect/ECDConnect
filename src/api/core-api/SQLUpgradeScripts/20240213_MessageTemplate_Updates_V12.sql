update "MessageLog" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "MessageTemplateType"  in ('coach-trainee-ready-smartspace-check');
update "MessageTemplate" set "Action" = '{"url":"/coach/practitioners","state":{"filter":"New trainee"}}' where  "TemplateType"  in ('coach-trainee-ready-smartspace-check') ;

update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "MessageTemplateType"  in ('principal-changed');
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where  "TemplateType"  in ('principal-changed') ;

update "MessageLog" set "Action" =  replace("Action",'/principal/practitioner-profile', '/principal/remove-practitioner-from-programme') where  "MessageTemplateType"  in ('rejected-invitation');
update "MessageTemplate" set "Action" = '{"url":"/principal/remove-practitioner-from-programme","state":{"practitionerId":"[[PractitionerUserId]]"}}' where  "TemplateType"  in ('rejected-invitation') ;