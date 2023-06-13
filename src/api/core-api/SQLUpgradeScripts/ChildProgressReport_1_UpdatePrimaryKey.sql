ALTER TABLE public."ChildProgressReport" DROP CONSTRAINT "PK_ChildProgressReport";
ALTER TABLE public."ChildProgressReport" ADD CONSTRAINT "PK_ChildProgressReport" PRIMARY KEY ("Id");
ALTER TABLE public."ChildProgressReport" alter COLUMN "ClassroomGroupId" drop not NULL;
