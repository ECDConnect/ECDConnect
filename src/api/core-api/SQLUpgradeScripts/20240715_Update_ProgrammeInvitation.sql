update "MessageTemplate" set "Message" = 'You have been added to a programme on [[ApplicationName]]. Update your profile now: [[LoginLink:shorturl]]' 
where "TemplateType"='ProgrammeInvitation' and "Protocol"='sms';

update "MessageTemplate" 
set "Message" = 'Edit your profile to accept or disagree.',
"Subject" = 'You have been added to [[ProgrammeName]]',
"Action" = '{"url":"/practitioner/classroom"}'
where "TemplateType"='ProgrammeInvitation' and "Protocol" != 'sms';

