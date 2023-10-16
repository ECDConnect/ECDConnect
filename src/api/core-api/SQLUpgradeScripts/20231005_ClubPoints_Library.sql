CREATE TABLE public."ClubPointsLibrary" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL DEFAULT true,
	"InsertedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedDate" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"Type" text NOT NULL,
	"Activity" text NOT NULL,
	"Description" text NOT NULL,
	"Points" numeric NULL,
	"MaxPointsYearly" numeric NULL DEFAULT 0,
	"CalculatedAtMonthEnd" bool NOT NULL DEFAULT false,
	"CalculatedAtYearEnd" bool NOT NULL DEFAULT false,
	CONSTRAINT "PK_ClubPointsLibrary" PRIMARY KEY ("Id")
);

INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('2a23b5c4-e151-4049-ad3d-33fbc856b470', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'League', 'Meet regularly', '', 0, 800, true, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('4ca73a67-ab7e-4456-b371-460e7040ed12', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'League', 'Be creative', '', 100, 800, true, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('68e4f277-c1ce-497f-918f-bead7011a2c1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'League', 'Host family days', '', 100, 300, false, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('db7b2d49-65af-400d-9e6f-9d2aaf02af39', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'League', 'Leave no one behind', '', 0, 100, false, true);


INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('9dfcc784-26f7-4421-be5a-19090afa2045', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Meet regularly', '', 0, 800, true, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('f7e872a4-229a-4554-8243-5ba0e9d89241', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Capture child attendance', '', 0, 800, true, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('aa402bc7-cd1c-41c6-8bd6-3eb96a1154ed', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Complete child progress reports', '', 0, 100, false, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('5b41408e-6cc2-485a-ac79-ec5957ab8ad1', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Host family days', '', 100, 300, false, false);
INSERT INTO public."ClubPointsLibrary"
("Id", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "Type", "Activity", "Description", "Points", "MaxPointsYearly", "CalculatedAtMonthEnd", "CalculatedAtYearEnd")
VALUES('d72ea432-546a-479e-89d1-92f1d21d210b', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '', '258a15e6-3736-45ea-875c-48d9377de4c8', 'Purple', 'Leave no one behind', '', 100, 100, false, true);



CREATE TABLE public."ClubPoints" (
	"Id" uuid NOT NULL,
	"IsActive" bool NOT NULL,
	"InsertedDate" timestamp NOT NULL,
	"UpdatedDate" timestamp NOT NULL,
	"UpdatedBy" text NULL,
	"TenantId" uuid NULL,
	"UserId" text NOT NULL,
	"ClubId" uuid NOT NULL,
	"ClubPointsLibraryId" uuid NOT NULL,
	"Month" numeric NOT NULL,
	"Year" numeric NOT NULL,
	"Points" numeric NULL,
	"PointsYTD" numeric NULL,
	"Comment" text NULL,
	CONSTRAINT "PK_ClubPoints" PRIMARY KEY ("Id")
);


-- public."ClubPoints" foreign keys

ALTER TABLE public."ClubPoints" ADD CONSTRAINT "PK_ClubPoints_ClubPointsLibraryId" FOREIGN KEY ("ClubPointsLibraryId") REFERENCES public."ClubPointsLibrary"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClubPoints" ADD CONSTRAINT "PK_ClubPoints_UserId" FOREIGN KEY ("UserId") REFERENCES public."AspNetUsers"("Id") ON DELETE RESTRICT;
ALTER TABLE public."ClubPoints" ADD CONSTRAINT "PK_ClubPoints_ClubId" FOREIGN KEY ("ClubId") REFERENCES public."Club"("Id") ON DELETE RESTRICT;