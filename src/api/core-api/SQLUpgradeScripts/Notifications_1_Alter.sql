
update "SystemSetting" set "Value" = 30 where "Name" = 'ChildExpiryTime' and "Grouping" = 'General.Children';
ALTER TABLE public."MessageTemplate" ADD "CTA" text NULL;
ALTER TABLE public."MessageTemplate" ADD "CTAText" text NULL;
ALTER TABLE public."MessageTemplate" ADD "TypeCode" numeric NULL;
ALTER TABLE public."MessageLog" ADD "MessageDate" timestamp NULL;
ALTER TABLE public."MessageLog" ADD "MessageEndDate" timestamp NULL;
ALTER TABLE public."MessageLog" ADD "Status" text NULL;


INSERT INTO public."MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode") VALUES
('56f9473d-7eed-400a-a38b-52a97e691793',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','added-to-programme','Edit your profile to accept or disagree.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been added to [[ProgrammeName]]','[[EDITPROFILE]]','Edit profile',NULL),
('28289486-ca7d-4468-99fd-297847516eb8',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','invitation-disputed','Please discuss this with [[PractitionerName]] or remove them from your programme. If this is not resolved by [[date]], [[PractitionerName]] will be removed.','258a15e6-3736-45ea-875c-48d9377de4c8','[[PractitionerName]] says they are not a practitioner at [[ProgrammeName]].','[[REMOVEPRACTITIONER]]','Remove practitioner',NULL),
('94323c18-54d9-4f9a-934c-ea4d0d133b04',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','demoted-from-principal-faa','If you have any questions, contact your coach.','258a15e6-3736-45ea-875c-48d9377de4c8','You were removed as [[PrincipalOrFAA]] of [[ProgrammeName]]','[[CONTACTCOACH]]','Contact coach',NULL),
('a3402ac2-5153-4564-ad97-0a5f051db9c9',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','promoted-to-prinicpal-or-faa','Go to your profile to manage practitioners & classes.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been given the [[PrincipalOrFAA]] role for [[ProgrammeName]]','[[ViewProgramme]]','View programme',NULL),
('840dcfa4-a07f-40d6-bf61-28ac67cc8bdb',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','reassigned-to-new-class-from-old','You were assigned to [[ClassName]] and removed from [[OldClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL),
('7d60de9d-87a3-4b3a-8b9e-4bed14f1b196',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','reassigned-to-new-class','You were assigned to [[ClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL);



UPDATE public."MessageTemplate"
	SET "TypeCode"=0
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'sms';
UPDATE public."MessageTemplate"
	SET "TypeCode"=12
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'email';
UPDATE public."MessageTemplate"
	SET "TypeCode"=12
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'sms';

