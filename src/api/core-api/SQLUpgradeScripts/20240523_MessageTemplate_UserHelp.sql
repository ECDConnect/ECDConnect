update "MessageTemplate" set "Message" = 'Hello,<br><br>

A new form submission has been received from the [[ApplicationName]] help form.<br><br>

Details:
<ul>
<li>User full name: [[AffectedUserFullName]]</li>
<li>Contact: [[HelpContactDetail]]</li>
<li>Help category: [[HelpCategory]]</li>
<li>Description: [[HelpDescription]]</li>
<li>Was the user logged in? [[HelpLoginStatus]]</li>
</ul>
<br>
Thank you, <br>
[[OrganisationName]]'
where "TemplateType" = 'admin-user-help-form';