update "MessageTemplate" mt 
set "Message" = 'Hello, we received a request to reset your [[ApplicationName]] password. 

Your username is: [[Username]]

Reset your password: [[PasswordResetLink:shorturl]]'
where mt."TemplateType" = 'forgot-password'
and mt."Protocol" = 'sms';