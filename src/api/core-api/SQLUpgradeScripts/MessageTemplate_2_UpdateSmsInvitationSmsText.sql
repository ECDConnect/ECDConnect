-- update incorrect sms invitation text
update "MessageTemplate" 
set "Subject" = 'Welcome to [[ApplicationName]]',
	"Message" = 'Welcome to [[ApplicationName]] App, the SmartStart online Platform! Please tap this link to register and learn more [[InvitationLink:shorturl]]'
where "TemplateType" = 'invitation' and
		"Protocol" = 'sms'
        
        
        
--select *
--from "MessageTemplate" mt 
--where "TemplateType" = 'invitation' and
--		"Protocol" = 'sms'