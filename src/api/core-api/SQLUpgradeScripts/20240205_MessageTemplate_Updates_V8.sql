update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-absent'; 
update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'marked-onleave'; 
update "MessageTemplate" set "Action" = '{"url":"/practitioner/profile/edit"}' where "TemplateType"  = 'coach-visit-requested'; 
update "MessageTemplate" set "Action" = '{"url":"/principal/contact-practitioner"}' where "TemplateType"  = 'fillin-self-asessment-form'; 
update "MessageLog" set "Action" = '{"url":"/practitioner/profile/edit"}' where "MessageTemplateType" = 'fillin-self-asessment-form';
