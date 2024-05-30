INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('357350a6-cb12-49d9-8045-a69c520e1da5', true, current_date, current_date, null, 'manage_children', 'Manage Children', 'Practitioner', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('a929377d-79af-47f0-a65c-b5a81466d033', true, current_date, current_date, null, 'take_attendance', 'Take Attendance', 'Practitioner', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('5307eafe-a165-419e-a09d-9d9988c28676', true, current_date, current_date, null, 'create_progress_reports', 'Create Progress Reports', 'Practitioner', '258a15e6-3736-45ea-875c-48d9377de4c8');
INSERT INTO public."Permission"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "Name", "NormalizedName", "Grouping", "TenantId")
VALUES('c39c1be5-0f4b-43ad-aa9f-f1da524efe84', true, current_date, current_date, null, 'plan_classroom_actitivies', 'Plan Classroom Activities', 'Practitioner', '258a15e6-3736-45ea-875c-48d9377de4c8');



create table public."UserPermission" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" uuid NOT NULL,
	"PermissionId" uuid NOT NULL,
	CONSTRAINT "PK_UserPermission" PRIMARY KEY ("Id")
);

ALTER TABLE "UserPermission" ADD CONSTRAINT "FK_UserPermission_UserId" FOREIGN KEY ("UserId") REFERENCES "AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE "UserPermission" ADD CONSTRAINT "FK_UserPermission_PermissionId" FOREIGN KEY ("PermissionId") REFERENCES "Permission"("Id") ON DELETE RESTRICT;
 