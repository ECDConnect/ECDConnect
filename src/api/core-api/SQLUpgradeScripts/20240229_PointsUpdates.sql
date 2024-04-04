alter table public."PointsUserSummary" add "DateScored" timestamp null;


alter table public."LeagueType" add "MaxPoints" numeric not null default 0;

INSERT INTO public."LeagueType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "MaxPoints")
VALUES('2eeb48fa-495e-442c-b63c-61d7d17db681', 'League', 'League', '', true, CURRENT_DATE, CURRENT_DATE, '', '39077d0e-e443-4076-aaf2-978dc6805aa0', 3000);

INSERT INTO public."LeagueType"
("Id", "Name", "NormalizedName", "Description", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "MaxPoints")
VALUES('ec39e5bd-b98b-428e-b9da-12feddeb0b72', 'Super League', 'Super League', '', true, CURRENT_DATE, CURRENT_DATE, '', '39077d0e-e443-4076-aaf2-978dc6805aa0', 8000);


DROP TABLE "PointsUser" 