update "MessageTemplate"
set "Subject"='New practitioners were assigned to you on [[ApplicationName]]!', 
"Message" = 'Encourage all practitioners to register for [[ApplicationName]]. Once they sign up, you will have better information and tools to support them',
"CTA" = '[[See Practitioners]]',
"CTAText" = 'See Practitioners',
"NotificationColor" = 'blue'
where "TemplateType" = 'coach-new-practitioners-linked';

ALTER TABLE public."Practitioner" add COLUMN "CoachLinkDate" timestamp null;