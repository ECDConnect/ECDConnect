update "MessageTemplate" set "Action" = '{"url":"/classroom/preschool-fee"}' where "TemplateType"  = 'update-preschool-fee'; 
update "MessageTemplate" set "Action" = '{"url":"/business"}' where "TemplateType"  = 'income-statement-not-complete-by-1st'; 
update "MessageTemplate" set "Action" = '{"url":"/principal/practitioner-list"}' where "TemplateType"  = 'marked-onleave';

UPDATE public."MessageTemplate"
	SET "NotificationColor"='green', 
	"Action" = '{"url":"/coach/trainee-remove"}'
	WHERE "TemplateType"='trainee-two-week-onboarding-warning';

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','trainee-two-week-onboarding-warning','If [[TraineeFirstName]] has not completed onboarding within 2 weeks. If they are no longer active, please remove them.','258a15e6-3736-45ea-875c-48d9377de4c8','[[TraineeFirstName]] has not completed on boarding','[[SeeTrainee]]','See trainee',NULL,'green',4,'{"url":"/coach/trainee-remove"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','coach-remove-trainee','[[TraineeName]] did not complete trainee onboarding within 4 weeks.','258a15e6-3736-45ea-875c-48d9377de4c8','Remove [[TraineeName]]','[[RemoveTrainee]]','Remove trainee',NULL,'red',3,'{"url":"/coach/trainee-remove"}');
UPDATE public."MessageTemplate"
	SET "NotificationColor"='red'
	WHERE "TemplateType"='coach-remove-trainee';

	INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','update-preschool-fee','Confirm the amount you will be charging for [[CurrentYear]].','258a15e6-3736-45ea-875c-48d9377de4c8','Update the monthly caregiver fee for [[CurrentYear]]','[[UpdateFee]]','Update Fee',NULL,NULL,17,'{"url":"/classroom/preschool-fee"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','submit-weekly-attendance','Submit all of your registers for this week to [[IsStipendReceiverText]] get SmartStart points. More and more SmartStarters are submitting their attendance registers every week – join them and submit yours!','258a15e6-3736-45ea-875c-48d9377de4c8','Remember to submit this week’s attendance registers','[[SeeRegister]]','See register',NULL,NULL,18,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
(uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','promoted-to-prinicpal-or-faa','Go to your profile to manage practitioners & classes.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been given the [[PrincipalOrFAA]] role for [[ProgrammeName]]','[[ViewProgramme]]','View programme',NULL,NULL,11,'{"url":"/practitioner/programme-information"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'hub','coach-fillin-self-asessment-form','Encourage [[PractitionerFirstName]] to complete the self-assessment form before your {{VisitType]] visit.','258a15e6-3736-45ea-875c-48d9377de4c8','Contact [[PractitionerFirstName]] about the self-assessment form','[[ContactSmartStarter]]','Contact SmartStarter',NULL,'red',0,NULL),
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','coach-fillin-self-asessment-form','Encourage [[PractitionerFirstName]] to complete the self-assessment form before your {{VisitType]] visit.','258a15e6-3736-45ea-875c-48d9377de4c8','Contact [[PractitionerFirstName]] about the self-assessment form','[[ContactSmartStarter]]','Contact SmartStarter',NULL,'red',0,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','coach-visits-overdue','Complete these visits as soon as possible.','258a15e6-3736-45ea-875c-48d9377de4c8','You have overdue visits!','[[SeeSmartStarters]]','See SmartStarters',NULL,NULL,2,'{"url":"/coach/practitioners"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','fillin-self-asessment-form','Finish the self-assessment form by [[DueDate]], before your coach vists for your First PQA.','258a15e6-3736-45ea-875c-48d9377de4c8','Complete your self-assessment form','[[EditForm]]','Edit form',NULL,'amber',0,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','coach-visit-requested','[[PractitionerFirstName]] may need some additional support from you. Schedule a visit or a call as soon as possible.','258a15e6-3736-45ea-875c-48d9377de4c8','[[PractitionerFirstName]] requested a visit','[[ScheduleVisit]]','Schedule visit',NULL,'green',7,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','coach-trainee-ready-smartspace-check','[[TraineeFirstName]] has completed all of the trainee steps and is ready for your visit.','258a15e6-3736-45ea-875c-48d9377de4c8','[[TraineeFirstName]] is ready for a SmartSpace visit!','[[SeeTrainee]]','See Trainee',NULL,'green',6,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'hub','principal-report-deadline-passed','You can see a summary of what [[PractitionerFirstName]] is working on with each child.','258a15e6-3736-45ea-875c-48d9377de4c8','See [[PractitionerFirstName]]s progress summary!','[[GetSummary]]','Get summary',NULL,NULL,32,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','removed-from-programme',' If you believe this has been done by mistake, please reach out to [[PrincipalName]]. If this is not a mistake, please update your profile.','258a15e6-3736-45ea-875c-48d9377de4c8','You have been removed from [[ProgrammeName]]','[[UpdateProfile]]','Update your profile',NULL,'red',6,'{"url":"/practitioner/profile/edit"}');

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'hub','rejected-invitation','Please discuss this with [[PractitionerName]] or remove them from your programme. If this is not resolved by [[RemovalDate]], [[PractitionerName]] will be removed.','258a15e6-3736-45ea-875c-48d9377de4c8','[[PractitionerName]] says they are not a practitioner at [[ProgrammeName]].','[[RemovePractitioner]]','Remove practitioner',NULL,NULL,4,NULL);

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTAText","CTA","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(), NOW(),NULL,'push','new-clubleader','[[ClubLeaderName]] is the new club leader, assigned by your coach.','258a15e6-3736-45ea-875c-48d9377de4c8','New [[ClubName]] club leader','See club members','[[SeeClubMembers]]',NULL,NULL,34,'{"url":"/community/club"}');
