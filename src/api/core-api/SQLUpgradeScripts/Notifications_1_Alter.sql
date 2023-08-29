
update "SystemSetting" set "Value" = 30 where "Name" = 'ChildExpiryTime' and "Grouping" = 'General.Children';
ALTER TABLE public."MessageTemplate" ADD "CTA" text NULL;
ALTER TABLE public."MessageTemplate" ADD "CTAText" text NULL;
ALTER TABLE public."MessageTemplate" ADD "TypeCode" numeric NULL;
ALTER TABLE public."MessageLog" ADD "MessageDate" timestamp NULL;
ALTER TABLE public."MessageLog" ADD "MessageEndDate" timestamp NULL;
ALTER TABLE public."MessageLog" ADD "Status" text NULL;


INSERT INTO public."MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode") VALUES
	 ('2d01b080-c6ed-4bab-92bc-8530478a6294',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','start-trainee-journey','Sign your franchisee & start-up support agreements, start registering children, and make sure your venue meets the SmartSpace standards.','258a15e6-3736-45ea-875c-48d9377de4c8','Start your trainee journey!','[[StartJourney]]','Get started',NULL),
	 ('56f9473d-7eed-400a-a38b-52a97e691793',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','added-to-programme','Edit your profile to accept or disagree.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been added to test','[[EditProfile]]','Edit profile',NULL),
	 ('94323c18-54d9-4f9a-934c-ea4d0d133b04',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','demoted-from-principal-faa','If you have any questions, contact your coach.','258a15e6-3736-45ea-875c-48d9377de4c8','You were removed as [[PrincipalOrFAA]] of [[ProgrammeName]]','[[ContactCoach]]','Contact coach',NULL),
	 ('a3402ac2-5153-4564-ad97-0a5f051db9c9',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','promoted-to-prinicpal-or-faa','Go to your profile to manage practitioners & classes.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been given the [[PrincipalOrFAA]] role for [[ProgrammeName]]','[[ViewProgramme]]','View programme',NULL),
	 ('840dcfa4-a07f-40d6-bf61-28ac67cc8bdb',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','reassigned-to-new-class-from-old','You were assigned to [[ClassName]] and removed from [[OldClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL),
	 ('7d60de9d-87a3-4b3a-8b9e-4bed14f1b196',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','reassigned-to-new-class','You were assigned to [[ClassName]]. Reach out to [[PrincipalName]] if you have any questions or view your new class.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been assigned to a new class: [[ClassName]]','[[SeeNewClass]]','See new class',NULL),
	 ('c8d0b039-9408-2e27-e0de-6e3b78e3f4a5',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','three-week-notification','You havent been online for more than 3 weeks. Turn on your wifi or data in the next week or you might lose some of your information!','258a15e6-3736-45ea-875c-48d9377de4c8','Go online again to keep using Funda App!','[[GoOnline]]','Go Online',NULL),
	 ('9ed9e83e-d3ad-8dff-2c7d-fb1770faa174',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','trainee-overdue-tasks','You have overdue onboarding tasks. Tasks were due by [[DueDate]]. If you do not complete these tasks, your coach will be asked to remove you from the programme.','258a15e6-3736-45ea-875c-48d9377de4c8','Onboarding tasks overdue','[[SeeOnboardingTasks]]','See onboarding tasks',NULL),
	 ('01d50d59-dc7b-7825-8210-5d34373acf26',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','two-more-steps-to-complete','Finish just 2 more steps to become a SmartStarter.','258a15e6-3736-45ea-875c-48d9377de4c8','Only 2 more onboarding steps to complete!','','Keep going',NULL),
	 ('760f1024-c28a-fb43-a3f7-c615348a2cb0',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','unassigned-classes','Assign a practitioner to [[ClassName]] as soon as possible.','258a15e6-3736-45ea-875c-48d9377de4c8','The [[ClassName]] class does not have a practitioner assigned','[[AssignPractitioner]]','Assign practitioner',NULL),
	 ('c4cd9001-9cea-ffd7-46b5-e40dd484bfff',true,'2023-03-20 00:00:00.000','2023-03-20 00:00:00.000',NULL,'hub','rejected-invitation','Please discuss this with [[PractitionerName]] or remove them from your programme. If this is not resolved by [[RemovalDate]], [[PractitionerName]] will be removed.','258a15e6-3736-45ea-875c-48d9377de4c8','[[PractitionerName]] says they are not a practitioner at [[ProgrammeName]].','[[RemovePractitioner]]','Remove practitioner',NULL),
	 ('d305c627-de4f-dd48-95a0-3f4f8c0041f8',true,'2023-08-29 21:03:16.261','2023-08-29 21:03:16.261',NULL,'hub','removed-from-programme',' If you believe this has been done by mistake, please reach out to [[PrincipalName]]. If this is not a mistake, please update your profile.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been removed from [[ProgrammeName]]','[[UpdateProfile]]','Update your profile',NULL),
	 ('ba9f4e81-78d1-b6b0-212f-f91f2193566a',true,'2023-08-29 21:11:02.235','2023-08-29 21:11:02.235',NULL,'hub','prinicpal-changed',' Accept the consent agreement to continue.','258a15e6-3736-45ea-875c-48d9377de4c8','[[ProgrammeName]] has a new [[PrincipalOrFAA]]','[[AcceptAgreement]]','Accept agreement',NULL);



UPDATE public."MessageTemplate"
	SET "TypeCode"=0
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'sms';
UPDATE public."MessageTemplate"
	SET "TypeCode"=12
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'email';
UPDATE public."MessageTemplate"
	SET "TypeCode"=12
	where "TemplateType" = 'admin-portal-invitation' and "Protocol" = 'sms';

