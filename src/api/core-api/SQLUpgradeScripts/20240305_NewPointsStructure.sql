
CREATE TABLE "PointsCategory" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Name" text NOT NULL,	
	CONSTRAINT "PK_PointsCategory" PRIMARY KEY ("Id")
);

CREATE TABLE "PointsActivity" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"PointsCategoryId" uuid null, 
	"Name" text NOT NULL,
	"Points" numeric NULL,
	"MaxPointsIndividualMonthly" numeric NULL,
	"MaxPointsIndividualYearly" numeric NULL,
	CONSTRAINT "PK_PointsActivity" PRIMARY KEY ("Id")
);
ALTER TABLE public."PointsActivity" ADD CONSTRAINT "FK_PointsActivity_PointsCategoryId" FOREIGN KEY ("PointsCategoryId") REFERENCES "PointsCategory"("Id");

-- PROBABLY NEED TO DROP ALL RECORDS FROM POINTS USER SUMMARY
truncate table "PointsUserSummary" ;
ALTER TABLE public."PointsUserSummary" add "PointsActivityId" uuid not null;
ALTER TABLE public."PointsUserSummary" ADD CONSTRAINT "FK_PointsUserSummary_PointsActivityId" FOREIGN KEY ("PointsActivityId") REFERENCES "PointsActivity"("Id");

-- INSERT CATEGORIES
INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('8d6655da-3e2d-4c32-af67-5f6777ffdf0f', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Child folders opened');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('8307b244-2aa7-4dde-9db0-46b0a118fb20', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Pregnant mom folders opened');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('518a0610-fae0-48fc-bf97-5ba7b1c8636d', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Early identification of pregnancy');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('187df06f-0218-4f45-bc33-c04a5f844008', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Maternal distress screening');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('d37dd44d-143a-4a48-91d1-4765a2df8d29', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Maternal malnutrition screening');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('8172390a-83d6-43d5-ac6c-bd350edf71fc', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Alcohol abuse screening');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('e8ad3a50-c9fe-4c02-8fe8-271320886586', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Child support grant');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('2f69d79f-948a-4703-bf08-2ea546323eaf', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Developmental screening');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('9f8d3607-dae2-4e6c-ac40-189435963740', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Growth monitoing - weight');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('db23970c-ee2b-459e-9d54-d090ec5fced1', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Growth monitoring - length');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('fcef8716-4f76-4143-9b2a-f99dbac10e05', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Growth monitoring - MUAC');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('26d07e91-4f7b-409e-b302-bce09dd6d67d', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Immunisations');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('b8c771e3-2283-426f-beb9-c6878b64c33a', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Vitamin A');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('4cd64b45-6cf0-441e-acfe-e7c1525cd843', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Deworming');

INSERT INTO public."PointsCategory"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name")
VALUES('5f8fd37a-d2f5-44bc-9670-0513a47b88e5', true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'Breastfeeding clubs');



-- INSERT ACTIVITIES
-- Child folders
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('92c06990-7428-4a8f-8cfe-e1dfca83fb3e'::uuid, true, '2023-07-07 13:39:33.158', '2023-07-07 13:39:33.158', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '8d6655da-3e2d-4c32-af67-5f6777ffdf0f', 'Child folders opened', 100, null, NULL);


-- Mom folders
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('f20f0917-b497-440c-836e-aa54cf2d10f0'::uuid, true, '2023-07-07 13:42:11.378', '2023-07-07 13:42:11.378', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '8307b244-2aa7-4dde-9db0-46b0a118fb20', 'Pregnant mom folders opened', 50, null, NULL);


-- Early identification
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('f5a72c31-5aa6-4852-9903-c9685420ab4b'::uuid, true, '2023-07-10 15:27:06.597', '2023-07-10 15:27:06.597', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '518a0610-fae0-48fc-bf97-5ba7b1c8636d', 'Pregnant clients booked before 20 weeks', 200, null, NULL);


-- Maternal distress screening
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('05ffdb20-d420-458d-af15-8706ed8c8084'::uuid, true, '2023-07-11 10:29:32.728', '2023-07-11 10:29:32.728', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '187df06f-0218-4f45-bc33-c04a5f844008', 'Pregnant clients with up to date maternal distress screening', 50, null, null);

INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('868743ae-a750-420b-94df-c00945c56367'::uuid, true, '2023-07-11 10:37:29.504', '2023-07-11 10:37:29.504', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '187df06f-0218-4f45-bc33-c04a5f844008', 'Pregnant clients referred for maternal distress', 20, null, null);


-- Malnutrition screening
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('91c0eeda-3acd-463d-90b8-808703d9b5c8'::uuid, true, '2023-07-11 10:40:44.241', '2023-07-11 10:40:44.241', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'd37dd44d-143a-4a48-91d1-4765a2df8d29', 'Pregnant clients screened for malnutrition', 50, null, NULL);

INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('3e4d346d-8190-439f-b000-a54d2b19f852'::uuid, true, '2023-07-11 10:46:51.104', '2023-07-11 10:46:51.104', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'd37dd44d-143a-4a48-91d1-4765a2df8d29', 'Pregnant clients referred for malnutrition', 20, null, NULL);


-- Alcohol abuse
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('bd5bd8c7-0fda-464c-8f9d-2ed8f51ef69f'::uuid, true, '2023-07-11 10:48:08.323', '2023-07-11 10:48:08.323', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '8172390a-83d6-43d5-ac6c-bd350edf71fc', 'Pregnant clients with up to date alcohol abuse screening', 50, null, NULL);


-- Child Support grant
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('4d57d1e6-976c-4220-a075-465042c7ddb4'::uuid, true, '2023-07-11 10:54:08.488', '2023-07-11 10:54:08.488', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'e8ad3a50-c9fe-4c02-8fe8-271320886586', 'Families receiving CSG', 100, null, NULL);


-- Development screening
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('5be4e1ac-248c-41d0-9b0a-c4f820a49e83'::uuid, true, '2023-07-11 10:56:04.506', '2023-07-11 10:56:04.506', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '2f69d79f-948a-4703-bf08-2ea546323eaf', 'Children with up to date developmental screening', 100, null, NULL);


-- Weight measurements
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('3075e510-6f2d-43f9-9171-9561a213b935'::uuid, true, '2023-07-11 11:03:04.776', '2023-07-11 11:03:04.776', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '9f8d3607-dae2-4e6c-ac40-189435963740', 'Children''s weights measured', 20, NULL, NULL);

INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('6fe4149b-cfb6-4193-be04-c7ad6b091b8b'::uuid, true, '2023-07-11 11:01:30.931', '2023-07-11 11:01:30.931', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '9f8d3607-dae2-4e6c-ac40-189435963740', 'Children''s weights measured & action taken', 10, NULL, NULL);


-- length measured
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('1a2fdde9-5644-4977-9acd-58957c9f30ac'::uuid, true, '2023-07-11 11:00:13.883', '2023-07-11 11:00:13.883', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'db23970c-ee2b-459e-9d54-d090ec5fced1', 'Measuring children''s growth length', 20, NULL, NULL);

INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('7ae6cfcb-85a3-4962-af8e-39901dc19848'::uuid, true, '2023-07-11 10:57:42.085', '2023-07-11 10:57:42.085', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'db23970c-ee2b-459e-9d54-d090ec5fced1', 'Measuring children''s growth length & action taken', 10, NULL, NULL);


-- MUAC measured
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('78ed5347-3877-49f2-bf00-a6673df363a3'::uuid, true, '2023-07-11 11:06:47.404', '2023-07-11 11:06:47.404', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'fcef8716-4f76-4143-9b2a-f99dbac10e05', 'Children''s MUACs measured', 20, NULL, NULL);

INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('1b0c8486-99e5-4670-a162-a4586d4a4c46'::uuid, true, '2023-07-11 11:08:12.516', '2023-07-11 11:08:12.516', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'fcef8716-4f76-4143-9b2a-f99dbac10e05', 'Children''s MUACs measured & action taken', 10, NULL, NULL);


-- Vitamin A
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('ecbda3f8-9bd6-472d-a4c3-ec0f10c20797'::uuid, true, '2023-07-11 11:18:17.510', '2023-07-11 11:18:17.510', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, 'b8c771e3-2283-426f-beb9-c6878b64c33a', 'Vitamin A', 20, null, NULL);


-- Deworming
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('31b8633f-aeac-4970-99cf-e72745c963b7'::uuid, true, '2023-07-11 11:19:16.213', '2023-07-11 11:19:16.213', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '4cd64b45-6cf0-441e-acfe-e7c1525cd843', 'Deworming', 20, null, NULL);


-- Immunisation
INSERT INTO public."PointsActivity"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "PointsCategoryId", "Name", "Points", "MaxPointsIndividualMonthly", "MaxPointsIndividualYearly")
VALUES('b3be1d39-c4e3-4fbc-bfb4-80099320436c'::uuid, true, '2023-07-11 11:19:59.870', '2023-07-11 11:19:59.870', '', '39077d0e-e443-4076-aaf2-978dc6805aa0'::uuid, '26d07e91-4f7b-409e-b302-bce09dd6d67d', 'Immunisations', 20, null, NULL);
