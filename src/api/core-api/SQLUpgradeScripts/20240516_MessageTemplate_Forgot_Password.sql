update "MessageTemplate" set "Message" = 'Hi [[FirstName]],
We received a request to reset your [[ApplicationName]] password. 
Your username is: [[Username]]
Reset your password: [[PasswordResetLink:shorturl]]'
where "Id" = '31a41666-946a-4aa4-a3d9-6c0bbf40b118';


update "MessageTemplate" set "Subject" = '[[ApplicationName]]: Password changed', "Message" = 'Hi [[FirstName]],
We received a request to reset your [[ApplicationName]] password. 
Your username is: [[Username]]
Reset your password: [[PasswordResetLink:shorturl]]'
where "Id" = '3e120685-bdd3-45c8-abf0-03674de0cb1d';