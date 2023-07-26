/*CREATE TABLE "PointsLibrary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Activity" text NOT NULL,
	"SubActivity" text NOT NULL,
	"Points" numeric NULL,
	"MaxPointsIndividualMonthly" numeric NULL,
	"MaxPointsNonPrincipalMonthly" numeric NULL DEFAULT 0,
	"MaxPointsNonPrincipalYearly" numeric NULL DEFAULT 0,
	"MaxPointsPrincipalMonthly" numeric NULL DEFAULT 0,
	"MaxPointsPrincipalYearly" numeric NULL DEFAULT 0,
	"CalculatedAtMonthEnd" bool NOT NULL DEFAULT false,
	"CalculatedAtYearEnd" bool NOT NULL DEFAULT false,
	"Description" text NULL,
	CONSTRAINT "PK_PointsLibrary" PRIMARY KEY ("Id")
);

CREATE TABLE "PointsUser" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text NOT NULL,
	"PointsLibraryId" uuid NOT NULL,
	"Month" numeric NOT NULL,
	"Year" numeric NOT NULL,
	"Points" numeric NULL,
	"Comment" text NULL,
	CONSTRAINT "PK_PointsUser" PRIMARY KEY ("Id")
);
ALTER TABLE "PointsUser" ADD CONSTRAINT "PK_PointsUser_PointsLibraryId" FOREIGN KEY ("PointsLibraryId") REFERENCES "PointsLibrary"("Id") ON DELETE RESTRICT;
ALTER TABLE "PointsUser" ADD CONSTRAINT "PK_PointsUser_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;


CREATE TABLE "PointsUserSummary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text NOT NULL,
	"PointsLibraryId" uuid NOT NULL,
	"Month" numeric NOT NULL,
	"Year" numeric NOT NULL,
	"PointsTotal" numeric NULL DEFAULT 0,
	"PointsYTD" numeric NULL DEFAULT 0,
	CONSTRAINT "PK_PointsUserSummary" PRIMARY KEY ("Id")
);

ALTER TABLE "PointsUserSummary" ADD CONSTRAINT "PK_PointsUserSummary_PointsLibraryId" FOREIGN KEY ("PointsLibraryId") REFERENCES "PointsLibrary"("Id") ON DELETE RESTRICT;
ALTER TABLE "PointsUserSummary" ADD CONSTRAINT "PK_PointsUserSummary_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;



INSERT INTO public."PointsLibrary" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Activity","SubActivity","Points","MaxPointsIndividualMonthly","MaxPointsNonPrincipalMonthly","MaxPointsNonPrincipalYearly","MaxPointsPrincipalMonthly","MaxPointsPrincipalYearly","CalculatedAtMonthEnd","CalculatedAtYearEnd","Description") VALUES
	 ('13a6e446-d011-407a-aebb-2a398915d6ae',true,'2023-07-07 13:18:51.121639','2023-07-07 13:18:51.121639','','258a15e6-3736-45ea-875c-48d9377de4c8','Child Data Collection','Child Registration Completed',25,NULL,0,0,0,0,false,false,NULL),
	 ('d38885e1-a822-4dd9-af3a-252681b27dbb',true,'2023-07-07 13:19:48.647067','2023-07-07 13:19:48.647067','','258a15e6-3736-45ea-875c-48d9377de4c8','Child Data Collection','Child Registration Removed',30,NULL,0,0,0,0,false,false,NULL),
	 ('f7307227-2ff7-4b85-8851-27c2af79be28',true,'2023-07-07 13:30:20.566294','2023-07-07 13:30:20.566294','','258a15e6-3736-45ea-875c-48d9377de4c8','Submission of income statement','Add/Edit monthly preschool fee',25,NULL,0,0,0,25,false,true,NULL),
	 ('1aea269b-db0b-4cc6-b052-c4eaa5d89b05',true,'2023-07-07 13:31:54.649002','2023-07-07 13:31:54.649002','','258a15e6-3736-45ea-875c-48d9377de4c8','Submission of income statement','Preschool fees added to income statement',25,NULL,0,0,25,300,false,false,NULL),
	 ('aad9c9aa-f76f-466b-bffe-fd9119efac31',true,'2023-07-07 13:23:30.770511','2023-07-07 13:23:30.770511','','258a15e6-3736-45ea-875c-48d9377de4c8','Child Data Collection','Attendance submitted for practitioner''s/principal''s class',0,NULL,100,1200,100,1200,true,false,NULL),
	 ('8021a70d-3267-48aa-8acc-33a22736004d',true,'2023-07-07 13:34:34.985519','2023-07-07 13:34:34.985519','','258a15e6-3736-45ea-875c-48d9377de4c8','Submission of income statement','Monthly income statement submitted by the deadline',25,NULL,0,0,25,300,false,false,NULL),
	 ('091a1ae4-6adc-4ff2-a9f1-209e3013bac6',true,'2023-07-07 13:35:44.048813','2023-07-07 13:35:44.048813','','258a15e6-3736-45ea-875c-48d9377de4c8','Submission of income statement','Submits 3 consecutive months'' income statements.',25,NULL,0,0,0,300,false,false,NULL),
	 ('868743ae-a750-420b-94df-c00945c56367',true,'2023-07-11 10:37:29.504151','2023-07-11 10:37:29.504151','','39077d0e-e443-4076-aaf2-978dc6805aa0','Pregnant Mom Clients','1 referral per month [Screening for maternal distress]',20,20,0,0,0,0,false,false,'If one of the maternal distress referral boxes were checked for at least 1 client (20 points)'),
	 ('05ffdb20-d420-458d-af15-8706ed8c8084',true,'2023-07-11 10:29:32.728446','2023-07-11 10:29:32.728446','','39077d0e-e443-4076-aaf2-978dc6805aa0','Pregnant Mom Clients','Screening for maternal distress ''up to date''',50,50,0,0,0,0,true,false,'If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.'),
	 ('3e4d346d-8190-439f-b000-a54d2b19f852',true,'2023-07-11 10:46:51.10406','2023-07-11 10:46:51.10406','','39077d0e-e443-4076-aaf2-978dc6805aa0','Pregnant Mom Clients','Referral made for maternal malnutrition [Screening for maternal malnutrition]',20,20,0,0,0,0,false,false,'If a referral is made (ie, referral box checked) for MUAC under 22cm for at least 1 client then user earns 20 points.');
INSERT INTO public."PointsLibrary" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Activity","SubActivity","Points","MaxPointsIndividualMonthly","MaxPointsNonPrincipalMonthly","MaxPointsNonPrincipalYearly","MaxPointsPrincipalMonthly","MaxPointsPrincipalYearly","CalculatedAtMonthEnd","CalculatedAtYearEnd","Description") VALUES
	 ('bd5bd8c7-0fda-464c-8f9d-2ed8f51ef69f',true,'2023-07-11 10:48:08.323529','2023-07-11 10:48:08.323529','','39077d0e-e443-4076-aaf2-978dc6805aa0','Pregnant Mom Clients','Screening for substance abuse ''up to date''',50,50,0,0,0,0,true,false,'If no visits overdue or missing for pregnant mom clients by the end of the month, user earns 50 points.'),
	 ('f20f0917-b497-440c-836e-aa54cf2d10f0',true,'2023-07-07 13:42:11.378447','2023-07-07 13:42:11.378447','','39077d0e-e443-4076-aaf2-978dc6805aa0','Client Registration','Complete client registration flow for 2 or more pregnant women',50,50,0,0,0,0,false,false,'Complete client registration flow for 2 or more pregnant women'),
	 ('4d57d1e6-976c-4220-a075-465042c7ddb4',true,'2023-07-11 10:54:08.488677','2023-07-11 10:54:08.488677','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Child support grant - all eligible children accessing the CSG',100,100,0,0,0,0,true,false,'For the subset of children who are eligible for the CSG. If this is true in the current month, user earns 100 points.'),
	 ('5be4e1ac-248c-41d0-9b0a-c4f820a49e83',true,'2023-07-11 10:56:04.506051','2023-07-11 10:56:04.506051','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Love, play and talk for healthy development guide. All children screened',100,100,0,0,0,0,true,false,'No visits requiring a developmental screening (14 week; 6 month; 9 month; 12 month; 18 month tools) are overdue or missing as of the end of the month.'),
	 ('91c0eeda-3acd-463d-90b8-808703d9b5c8',true,'2023-07-11 10:40:44.241199','2023-07-11 10:40:44.241199','','39077d0e-e443-4076-aaf2-978dc6805aa0','Pregnant Mom Clients','Screening for maternal malnutrition',50,50,0,0,0,0,true,false,'If no ''Visit 1''s for pregnant moms are overdue or have been missed by the end of the month, user earns 50 points.'),
	 ('d3999d77-b978-4030-93a5-30def2d114c2',true,'2023-07-11 10:59:02.695896','2023-07-11 10:59:02.695896','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth length - referral not required',10,NULL,0,0,0,0,false,false,'Length measure entered into the linked screen & visit completed and referral is NOT required'),
	 ('1a2fdde9-5644-4977-9acd-58957c9f30ac',true,'2023-07-11 11:00:13.883861','2023-07-11 11:00:13.883861','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth length - referral required',10,NULL,0,0,0,0,false,false,'Referral box checked for: Severely stunted OR Stunted'),
	 ('7ae6cfcb-85a3-4962-af8e-39901dc19848',true,'2023-07-11 10:57:42.085452','2023-07-11 10:57:42.085452','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth length - normal',20,NULL,0,0,0,0,false,false,'Length measure entered into the linked screen & visit completed and length entered does not require a referral'),
	 ('3c2eb500-160d-4a43-a70e-cb4ce1b78ab6',true,'2023-07-11 11:06:03.653482','2023-07-11 11:06:03.653482','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth MUAC - normal',20,NULL,0,0,0,0,false,false,'MUAC measure entered into the linked screen & visit completed and no MUAC referral required'),
	 ('ecbda3f8-9bd6-472d-a4c3-ec0f10c20797',true,'2023-07-11 11:18:17.510007','2023-07-11 11:18:17.510007','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Vitamin A',20,20,0,0,0,0,true,false,'CHW has at least 1 child client and gets points only if all child clients are up to date with Vitamin A.');
INSERT INTO public."PointsLibrary" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Activity","SubActivity","Points","MaxPointsIndividualMonthly","MaxPointsNonPrincipalMonthly","MaxPointsNonPrincipalYearly","MaxPointsPrincipalMonthly","MaxPointsPrincipalYearly","CalculatedAtMonthEnd","CalculatedAtYearEnd","Description") VALUES
	 ('31b8633f-aeac-4970-99cf-e72745c963b7',true,'2023-07-11 11:19:16.213717','2023-07-11 11:19:16.213717','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Deworming',20,20,0,0,0,0,true,false,'CHW has at least 1 child client and gets points only if all child clients are up to date with deworming.'),
	 ('b3be1d39-c4e3-4fbc-bfb4-80099320436c',true,'2023-07-11 11:19:59.870329','2023-07-11 11:19:59.870329','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Immunisations',20,20,0,0,0,0,true,false,'CHW has at least 1 child client and gets points only if all child clients are up to date with immunisations.'),
	 ('92c06990-7428-4a8f-8cfe-e1dfca83fb3e',true,'2023-07-07 13:39:33.158706','2023-07-07 13:39:33.158706','','39077d0e-e443-4076-aaf2-978dc6805aa0','Client Registration','Complete the client registration flow for 5 or more children under the age of 2 years old',100,100,0,0,0,0,false,false,'Complete the client registration flow for 5 or more children under the age of 2 years old.'),
	 ('40b4f8f8-e29c-4490-b0c7-e6b878973512',true,'2023-07-10 15:27:06.59702','2023-07-10 15:27:06.59702','','39077d0e-e443-4076-aaf2-978dc6805aa0','Client Registration','Complete the client registration flow for 1-2 pregnant clients who are less than 20 weeks into pregnancy',50,50,0,0,0,0,false,false,'Complete the client registration flow for 1-2 pregnant clients who are less than 20 weeks into pregnancy'),
	 ('78ed5347-3877-49f2-bf00-a6673df363a3',true,'2023-07-11 11:06:47.404739','2023-07-11 11:06:47.404739','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth MUAC - referral not required',10,NULL,0,0,0,0,false,false,'MUAC measure entered into the linked screen & visit completed and referral is NOT required'),
	 ('1b0c8486-99e5-4670-a162-a4586d4a4c46',true,'2023-07-11 11:08:12.516634','2023-07-11 11:08:12.516634','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth MUAC - referral required',10,NULL,0,0,0,0,false,false,'Referral box checked for one of: - Severe acute malnutrition - Moderate acute malnutrition'),
	 ('f5a72c31-5aa6-4852-9903-c9685420ab4b',true,'2023-07-10 15:27:06.59702','2023-07-10 15:27:06.59702','','39077d0e-e443-4076-aaf2-978dc6805aa0','Client Registration','Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy',200,200,0,0,0,0,false,false,'Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy'),
	 ('6fe4149b-cfb6-4193-be04-c7ad6b091b8b',true,'2023-07-11 11:01:30.93149','2023-07-11 11:01:30.93149','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth weight - normal',20,NULL,0,0,0,0,false,false,'Weight measure entered into the linked screen & visit completed and no weight referrral required & the referral was checked'),
	 ('3075e510-6f2d-43f9-9171-9561a213b935',true,'2023-07-11 11:03:04.776143','2023-07-11 11:03:04.776143','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth weight - referral not required',10,NULL,0,0,0,0,false,false,'Weight measure entered into the linked screen & visit completed and referral is NOT required'),
	 ('67061004-1d22-4f54-9e49-ae87f52e5b6e',true,'2023-07-11 11:04:56.652092','2023-07-11 11:04:56.652092','','39077d0e-e443-4076-aaf2-978dc6805aa0','Child Clients','Measuring childrens'' growth weight - referral required',10,NULL,0,0,0,0,false,false,'A referral is made (ie, referral box checked) for one of: - Severely underweight - Growth faltering: weight has not increased - Underweight - Overweight - Obese');
INSERT INTO public."PointsLibrary" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","TenantId","Activity","SubActivity","Points","MaxPointsIndividualMonthly","MaxPointsNonPrincipalMonthly","MaxPointsNonPrincipalYearly","MaxPointsPrincipalMonthly","MaxPointsPrincipalYearly","CalculatedAtMonthEnd","CalculatedAtYearEnd","Description") VALUES
	 ('4d49baed-8fff-49ad-883f-d60d62a58d16',true,'2023-07-14 11:00:53.799154','2023-07-14 11:00:53.799154','','258a15e6-3736-45ea-875c-48d9377de4c8','Submission of income statement','Practitioner submits 3 consecutive months'' income statements',25,NULL,0,0,0,100,false,false,'');

*/