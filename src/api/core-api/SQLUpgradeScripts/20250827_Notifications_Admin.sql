
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Action") VALUES
	 ('15ed5113-a24d-4d38-bad6-ed30e13cb697',true,'2023-08-29 21:54:59.710','2023-08-29 21:54:59.710',NULL,'portal','notify-admin-on-practitioner-removed','[[PractitionerName]] was removed from [[AppName]] on [[Date]]. Reason: [[Reason]]','258a15e6-3736-45ea-875c-48d9377de4c8','[[CoachName]] removed [[PractitionerName]] from the app','[[SeePractitioner]]','See practitioner',NULL,'red', '{"url":"/users/practitioners"}');
	
INSERT INTO public."MessageTemplate"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Protocol", "TemplateType", "Message", "TenantId", "Subject", "CTAText", "CTA", "TypeCode", "NotificationColor", "Ordering", "Action")
VALUES('710aa070-a6a1-4b3a-be08-ef9bb74792fa'::uuid, true, '2023-08-29 21:54:59.710', '2023-08-29 21:54:59.710', NULL, 'portal', 'notify-admin-on-practitioner-removed', '[[PractitionerName]] was removed from [[AppName]] on [[Date]]. Reason: [[Reason]]', 'e8f571eb-1972-4e71-a20f-347c65d059bb'::uuid, '[[CoachName]] removed [[PractitionerName]] from the app', 'See practitioner', '[[SeePractitioner]]', NULL, 'red', 0, '{"url":"/users/practitioners"}');

update "MessageTemplate" set "Message" = '
<ul>
<li>Submitted by: [[UserFullName]]</li>
<li>Username/login: [[Username]]</li>
<li>Date submitted: [[DateSubmitted]]</li>
<br>
<li>Submitted about: [[CoachFullName]]</li>
<li>Coach username/login: [[CoachUserName]]</li>
</ul>
<br>
<b>Feedback</b><br>
<ul>
<li>Type of feedback: [[FeedbackList]]</li>
<li>Details: [[Details]]</li>
<li>How do you feel about your coach support?: [[Feelings]]</li>
</ul>' 
WHERE "TemplateType" = 'notify-admin-on-coach-feedback';

update "MessageTemplate" set "CTA" = null,"CTAText" = null, "NotificationColor" = 'amber'
WHERE "TemplateType" = 'notify-admin-on-coach-feedback';

update "MessageTemplate" set "Subject" = '[[UserFullName]] submitted feedback about their coach'
WHERE "TemplateType" = 'notify-admin-on-coach-feedback';

update "MessageTemplate" set "Message" = '<br>
A new form submission has been received from the [[ApplicationName]] help form.
<br>
Details:
<ul>
<li>User full name: [[AffectedUserFullName]]</li>
<li>Contact: [[HelpContactDetail]]</li>
<li>Help category: [[HelpSubject]]</li>
<li>Description: [[HelpDescription]]</li>
<li>Was the user logged in? [[HelpLoginStatus]]</li>
</ul>
'
where "TemplateType" = 'admin-user-help-form' and "Protocol" = 'portal';
