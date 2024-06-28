create table public."FeedbackType" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Name" text NOT NULL,
	"NormalizedName" text NOT NULL,
	"Ordering" int4,
	CONSTRAINT "PK_FeedbackType" PRIMARY KEY ("Id")
);

INSERT INTO "FeedbackType"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Quality of site visits', 'QUALITYOFSITEVISITS', 1);
INSERT INTO "FeedbackType"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Support and guidance', 'SUPPORTANDGUIDANCE', 2);
INSERT INTO "FeedbackType"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Communication', 'COMMUNICATION', 3);
INSERT INTO "FeedbackType"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Other', 'OTHER', 4);

create table public."SupportRating" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Name" text NOT NULL,
	"NormalizedName" text NOT NULL,
	"ImageName" text null,
	"Ordering" int4,
	CONSTRAINT "PK_SupportRating" PRIMARY KEY ("Id")
);
INSERT INTO "SupportRating"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName",	"ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Very happy', 'VERY HAPPY', '', 1);
INSERT INTO "SupportRating"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName",	"ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Happy', 'HAPPY', '', 2);
INSERT INTO "SupportRating"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName",	"ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Neutral', 'NEUTRAL', '', 3);
INSERT INTO "SupportRating"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName",	"ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Unhappy', 'UNHAPPY', '', 4);
INSERT INTO "SupportRating"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "NormalizedName",	"ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Very unhappy', 'VERYUNHAPPY', '', 5);

create table public."CommunitySkill" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Name" text NULL,
	"Description" text NULL,
	"ImageName" text NULL,
	"Ordering" int4,
	CONSTRAINT "PK_CommunitySkill" PRIMARY KEY ("Id")
);

INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Training and education', 'I can offer guidance on courses and training opportunities', 'AcademicCapIcon', 1);
INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Classroom activities', 'I have lots of ideas for things to do in the classroom', 'PuzzleIcon', 2);
INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Child assessment', 'I can help with assessing child progress & sharing ideas with caregivers', 'PresentationChartBarIcon', 3);
INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Business development', 'I can give advice on growing your preschool', 'ChartBarIcon', 4);
INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'Business record-keeping', 'I can give advice on records and policies every preschool needs', 'DocumentDuplicateIcon', 5);
INSERT INTO "CommunitySkill"("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Name", "Description", "ImageName", "Ordering") 
VALUES (uuid_generate_v4(), true, current_date, current_date, '', 'e8f571eb-1972-4e71-a20f-347c65d059bb', 'General', 'I have other, general ECD knowledge to share', 'LightBulbIcon', 6);

create table public."CoachFeedback" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"FromUserId" uuid NOT NULL,
	"ToUserId" uuid NOT NULL,
	"FeedbackTypeId" uuid NULL, 
	"FeedbackDetails" text NULL,
	"SupportRatingId" uuid NULL,
	CONSTRAINT "PK_CoachFeedback" PRIMARY KEY ("Id")
);
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "FK_CoachFeedback_SupportRatingId" FOREIGN KEY ("SupportRatingId") REFERENCES "SupportRating"("Id") ON DELETE RESTRICT;
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "FK_CoachFeedback_FeedbackTypeId" FOREIGN KEY ("FeedbackTypeId") REFERENCES "FeedbackType"("Id") ON DELETE RESTRICT;
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "FK_CoachFeedback_FromUserId" FOREIGN KEY ("FromUserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "FK_CoachFeedback_ToUserId" FOREIGN KEY ("ToUserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;

create table public."CommunityProfile" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"FromUserId" uuid NOT NULL,
	"ToUserId" uuid NOT NULL,	
	"AboutShort" text NULL,
	"AboutLong" text NULL,
	"ShareEmail" bool NOT NULL default false,
	"SharePhoneNumber" bool NOT NULL default false,
	"ShareProfilePhoto" bool NOT NULL default false,
	"ShareProvince" bool NOT NULL default false,
	"ShareRole" bool NOT NULL default false,	
	"ProvinceId" uuid NULL,	
	"InviteAccepted" bool NULL,
	"ClickedECDHeros" bool NOT NULL default false,
	CONSTRAINT "PK_CommunityProfile" PRIMARY KEY ("Id")
);
ALTER TABLE "CommunityProfile" ADD CONSTRAINT "FK_CommunityProfile_FromUserId" FOREIGN KEY ("FromUserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "CommunityProfile" ADD CONSTRAINT "FK_CommunityProfile_ToUserId" FOREIGN KEY ("ToUserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "CommunityProfile" ADD CONSTRAINT "FK_CommunityProfile_ProvinceId" FOREIGN KEY ("ProvinceId") REFERENCES "Province"("Id") ON DELETE RESTRICT;


create table public."CommunityProfileSkill" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"CommunitySkillId" uuid NOT NULL,
	"CommunityProfileId" uuid NOT NULL,	
	CONSTRAINT "PK_CommunityProfileSkill" PRIMARY KEY ("Id")
);
ALTER TABLE "CommunityProfileSkill" ADD CONSTRAINT "FK_CommunityProfileSkill_CommunitySkillId" FOREIGN KEY ("CommunitySkillId") REFERENCES "CommunitySkill"("Id") ON DELETE RESTRICT;
ALTER TABLE "CommunityProfileSkill" ADD CONSTRAINT "FK_CommunityProfileSkill_CommunityProfileId" FOREIGN KEY ("CommunityProfileId") REFERENCES "CommunityProfile"("Id") ON DELETE RESTRICT;

-- notification
INSERT INTO "MessageTemplate" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Protocol","TemplateType","Message","TenantId","Subject","CTA","CTAText","TypeCode","NotificationColor","Ordering","Action") VALUES
	 (uuid_generate_v4(),true,current_date,current_date,NULL,'portal','notify-admin-on-coach-feedback','New coach feedback was logged for [[FirstName]] on [[OrganisationName]]','39077d0e-e443-4076-aaf2-978dc6805aa0','New Coach Feedback logged','[[SeeCoachFeedback]]','See coach feedback',NULL,'blue',0,'');
-- permissions
INSERT INTO "Permission" ("Id","IsActive","InsertedDate","UpdatedDate","UpdatedBy","Name","NormalizedName","Grouping","TenantId") VALUES
	 ('b651d875-dfcb-4bdf-b828-b2ca92661121',true,current_date,current_date, NULL,'view_community','View Community','Community',NULL),
	 ('beaffde1-6696-4f3a-b1ca-6b6c7582bb06',true,current_date,current_date,NULL,'update_community','Update Community','Community',NULL),
	 ('37ea5c42-22b2-4543-9918-c5d6700cb1eb',true,current_date,current_date,NULL,'create_community','Create Community','Community',NULL),
	 ('edb6d910-ead0-4436-b1a1-4865c103897f',true,current_date,current_date,NULL,'delete_community','Delete Community','Community',NULL);

--OA
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', 'b651d875-dfcb-4bdf-b828-b2ca92661121', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('68fb1d29-2b60-4c87-b265-90e824e69bb6', 'edb6d910-ead0-4436-b1a1-4865c103897f', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'b651d875-dfcb-4bdf-b828-b2ca92661121', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('80dcabcc-c417-4aa8-bbc9-5db08f6b4161', 'edb6d910-ead0-4436-b1a1-4865c103897f', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'b651d875-dfcb-4bdf-b828-b2ca92661121', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('829323b4-165b-4fde-b8eb-b74e21c70891', 'edb6d910-ead0-4436-b1a1-4865c103897f', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'b651d875-dfcb-4bdf-b828-b2ca92661121', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('d595accd-2ed6-459d-b0dc-ee2f4a86bdda', 'edb6d910-ead0-4436-b1a1-4865c103897f', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', 'b651d875-dfcb-4bdf-b828-b2ca92661121', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('ff9ec9aa-cadc-4146-9393-e030fccb3f7f', 'edb6d910-ead0-4436-b1a1-4865c103897f', '258a15e6-3736-45ea-875c-48d9377de4c8');

--WL
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'b651d875-dfcb-4bdf-b828-b2ca92661121', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('88c06cd9-5162-4d0b-a3a1-dbfed47f6e75', 'edb6d910-ead0-4436-b1a1-4865c103897f', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('a02d85e8-ef30-4ba4-b319-ed6af4c405d9', 'b651d875-dfcb-4bdf-b828-b2ca92661121', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('a02d85e8-ef30-4ba4-b319-ed6af4c405d9', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('a02d85e8-ef30-4ba4-b319-ed6af4c405d9', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('a02d85e8-ef30-4ba4-b319-ed6af4c405d9', 'edb6d910-ead0-4436-b1a1-4865c103897f', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'b651d875-dfcb-4bdf-b828-b2ca92661121', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4a38da49-481b-40f6-87ce-ca7b25343f3b', 'edb6d910-ead0-4436-b1a1-4865c103897f', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4e9648c7-404a-4303-982d-5540c9e9af87', 'b651d875-dfcb-4bdf-b828-b2ca92661121', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4e9648c7-404a-4303-982d-5540c9e9af87', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4e9648c7-404a-4303-982d-5540c9e9af87', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('4e9648c7-404a-4303-982d-5540c9e9af87', 'edb6d910-ead0-4436-b1a1-4865c103897f', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', 'b651d875-dfcb-4bdf-b828-b2ca92661121', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', 'beaffde1-6696-4f3a-b1ca-6b6c7582bb06', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', '37ea5c42-22b2-4543-9918-c5d6700cb1eb', 'e8f571eb-1972-4e71-a20f-347c65d059bb');
INSERT INTO public."RolePermission" ("RoleId", "PermissionId", "TenantId") VALUES('bb5e9e65-5ba0-432b-b917-a8b85d5d8f77', 'edb6d910-ead0-4436-b1a1-4865c103897f', 'e8f571eb-1972-4e71-a20f-347c65d059bb');

