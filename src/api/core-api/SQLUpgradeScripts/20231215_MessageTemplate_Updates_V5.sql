ALTER TABLE public."MessageTemplate" ADD "Action" text NULL;
ALTER TABLE public."MessageLog" ADD "Action" text NULL;


update "MessageTemplate" set "Action" = '{"url":"/coach/practitioners"}'  where  "TemplateType" =  'coach-new-practitioners-linked';