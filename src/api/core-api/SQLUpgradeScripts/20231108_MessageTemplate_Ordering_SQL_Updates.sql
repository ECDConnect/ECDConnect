-- fix 2 missed/updated item templates
UPDATE public."MessageTemplate"
	SET "Subject"='You have new trainees!',"Message"='Help new trainees to complete the onboarding journey.',"InsertedDate"=NOW(),"UpdatedDate"=NOW(),"CTA"='[[SeeTrainees]]',"TemplateType"='coach-new-trainees',"CTAText"='See trainees',"IsActive"=true
	WHERE "Id"='a1a2ebd5-cd0a-0f25-49b8-7a0ed4071658';

INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor", "Ordering") VALUES
	 (uuid_in(md5(random()::text || clock_timestamp()::text)::cstring),true,NOW(),NOW(),NULL,'hub','startup-support-ending-in-2months','Your start-up support is ending in [[EndMonth]] [[EndYear]]. Make sure you collect enough preschool fees from caregivers to replace this support.','258a15e6-3736-45ea-875c-48d9377de4c8','Start-up support ending in [[EndMonth]]','[[LearnMore]]','Learn more',NULL,null, 28);

--N4 Hub
UPDATE public."MessageTemplate" SET "Ordering"=2 WHERE "Protocol" = 'hub' and "TemplateType" ='three-week-notification';
UPDATE public."MessageTemplate" SET "Ordering"=3 WHERE "Protocol" = 'hub' and "TemplateType" ='unassigned-classes';
UPDATE public."MessageTemplate" SET "Ordering"=4 WHERE "Protocol" = 'hub' and "TemplateType" ='rejected-invitation';
UPDATE public."MessageTemplate" SET "Ordering"=5 WHERE "Protocol" = 'hub' and "TemplateType" ='added-to-programme';
UPDATE public."MessageTemplate" SET "Ordering"=6 WHERE "Protocol" = 'hub' and "TemplateType" ='removed-from-programme';
UPDATE public."MessageTemplate" SET "Ordering"=7 WHERE "Protocol" = 'hub' and "TemplateType" ='demoted-from-principal-faa';
UPDATE public."MessageTemplate" SET "Ordering"=8 WHERE "Protocol" = 'hub' and "TemplateType" ='practitioner-removed-from-programme';
UPDATE public."MessageTemplate" SET "Ordering"=9 WHERE "Protocol" = 'hub' and "TemplateType" ='reassigned-to-new-programme';
UPDATE public."MessageTemplate" SET "Ordering"=11 WHERE "Protocol" = 'hub' and "TemplateType" ='promoted-to-prinicpal-or-faa';
UPDATE public."MessageTemplate" SET "Ordering"=12 WHERE "Protocol" = 'hub' and "TemplateType" ='prinicpal-changed';
UPDATE public."MessageTemplate" SET "Ordering"=13 WHERE "Protocol" = 'hub' and "TemplateType" ='not-linked-to-programme';
UPDATE public."MessageTemplate" SET "Ordering"=14 WHERE "Protocol" = 'hub' and "TemplateType" ='reassigned-to-new-class';
UPDATE public."MessageTemplate" SET "Ordering"=14 WHERE "Protocol" = 'hub' and "TemplateType" ='reassigned-to-new-class-from-old';
UPDATE public."MessageTemplate" SET "Ordering"=17 WHERE "Protocol" = 'hub' and "TemplateType" ='update-preschool-fee';
UPDATE public."MessageTemplate" SET "Ordering"=18 WHERE "Protocol" = 'hub' and "TemplateType" ='submit-weekly-attendance';
UPDATE public."MessageTemplate" SET "Ordering"=19 WHERE "Protocol" = 'hub' and "TemplateType" ='income-statement-not-complete-by-1st';
UPDATE public."MessageTemplate" SET "Ordering"=20 WHERE "Protocol" = 'hub' and "TemplateType" ='child-reg-incomplete';
UPDATE public."MessageTemplate" SET "Ordering"=21 WHERE "Protocol" = 'hub' and "TemplateType" ='child-unassigned-to-class';
UPDATE public."MessageTemplate" SET "Ordering"=22 WHERE "Protocol" = 'hub' and "TemplateType" ='clubleader-role-assigned';
UPDATE public."MessageTemplate" SET "Ordering"=23 WHERE "Protocol" = 'hub' and "TemplateType" ='child-document-flagged';
UPDATE public."MessageTemplate" SET "Ordering"=24 WHERE "Protocol" = 'hub' and "TemplateType" ='progressreports-not-created';
UPDATE public."MessageTemplate" SET "Ordering"=25 WHERE "Protocol" = 'hub' and "TemplateType" ='record-caregiver-meeting';
UPDATE public."MessageTemplate" SET "Ordering"=26 WHERE "Protocol" = 'hub' and "TemplateType" ='submit-daily-attendance';
UPDATE public."MessageTemplate" SET "Ordering"=27 WHERE "Protocol" = 'hub' and "TemplateType" ='user-added-to-club';
UPDATE public."MessageTemplate" SET "Ordering"=29 WHERE "Protocol" = 'hub' and "TemplateType" ='all-progress-reports-completed-fro-class';
UPDATE public."MessageTemplate" SET "Ordering"=30 WHERE "Protocol" = 'hub' and "TemplateType" ='report-deadline-passed';
UPDATE public."MessageTemplate" SET "Ordering"=31 WHERE "Protocol" = 'hub' and "TemplateType" ='principal-all-reports-done';
UPDATE public."MessageTemplate" SET "Ordering"=29 WHERE "Protocol" = 'hub' and "TemplateType" ='all-progress-reports created';
UPDATE public."MessageTemplate" SET "Ordering"=32 WHERE "Protocol" = 'hub' and "TemplateType" ='principal-report-deadline-passed';
UPDATE public."MessageTemplate" SET "Ordering"=33 WHERE "Protocol" = 'hub' and "TemplateType" ='monthly-points-reminder-a';
UPDATE public."MessageTemplate" SET "Ordering"=33 WHERE "Protocol" = 'hub' and "TemplateType" ='monthly-points-reminder-b';
UPDATE public."MessageTemplate" SET "Ordering"=34 WHERE "Protocol" = 'hub' and "TemplateType" ='new-clubleader';
UPDATE public."MessageTemplate" SET "Ordering"=35 WHERE "Protocol" = 'hub' and "TemplateType" ='endofyear-points-earned';
UPDATE public."MessageTemplate" SET "Ordering"=36 WHERE "Protocol" = 'hub' and "TemplateType" ='top-smartstarter-points';
UPDATE public."MessageTemplate" SET "Ordering"=37 WHERE "Protocol" = 'hub' and "TemplateType" ='plan-your-programmes';
UPDATE public."MessageTemplate" SET "Ordering"=15 WHERE "Protocol" = 'hub' and "TemplateType" ='marked-absent';
UPDATE public."MessageTemplate" SET "Ordering"=16 WHERE "Protocol" = 'hub' and "TemplateType" ='marked-onleave';

-- Coach
UPDATE public."MessageTemplate" SET "Ordering"=2 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-visits-overdue';
UPDATE public."MessageTemplate" SET "Ordering"=3 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-remove-trainee';
UPDATE public."MessageTemplate" SET "Ordering"=4 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-two-week-onboarding-warning';
UPDATE public."MessageTemplate" SET "Ordering"=5 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-new-practitioners-linked';
UPDATE public."MessageTemplate" SET "Ordering"=6 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-trainee-ready-smartspace-check';
UPDATE public."MessageTemplate" SET "Ordering"=7 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-visit-requested';
UPDATE public."MessageTemplate" SET "Ordering"=8 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-new-trainees';
UPDATE public."MessageTemplate" SET "Ordering"=9 WHERE "Protocol" = 'hub' and "TemplateType" ='coach-address-updated-schedule-visit';

--Trainee
UPDATE public."MessageTemplate" SET "Ordering"=1 WHERE "Protocol" = 'hub' and "TemplateType" ='start-trainee-journey';
UPDATE public."MessageTemplate" SET "Ordering"=2 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-overdue-tasks';
UPDATE public."MessageTemplate" SET "Ordering"=3 WHERE "Protocol" = 'hub' and "TemplateType" ='two-more-steps-to-complete';
UPDATE public."MessageTemplate" SET "Ordering"=4 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-setup-venue';
UPDATE public."MessageTemplate" SET "Ordering"=5 WHERE "Protocol" = 'hub' and "TemplateType" ='gain-community-support';
UPDATE public."MessageTemplate" SET "Ordering"=6 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-register-children';
UPDATE public."MessageTemplate" SET "Ordering"=7 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-sign-agreement';
UPDATE public."MessageTemplate" SET "Ordering"=8 WHERE "Protocol" = 'hub' and "TemplateType" ='trainee-sign-startup-agreement';


